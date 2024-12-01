import { useState, FormEvent } from "react";
import { AuthMode, User, LoginCredentials } from "../types/types";
import { authService } from "../services/api";

interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (user: User) => void;
  onToggleMode: () => void;
}

export default function AuthForm({
  mode,
  onSubmit,
  onToggleMode,
}: AuthFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await (mode === "login"
        ? authService.login(userData)
        : authService.register(userData));

      onSubmit(response.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "An error occurred during authentication");
      } else {
        setError("An error occurred during authentication");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : mode === "login" ? "Login" : "Register"}
        </button>
      </form>

      <button
        type="button"
        onClick={onToggleMode}
        className="toggle-mode-button"
      >
        {mode === "login"
          ? "Need an account? Register"
          : "Already have an account? Login"}
      </button>
    </div>
  );
}
