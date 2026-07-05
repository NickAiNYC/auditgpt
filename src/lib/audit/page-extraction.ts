import * as cheerio from 'cheerio';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function extractClaimsFromHtml(html: string, domain: string): Promise<string[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[guardian] OPENAI_API_KEY missing, skipping real extraction. Returning dummy data for testing.");
    return [
      "FDA cleared weight loss solution",
      "Lose 20 pounds in your first month",
      "Guaranteed results or your money back"
    ];
  }

  // 1. Clean HTML
  const $ = cheerio.load(html);
  $('script, style, noscript, iframe, img, svg, nav, footer').remove();
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  
  // Truncate to avoid massive payloads (roughly 60k chars = ~15k tokens)
  const truncatedText = text.slice(0, 60000);

  // 2. Extract with LLM
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a compliance auditor. Review the provided page text from ${domain} and extract discrete, high-risk claims (e.g., medical efficacy, definitive weight-loss promises, guaranteed outcomes, "first/best" superlatives). Output a JSON object containing an array of strings under the key "claims".`,
        },
        {
          role: 'user',
          content: truncatedText,
        }
      ],
      response_format: { type: "json_object" },
    });
    
    const content = response.choices[0].message.content;
    if (!content) return [];
    
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed.claims)) {
      return parsed.claims.filter((c: any) => typeof c === 'string' && c.trim().length > 0);
    }
    
    return [];
  } catch (error) {
    console.error("[guardian] Error extracting claims with OpenAI:", error);
    return [];
  }
}
