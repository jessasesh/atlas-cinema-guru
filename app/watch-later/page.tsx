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

interface WatchLaterProps {
  refreshParent?: () => void;
}

export default function WatchLater({ refreshParent = () => {} }: WatchLaterProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    try {
      const res = await fetch(`/api/watch-later?page=${page}`);
      if (!res.ok) throw new Error(`API responded with ${res.status}`);

      const result = await res.json();
      setMovies(result.watchLater || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Failed loading Watch Later movies:", error);
      setFetchError("Couldn't fetch Watch Later movies.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  const onPageChange = useCallback((newPage: number) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  }, [page]);

  const handleWatchLaterToggle = useCallback(async (id: string) => {
    try {
      const targetMovie = movies.find((movie) => movie.id === id);
      if (!targetMovie) return;

      const httpMethod = targetMovie.watchLater ? "DELETE" : "POST";
      const response = await fetch(`/api/watch-later/${id}`, { method: httpMethod });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed toggling watch later");
      }

      await loadMovies();
      refreshParent();
    } catch (error) {
      console.error("Error toggling watch later state:", error);
      setFetchError("Couldn't update Watch Later status.");
    }
  }, [movies, loadMovies, refreshParent]);

  const handleFavoriteToggle = useCallback(async (id: string) => {
    try {
      const targetMovie = movies.find((movie) => movie.id === id);
      if (!targetMovie) return;

      const httpMethod = targetMovie.favorited ? "DELETE" : "POST";
      const response = await fetch(`/api/favorites/${id}`, { method: httpMethod });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || "Failed toggling favorite");
      }

      await loadMovies();
      refreshParent();
    } catch (error) {
      console.error("Error toggling favorite state:", error);
      setFetchError("Couldn't update favorite status.");
    }
  }, [movies, loadMovies, refreshParent]);

  return (
    <main aria-labelledby="watch-later-heading">
      <h1
        id="watch-later-heading"
        className="text-4xl font-bold text-white text-center py-10 mt-5"
      >
        Watch Later
      </h1>

      <section aria-live="polite" aria-busy={loading}>
        {loading && (
          <p className="text-white font-semibold" role="alert">
            Loading your movies...
          </p>
        )}

        {!loading && fetchError && (
          <p className="text-red-500 font-semibold" role="alert">
            {fetchError}
          </p>
        )}

        {!loading && !fetchError && movies.length === 0 && (
          <p className="text-white font-semibold">
            You have no movies added to your Watch Later list yet.
          </p>
        )}

        {!loading && !fetchError && movies.length > 0 && (
          <MovieList
            movies={movies}
            toggleWatchLater={handleWatchLaterToggle}
            toggleFavorite={handleFavoriteToggle}
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
