import { Link } from "react-router-dom";
const STATUS_COLORS = {
  "TO DO": "secondary",
  "IN PROGRESS": "warning",
  COMPLETED: "success",
  BLOCKED: "danger",
};
const TeamCard = ({ team, teamId, deleteTeam }) => {
  return (
    <div
      className="card border-1 shadow-sm rounded-4 mb-3 card-hover"
      style={{ width: "330px", height: "200px" }}
    >
      <div className="card-body p-3">
        {/* Top row: doc icon + menu */}
        <div className="d-flex align-items-center mb-2">
          <div
            className="rounded-3 bg-light d-inline-flex align-items-center justify-content-center me-auto"
            style={{ width: 32, height: 32 }}
          >
            <i class="bi bi-people"></i>
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
                <Link className="dropdown-item" to={`/teamDetails/${teamId}`}>
                  Open
                </Link>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={() => deleteTeam(teamId)}
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Title & description */}
        <h6 className="mb-1 fw-semibold">{team.name}</h6>
        <p className="text-muted small mb-3">
          {team.description.slice(0, 100)}...
        </p>
        <p>Members: {team.members.length}</p>
      </div>
    </div>
  );
};

export default TeamCard;
