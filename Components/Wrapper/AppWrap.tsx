import {
  useMediaQuery,
  useTheme,
  Grid,
  Container,
  Box,
  AppBar,
  IconButton,
} from "@mui/material";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { ReactNode, useState } from "react";
import styles from "../../styles/AppWrap.module.css";
import BrandLogo from "../../public/brandlogoblack.png";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { TabPanel } from "@mui/lab";
import Link from "next/link";
import Image from "next/image";
import Tabs from "./Tabs";

const MobileDrawer = dynamic(() => import("./MobileDrawer"));
const ChatTab = dynamic(() => import("./Tabs/ChatTab"));
const RequestTab = dynamic(() => import("./Tabs/RequestTab"));
const YourRequestTab = dynamic(() => import("./Tabs/YourRequestTab"));

const AppWrap = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("md"));
  const { data: session } = useSession();
  const [chatOpen, setChatOpen] = useState(false);

  const handleChatOpen = () => {
    setChatOpen(!chatOpen);
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

          <Tabs>
            <TabPanel value="chat">
              <Container sx={{ zIndex: 1 }}>
                <ChatTab />
              </Container>
            </TabPanel>
            <TabPanel value="request">
              <Container sx={{ zIndex: 1 }}>
                <RequestTab />
              </Container>
            </TabPanel>

            <TabPanel value="yourRequest">
              <Container sx={{ zIndex: 1 }}>
                <YourRequestTab />
              </Container>
            </TabPanel>
          </Tabs>
        </Grid>
      ) : (
        <MobileDrawer open={chatOpen} handleChatList={handleChatOpen}>
          {/* <Tabs hasActiveChat={loading ? true : hasActiveChat}>
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
          </Tabs> */}
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
