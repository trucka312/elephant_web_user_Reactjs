import styled from "styled-components"
import { Layout } from "antd"

const { Header } = Layout

export const StyledHeader = styled(Header)`
  z-index: 10;
  padding: 12px 16px!important;
  background: #fff!important;
  box-shadow: 0 2px 8px #f0f1f2;
  position: sticky;
  top: 0;
`