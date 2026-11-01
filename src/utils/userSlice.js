import { createSlice } from "@reduxjs/toolkit";

// A "slice" bundles together a piece of state, the functions that can change
// it (reducers) and the action creators used to trigger those changes.
//
// This slice stores the signed-in user:
//   null                                   -> nobody is signed in
//   { uid, email, displayName, photoURL }  -> signed-in user
//
// Section 3 connects it to Firebase: when Firebase reports a user we call
// addUser(); when they sign out we call removeUser(). Any component can then
// read the user with useSelector((store) => store.user).
const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    // Redux Toolkit normally lets you "mutate" state inside a reducer (it
    // uses a library called Immer behind the scenes). That trick does not
    // work when the whole state IS null, so here we RETURN the new value.
    // Returning a value replaces the entire state.
    addUser: (state, action) => action.payload,
    removeUser: () => null,
  },
});

// Action creators: addUser(userData) builds { type: "user/addUser", payload: userData }.
export const { addUser, removeUser } = userSlice.actions;

// The reducer is what appStore.js plugs in under the "user" key.
export default userSlice.reducer;
