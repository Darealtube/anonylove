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
import { Chat } from "../../../types/models";
import { getUserResult } from "../../../types/Queries";

//  Set parameter "chats" as optional for now
const ChatList = ({ chat }: { chat?: Chat }) => {
  return (
    <>
      <List sx={{ width: "100%" }}>
        {/* {chats &&
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
          ))} */}
      </List>
    </>
  );
};

export default ChatList;
