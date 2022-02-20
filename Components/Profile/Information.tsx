import { Box, Typography, Divider } from "@mui/material";
import { ReactNode } from "react";

const Information = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <Box mb={2}>
      {children}
      <Divider sx={{ backgroundColor: "white" }} />
      <Typography align="center">{title}</Typography>
    </Box>
  );
};

export default Information;
