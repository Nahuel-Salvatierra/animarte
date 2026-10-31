import { z } from 'zod';

export const ProductKindSchema = z.enum(['notebook', 'cover']);
export type ProductKind = z.infer<typeof ProductKindSchema>;

export const ProductImagesSchema = z.object({
  cover: z.string().min(1),
  back: z.string().min(1).optional(),
});

export const ProductSourceSchema = z
  .object({
    driveFileIds: z.array(z.string()).default([]),
  })
  .optional();

export const CatalogProductSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  kind: ProductKindSchema,
  images: ProductImagesSchema,
  active: z.boolean().default(true),
  source: ProductSourceSchema,
  description: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().nonnegative().optional(),
  tags: z.array(z.string()).optional(),
});

export type CatalogProduct = z.infer<typeof CatalogProductSchema>;

export const CategorySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  kind: ProductKindSchema.optional(),
});

export type CatalogCategory = z.infer<typeof CategorySchema>;

export const CatalogFileSchema = z.object({
  version: z.number().int().positive().default(1),
  generatedAt: z.string().optional(),
  products: z.array(CatalogProductSchema),
});

export type CatalogFile = z.infer<typeof CatalogFileSchema>;

export const CategoriesFileSchema = z.object({
  categories: z.array(CategorySchema),
});

export type CategoriesFile = z.infer<typeof CategoriesFileSchema>;

export const ImportProductCandidateSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  kind: ProductKindSchema,
  images: z.object({
    cover: z.string().min(1),
    back: z.string().min(1).optional(),
  }),
  confidence: z.number().min(0).max(1),
  requiresReview: z.boolean(),
  driveFileIds: z.array(z.string()),
  reason: z.string().optional(),
});

export type ImportProductCandidate = z.infer<
  typeof ImportProductCandidateSchema
>;

export const ImportReportSchema = z.object({
  totalImages: z.number().int().nonnegative(),
  totalProducts: z.number().int().nonnegative(),
  productsWithCoverAndBack: z.number().int().nonnegative(),
  productsWithIncompleteImages: z.number().int().nonnegative(),
  unclassifiedImages: z.number().int().nonnegative(),
  potentialDuplicates: z.number().int().nonnegative(),
  pendingReview: z.number().int().nonnegative(),
  estimatedAiCostUsd: z.number().nonnegative().optional(),
});

export type ImportReport = z.infer<typeof ImportReportSchema>;
