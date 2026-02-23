import useWorkInContext from "../context/workInContext";
import TaskStatusPie from "../components/charts/TaskStatusPie";
import TaskClosedByOwnerBar from "../components/charts/TaskClosedByOwnerBar";
import PendingWorkByStatusBar from "../components/charts/PendingWorkByStatusBar";
import PendingWorkByOwnerBar from "../components/charts/TaskClosedByOwnerBar";
const Reports = () => {
  const { taskData, usersData } = useWorkInContext();
  const taskList = Array.isArray(taskData?.task) ? taskData?.task : [];
  const usersList = Array.isArray(usersData.users) ? usersData.users : [];
  console.log(taskList);

  return (
    <div className="dashboard">
      {/* Header */}

      <div>
        <h1 className="display-3 m-0">Reports</h1>
        <h6 className="text-muted m-0">
          Get insights into your projects, tasks, and team performance.
        </h6>
      </div>
      <div className="mt-5">
        <TaskStatusPie tasks={taskList} />
      </div>
      <div>
        <TaskClosedByOwnerBar
          users={usersList}
          tasks={taskList}
          showZeros={true}
          sort="none"
        />
      </div>
      <div>
        <PendingWorkByStatusBar tasks={taskList} />
      </div>
      <div>
        <PendingWorkByOwnerBar
          users={usersList}
          tasks={taskList}
          creditMode="equal"
          sort="desc"
        />
      </div>
    </div>
  );
};
export default Reports;
