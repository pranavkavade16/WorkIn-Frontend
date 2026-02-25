import { NavLink } from "react-router-dom";
import { logout } from "../utils/logout";

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const SideBar = () => {
  const user = getStoredUser();
  const name = user?.name ?? "User";
  const email = user?.email ?? "";
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div>
      <aside className="sidebar d-flex flex-column min-vh-100 p-3">
        <h5
          className="brand ms-3 mt-3 mb-3"
          style={{
            fontSize: "30px",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: "500",
            color: "#D22B2B",
          }}
        >
          WorkIn
        </h5>

        <hr className="line" />

        <ul className="nav flex-column mt-4 gap-2">
          <li className="nav-item">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-ui-checks-grid me-3"></i>
              Dashboard
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-folder-plus me-3"></i>
              Projects
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/teams"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-people me-3"></i>
              Teams
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-graph-up-arrow me-3"></i>
              Reports
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-gear me-3"></i>
              Settings
            </NavLink>
          </li>
        </ul>

        <div className="mt-auto small text-muted">
          <hr className="line" />
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle bg-dark text-white d-inline-flex align-items-center justify-content-center me-2"
              style={{ width: 32, height: 32 }}
            >
              {initials}
            </div>
            <div>
              <div className="fw-semibold">{name}</div>
              <div>{email}</div>
            </div>
          </div>
        </div>

        <hr className="line" />

        <a
          className="d-inline-block mt-3 text-danger text-decoration-none mb-4 "
          onClick={logout}
        >
          <i
            class="bi bi-box-arrow-left ms-2 me-3"
            style={{ color: "gray" }}
          ></i>
          Logout
        </a>
      </aside>
    </div>
  );
};

export default SideBar;
