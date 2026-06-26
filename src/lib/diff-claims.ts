// Claim row shape used by the rescan/lineage logic. Loosely typed —
// we only require `claimHash`, `status`, and (optionally) `expiresAt`.
export interface PublicAuditClaim {
  claimHash: string;
  status?: string;
  expiresAt?: Date | string | null;
  [k: string]: unknown;
}

export interface ClaimDiff {
  unchanged: PublicAuditClaim[];
  added: PublicAuditClaim[];
  removed: PublicAuditClaim[];
  reclassified: PublicAuditClaim[]; // same hash, different status
  expired: PublicAuditClaim[]; // previous claims past their TTL
}

/**
 * Compare two sets of claims using deterministic SHA-256 hashes (claimHash).
 * - `previous` is the last audit's claims
 * - `current` is the freshly extracted claims
 */
export function diffClaims(previous: any[], current: any[]): ClaimDiff {
  const prevByHash = new Map<string, any>(previous.map(c => [c.claimHash, c]));
  const currByHash = new Map<string, any>(current.map(c => [c.claimHash, c]));

  const prevHashes = new Set(prevByHash.keys());
  const currHashes = new Set(currByHash.keys());

  const unchanged: any[] = [];
  const added: any[] = [];
  const reclassified: any[] = [];
  const removed: any[] = [];
  const expired: any[] = [];

  const now = new Date();

  // Process current claims
  for (const [hash, claim] of currByHash) {
    if (prevHashes.has(hash)) {
      const prevClaim = prevByHash.get(hash)!;
      if (prevClaim.status !== claim.status) {
        reclassified.push(claim);
      } else {
        unchanged.push(claim);
      }
    } else {
      added.push(claim);
    }
  }

  // Process previous claims not in current
  for (const [hash, claim] of prevByHash) {
    if (!currHashes.has(hash)) {
      // Expired if TTL has passed
      if (claim.expiresAt && new Date(claim.expiresAt) < now) {
        expired.push(claim);
      } else {
        removed.push(claim);
      }
    }
  }

  return { unchanged, added, removed, reclassified, expired };
}

export interface TrendSummary {
  scoreChange: number;          // positive = improvement
  previousScore: number;
  currentScore: number;
  addedCount: number;
  removedCount: number;
  reclassifiedCount: number;
  expiredCount: number;
  unchangedCount: number;
}

export function summarizeTrend(previousScore: number, currentScore: number, diff: ClaimDiff): TrendSummary {
  return {
    scoreChange: currentScore - previousScore,
    previousScore,
    currentScore,
    addedCount: diff.added.length,
    removedCount: diff.removed.length,
    reclassifiedCount: diff.reclassified.length,
    expiredCount: diff.expired.length,
    unchangedCount: diff.unchanged.length,
  };
}
