import {
  Box,
  List,
  ListItem,
  Typography,
  ListItemButton,
  Button,
  Divider,
} from "@mui/material";
import BrandLogo from "../../public/brandlogoblack.png";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import Notifications from "./Notifications";
import { AnonyAppBar } from "../Style/AppWrap/AnonyAppBar";
import { AnonySideBar } from "../Style/AppWrap/AnonySideBar";
import { AnonyButton } from "../Style/Global/AnonyButton";

type SideBarProps = {
  children: ReactNode;
  notifSeen: boolean | undefined;
};

const SideBar = ({ children, notifSeen }: SideBarProps) => {
  const { data: session } = useSession();
  const handleSignOut = () => signOut({ callbackUrl: "/" });
  return (
    <>
      <AnonySideBar item md={4} id="chatDrawer">
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
              <Box ml={2}>
                {session?.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="PFP"
                    width={40}
                    height={40}
                    className="avatar"
                  />
                )}
              </Box>
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
        <AnonyButton
          fullWidth
          sx={{ color: "#FFC2C2" }}
          onClick={handleSignOut}
        >
          <strong>Log Out</strong>
        </AnonyButton>
      </AnonySideBar>
    </>
  );
};

export default SideBar;
