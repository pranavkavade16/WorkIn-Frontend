import useWorkInContext from "../context/workInContext";
import { useState, useMemo, useEffect } from "react";
import ProjectCard from "../components/cards/ProjectCard";
import TaskModal from "../components/modals/TaskModal";
import TaskCard from "../components/cards/TaskCard";
import useFilter from "../customHooks/useFilter";
import useSearch from "../customHooks/useSearch";

const FrontPage = () => {
  const {
    projects,
    setProjects,

    projectData,
    projectLoading,
    projectError,
    fetchProjects,

    teamData,
    teamLoading,
    teamError,
    fetchTeams,

    usersData,
    usersLoading,
    usersError,
    fetchUsers,

    taskData,
    taskLoading,
    taskError,
    fetchTasks,
  } = useWorkInContext();
  const {
    data: filteredProjectData,
    error: filteredProjectError,
    loading: filteredProjectLoading,
    updateFilter: updateProjectFilter,
    filter,
  } = useFilter("http://localhost:5000/project");

  //   const {
  //     data: filteredTaskData,
  //     updateFilter: updateTaskFilter,
  //     clearFilters: clearTaskFilters,
  //   } = useFilter("http://localhost:5000/task", { paramPrefix: "t" });

  console.log("tasks", taskData);
  console.log("users", usersData);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log("state variable", projects);

  const projectList = Array.isArray(filteredProjectData.projects)
    ? filteredProjectData.projects
    : [];

  const teamList = Array.isArray(teamData.team) ? teamData.team : [];

  const userList = Array.isArray(usersData.users) ? usersData.users : [];

  const taskList = Array.isArray(filteredTaskData.task)
    ? filteredTaskData.task
    : [];

  const { setSearch, searchedProjects, searchedTasks } = useSearch(
    projectList,
    taskList,
  );
  console.log("front page searchedProjects", searchedProjects);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:5000/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create a project");
      }

      const newProject = await response.json();
      setProjects((prev) => [...prev, newProject]);
      console.log("Project is created successfully", newProject);
    } catch (error) {
      console.log("Failed to create a project", error.message);
    } finally {
      setIsSubmitting(false);
      fetchProjects();
    }
  };

  const handleAddTask = async (payload, { reset }) => {
    try {
      setIsSubmitting(true);

      // POST to your API (replace with your route & auth)
      const res = await fetch("http://localhost:5000/task", {
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

  const handleDeleteTask = async (taskId) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`http://localhost:5000/task/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the task");
      }

      const deletedTask = await response.json();

      console.log("Task deleted successfully", deletedTask);
    } catch (error) {
      console.log("Failed to delete the task", error.message);
    }
  };

  return (
    <div className="dashboard">
      {/* Page header */}
      <h1 className="display-3">Dashboard</h1>
      <h6 className="mb-5">Welcome back! Here's your overview.</h6>

      {/* Search + New Project */}
      <div className="d-flex align-items-center gap-3">
        {/* Search input */}
        <div className="input-group flex-grow-1">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search projects and tasks..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="mt-5 container-fluid">
        <div className="row align-items-stretch">
          {/* Projects column */}
          <div className="col-12 col-lg-12 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="mb-4">Projects</h4>

              <div className="d-flex align-items-center justify-content-between">
                <div class="btn-group mb-4 me-3">
                  <select
                    id="project-status-filter"
                    className="form-select form-select-sm"
                    value={filter.status || ""}
                    onChange={(e) => updateFilter({ status: e.target.value })}
                  >
                    <option value="">Filter</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
                <button
                  className="btn btn-dark btn-sm ms-auto flex-shrink-0 mb-4"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  data-bs-whatever="@getbootstrap"
                >
                  <i className="bi bi-plus"></i>
                  New Project
                </button>
              </div>
            </div>

            {/* Grid for project cards */}
            {searchedProjects.length > 0 ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
                {searchedProjects.map((project) => (
                  <div
                    className="col"
                    key={project._id || project.id || project.name}
                  >
                    <ProjectCard
                      className="h-100" // <- ensure card stretches to same height
                      project={project}
                      name={project.name}
                      description={project.description}
                      projectId={project._id}
                      date={new Date(project.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="d-flex justify-content-center">
                <h6 className="mt-5">No projects found</h6>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5 container-fluid">
        <div className="row align-items-stretch">
          {/* Tasks column */}
          <div className="col-12 d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="mb-4">Tasks</h4>
              <div className="d-flex align-items-center justify-content-between">
                <div class="btn-group mb-4 me-3">
                  <select
                    id="status-task-filter"
                    className="form-select form-select-sm"
                    // onChange={(event) => {
                    //   const value = event.target.value;
                    //   if (value === "") {
                    //     clearTaskFilters();
                    //   } else {
                    //     updateTaskFilter({ status: value });
                    //   }
                    // }}
                    defaultValue=""
                  >
                    <option value="">Filter</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
                <button
                  className="btn btn-dark btn-sm ms-auto flex-shrink-0 mb-4"
                  data-bs-toggle="modal"
                  data-bs-target="#taskModal"
                >
                  <i className="bi bi-plus"></i> New Task
                </button>
                <TaskModal
                  modalId="taskModal"
                  projects={
                    Array.isArray(projectData.projects)
                      ? projectData.projects
                      : []
                  }
                  teams={teamList}
                  users={userList}
                  isSubmitting={isSubmitting}
                  onCreateTask={handleAddTask}
                />
              </div>
            </div>
            {/* Grid for task cards */}
            {searchedTasks.length > 0 ? (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
                {searchedTasks.map((task) => (
                  <div className="col" key={task._id || task.id || task.name}>
                    <TaskCard
                      className="h-100" // <- equal height
                      name={task.name}
                      description={task.team?.name}
                      status={task.status}
                      taskId={task._id}
                      deleteTask={handleDeleteTask}
                      date={new Date(task.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="d-flex justify-content-center">
                <h6 className="mt-5">No task found</h6>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model for new project */}

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Create a new project
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="mb-3">
                  <label for="recipient-name" class="col-form-label">
                    Project Name:
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter project name"
                    id="recipient-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div class="mb-3">
                  <label for="message-text" class="col-form-label">
                    Description:
                  </label>
                  <textarea
                    class="form-control"
                    id="message-text"
                    placeholder="Enter project description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-dark"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-dark"
                onClick={() => handleAddProject()}
              >
                {isSubmitting ? "Creating.." : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
