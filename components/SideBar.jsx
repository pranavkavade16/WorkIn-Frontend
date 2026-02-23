import { logout } from "../utils/logout";
const user = JSON.parse(localStorage.getItem("user"));
const SideBar = () => {
  return (
    <div>
      <aside className="sidebar d-flex flex-column min-vh-100 p-3">
        <h5 className="brand mt-2 mb-4">WorkIn</h5>
        <hr className="line" />
        <ul className="nav flex-column mt-4 gap-2">
          <li className="nav-item">
            <a className="nav-link active" href="/">
              <i class="bi bi-ui-checks-grid me-3"></i>
              Dashboard
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/projects">
              <i class="bi bi-folder-plus me-3"></i>
              Projects
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/teams">
              <i class="bi bi-people me-3"></i>
              Teams
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/reports">
              <i class="bi bi-graph-up-arrow me-3"></i>
              Reports
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/settings">
              <i class="bi bi-gear me-3"></i>
              Settings
            </a>
          </li>
        </ul>

        <div className="mt-auto small text-muted">
          <hr className="line" />
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle bg-dark text-white d-inline-flex align-items-center justify-content-center me-2"
              style={{ width: 32, height: 32 }}
            >
              {user.name
                .trim()
                .split(" ")
                .map((word) => word[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <div className="fw-semibold">{user.name}</div>
              <div>{user.email}</div>
            </div>
          </div>
        </div>
        <hr className="line" />
        <a
          className="d-inline-block mt-3 text-danger text-decoration-none mb-4 "
          onClick={logout}
        >
          <i
            class="bi bi-box-arrow-left ms-3 me-3"
            style={{ color: "gray" }}
          ></i>
          Logout
        </a>
      </aside>
    </div>
  );
};

export default SideBar;
