// src/components/ProjectDetailsCard.jsx
import { Link } from "react-router-dom";
import { useId, useMemo, useState } from "react";
import TaskModal from "../modals/TaskModal";
import useWorkInContext from "../../context/workInContext";
import useLocalFilter from "../../customHooks/useLocalFilter";

/* ---------- Subcomponents & Utils ---------- */

const AvatarStack = ({ avatars }) => {
  // If you have real avatar URLs, pass them in as an array.
  // Fallback: two subtle placeholders like screenshot.
  const list =
    Array.isArray(avatars) && avatars.length
      ? avatars.slice(0, 2)
      : [null, null];

  return (
    <div className="pdc-avatar-stack">
      {list.map((src, idx) => (
        <span key={idx} className="pdc-avatar">
          {src ? (
            <img src={src} alt="" className="pdc-avatar-img" />
          ) : (
            <span className="pdc-avatar-placeholder" />
          )}
        </span>
      ))}
    </div>
  );
};

const StatusPill = ({ status = "" }) => {
  const s = String(status).toUpperCase();

  // Palette tuned to your screenshot
  let cls = "pdc-pill pdc-pill-muted";
  if (s === "IN PROGRESS") cls = "pdc-pill pdc-pill-progress";
  if (s === "COMPLETED") cls = "pdc-pill pdc-pill-done";
  if (s === "NOT STARTED") cls = "pdc-pill pdc-pill-notstarted";

  return <span className={cls}>{s || "—"}</span>;
};

const ProjectDetailsCard = ({ project, tasks = [], owners = [] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { projectData, teamData, usersData, taskData } = useWorkInContext();

  const rawTaskList = Array.isArray(taskData.task) ? taskData.task : [];
  const taskList = rawTaskList.filter(
    (task) => task.project._id === project._id,
  );

  const { filteredData, updateFilter, clearFilters } = useLocalFilter(taskList);

  console.log("projectDetailsCard", filteredData);

  const usersList = Array.isArray(usersData.users) ? usersData.users : [];
  console.log(usersList);

  const handleAddTask = async (payload, { reset }) => {
    try {
      setIsSubmitting(true);

      // POST to your API (replace with your route & auth)
      const res = await fetch("https://work-in-backend.vercel.app/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create task");
      console.log("task created successfully", data);

      // Reset form
      reset();

      // Hide modal via Bootstrap API
      const el = document.getElementById("taskModal");
      const modal = window.bootstrap?.Modal.getInstance(el);
      // If no instance, create and hide
      (modal ?? new window.bootstrap.Modal(el)).hide();

      // Refresh your task list here...
      fetchTasks();
    } catch (err) {
      console.error(err);
      // Show toast/alert if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteProject = async (projectId) => {
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `https://work-in-backend.vercel.app/project/${projectId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}`
          },
        },
      );

      const data = await response.json().catch(() => null); // be safe if no JSON

      if (!response.ok) {
        // surface backend reason (e.g., "Project not found" OR "Some tasks are not completed")
        const msg =
          data?.message || `Failed to update project (HTTP ${response.status})`;
        throw new Error(msg);
      }

      console.log("Project updated:", data);
      await fetchProjects();
    } catch (error) {
      console.log("Failed to complete the project:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const orderedTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    return [...tasks].sort((a, b) => {
      const ad = a?.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bd = b?.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return ad - bd;
    });
  }, [tasks]);

  if (!project?._id) {
    return (
      <div className="card pdc-card shadow-sm border-0">
        <div className="card-body">
          <div className="alert alert-warning mb-0" role="alert">
            Project not found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card pdc-card shadow-sm border-0">
      <div className="card-body">
        {/* Header row */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h5 className="mb-0 pdc-title">Task List</h5>
          <button
            className="btn btn-dark btn-sm ms-auto flex-shrink-0 mb-4"
            data-bs-toggle="modal"
            data-bs-target="#taskModal"
          >
            <i className="bi bi-plus"></i> New Task
          </button>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table pdc-table align-middle mb-2">
            <thead className="pdc-thead">
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Owner</th>
                <th className="text-end">Due Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((task) => (
                  <tr key={task._id} className="pdc-row">
                    <td className="pdc-task-name">
                      <Link
                        to={`/tasks/${task._id}`}
                        className="text-decoration-none pdc-link"
                      >
                        {task.name}
                      </Link>
                    </td>
                    <td>
                      <StatusPill status={task.status} />
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <AvatarStack avatars={task.owner?.avatars} />
                        <span className="pdc-owner-name">
                          {task.owners?.map((item) => item.name)}
                        </span>
                      </div>
                    </td>
                    <td className="text-end pdc-date">
                      {task.timeToComplete} days
                    </td>
                    <td>
                      <Link
                        className="btn btn-dark btn-sm ms-5"
                        to={`/taskDetails/${task._id}`}
                      >
                        <i class="bi bi-eye"></i> veiw
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-muted">
                    No tasks yet. Click <strong>New Task</strong> to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Filters / Sort row */}
        <div className="pdc-filters gap-2 mt-3">
          {/* Row: Filters label + dropdowns + button */}
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            {/* LEFT SIDE → Filters label + dropdowns */}
            <div className="d-flex align-items-center gap-2">
              <p className="m-0">Filters:</p>

              <select
                id="status-task-filter"
                className="form-select form-select-sm"
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "") clearFilters();
                  else updateFilter({ status: value });
                }}
                defaultValue=""
              >
                <option value="">Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>

              <select
                id="user-task-filter"
                className="form-select form-select-sm"
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "") clearFilters();
                  else updateFilter({ user: value });
                }}
                defaultValue=""
              >
                <option value="">Users</option>
                {usersList.map((user) => (
                  <option key={user._id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* RIGHT SIDE → Button */}
            <button
              type="button"
              className="btn btn-dark btn-sm ms-sm-auto mt-2 mt-sm-0"
              onClick={() => handleCompleteProject(project._id)}
            >
              Mark as Complete
            </button>
          </div>
        </div>
      </div>
      <TaskModal
        modalId="taskModal"
        projects={
          Array.isArray(projectData.projects) ? projectData.projects : []
        }
        teams={Array.isArray(teamData.team) ? teamData.team : []}
        users={Array.isArray(usersData.user) ? usersData.user : []}
        isSubmitting={isSubmitting}
        onCreateTask={handleAddTask}
      />
    </div>
  );
};

export default ProjectDetailsCard;
