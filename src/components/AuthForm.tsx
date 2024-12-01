import { useState, FormEvent } from "react";
import { AuthMode, User } from "../types/types";
import { authService } from "../services/api";

interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (user: User) => void;
  onToggleMode: () => void;
}

function AuthForm({ mode, onSubmit, onToggleMode }: AuthFormProps) {
  const [formData, setFormData] = useState<User>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await (mode === "login"
        ? authService.login(formData.email, formData.password)
        : authService.register(formData.email, formData.password));
      onSubmit(user);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "An error occurred during authentication"
      );
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
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Loading..." : mode === "login" ? "Login" : "Register"}
        </button>
      </form>
      <p className="auth-toggle">
        {mode === "login"
          ? "Don't have an account?"
          : "Already have an account?"}
        <button className="link-button" onClick={onToggleMode}>
          {mode === "login" ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default AuthForm;
