import { useMemo, useState } from "react";

const normalize = (value) => (value ?? "").toString().toLowerCase();

const useSearch = (projects = [], tasks = [], teams = []) => {
  const [search, setSearch] = useState("");
  const q = normalize(search);
  console.log("hook", teams);
  const searchedProjects = useMemo(() => {
    if (!q) return projects;

    return projects.filter((project) => {
      const name = normalize(project?.name);
      const description = normalize(project?.description);
      const status = normalize(project?.status);

      return name.includes(q) || description.includes(q) || status.includes(q);
    });
  }, [projects, q]);

  const searchedTasks = useMemo(() => {
    if (!q) return tasks;

    return tasks.filter((task) => {
      const name = normalize(task.name);
      const project = normalize(task.project);
      const team = normalize(task.team);
      const owners = normalize(task.owners);
      const tags = normalize(task.tags);
      const timeToComplete = normalize(task.timeToComplete);
      const status = normalize(task.status);

      return (
        name.includes(q) ||
        project.includes(q) ||
        team.includes(q) ||
        owners.includes(q) ||
        tags.includes(q) ||
        timeToComplete.includes(q) ||
        status.includes(q)
      );
    });
  }, [tasks, q]);

  const searchedTeams = useMemo(() => {
    const q = normalize(search);
    if (!q) return teams;

    return teams.filter((team) => {
      const name = normalize(team?.name);
      const members = normalize(team?.members);
      const description = normalize(team?.description);

      return name.includes(q) || members.includes(q) || description.includes(q);
    });
  }, [teams, q]);
  console.log(searchedTeams);

  return { search, setSearch, searchedProjects, searchedTasks, searchedTeams };
};

export default useSearch;
