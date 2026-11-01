import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import gptReducer from "../utils/gptSlice";
import configReducer from "../utils/configSlice";
import { getOpenAIClient } from "../utils/openai";
import { OPENAI_MODEL } from "../utils/constants";
import GptSearchBar from "./GptSearchBar";

// MOCKING: we never want a test to call the real OpenAI or TMDB (slow, costs
// money, needs keys). jest.mock replaces the whole openai module with a fake
// whose getOpenAIClient we can program per test. global.fetch (used for TMDB)
// is replaced the same way.
jest.mock("../utils/openai", () => ({ getOpenAIClient: jest.fn() }));

const setup = () => {
  const store = configureStore({
    reducer: { gpt: gptReducer, config: configReducer },
  });
  render(
    <Provider store={store}>
      <GptSearchBar />
    </Provider>
  );
  return store;
};

const type = (text) =>
  fireEvent.change(screen.getByPlaceholderText(/what would you like to watch/i), {
    target: { value: text },
  });

const clickSearch = () =>
  fireEvent.click(screen.getByRole("button", { name: "Search" }));

describe("GptSearchBar", () => {
  let create;

  beforeEach(() => {
    create = jest.fn();
    getOpenAIClient.mockReturnValue({ chat: { completions: { create } } });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ id: 1, poster_path: "/x.jpg" }] }),
    });
  });

  test("asks GPT, searches TMDB once per name, and saves the results", async () => {
    create.mockResolvedValue({
      choices: [{ message: { content: "Hera Pheri,  Don & Co" } }],
    });
    const store = setup();

    type("funny movies");
    clickSearch();

    await waitFor(() =>
      expect(store.getState().gpt.movieNames).toEqual(["Hera Pheri", "Don & Co"])
    );

    // The prompt contains the user's text and the configured model is used.
    const request = create.mock.calls[0][0];
    expect(request.model).toBe(OPENAI_MODEL);
    expect(request.messages[0].content).toContain("funny movies");

    // One TMDB request per movie, with the name safely encoded.
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch.mock.calls[0][0]).toContain("query=Hera%20Pheri");
    expect(global.fetch.mock.calls[1][0]).toContain("query=Don%20%26%20Co");

    expect(store.getState().gpt.movieResults).toHaveLength(2);
  });

  test("shows the error message when GPT fails", async () => {
    create.mockRejectedValue(new Error("You exceeded your current quota"));
    const store = setup();

    type("anything");
    clickSearch();

    expect(await screen.findByText("You exceeded your current quota")).toBeInTheDocument();
    expect(store.getState().gpt.movieNames).toBeNull();
    // The button is usable again after the failure.
    expect(screen.getByRole("button", { name: "Search" })).toBeEnabled();
  });

  test("shows a message when GPT returns no usable names", async () => {
    create.mockResolvedValue({ choices: [{ message: { content: " , " } }] });
    setup();

    type("anything");
    clickSearch();

    expect(await screen.findByText(/did not suggest any movies/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("does nothing for an empty search", () => {
    setup();
    clickSearch();
    expect(create).not.toHaveBeenCalled();
  });
});
