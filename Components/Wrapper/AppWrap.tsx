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
import ChatInfo from "./Lists/ChatInfo";
import { useSubscription, useQuery } from "@apollo/client";
import { GET_PROFILE_CHAT } from "../../apollo/query/userQuery";
import { SEEN_CHAT_SUBSCRIPTION } from "../../apollo/subscription/messageSub";
import { GetProfileResult, GetProfileVariables } from "../../types/Queries";
import { Chat } from "../../types/models";
import { DateTime } from "luxon";
import SideBar from "./SideBar";
import { AnonyMenu } from "../Style/AppWrap/AnonyMenu";

export const NotificationContext = createContext<{ notifSeen?: boolean }>({
  notifSeen: undefined,
});
const MobileSideBar = dynamic(() => import("./MobileSideBar"));

const AppWrap = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("md"));
  const { data: session } = useSession();
  const [chatOpen, setChatOpen] = useState(false);
  const { data } = useSubscription(SEEN_CHAT_SUBSCRIPTION);
  const { data: { getProfile } = {}, loading } = useQuery<
    GetProfileResult,
    GetProfileVariables
  >(GET_PROFILE_CHAT, {
    variables: { id: session?.user?.id as string },
    skip: !session,
    fetchPolicy: "network-only",
  });

  const handleChatOpen = () => {
    setChatOpen(!chatOpen);
  };

  const chatExpired =
    getProfile?.activeChat &&
    (getProfile?.activeChat?.expiresAt as number) < DateTime.local().toMillis();

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

              {chatExpired && (
                <Typography sx={{ color: "red" }}>
                  <strong>Chat has expired.</strong>
                </Typography>
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

                {chatExpired && (
                  <Typography sx={{ color: "red" }}>
                    <strong>Chat has expired.</strong>
                  </Typography>
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
