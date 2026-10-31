import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '../../..');
export const DEFAULT_OUTPUT_DIR = path.join(REPO_ROOT, 'public-catalog');
export const DEFAULT_WORK_DIR = path.join(
  REPO_ROOT,
  'tools/catalog-importer/.work',
);

export const CATEGORY_FOLDER_ENV: Record<string, string> = {
  anime: 'GOOGLE_ANIME_FOLDER_ID',
  cartoon: 'GOOGLE_CARTOON_FOLDER_ID',
  superheroes: 'GOOGLE_SUPERHEROS_FOLDER_ID',
  disney: 'GOOGLE_DISNEY_FOLDER_ID',
  series: 'GOOGLE_SERIES_FOLDER_ID',
  music: 'GOOGLE_MUSIC_FOLDER_ID',
  football: 'GOOGLE_FOOTBALL_FOLDER_ID',
  cover: 'GOOGLE_COVER_ID',
  games: 'GOOGLE_GAMES_FOLDER_ID',
};

export function getAiConfig() {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  const apiKey = process.env.AI_API_KEY || process.env.GOOGLE_API_KEY || '';
  const model = process.env.AI_MODEL || 'gemini-2.0-flash';
  return { provider, apiKey, model };
}

export function getGoogleApiKey(): string {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    throw new Error('GOOGLE_API_KEY is required for the catalog importer');
  }
  return key;
}
