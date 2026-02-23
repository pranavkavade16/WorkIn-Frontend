import TaskDetailsCard from "../components/cards/TaskDetailsCard";
import { useParams, useNavigate } from "react-router-dom";
import useWorkInContext from "../context/workInContext";

const TaskDetails = () => {
  const { taskData, taskLoading, taskError } = useWorkInContext();
  const { taskId } = useParams();
  const navigate = useNavigate();

  // Normalize list regardless of key being task or tasks
  const rawList = taskData?.task ?? taskData?.tasks ?? [];
  const taskList = Array.isArray(rawList) ? rawList : [];

  // Prefer find(...) because we need a single match
  const selectedTask = taskList.find((t) => String(t?._id) === String(taskId));

  const handleCompleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/task/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update the task");
      }

      const completedTask = await response.json();

      console.log("Task updated successfully ", completedTask);
    } catch (error) {
      console.log("Failed to update the task", error.message);
    }
  };

  // Loading state
  if (taskLoading) {
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
  if (taskError) {
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
  if (!selectedTask) {
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
          Task not found for id: <code>{taskId}</code>
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

      <h1 className="display-3">{selectedTask?.name}</h1>

      {/* Pass a single task object */}
      <TaskDetailsCard task={selectedTask} completeTask={handleCompleteTask} />
    </div>
  );
};

export default TaskDetails;
