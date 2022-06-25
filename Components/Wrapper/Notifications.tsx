import { useSubscription, useMutation } from "@apollo/client";
import { Badge, IconButton } from "@mui/material";
import { useSession } from "next-auth/react";
import { useContext, useState } from "react";
import { SEEN_NOTIFICATION } from "../../apollo/mutation/notifMutation";
import { NEW_NOTIF_SUBSCRIPTION } from "../../apollo/subscription/notifSub";
import styles from "../../styles/AppWrap.module.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import dynamic from "next/dynamic";
import { NotificationContext } from "./AppWrap";

const NotificationPopover = dynamic(() => import("./NotificationPopover"));

const Notifications = () => {
  const { notifSeen } = useContext(NotificationContext);
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [seenNotif, setSeenNotif] = useState(notifSeen);
  const { data } = useSubscription(NEW_NOTIF_SUBSCRIPTION, {
    variables: { receiver: session?.user?.name },
    onSubscriptionData: ({ subscriptionData }) => {
      setSeenNotif(subscriptionData?.data?.notifSeen);
    },
  });
  const [seeNotification] = useMutation(SEEN_NOTIFICATION, {
    variables: { userName: session?.user?.name },
  });

  const handleNotification = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (seenNotif === false) {
      seeNotification();
    }
    setAnchorEl(e.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Badge color="secondary" variant="dot" invisible={seenNotif === true}>
        <IconButton
          sx={{ height: 40, width: 40 }}
          className={styles.appbaroptions}
          onClick={handleNotification}
        >
          <NotificationsIcon />
        </IconButton>
      </Badge>
      <NotificationPopover
        anchor={anchorEl}
        handleClose={handleNotificationClose}
        seenNotif={seenNotif}
      />
    </>
  );
};

export default Notifications;
