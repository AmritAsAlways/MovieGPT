import Header from "./Header";
import MainContainer from "./MainContainer";
import SecondaryContainer from "./SecondaryContainer";
import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import usePopularMovies from "../hooks/usePopularMovies";

// BROWSE PAGE: the page shown after sign in.
//
// COMPONENT TREE (data flows DOWN as props, from Redux via useSelector):
//   Browse
//    |- Header
//    |- MainContainer            first now-playing movie
//    |    |- VideoTitle          title, overview, buttons
//    |    |- VideoBackground     autoplaying trailer
//    |- SecondaryContainer       rows of posters
//         |- MovieList (x5)      one titled row
//              |- MovieCard (xN) one poster
//
// EXECUTION FLOW:
//   1. Browse renders and calls the two data hooks (Section 4)
//   2. TMDB responds -> the hooks dispatch -> Redux updates
//   3. MainContainer and SecondaryContainer read the new data and re-render
//   4. VideoBackground gets the movie id, its hook fetches the trailer, and
//      the iframe appears
// Section 6 will wrap this in a switch between this view and GPT Search.
const Browse = () => {
  useNowPlayingMovies();
  usePopularMovies();

  return (
    <div>
      <Header />
      <MainContainer />
      <SecondaryContainer />
    </div>
  );
};

export default Browse;
