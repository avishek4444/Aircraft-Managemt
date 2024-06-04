import React from "react";
import { useState } from "react";
import { Group, Code } from "@mantine/core";
import {
  IconLogout,
  IconPlaneTilt
} from "@tabler/icons-react";
import classes from "./NavbarSimple.module.css";
import { NavLink } from "react-router-dom";

import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from "react-router-dom";

const data = [
  { link: "/admin", label: "Aircafts", icon: IconPlaneTilt },
];

export default function NavbarSimple() {
  const [active, setActive] = useState("Aircafts");
  const signOut = useSignOut()
  const navigate = useNavigate()

  const adminSignOut = () => {
    signOut();
    navigate("/");
  }

  const links = data.map((item) => (
    <NavLink
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={(event) => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </NavLink>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <button onClick={adminSignOut} className={classes.link}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
