import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { RequestConnection } from "../../../types/models";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import dynamic from "next/dynamic";

const DeleteDialog = dynamic(() => import("../DeleteRequestDialog"));

//  Set parameter "requests" as optional for now
const RequestList = ({ requests }: { requests?: RequestConnection }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [targetId, setTargetId] = useState("");

  const handleOpenDeleteDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTargetId(e.currentTarget.id);
    setOpenDelete(true);
  };

  const handleCloseDeleteDialog = () => {
    setTargetId("");
    setOpenDelete(false);
  };

  return (
    <>
      <List sx={{ width: "100%" }}>
        {requests &&
          requests?.edges.map(({ node: request }) => (
            <Box key={request._id}>
              <Box display="flex">
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Image
                      src={request.sender.image as string}
                      alt="Confesser PFP"
                      width={40}
                      height={40}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={request.sender.name}
                    secondary={
                      <>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          I want to confess to you!
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconButton id={request._id} onClick={handleOpenDeleteDialog}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton>
                    <CheckIcon />
                  </IconButton>
                </Box>
              </Box>
              <Divider />
            </Box>
          ))}
      </List>
      <DeleteDialog
        open={openDelete}
        handleClose={handleCloseDeleteDialog}
        requestID={targetId}
      />
    </>
  );
};

export default RequestList;
