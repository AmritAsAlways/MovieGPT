import { useState, useRef } from "react";
import Header from "./Header";
import { checkValidData } from "../utils/validate";

// LOGIN PAGE (Section 2: UI + validation only).
// Section 3 will add the real Firebase sign in / sign up inside
// handleButtonClick, at the spot marked below.
//
// EXECUTION FLOW when the user clicks the button:
//   1. handleButtonClick reads the three inputs through their refs
//   2. checkValidData() returns an error message or null
//   3. setErrorMessage() stores it -> React re-renders -> message shows under the form
//   4. if there was an error we stop; otherwise Section 3 continues from here
const Login = () => {
  // STATE (useState): values that, when changed, make React re-render.
  // isSignInForm decides which version of the form is drawn.
  const [isSignInForm, setIsSignInForm] = useState(true);
  // errorMessage is null (show nothing) or a string (show it in red).
  const [errorMessage, setErrorMessage] = useState(null);

  // REFS (useRef): a ref is a box ({ current: ... }) that React fills with the
  // real DOM element once it is on screen, via the `ref={...}` attribute.
  // We use refs instead of state for the inputs because we only need their
  // values at ONE moment (the click). With state we would re-render the whole
  // form on every keystroke for no benefit.
  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const handleButtonClick = () => {
    // Validate the form data. Note: the name field only exists in sign up
    // mode and the original project does not validate it, so we don't either.
    const message = checkValidData(email.current.value, password.current.value);
    setErrorMessage(message);

    // Early return: a "guard clause". If there is an error, do not continue.
    if (message) return;

    // ---- Section 3 plugs in here ----
    // isSignInForm ? signInWithEmailAndPassword(...) : createUserWithEmailAndPassword(...)
    // `name.current?.value` will be used to save the display name on sign up.
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    // Clear an old error so "Sign In" errors don't linger on the Sign Up form.
    setErrorMessage(null);
  };

  return (
    <div>
      <Header />

      {/* Full-screen background. A CSS gradient stands in for the original
          project's Netflix photo; swap it for an <img> later if you like. */}
      <div className="absolute inset-0 -z-0 bg-gradient-to-br from-gray-900 via-black to-red-950" />

      {/* The form is a card centred horizontally with `left-0 right-0 mx-auto`.
          On phones it takes the full width (w-full), from the `md:` breakpoint
          up it takes 3/12 of the width (md:w-3/12). Tailwind is mobile-first:
          un-prefixed classes apply everywhere, `md:` ones only on wider screens. */}
      <form
        // The browser's default is to reload the page when a form submits.
        // We handle everything in JavaScript, so we cancel that.
        onSubmit={(e) => e.preventDefault()}
        className="w-full md:w-3/12 min-w-[320px] absolute p-12 bg-black my-36 mx-auto right-0 left-0 text-white rounded-lg bg-opacity-80"
      >
        <h1 className="font-bold text-3xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>

        {/* CONDITIONAL RENDERING: `condition && <jsx />` draws the JSX only
            when the condition is true. The Full Name input exists only while
            signing up. */}
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

        {/* Shows nothing while errorMessage is null. */}
        <p className="text-red-500 font-bold text-lg py-2">{errorMessage}</p>

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
