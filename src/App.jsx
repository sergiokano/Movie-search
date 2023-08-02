import "./App.css";
import { useMovies } from "./hooks/useMovies";
import { Movies } from "./components/Movies";
import { useRef, useState, useEffect } from "react";
import { useCallback } from "react";
import debounce from "just-debounce-it";

function useSearch() {
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    }
    if (search === "") {
      setError("No se puede buscar una película vacía");
      return;
    }
    if (search.match(/^\d+$/)) {
      setError("No se puede buscar un número");
      return;
    }
    if (search.length < 3) {
      setError("La búsqueda debe tener al menos 3 caracteres");
      return;
    }
    setError(null);
  }, [search]);
  return { search, updateSearch, error };
}

function App() {
  const [sort, setSort] = useState(false);

  const { search, updateSearch, error } = useSearch();
  const { movies, loading, getMovies } = useMovies({ search, sort });

  const handleSubmit = (event) => {
    event.preventDefault();
    getMovies({ search });
    // ***Esta forma de abajo sería para recuperar todos los campos de varios inputs dentro de un form en forma de objeto
    // const fields = Object.fromEntries(new window.FormData(event.target));
    // console.log(fields);
    // console.log({ query });
  };

  const debouncedGetMovies = useCallback(
    debounce(search => {
      console.log("search", search);
      getMovies({ search });
    }, 300),
    [getMovies]
  );

  const handleSort = () => {
    setSort(!sort);
  };

  const handleChange = (event) => {
    const newSearch = event.target.value;
    updateSearch(event.target.value);
    debouncedGetMovies(newSearch);
  };

  return (
    <div className="page">
      <header>
        <h1>Buscador de Películas</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            value={search}
            name="query"
            placeholder="Avengers, Star Wars, The Matrix ..."
          />
          <input type="checkbox" onChange={handleSort} checked={sort} />
          <button type="submit">Buscar</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </header>
      <main>{loading ? <p>Cargando...</p> : <Movies movies={movies} />}</main>
    </div>
  );
}

export default App;
