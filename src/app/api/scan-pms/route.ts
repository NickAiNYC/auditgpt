import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();

    if (!Array.isArray(urls)) {
      return NextResponse.json({ success: false, message: "Invalid payload, expected array of urls" }, { status: 400 });
    }

    const results = await Promise.all(
      urls.map(async (urlStr: string) => {
        let cleanUrl = urlStr.trim();
        if (!cleanUrl) return null;
        if (!cleanUrl.startsWith('http')) {
          cleanUrl = 'https://' + cleanUrl;
        }

        try {
          // Add a timeout signal
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const res = await fetch(cleanUrl, { 
            signal: controller.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          clearTimeout(timeoutId);

          const html = await res.text();
          
          let pms = "Unknown";
          
          // Boulevard signatures
          if (html.includes("boulevard.io") || html.includes("blvd.co") || html.includes("Boulevard")) {
            pms = "Boulevard";
          } 
          // Mangomint signatures
          else if (html.includes("mangomint.com") || html.includes("data-mangomint") || html.includes("Mangomint")) {
            pms = "Mangomint";
          }

          return { url: urlStr, status: "Success", pms };
        } catch (error: any) {
          return { url: urlStr, status: "Failed", pms: "Error: " + (error.message || "Could not fetch") };
        }
      })
    );

    return NextResponse.json({ success: true, results: results.filter(r => r !== null) });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
