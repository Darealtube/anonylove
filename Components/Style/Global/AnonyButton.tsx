import styled from "@emotion/styled";
import { Button } from "@mui/material";

export const AnonyButton = styled(Button)`
  background: transparent;
  color: #f6f7f8 initial;
  background: linear-gradient(to left, transparent 50%, #70161e 50%) right;
  background-size: 200%;
  transition: 0.2s ease-out;

  :hover {
    background-position: left;
  }
`;
