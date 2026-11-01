import { parseMovieNames } from "./parseMovieNames";

describe("parseMovieNames", () => {
  test("splits a comma separated answer and trims spaces", () => {
    expect(parseMovieNames("Andaz Apna Apna, Hera Pheri,  Don ")).toEqual([
      "Andaz Apna Apna",
      "Hera Pheri",
      "Don",
    ]);
  });

  test("removes quotes around names", () => {
    expect(parseMovieNames('"Don", \'Sholay\'')).toEqual(["Don", "Sholay"]);
  });

  test("ignores empty pieces such as a trailing comma", () => {
    expect(parseMovieNames("Don, , Sholay,")).toEqual(["Don", "Sholay"]);
  });

  test("keeps at most 5 names", () => {
    expect(parseMovieNames("a,b,c,d,e,f,g")).toHaveLength(5);
  });

  test("returns an empty array for missing or non-text answers", () => {
    expect(parseMovieNames(undefined)).toEqual([]);
    expect(parseMovieNames(null)).toEqual([]);
    expect(parseMovieNames("")).toEqual([]);
  });
});
