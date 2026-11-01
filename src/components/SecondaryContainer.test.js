import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "../utils/moviesSlice";
import SecondaryContainer from "./SecondaryContainer";

// A component that reads from Redux must be rendered inside a <Provider>.
// For tests we build a small store with PRELOADED state, so we control exactly
// what the component sees without calling any API.
const renderWithMovies = (moviesState) => {
  const store = configureStore({
    reducer: { movies: moviesReducer },
    preloadedState: { movies: moviesState },
  });
  return render(
    <Provider store={store}>
      <SecondaryContainer />
    </Provider>
  );
};

describe("SecondaryContainer", () => {
  test("draws nothing until now playing movies have loaded", () => {
    const { container } = renderWithMovies({
      nowPlayingMovies: null,
      popularMovies: null,
      trailerVideo: null,
    });
    expect(container).toBeEmptyDOMElement();
  });

  test("shows all five rows once data is available", () => {
    renderWithMovies({
      nowPlayingMovies: [{ id: 1, poster_path: "/a.jpg" }],
      popularMovies: [{ id: 2, poster_path: "/b.jpg" }],
      trailerVideo: null,
    });

    ["Now Playing", "Trending", "Popular", "Upcoming Movies", "Horror"].forEach(
      (title) => expect(screen.getByText(title)).toBeInTheDocument()
    );
    // 4 rows reuse the now playing list + 1 popular row = 5 posters.
    expect(screen.getAllByAltText("Movie Card")).toHaveLength(5);
  });
});
