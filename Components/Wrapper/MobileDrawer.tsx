import { SwipeableDrawer, AppBar, IconButton, Box } from "@mui/material";
import BrandLogo from "../../public/brandlogoblack.png";
import styles from "../../styles/AppWrap.module.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { useSession } from "next-auth/react";

type MobileDrawerProps = {
  children: ReactNode;
  open: boolean;
  handleChatList: () => void;
};

const MobileDrawer = ({
  children,
  open,
  handleChatList,
}: MobileDrawerProps) => {
  const { data: session } = useSession();
  return (
    <>
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={handleChatList}
        onOpen={handleChatList}
      >
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
        {children}
      </SwipeableDrawer>
    </>
  );
};

export default MobileDrawer;
