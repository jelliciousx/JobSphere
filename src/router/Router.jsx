import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Profile from "../pages/Profile"; // ← This must match the file name
import TermsAndConditions from "../pages/TermsAndConditions";
import Jobs from "../pages/Jobs";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import DashboardHome from "../pages/admin/DashboardHome.jsx";
import PostJob from "../pages/admin/PostJob.jsx";
import JobListings from "../pages/admin/JobListings.jsx";
import Applicants from "../pages/admin/Applicants.jsx";
import AdminMessages from "../pages/admin/AdminMessages.jsx";
import AdminRoute from "../components/AdminRoute.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import PrivacyPolicy from "../pages/PrivacyPolicy.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: "terms", element: <TermsAndConditions /> },
      { path: "privacy", element: <PrivacyPolicy /> },
      { path: "jobs", element: <Jobs /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "post-job", element: <PostJob /> },
      { path: "jobs", element: <JobListings /> },
      { path: "applicants", element: <Applicants /> },
      { path: "messages", element: <AdminMessages /> },
    ],
  },
]);
