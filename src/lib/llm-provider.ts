// ============================================================
// AuditGPT — Thin LLM provider abstraction
// ============================================================
// Why this exists: z-ai-web-dev-sdk is pinned at 0.0.x. The vendor
// can change the API on a Tuesday. This wrapper lets us flip
// providers via env var without touching the pipeline.
//
// Rules:
//   - Keep existing Z-AI path working as the default.
//   - Do not fake responses on key failure — throw a clear error.
//   - Use plain fetch calls for OpenAI / Anthropic / DeepSeek so
//     no new heavy SDK dependencies are introduced.
//   - Audit pipeline behavior unchanged except for calling
//     through callLLM().
// ============================================================

import ZAI from 'z-ai-web-dev-sdk';

export type LLMProviderName = 'zai' | 'openai' | 'anthropic' | 'deepseek' | 'gemini';

export interface LLMCallInput {
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMCallResult {
  provider: LLMProviderName;
  model?: string;
  text: string;
}

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env var ${key} for selected LLM provider`);
  return v;
}

export function getLLMConfigurationStatus(): { configured: boolean; provider: LLMProviderName; missing?: string } {
  const provider = (process.env.LLM_PROVIDER || 'zai').toLowerCase() as LLMProviderName;
  const requiredKeyByProvider: Partial<Record<LLMProviderName, string>> = {
    openai: 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    deepseek: 'DEEPSEEK_API_KEY',
    zai: 'Z_AI_API_KEY',
    gemini: 'GEMINI_API_KEY',
  };
  const missing = requiredKeyByProvider[provider];
  if (missing && !process.env[missing]) return { configured: false, provider, missing };
  return { configured: true, provider };
}

// ──────────────────────────────────────────────────────────────
// Z-AI (default — current live provider)
// ──────────────────────────────────────────────────────────────
async function callZai(input: LLMCallInput): Promise<LLMCallResult> {
  const zai = await ZAI.create();
  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: input.system },
      { role: 'user', content: input.user },
    ],
    thinking: { type: 'disabled' },
    ...(typeof input.temperature === 'number' && { temperature: input.temperature }),
    ...(typeof input.maxTokens === 'number' && { max_tokens: input.maxTokens }),
  });
  const text = completion.choices?.[0]?.message?.content || '';
  return { provider: 'zai', text };
}

// ──────────────────────────────────────────────────────────────
// OpenAI (chat completions, structured JSON expected from prompt)
// ──────────────────────────────────────────────────────────────
async function callOpenAI(input: LLMCallInput): Promise<LLMCallResult> {
  const key = requireEnv('OPENAI_API_KEY');
  const model = process.env.OPENAI_MODEL || 'gpt-4o';
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: input.system },
        { role: 'user', content: input.user },
      ],
      temperature: input.temperature ?? 0.2,
      max_tokens: input.maxTokens ?? 4096,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`OpenAI error ${res.status}: ${errText.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return {
    provider: 'openai',
    model,
    text: data.choices?.[0]?.message?.content || '',
  };
}

// ──────────────────────────────────────────────────────────────
// Anthropic (Messages API)
// ──────────────────────────────────────────────────────────────
async function callAnthropic(input: LLMCallInput): Promise<LLMCallResult> {
  const key = requireEnv('ANTHROPIC_API_KEY');
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: input.maxTokens ?? 4096,
      temperature: input.temperature ?? 0.2,
      system: input.system,
      messages: [{ role: 'user', content: input.user }],
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Anthropic error ${res.status}: ${errText.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    content?: Array<{ type?: string; text?: string }>;
  };
  const text =
    data.content
      ?.filter((b) => b.type === 'text')
      .map((b) => b.text || '')
      .join('') || '';
  return { provider: 'anthropic', model, text };
}

// ──────────────────────────────────────────────────────────────
// DeepSeek (OpenAI-compatible)
// ──────────────────────────────────────────────────────────────
async function callDeepseek(input: LLMCallInput): Promise<LLMCallResult> {
  const key = requireEnv('DEEPSEEK_API_KEY');
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: input.system },
        { role: 'user', content: input.user },
      ],
      temperature: input.temperature ?? 0.2,
      max_tokens: input.maxTokens ?? 4096,
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`DeepSeek error ${res.status}: ${errText.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return {
    provider: 'deepseek',
    model,
    text: data.choices?.[0]?.message?.content || '',
  };
}


// ──────────────────────────────────────────────────────────────
// Gemini (Google AI Studio)
// ──────────────────────────────────────────────────────────────
async function callGemini(input: LLMCallInput): Promise<LLMCallResult> {
  const key = requireEnv('GEMINI_API_KEY');
  // Pinned to explicit frozen version instead of the rolling 'gemini-1.5-flash' alias
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash-002';
  
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: input.system }]
      },
      contents: [{
        role: 'user',
        parts: [{ text: input.user }]
      }],
      generationConfig: {
        temperature: input.temperature ?? 0.2,
        maxOutputTokens: input.maxTokens ?? 4096,
      }
    }),
  });
  
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini error ${res.status}: ${errText.slice(0, 200)}`);
  }
  
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  return {
    provider: 'gemini',
    model,
    text,
  };
}

// ──────────────────────────────────────────────────────────────
// Router
// ──────────────────────────────────────────────────────────────
export async function callLLM(input: LLMCallInput): Promise<LLMCallResult> {
  const raw = (process.env.LLM_PROVIDER || 'zai').toLowerCase() as LLMProviderName;
  const config = getLLMConfigurationStatus();
  if (!config.configured) {
    throw new Error(`LLM provider ${config.provider} is not configured. Set ${config.missing}.`);
  }
  switch (raw) {
    case 'gemini':
      return callGemini(input);
    case 'openai':
      return callOpenAI(input);
    case 'anthropic':
      return callAnthropic(input);
    case 'deepseek':
      return callDeepseek(input);
    case 'zai':
    default:
      return callZai(input);
  }
}
