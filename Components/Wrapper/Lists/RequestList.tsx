import {
  Box,
  CircularProgress,
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
import { DateTime } from "luxon";
import { getUserResult } from "../../../types/Queries";
import InfiniteScroll from "react-infinite-scroll-component";

const DeleteDialog = dynamic(() => import("../DeleteRequestDialog"));
const AcceptDialog = dynamic(() => import("../AcceptRequestDialog"));

//  Set parameter "requests" as optional for now
const RequestList = ({
  requests,
  moreRequests,
}: {
  requests?: RequestConnection;
  moreRequests?: any;
}) => {
  const dateNow = DateTime.local();
  const [openDelete, setOpenDelete] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [hasMore, setHasMore] = useState(requests?.pageInfo.hasNextPage);
  const [targetId, setTargetId] = useState("");

  const loadMoreRequests = () => {
    moreRequests({
      variables: { after: requests?.pageInfo.endCursor, limit: 10 },
    }).then((fetchMoreResult: { data: getUserResult }) => {
      if (fetchMoreResult.data.getUser) {
        if (
          !fetchMoreResult.data.getUser.receivedConfessionRequests.pageInfo
            .hasNextPage
        ) {
          setHasMore(false);
        }
      }
    });
  };

  const handleOpenAcceptDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTargetId(e.currentTarget.id);
    setOpenAccept(true);
  };

  const handleCloseAcceptDialog = () => {
    setTargetId("");
    setOpenAccept(false);
  };

  const handleOpenDeleteDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    setTargetId(e.currentTarget.id);
    setOpenDelete(true);
  };

  const handleCloseDeleteDialog = () => {
    setTargetId("");
    setOpenDelete(false);
  };

  return (
    <InfiniteScroll
      dataLength={requests?.edges.length as number}
      next={loadMoreRequests}
      hasMore={hasMore as boolean}
      loader={<CircularProgress />}
      style={{ textAlign: "center", overflow: "hidden" }}
      scrollableTarget="chatDrawer"
    >
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
                        {` - ${Math.floor(
                          dateNow.diff(DateTime.fromMillis(+request.date), [
                            "days",
                            "hours",
                            "minutes",
                          ]).minutes
                        )}m`}
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
                  <IconButton id={request._id} onClick={handleOpenAcceptDialog}>
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
      <AcceptDialog
        open={openAccept}
        handleClose={handleCloseAcceptDialog}
        requestID={targetId}
      />
    </InfiniteScroll>
  );
};

export default RequestList;
