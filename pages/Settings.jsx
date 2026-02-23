const Settings = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);

  return (
    <div className="dashboard">
      <div>
        <h1 className="display-3 m-0">Settings</h1>
        <h6 className="text-muted m-0">Manage your account settings.</h6>

        <section className="mt-5">
          {/* Responsive width wrapper */}
          <div className="row justify-content-start">
            {/* On large screens keep a nice readable width; full width on small */}
            <div className="col-12 col-lg-10 col-xl-8 col-xxl-8">
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-body p-3 p-sm-4">
                  {/* Title */}
                  <h5 className="card-title  mb-4">Profile Information</h5>

                  {/* Avatar + helper text */}
                  <div className="d-flex align-items-center mb-4">
                    <div className="avatar-initials bg-light border me-3 flex-shrink-0">
                      <span className="text-dark fw-semibold">
                        {user.name
                          .trim()
                          .split(" ")
                          .map((word) => word[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-truncate">Profile Picture</div>
                      <small className="text-muted">
                        Auto-generated from your name
                      </small>
                    </div>
                  </div>

                  {/* Read-only inputs (stack nicely on all screens) */}
                  <div className="mb-3 mt-4">
                    <h6>Name</h6>
                    <p>{user.name}</p>
                  </div>

                  <div className="mb-3 mt-4">
                    <h6>Email</h6>
                    <p>{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Optional spacing below on small screens */}
              <div className="py-2 d-lg-none" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default Settings;
