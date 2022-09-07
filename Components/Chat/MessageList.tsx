import {
  Box,
  CircularProgress,
  Container,
  Tooltip,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Anonymous from "../../public/anonyUser.png";
import { useSession } from "next-auth/react";
import { DateTime } from "luxon";
import InfiniteScroll from "react-infinite-scroll-component";
import { Message, QueryConnection } from "../../types/models";
import { AnonyMessage } from "../Style/Chat/AnonyMessage";
import { AnonyAvatar } from "../Style/Global/AnonyAvatar";

const MessageList = ({
  messages,
  loadMoreMessages,
  hasMore,
}: {
  messages: QueryConnection<Message>;
  loadMoreMessages: () => void;
  hasMore?: boolean;
}) => {
  const { data: session } = useSession();
  return (
    <InfiniteScroll
      dataLength={messages.edges.length as number}
      next={loadMoreMessages}
      hasMore={hasMore as boolean}
      loader={
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      }
      inverse={true}
      style={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column-reverse",
        width: "100%",
      }}
      scrollableTarget="chatMain"
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
          justifyContent: "end",
        }}
      >
        {messages &&
          messages.edges.map(({ node }) => (
            <Box
              id={node._id}
              key={node._id}
              display="flex"
              mt={2}
              mb={2}
              flexDirection={
                node.sender._id === session?.user?.id ? "row-reverse" : "row"
              }
              justifyContent={
                node.sender._id === session?.user?.id ? "end" : "start"
              }
            >
              <AnonyAvatar
                display="flex"
                flexDirection="column"
                justifyContent="end"
              >
                <Image
                  src={
                    node.anonymous ? Anonymous : (node.sender.image as string)
                  }
                  alt="PFP"
                  layout="fill"
                  objectFit="cover"
                  className="avatar"
                />
              </AnonyAvatar>
              <Tooltip
                title={`${DateTime.fromMillis(+node.date).toLocaleString(
                  DateTime.DATETIME_MED
                )}`}
                placement="left"
              >
                <AnonyMessage>
                  <Container sx={{ mt: 2, mb: 2 }}>
                    <Typography
                      variant="body1"
                      whiteSpace="pre-wrap"
                      sx={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {node.message}
                    </Typography>
                  </Container>
                </AnonyMessage>
              </Tooltip>
            </Box>
          ))}
      </Container>
    </InfiniteScroll>
  );
};

export default MessageList;
