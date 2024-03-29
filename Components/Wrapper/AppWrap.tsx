import {
  useMediaQuery,
  useTheme,
  Grid,
  ListItem,
  Typography,
  Skeleton,
} from "@mui/material";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { createContext, ReactNode, useState } from "react";
import { useSubscription, useQuery } from "@apollo/client";
import { GET_PROFILE_CHAT } from "../../apollo/query/userQuery";
import { GetProfileResult, GetProfileVariables } from "../../types/Queries";
import { Chat } from "../../types/models";
import SideBar from "./SideBar";
import { AnonyMenu } from "../Style/AppWrap/AnonyMenu";
import { PROFILE_CHAT_SUBSCRIPTION } from "../../apollo/subscription/chatSub";

// PASSES DOWN notifSeen DATA TO SIDEBAR IN ORDER TO AVOID PROP DRILLING
export const NotificationContext = createContext<{ notifSeen?: boolean }>({
  notifSeen: undefined,
});

const ChatInfo = dynamic(() => import("./Lists/ChatInfo"));
const MobileSideBar = dynamic(() => import("./MobileSideBar"));

const AppWrap = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("md"));
  const { data: session } = useSession();
  const [chatOpen, setChatOpen] = useState(false);
  const { data } = useSubscription(PROFILE_CHAT_SUBSCRIPTION, {
    variables: { profileId: session?.user?.id },
  });
  const { data: { getProfile } = {}, loading } = useQuery<
    GetProfileResult,
    GetProfileVariables
  >(GET_PROFILE_CHAT, {
    variables: { profileId: session?.user?.id as string },
    skip: !session,
  });

  const handleChatOpen = () => {
    setChatOpen(!chatOpen);
  };

  return (
    <>
      <AnonyMenu container>
        <NotificationContext.Provider
          value={{ notifSeen: getProfile?.notifSeen }}
        >
          {!sm ? (
            <SideBar notifSeen={getProfile?.notifSeen}>
              {loading && !getProfile?.activeChat ? (
                <Skeleton variant="rectangular" width="100%" height={80} />
              ) : !loading && getProfile?.activeChat ? (
                <ChatInfo chat={getProfile?.activeChat as Chat} />
              ) : (
                <Typography variant="h5">No Active Chats</Typography>
              )}
            </SideBar>
          ) : (
            <MobileSideBar
              open={chatOpen}
              handleChatList={handleChatOpen}
              notifSeen={getProfile?.notifSeen}
            >
              <ListItem sx={{ display: "flex", flexDirection: "column" }}>
                {loading && !getProfile?.activeChat ? (
                  <Skeleton variant="rectangular" width="100%" height={80} />
                ) : !loading && getProfile?.activeChat ? (
                  <ChatInfo chat={getProfile?.activeChat as Chat} />
                ) : (
                  <Typography variant="h5">No Active Chats</Typography>
                )}
              </ListItem>
            </MobileSideBar>
          )}
        </NotificationContext.Provider>
        <Grid
          item
          xs={12}
          md={8}
          sx={{ color: "white", height: "100%", overflow: "auto" }}
          id="mainContent"
        >
          {children}
        </Grid>
      </AnonyMenu>
    </>
  );
};

export default AppWrap;
