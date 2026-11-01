import { APP_NAME } from "../utils/constants";

// Header is shown on every page, so it is a good home for app-wide logic.
// Right now it only draws the wordmark. It grows over the next sections:
//   Section 3: listens to Firebase auth changes (useEffect + onAuthStateChanged),
//              redirects with useNavigate, shows the user avatar and Sign Out
//   Section 6: adds the "GPT Search" toggle button and language dropdown
//
// Tailwind notes: "absolute w-screen" lets the header float over the page
// content, and "bg-gradient-to-b from-black" fades it from black to
// transparent so the movie banner shows through later.
const Header = () => {
  return (
    <div className="absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex flex-col md:flex-row justify-between">
      <h1 className="text-red-600 font-extrabold tracking-widest text-3xl py-3 mx-auto md:mx-0">
        {APP_NAME}
      </h1>
    </div>
  );
};

export default Header;
