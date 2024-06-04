import React, { useEffect } from "react";
import Header from "components/UI/Header/Header";

import { Outlet, useNavigate } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const ClientLayout = () => {
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isAuthenticated == false || auth.role !== "client") {
  //     return navigate(-1);
  //   }
  // }, [isAuthenticated, auth]);
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default ClientLayout;
