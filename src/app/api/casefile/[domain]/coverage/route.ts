import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { domain: string } }
) {
  try {
    const domain = params.domain.toLowerCase().trim();

    // Determine if we have any valid (non-simulated) observations for this domain.
    // The CaseFile bundle excludes SIMULATED_NO_PROVIDER_CALL or guardian-simulation data.
    const observationCount = await db.observation.count({
      where: {
        domain,
        aiSurface: {
          notIn: ["guardian-simulation", "SIMULATED_NO_PROVIDER_CALL"],
        },
      },
    });

    const hasCoverage = observationCount > 0;

    return NextResponse.json({
      domain,
      covered: hasCoverage,
      observationCount,
    });
  } catch (error) {
    console.error(`[coverage-check] Error checking coverage for ${params.domain}:`, error);
    return NextResponse.json(
      { error: "Internal server error during coverage check." },
      { status: 500 }
    );
  }
}
