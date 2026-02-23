import { Navigate, Outlet, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar";

// ✅ Simple auth check using localStorage token
const isAuthed = () => !!localStorage.getItem("token");

// ✅ Guard: Only allow if authenticated; otherwise redirect to login
export const RequireAuth = () => {
  const location = useLocation();
  return isAuthed() ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};

// ✅ Guard: If already authenticated, redirect away from public pages (login/signup)
export const RedirectIfAuthed = () => {
  return isAuthed() ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

// ✅ Protected layout that shows the sidebar for authed pages
export const ProtectedLayout = ({ children }) => {
  return (
    <div className="app-shell d-flex">
      <SideBar />
      <div className="flex-grow-1">{children || <Outlet />}</div>
    </div>
  );
};
