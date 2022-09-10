import {
  Box,
  CircularProgress,
  Container,
  Paper,
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
import { Dispatch, SetStateAction, useState } from "react";
import dynamic from "next/dynamic";

const MessageOptions = dynamic(() => import("./MessageMenu"));

const MessageList = ({
  messages,
  loadMoreMessages,
  hasMore,
  handleReply,
}: {
  messages: QueryConnection<Message>;
  loadMoreMessages: () => void;
  hasMore?: boolean;
  handleReply: Dispatch<SetStateAction<HTMLButtonElement | null>>;
}) => {
  const { data: session } = useSession();
  // Shows options when clicking message
  const [openOptions, setOpenOptions] = useState<HTMLButtonElement | null>(
    null
  );

  // Opens Message OPTIONS
  const handleOpenOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenOptions(e.currentTarget);
  };

  // Closes Message OPTIONS
  const handleCloseOptions = () => {
    setOpenOptions(null);
  };

  // Sets Reply Message to current message that had an open option
  const replyToMessage = () => {
    handleReply(openOptions);
  };

  return (
    <>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column-reverse",
            justifyContent: "end",
          }}
        >
          {messages &&
            messages.edges.map(({ node }) => (
              <Container
                id={node._id}
                key={node._id}
                sx={{
                  display: "flex",
                  mt: 2,
                  mb: 2,
                  flexDirection:
                    node.sender._id === session?.user?.id
                      ? "row-reverse"
                      : "row",
                  justifyContent:
                    node.sender._id === session?.user?.id ? "end" : "start",
                }}
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

                <Box
                  display="flex"
                  flexDirection="column"
                  ml={2}
                  mr={2}
                  maxWidth="50%"
                  sx={{
                    float: "right",
                    alignItems:
                      node.sender._id === session?.user?.id
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <Paper
                    sx={{
                      display: "flex",
                      opacity: 0.5,
                      width: "max-content",
                      maxWidth: "100%",
                    }}
                  >
                    <Container sx={{ width: "100%" }}>
                      <Typography
                        variant="body1"
                        textOverflow={"ellipsis"}
                        noWrap
                        sx={{ overflow: "hidden" }}
                      >
                        {node.repliesTo?.message}
                      </Typography>
                    </Container>
                  </Paper>
                  <Tooltip
                    title={`${DateTime.fromMillis(+node.date).toLocaleString(
                      DateTime.DATETIME_MED
                    )}`}
                    placement="left"
                  >
                    <AnonyMessage onClick={handleOpenOptions} id={node._id}>
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
              </Container>
            ))}
        </Box>
      </InfiniteScroll>
      <MessageOptions
        message={openOptions}
        handleClose={handleCloseOptions}
        handleReply={replyToMessage}
      />
    </>
  );
};

export default MessageList;
