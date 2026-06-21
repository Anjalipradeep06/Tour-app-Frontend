import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { loginUser } from "../../redux/thunks/authThunk";
import { clearError, clearMessage } from "../../redux/slices/authSlice";

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  // SUCCESS TOAST
  useEffect(() => {
    if (success && message) {
      toast.success(message, { toastId: "login-success" });
      dispatch(clearMessage());
    }
  }, [success, message, dispatch]);

  // ERROR TOAST
  useEffect(() => {
    if (error) {
      toast.error(error, { toastId: "login-error" });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // SAFE REDIRECT (FIXED LOOP)
  useEffect(() => {
    if (user?.id && !hasNavigated.current) {
      hasNavigated.current = true;

      navigate(user.role === "admin" ? "/admin" : "/", {
        replace: true,
      });
    }
  }, [user, navigate]);

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <Link to="/register">Create Account</Link>
      </div>
    </div>
  );
};

export default Login;