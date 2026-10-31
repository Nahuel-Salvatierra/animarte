export type DriveImageMeta = {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  localPath?: string;
};

export type ImageRole = 'cover' | 'back' | 'unknown';

export type GroupedCandidate = {
  groupKey: string;
  category: string;
  kind: 'notebook' | 'cover';
  titleHint: string;
  images: Array<{
    meta: DriveImageMeta;
    role: ImageRole;
  }>;
  confidence: number;
  requiresReview: boolean;
  reason?: string;
};
