import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { taskApi } from "../services/api.js";
import ToastStack from "../components/ToastStack.jsx";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  const notify = useCallback((type, message) => {
    const id = ++toastId.current;
    setToasts((current) => [...current, { id, type, message }]);
    setTimeout(
      () => setToasts((current) => current.filter((t) => t.id !== id)),
      4000,
    );
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await taskApi.list();
      setTasks(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Each mutation sends the change to the API first and stores the saved document it returns.
  const createTask = async (data) => {
    const response = await taskApi.create(data);
    setTasks((current) => [response.data, ...current]);
    notify("success", "Task created");
    return response.data;
  };

  const updateTask = async (id, data) => {
    const response = await taskApi.update(id, data);
    setTasks((current) =>
      current.map((t) => (t._id === id ? response.data : t)),
    );
    notify("success", "Task updated");
    return response.data;
  };

  const toggleTask = async (id) => {
    try {
      const response = await taskApi.toggle(id);
      setTasks((current) =>
        current.map((t) => (t._id === id ? response.data : t)),
      );
      notify(
        "success",
        response.data.completed ? "Marked as completed" : "Marked as pending",
      );
    } catch (err) {
      notify("error", err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskApi.remove(id);
      setTasks((current) => current.filter((t) => t._id !== id));
      notify("success", "Task deleted");
    } catch (err) {
      notify("error", err.message);
      if (err.status === 404)
        setTasks((current) => current.filter((t) => t._id !== id));
    }
  };

  const value = {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    notify,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used inside TaskProvider");
  return context;
}
