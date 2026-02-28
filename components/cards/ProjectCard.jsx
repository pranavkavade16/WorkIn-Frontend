import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Link } from "react-router-dom";
const ProjectCard = ({ project }) => {
  return (
    <div
      className="card border-1 shadow-sm rounded-4 mb-3 card-hover"
      style={{ width: "330px", height: "200px" }}
    >
      <div className="card-body p-3 d-flex flex-column">
        <div className="d-flex align-items-center mb-2">
          <div
            className="rounded-3 bg-light d-inline-flex align-items-center justify-content-center me-auto"
            style={{ width: 32, height: 32 }}
          >
            <i className="bi bi-file-earmark-text text-secondary" />
          </div>
        </div>

        <h6 className="mb-1 fw-semibold">{project?.name}</h6>
        <p className="text-muted small mb-3">{project?.description}</p>

        <div className="d-flex align-items-center mt-auto">
          <span className="badge rounded-pill text-bg-warning-subtle border border-warning text-warning-emphasis me-auto">
            {project?.status}
          </span>
          <small className="text-muted">
            {new Date(project.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </small>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
