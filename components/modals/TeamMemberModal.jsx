const TeamMemberModal = ({ modalId = "teamMemberModal" }) => (
  <div
    className="modal fade"
    id={modalId}
    tabIndex="-1"
    aria-labelledby={`${modalId}Label`}
    aria-hidden="true"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id={`${modalId}Label`}>
            Add team member
          </h1>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>

        <div className="modal-body">
          <form></form>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button type="button" className="btn btn-dark">
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
);
export default TeamMemberModal;
