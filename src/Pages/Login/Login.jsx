import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { loginUser } from "../../redux/thunks/authThunk";
import {
  clearError,
  clearMessage,
} from "../../redux/slices/authSlice";

import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hasNavigated = useRef(false);

  const { user, loading, error, success, message } =
    useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }));
  };

  // SUCCESS TOAST
  useEffect(() => {
    if (success && message) {
      toast.success(message, {
        toastId: "login-success",
      });

      dispatch(clearMessage());
    }
  }, [success, message, dispatch]);

  // ERROR TOAST
  useEffect(() => {
    if (error) {
      toast.error(error, {
        toastId: "login-error",
      });

      dispatch(clearError());
    }
  }, [error, dispatch]);

  // SAFE NAVIGATION (FIXED LOOP)
  useEffect(() => {
    if (user?.id && !hasNavigated.current) {
      hasNavigated.current = true;

      setTimeout(() => {
        navigate(
          user.role === "admin" ? "/admin" : "/",
          { replace: true }
        );
      }, 50);
    }
  }, [user, navigate]);

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="login-overline">
          EST. ITINERARY 001
        </p>

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Continue your journey with Meridian.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter email"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <span>Don't have an account?</span>
          <Link to="/register">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;