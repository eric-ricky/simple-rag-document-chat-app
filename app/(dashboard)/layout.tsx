import React from "react";
import { PropsWithChildren } from "react";
import Sidebar from "./_components/sidebar";
import Header from "./_components/header";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
