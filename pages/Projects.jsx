import { useState } from "react";
import useWorkInContext from "../context/workInContext";
import ProjectCard from "../components/cards/ProjectCard";
import useSearch from "../customHooks/useSearch";
import useFilter from "../customHooks/useFilter";

const Projects = () => {
  const { projectLoading, projectError, fetchProject, showToast } =
    useWorkInContext();

  const {
    data: filteredProjectData,
    error: filteredProjectError,
    loading: filteredProjectLoading,
    updateFilter: updateProjectFilter,
    clearFilters: clearProjectFilters,
    refetch: refetchProjects,
  } = useFilter("http://localhost:5000/project", { paramPrefix: "p" });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safe array handling
  const projectList = Array.isArray(filteredProjectData.projects)
    ? filteredProjectData.projects
    : [];

  const { setSearch, searchedProjects } = useSearch(projectList);

  // Combined states (professional pattern)
  const isProjectLoading = projectLoading || filteredProjectLoading;
  const isProjectError = projectError || filteredProjectError;

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

      await response.json();
      await refetchProjects()
      showToast("Project added successfully.");
    } catch (error) {
      console.log("Failed to create a project", error.message);
    } finally {
      setIsSubmitting(false);
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

        <button
          className="btn btn-dark btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#newProjectModal"
        >
          <i className="bi bi-plus-lg"></i>
          New Project
        </button>
      </div>

      {/* Search + Filter */}
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

        <div className="btn-group mt-5">
          <select
            className="form-select"
            onChange={(event) => {
              const value = event.target.value;
              if (value === "") clearProjectFilters();
              else updateProjectFilter({ status: value });
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

      {/* ================= LOADING ================= */}
      {isProjectLoading ? (
        <div className="d-flex flex-column justify-content-center align-items-center py-5">
          <div className="spinner-border text-dark mb-3" role="status" />
          <p className="text-dark fs-5">Loading projects...</p>
        </div>
      ) : /* ================= ERROR ================= */
      isProjectError ? (
        <div className="text-center py-5 text-danger">
          <p>Failed to load projects.</p>
        </div>
      ) : /* ================= EMPTY ================= */
      searchedProjects.length === 0 ? (
        <div className="empty-center">
          <p className="text-muted fs-5 text-center mb-2">No project yet</p>

          <button
            type="button"
            className="btn btn-outline-dark d-inline-flex align-items-center gap-2 px-3"
            data-bs-toggle="modal"
            data-bs-target="#newProjectModal"
          >
            <i className="bi bi-plus-lg"></i>
            Create your first project
          </button>
        </div>
      ) : (
        /* ================= DATA ================= */
        <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3 mt-5">
          {searchedProjects.map((project) => (
            <div
              className="col"
              key={project._id || project.id || project.name}
            >
              <ProjectCard
                className="h-100"
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
      )}

      {/* Modal */}
      <div
        className="modal fade"
        id="newProjectModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Create a new project</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              />
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="col-form-label">Project Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="col-form-label">Description:</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-dark"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              <button className="btn btn-dark" onClick={handleAddProject}>
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
