import { useSubscription, useMutation } from "@apollo/client";
import { Badge, IconButton } from "@mui/material";
import { useSession } from "next-auth/react";
import { useContext, useState } from "react";
import { SEE_NOTIFICATION } from "../../apollo/mutation/notifMutation";
import { NEW_NOTIF_SUBSCRIPTION } from "../../apollo/subscription/notifSub";
import NotificationsIcon from "@mui/icons-material/Notifications";
import dynamic from "next/dynamic";
import { NotificationContext } from "./AppWrap";

const NotificationPopover = dynamic(() => import("./NotificationPopover"));

const Notifications = () => {
  const { notifSeen } = useContext(NotificationContext);
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { data } = useSubscription(NEW_NOTIF_SUBSCRIPTION, {
    variables: { profileId: session?.user?.id },
  });
  const [seeNotification] = useMutation(SEE_NOTIFICATION, {
    variables: { profileId: session?.user?.id },
  });

  const handleNotification = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (notifSeen === false) {
      seeNotification();
    }
    setAnchorEl(e.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Badge color="secondary" variant="dot" invisible={notifSeen === true}>
        <IconButton
          sx={{ height: 40, width: 40, ml: 2 }}
          onClick={handleNotification}
        >
          <NotificationsIcon />
        </IconButton>
      </Badge>
      <NotificationPopover
        anchor={anchorEl}
        handleClose={handleNotificationClose}
        seenNotif={notifSeen}
      />
    </>
  );
};

export default Notifications;
