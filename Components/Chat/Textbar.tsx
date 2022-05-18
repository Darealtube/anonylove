import {
  AppBar,
  Container,
  IconButton,
  inputLabelClasses,
  outlinedInputClasses,
  styled,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useState } from "react";
import styles from "../../styles/Chat.module.css";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../../apollo/mutation/chatMutation";
import { BaseEmoji } from "emoji-mart";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

const EmojiPicker = dynamic(() => import("../Chat/EmojiPopover"));

const StyledTextField = styled(TextField)({
  [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: "#F6F7F8",
  },
  [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: "#70161E",
    },
  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: "#F6F7F8",
    },
  [`& .${outlinedInputClasses.input}`]: {
    color: "#F6F7F8",
  },
  [`& .${inputLabelClasses.outlined}`]: {
    color: "#F6F7F8",
  },
  [`&:hover .${inputLabelClasses.outlined}`]: {
    color: "#70161E",
  },
  [`& .${inputLabelClasses.outlined}.${inputLabelClasses.focused}`]: {
    color: "#F6F7F8",
  },
});

const Textbar = ({
  chatId,
  confessedTo,
}: {
  chatId: string | undefined;
  confessedTo: boolean;
}) => {
  const { data: session } = useSession();
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [message, setMessage] = useState("");
  const [emojiAnchor, setEmojiAnchor] = useState<HTMLButtonElement | null>(
    null
  );
  const handleOpenEmoji = (e: React.MouseEvent<HTMLButtonElement>) => {
    setEmojiAnchor(e.currentTarget);
  };

  const handleCloseEmoji = () => {
    setEmojiAnchor(null);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  };

  const handleEmoji = (emoji: BaseEmoji, _event: SyntheticEvent) => {
    setMessage(message + emoji.native);
  };

  const handleMessage = () => {
    sendMessage({
      variables: {
        chat: chatId,
        message,
        anonymous: confessedTo ? false : true,
        sender: session?.user?.name,
      },
    });
    setMessage("");
  };

  return (
    <>
      <AppBar className={styles.textbar} elevation={6}>
        <Container
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <StyledTextField
            sx={{ flexGrow: 1, height: "100%" }}
            multiline
            maxRows={4}
            onChange={handleMessageChange}
            value={message}
          />
          <IconButton sx={{ ml: 2, color: "white" }} onClick={handleOpenEmoji}>
            <EmojiEmotionsIcon />
          </IconButton>
          <IconButton
            sx={{ ml: 2, color: "white" }}
            onClick={handleMessage}
            disabled={message.trim().length == 0}
          >
            <SendIcon />
          </IconButton>
        </Container>
      </AppBar>
      <EmojiPicker
        anchor={emojiAnchor}
        handleClose={handleCloseEmoji}
        handleEmoji={handleEmoji}
      />
    </>
  );
};

export default Textbar;
