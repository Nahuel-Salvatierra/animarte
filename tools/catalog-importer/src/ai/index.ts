import { getAiConfig } from '../config.js';
import { GeminiProvider } from './gemini.js';
import { NoopAiProvider, type AiProvider } from './provider.js';

export function createAiProvider(): AiProvider {
  const { provider, apiKey, model } = getAiConfig();

  if (!apiKey) {
    return new NoopAiProvider();
  }

  if (provider === 'gemini' || provider === 'google') {
    return new GeminiProvider(apiKey, model);
  }

  return new NoopAiProvider();
}

export type { AiProvider, AiClassifyResult } from './provider.js';
