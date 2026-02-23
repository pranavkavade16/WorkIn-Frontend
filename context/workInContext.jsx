import useFetch from "../customHooks/useFetch";
import { createContext, useContext, useEffect, useState } from "react";

const WorkInContext = createContext();

const useWorkInContext = () => useContext(WorkInContext);

export default useWorkInContext;

export function WorkInProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
    fetchData: fetchProjects,
  } = useFetch("http://localhost:5000/project");

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const {
    data: teamData,
    loading: teamLoading,
    error: teamError,
    fetchData: fetchTeams,
  } = useFetch("http://localhost:5000/team");

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    fetchData: fetchUsers,
  } = useFetch("http://localhost:5000/user");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const {
    data: taskData,
    loading: taskLoading,
    error: taskError,
    fetchData: fetchTasks,
  } = useFetch("http://localhost:5000/task");

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <WorkInContext.Provider
      value={{
        projects,
        setProjects,

        projectData,
        projectLoading,
        projectError,
        fetchProjects,

        teamData,
        teamLoading,
        teamError,
        fetchTeams,

        usersData,
        usersLoading,
        usersError,
        fetchTeams,

        taskData,
        taskLoading,
        taskError,
        fetchTasks,
      }}
    >
      {children}
    </WorkInContext.Provider>
  );
}
