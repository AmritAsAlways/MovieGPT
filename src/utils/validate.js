// FORM VALIDATION: a "pure function" (same input -> same output, no side
// effects, no React). Keeping it out of the component has two benefits:
//   1. Login.js stays focused on UI.
//   2. It is trivial to unit test (see validate.test.js).
//
// Returns an error message string when something is wrong, or null when
// both values are fine. Returning null for "no error" lets the caller write
// the short check:  if (message) return;

// Regular expressions (regex) describe text patterns. They are defined once
// here so they are not rebuilt on every call.

// Email: letters/digits/._%- before the @, then a domain, a dot and a
// 2+ letter ending (like .com or .in).
//   ^ and $  -> the WHOLE string must match, not just a part of it
const EMAIL_REGEX = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

// Password: at least 8 characters with a digit, a lowercase and an uppercase
// letter. Each (?=...) is a "lookahead": it checks that a condition is true
// somewhere in the string without consuming characters, so the three rules
// can be checked independently, in any order.
//   (?=.*\d)     -> contains a digit
//   (?=.*[a-z])  -> contains a lowercase letter
//   (?=.*[A-Z])  -> contains an uppercase letter
//   .{8,}        -> and is at least 8 characters long
// (The original project also had a redundant (?=.*[a-zA-Z]) lookahead; the
// lowercase and uppercase rules already guarantee a letter, so it is dropped.)
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const checkValidData = (email, password) => {
  if (!EMAIL_REGEX.test(email)) return "Email ID is not valid";
  if (!PASSWORD_REGEX.test(password)) {
    return "Password must be 8+ characters with a number, an uppercase and a lowercase letter";
  }

  return null;
};
