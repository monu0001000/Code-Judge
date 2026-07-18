import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Problems from "./pages/Problems";
import Judge from "./pages/Judge";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import SubmissionView from "./pages/SubmissionView";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/problems"
        element={
          <ProtectedRoute>
            <Layout>
              <Problems />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/judge/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <Judge />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/submission/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <SubmissionView />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
