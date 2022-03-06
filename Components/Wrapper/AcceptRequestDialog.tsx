import { useMutation } from "@apollo/client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { ACCEPT_CONFESSION_REQUEST } from "../../apollo/mutation/requestMutation";
import { GET_USER_CHATS } from "../../apollo/query/chatQuery";
import { ChatEdge } from "../../types/models";
import { getUserResult } from "../../types/Queries";

type AcceptRequestDialog = {
  open: boolean;
  handleClose: () => void;
  requestID: string;
};

const AcceptRequestDialog = ({
  open,
  handleClose,
  requestID,
}: AcceptRequestDialog) => {
  const { data: session } = useSession();
  const [acceptRequest] = useMutation(ACCEPT_CONFESSION_REQUEST, {
    update: (cache, result) => {
      const newChat = result.data?.acceptConfessionRequest;
      const data = cache.readQuery<getUserResult>({
        query: GET_USER_CHATS,
        variables: {
          limit: 10,
          name: session?.user?.name as string,
        },
      });

      cache.writeQuery({
        query: GET_USER_CHATS,
        variables: {
          limit: 10,
          name: session?.user?.name as string,
        },
        data: {
          getUser: {
            ...data?.getUser,
            chats: {
              ...data?.getUser.chats,
              edges: [
                { __typename: "ChatEdge", node: newChat },
                ...(data?.getUser?.chats?.edges as [ChatEdge]),
              ],
            },
          },
        },
      });
      cache.evict({ id: `Request:${requestID}` });
      cache.gc();
      handleClose();
    },
  });

  const handleAcceptRequest = () => {
    acceptRequest({ variables: { requestID } });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="title">
          <Typography>
            Do you want to accept this confession request?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="description">
            When this person confesses to you, make sure that you receive it
            wholeheartedly. Be honest with your feelings and tell them the
            truth, however harsh it may be, or however wonderful it may be.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>I&apos;m not ready yet. Cancel</Button>
          <Button onClick={handleAcceptRequest}>
            Let&apos;s do this! Accept
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AcceptRequestDialog;
