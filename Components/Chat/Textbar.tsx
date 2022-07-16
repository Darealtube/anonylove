import { Container, IconButton } from "@mui/material";
import { SyntheticEvent, useContext, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../../apollo/mutation/chatMutation";
import { BaseEmoji } from "emoji-mart";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { AnonyTextField } from "../Style/Chat/AnonyTextField";
import { AnonyTextBar } from "../Style/Chat/AnonyTextBar";
import { ErrorContext } from "../ErrorProvider";

const EmojiPicker = dynamic(() => import("../Chat/EmojiPopover"));

const rateLimitedText = "You are messaging too much. Try again in 30 seconds";

const Textbar = ({
  chatId,
  confessedTo,
}: {
  chatId: string | undefined;
  confessedTo: boolean;
}) => {
  const errorHandler = useContext(ErrorContext);
  const { data: session } = useSession();
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: () => {
      errorHandler(rateLimitedText);
    },
  });
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
        sender: session?.user?.id,
      },
    });
    setMessage("");
  };

  const handleMessageKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      (e.key === "Enter" || e.code === "NumpadEnter") &&
      !e.shiftKey &&
      !(message.trim().length === 0)
    ) {
      e.preventDefault();
      handleMessage();
    }
  };

  return (
    <>
      <AnonyTextBar elevation={6}>
        <Container
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <AnonyTextField
            sx={{ flexGrow: 1, height: "100%" }}
            multiline
            maxRows={4}
            onChange={handleMessageChange}
            value={message}
            onKeyPress={handleMessageKey}
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
      </AnonyTextBar>
      <EmojiPicker
        anchor={emojiAnchor}
        handleClose={handleCloseEmoji}
        handleEmoji={handleEmoji}
      />
    </>
  );
};

export default Textbar;
