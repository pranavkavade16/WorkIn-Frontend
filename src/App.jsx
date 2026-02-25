import FrontPage from "../pages/FrontPage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { WorkInProvider } from "../context/workInContext";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Projects from "../pages/Projects";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import TaskDetails from "../pages/TaskDetails";
import ProjectDetails from "../pages/ProjectDetails";
import Teams from "../pages/Teams";
import TeamDetails from "../pages/TeamDetails";
import Reports from "../pages/Reports";
import Toast from "../components/Toast";

import {
  RequireAuth,
  RedirectIfAuthed,
  ProtectedLayout,
} from "../routes/routeGuards";

function App() {
  return (
    <>
      <WorkInProvider>
        <BrowserRouter>
          <Routes>
            {/* Public: Login & Signup (redirect to /dashboard if already authed) */}
            <Route element={<RedirectIfAuthed />}>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

            {/* Protected: Requires token and shows layout with SideBar */}
            <Route element={<RequireAuth />}>
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<FrontPage />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/taskDetails/:taskId" element={<TaskDetails />} />
                <Route
                  path="/projectDetails/:projectId"
                  element={<ProjectDetails />}
                />
                <Route path="/teams" element={<Teams />} />
                <Route path="/teamDetails/:teamId" element={<TeamDetails />} />
                <Route path="/reports" element={<Reports />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toast />
        </BrowserRouter>
      </WorkInProvider>
    </>
  );
}

export default App;
