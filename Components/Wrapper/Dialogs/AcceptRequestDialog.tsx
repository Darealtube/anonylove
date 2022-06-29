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
import { useRouter } from "next/router";
import { ACCEPT_CONFESSION_REQUEST } from "../../../apollo/mutation/requestMutation";
import { GET_PROFILE_CHAT } from "../../../apollo/query/userQuery";
import { GetProfileResult, GetProfileVariables } from "../../../types/Queries";

type AcceptRequestDialog = {
  open: boolean;
  handleClose:
    | ((e: React.MouseEvent<HTMLButtonElement>) => void)
    | (() => void);
  requestID: string;
};

const AcceptRequestDialog = ({
  open,
  handleClose,
  requestID,
}: AcceptRequestDialog) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [acceptRequest] = useMutation(ACCEPT_CONFESSION_REQUEST, {
    update: (cache, result) => {
      const newChat = result?.data?.acceptConfessionRequest;
      const user = cache.readQuery<GetProfileResult, GetProfileVariables>({
        query: GET_PROFILE_CHAT,
        variables: {
          limit: 10,
          id: session?.user?.id as string,
        },
      });

      cache.writeQuery({
        query: GET_PROFILE_CHAT,
        variables: {
          limit: 10,
          name: session?.user?.name,
        },
        data: {
          getProfile: {
            ...user?.getProfile,
            activeChat: newChat,
          },
        },
      });

      cache.evict({ id: `Request:${requestID}` });
      cache.gc();
      router.replace("/activeChat");
    },
  });

  const handleAcceptRequest = (e: React.MouseEvent<HTMLButtonElement>) => {
    acceptRequest({ variables: { requestID } });
    handleClose(e);
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
          <Button onClick={handleClose} value="accept">
            I&apos;m not ready yet. Cancel
          </Button>
          <Button onClick={handleAcceptRequest} value="accept">
            Let&apos;s do this! Accept
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AcceptRequestDialog;
