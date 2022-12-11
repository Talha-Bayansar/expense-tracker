import { Layout } from "@/shared";
import { trpc } from "@/utils/trpc";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { FiExternalLink } from "react-icons/fi";

const MovieDetailsPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, isFetching, error } = trpc.movie.findOne.useQuery(
    { id },
    {
      refetchOnWindowFocus: false,
    }
  );

  const rows = [
    { key: "title", name: "Title" },
    { key: "year", name: "Year" },
    { key: "genre_names", name: "Genre" },
    { key: "plot_overview", name: "Plot Overview" },
    { key: "runtime_minutes", name: "Duration", append: "minutes" },
    { key: "user_rating", name: "Rating" },
  ];

  function getUniqueListBy<T>(arr: T[], key: string) {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  }

  return (
    <Layout
      hasBackButton
      title={`Movie details${data && `: ${data.title}`}`}
      showProfileButton={false}
    >
      {isFetching ? (
        <div className="grid place-items-center">
          Getting the movie details...
        </div>
      ) : !data || error ? (
        <div className="grid place-items-center">Something went wrong!</div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 place-items-center gap-4 md:flex md:items-start">
            <Image
              className="w-56"
              loader={({ src }) => src}
              src={data.poster ?? "N/A"}
              alt={data.title}
              width={500}
              height={500}
            />
            <div className="flex min-w-min max-w-3xl flex-col gap-2">
              {rows.map((row) => (
                <p key={row.key}>
                  <span className="font-semibold">{row.name}: </span>
                  {row.key === "genre_names"
                    ? data[row.key].join(", ")
                    : data[row.key] ?? "N/A"}{" "}
                  {data[row.key] && row.append}
                </p>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="mb-4 text-xl">Resources</h2>
            <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
              {data.sources.length > 0 && data.sources !== null ? (
                getUniqueListBy(data.sources, "source_id")?.map((source, i) => (
                  <div
                    key={`${source.source_id}-${i}`}
                    className="flex flex-col gap-2 rounded border py-6 px-8"
                  >
                    <p>
                      <span className="font-semibold">Name: </span>
                      {source.name}
                    </p>
                    <p>
                      <span className="font-semibold">Price: </span>
                      {source.price ? `${source.price}$` : "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Type: </span>
                      {source.type.toUpperCase()}
                    </p>
                    <Link
                      href={source.web_url}
                      target="_blank"
                      className="flex items-center justify-center gap-2 rounded bg-blue-500 py-1 px-2 text-white shadow-md hover:bg-blue-400 hover:shadow-none active:bg-blue-400 active:shadow-none"
                    >
                      Visit <FiExternalLink />
                    </Link>
                  </div>
                ))
              ) : (
                <p>There are no resources for this movie.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MovieDetailsPage;
