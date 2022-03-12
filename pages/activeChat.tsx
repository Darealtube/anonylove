import { useQuery } from "@apollo/client";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  inputLabelClasses,
  outlinedInputClasses,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { addApolloState } from "../apollo/apolloClient";
import { GET_USER_ACTIVE_CHAT } from "../apollo/query/chatQuery";
import { getUserActiveChat } from "../utils/SSR/chat";
import Anonymous from "../public/anonyUser.png";
import styles from "../styles/Chat.module.css";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import React, { SyntheticEvent, useState } from "react";
import dynamic from "next/dynamic";
import { BaseEmoji } from "emoji-mart";

const EmojiPicker = dynamic(() => import("../Components/Chat/EmojiPopover"));

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

const ActiveChat = ({ name }: { name: string }) => {
  const [emojiAnchor, setEmojiAnchor] = useState<HTMLButtonElement | null>(
    null
  );
  const [message, setMessage] = useState("");
  const { data: session } = useSession();
  const {
    data: { getUserActiveChat },
  } = useQuery(GET_USER_ACTIVE_CHAT, {
    variables: {
      name,
    },
  });
  const confessedTo = session?.user?.name === getUserActiveChat.confessee.name;

  const handleOpenEmoji = (e: React.MouseEvent<HTMLButtonElement>) => {
    setEmojiAnchor(e.currentTarget);
  };

  const handleCloseEmoji = () => {
    setEmojiAnchor(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.currentTarget.value);
  };

  const handleEmoji = (emoji: BaseEmoji, _event: SyntheticEvent) => {
    setMessage(message + emoji.native);
  };

  return (
    <>
      <Head>
        <title>AnonyLove | Confession</title>
        <meta name="description" content="Face the fear of confession." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box display="flex" flexDirection="column" height="100%">
        <AppBar className={styles.appbar}>
          <Container
            sx={{ height: "100%", display: "flex", alignItems: "center" }}
          >
            <Box flexGrow={1} display="flex" alignItems="center">
              <Image
                src={
                  confessedTo
                    ? Anonymous
                    : (getUserActiveChat.confessee.image as string)
                }
                alt="PFP"
                width={40}
                height={40}
                className={styles.avatar}
              />

              <Typography variant="h6" ml={2}>
                {confessedTo ? "Anonymous" : getUserActiveChat.confessee.name}
              </Typography>
            </Box>

            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Container>
        </AppBar>

        <Container
          sx={{
            flexGrow: 1,
            overflow: "auto",
          }}
        ></Container>

        <AppBar className={styles.textbar} elevation={6}>
          <Container className={styles.textbarContainer}>
            <StyledTextField
              sx={{ flexGrow: 1, height: "100%" }}
              multiline
              maxRows={4}
              onChange={handleChange}
              value={message}
            />
            <IconButton
              sx={{ ml: 2, color: "white" }}
              onClick={handleOpenEmoji}
            >
              <EmojiEmotionsIcon />
            </IconButton>
            <IconButton sx={{ ml: 2, color: "white" }}>
              <SendIcon />
            </IconButton>
          </Container>
        </AppBar>
      </Box>

      <EmojiPicker
        anchor={emojiAnchor}
        handleClose={handleCloseEmoji}
        handleEmoji={handleEmoji}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { data, exists } = await getUserActiveChat(
    session?.user?.name as string
  );

  if (!exists) {
    return {
      notFound: true,
    };
  }

  return addApolloState(data, {
    props: {
      session,
      name: session?.user?.name,
    },
  });
};

export default ActiveChat;
