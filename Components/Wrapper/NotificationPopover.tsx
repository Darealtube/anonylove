import { useLazyQuery } from "@apollo/client";
import { Box, Popover, useMediaQuery, useTheme } from "@mui/material";
import { useSession } from "next-auth/react";
import { GET_USER_NOTIFICATIONS } from "../../apollo/query/userQuery";
import { NotificationModel, QueryConnection } from "../../types/models";
import { GetUserResult, GetUserVariables } from "../../types/Queries";
import NotificationList from "./Lists/NotificationList";
import { useEffect } from "react";

const NotificationPopover = ({
  anchor,
  handleClose,
  seenNotif,
}: {
  anchor: HTMLElement | null;
  handleClose: () => void;
  seenNotif: boolean | undefined;
}) => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("md"));
  const { data: session } = useSession();
  const [getNotifs, { data, fetchMore: moreNotifications, refetch }] =
    useLazyQuery<GetUserResult, GetUserVariables>(GET_USER_NOTIFICATIONS, {
      variables: {
        name: session?.user?.name as string,
        limit: 10,
      },
    });

  useEffect(() => {
    if (Boolean(anchor) === true && seenNotif === false) {
      refetch();
    }
  }, [anchor, refetch, getNotifs, seenNotif]);

  useEffect(() => {
    if (Boolean(anchor) === true) {
      getNotifs();
    }
  }, [getNotifs, anchor]);

  return (
    <>
      <Popover
        id="NotificationPopover"
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <Box
          sx={{
            width: sm ? "80vw" : "40vw",
            height: "400px",
            maxHeight: "400px",
            overflow: "auto",
          }}
          id="notifList"
        >
          <NotificationList
            notifications={
              data?.getUser
                ?.userNotifications as QueryConnection<NotificationModel>
            }
            moreNotifications={moreNotifications}
            hasMore={
              (
                data?.getUser
                  ?.userNotifications as QueryConnection<NotificationModel>
              )?.pageInfo.hasNextPage
            }
          />
        </Box>
      </Popover>
    </>
  );
};

export default NotificationPopover;
