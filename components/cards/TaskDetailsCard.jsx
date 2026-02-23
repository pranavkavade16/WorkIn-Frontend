const formatDate = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const daysRemaining = (d) => {
  const due = d instanceof Date ? d : new Date(d);
  const ms = due.setHours(23, 59, 59, 999) - Date.now();
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
};

const statusTone = (status) => {
  const s = (status || "").toUpperCase();
  if (s.includes("PROGRESS"))
    return { bg: "bg-warning-subtle", text: "text-warning-emphasis" };
  if (s.includes("DONE") || s.includes("COMPLETE"))
    return { bg: "bg-success-subtle", text: "text-success-emphasis" };
  if (s.includes("BLOCK"))
    return { bg: "bg-danger-subtle", text: "text-danger-emphasis" };
  return { bg: "bg-secondary-subtle", text: "text-secondary-emphasis" };
};

const Field = ({ label, children, strong = false }) => (
  <div className="py-2">
    <div className="text-body-secondary small">{label}</div>
    <div className={strong ? "fw-semibold" : ""}>{children}</div>
  </div>
);

const Tags = ({ items }) => {
  if (!items || !items.length) return <span>-</span>;
  return (
    <div className="d-flex flex-wrap gap-2">
      {items.map((t, i) => (
        <span key={i} className="badge text-bg-light border fw-normal">
          {t}
        </span>
      ))}
    </div>
  );
};

const TaskDetailsCard = ({
  task,
  title = "Build Authentication Flow",
  status = "IN PROGRESS",
  project = "Backend Dev",
  team = "Engineering",
  owners = ["John", "Priya"],
  tags = ["frontend", "auth"],
  dueDate = "2026-02-20",
  onBack,
  completeTask,
  onEdit,
}) => {
  const tone = statusTone(task?.status);
  const dLeft = daysRemaining(dueDate);
  console.log(task);

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/task/${taskId}/complete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update the task");
      }

      const completedTask = await response.json();

      console.log("Task updated successfully ", completedTask);
    } catch (error) {
      console.log("Failed to update the task", error.message);
    }
  };

  return (
    <div className="container-fluid ">
      {/* Card */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-3 p-md-4">
          {/* Card header */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 pb-2 border-bottom">
            <h5 className="mb-0 fw-semibold">Task Details</h5>
            <span
              className={`badge rounded-pill px-3 py-2 ${tone.bg} ${tone.text} fw-medium`}
              style={{ letterSpacing: ".3px" }}
            >
              {task.status}
            </span>
          </div>

          {/* LEFT-STACKED FIELDS */}
          <div className="d-flex flex-column">
            <Field label="Project">{task.project.name}</Field>
            <Field label="Team">{task.team?.name}</Field>
            <Field label="Owners">
              {task.owners?.length
                ? task.owners?.map((owner) => owner.name).join(", ")
                : "-"}
            </Field>
            <Field label="Tags">
              <Tags items={task.tags} />
            </Field>
            <Field label="Due Date" strong>
              {formatDate(task.createdAt)}
            </Field>
          </div>

          {/* Divider */}
          <hr className="my-3" />

          {/* Footer: time & actions */}
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
            <div>
              <span className="text-body-secondary me-2">Time Remaining:</span>
              <span className="fw-semibold">{task.timeToComplete} Days</span>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-dark btn-sm"
                onClick={() => handleCompleteTask(task._id)}
              >
                Mark as Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsCard;
