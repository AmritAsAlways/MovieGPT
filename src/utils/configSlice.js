import { createSlice } from "@reduxjs/toolkit";

// CONFIG SLICE: app-wide settings. For now just the UI language.
// `lang` is one of the identifiers in SUPPORTED_LANGUAGES (constants.js) and
// also a key of the `lang` object in languageConstants.js.
const configSlice = createSlice({
  name: "config",
  initialState: {
    lang: "en",
  },
  reducers: {
    changeLanguage: (state, action) => {
      state.lang = action.payload;
    },
  },
});

export const { changeLanguage } = configSlice.actions;

export default configSlice.reducer;
