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
import { DateTime } from "luxon";
import { GetUserResult } from "../../../types/Queries";
import InfiniteScroll from "react-infinite-scroll-component";
import Anonymous from "../../../public/anonyUser.png";
import styles from "../../../styles/List.module.css";

//  Set parameter "requests" as optional for now
const YourRequestList = ({
  requests,
  moreRequests,
  handleOpenDialog,
}: {
  requests?: RequestConnection;
  moreRequests?: any;
  handleOpenDialog: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const dateNow = DateTime.local();
  const [hasMore, setHasMore] = useState(requests?.pageInfo.hasNextPage);

  const loadMoreRequests = () => {
    moreRequests({
      variables: { after: requests?.pageInfo.endCursor, limit: 10 },
    }).then((fetchMoreResult: { data: GetUserResult }) => {
      if (fetchMoreResult.data.getUser) {
        if (
          !fetchMoreResult.data.getUser.sentConfessionRequests.pageInfo
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
          dataLength={requests?.edges.length as number}
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
                            Sent Request.
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
                  <IconButton id={request._id} onClick={handleOpenDialog}>
                    <DeleteIcon />
                  </IconButton>
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

export default YourRequestList;
