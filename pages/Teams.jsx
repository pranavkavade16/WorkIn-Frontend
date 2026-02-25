import TeamCard from "../components/cards/TeamCard";
import useWorkInContext from "../context/workInContext";
import { useParams } from "react-router-dom";
import { useState } from "react";
import TeamModal from "../components/modals/TeamModal";
import useSearch from "../customHooks/useSearch";
const Teams = () => {
  const { teamData, teamLoading, teamError, usersData, fetchTeams } =
    useWorkInContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { teamId } = useParams();

  const teamList = Array.isArray(teamData.team) ? teamData.team : [];
  const userList = Array.isArray(usersData.users) ? usersData.users : [];
  const { setSearch, searchedTeams } = useSearch([], [], teamList);
  console.log("teams page", teamList);

  console.log(searchedTeams);

  const handleAddTeam = async (payload) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("https://work-in-backend.vercel.app/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const team = await response.json();
      if (!response.ok) throw new Error("Failed to create a team");

      console.log("Team created successfully.", team);
    } catch (error) {
      console.log("Failed to create a team", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      setIsSubmitting(true);

      const resposne = await fetch(`http://localhost:5000/team/${teamId}`, {
        method: "DELETE",
      });

      if (!resposne.ok) {
        throw new Error("Failed to delete the team");
      }

      const deletedTeam = await resposne.json();

      console.log("Team deleted sucessfully", deletedTeam);
    } catch (error) {
      console.log("Failed to delete the team", deletedTeam);
    }
  };

  return (
    <div className="dashboard">
      {/* Page header */}
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <h1 className="display-3">Teams</h1>
          <h6 className="mb-5">
            Manage and collaborate with your teams effortlessly. Here's your
            team overview.
          </h6>
        </div>
        <div>
          <button
            className="btn btn-dark btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 flex-shrink-0"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#teamModal"
            data-bs-whatever="@getbootstrap"
          >
            <i className="bi bi-plus-lg"></i>
            New Team
          </button>

          <TeamModal
            modalId="teamModal"
            users={userList}
            isSubmitting={false}
            teamId={teamId}
            onCreateTeam={handleAddTeam}
          />
        </div>
      </div>
      <div className="input-group flex-grow-1 mb-5">
        <span className="input-group-text bg-white border-end-0">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control border-start-0"
          placeholder="Search teams..."
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
        {teamLoading ? (
          <div className="d-flex flex-column justify-content-center align-items-center py-5">
            <div className="spinner-border text-dark mb-3" role="status" />
            <p className="text-dark fs-5">Loading teams...</p>
          </div>
        ) : teamError ? (
          <div className="text-center py-5 text-danger">
            <p>Failed to load teams.</p>
          </div>
        ) : searchedTeams.length === 0 ? (
          <div className="text-center py-5">
            <h6>No teams yet. Create your first team 🚀</h6>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
            {searchedTeams.map((team) => (
              <div key={team._id}>
                <TeamCard
                  team={team}
                  teamId={team._id}
                  deleteTeam={handleDeleteTeam}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Teams;
