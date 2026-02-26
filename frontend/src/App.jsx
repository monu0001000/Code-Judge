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
          <Layout>
            <Dashboard />
          </Layout>
        }
      />

      <Route
        path="/problems"
        element={
          <Layout>
            <Problems />
          </Layout>
        }
      />

      <Route
        path="/judge/:id"
        element={
          <Layout>
            <Judge />
          </Layout>
        }
      />

      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/submission/:id"
        element={
       <Layout>
      <SubmissionView />
    </Layout>
  }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}