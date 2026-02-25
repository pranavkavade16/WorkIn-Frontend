// useFilter.js
import { useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useFetch from './useFetch';

/**
 * useFilter
 * - Isolates URL query params per hook instance using a prefix (e.g., 'p_' for projects, 't_' for tasks)
 * - Reads only its own prefixed params from the URL (strips prefix before building API query)
 * - Writes only its own prefixed params to the URL
 * - Clears only its own prefixed params
 *
 * @param {string} baseURL - API base URL (e.g., http://localhost:5000/projects)
 * @param {object} options
 * @param {string} [options.paramPrefix] - Namespace for this filter's params (e.g., 'p' or 't'). If omitted, uses unprefixed keys (single-filter pages).
 * @returns {{ data:any, error:any, loading:boolean, updateFilter:Function, clearFilters:Function }}
 */
const useFilter = (baseURL, options = {}) => {
  const { paramPrefix = '' } = options;
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper to produce a prefixed key (when writing to URL)
  const pref = useCallback(
    (key) => (paramPrefix ? `${paramPrefix}_${key}` : key),
    [paramPrefix]
  );

  // Extract ONLY this hook's params from URL and strip the prefix for API usage
  const ownParams = useMemo(() => {
    const obj = {};
    for (const [k, v] of searchParams.entries()) {
      if (!paramPrefix) {
        // No prefix mode (single filter on page)
        obj[k] = v;
      } else if (k.startsWith(`${paramPrefix}_`)) {
        obj[k.slice(paramPrefix.length + 1)] = v; // remove 'p_' / 't_'
      }
    }
    return obj;
  }, [searchParams, paramPrefix]);

  // Build API URL from ONLY this hook's params
  const apiUrl = useMemo(() => {
    const url = new URL(baseURL, window.location.origin);
    Object.entries(ownParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}`.trim() !== '') {
        url.searchParams.set(k, v);
      }
    });
    const finalUrl = url.toString();
    return finalUrl.startsWith('http')
      ? finalUrl
      : `${baseURL}?${url.searchParams.toString()}`;
  }, [baseURL, ownParams]);

  // Diagnostics (optional, keep for debugging)
  useEffect(() => {
    console.log('[Filter] searchParams now:', searchParams.toString());
    console.log('[Filter] ownParams:', ownParams);
    console.log('[Filter] apiUrl ->', apiUrl);
  }, [searchParams, ownParams, apiUrl]);

  // Fetch data whenever apiUrl changes
  const { data, error, loading, fetchData } = useFetch(apiUrl);

  // NOTE: Keep this if useFetch does NOT auto-fetch on URL change.
  useEffect(() => {
    fetchData();
  }, [apiUrl, fetchData]);

  // Write ONLY this hook's prefixed params to the URL
  const updateFilter = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          const v = typeof value === 'string' ? value.trim() : value;
          const pk = pref(key);
          if (v === undefined || v === null || v === '') {
            params.delete(pk);
          } else {
            params.set(pk, v);
          }
        });

        return params;
      });
    },
    [setSearchParams, pref]
  );

  // Clear ONLY this hook's prefixed params
  const clearFilters = useCallback(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (!paramPrefix) {
        // If no prefix mode, clear all params (backwards compatible)
        return new URLSearchParams();
      }

      // Delete only keys that belong to this prefix
      const toDelete = [];
      for (const [k] of params.entries()) {
        if (k.startsWith(`${paramPrefix}_`)) toDelete.push(k);
      }
      toDelete.forEach((k) => params.delete(k));
      return params;
    });
  }, [setSearchParams, paramPrefix]);

  return {
    data,
    error,
    loading,
    updateFilter,
    clearFilters,
  };
};

export default useFilter;
