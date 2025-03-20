"use client";

import { useState, useEffect, useCallback } from "react";
import MovieList from "@/components/MovieList";
import Pagination from "@/components/Pagination";

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  released: number;
  genre: string;
  favorited: boolean;
  watchLater: boolean;
}

interface FavoritesProps {
  refreshParent?: () => void;
}

export default function Favorites({ refreshParent = () => {} }: FavoritesProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadFavoriteMovies = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const res = await fetch(`/api/favorites?page=${page}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const result = await res.json();
      setMovies(result.favorites || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFetchError("Couldn't load favs.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadFavoriteMovies();
  }, [loadFavoriteMovies]);

  const onPageChange = useCallback(
    (newPage: number) => {
      if (newPage !== page) setPage(newPage);
    },
    [page]
  );

  const handleFavoriteToggle = useCallback(
    async (id: string) => {
      try {
        const targetMovie = movies.find((movie) => movie.id === id);
        if (!targetMovie) return;

        const method = targetMovie.favorited ? "DELETE" : "POST";
        const res = await fetch(`/api/favorites/${id}`, { method });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Couldn't toggle favorite");
        }

        await loadFavoriteMovies();
        refreshParent();
      } catch (error) {
        console.error("Error toggling favorite:", error);
        setFetchError("Couldn't update favorite status.");
      }
    },
    [movies, loadFavoriteMovies, refreshParent]
  );

  const handleWatchLaterToggle = useCallback(
    async (id: string) => {
      try {
        const targetMovie = movies.find((movie) => movie.id === id);
        if (!targetMovie) return;

        const method = targetMovie.watchLater ? "DELETE" : "POST";
        const res = await fetch(`/api/watch-later/${id}`, { method });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || "Couldn't toggle watch later");
        }

        await loadFavoriteMovies();
        refreshParent();
      } catch (error) {
        console.error("Error toggling watch later:", error);
        setFetchError("Couldn't update watch later status.");
      }
    },
    [movies, loadFavoriteMovies, refreshParent]
  );

  return (
    <main aria-labelledby="favorites-heading">
      <h1
        id="favorites-heading"
        className="text-4xl font-bold text-white text-center py-10 mt-5"
      >
        Your Favorite Movies
      </h1>

      <section aria-live="polite" aria-busy={loading}>
        {loading && (
          <p className="text-white font-semibold" role="alert">
            Loading your favorite movies...
          </p>
        )}

        {!loading && fetchError && (
          <p className="text-red-500 font-semibold" role="alert">
            {fetchError}
          </p>
        )}

        {!loading && !fetchError && movies.length === 0 && (
          <p className="text-white font-semibold">
            You haven't favorited any movies yet.
          </p>
        )}

        {!loading && !fetchError && movies.length > 0 && (
          <MovieList
            movies={movies}
            toggleFavorite={handleFavoriteToggle}
            toggleWatchLater={handleWatchLaterToggle}
          />
        )}
      </section>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </main>
  );
}
