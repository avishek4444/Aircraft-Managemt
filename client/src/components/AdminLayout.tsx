import React, { useEffect } from "react";
import Layout from "components/UI/Layout/layout";
import AdminNavBar from "components/UI/AdminNavbar/AdminNavBar";

import { Outlet, useNavigate } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const AdminLayout = () => {
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated == false || auth.role !== "admin") {
      return navigate(-1);
    }
  }, [isAuthenticated, auth]);

  return (
    <Layout role="Admin" Navbar={AdminNavBar}>
      <Outlet />
    </Layout>
  );
};

export default AdminLayout;
