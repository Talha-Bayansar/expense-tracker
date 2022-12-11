import type { Movie } from "@/server/trpc/router/movies";
import { Layout } from "@/shared";
import { trpc } from "@/utils/trpc";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const MoviesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      title: searchQuery,
    },
    onSubmit: async (values) => {
      setSearchQuery(values.title);
    },
  });

  const { data, isFetching, error } = trpc.movie.find.useQuery({
    query: searchQuery,
  });

  return (
    <Layout title="Movies" showProfileButton={false}>
      {
        <div className="grid place-items-center">
          <form
            className="flex w-full max-w-xl flex-col gap-2"
            onSubmit={handleSubmit}
          >
            <label htmlFor="title" className="flex flex-col">
              Title
              <input
                className="rounded border p-1"
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
              />
            </label>
            <button
              className=" rounded bg-black bg-opacity-20 py-1 px-2"
              type="submit"
              disabled={isFetching}
            >
              Search
            </button>
          </form>
          <div className="h-16" />
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            {isFetching
              ? "Looking for movies..."
              : !data || data.length === 0 || error
              ? "No movies were found."
              : data.map((movie) => (
                  <Link key={movie.id} href={`movies/${movie.id}`}>
                    <MovieCard movie={movie} />
                  </Link>
                ))}
          </div>
        </div>
      }
    </Layout>
  );
};

type Props = {
  movie: Movie;
};

const MovieCard = ({ movie }: Props) => {
  return (
    <div className="flex max-w-xl rounded border hover:cursor-pointer hover:opacity-75">
      <Image
        width={100}
        height={100}
        loader={({ src }) => src}
        src={movie.image_url ?? "N/A"}
        alt={movie.name}
      />
      <div className="flex flex-col gap-2 p-2">
        <p>
          <span className="font-bold">Name: </span>
          {movie.name ?? "N/A"}
        </p>
        <p>
          <span className="font-bold">Year: </span>
          {movie.year ?? "N/A"}
        </p>
      </div>
    </div>
  );
};

export default MoviesPage;
