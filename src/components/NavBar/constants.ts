import { CategoryEnum } from "@/app/books/[category]/caterogy.enum";

export const categories = [
  {
    value: CategoryEnum.anime,
    label: "Anime",
  },
  {
    value: CategoryEnum.cartoon,
    label: "Cartoon y Kawaii",
  },
  {
    value: CategoryEnum.superhero,
    label: "Superheroes",
  },
  {
    value: CategoryEnum.disney,
    label: "Disney",
  },
  {
    value: CategoryEnum.football,
    label: "Futbol",
  },
  {
    value: CategoryEnum.music,
    label: "Musica y Youtube",
  },
  {
    value: CategoryEnum.series,
    label: "Series y Peliculas",
  },
];

export const frameworks = [
  {
    value: "cuadernos",
    label: "Cuadernos",
    subValues: categories,
  },
  {
    value: "caratulas",
    label: "Caratulas",
  },
];
