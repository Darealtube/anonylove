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
import { useRouter } from "next/router";
import { ACCEPT_CONFESSION_REQUEST } from "../../../apollo/mutation/requestMutation";

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
  const [acceptRequest] = useMutation(ACCEPT_CONFESSION_REQUEST);

  const handleAcceptRequest = (e: React.MouseEvent<HTMLButtonElement>) => {
    acceptRequest({ variables: { requestID } });
    handleClose(e);
    router.replace("/activeChat");
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
