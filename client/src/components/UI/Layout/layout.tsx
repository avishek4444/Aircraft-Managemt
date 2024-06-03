import React from "react";

import { AppShell, Burger, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

function Layout({ children, Navbar, role }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header className="shadow-md bg-slate-400 flex justify-left items-center px-3 text-white">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div>
        <h2 className="font-semibold text-md">
          Aircraft System <span className="text-sm">({role})</span>
        </h2>
        
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md" bg="#eee">
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main bg="#757575">{children}</AppShell.Main>
    </AppShell>
  );
}

export default Layout;
