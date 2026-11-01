import { useSelector } from "react-redux";
import VideoBackground from "./VideoBackground";
import VideoTitle from "./VideoTitle";

// The featured-movie banner. It is a "container" component: it reads from
// Redux, picks the data, and hands it to presentational children as props:
//   MainContainer (data)
//     |- VideoTitle      <- title, overview
//     |- VideoBackground <- movie id (fetches and plays the trailer)
//
// The featured movie is simply the FIRST now-playing movie.
const MainContainer = () => {
  const movies = useSelector((store) => store.movies.nowPlayingMovies);

  // Nothing to show until the list has loaded (null) or if it came back empty.
  // `return null` tells React to draw nothing.
  if (!movies || movies.length === 0) return null;

  const mainMovie = movies[0];
  const { original_title, overview, id } = mainMovie;

  return (
    // `pt-[30%]` leaves room under the header on phones; `md:pt-0` removes it
    // on larger screens where the banner can sit at the very top.
    <div className="pt-[30%] bg-black md:pt-0">
      <VideoTitle title={original_title} overview={overview} />
      <VideoBackground movieId={id} />
    </div>
  );
};

export default MainContainer;
