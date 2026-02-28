const TaskCard = ({ task }) => {
  return (
    <div
      className="card border-1 shadow-sm rounded-4 mb-3 card-hover"
      style={{ width: "330px", height: "200px" }}
    >
      <div className="card-body p-3 d-flex flex-column">
        {/* Top row: doc icon + menu */}
        <div className="d-flex align-items-center mb-2">
          <div
            className="rounded-3 bg-light d-inline-flex align-items-center justify-content-center me-auto"
            style={{ width: 32, height: 32 }}
          >
            <i className="bi bi-file-earmark-text text-secondary" />
          </div>
        </div>

        {/* Title & description */}
        <h6 className="mb-1 fw-semibold">{task?.name}</h6>
        <p className="text-muted small mb-3">{task?.team?.name}</p>

        {/* Footer row: status pill + date */}
        <div className="d-flex align-items-center mt-auto">
          <span className="badge rounded-pill text-bg-warning-subtle border border-warning text-warning-emphasis me-auto">
            {task?.status}
          </span>
          <small className="text-muted">
            {new Date(task.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </small>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
