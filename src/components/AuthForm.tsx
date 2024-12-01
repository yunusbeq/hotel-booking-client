import { useState, FormEvent } from "react";
import { AuthMode, User } from "../types/types";

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="auth-form">
      <h2>{mode === "login" ? "Login" : "Register"}</h2>
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
        <button type="submit" className="submit-button">
          {mode === "login" ? "Login" : "Register"}
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
