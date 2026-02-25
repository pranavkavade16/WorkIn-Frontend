import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useWorkInContext from "../context/workInContext";

const SignUp = () => {
  const { showToast } = useWorkInContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPassowrdMatching, setIsPasswordMatch] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const AddUser = async () => {
    if (user.password !== confirmPassword) {
      setIsPasswordMatch(!isPassowrdMatching);
      return;
    }

    try {
      const response = await fetch("https://work-in-backend.vercel.app/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to create a user");
      }

      const newUser = await response.json();
      console.log("User created successfully", newUser);
      showToast("Account created successfully!!");
      navigate("/");
    } catch (error) {
      console.log("Failed to create a new user", error.message);
    }
  };

  return (
    <div className="auth-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-9 col-md-7 col-lg-5">
            <div className="card border-0 shadow-sm auth-card">
              <div className="card-body p-4 p-md-4">
                <div className="d-flex align-items-center mb-2">
                  <div className="brand-dot me-2"></div>
                  <h1 className="fw-bold fs-4 mb-0">WORKIN</h1>
                </div>

                <h2 className="h5 fw-semibold mb-1">Create your account</h2>
                <p className="text-muted mb-3 small">
                  Join WORKIN and start organizing your work.
                </p>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    AddUser();
                  }}
                >
                  {/* Name */}
                  <div className="mb-2">
                    <label
                      htmlFor="name"
                      className="form-label small fw-medium mb-1"
                    >
                      Full name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-control form-control-sm rounded-3"
                      placeholder="John Wick"
                      required
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                    />
                  </div>

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
                      required
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <label
                        htmlFor="password"
                        className="form-label small fw-medium mb-1"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0"
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="form-control form-control-sm rounded-3"
                      placeholder="Create a strong password"
                      minLength={6}
                      required
                      value={user.password}
                      onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                      }
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <label
                        htmlFor="confirm"
                        className="form-label small fw-medium mb-1"
                      >
                        Confirm password
                      </label>
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0"
                        onClick={() => setShowConfirm((v) => !v)}
                      >
                        {showConfirm ? "Hide" : "Show"}
                      </button>
                    </div>

                    <input
                      type={showConfirm ? "text" : "password"}
                      id="confirm"
                      className="form-control form-control-sm rounded-3"
                      placeholder="Re-enter your password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  {isPassowrdMatching && (
                    <div className="alert alert-danger py-1 small" role="alert">
                      <p>Password does not match!!</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="btn btn-dark btn-sm w-100 rounded-3 py-2"
                  >
                    Create Account
                  </button>
                </form>

                <div className="d-flex align-items-center my-3">
                  <div className="flex-grow-1 border-top"></div>
                  <span className="mx-2 text-muted small">or</span>
                  <div className="flex-grow-1 border-top"></div>
                </div>

                <p className="text-center text-muted small">
                  Already have an account?{" "}
                  <a href="/" className="text-decoration-none">
                    Sign in
                  </a>
                </p>
              </div>
            </div>

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

export default SignUp;
