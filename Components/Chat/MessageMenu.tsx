import { Menu, MenuItem } from "@mui/material";

const MessageMenu = ({
  message,
  handleClose,
  handleReply,
}: {
  message: HTMLButtonElement | null;
  handleClose: () => void;
  handleReply: () => void;
}) => {
  const handleClickReply = () => {
    handleReply();
    handleClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message?.innerText as string);
    handleClose();
  };

  return (
    <>
      <Menu
        id="messageOptions"
        anchorEl={message}
        open={Boolean(message)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleClickReply}>Reply</MenuItem>
        <MenuItem onClick={handleCopy}>Copy Message</MenuItem>
      </Menu>
    </>
  );
};

export default MessageMenu;
