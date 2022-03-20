import { Box, Container, Paper, Tooltip, Typography } from "@mui/material";
import { MessageConnection } from "../../types/models";
import Image from "next/image";
import Anonymous from "../../public/anonyUser.png";
import { useSession } from "next-auth/react";
import styles from "../../styles/Chat.module.css";
import { DateTime } from "luxon";

const MessageList = ({ messages }: { messages: MessageConnection }) => {
  const { data: session } = useSession();
  return (
    <>
      {messages &&
        messages.edges.map(({ node }) => (
          <Box
            id={node._id}
            key={node._id}
            display="flex"
            mt={2}
            mb={2}
            flexDirection={
              node.sender.name === session?.user?.name ? "row-reverse" : "row"
            }
            justifyContent={
              node.sender.name === session?.user?.name ? "end" : "start"
            }
          >
            <Box display="flex" flexDirection="column" justifyContent="end">
              <Image
                src={node.anonymous ? Anonymous : (node.sender.image as string)}
                alt="PFP"
                width={40}
                height={40}
                className={styles.avatar}
              />
            </Box>
            <Tooltip
              title={`${DateTime.fromMillis(+node.date).toLocaleString(
                DateTime.DATETIME_MED
              )}`}
              placement={
                node.sender.name === session?.user?.name ? "left" : "right"
              }
            >
              <Paper className={styles.messagebox} elevation={6}>
                <Container sx={{ mt: 2, mb: 2 }}>
                  <Typography paragraph variant="body1" whiteSpace="pre-wrap">
                    {node.message}
                  </Typography>
                </Container>
              </Paper>
            </Tooltip>
          </Box>
        ))}
    </>
  );
};

export default MessageList;
