// import withResults from "../mocks/with-results.json";
import { useState } from "react";
import { searchMovies } from "../services/movies";
import { useRef, useMemo, useCallback } from "react";

export function useMovies({ search, sort }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const previousSearch = useRef(search);

  const getMovies = useCallback(async ({ search }) => {
    if (search === previousSearch.current) return;
    try {
      setLoading(true);
      setError(null);
      previousSearch.current = search;
      const newMovies = await searchMovies({ search });
      setMovies(newMovies);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);
  // ***UseCallBack es un UseMemo por debajo con una función que se ejecuta cuando cambia la dependencia, el useCallback nos ahorra ponerle la función

  //   const getSortedMovies = () => {
  //   const sortedMovies = sort
  //   ? [...movies].sort((a, b) => a.title.localeCompare(b.title)) : movies;
  //   // *** el localeCompare no es una comparación estricta con acentos y demás
  // return sortedMovies;
  //   };

  const sortedMovies = useMemo(() => {
    return sort
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
      : movies;
  }, [movies, sort]);

  return { movies: sortedMovies, getMovies, loading };
}
