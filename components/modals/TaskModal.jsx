import { useState } from "react";

const TaskModal = ({
  modalId = "taskModal",
  projects = [],
  teams = [],
  users = [],
  isSubmitting = false,
  onCreateTask,
}) => {
  const initialState = {
    name: "",
    project: "",
    team: "",
    owners: [],
    tags: [],
    timeToComplete: "",
    status: "To Do",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");

  console.log(users);

  // Generic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Owners: multi-select
  const handleOwnersChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value,
    );
    setFormData((prev) => ({ ...prev, owners: selected }));
  };

  // Tags: enter/comma to add, button to add, &times; to remove
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !formData.tags.includes(t)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, t] }));
      setTagInput("");
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (t) =>
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((x) => x !== t),
    }));

  // Basic required-field validation
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Task name is required.";
    if (!formData.project) errs.project = "Project is required.";
    if (!formData.team) errs.team = "Team is required.";
    if (!formData.owners.length) errs.owners = "Select at least one owner.";
    if (!formData.timeToComplete || Number(formData.timeToComplete) <= 0)
      errs.timeToComplete = "Enter days greater than 0.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
    setTagInput("");
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      project: formData.project, // ObjectId string
      team: formData.team, // ObjectId string
      owners: formData.owners, // [ObjectId string]
      tags: formData.tags, // [string]
      timeToComplete: Number(formData.timeToComplete), // number
      status: formData.status, // enum
    };

    console.log(payload);
    onCreateTask?.(payload, { reset: resetForm });
  };

  return (
    <div
      className="modal fade"
      id={modalId}
      tabIndex="-1"
      aria-labelledby={`${modalId}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h1 className="modal-title fs-6" id={`${modalId}Label`}>
              Create a new task
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          {/* Body */}
          <div className="modal-body">
            <form>
              <div className="row g-3">
                {/* Task Name */}
                <div className="col-12">
                  <label className="form-label">Task Name</label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    required
                    placeholder="Enter task name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                {/* Project */}
                <div className="col-md-6">
                  <label className="form-label">Project</label>
                  <select
                    className={`form-select form-select-sm ${
                      errors.project ? "is-invalid" : ""
                    }`}
                    name="project"
                    required
                    value={formData.project}
                    onChange={handleChange}
                  >
                    <option value="">Select a project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {errors.project && (
                    <div className="invalid-feedback">{errors.project}</div>
                  )}
                </div>

                {/* Team */}
                <div className="col-md-6">
                  <label className="form-label">Team</label>
                  <select
                    className={`form-select form-select-sm ${
                      errors.team ? "is-invalid" : ""
                    }`}
                    name="team"
                    required
                    value={formData.team}
                    onChange={handleChange}
                  >
                    <option value="">Select a team</option>
                    {teams.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  {errors.team && (
                    <div className="invalid-feedback">{errors.team}</div>
                  )}
                </div>

                {/* Owners (multi-select) */}
                <div className="col-md-6">
                  <label className="form-label">Owners</label>
                  <select
                    multiple
                    className={`form-select form-select-sm ${
                      errors.owners ? "is-invalid" : ""
                    }`}
                    name="owners"
                    required
                    value={formData.owners}
                    onChange={handleOwnersChange}
                  >
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name ?? u.email}
                      </option>
                    ))}
                  </select>
                  <div className="form-text">
                    Hold Ctrl/Cmd to select multiple.
                  </div>
                  {errors.owners && (
                    <div className="invalid-feedback d-block">
                      {errors.owners}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select form-select-sm"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                {/* Time to complete (days) */}
                <div className="col-md-6">
                  <label className="form-label">Time to complete (days)</label>
                  <input
                    type="number"
                    min="1"
                    className={`form-control form-control-sm ${
                      errors.timeToComplete ? "is-invalid" : ""
                    }`}
                    required
                    placeholder="e.g., 5"
                    name="timeToComplete"
                    value={formData.timeToComplete}
                    onChange={handleChange}
                  />
                  {errors.timeToComplete && (
                    <div className="invalid-feedback">
                      {errors.timeToComplete}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="col-md-6">
                  <label className="form-label">Tags</label>
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Type a tag and press Enter"
                      required
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-dark btn-sm"
                      onClick={addTag}
                    >
                      Add
                    </button>
                  </div>

                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge text-bg-dark d-flex align-items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-white ms-2 p-0"
                          onClick={() => removeTag(tag)}
                          aria-label={`Remove ${tag}`}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-dark btn-sm"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
