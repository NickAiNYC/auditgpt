import { createHash } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type SnapshotStorageStatus =
  | "STORED"
  | "ALREADY_STORED"
  | "CAPTURE_FAILED"
  | "STORAGE_FAILED"
  | "HASH_MISMATCH";

export interface SnapshotStore {
  put(input: {
    digest: string;
    bytes: Uint8Array;
    contentType: string | null;
  }): Promise<{
    location: string;
    byteLength: number;
    status: "STORED" | "ALREADY_STORED";
  }>;

  get(location: string): Promise<Uint8Array>;

  exists(location: string): Promise<boolean>;
}

export function sha256Hex(bytes: Uint8Array | string): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function snapshotPath(digest: string): string {
  return `sha256/${digest.slice(0, 2)}/${digest.slice(2, 4)}/${digest}.html`;
}

export class LocalSnapshotStore implements SnapshotStore {
  constructor(private readonly root = path.join(process.cwd(), "data", "snapshots")) {}

  locationForDigest(digest: string): string {
    return path.join(this.root, snapshotPath(digest));
  }

  async put(input: { digest: string; bytes: Uint8Array; contentType: string | null }) {
    const location = this.locationForDigest(input.digest);
    await mkdir(path.dirname(location), { recursive: true });

    if (await this.exists(location)) {
      const existing = await this.get(location);
      if (sha256Hex(existing) !== input.digest) {
        throw new Error(`Snapshot hash mismatch at ${location}`);
      }
      return { location, byteLength: input.bytes.byteLength, status: "ALREADY_STORED" as const };
    }

    await writeFile(location, input.bytes);
    return { location, byteLength: input.bytes.byteLength, status: "STORED" as const };
  }

  async get(location: string): Promise<Uint8Array> {
    return readFile(location);
  }

  async exists(location: string): Promise<boolean> {
    try {
      await readFile(location);
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
      throw error;
    }
  }
}

export class SupabaseSnapshotStore implements SnapshotStore {
  private readonly baseUrl: string;

  constructor(
    supabaseUrl: string,
    private readonly serviceRoleKey: string,
    private readonly bucket = "claim-snapshots"
  ) {
    this.baseUrl = supabaseUrl.replace(/\/$/, "");
  }

  locationForDigest(digest: string): string {
    return `supabase://${this.bucket}/${snapshotPath(digest)}`;
  }

  private objectPath(location: string): string {
    const prefix = `supabase://${this.bucket}/`;
    if (!location.startsWith(prefix)) {
      throw new Error(`Invalid Supabase snapshot location: ${location}`);
    }
    return location.slice(prefix.length);
  }

  private headers(contentType?: string | null): HeadersInit {
    return {
      Authorization: `Bearer ${this.serviceRoleKey}`,
      apikey: this.serviceRoleKey,
      ...(contentType ? { "Content-Type": contentType } : {}),
    };
  }

  async put(input: { digest: string; bytes: Uint8Array; contentType: string | null }) {
    const location = this.locationForDigest(input.digest);
    const objectPathValue = this.objectPath(location);
    const uploadUrl = `${this.baseUrl}/storage/v1/object/${this.bucket}/${objectPathValue}`;
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        ...this.headers(input.contentType || "text/html; charset=utf-8"),
        "x-upsert": "false",
      },
      // Copy into an exact-size ArrayBuffer: satisfies BodyInit across TS lib
      // versions and avoids sending a larger backing buffer than the bytes.
      body: input.bytes.slice().buffer as ArrayBuffer,
    });

    if (response.ok) {
      return { location, byteLength: input.bytes.byteLength, status: "STORED" as const };
    }

    if (await this.exists(location)) {
      const existing = await this.get(location);
      if (sha256Hex(existing) !== input.digest) {
        throw new Error(`Snapshot hash mismatch at ${location}`);
      }
      return { location, byteLength: input.bytes.byteLength, status: "ALREADY_STORED" as const };
    }

    const body = await response.text().catch(() => "");
    throw new Error(`Supabase snapshot upload failed (${response.status}): ${body.slice(0, 200)}`);
  }

  async get(location: string): Promise<Uint8Array> {
    const objectPathValue = this.objectPath(location);
    const response = await fetch(`${this.baseUrl}/storage/v1/object/${this.bucket}/${objectPathValue}`, {
      headers: this.headers(),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Supabase snapshot download failed (${response.status}): ${body.slice(0, 200)}`);
    }
    return new Uint8Array(await response.arrayBuffer());
  }

  async exists(location: string): Promise<boolean> {
    try {
      await this.get(location);
      return true;
    } catch (error) {
      if (String(error).includes("(404)")) return false;
      throw error;
    }
  }
}

export function createSnapshotStore(): SnapshotStore {
  if (
    process.env.SNAPSHOT_STORE === "supabase" ||
    (process.env.NODE_ENV === "production" && process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase snapshot storage requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    }
    return new SupabaseSnapshotStore(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      process.env.SNAPSHOT_STORAGE_BUCKET || "claim-snapshots"
    );
  }

  return new LocalSnapshotStore(process.env.SNAPSHOT_ARCHIVE_DIR);
}
