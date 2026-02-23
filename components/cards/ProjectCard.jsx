import { Link } from "react-router-dom";
const STATUS_COLORS = {
  "TO DO": "secondary",
  "IN PROGRESS": "warning",
  COMPLETED: "success",
  BLOCKED: "danger",
};
const ProjectCard = ({
  project,
  name,
  description,
  status,
  date,
  projectId,
  deleteProject,
}) => {
  return (
    <div
      className="card border-1 shadow-sm rounded-4 mb-3 card-hover"
      style={{ width: "330px", height: "200px" }}
    >
      <div className="card-body p-3 d-flex flex-column">
        {/* Top row: doc icon + menu */}
        <div className="d-flex align-items-center mb-2">
          <div
            className="rounded-3 bg-light d-inline-flex align-items-center justify-content-center me-auto"
            style={{ width: 32, height: 32 }}
          >
            <i className="bi bi-file-earmark-text text-secondary" />
          </div>

          {/* 3-dot menu */}
          <div className="dropdown">
            <button
              className="btn btn-link text-muted p-0"
              type="button"
              id="projectMenuBtn"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-three-dots-vertical" />
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="projectMenuBtn"
            >
              <li>
                <Link
                  className="dropdown-item"
                  to={`/projectDetails/${projectId}`}
                >
                  Open
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => deleteProject(projectId)}
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Title & description */}
        <h6 className="mb-1 fw-semibold">{name}</h6>
        <p className="text-muted small mb-3">{description}</p>

        {/* Footer row: status pill + date */}
        <div className="d-flex align-items-center mt-auto">
          <span className="badge rounded-pill text-bg-warning-subtle border border-warning text-warning-emphasis me-auto">
            {project?.status}
          </span>
          <small className="text-muted">{date}</small>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
