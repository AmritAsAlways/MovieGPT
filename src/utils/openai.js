import OpenAI from "openai";
import { OPENAI_KEY } from "./constants";

// OPENAI CLIENT, created LAZILY (only when first needed).
//
// Why not `const openai = new OpenAI(...)` at the top of the file, as the
// original does? The OpenAI library throws an error the moment it is created
// without a key. A top-level `new OpenAI()` runs as soon as this file is
// imported, and this file is imported (through Browse) by the whole app, so
// a missing key would crash even the login page. With a function, nothing
// runs until the user actually searches, and we can show a friendly message.
let client = null;

export const getOpenAIClient = () => {
  if (!OPENAI_KEY) {
    throw new Error(
      "Missing REACT_APP_OPENAI_KEY. Add your OpenAI API key to .env and restart `npm start`."
    );
  }

  // Create it once and reuse it on later searches.
  if (!client) {
    client = new OpenAI({
      apiKey: OPENAI_KEY,
      // SECURITY NOTE: the OpenAI library refuses to run in a browser by
      // default, and for good reason. Everything in a React app is sent to
      // the visitor's browser, including this key (anyone can read it in
      // DevTools > Sources or Network) and then spend YOUR money with it.
      // This flag means "I understand the risk", which is acceptable for a
      // personal learning project IF you:
      //   - create a dedicated key with a low monthly spending limit,
      //   - never deploy it publicly with a key that has a large budget.
      // The proper design for a real product: keep the key on a small server
      // (e.g. a serverless function), let the browser call YOUR endpoint, and
      // let that endpoint call OpenAI.
      dangerouslyAllowBrowser: true,
    });
  }
  return client;
};
