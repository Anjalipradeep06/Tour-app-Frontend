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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [passwordError, setPasswordError] =
    useState("");

  const {
    name,
    email,
    password,
    confirmPassword,
    role,
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
        role,
      })
    );
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <p className="register-overline">
          EST. ITINERARY 002
        </p>

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Join Meridian and begin planning
          unforgettable journeys.
        </p>

        {(error || passwordError) && (
          <div className="register-error">
            {passwordError || error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

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
              placeholder="Enter email"
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
              placeholder="Create password"
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
              placeholder="Confirm password"
              required
            />
          </div>

          <div className="form-group">
            <label>Account Type</label>

            <select
              name="role"
              value={role}
              onChange={handleChange}
            >
              <option value="user">
                Traveler
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>

          <button
            className="register-btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <div className="register-footer">
          Already have an account?

          <Link to="/login">
            Sign In
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Register;