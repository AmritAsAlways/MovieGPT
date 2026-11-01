import { IMG_CDN_URL } from "../utils/constants";

// The smallest building block: ONE poster image.
// It is a "presentational" component: it receives everything through props
// and knows nothing about Redux or fetching, which makes it easy to reuse
// (the GPT search results in Section 6 use it too) and easy to test.
//
// TMDB gives only the END of the image address (e.g. "/abc123.jpg"), so we
// glue it onto the CDN base URL. Some movies have no poster at all
// (posterPath is null); we draw nothing for those instead of a broken image.
const MovieCard = ({ posterPath }) => {
  if (!posterPath) return null;

  return (
    <div className="w-36 md:w-48 pr-4 shrink-0 transition-transform duration-200 hover:scale-105 cursor-pointer">
      <img
        className="rounded"
        alt="Movie Card"
        src={IMG_CDN_URL + posterPath}
      />
    </div>
  );
};

export default MovieCard;
