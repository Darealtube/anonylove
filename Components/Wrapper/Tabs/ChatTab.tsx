import { List } from "@mui/material";
import { useSession } from "next-auth/react";
import { GET_USER_CHAT } from "../../../apollo/query/userQuery";
import { useQuery, useSubscription } from "@apollo/client";
import { SEEN_CHAT_SUBSCRIPTION } from "../../../apollo/subscription/messageSub";
import { GetUserResult, GetUserVariables } from "../../../types/Queries";
import dynamic from "next/dynamic";

const ChatList = dynamic(() => import("../Lists/ChatList"));

//  Set parameter "chats" as optional for now
const ChatTab = () => {
  const { data: session } = useSession();
  const { data } = useSubscription(SEEN_CHAT_SUBSCRIPTION);
  const { data: query } = useQuery<GetUserResult, GetUserVariables>(
    GET_USER_CHAT,
    {
      variables: {
        name: session?.user?.name as string,
      },
      skip: !session,
    }
  );

  return (
    <List sx={{ width: "100%" }}>
      {query?.getUser?.activeChat && (
        <ChatList chat={query?.getUser?.activeChat} />
      )}
    </List>
  );
};

export default ChatTab;
