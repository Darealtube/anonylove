import {
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { Chat } from "../../../types/models";
import Anonymous from "../../../public/anonyUser.png";
import { useSession } from "next-auth/react";

//  Set parameter "chats" as optional for now
const ChatList = ({ chat }: { chat?: Chat }) => {
  const { data: session } = useSession();
  const confessedTo = session?.user?.name === chat?.confessee.name;
  return (
    <>
      <List sx={{ width: "100%" }}>
        {chat && (
          <>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Image
                  src={
                    confessedTo ? Anonymous : (chat.confessee.image as string)
                  }
                  alt="PFP"
                  width={40}
                  height={40}
                />
              </ListItemAvatar>
              <ListItemText
                primary={confessedTo ? "Anonymous" : chat.confessee.name}
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
        )}
      </List>
    </>
  );
};

export default ChatList;
