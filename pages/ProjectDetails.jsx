import ProjectDetailsCard from "../components/cards/ProjectDetailsCard";
import { useParams, useNavigate, Link } from "react-router-dom";
import useWorkInContext from "../context/workInContext";

const ProjectDetails = () => {
  const {
    projectData,
    projectLoading,
    projectError,

    taskData,

    ownersData,
    tagsData,
  } = useWorkInContext();
  console.log(projectData);

  const { projectId } = useParams();
  const navigate = useNavigate();

  const rawProjects = projectData?.project ?? projectData?.projects ?? [];
  const projects = Array.isArray(rawProjects) ? rawProjects : [];

  const rawTasks = taskData?.task ?? taskData?.tasks ?? [];
  const allTasks = Array.isArray(rawTasks) ? rawTasks : [];
  console.log("rawTasks", rawTasks);

  // Find the project by id
  const selectedProject = projects.find((project) => project._id === projectId);
  console.log(selectedProject);

  // Filter tasks for this project
  const projectTasks = allTasks.filter(
    (task) => task.project._id === projectId,
  );

  // Owners/Tags for dropdowns (optional)
  const owners = Array.isArray(ownersData)
    ? ownersData
    : (ownersData?.owners ?? []);
  const tags = Array.isArray(tagsData) ? tagsData : (tagsData?.tags ?? []);

  // ---- Loading state ----
  if (projectLoading) {
    return (
      <div className="dashboard">
        <button
          type="button"
          className="btn btn-link p-0 mb-3 text-decoration-none d-inline-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left" />
          <span>Back to Dashboard</span>
        </button>

        {/* Skeleton */}
        <div className="placeholder-glow">
          <div className="placeholder col-6 mb-3" style={{ height: 48 }} />
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="placeholder col-3 mb-3" style={{ height: 28 }} />
              <div className="placeholder col-12 mb-2" style={{ height: 40 }} />
              <div className="placeholder col-12 mb-2" style={{ height: 40 }} />
              <div className="placeholder col-12 mb-2" style={{ height: 40 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Error state ----
  if (projectError) {
    return (
      <div className="dashboard">
        <button
          type="button"
          className="btn btn-link p-0 mb-3 text-decoration-none d-inline-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left" />
          <span>Back to Dashboard</span>
        </button>

        <div className="alert alert-danger" role="alert">
          Failed to load project:{" "}
          {String(projectError?.message || projectError)}
        </div>
      </div>
    );
  }

  // ---- Not Found ----
  if (!selectedProject) {
    return (
      <div className="dashboard">
        <button
          type="button"
          className="btn btn-link p-0 mb-3 text-decoration-none d-inline-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left" />
          <span>Back to Dashboard</span>
        </button>

        <div className="alert alert-warning" role="alert">
          Project not found for id: <code>{projectId}</code>
        </div>
      </div>
    );
  }

  // ---- Happy path ----
  return (
    <div className="dashboard">
      {/* Header */}
      <Link
        to="/"
        className="btn btn-link p-0 mb-3 text-decoration-none d-inline-flex align-items-center gap-2"
      >
        <i className="bi bi-arrow-left" />
        <span>Back to Dashboard</span>
      </Link>

      <h1 className="display-5">{selectedProject?.name}</h1>

      <p className="mt-5 mb-5">{selectedProject?.description}</p>

      {/* Details Card */}
      <ProjectDetailsCard
        project={selectedProject}
        tasks={projectTasks}
        owners={owners}
      />
    </div>
  );
};

export default ProjectDetails;
