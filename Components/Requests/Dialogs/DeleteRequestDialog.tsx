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
import { REJECT_CONFESSION_REQUEST } from "../../../apollo/mutation/requestMutation";

type DeleteRequestDialogProps = {
  open: boolean;
  handleClose:
    | ((e: React.MouseEvent<HTMLButtonElement>) => void)
    | (() => void);
  requestID: string;
};

const DeleteRequestDialog = ({
  open,
  handleClose,
  requestID,
}: DeleteRequestDialogProps) => {
  const [deleteRequest] = useMutation(REJECT_CONFESSION_REQUEST);
  const handleDeleteRequest = (e: React.MouseEvent<HTMLButtonElement>) => {
    handleClose(e);
    deleteRequest({
      variables: { requestID },
      update: (cache, _result) => {
        cache.evict({ id: `Request:${requestID}` });
        cache.gc();
      },
    });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="title">
          <Typography>
            Are you sure you want to delete this confession request?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="description">
            This person has feelings for you and has now worked up the courage
            to finally confess. Think about it again!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} value="reject">
            You&apos;re right. Cancel
          </Button>
          <Button onClick={handleDeleteRequest} value="reject">
            I don&apos;t care. Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteRequestDialog;
