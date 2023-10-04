import styled from "styled-components";
import { Layout } from "antd";

const { Sider } = Layout;

export const StyledSidebar = styled(Sider)`
  background-color: #f0f2f5;
  z-index: 11;
  padding: 0;
  transition: all 0.5s ease-in;
  .ant-layout-sider-children {
    background: #fff;
  }
  .ant-menu-item-selected {
    color: #1890ff;
    background-color: #e6f7ff !important;
  }
  .ant-menu-item-active {
    color: #1890ff;
  }
  .ant-menu.ant-menu-root {
    position: absolute;
    border-inline-end: none;
    // overflow-y: scroll;
    margin: 4px 0 0 !important;
    height: calc(100vh - 84px);
  }
  .ant-menu-submenu-title .ant-menu-title-content a {
    color: #000
  }
  .ant-menu-submenu-selected .ant-menu-submenu-title .ant-menu-title-content a {
    color: #1677ff
  }
`;
export const StyledLogo = styled.div`
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  margin: 0;
  padding: 10px 20px;
  box-shadow: 0 2px 8px #f0f1f2;
  h1 {
    margin: 0 0 0 10px;
    font-weight: 900;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
