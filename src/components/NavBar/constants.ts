import { NOTEBOOK_CATEGORIES } from '@/catalog/categories';

export const categories = NOTEBOOK_CATEGORIES.map((category) => ({
  value: category.id,
  label: category.label,
}));

export const frameworks = [
  {
    value: 'cuadernos',
    label: 'Cuadernos',
    subValues: categories,
  },
  {
    value: 'caratulas',
    label: 'Caratulas',
  },
];
