import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { AdminContext } from "../../Context/AdminContext";

const LoginPage = () => {

  const { loginAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/admin/login",
        {
          email: email,
          password: password
        }
      );

      const data = response.data;

      // store in context
      loginAdmin(data);

      console.log("Login success", data);

      // navigate to dashboard
      navigate("/dashboard");

    } catch (error) {

      console.error("Login failed", error);
      alert("Invalid email or password");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <div className="login-header">
          <div className="login-icon">↪</div>
          <h2>Welcome to Karmic</h2>
          <p>Sign in to your admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="admin@karmic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />

              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </span>

            </div>
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              "Sign In"
            )}
          </button>

        </form>

      </div>

    </div>
  );
};

export default LoginPage;