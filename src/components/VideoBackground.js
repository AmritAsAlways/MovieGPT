import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

// The trailer behind the title. This is where Section 4's hook gets used:
//   useMovieTrailer(movieId) -> fetches the videos -> stores the trailer in Redux
//   useSelector(...)         -> reads it back and re-renders when it arrives
//
// The YouTube EMBED URL is  https://www.youtube.com/embed/<video key>
//   autoplay=1 -> start playing by itself
//   mute=1     -> required: browsers only allow autoplay when muted
//
// The iframe is drawn only once we HAVE a key. Without that check the first
// render would request ".../embed/undefined" (the original project does).
// The wrapper keeps the 16:9 space reserved (aspect-video, black) so the page
// does not jump when the video appears.
const VideoBackground = ({ movieId }) => {
  const trailerVideo = useSelector((store) => store.movies.trailerVideo);

  useMovieTrailer(movieId);

  return (
    <div className="relative w-full aspect-video bg-black">
      {trailerVideo?.key && (
        <iframe
          className="w-full aspect-video"
          src={
            "https://www.youtube.com/embed/" +
            trailerVideo.key +
            "?&autoplay=1&mute=1"
          }
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      )}
      {/* Fades the bottom of the video into the black rows below it. */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-black" />
    </div>
  );
};

export default VideoBackground;
