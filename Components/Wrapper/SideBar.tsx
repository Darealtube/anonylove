import {
  AppBar,
  IconButton,
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
import NotificationsIcon from "@mui/icons-material/Notifications";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const NotificationPopover = dynamic(() => import("./NotificationPopover"));
type SideBarProps = {
  children: ReactNode;
};

const SideBar = ({ children }: SideBarProps) => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleNotification = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

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
          <IconButton
            sx={{ height: 40, width: 40 }}
            className={styles.appbaroptions}
            onClick={handleNotification}
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
      <NotificationPopover
        anchor={anchorEl}
        handleClose={handleNotificationClose}
      />
    </>
  );
};

export default SideBar;
