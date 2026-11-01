import moviesReducer, {
  addNowPlayingMovies,
  addPopularMovies,
  addTrailerVideo,
} from "./moviesSlice";

// A reducer is just a function: (oldState, action) => newState.
// That makes it easy to test without React or a store.

describe("moviesSlice", () => {
  const empty = {
    nowPlayingMovies: null,
    popularMovies: null,
    trailerVideo: null,
  };

  test("starts with everything null (meaning: not loaded yet)", () => {
    expect(moviesReducer(undefined, { type: "@@INIT" })).toEqual(empty);
  });

  test("stores now playing movies without touching the other fields", () => {
    const movies = [{ id: 1 }, { id: 2 }];
    const next = moviesReducer(empty, addNowPlayingMovies(movies));
    expect(next).toEqual({ ...empty, nowPlayingMovies: movies });
  });

  test("stores popular movies", () => {
    const movies = [{ id: 3 }];
    const next = moviesReducer(empty, addPopularMovies(movies));
    expect(next.popularMovies).toEqual(movies);
    expect(next.nowPlayingMovies).toBeNull();
  });

  test("stores the trailer video", () => {
    const trailer = { key: "abc", type: "Trailer" };
    const next = moviesReducer(empty, addTrailerVideo(trailer));
    expect(next.trailerVideo).toEqual(trailer);
  });

  test("returns a NEW object and leaves the old state untouched (immutability)", () => {
    const next = moviesReducer(empty, addPopularMovies([{ id: 9 }]));
    expect(next).not.toBe(empty);
    expect(empty.popularMovies).toBeNull();
  });
});
