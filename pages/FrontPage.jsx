import useWorkInContext from "../context/workInContext";
import { useState, useMemo, useEffect } from "react";
import ProjectCard from "../components/cards/ProjectCard";
import TaskModal from "../components/modals/TaskModal";
import TaskCard from "../components/cards/TaskCard";
import useFilter from "../customHooks/useFilter";
import useSearch from "../customHooks/useSearch";
import { Link } from "react-router-dom";

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

    showToast,
    toastMessage,
  } = useWorkInContext();
  const {
    data: filteredProjectData,
    error: filteredProjectError,
    loading: filteredProjectLoading,
    updateFilter: updateProjectFilter,
    clearFilters: clearProjectFilters,
  } = useFilter("https://work-in-backend.vercel.app/project", {
    paramPrefix: "p",
  });

  const {
    data: filteredTaskData,
    error: filteredTaskError,
    loading: filteredTaskLoading,
    updateFilter: updateTaskFilter,
    clearFilters: clearTaskFilters,
  } = useFilter("https://work-in-backend.vercel.app/task", {
    paramPrefix: "t",
  });

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch(
        "https://work-in-backend.vercel.app/project",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create a project");
      }

      const newProject = await response.json();
      setProjects((prev) => [...prev, newProject]);
      console.log("Project is created successfully", newProject);
      showToast("New project added successfully");
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
      showToast("A new task created successfully.");

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
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value === "") {
                        clearProjectFilters();
                      } else {
                        updateProjectFilter({ status: value });
                      }
                    }}
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

            {filteredProjectLoading ? (
              <div className="d-flex flex-column justify-content-center align-items-center py-5">
                <div className="spinner-border text-dark mb-3" role="status" />
                <p className="text-dark fs-5">Loading projects...</p>
              </div>
            ) : filteredProjectError ? (
              <div className="text-center py-5 text-danger">
                <p>Failed to load projects.</p>
              </div>
            ) : searchedProjects.length === 0 ? (
              <div className="text-center py-5">
                <h6>No projects found</h6>
              </div>
            ) : (
              // ✅ DATA
              <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
                {searchedProjects.map((project) => (
                  <div
                    className="col"
                    key={project._id || project.id || project.name}
                  >
                    <Link
                      to={`/projectDetails/${project?._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <ProjectCard className="h-100" project={project} />
                    </Link>
                  </div>
                ))}
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
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value === "") {
                        clearTaskFilters();
                      } else {
                        updateTaskFilter({ status: value });
                      }
                    }}
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
            {filteredTaskLoading ? (
              <div className="d-flex flex-column justify-content-center align-items-center py-5">
                <div className="spinner-border text-dark mb-3" role="status" />
                <p className="text-dark fs-5">Loading tasks...</p>
              </div>
            ) : filteredTaskError ? (
              <div className="text-center py-5 text-danger">
                <p>Failed to load tasks.</p>
              </div>
            ) : searchedTasks.length === 0 ? (
              <div className="text-center py-5">
                <h6>No tasks yet. Create your first task 🚀</h6>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
                {searchedTasks.map((task) => (
                  <div className="col" key={task._id || task.id || task.name}>
                    <Link
                      to={`/taskDetails/${task._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <TaskCard className="h-100" task={task} />
                    </Link>
                  </div>
                ))}
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
