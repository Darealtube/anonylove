import styled from "@emotion/styled";
import { Button } from "@mui/material";

export const AnonyMessage = styled(Button)`
  width: max-content;
  max-width: 100%;
  background-color: #f6f7f8;
  color: #70161e;
  text-transform: none;
  box-shadow: 0px 4px 32px 0px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: 0px 4px 32px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: 0px 4px 32px 0px rgba(0, 0, 0, 0.6);

  :hover {
    background-position: left;
    color: #f6f7f8;
  }
`;
