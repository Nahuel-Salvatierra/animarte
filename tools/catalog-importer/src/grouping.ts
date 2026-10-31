import { slugify, stripExtension } from './slug.js';
import type { DriveImageMeta, GroupedCandidate, ImageRole } from './types.js';

const BACK_PATTERN =
  /\b(contratapa\d*|contra|back|dorso|atras|atrás|reverso)\b/i;
const COVER_PATTERN =
  /\b(\d+\s*tapa|tapa|cover|front|frente|caratula|carátula)\b/i;

function detectRole(fileName: string): ImageRole {
  const base = stripExtension(fileName);
  // Check back before cover: "contratapa" contains "tapa".
  if (BACK_PATTERN.test(base)) return 'back';
  if (COVER_PATTERN.test(base)) return 'cover';
  return 'unknown';
}

function stripRoleMarkers(fileName: string): string {
  return stripExtension(fileName)
    .replace(BACK_PATTERN, ' ')
    .replace(COVER_PATTERN, ' ')
    .replace(/\bmod\s*(\d+)\b/gi, 'mod $1')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleFromName(fileName: string): string {
  const base = stripRoleMarkers(fileName)
    .replace(/^(anime|cartoon|disney|games|football|music|series|superheroes)\s*-?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  return base || stripExtension(fileName);
}

/** Shared identity for tapa + contratapa of the same model (keeps "mod 2"). */
function baseGroupKey(fileName: string): string {
  return slugify(stripRoleMarkers(fileName));
}

function pickCoverBack(group: DriveImageMeta[]): {
  cover: DriveImageMeta;
  back: DriveImageMeta | undefined;
  confidence: number;
  requiresReview: boolean;
  reason?: string;
} {
  const covers = group.filter((meta) => detectRole(meta.name) === 'cover');
  const backs = group.filter((meta) => detectRole(meta.name) === 'back');
  const unknowns = group.filter((meta) => detectRole(meta.name) === 'unknown');

  if (covers.length === 1 && backs.length === 1 && unknowns.length === 0) {
    return {
      cover: covers[0],
      back: backs[0],
      confidence: 0.98,
      requiresReview: false,
    };
  }

  if (covers.length >= 1 && backs.length >= 1) {
    return {
      cover: covers[0],
      back: backs[0],
      confidence: 0.7,
      requiresReview: true,
      reason: `Ambiguous group: ${covers.length} tapa / ${backs.length} contratapa`,
    };
  }

  if (group.length === 2 && unknowns.length === 2) {
    return {
      cover: group[0],
      back: group[1],
      confidence: 0.6,
      requiresReview: true,
      reason: 'Paired by shared name without tapa/contratapa hints',
    };
  }

  const cover =
    covers[0] ??
    unknowns[0] ??
    group[0];
  return {
    cover,
    back: undefined,
    confidence: 0.55,
    requiresReview: true,
    reason: covers.length
      ? 'Tapa without matching contratapa'
      : backs.length
        ? 'Contratapa without matching tapa'
        : 'Single image without confident pair',
  };
}

export function groupImagesHeuristically(
  images: DriveImageMeta[],
  category: string,
  kind: 'notebook' | 'cover',
): GroupedCandidate[] {
  if (kind === 'cover') {
    return images.map((meta) => ({
      groupKey: `${category}-${meta.id}`,
      category,
      kind,
      titleHint: titleFromName(meta.name),
      images: [{ meta, role: 'cover' as const }],
      confidence: 0.9,
      requiresReview: false,
    }));
  }

  const byKey = new Map<string, DriveImageMeta[]>();
  for (const meta of images) {
    const key = baseGroupKey(meta.name) || meta.id;
    const list = byKey.get(key) ?? [];
    list.push(meta);
    byKey.set(key, list);
  }

  const candidates: GroupedCandidate[] = [];
  const used = new Set<string>();

  for (const [key, group] of byKey) {
    const covers = group.filter((meta) => detectRole(meta.name) === 'cover');
    const backs = group.filter((meta) => detectRole(meta.name) === 'back');

    // Ideal case: one tapa + one contratapa for this model.
    if (covers.length === 1 && backs.length === 1 && group.length === 2) {
      used.add(covers[0].id);
      used.add(backs[0].id);
      candidates.push({
        groupKey: key,
        category,
        kind,
        titleHint: titleFromName(covers[0].name),
        images: [
          { meta: covers[0], role: 'cover' },
          { meta: backs[0], role: 'back' },
        ],
        confidence: 0.98,
        requiresReview: false,
      });
      continue;
    }

    // Same model key with extras: pair first tapa/contratapa, review the rest.
    if (covers.length > 0 && backs.length > 0) {
      const pairCount = Math.min(covers.length, backs.length);
      for (let i = 0; i < pairCount; i += 1) {
        used.add(covers[i].id);
        used.add(backs[i].id);
        candidates.push({
          groupKey: pairCount > 1 ? `${key}-${i + 1}` : key,
          category,
          kind,
          titleHint: titleFromName(covers[i].name),
          images: [
            { meta: covers[i], role: 'cover' },
            { meta: backs[i], role: 'back' },
          ],
          confidence: group.length === 2 ? 0.98 : 0.75,
          requiresReview: group.length !== 2,
          reason:
            group.length === 2
              ? undefined
              : `Multiple files shared model key (${group.length})`,
        });
      }
    }

    for (const meta of group) {
      if (used.has(meta.id)) continue;
      used.add(meta.id);
      const role = detectRole(meta.name);
      const picked = pickCoverBack([meta]);
      candidates.push({
        groupKey: `${key}-${meta.id.slice(0, 8)}`,
        category,
        kind,
        titleHint: titleFromName(meta.name),
        images: [
          {
            meta,
            role: role === 'back' ? 'back' : 'cover',
          },
        ],
        confidence: picked.confidence,
        requiresReview: true,
        reason: picked.reason,
      });
    }
  }

  return candidates;
}
