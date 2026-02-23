import { useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "./useFetch";

const useFilter = (baseURL) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = useMemo(() => {
    return {
      status: searchParams.get("status") || "",
    };
  }, [searchParams]);

  console.log(searchParams);
  console.log(filter);

  const apiUrl = useMemo(() => {
    const queryString = searchParams.toString();

    return queryString ? `${baseURL}?${queryString}` : baseURL;
  }, [searchParams]);

  console.log(apiUrl);

  const {
    data,
    error,
    loading,
    fetchData: fetchFilteredData,
  } = useFetch(apiUrl);

  useEffect(() => {
    fetchFilteredData();
  }, [apiUrl, fetchFilteredData]);

  const updateFilter = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          if (value) params.set(key, value);
          else params.delete(key);
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
    filter,
    data,
    error,
    loading,
    updateFilter,
    clearFilters,
  };
};

export default useFilter;
