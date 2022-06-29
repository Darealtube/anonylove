import {
  AppBar,
  Box,
  Grid,
  List,
  ListItem,
  Typography,
  ListItemButton,
  Button,
  Divider,
} from "@mui/material";
import BrandLogo from "../../public/brandlogoblack.png";
import styles from "../../styles/AppWrap.module.css";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import Notifications from "./Notifications";

type SideBarProps = {
  children: ReactNode;
  notifSeen: boolean | undefined;
};

const SideBar = ({ children, notifSeen }: SideBarProps) => {
  const { data: session } = useSession();
  const handleSignOut = () => signOut({ callbackUrl: "/" });
  return (
    <>
      <Grid item md={4} className={styles.drawer} id="chatDrawer">
        <AppBar className={styles.appbar} elevation={0}>
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
        <Button
          fullWidth
          sx={{ color: "#FFC2C2" }}
          className="anonybutton"
          onClick={handleSignOut}
        >
          <strong>Log Out</strong>
        </Button>
      </Grid>
    </>
  );
};

export default SideBar;
