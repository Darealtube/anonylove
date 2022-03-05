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
/* import { ChatEdge } from "../../types/models"; */
import { getUserResult, getUserVariables } from "../../types/Queries";

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
  const [acceptRequest] = useMutation(ACCEPT_CONFESSION_REQUEST);
  const { data: session } = useSession();

  const handleAcceptRequest = () => {
    acceptRequest({
      variables: { requestID },
      update: (cache, result) => {
        const newChat = result.data?.acceptConfessionRequest;
        const data = cache.readQuery<getUserResult, getUserVariables>({
          query: GET_USER_CHATS,
          variables: {
            name: session?.user?.name as string,
          },
        });

        console.log(data);

        cache.writeQuery({
          query: GET_USER_CHATS,
          variables: {
            name: session?.user?.name as string,
          },
          data: {
            getUser: {
              ...data?.getUser,
              chats: {
                ...data?.getUser.chats,
                edges: [
                  /* ...data?.getUser?.chats?.edges as [ChatEdge], */
                  { __typename: "ChatEdge", node: newChat },
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
