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
import { ACCEPT_CONFESSION_REQUEST } from "../../apollo/mutation/requestMutation";

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
  const [acceptRequest] = useMutation(ACCEPT_CONFESSION_REQUEST, {
    update: (cache, _result) => {
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
