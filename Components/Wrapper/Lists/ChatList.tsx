import {
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import { ChatConnection } from "../../../types/models";

//  Set parameter "chats" as optional for now
const ChatList = ({ chats }: { chats?: ChatConnection }) => {
  return (
    <>
      <List sx={{ width: "100%" }}>
        {chats &&
          chats?.edges.map((chat) => (
            <>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Image
                    src={chat.node.confesser.image as string}
                    alt="Confesser PFP"
                    width={40}
                    height={40}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={chat.node.confesser.name}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Sample Latest Message
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </>
          ))}
      </List>
    </>
  );
};

export default ChatList;
