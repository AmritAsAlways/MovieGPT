import { useSelector } from "react-redux";
import Header from "./Header";
import MainContainer from "./MainContainer";
import SecondaryContainer from "./SecondaryContainer";
import GptSearch from "./GptSearch";
import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import usePopularMovies from "../hooks/usePopularMovies";

// BROWSE PAGE: the page shown after sign in. It has TWO views and switches
// between them with one value from Redux:
//
//   store.gpt.showGptSearch === false  ->  MainContainer + SecondaryContainer
//        Browse                            (banner with trailer, poster rows)
//         |- Header
//         |- MainContainer      first now-playing movie: VideoTitle + VideoBackground
//         |- SecondaryContainer rows: MovieList (x5) -> MovieCard (xN)
//
//   store.gpt.showGptSearch === true   ->  GptSearch
//         |- Header
//         |- GptSearch          GptSearchBar + GptMovieSuggestions (MovieList rows)
//
// The Header's "GPT Search" / "Homepage" button dispatches
// toggleGptSearchView(), Redux flips the flag, and this component re-renders
// with the other view. No page navigation is involved.
//
// The data hooks stay here, outside the switch, so the movie lists keep
// loading (and stay cached in Redux) whichever view is showing.
const Browse = () => {
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

  useNowPlayingMovies();
  usePopularMovies();

  return (
    <div>
      <Header />
      {showGptSearch ? (
        <GptSearch />
      ) : (
        // <> ... </> is a Fragment: it groups elements without adding an
        // extra <div> to the page.
        <>
          <MainContainer />
          <SecondaryContainer />
        </>
      )}
    </div>
  );
};

export default Browse;
