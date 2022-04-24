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
import styles from "../../../styles/List.module.css";
import Link from "next/link";

//  Set parameter "chats" as optional for now
const ChatList = ({ chat }: { chat?: Chat }) => {
  const { data: session } = useSession();
  const confessedTo = session?.user?.name === chat?.confessee.name;
  const lastSeen = confessedTo ? chat?.confesseeLastSeen : chat?.anonLastSeen;
  const chatUnseen = chat
    ? (chat as Chat).updatedAt > (lastSeen as number)
    : false;

  return (
    <List sx={{ width: "100%" }}>
      {chat && (
        <>
          <Link href="/activeChat" passHref>
            <a>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Image
                    src={
                      confessedTo ? Anonymous : (chat.confessee.image as string)
                    }
                    alt="PFP"
                    width={40}
                    height={40}
                    className={styles.avatar}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={confessedTo ? "Anonymous" : chat.confessee.name}
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.primary"
                      whiteSpace="nowrap"
                      textOverflow="ellipsis"
                      overflow="hidden"
                      width="100%"
                    >
                      {chatUnseen ? (
                        <strong>{chat?.latestMessage.message}</strong>
                      ) : (
                        chat?.latestMessage.message
                      )}
                    </Typography>
                  }
                />
              </ListItem>
            </a>
          </Link>
          <Divider />
        </>
      )}
    </List>
  );
};

export default ChatList;
