import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { DateTime } from "luxon";
import InfiniteScroll from "react-infinite-scroll-component";
import { NotificationModel, QueryConnection } from "../../../types/models";
import Image from "next/image";
import Anonymous from "../../../public/anonyUser.png";

const NotificationList = ({
  notifications,
  moreNotifications,
  hasMore,
}: {
  notifications: QueryConnection<NotificationModel>;
  moreNotifications: any;
  hasMore: boolean;
}) => {
  const dateNow = DateTime.local();

  const loadMoreNotifs = () => {
    moreNotifications({
      variables: {
        after: notifications?.pageInfo.endCursor,
        limit: 10,
      },
    });
  };

  return (
    <>
      {notifications && (
        <InfiniteScroll
          dataLength={notifications.edges.length as number}
          next={loadMoreNotifs}
          hasMore={hasMore as boolean}
          loader={<CircularProgress />}
          style={{ textAlign: "center", overflow: "hidden" }}
          scrollableTarget="notifList"
        >
          <List sx={{ width: "100%" }}>
            {notifications?.edges.map(({ node: notification }) => (
              <Box key={notification._id}>
                <Box display="flex">
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Image
                        src={Anonymous}
                        alt="Confesser PFP"
                        width={40}
                        height={40}
                        className="avatar"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={"New Request"}
                      secondary={
                        <>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Someone sent you a confession request.
                          </Typography>
                          <br />
                          <Typography variant="caption">
                            {`${dateNow
                              .diff(DateTime.fromMillis(+notification.date), [
                                "days",
                                "hours",
                                "minutes",
                              ])
                              .toHuman({
                                maximumSignificantDigits: 1,
                                minimumIntegerDigits: 1,
                                listStyle: "narrow",
                              })} ago`}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Box>
                <Divider />
              </Box>
            ))}
          </List>
        </InfiniteScroll>
      )}
    </>
  );
};

export default NotificationList;
