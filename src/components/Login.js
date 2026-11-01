import { useState, useRef } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import Header from "./Header";
import { checkValidData } from "../utils/validate";
import { auth } from "../utils/firebase";
import { addUser } from "../utils/userSlice";
import { USER_AVATAR } from "../utils/constants";

// LOGIN PAGE (Section 2 built the form, Section 3 adds Firebase).
//
// EXECUTION FLOW when the user clicks the button:
//   1. Read the inputs through their refs and validate them (validate.js)
//   2. If invalid -> show the message and stop
//   3. Sign Up mode: create the account, then save name + avatar on it
//      Sign In mode: ask Firebase to sign the user in
//   4. NOTE what this file does NOT do: it never navigates to /browse.
//      When Firebase finishes, its auth state changes and the listener in
//      Header.js (onAuthStateChanged) updates Redux and does the redirect.
//      One place owns that logic, so it also works after a page refresh.
const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  // Refs: read input values only when the button is clicked (see Section 2).
  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const handleButtonClick = () => {
    const message = checkValidData(email.current.value, password.current.value);
    setErrorMessage(message);
    if (message) return;

    if (!isSignInForm) {
      // ---- SIGN UP ----
      // Firebase calls return Promises: the work happens in the background and
      // .then() runs on success, .catch() on failure.
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;

          // A brand new Firebase account has no name or picture, so we save
          // them with updateProfile (a second request).
          return updateProfile(user, {
            displayName: name.current.value,
            photoURL: USER_AVATAR,
          }).then(() => {
            // Why dispatch again here? Firebase announces the new user
            // (-> Header's listener -> addUser) as soon as the account exists,
            // which is BEFORE updateProfile finishes. That first copy in Redux
            // therefore has displayName = null. Now that the profile is
            // saved, we read the fresh data from auth.currentUser and
            // overwrite it so the header shows the right avatar.
            const { uid, email, displayName, photoURL } = auth.currentUser;
            dispatch(addUser({ uid, email, displayName, photoURL }));
          });
        })
        .catch((error) => {
          // error.code looks like "auth/email-already-in-use"
          setErrorMessage(error.code + " - " + error.message);
        });
    } else {
      // ---- SIGN IN ----
      // On success we do nothing here on purpose; the Header listener reacts.
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      ).catch((error) => {
        setErrorMessage(error.code + " - " + error.message);
      });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage(null);
  };

  return (
    <div>
      <Header />

      {/* Full-screen background. A CSS gradient stands in for the original
          project's Netflix photo; swap it for an <img> later if you like. */}
      <div className="absolute inset-0 -z-0 bg-gradient-to-br from-gray-900 via-black to-red-950" />

      {/* Tailwind is mobile-first: un-prefixed classes apply everywhere,
          `md:` ones only from the medium breakpoint up. */}
      <form
        // Stop the browser's default "reload the page on submit".
        onSubmit={(e) => e.preventDefault()}
        className="w-full md:w-3/12 min-w-[320px] absolute p-12 bg-black my-36 mx-auto right-0 left-0 text-white rounded-lg bg-opacity-80"
      >
        <h1 className="font-bold text-3xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>

        {/* Conditional rendering: the name field exists only while signing up. */}
        {!isSignInForm && (
          <input
            ref={name}
            type="text"
            placeholder="Full Name"
            className="p-4 my-4 w-full bg-gray-700 rounded"
          />
        )}
        <input
          ref={email}
          type="text"
          placeholder="Email Address"
          className="p-4 my-4 w-full bg-gray-700 rounded"
        />
        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="p-4 my-4 w-full bg-gray-700 rounded"
        />

        {errorMessage && (
          <p className="text-red-500 font-bold text-lg py-2">{errorMessage}</p>
        )}

        <button
          className="p-4 my-6 bg-red-700 hover:bg-red-600 w-full rounded-lg"
          onClick={handleButtonClick}
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>

        <p className="py-4 cursor-pointer" onClick={toggleSignInForm}>
          {isSignInForm
            ? "New to MovieGPT? Sign Up Now"
            : "Already registered? Sign In Now."}
        </p>
      </form>
    </div>
  );
};

export default Login;
