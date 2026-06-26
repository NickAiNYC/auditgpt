import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  try {
    const body = await request.json();
    
    // Simulate a secure network delay / DB operation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({ 
      success: true, 
      message: "SYSTEM: Token Accepted. Ingress established. Awaiting Phase 2 Initialization." 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }
}
