import {
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { ChatConnection } from "../../../types/models";
import { getUserResult } from "../../../types/Queries";
import InfiniteScroll from "react-infinite-scroll-component";

//  Set parameter "chats" as optional for now
const ChatList = ({
  chats,
  moreChats,
}: {
  chats?: ChatConnection;
  moreChats?: any;
}) => {
  const [hasMore, setHasMore] = useState(chats?.pageInfo.hasNextPage);
  const loadMoreChats = () => {
    moreChats({
      variables: { after: chats?.pageInfo.endCursor, limit: 10 },
    }).then((fetchMoreResult: { data: getUserResult }) => {
      if (fetchMoreResult.data.getUser) {
        if (!fetchMoreResult.data.getUser.chats.pageInfo.hasNextPage) {
          setHasMore(false);
        }
      }
    });
  };
  return (
    <InfiniteScroll
      dataLength={chats?.edges.length as number}
      next={loadMoreChats}
      hasMore={hasMore as boolean}
      loader={<CircularProgress />}
      style={{ textAlign: "center", overflow: "hidden" }}
      scrollableTarget="chatDrawer"
    >
      <List sx={{ width: "100%" }}>
        {chats &&
          chats?.edges.map((chat) => (
            <>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Image
                    src={chat.node.confessee.image as string}
                    alt="Confesser PFP"
                    width={40}
                    height={40}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={chat.node.confessee.name}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Sample Latest Message {chat.node._id}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </>
          ))}
      </List>
    </InfiniteScroll>
  );
};

export default ChatList;
