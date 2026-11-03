import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import TaskFormPage from "./pages/TaskFormPage.jsx";
import Upcoming from "./pages/Upcoming.jsx";
import Completed from "./pages/Completed.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="tasks/new" element={<TaskFormPage key="new" />} />
        <Route path="tasks/:id/edit" element={<TaskFormPage key="edit" />} />
        <Route path="upcoming" element={<Upcoming />} />
        <Route path="completed" element={<Completed />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
