import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ add this

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Controlled inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ navigator

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic guard
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      // 🔁 Call your backend login API (replace URL and shape as needed)
      // Using fetch for zero dependencies; you can swap with axios if you prefer.
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // If your API returns a message, surface it
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Invalid email or password.");
      }

      const data = await res.json(); // e.g., { token, user: { ... } }

      // ✅ Store token / user (optional, but common)
      if (data?.token) localStorage.setItem("token", data.token);
      if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Navigate to main page (dashboard)
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100">
      {/* Outer container to center the card */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-9 col-md-7 col-lg-5">
            <div className="card border-0 shadow-sm auth-card">
              <div className="card-body p-4 p-md-4">
                {/* Brand */}
                <div className="d-flex align-items-center mb-2">
                  <div className="brand-dot me-2"></div>
                  <h1 className="fw-bold fs-4 mb-0">WORKIN</h1>
                </div>

                {/* Heading & subtext */}
                <h6 className="h5 fw-semibold mb-1">Welcome back</h6>
                <p className="text-muted mb-3 small">
                  Sign in to continue to your dashboard.
                </p>

                {/* 🔔 Error Alert */}
                {error && (
                  <div className="alert alert-danger py-2 small" role="alert">
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Email */}
                  <div className="mb-2">
                    <label
                      htmlFor="email"
                      className="form-label small fw-medium mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control form-control-sm rounded-3"
                      placeholder="name@company.com"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <label
                        htmlFor="password"
                        className="form-label small fw-medium mb-1"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        className="btn btn-link btn-sm text-decoration-none p-0"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-controls="password"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        disabled={loading}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    <div className="input-group input-group-sm">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="form-control rounded-3"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn btn-dark btn-sm w-100 rounded-3 py-2"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>

                {/* Divider */}
                <div className="d-flex align-items-center my-3">
                  <div className="flex-grow-1 border-top"></div>
                  <span className="mx-2 text-muted small">or</span>
                  <div className="flex-grow-1 border-top"></div>
                </div>

                {/* Footer links */}
                <p className="text-center text-muted mt-3 mb-0 small">
                  Don’t have an account?{" "}
                  <a href="/signup" className="text-decoration-none">
                    Create one
                  </a>
                </p>
              </div>
            </div>

            {/* Small footer to echo dashboard tone */}
            <div className="text-center mt-2">
              <small className="text-muted">
                © {new Date().getFullYear()} WORKIN
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
