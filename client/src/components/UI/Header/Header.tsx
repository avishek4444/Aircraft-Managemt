import React from "react";

import { Container, Group, Burger, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderSimple.module.css";
import { Link, useNavigate } from "react-router-dom";

import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignOut from "react-auth-kit/hooks/useSignOut";

export default function HeaderSimple() {
  const [opened, { toggle }] = useDisclosure(false);
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const navigate = useNavigate();

  const logout = () => {
    signOut();
    navigate("/");
  };

  return (
    <header className={classes.header}>
      <Container size="xxl" className={classes.inner}>
        <Link to="/">
          <h2 className="font-semibold">Aircraft System</h2>
        </Link>
        <Group gap={10} visibleFrom="xs">
          {isAuthenticated && (
            <Link to="bookinghistory">
              <Button>Booking History</Button>
            </Link>
          )}
          {isAuthenticated ? (
            <Button
              onClick={logout}
              className="font-semibold bg-red-500 py-1 px-2 rounded-sm text-white"
            >
              Logout
            </Button>
          ) : (
            <Link
              to="/login"
              className="font-semibold bg-[#228BE6] py-1 px-2 rounded-sm text-white"
            >
              Login/Signup
            </Link>
          )}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
