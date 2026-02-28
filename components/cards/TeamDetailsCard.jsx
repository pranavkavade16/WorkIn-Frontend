import TeamMemberModal from "../modals/TeamMemberModal";
const TeamDetailsCard = ({ team, loading = false, error = null }) => {
  if (loading) {
    return (
      <div className="card pdc-card shadow-sm border-0">
        <div className="card-body">
          <div className="placeholder-glow">
            <div className="placeholder col-4 mb-3" style={{ height: 28 }} />
            <div className="placeholder col-12 mb-2" style={{ height: 40 }} />
            <div className="placeholder col-12 mb-2" style={{ height: 40 }} />
            <div className="placeholder col-12 mb-2" style={{ height: 40 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card pdc-card shadow-sm border-0">
        <div className="card-body">
          <div className="alert alert-danger mb-0" role="alert">
            Failed to load team members: {String(error?.message || error)}
          </div>
        </div>
      </div>
    );
  }

  if (!team?._id) {
    return (
      <div className="card pdc-card shadow-sm border-0">
        <div className="card-body">
          <div className="alert alert-warning mb-0" role="alert">
            Team not found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card pdc-card shadow-sm border-0">
      <div className="card-body">
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h5 className="mb-0 pdc-title">Team Members</h5>
          <button
            type="button"
            className="btn btn-dark btn-sm d-inline-flex align-items-center gap-2"
            data-bs-toggle="modal"
            data-bs-target="#teamMemberModal"
          >
            <i className="bi bi-plus-lg" />
            <span>New Member</span>
          </button>
        </div>

        {/* Table: Name only */}
        <div className="table-responsive">
          <table className="table pdc-table align-middle mb-0">
            <thead className="pdc-thead">
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(team.members) && team.members.length > 0 ? (
                team.members?.map((member, index) => (
                  <tr key={index}>
                    <td className="pdc-owner-name">{member.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-muted">No team members found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <TeamMemberModal />
    </div>
  );
};

export default TeamDetailsCard;
