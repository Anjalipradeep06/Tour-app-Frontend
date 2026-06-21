import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../../redux/thunks/authThunk";
import { clearError } from "../../redux/slices/authSlice";

import "./Register.css";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector(
    (state) => state.auth
  );

  const [passwordError, setPasswordError] =
    useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    name,
    email,
    password,
    confirmPassword,
  } = formData;

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError(
        "Passwords do not match."
      );
      return;
    }

    setPasswordError("");

    dispatch(
      registerUser({
        name,
        email,
        password,
        role: "user",
      })
    );
  };

  return (
    <div className="register-page">
      <div className="register-overlay" />

      <div className="register-card">
        <div className="register-header">
          <span className="register-badge">
            START YOUR JOURNEY
          </span>

          <h1>Create your account</h1>

          <p>
            Discover curated experiences,
            unforgettable destinations, and
            seamless bookings worldwide.
          </p>
        </div>

        {(error || passwordError) && (
          <div className="register-error">
            {passwordError || error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="register-form"
        >
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
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
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            className="register-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        <div className="register-footer">
          Already have an account?

          <Link to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;