import {
  useMediaQuery,
  useTheme,
  Grid,
  Container,
  Box,
  AppBar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { createContext, ReactNode, useState } from "react";
import ChatList from "./Lists/ChatList";
import styles from "../../styles/AppWrap.module.css";
import { useQuery, useSubscription } from "@apollo/client";
import BrandLogo from "../../public/brandlogoblack.png";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { TabPanel } from "@mui/lab";
import Link from "next/link";
import Image from "next/image";
import RequestList from "./Lists/RequestList";
import { GET_USER_SOCIALS } from "../../apollo/query/userQuery";
import Tabs from "./Tabs";
import { SEEN_CHAT_SUBSCRIPTION } from "../../apollo/subscription/messageSub";

export const ActiveChatContext = createContext(true);
const MobileDrawer = dynamic(() => import("./MobileDrawer"));

const AppWrap = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("md"));
  const { data: session } = useSession();
  const [chatOpen, setChatOpen] = useState(false);

  const {
    data: infoQuery,
    fetchMore: moreRequests,
    loading,
  } = useQuery(GET_USER_SOCIALS, {
    variables: {
      limit: 10,
      name: session?.user?.name,
    },
    skip: !session,
  });

  const { data } = useSubscription(SEEN_CHAT_SUBSCRIPTION);
  const handleChatOpen = () => {
    setChatOpen(!chatOpen);
  };

  const hasActiveChat = infoQuery?.getUser?.activeChat ? true : false;

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

            <IconButton
              sx={{ height: 40, width: 40 }}
              className={styles.appbaroptions}
            >
              <SettingsIcon />
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

          <Tabs hasActiveChat={loading ? true : hasActiveChat}>
            <TabPanel value="chat">
              <Container sx={{ zIndex: 1 }}>
                {!loading ? (
                  <ChatList chat={infoQuery?.getUser?.activeChat} />
                ) : (
                  <Box className={styles.loading}>
                    <CircularProgress />
                  </Box>
                )}
              </Container>
            </TabPanel>
            <TabPanel value="request">
              <Container sx={{ zIndex: 1 }}>
                {!loading ? (
                  <RequestList
                    requests={infoQuery?.getUser?.receivedConfessionRequests}
                    moreRequests={moreRequests}
                  />
                ) : (
                  <Box className={styles.loading}>
                    <CircularProgress />
                  </Box>
                )}
              </Container>
            </TabPanel>
          </Tabs>
        </Grid>
      ) : (
        <MobileDrawer open={chatOpen} handleChatList={handleChatOpen}>
          <Tabs hasActiveChat={loading ? true : hasActiveChat}>
            <TabPanel value="chat">
              <Container sx={{ zIndex: 1 }}>
                {infoQuery?.getUser?.activeChat ? (
                  <ChatList chat={infoQuery?.getUser?.activeChat} />
                ) : (
                  <Box className={styles.loading}>
                    <CircularProgress />
                  </Box>
                )}
              </Container>
            </TabPanel>
            <TabPanel value="request">
              <Container sx={{ zIndex: 1 }}>
                {infoQuery?.getUser?.receivedConfessionRequests ? (
                  <RequestList
                    requests={infoQuery?.getUser?.receivedConfessionRequests}
                    moreRequests={moreRequests}
                  />
                ) : (
                  <Box className={styles.loading}>
                    <CircularProgress />
                  </Box>
                )}
              </Container>
            </TabPanel>
          </Tabs>
        </MobileDrawer>
      )}
      <Grid
        item
        xs={12}
        md={8}
        sx={{ color: "white", height: "100%", overflow: "auto" }}
      >
        <ActiveChatContext.Provider value={loading ? true : hasActiveChat}>
          {children}
        </ActiveChatContext.Provider>
      </Grid>
    </Grid>
  );
};

export default AppWrap;
