import { useState } from "react";

const TeamModal = ({
  modalId = "teamModal",
  users = [],
  isSubmitting = false,
  onCreateTeam, // (payload, { reset }) => void
}) => {
  const initialState = {
    name: "",
    members: [],
    description: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  console.log(formData);

  // Generic change handler for text inputs/textareas
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Members: multi-select
  const handleMembersChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value,
    );
    setFormData((prev) => ({ ...prev, members: selected }));
  };

  // Basic validation aligned to schema:
  // name (required), members (at least 1)
  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Team name is required.";
    if (!formData.members.length) errs.members = "Select at least one member.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      members: formData.members, // [ObjectId string]
      description: formData.description?.trim() || undefined,
    };

    onCreateTeam?.(payload, { reset: resetForm });
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
              Create a new team
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
                {/* Team Name */}
                <div className="col-12">
                  <label className="form-label">Team Name</label>
                  <input
                    type="text"
                    className={`form-control form-control-sm ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    required
                    placeholder="Enter team name (must be unique)"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                {/* Members (multi-select) */}
                <div className="col-md-12">
                  <label className="form-label">Members</label>
                  <select
                    multiple
                    className={`form-select form-select-sm ${
                      errors.members ? "is-invalid" : ""
                    }`}
                    required
                    name="members"
                    value={formData.members}
                    onChange={handleMembersChange}
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
                  {errors.members && (
                    <div className="invalid-feedback d-block">
                      {errors.members}
                    </div>
                  )}
                </div>

                {/* Description (optional) */}
                <div className="col-12">
                  <label className="form-label">Description (optional)</label>
                  <textarea
                    rows={3}
                    className="form-control form-control-sm"
                    placeholder="Short description of the team"
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
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
              onClick={() => onCreateTeam(formData)}
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

export default TeamModal;
