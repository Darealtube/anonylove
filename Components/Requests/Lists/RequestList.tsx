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
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import { DateTime } from "luxon";
import InfiniteScroll from "react-infinite-scroll-component";
import Anonymous from "../../../public/anonyUser.png";
import { GetUserResult } from "../../../types/Queries";
import { QueryConnection, Request } from "../../../types/models";

//  Set parameter "requests" as optional for now
const RequestList = ({
  requests,
  moreRequests,
  handleOpenDialog,
  hasActiveChat,
}: {
  requests: QueryConnection<Request> | undefined;
  moreRequests?: any;
  handleOpenDialog: (e: React.MouseEvent<HTMLButtonElement>) => void;
  hasActiveChat: boolean;
}) => {
  const dateNow = DateTime.local();
  const [hasMore, setHasMore] = useState(requests?.pageInfo.hasNextPage);

  const loadMoreRequests = () => {
    moreRequests({
      variables: {
        after: requests?.pageInfo.endCursor,
        limit: 10,
      },
    }).then((fetchMoreResult: { data: GetUserResult }) => {
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

  return (
    <>
      {requests && (
        <InfiniteScroll
          dataLength={requests.edges.length as number}
          next={loadMoreRequests}
          hasMore={hasMore as boolean}
          loader={<CircularProgress />}
          style={{ textAlign: "center", overflow: "hidden" }}
          scrollableTarget="mainContent"
        >
          <List sx={{ width: "100%" }}>
            {requests?.edges.map(({ node: request }) => (
              <Box key={request._id}>
                <Box display="flex">
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Image
                        src={Anonymous}
                        alt="Confesser PFP"
                        width={40}
                        height={40}
                        className="avatar"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={"Anonymous"}
                      secondary={
                        <>
                          <Typography
                            sx={{ display: "inline", color: "#f6f7f8" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            I want to confess to you!
                          </Typography>
                          <br />
                          <Typography
                            sx={{ color: "#f6f7f8" }}
                            variant="caption"
                          >
                            {`${dateNow
                              .diff(DateTime.fromMillis(+request.date), [
                                "days",
                                "hours",
                                "minutes",
                              ])
                              .toHuman({
                                maximumSignificantDigits: 1,
                                minimumIntegerDigits: 1,
                                listStyle: "narrow",
                              })} ago`}
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
                    <IconButton
                      id={request._id}
                      onClick={handleOpenDialog}
                      value="reject"
                      sx={{ color: "#f6f7f8" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    {!hasActiveChat ? (
                      <IconButton
                        id={request._id}
                        onClick={handleOpenDialog}
                        value="accept"
                        sx={{ color: "#f6f7f8" }}
                      >
                        <CheckIcon />
                      </IconButton>
                    ) : (
                      <Typography variant="subtitle2">
                        Cannot accept requests with an active chat.
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Divider />
              </Box>
            ))}
          </List>
        </InfiniteScroll>
      )}
    </>
  );
};

export default RequestList;
