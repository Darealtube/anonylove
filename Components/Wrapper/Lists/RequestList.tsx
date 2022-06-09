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
import styles from "../../../styles/List.module.css";
import { RequestConnection } from "../../../types/models";
import { GetUserResult } from "../../../types/Queries";

//  Set parameter "requests" as optional for now
const RequestList = ({
  requests,
  moreRequests,
  handleOpenDialog,
}: {
  requests: RequestConnection | undefined;
  moreRequests?: any;
  handleOpenDialog: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
          scrollableTarget="chatDrawer"
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
                        className={styles.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={"Anonymous"}
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
                          <br />
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
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      id={request._id}
                      onClick={handleOpenDialog}
                      value="accept"
                    >
                      <CheckIcon />
                    </IconButton>
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
