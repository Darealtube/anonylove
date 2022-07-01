import styled from "@emotion/styled";
import { Paper } from "@mui/material";

export const AnonyBio = styled(Paper)`
  background: rgb(239, 169, 174);
  background: linear-gradient(
    356deg,
    rgba(239, 169, 174, 1) 30%,
    rgba(229, 83, 129, 1) 70%
  );
  width: 100%;
  height: 220px;
  overflow: auto;
  padding: 48px 16px 16px 16px;
  text-align: center;
  color: #f6f7f8;
  wordbreak: break-word;
  overflowwrap: break-word;
`;
