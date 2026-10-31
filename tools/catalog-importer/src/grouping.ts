import { sharedTokenScore, slugify, stripExtension } from './slug.js';
import type { DriveImageMeta, GroupedCandidate, ImageRole } from './types.js';

const BACK_HINTS = ['back', 'contra', 'contratapa', 'dorso', 'atras', 'reverso'];
const COVER_HINTS = ['cover', 'tapa', 'front', 'frente', 'caratula'];

function detectRole(fileName: string): ImageRole {
  const slug = slugify(stripExtension(fileName));
  if (BACK_HINTS.some((hint) => slug.includes(hint))) return 'back';
  if (COVER_HINTS.some((hint) => slug.includes(hint))) return 'cover';
  return 'unknown';
}

function titleFromName(fileName: string): string {
  const base = stripExtension(fileName)
    .replace(/[_-]+/g, ' ')
    .replace(
      /\b(back|contra|contratapa|dorso|atras|reverso|cover|tapa|front|frente|caratula)\b/gi,
      '',
    )
    .replace(/\s+/g, ' ')
    .trim();
  return base || stripExtension(fileName);
}

function baseGroupKey(fileName: string): string {
  return slugify(
    stripExtension(fileName).replace(
      /\b(back|contra|contratapa|dorso|atras|reverso|cover|tapa|front|frente|caratula|\d+)\b/gi,
      ' ',
    ),
  );
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
  const leftovers: DriveImageMeta[] = [];

  for (const [key, group] of byKey) {
    if (group.length === 1) {
      leftovers.push(group[0]);
      continue;
    }

    if (group.length === 2) {
      const roles = group.map((meta) => detectRole(meta.name));
      let cover = group[0];
      let back = group[1];

      if (roles[0] === 'back' || roles[1] === 'cover') {
        cover = group[1];
        back = group[0];
      }

      const namedRoles =
        roles.includes('cover') || roles.includes('back');
      candidates.push({
        groupKey: key,
        category,
        kind,
        titleHint: titleFromName(cover.name),
        images: [
          { meta: cover, role: 'cover' },
          { meta: back, role: 'back' },
        ],
        confidence: namedRoles ? 0.92 : 0.75,
        requiresReview: !namedRoles,
        reason: namedRoles
          ? undefined
          : 'Paired by shared name tokens without explicit cover/back hints',
      });
      continue;
    }

    for (const meta of group) {
      leftovers.push(meta);
    }
  }

  const used = new Set<string>();
  for (let i = 0; i < leftovers.length; i += 1) {
    const current = leftovers[i];
    if (used.has(current.id)) continue;

    let bestIndex = -1;
    let bestScore = 0;
    for (let j = i + 1; j < leftovers.length; j += 1) {
      const other = leftovers[j];
      if (used.has(other.id)) continue;
      const score = sharedTokenScore(current.name, other.name);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = j;
      }
    }

    if (bestIndex >= 0 && bestScore >= 0.6) {
      const pair = leftovers[bestIndex];
      used.add(current.id);
      used.add(pair.id);
      const roleA = detectRole(current.name);
      const roleB = detectRole(pair.name);
      const cover =
        roleA === 'back' || roleB === 'cover' ? pair : current;
      const back = cover.id === current.id ? pair : current;
      candidates.push({
        groupKey: baseGroupKey(cover.name) || cover.id,
        category,
        kind,
        titleHint: titleFromName(cover.name),
        images: [
          { meta: cover, role: 'cover' },
          { meta: back, role: 'back' },
        ],
        confidence: bestScore,
        requiresReview: true,
        reason: `Heuristic pair score ${bestScore.toFixed(2)}`,
      });
      continue;
    }

    used.add(current.id);
    candidates.push({
      groupKey: current.id,
      category,
      kind,
      titleHint: titleFromName(current.name),
      images: [{ meta: current, role: detectRole(current.name) === 'back' ? 'back' : 'cover' }],
      confidence: 0.55,
      requiresReview: true,
      reason: 'Single image without confident pair',
    });
  }

  return candidates;
}
