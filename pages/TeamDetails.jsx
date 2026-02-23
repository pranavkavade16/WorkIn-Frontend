import TeamDetailsCard from "../components/cards/TaskDetailsCard";
import { useParams, useNavigate } from "react-router-dom";
import useWorkInContext from "../context/workInContext";

const TeamDetails = () => {
  const { teamData, teamLoading, teamError } = useWorkInContext();
  const { teamId } = useParams();
  const navigate = useNavigate();

  // Normalize list regardless of key being task or tasks
  const rawList = teamData?.team ?? teamData?.team ?? [];
  const teamList = Array.isArray(rawList) ? rawList : [];

  // Prefer find(...) because we need a single match
  const selectedTeam = teamList.find((team) => team._id === teamId);
  console.log("Selected Team", selectedTeam);

  // Loading state
  if (teamLoading) {
    return (
      <div className="dashboard">
        <button
          type="button"
          className="btn btn-link p-0 mb-3 text-decoration-none d-inline-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to Project</span>
        </button>
        <div className="placeholder-glow">
          <div className="placeholder col-6 mb-2" style={{ height: 40 }} />
          <div className="placeholder col-12" style={{ height: 200 }} />
        </div>
      </div>
    );
  }

  // Error state
  if (teamError) {
    return (
      <div className="dashboard">
        <button
          type="button"
          className="btn btn-link p-0 mb-3 text-decoration-none d-inline-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to Project</span>
        </button>
        <div className="alert alert-danger" role="alert">
          Failed to load task: {String(taskError?.message || taskError)}
        </div>
      </div>
    );
  }

  // Not found / still undefined
  if (!selectedTeam) {
    return (
      <div className="dashboard">
        <button
          type="button"
          className="btn btn-link p-0 mb-3 text-decoration-none d-inline-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to Project</span>
        </button>
        <div className="alert alert-warning" role="alert">
          Team not found for id: <code>{teamId}</code>
        </div>
      </div>
    );
  }

  // Happy path
  return (
    <div className="dashboard">
      {/* Page header */}
      <button
        type="button"
        className="btn btn-link p-0 mb-3 text-decoration-none d-inline-flex align-items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left"></i>
        <span>Back to Project</span>
      </button>

      <h1 className="display-3">{selectedTeam?.name}</h1>
      <p className="mt-4">{selectedTeam?.description}</p>

      {/* Pass a single task object */}

      <TeamDetailsCard team={selectedTeam} />
    </div>
  );
};

export default TeamDetails;
