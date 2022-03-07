import {
  useMediaQuery,
  useTheme,
  Grid,
  Container,
  Tab,
  Box,
  AppBar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { ReactNode, SyntheticEvent, useState } from "react";
import ChatList from "./Lists/ChatList";
import styles from "../../styles/AppWrap.module.css";
import { useQuery } from "@apollo/client";
import { GET_USER_CONFESSION_REQUESTS } from "../../apollo/query/requestQuery";
import BrandLogo from "../../public/brandlogoblack.png";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Link from "next/link";
import Image from "next/image";
import RequestList from "./Lists/RequestList";
import { GET_USER_CHATS } from "../../apollo/query/chatQuery";

const MobileDrawer = dynamic(() => import("./MobileDrawer"));

const AppWrap = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("md"));
  const { data: session } = useSession();
  const [chatOpen, setChatOpen] = useState(false);
  const [tab, setTab] = useState("chat");
  
  const { data: chatQuery, fetchMore: moreChats } = useQuery(GET_USER_CHATS, {
    variables: {
      limit: 10,
      name: session?.user?.name,
    },
    skip: !session,
  });

  const { data: requestQuery, fetchMore: moreRequests } = useQuery(
    GET_USER_CONFESSION_REQUESTS,
    {
      variables: {
        limit: 10,
        name: session?.user?.name,
      },
      skip: !session,
    }
  );

  const handleChatOpen = () => {
    setChatOpen(!chatOpen);
  };

  const handleTabChange = (
    _event: SyntheticEvent<Element, Event>,
    tab: string
  ) => {
    setTab(tab);
  };

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

          <TabContext value={tab}>
            <Box sx={{ borderColor: "divider" }} className={styles.tabs}>
              <TabList onChange={handleTabChange} centered>
                <Tab label="Chats" value="chat" />
                <Tab label="Requests" value="request" />
              </TabList>
            </Box>
            <TabPanel value="chat">
              <Container sx={{ zIndex: 1 }}>
                {chatQuery?.getUser?.chats ? (
                  <ChatList
                    chats={chatQuery?.getUser?.chats}
                    moreChats={moreChats}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </Container>
            </TabPanel>
            <TabPanel value="request">
              <Container sx={{ zIndex: 1 }}>
                {requestQuery?.getUser?.receivedConfessionRequests ? (
                  <RequestList
                    requests={requestQuery?.getUser?.receivedConfessionRequests}
                    moreRequests={moreRequests}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </Container>
            </TabPanel>
          </TabContext>
        </Grid>
      ) : (
        <MobileDrawer open={chatOpen} handleChatList={handleChatOpen}>
          <TabContext value={tab}>
            <Box sx={{ borderColor: "divider" }} className={styles.tabs}>
              <TabList onChange={handleTabChange} centered>
                <Tab label="Chats" value="chat" />
                <Tab label="Requests" value="request" />
              </TabList>
            </Box>
            <TabPanel value="chat">
              <Container sx={{ zIndex: 1 }}>
                {chatQuery?.getUser?.chats ? (
                  <ChatList
                    chats={chatQuery?.getUser?.chats}
                    moreChats={moreChats}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </Container>
            </TabPanel>
            <TabPanel value="request">
              <Container sx={{ zIndex: 1 }}>
                {requestQuery?.getUser?.receivedConfessionRequests ? (
                  <RequestList
                    requests={requestQuery?.getUser?.receivedConfessionRequests}
                    moreRequests={moreRequests}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </Container>
            </TabPanel>
          </TabContext>
        </MobileDrawer>
      )}
      <Grid
        item
        xs={12}
        md={8}
        sx={{ color: "white", height: "100%", overflow: "auto" }}
      >
        {children}
      </Grid>
    </Grid>
  );
};

export default AppWrap;
