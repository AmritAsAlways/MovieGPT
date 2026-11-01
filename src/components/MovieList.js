import MovieCard from "./MovieCard";

// One titled, sideways-scrolling row of posters.
// Props: `title` is the heading text, `movies` is an array from TMDB.
//
// LISTS IN REACT: we turn each movie object into a <MovieCard> with .map().
// `key` is required: it lets React track which item is which when the list
// changes, so it updates only what changed. Use a stable unique value (the
// movie id), not the array index.
//
// `movies?.map` : the `?.` means "only call map if movies exists". Popular
// movies may still be loading (null) when this first renders, and without
// `?.` the app would crash on null.map.
//
// Tailwind: `overflow-x-scroll` on the outer div gives the sideways scroll,
// and the inner `flex` lays the cards out in one row.
const MovieList = ({ title, movies }) => {
  return (
    <div className="px-6">
      <h1 className="text-lg md:text-3xl py-4 text-white">{title}</h1>
      <div className="flex overflow-x-scroll">
        <div className="flex">
          {movies?.map((movie) => (
            <MovieCard key={movie.id} posterPath={movie.poster_path} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
