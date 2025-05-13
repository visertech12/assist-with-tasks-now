
import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Kyc from "./pages/Kyc";
import KycNotVerified from "./pages/KycNotVerified";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import PendingApplications from "./pages/admin/PendingApplications";
import ApprovedApplications from "./pages/admin/ApprovedApplications";
import RejectedApplications from "./pages/admin/RejectedApplications";
import ApplicationDetail from "./pages/admin/ApplicationDetail";
import Achievements from "./pages/Achievements";
import Help from "./pages/Help";
import { Toaster } from "sonner";
import Preloader from "./components/Preloader";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Kyc />,
    errorElement: <Kyc />,
  },
  {
    path: "/not-verified",
    element: <KycNotVerified />,
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/admin/pending",
    element: <PendingApplications />,
  },
  {
    path: "/admin/approved",
    element: <ApprovedApplications />,
  },
  {
    path: "/admin/rejected",
    element: <RejectedApplications />,
  },
  {
    path: "/admin/applications/:id",
    element: <ApplicationDetail />,
  },
  {
    path: "/achievements",
    element: <Achievements />,
  },
  {
    path: "/help",
    element: <Help />,
  }
]);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Preloader />}
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
