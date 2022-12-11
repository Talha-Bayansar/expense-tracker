import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export type Movie = {
  id?: number;
  name?: string;
  type?: string;
  year?: number;
  imdb_id?: string;
  tmdb_id?: number;
  tmdb_type?: string;
  image_url?: string;
};

type Source = {
  source_id?: number;
  name?: string;
  region?: string;
  ios_url?: string;
  android_url?: string;
  web_url?: string;
  price?: number;
  type?: string;
};

type MovieDetails = {
  id?: number;
  title?: string;
  original_title?: string;
  plot_overview?: string;
  runtime_minutes?: number;
  year?: number;
  genre_names?: string[];
  user_rating?: number;
  poster?: string;
  backdrop?: string;
  original_language?: string;
  trailer?: string;
  trailer_thumbnail?: string;
  sources?: Source[];
};

export const movieRouter = router({
  find: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ input }) => {
      const url = `https://api.watchmode.com/v1/autocomplete-search/?apiKey=${process.env.MOVIES_API_KEY}&search_field=name&search_value=${input.query}&types=movie`;
      const data: Movie[] = await fetch(url)
        .then((response) => response.json())
        .then((data) => data["results"] ?? []);
      return data;
    }),
  findOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const url = `https://api.watchmode.com/v1/title/${input.id}/details/?apiKey=${process.env.MOVIES_API_KEY}&append_to_response=sources`;
      const data: MovieDetails = await fetch(url).then((response) =>
        response.json()
      );
      return data;
    }),
});
