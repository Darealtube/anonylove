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
import { ReactNode, useState } from "react";
import styles from "../../styles/AppWrap.module.css";
import ChatInfo from "./Lists/ChatInfo";
import { useSubscription, useQuery } from "@apollo/client";
import { GET_USER_CHAT } from "../../apollo/query/userQuery";
import { SEEN_CHAT_SUBSCRIPTION } from "../../apollo/subscription/messageSub";
import { GetUserResult, GetUserVariables } from "../../types/Queries";
import { Chat } from "../../types/models";
import { DateTime } from "luxon";
import SideBar from "./SideBar";

const MobileSideBar = dynamic(() => import("./MobileSideBar"));

const AppWrap = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("md"));
  const { data: session } = useSession();
  const [chatOpen, setChatOpen] = useState(false);
  const { data } = useSubscription(SEEN_CHAT_SUBSCRIPTION);
  const { data: { getUser } = {}, loading } = useQuery<
    GetUserResult,
    GetUserVariables
  >(GET_USER_CHAT, {
    variables: {
      name: session?.user?.name as string,
    },
    skip: !session,
    fetchPolicy: "network-only",
  });

  const handleChatOpen = () => {
    setChatOpen(!chatOpen);
  };

  const chatExpired =
    getUser?.activeChat &&
    (getUser?.activeChat?.expiresAt as number) < DateTime.local().toMillis();

  return (
    <>
      <Grid
        container
        sx={{ height: "100vh", color: "black" }}
        className={styles.mainmenu}
      >
        {!sm ? (
          <SideBar>
            {loading && !getUser?.activeChat ? (
              <Skeleton variant="rectangular" width="100%" height={80} />
            ) : !loading && getUser?.activeChat ? (
              <ChatInfo chat={getUser?.activeChat as Chat} />
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
          <MobileSideBar open={chatOpen} handleChatList={handleChatOpen}>
            <ListItem sx={{ display: "flex", flexDirection: "column" }}>
              {loading && !getUser?.activeChat ? (
                <Skeleton variant="rectangular" width="100%" height={80} />
              ) : !loading && getUser?.activeChat ? (
                <ChatInfo chat={getUser?.activeChat as Chat} />
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
        <Grid
          item
          xs={12}
          md={8}
          sx={{ color: "white", height: "100%", overflow: "auto" }}
          id="mainContent"
        >
          {children}
        </Grid>
      </Grid>
    </>
  );
};

export default AppWrap;
