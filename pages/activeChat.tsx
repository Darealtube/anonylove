import { useMutation, useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import { addApolloState } from "../apollo/apolloClient";
import { GET_PROFILE_ACTIVE_CHAT } from "../apollo/query/chatQuery";
import { getUserActiveChat } from "../utils/SSR/chat";
import Anonymous from "../public/anonyUser.png";
import React, { useContext, useEffect, useRef, useState } from "react";
import { END_CHAT_REQUEST, SEEN_CHAT } from "../apollo/mutation/chatMutation";
import {
  getProfileChatResult,
  getProfileChatVariables,
} from "../types/Queries";
import MessageList from "../Components/Chat/MessageList";
import { NEW_MSG_SUBSCRIPTION } from "../apollo/subscription/messageSub";
import Link from "next/link";
import { NewMessage, SubscriptionData } from "../types/Subscriptions";
import { AnonyChatHead } from "../Components/Style/Chat/AnonyChatHead";
import { AnonyButton } from "../Components/Style/Global/AnonyButton";
import { ErrorContext } from "../Components/ErrorProvider";
import Error from "next/error";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const Textbar = dynamic(() => import("../Components/Chat/Textbar"));

const ActiveChat = ({ id }: { id: string }) => {
  const router = useRouter();
  const chatMain = useRef<HTMLElement>();
  const errorHandler = useContext(ErrorContext);
  const [requestEndChat] = useMutation(END_CHAT_REQUEST);
  const { data: session } = useSession();
  const [pageVisible, setPageVisible] = useState(false);
  const {
    data: { getProfileActiveChat } = {},
    subscribeToMore,
    fetchMore: moreMessages,
  } = useQuery<getProfileChatResult, getProfileChatVariables>(
    GET_PROFILE_ACTIVE_CHAT,
    {
      variables: {
        profileId: session?.user?.id as string,
        limit: 10,
      },
    }
  );
  const [requestLatest, setRequestLatest] = useState(
    getProfileActiveChat?.messages.edges[0]?.node.endRequestMsg
  );

  // GIVE A BLANK OBJECT TO DESTRUCTURE IT FROM. THIS AVOIDS THE 'UNDEFINED' DESTRUCTURE PROBLEM
  const [seeChat] = useMutation(SEEN_CHAT, {
    variables: {
      person: id === getProfileActiveChat?.confessee._id ? id : "anonymous",
      chat: getProfileActiveChat?._id,
    },
  });

  const [hasMore, setHasMore] = useState(
    getProfileActiveChat?.messages.pageInfo.hasNextPage
  );

  const confessedTo = session?.user?.id === getProfileActiveChat?.confessee._id;
  const chatSeen = confessedTo
    ? getProfileActiveChat?.confesseeSeen
    : getProfileActiveChat?.anonSeen;

  const loadMoreMessages = () => {
    moreMessages({
      variables: {
        after: getProfileActiveChat?.messages.pageInfo.endCursor,
        limit: 10,
      },
    }).then((fetchMoreResult: { data: getProfileChatResult }) => {
      if (
        !fetchMoreResult.data?.getProfileActiveChat?.messages?.pageInfo
          ?.hasNextPage
      ) {
        setHasMore(false);
      }
    });
  };

  const requestEnd = () => {
    requestEndChat({
      variables: {
        chat: getProfileActiveChat?._id,
        anonymous: confessedTo ? false : true,
        sender: session?.user?.id,
      },
    });
  };

  // Put the scrollbar at the end on page mount
  // Setup chat subscription on mount
  useEffect(() => {
    if (chatMain && getProfileActiveChat) {
      (chatMain as React.MutableRefObject<HTMLElement>).current.scrollTop =
        (chatMain as React.MutableRefObject<HTMLElement>)?.current
          .scrollHeight -
        (chatMain as React.MutableRefObject<HTMLElement>)?.current.clientHeight;
    }
    subscribeToMore({
      document: NEW_MSG_SUBSCRIPTION,
      variables: { chat: getProfileActiveChat?._id },
      onError: () => {
        errorHandler("Invalid Input: Chat does not exist.");
        router.replace("/");
      },
      updateQuery: (
        prev,
        { subscriptionData }: { subscriptionData: SubscriptionData<NewMessage> }
      ) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.newMessage;
        const idAlreadyExists =
          prev.getProfileActiveChat.messages.edges.filter((item) => {
            return item.node._id === newMessage._id;
          }).length > 0;

        setRequestLatest(newMessage?.endRequestMsg);

        if (!idAlreadyExists) {
          return Object.assign({}, prev, {
            getProfileActiveChat: {
              ...prev.getProfileActiveChat,
              messages: {
                ...prev.getProfileActiveChat.messages,
                edges: [
                  { _typename: "MessageEdge", node: newMessage },
                  ...prev.getProfileActiveChat.messages.edges,
                ],
              },
            },
          });
        } else {
          return prev;
        }
      },
    });
  }, [subscribeToMore, getProfileActiveChat?._id]);

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
    window.addEventListener("focus", () => setPageVisible(true), false);
    window.addEventListener("blur", () => setPageVisible(false), false);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", () => setPageVisible(true));
      window.removeEventListener("blur", () => setPageVisible(false));
    };
  }, []);

  // If the page is visible and the chat hasn't been seen yet, seen the chat.
  useEffect(() => {
    if (pageVisible && !chatSeen && getProfileActiveChat) {
      seeChat();
    }
  }, [pageVisible, seeChat, chatSeen, getProfileActiveChat]);

  if (!getProfileActiveChat) {
    return (
      <>
        <Error statusCode={404} />
      </>
    );
  }

  return (
    <>
      <Box display="flex" flexDirection="column" height="100%">
        <AnonyChatHead>
          <Container
            sx={{ height: "100%", display: "flex", alignItems: "center" }}
          >
            <Box flexGrow={1} display="flex" alignItems="center">
              <Image
                src={
                  confessedTo
                    ? Anonymous
                    : (getProfileActiveChat?.confessee.image as string)
                }
                alt="PFP"
                width={40}
                height={40}
                className="avatar"
              />

              <Typography variant="h6" ml={2}>
                {confessedTo
                  ? "Anonymous"
                  : getProfileActiveChat?.confessee.name}
              </Typography>
            </Box>

            {!getProfileActiveChat?.chatEnded && (
              <AnonyButton
                onClick={requestEnd}
                disabled={requestLatest}
                sx={{ color: "white" }}
              >
                End Chat
              </AnonyButton>
            )}

            <IconButton>
              <SettingsIcon />
            </IconButton>
          </Container>
        </AnonyChatHead>

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
          {getProfileActiveChat?.messages ? (
            <MessageList
              messages={getProfileActiveChat?.messages}
              loadMoreMessages={loadMoreMessages}
              hasMore={hasMore}
              chatEnded={getProfileActiveChat?.chatEnded}
            />
          ) : (
            <CircularProgress />
          )}
        </Box>

        {!getProfileActiveChat?.chatEnded ? (
          <Textbar
            chatId={getProfileActiveChat?._id}
            confessedTo={confessedTo}
            requestLatest={requestLatest}
          />
        ) : (
          <>
            <Link href="/reveal" passHref>
              <AnonyButton sx={{ height: "120px", fontSize: "24px" }}>
                Reveal Confesser!
              </AnonyButton>
            </Link>
          </>
        )}
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { data, exists } = await getUserActiveChat(session?.user?.id as string);

  if (!exists) {
    return {
      notFound: true,
    };
  }

  return addApolloState(data, {
    props: {
      session,
      id: session?.user?.id,
    },
  });
};

export default ActiveChat;
