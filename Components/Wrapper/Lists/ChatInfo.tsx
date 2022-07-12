import {
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Anonymous from "../../../public/anonyUser.png";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Chat } from "../../../types/models";

//  Set parameter "chats" as optional for now
const ChatInfo = ({ chat }: { chat: Chat }) => {
  const { data: session } = useSession();
  const confessedTo = session?.user?.id === chat?.confessee._id;
  const chatSeen = confessedTo ? chat?.confesseeSeen : chat?.anonSeen;
  const sentByYou =
    chat?.latestMessage &&
    ((confessedTo && !chat?.latestMessage?.anonymous) ||
      (!confessedTo && chat?.latestMessage?.anonymous));

  return (
    <>
      <Link href="/activeChat" passHref>
        <ListItemButton
          alignItems="flex-start"
          LinkComponent="a"
          sx={{ width: "100%" }}
        >
          <ListItemAvatar>
            <Image
              src={confessedTo ? Anonymous : (chat?.confessee.image as string)}
              alt="PFP"
              width={40}
              height={40}
              className="avatar"
            />
          </ListItemAvatar>
          <ListItemText
            primary={confessedTo ? "Anonymous" : chat?.confessee.name}
            secondary={
              <Typography
                variant="body2"
                color="text.primary"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                overflow="hidden"
                width="100%"
              >
                {!chat?.latestMessage && <strong>Send a Message!</strong>}
                {!chatSeen ? (
                  <strong>
                    {sentByYou && "You: "}
                    {chat?.latestMessage?.message}
                  </strong>
                ) : (
                  <>
                    {sentByYou && "You: "}
                    {chat?.latestMessage?.message}
                  </>
                )}
              </Typography>
            }
          />
        </ListItemButton>
      </Link>
    </>
  );
};

export default ChatInfo;
