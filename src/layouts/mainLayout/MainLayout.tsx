import React, { Children, useState } from "react";
import { Layout } from "antd";
import Sidebar from "../../components/sidebar/SideBar";
import Header from "../../components/header";
import { StyledContent } from "./MainLayout.style";
import { Outlet } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout>
      <Sidebar collapsed={collapsed} />
      <Scrollbars
        style={{ height: "100vh" }}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
      >
        <Layout>
          <Header
            changeCollapsed={() => setCollapsed(!collapsed)}
            collapsed={collapsed}
          />
          <StyledContent>
            <Outlet />
          </StyledContent>
        </Layout>
      </Scrollbars>
    </Layout>
  );
};
export default MainLayout;
