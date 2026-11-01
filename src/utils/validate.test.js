import { checkValidData } from "./validate";

// Jest test file (react-scripts runs it with `npm test`).
// Pattern: describe() groups related tests, test() is one scenario,
// expect(actual).toBe(expected) asserts the result.

describe("checkValidData", () => {
  const goodEmail = "user@example.com";
  const goodPassword = "Passw0rdOK";

  test("returns null when email and password are valid", () => {
    expect(checkValidData(goodEmail, goodPassword)).toBeNull();
  });

  test("rejects emails with no @ or no domain ending", () => {
    expect(checkValidData("userexample.com", goodPassword)).toBe(
      "Email ID is not valid"
    );
    expect(checkValidData("user@example", goodPassword)).toBe(
      "Email ID is not valid"
    );
    expect(checkValidData("", goodPassword)).toBe("Email ID is not valid");
  });

  test("rejects an email with extra text around it", () => {
    expect(checkValidData("hi user@example.com", goodPassword)).toBe(
      "Email ID is not valid"
    );
  });

  test("rejects passwords that break each rule", () => {
    const passwordError = checkValidData(goodEmail, "Short1a");
    expect(passwordError).toMatch(/^Password must be/);

    expect(checkValidData(goodEmail, "nouppercase1")).toMatch(/^Password/); // no uppercase
    expect(checkValidData(goodEmail, "NOLOWERCASE1")).toMatch(/^Password/); // no lowercase
    expect(checkValidData(goodEmail, "NoNumberHere")).toMatch(/^Password/); // no digit
  });

  test("checks the email before the password", () => {
    expect(checkValidData("bad", "bad")).toBe("Email ID is not valid");
  });
});
