// The text layer on top of the trailer: title, overview and two buttons.
// Pure presentational component: everything arrives as props.
//
// HOW THE LAYERING WORKS: this div is `absolute`, so it is taken out of the
// normal flow and drawn ON TOP of VideoBackground, which sits in the normal
// flow right after it. `aspect-video` gives it the same 16:9 shape as the
// video so the two line up, and `bg-gradient-to-r from-black` fades from
// solid black on the left to transparent so the text is readable while the
// trailer stays visible on the right.
//
// Responsive: `hidden md:inline-block` hides the overview and the "More Info"
// button on phones and shows them from the medium breakpoint up. Un-prefixed
// classes (like text-2xl) are the phone size, `md:` ones override them.
// (We use w-full instead of w-screen: w-screen includes the scrollbar width
// and can cause a sideways scrollbar on Windows.)
const VideoTitle = ({ title, overview }) => {
  return (
    <div className="w-full aspect-video pt-[20%] px-6 md:px-24 absolute text-white bg-gradient-to-r from-black">
      <h1 className="text-2xl md:text-6xl font-bold">{title}</h1>
      <p className="hidden md:inline-block py-6 text-lg w-1/4">{overview}</p>
      <div className="my-4 md:m-0">
        <button className="bg-white text-black py-1 md:py-4 px-3 md:px-12 text-xl rounded-lg hover:bg-opacity-80">
          ▶️ Play
        </button>
        <button className="hidden md:inline-block mx-2 bg-gray-500 text-white p-4 px-12 text-xl bg-opacity-50 rounded-lg">
          More Info
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
