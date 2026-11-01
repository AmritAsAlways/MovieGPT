import { useSelector } from "react-redux";
import MovieList from "./MovieList";

// The area below the banner: several MovieList rows.
//
// DATA NOTE (same as the original project): we only download two lists from
// TMDB, now playing and popular. So "Trending", "Upcoming Movies" and
// "Horror" currently show the SAME now-playing list as placeholders. Only
// "Popular" has its own data. Section 7 can wire up real endpoints.
//
// Layout: on medium screens and up, `md:-mt-52` pulls this block UP by 13rem
// so the first row overlaps the bottom of the trailer, like Netflix does.
// `relative z-20` puts it above the banner, otherwise the video would cover it.
const SecondaryContainer = () => {
  const movies = useSelector((store) => store.movies);

  // Render nothing until the first list has arrived.
  if (!movies.nowPlayingMovies) return null;

  return (
    <div className="bg-black">
      <div className="mt-0 md:-mt-52 pl-4 md:pl-12 relative z-20">
        <MovieList title={"Now Playing"} movies={movies.nowPlayingMovies} />
        <MovieList title={"Trending"} movies={movies.nowPlayingMovies} />
        <MovieList title={"Popular"} movies={movies.popularMovies} />
        <MovieList title={"Upcoming Movies"} movies={movies.nowPlayingMovies} />
        <MovieList title={"Horror"} movies={movies.nowPlayingMovies} />
      </div>
    </div>
  );
};

export default SecondaryContainer;
