const TeamCard = ({ team, teamId }) => {
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
