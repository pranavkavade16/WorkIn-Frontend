import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const useLocalFilter = (data = []) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      status: searchParams.get("status") || "",
      priority: searchParams.get("priority") || "",
      sort: searchParams.get("sort") || "",
      order: searchParams.get("order") || "",
      user: searchParams.get("user") || "",
      ownerId: searchParams.get("ownerId") || "",
    }),
    [searchParams],
  );
  console.log("Hook", filters.user);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (filters.status) {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter((item) => item.priority === filters.priority);
    }

    if (filters.ownerId) {
      result = result.filter((item) =>
        item?.owners?.some((o) => String(o._id) === String(filters.ownerId)),
      );
    } else if (filters.user) {
      result = result.filter((item) =>
        item?.owners?.some((o) => o.name === filters.user),
      );
    }

    if (filters.sort) {
      result.sort((a, b) => {
        if (filters.sort === "priority") {
          const map = { High: 3, Medium: 2, Low: 1 };
          return filters.order === "asc"
            ? map[a.priority] - map[b.priority]
            : map[b.priority] - map[a.priority];
        }

        if (filters.sort === "timeToClose") {
          return filters.order === "asc"
            ? a.timeToClose - b.timeToClose
            : b.timeToClose - a.timeToClose;
        }

        return 0;
      });
    }

    return result;
  }, [data, filters]);

  const updateFilter = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          value ? params.set(key, value) : params.delete(key);
        });

        return params;
      });
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return {
    filters,
    filteredData,
    updateFilter,
    clearFilters,
  };
};

export default useLocalFilter;
