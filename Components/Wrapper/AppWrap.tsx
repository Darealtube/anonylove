import {
  useMediaQuery,
  useTheme,
  Grid,
  Box,
  AppBar,
  IconButton,
  List,
  ListItem,
  Divider,
  ListItemButton,
  Typography,
  Button,
  Skeleton,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { ReactNode, useState } from "react";
import styles from "../../styles/AppWrap.module.css";
import BrandLogo from "../../public/brandlogoblack.png";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Link from "next/link";
import Image from "next/image";
import ChatList from "./Lists/ChatList";
import { useSubscription, useQuery } from "@apollo/client";
import { GET_USER_CHAT } from "../../apollo/query/userQuery";
import { SEEN_CHAT_SUBSCRIPTION } from "../../apollo/subscription/messageSub";
import { GetUserResult, GetUserVariables } from "../../types/Queries";
import { Chat } from "../../types/models";
import { DateTime } from "luxon";

const MobileDrawer = dynamic(() => import("./MobileDrawer"));

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

  const handleSignOut = () => signOut({ callbackUrl: "/" });

  const chatExpired =
    getUser?.activeChat &&
    (getUser?.activeChat?.expiresAt as number) < DateTime.local().toMillis();

  return (
    <Grid
      container
      sx={{ height: "100vh", color: "black" }}
      className={styles.mainmenu}
    >
      {!sm ? (
        <Grid item md={4} className={styles.drawer} id="chatDrawer">
          <AppBar className={styles.appbar} elevation={0}>
            <Link href="/home" passHref>
              <a>
                <Image src={BrandLogo} alt="LOGO" />
              </a>
            </Link>
            <Box flexGrow={1} />
            <IconButton
              sx={{ height: 40, width: 40 }}
              className={styles.appbaroptions}
            >
              <NotificationsIcon />
            </IconButton>

            <Link href={`/profile/${session?.user?.name}`} passHref>
              <a>
                <Box ml={2}>
                  {session?.user?.image && (
                    <Image
                      src={session.user.image}
                      alt="PFP"
                      width={40}
                      height={40}
                      className={styles.pfp}
                    />
                  )}
                </Box>
              </a>
            </Link>
          </AppBar>

          <List sx={{ flexGrow: 1 }}>
            <ListItem sx={{ pl: 4 }}>
              <Typography>Active Chat</Typography>
            </ListItem>
            <ListItem sx={{ display: "flex", flexDirection: "column" }}>
              {loading && !getUser?.activeChat ? (
                <Skeleton variant="rectangular" width="100%" height={80} />
              ) : !loading && getUser?.activeChat ? (
                <ChatList chat={getUser?.activeChat as Chat} />
              ) : (
                <Typography variant="h5">No Active Chats</Typography>
              )}

              {chatExpired && (
                <Typography sx={{ color: "red" }}>
                  <strong>Chat has expired.</strong>
                </Typography>
              )}
            </ListItem>
            <Divider />
            <Link href="/requests/" passHref>
              <ListItemButton divider sx={{ pl: 4, height: "64px" }}>
                <Typography variant="button">Confession Requests</Typography>
              </ListItemButton>
            </Link>
            <ListItemButton divider sx={{ pl: 4, height: "64px" }}>
              <Typography variant="button">User Settings</Typography>
            </ListItemButton>
            <ListItemButton divider sx={{ pl: 4, height: "64px" }}>
              <Typography variant="button">Reports</Typography>
            </ListItemButton>
          </List>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              mb: 2,
            }}
          >
            <Button sx={{ width: "40%" }} variant="outlined">
              Terms
            </Button>
            <Button sx={{ width: "40%" }} variant="outlined">
              Conditions
            </Button>
          </Box>
          <Button
            fullWidth
            sx={{ color: "#FFC2C2" }}
            className="anonybutton"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <strong>Log Out</strong>
          </Button>
        </Grid>
      ) : (
        <MobileDrawer open={chatOpen} handleChatList={handleChatOpen}>
          <List sx={{ flexGrow: 1 }}>
            <ListItem sx={{ pl: 4 }}>
              <Typography>Active Chat</Typography>
            </ListItem>
            <ListItem sx={{ display: "flex", flexDirection: "column" }}>
              {loading && !getUser?.activeChat ? (
                <Skeleton variant="rectangular" width="100%" height={80} />
              ) : !loading && getUser?.activeChat ? (
                <ChatList chat={getUser?.activeChat as Chat} />
              ) : (
                <Typography variant="h5">No Active Chats</Typography>
              )}

              {chatExpired && (
                <Typography sx={{ color: "red" }}>
                  <strong>Chat has expired.</strong>
                </Typography>
              )}
            </ListItem>
            <Divider />
            <Link href="/requests/" passHref>
              <ListItemButton divider sx={{ pl: 4, height: "64px" }}>
                <Typography variant="button">Confession Requests</Typography>
              </ListItemButton>
            </Link>
            <ListItemButton divider sx={{ pl: 4, height: "64px" }}>
              <Typography variant="button">User Settings</Typography>
            </ListItemButton>
            <ListItemButton divider sx={{ pl: 4, height: "64px" }}>
              <Typography variant="button">Reports</Typography>
            </ListItemButton>
          </List>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              paddingLeft: "16px",
              paddingRight: "16px",

              mb: 2,
            }}
          >
            <Button fullWidth variant="outlined" sx={{ mb: 2 }}>
              Terms
            </Button>
            <Button fullWidth variant="outlined">
              Conditions
            </Button>
          </Box>
          <Button
            fullWidth
            sx={{ color: "#FFC2C2" }}
            className="anonybutton"
            onClick={handleSignOut}
          >
            <strong>Log Out</strong>
          </Button>
        </MobileDrawer>
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
  );
};

export default AppWrap;
