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
}: {
  requester: string;
  chatId: string;
}) => {
  const router = useRouter();
  const [rejectEndRequest] = useMutation(REJECT_END_CHAT_REQUEST, {
    variables: {
      chat: chatId,
    },
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

          <IconButton onClick={acceptEnd}>
            <CheckIcon />
          </IconButton>

          <IconButton onClick={rejectEnd}>
            <ClearIcon />
          </IconButton>
        </Container>
      </Paper>
    </>
  );
};

export default EndRequestBar;
