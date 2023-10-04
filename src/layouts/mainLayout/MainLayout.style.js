import styled from "styled-components"
import { Layout } from "antd"

const { Content } = Layout

export const StyledContent = styled(Content)`
  background: #fff;
  margin: 15px;
  // padding: 0 20px;
  box-sizing: border-box;
  min-height: calc(100vh - 94px)!important;
`