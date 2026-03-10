import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Employee.css";
import { EmployeeContext } from "../../Context/EmployeeContext";

const EmployeeLogin = () => {

  const { loginEmployee } = useContext(EmployeeContext);
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
        "https://attendance-backend-long-meadow-1623.fly.dev/employee/login",
        {
          email,
          password
        }
      );

      const data = response.data;

      // Save employee in context
      loginEmployee(data);

      // Console logs
      console.log("Employee Login Success:", data.employee);

      console.log("Office Latitude:", data.employee.office_latitude);
      console.log("Office Longitude:", data.employee.office_longitude);

      console.log(
        "Office Location:",
        `${data.employee.office_latitude}, ${data.employee.office_longitude}`
      );

      navigate("/scan");

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

          <h2>Employee Login</h2>

          <p>Sign in to mark attendance</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="employee@company.com"
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
            {loading ? <div className="spinner"></div> : "Sign In"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default EmployeeLogin;