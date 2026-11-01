import { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { APP_NAME, SUPPORTED_LANGUAGES } from "../utils/constants";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { toggleGptSearchView } from "../utils/gptSlice";
import { changeLanguage } from "../utils/configSlice";

// Header is rendered on every page, which makes it the right home for the
// app-wide AUTH LISTENER, and for the controls that belong to the whole app:
// the GPT Search toggle and the language picker (Section 6).
const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Read from Redux. When any of these values change, React re-renders this
  // component automatically.
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const langKey = useSelector((store) => store.config.lang);

  const handleSignOut = () => {
    // We only ask Firebase to sign out. We do NOT clear Redux or navigate
    // here: Firebase will announce "no user" and the listener below does both.
    signOut(auth).catch((error) => {
      // Real error handling arrives in Section 7.
      console.error("Sign out failed:", error);
    });
  };

  const handleGptSearchClick = () => {
    // Flip the Browse page between the movie rows and the GPT search view.
    dispatch(toggleGptSearchView());
  };

  const handleLanguageChange = (e) => {
    // e.target.value is the `value` of the chosen <option>, e.g. "hindi".
    dispatch(changeLanguage(e.target.value));
  };

  // ---- THE AUTH LISTENER ----------------------------------------------------
  // useEffect runs code AFTER the component appears on screen. It is the
  // place for "side effects": things that reach outside React, like
  // subscribing to Firebase.
  //
  // onAuthStateChanged is the OBSERVER pattern: we hand Firebase a callback and
  // Firebase calls it (a) once right away with the current state and (b) every
  // time someone signs in or out, including after a page refresh.
  //
  // Flow:  Firebase says "user X"   -> addUser(X) into Redux -> go to /browse
  //        Firebase says "no user"  -> removeUser() from Redux -> go to /
  // That is also how an anonymous visitor typing /browse gets sent to the
  // login page, and a signed-in visitor on "/" gets sent to /browse.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const { uid, email, displayName, photoURL } = firebaseUser;
        dispatch(addUser({ uid, email, displayName, photoURL }));
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });

    // CLEANUP: the function returned from useEffect runs when this Header is
    // removed from the screen. Login and Browse each render their OWN Header,
    // so moving between pages destroys one Header and creates another. Without
    // this line the old listener would stay subscribed forever and every
    // sign-in would trigger several dispatches and redirects (a memory leak).
    return () => unsubscribe();

    // The array is the "dependency list": the effect re-runs only if one of
    // these values changes. dispatch and navigate never change identity, so
    // this still runs just once per Header, and the lint rule is satisfied.
  }, [dispatch, navigate]);

  return (
    <div className="absolute w-full px-8 py-2 bg-gradient-to-b from-black z-10 flex flex-col md:flex-row justify-between">
      <h1 className="text-red-600 font-extrabold tracking-widest text-3xl py-3 mx-auto md:mx-0">
        {APP_NAME}
      </h1>

      {/* Only shown while someone is signed in. `user && ...` draws nothing
          when user is null. */}
      {user && (
        <div className="flex p-2 justify-between items-center">
          {/* The language picker only makes sense on the GPT page, where the
              search bar's texts are translated. */}
          {showGptSearch && (
            <select
              // A "controlled" select: its value always comes from Redux, so
              // the dropdown and the store can never disagree.
              value={langKey}
              className="p-2 m-2 bg-gray-900 text-white"
              onChange={handleLanguageChange}
              aria-label="Language"
            >
              {SUPPORTED_LANGUAGES.map((language) => (
                <option key={language.identifier} value={language.identifier}>
                  {language.name}
                </option>
              ))}
            </select>
          )}
          <button
            className="py-2 px-4 mx-4 my-2 bg-purple-800 text-white rounded-lg"
            onClick={handleGptSearchClick}
          >
            {showGptSearch ? "Homepage" : "GPT Search"}
          </button>
          <img
            className="hidden md:block w-12 h-12 rounded"
            alt="user avatar"
            src={user.photoURL}
          />
          <button onClick={handleSignOut} className="font-bold text-white mx-2">
            (Sign Out)
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
