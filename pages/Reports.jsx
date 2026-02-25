import useWorkInContext from "../context/workInContext";
import TaskStatusPie from "../components/charts/TaskStatusPie";
import TaskClosedByOwnerBar from "../components/charts/TaskClosedByOwnerBar";
import PendingWorkByStatusBar from "../components/charts/PendingWorkByStatusBar";
import PendingWorkByOwnerBar from "../components/charts/PendingWorkByOwnerBar";

const Reports = () => {
  const { taskData, usersData } = useWorkInContext();
  const taskList = Array.isArray(taskData?.task) ? taskData?.task : [];
  const usersList = Array.isArray(usersData?.users) ? usersData.users : [];

  return (
    <div className="dashboard">
      {/* Header */}
      <div>
        <h1 className="display-3 m-0">Reports</h1>
        <h6 className="text-muted m-0">
          Get insights into your projects, tasks, and team performance.
        </h6>
      </div>

      {/* Reports Grid */}
      <div className="row gx-4 gy-4 mt-4">
        {/* 1. Pending Work By Status */}
        <div className="col-12 col-md-6">
          <div className="card h-100 border-1 shadow-sm rounded-4 mb-3 card-hover">
            <div className="card-body">
              <PendingWorkByStatusBar tasks={taskList} />
            </div>
          </div>
        </div>

        {/* 2. Pending Work By Owner */}
        <div className="col-12 col-md-6">
          <div className="card h-100 border-1 shadow-sm rounded-4 mb-3 card-hover">
            <div className="card-body">
              <PendingWorkByOwnerBar
                users={usersList}
                tasks={taskList}
                creditMode="equal"
                sort="desc"
              />
            </div>
          </div>
        </div>
        {/* 3. Task Status Pie */}
        <div className="col-12 col-md-6">
          <div className="card h-100 border-1 shadow-sm rounded-4 mb-3 card-hover">
            <div className="card-body">
              <TaskStatusPie tasks={taskList} />
            </div>
          </div>
        </div>

        {/* 4. Task Closed By Owner */}
        <div className="col-12 col-md-6">
          <div className="card h-100 border-1 shadow-sm rounded-4 mb-3 card-hover">
            <div className="card-body">
              <TaskClosedByOwnerBar
                users={usersList}
                tasks={taskList}
                showZeros={true}
                sort="none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
