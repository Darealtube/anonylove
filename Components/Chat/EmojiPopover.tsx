import { Popover } from "@mui/material";
import { SyntheticEvent } from "react";
import "emoji-mart/css/emoji-mart.css";
import { BaseEmoji, Picker } from "emoji-mart";

const EmojiPopover = ({
  anchor,
  handleClose,
  handleEmoji,
}: {
  anchor: HTMLButtonElement | null;
  handleClose: () => void;
  handleEmoji: (emoji: BaseEmoji, event: SyntheticEvent) => void
}) => {
  
  return (
    <Popover
      open={Boolean(anchor)}
      anchorEl={anchor}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Picker
        title="Pick your emoji…"
        emoji="point_up"
        onClick={handleEmoji}
        showPreview={false}
        showSkinTones={false}
      />
    </Popover>
  );
};

export default EmojiPopover;
