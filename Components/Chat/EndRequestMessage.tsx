import { useMutation } from "@apollo/client";
import {
  Box,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  ACCEPT_END_CHAT_REQUEST,
  REJECT_END_CHAT_REQUEST,
} from "../../apollo/mutation/chatMutation";
import { Message } from "../../types/models";
import { AnonyButton } from "../Style/Global/AnonyButton";

const EndRequestMessage = ({ message }: { message: Message }) => {
  const router = useRouter();
  const theme = useTheme();
  const { data: session } = useSession();
  const xs = useMediaQuery(theme.breakpoints.down("sm"));
  const sentByYou = message.sender._id === session?.user.id;
  const [rejectEndRequest] = useMutation(REJECT_END_CHAT_REQUEST, {
    variables: {
      chat: message.chat,
      sender: session?.user.id,
      anonymous: message.anonymous ? false : true,
    },
  });
  const [acceptEndRequest] = useMutation(ACCEPT_END_CHAT_REQUEST, {
    variables: { chat: message.chat },
    onCompleted: () => {
      router.replace("/reveal");
    },
  });

  const acceptEnd = () => {
    acceptEndRequest();
  };

  const rejectEnd = () => {
    rejectEndRequest();
  };

  return (
    <>
      <Typography
        paragraph
        variant="body1"
        whiteSpace="pre-wrap"
        sx={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {message.message}
      </Typography>
      <Divider variant="fullWidth" />
      <Box
        display="flex"
        flexDirection={xs ? "column" : "row"}
        alignItems="center"
        justifyContent="space-between"
      >
        <AnonyButton disabled={sentByYou} fullWidth onClick={acceptEnd}>
          <Typography>Accept</Typography>
        </AnonyButton>
        <AnonyButton disabled={sentByYou} fullWidth onClick={rejectEnd}>
          <Typography>Reject</Typography>
        </AnonyButton>
      </Box>
    </>
  );
};

export default EndRequestMessage;
