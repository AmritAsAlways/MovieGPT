import { render, screen } from "@testing-library/react";
import MovieCard from "./MovieCard";
import { IMG_CDN_URL } from "../utils/constants";

// React Testing Library renders a component into a fake browser (jsdom) and
// lets you query it the way a USER sees it (by text, by alt text), rather
// than by implementation details.

describe("MovieCard", () => {
  test("shows the poster using the TMDB image address", () => {
    render(<MovieCard posterPath="/abc.jpg" />);
    expect(screen.getByAltText("Movie Card")).toHaveAttribute(
      "src",
      IMG_CDN_URL + "/abc.jpg"
    );
  });

  test("draws nothing when the movie has no poster", () => {
    const { container } = render(<MovieCard posterPath={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
