import { render, screen } from "@testing-library/react";
import MovieList from "./MovieList";

describe("MovieList", () => {
  const movies = [
    { id: 1, poster_path: "/one.jpg" },
    { id: 2, poster_path: "/two.jpg" },
    { id: 3, poster_path: null }, // no poster -> no card
  ];

  test("shows the title and one poster per movie that has one", () => {
    render(<MovieList title="Popular" movies={movies} />);
    expect(screen.getByText("Popular")).toBeInTheDocument();
    expect(screen.getAllByAltText("Movie Card")).toHaveLength(2);
  });

  test("does not crash while the movies are still loading (null)", () => {
    render(<MovieList title="Popular" movies={null} />);
    expect(screen.getByText("Popular")).toBeInTheDocument();
    expect(screen.queryAllByAltText("Movie Card")).toHaveLength(0);
  });
});
