// The key is read from process.env when constants.js is first loaded, so each
// test sets the variable and then loads the module in a fresh "sandbox"
// (jest.isolateModules) to get a clean copy.

describe("getOpenAIClient", () => {
  const original = process.env.REACT_APP_OPENAI_KEY;
  afterEach(() => {
    process.env.REACT_APP_OPENAI_KEY = original;
  });

  test("throws a helpful message when the key is missing", () => {
    process.env.REACT_APP_OPENAI_KEY = "";
    jest.isolateModules(() => {
      const { getOpenAIClient } = require("./openai");
      expect(() => getOpenAIClient()).toThrow(/Missing REACT_APP_OPENAI_KEY/);
    });
  });

  test("returns the same client every time once a key exists", () => {
    process.env.REACT_APP_OPENAI_KEY = "sk-test";
    jest.isolateModules(() => {
      const { getOpenAIClient } = require("./openai");
      const first = getOpenAIClient();
      expect(first).toBeDefined();
      expect(getOpenAIClient()).toBe(first);
    });
  });
});
