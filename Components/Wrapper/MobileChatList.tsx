import BrandLogo from "../../public/brandlogoblack.png";
import styles from "../../styles/AppWrap.module.css";
import Image from "next/image";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  SwipeableDrawer,
  Box,
  AppBar,
  IconButton,
  Container,
} from "@mui/material";
import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import { Session } from "next-auth";
import Link from "next/link";

type MobileChatListProps = {
  handleChatList: () => void;
  open: boolean;
  session: Session | null;
};

const MobileChatList = ({
  handleChatList,
  open,
  session,
}: MobileChatListProps) => {
  return (
    <>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={handleChatList}
        onOpen={handleChatList}
      >
        <Container>
          <AppBar
            sx={{
              position: "sticky",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            color="transparent"
            elevation={0}
          >
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
          <Divider />
          <List sx={{ width: "100%" }}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText
                primary="Brunch this weekend?"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Ali Connors
                    </Typography>
                    {" — I'll be in your neighborhood doing errands this…"}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider />
          </List>
        </Container>
      </SwipeableDrawer>
    </>
  );
};

export default MobileChatList;
