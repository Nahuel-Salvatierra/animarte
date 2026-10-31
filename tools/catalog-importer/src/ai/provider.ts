import type { GroupedCandidate } from '../types.js';

export type AiClassifyInput = {
  candidate: GroupedCandidate;
  imageBase64: Array<{ mimeType: string; data: string; fileName: string }>;
};

export type AiClassifyResult = {
  title: string;
  category: string;
  kind: 'notebook' | 'cover';
  coverFileName?: string;
  backFileName?: string;
  confidence: number;
  requiresReview: boolean;
  reason?: string;
};

export interface AiProvider {
  readonly name: string;
  classify(input: AiClassifyInput): Promise<AiClassifyResult>;
}

export class NoopAiProvider implements AiProvider {
  readonly name = 'noop';

  async classify(input: AiClassifyInput): Promise<AiClassifyResult> {
    const cover = input.candidate.images.find((image) => image.role === 'cover');
    const back = input.candidate.images.find((image) => image.role === 'back');
    return {
      title: input.candidate.titleHint,
      category: input.candidate.category,
      kind: input.candidate.kind,
      coverFileName: cover?.meta.name,
      backFileName: back?.meta.name,
      confidence: input.candidate.confidence,
      requiresReview: true,
      reason: 'AI provider unavailable; marked for human review',
    };
  }
}
