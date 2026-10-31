import type { AiClassifyInput, AiClassifyResult, AiProvider } from './provider.js';

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : trimmed;
  return JSON.parse(raw);
}

export class GeminiProvider implements AiProvider {
  readonly name = 'gemini';

  constructor(
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async classify(input: AiClassifyInput): Promise<AiClassifyResult> {
    const prompt = `You classify stationery product images for Animarte.
Return ONLY valid JSON with this shape:
{
  "title": string,
  "category": string,
  "kind": "notebook" | "cover",
  "coverFileName": string | null,
  "backFileName": string | null,
  "confidence": number,
  "requiresReview": boolean,
  "reason": string
}
Rules:
- Do not invent titles: use visible text or the provided filename hint.
- Do not invent missing images.
- Do not pair images only because names are vaguely similar.
- Mark requiresReview=true when uncertain.
Category hint: ${input.candidate.category}
Kind hint: ${input.candidate.kind}
Title hint: ${input.candidate.titleHint}
Files: ${input.imageBase64.map((image) => image.fileName).join(', ')}`;

    const parts: Array<Record<string, unknown>> = [{ text: prompt }];
    for (const image of input.imageBase64) {
      parts.push({
        inline_data: {
          mime_type: image.mimeType,
          data: image.data,
        },
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.1 },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Gemini error ${response.status}: ${body}`);
    }

    const json = (await response.json()) as GeminiResponse;
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Gemini returned empty content');
    }

    const parsed = extractJson(text) as AiClassifyResult;
    return {
      title: parsed.title || input.candidate.titleHint,
      category: parsed.category || input.candidate.category,
      kind: parsed.kind || input.candidate.kind,
      coverFileName: parsed.coverFileName ?? undefined,
      backFileName: parsed.backFileName ?? undefined,
      confidence: Number(parsed.confidence ?? 0.5),
      requiresReview: Boolean(parsed.requiresReview ?? true),
      reason: parsed.reason,
    };
  }
}
