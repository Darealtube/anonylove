import { Container, IconButton, Paper, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import {
  REJECT_END_CHAT_REQUEST,
  ACCEPT_END_CHAT_REQUEST,
} from "../../apollo/mutation/chatMutation";

const EndRequestBar = ({
  requester,
  chatId,
  confessedTo,
}: {
  requester: string;
  chatId: string;
  confessedTo: boolean;
}) => {
  const router = useRouter();
  const canAccept =
    (confessedTo && requester === "Anonymous") ||
    (!confessedTo && requester !== "Anonymous");
  const [rejectEndRequest] = useMutation(REJECT_END_CHAT_REQUEST, {
    variables: { chat: chatId },
  });
  const [acceptEndRequest] = useMutation(ACCEPT_END_CHAT_REQUEST, {
    variables: { chat: chatId },
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
      <Paper square>
        <Container
          sx={{
            mt: 2,
            mb: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography sx={{ flexGrow: 1 }}>
            {requester} wants to end the confession. Accept?
          </Typography>

          <IconButton onClick={acceptEnd} disabled={!canAccept}>
            <CheckIcon />
          </IconButton>

          <IconButton onClick={rejectEnd} disabled={!canAccept}>
            <ClearIcon />
          </IconButton>
        </Container>
      </Paper>
    </>
  );
};

export default EndRequestBar;
