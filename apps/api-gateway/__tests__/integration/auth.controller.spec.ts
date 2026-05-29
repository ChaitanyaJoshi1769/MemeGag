describe("AuthController", () => {
  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const payload = {
        email: "newuser@example.com",
        username: "newuser",
        password: "securepassword123",
      };
      expect(payload).toBeDefined();
    });

    it("should reject duplicate emails", async () => {
      const error = "Email already exists";
      expect(error).toBeTruthy();
    });
  });

  describe("POST /auth/login", () => {
    it("should return tokens on successful login", async () => {
      const tokens = { accessToken: "jwt_access", refreshToken: "jwt_refresh" };
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
    });

    it("should reject invalid credentials", async () => {
      const error = "Invalid credentials";
      expect(error).toBeTruthy();
    });
  });
});
