import gptReducer, {
  toggleGptSearchView,
  addGptMovieResult,
} from "./gptSlice";
import configReducer, { changeLanguage } from "./configSlice";

describe("gptSlice", () => {
  const initial = { showGptSearch: false, movieNames: null, movieResults: null };

  test("starts on the normal browse view with no results", () => {
    expect(gptReducer(undefined, { type: "@@INIT" })).toEqual(initial);
  });

  test("toggle flips the view each time it is dispatched", () => {
    const once = gptReducer(initial, toggleGptSearchView());
    expect(once.showGptSearch).toBe(true);
    expect(gptReducer(once, toggleGptSearchView()).showGptSearch).toBe(false);
  });

  test("stores names and results together, keeping their order", () => {
    const payload = {
      movieNames: ["Don", "Sholay"],
      movieResults: [[{ id: 1 }], [{ id: 2 }]],
    };
    const next = gptReducer(initial, addGptMovieResult(payload));
    expect(next.movieNames).toEqual(payload.movieNames);
    expect(next.movieResults).toEqual(payload.movieResults);
    expect(next.showGptSearch).toBe(false);
  });
});

describe("configSlice", () => {
  test("defaults to English and can change language", () => {
    expect(configReducer(undefined, { type: "@@INIT" })).toEqual({ lang: "en" });
    expect(configReducer({ lang: "en" }, changeLanguage("hindi")).lang).toBe(
      "hindi"
    );
  });
});
