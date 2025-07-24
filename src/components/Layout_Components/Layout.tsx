import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import Navbar from "./Navbar";
import "./layout.scss";

const AppLayout: React.FC = () => {
  return (
    <Layout className="global-layout" style={{ minHeight: "100vh" }}>
      <Navbar />
      <Layout.Content className="outlet-layout" style={{ padding: "24px" }}>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default AppLayout;
