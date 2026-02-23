import { useState } from "react";
import useWorkInContext from "../context/workInContext";
import ProjectCard from "../components/cards/ProjectCard";
import useSearch from "../customHooks/useSearch";
import useFilter from "../customHooks/useFilter";
const Projects = () => {
  const { projectData, projectLoading, projectError, fetchProject } =
    useWorkInContext();

  const {
    data: filteredProjectData,
    error: filteredProjectError,
    loading: filteredProjectLoading,
    updateFilter: updateProjectFilter,
    clearFilters: clearProjectFilters,
  } = useFilter("http://localhost:5000/project", { paramPrefix: "p" });

  console.log(projectData);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectList = Array.isArray(filteredProjectData.projects)
    ? filteredProjectData.projects
    : [];

  const { setSearch, searchedProjects } = useSearch(projectList);

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
      console.log("Project is created successfully", newProject);
    } catch (error) {
      console.log("Failed to create a project", error.message);
    } finally {
      setIsSubmitting(false);
      fetchProject();
    }
  };
  return (
    <div className="dashboard">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <h1 className="display-3 m-0">Projects</h1>
          <h6 className="text-muted m-0">
            Manage all your projects in one place.
          </h6>
        </div>

        <div>
          <button
            className="btn btn-dark btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 flex-shrink-0"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#newProjectModal"
            data-bs-whatever="@getbootstrap"
          >
            <i className="bi bi-plus-lg"></i>
            New Project
          </button>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="input-group flex-grow-1 mt-5">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search projects..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div class="btn-group mt-5">
          <select
            id="project-status-filter"
            className="form-select"
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
      </div>

      {projectData.length === 0 && (
        <div className="empty-center">
          <p className="text-muted mb-0 fs-5 text-center mb-2">
            No project yet
          </p>

          <button
            type="button"
            className="btn btn-outline-dark d-inline-flex align-items-center gap-2 px-3"
            data-bs-toggle="modal"
            data-bs-target="#newProjectModal"
            data-bs-whatever="@getbootstrap"
          >
            <i className="bi bi-plus-lg"></i>
            Create your first project
          </button>
        </div>
      )}

      {searchedProjects.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3 mt-5">
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
                date={new Date(project.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-center">
          <h6>No project found</h6>
        </div>
      )}

      {/* Model for new project */}

      <div
        class="modal fade"
        id="newProjectModal"
        tabindex="-1"
        aria-labelledby="newProjectModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="newProjectModalLabel">
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

export default Projects;
