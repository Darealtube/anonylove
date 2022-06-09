import { useMutation, useQuery } from "@apollo/client";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
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
import React, { useEffect, useRef, useState } from "react";
import { SEEN_CHAT } from "../apollo/mutation/chatMutation";
import { getUserChatResult, getUserChatVariables } from "../types/Queries";
import MessageList from "../Components/Chat/MessageList";
import { NEW_MSG_SUBSCRIPTION } from "../apollo/subscription/messageSub";
import { NewMessageData } from "../types/Subscriptions";
import Textbar from "../Components/Chat/Textbar";
import CountdownTimer from "../Components/CountdownTimer";
import { DateTime } from "luxon";
import Link from "next/link";

const ActiveChat = ({ name }: { name: string }) => {
  const chatMain = useRef<HTMLElement>();
  const { data: session } = useSession();
  const [pageVisible, setPageVisible] = useState(false);
  const {
    data: { getUserActiveChat } = {},
    previousData,
    subscribeToMore,
    fetchMore: moreMessages,
  } = useQuery<getUserChatResult, getUserChatVariables>(GET_USER_ACTIVE_CHAT, {
    variables: {
      name,
      limit: 10,
    },
  });
  const expiredChat =
    DateTime.local().toMillis() > (getUserActiveChat?.expiresAt as number);

  // GIVE A BLANK OBJECT TO DESTRUCTURE IT FROM. THIS AVOIDS THE 'UNDEFINED' DESTRUCTURE PROBLEM
  const [seeChat] = useMutation(SEEN_CHAT, {
    variables: {
      person: name === getUserActiveChat?.confessee.name ? name : "anonymous",
      chat: getUserActiveChat?._id,
    },
  });

  const [hasMore, setHasMore] = useState(
    getUserActiveChat?.messages.pageInfo.hasNextPage
  );

  const confessedTo = session?.user?.name === getUserActiveChat?.confessee.name;
  const chatSeen = confessedTo
    ? getUserActiveChat?.confesseeSeen
    : getUserActiveChat?.anonSeen;

  const loadMoreMessages = () => {
    moreMessages({
      variables: {
        after: getUserActiveChat?.messages.pageInfo.endCursor,
        limit: 10,
      },
    }).then((fetchMoreResult: { data: getUserChatResult }) => {
      if (
        !fetchMoreResult.data?.getUserActiveChat?.messages?.pageInfo
          ?.hasNextPage
      ) {
        setHasMore(false);
      }
    });
  };

  console.log(previousData);
  // Put the scrollbar at the end on page mount
  // Setup chat subscription on mount
  useEffect(() => {
    if (chatMain) {
      (chatMain as React.MutableRefObject<HTMLElement>).current.scrollTop =
        (chatMain as React.MutableRefObject<HTMLElement>).current.scrollHeight -
        (chatMain as React.MutableRefObject<HTMLElement>).current.clientHeight;
    }
    subscribeToMore({
      document: NEW_MSG_SUBSCRIPTION,
      updateQuery: (
        prev,
        { subscriptionData }: { subscriptionData: NewMessageData }
      ) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.newMessage;
        const idAlreadyExists =
          prev.getUserActiveChat.messages.edges.filter((item) => {
            return item.node._id === newMessage._id;
          }).length > 0;

        if (!idAlreadyExists) {
          return Object.assign({}, prev, {
            getUserActiveChat: {
              ...prev.getUserActiveChat,
              messages: {
                ...prev.getUserActiveChat.messages,
                edges: [
                  { _typename: "MessageEdge", node: newMessage },
                  ...prev.getUserActiveChat.messages.edges,
                ],
              },
            },
          });
        } else {
          return prev;
        }
      },
    });
  }, [subscribeToMore]);

  // Handle Page Visibility Changes
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        setPageVisible(false);
      } else {
        setPageVisible(true);
      }
    }
    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
      false
    );
    window.addEventListener(
      "focus",
      () => {
        setPageVisible(true);
      },
      false
    );
    window.addEventListener("blur", () => setPageVisible(false), false);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", () => {
        setPageVisible(true);
      });
      window.removeEventListener("blur", () => {
        setPageVisible(false);
      });
    };
  }, []);

  // If the page is visible and the chat hasn't been seen yet, seen the chat.
  useEffect(() => {
    if (pageVisible && !chatSeen) {
      seeChat();
    }
  }, [pageVisible, seeChat, chatSeen]);

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
                    : (getUserActiveChat?.confessee.image as string)
                }
                alt="PFP"
                width={40}
                height={40}
                className={styles.avatar}
              />

              <Typography variant="h6" ml={2}>
                {confessedTo ? "Anonymous" : getUserActiveChat?.confessee.name}
              </Typography>
            </Box>

            <CountdownTimer endsIn={getUserActiveChat?.expiresAt as number} />

            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Container>
        </AppBar>

        <Box
          flexGrow={1}
          height="100%"
          overflow="auto"
          ref={chatMain}
          id="chatMain"
          sx={{
            display: "flex",
            flexDirection: "column-reverse",
            justifyContent: "end",
          }}
        >
          {getUserActiveChat?.messages ? (
            <MessageList
              messages={getUserActiveChat?.messages}
              loadMoreMessages={loadMoreMessages}
              hasMore={hasMore}
            />
          ) : (
            <CircularProgress />
          )}
        </Box>

        {!expiredChat ? (
          <Textbar chatId={getUserActiveChat?._id} confessedTo={confessedTo} />
        ) : (
          <>
            <Link href="/reveal" passHref>
              <Button
                className="anonybutton"
                sx={{ height: "120px", fontSize: "24px" }}
                component="a"
              >
                Reveal Confesser!
              </Button>
            </Link>
          </>
        )}
      </Box>
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
