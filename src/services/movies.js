const API_KEY = "8e6f3e32";

export const searchMovies = async ({search}) => {
  if (search === "") return null;
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?i=tt3896198&apikey=${API_KEY}&s=${search}`
    );
    const json = await response.json();

    const movies = json.Search;
    return movies?.map((movie) => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
    }));
  } catch (e) {
    throw new Error("Error searching movies");
  }
};
