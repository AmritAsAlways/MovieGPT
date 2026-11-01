import Header from "./Header";
import DataDebug from "./DataDebug";
import useNowPlayingMovies from "../hooks/useNowPlayingMovies";
import usePopularMovies from "../hooks/usePopularMovies";

// BROWSE PAGE: the page shown after sign in.
//
// Notice how little it does: calling a custom hook is one line. All the
// fetching logic lives in the hooks, and the data lands in Redux.
// Section 5 replaces the temporary DataDebug panel with the real movie UI
// (MainContainer + SecondaryContainer) and adds the GPT search toggle in
// Section 6.
const Browse = () => {
  // These two start downloading as soon as Browse appears on screen.
  useNowPlayingMovies();
  usePopularMovies();

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="pt-48 text-center text-white">
        <h2 className="text-2xl font-bold">Browse page</h2>
        <p className="text-gray-400 mt-2">Data layer check (Section 4)</p>
        <DataDebug />
      </div>
    </div>
  );
};

export default Browse;
