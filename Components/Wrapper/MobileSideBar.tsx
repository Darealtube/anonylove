import {
  SwipeableDrawer,
  Box,
  List,
  ListItem,
  Typography,
  ListItemButton,
  Divider,
  Button,
} from "@mui/material";
import BrandLogo from "../../public/brandlogoblack.png";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import Notifications from "./Notifications";
import { AnonyAppBar } from "../Style/AppWrap/AnonyAppBar";
import { AnonyButton } from "../Style/Global/AnonyButton";
import { AnonyAvatar } from "../Style/Global/AnonyAvatar";

type MobileDrawerProps = {
  children: ReactNode;
  open: boolean;
  handleChatList: () => void;
  notifSeen: boolean | undefined;
};

const MobileSideBar = ({
  children,
  open,
  handleChatList,
  notifSeen,
}: MobileDrawerProps) => {
  const { data: session } = useSession();
  const handleSignOut = () => signOut({ callbackUrl: "/" });
  return (
    <SwipeableDrawer
      anchor="left"
      open={open}
      onClose={handleChatList}
      onOpen={handleChatList}
      PaperProps={{ style: { maxWidth: "90%" } }}
    >
      <AnonyAppBar elevation={0}>
        <Link href="/home" passHref>
          <a>
            <Image src={BrandLogo} alt="LOGO" />
          </a>
        </Link>
        <Box flexGrow={1} />
        {notifSeen !== undefined && <Notifications />}

        <Link href={`/profile/`} passHref>
          <a>
            <AnonyAvatar ml={2}>
              {session?.user?.image && (
                <Image
                  src={session.user.image}
                  alt="PFP"
                  layout="fill"
                  objectFit="cover"
                  className="avatar"
                />
              )}
            </AnonyAvatar>
          </a>
        </Link>
      </AnonyAppBar>
      <List sx={{ flexGrow: 1 }}>
        <ListItem sx={{ pl: 4 }}>
          <Typography>Active Chat</Typography>
        </ListItem>
        <ListItem sx={{ display: "flex", flexDirection: "column" }}>
          {children}
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
      <AnonyButton fullWidth sx={{ color: "#FFC2C2" }} onClick={handleSignOut}>
        <strong>Log Out</strong>
      </AnonyButton>
    </SwipeableDrawer>
  );
};

export default MobileSideBar;
