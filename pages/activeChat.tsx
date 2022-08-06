import { useMutation, useQuery, useSubscription } from "@apollo/client";
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
import { SEEN_CHAT } from "../apollo/mutation/chatMutation";
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
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Error from "next/error";
import { CHAT_ENDED_SUBSCRIPTION } from "../apollo/subscription/chatSub";

const Textbar = dynamic(() => import("../Components/Chat/Textbar"));
const EndButton = dynamic(() => import("../Components/Chat/EndButton"));

const ActiveChat = ({
  sessionId,
  chatId,
  ended,
}: {
  sessionId: string;
  chatId: string;
  ended: boolean;
}) => {
  const router = useRouter();
  const chatMain = useRef<HTMLElement>();
  const errorHandler = useContext(ErrorContext);
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
        profileId: sessionId,
        limit: 10,
      },
    }
  );
  const { data } = useSubscription(CHAT_ENDED_SUBSCRIPTION, {
    variables: { chatId },
    onSubscriptionData: ({ subscriptionData }) => {
      const ended = subscriptionData.data.activeChatEnded;
      if (ended) router.replace("/reveal");
      else return false;
    },
  });
  const [requestLatest, setRequestLatest] = useState(
    getProfileActiveChat?.messages.edges[0]?.node.endRequestMsg
  );

  // GIVE A BLANK OBJECT TO DESTRUCTURE IT FROM. THIS AVOIDS THE 'UNDEFINED' DESTRUCTURE PROBLEM
  const [seeChat] = useMutation(SEEN_CHAT, {
    variables: {
      person:
        sessionId === getProfileActiveChat?.confessee._id
          ? sessionId
          : "anonymous",
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
              <EndButton
                chatId={getProfileActiveChat?._id}
                confessedTo={confessedTo}
                requestLatest={requestLatest}
                attempts={getProfileActiveChat?.endAttempts}
              />
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

        {!(ended || getProfileActiveChat?.chatEnded) ? (
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
  const { data, exists, ended, chatId } = await getUserActiveChat(
    session?.user?.id as string
  );

  if (!exists) {
    return {
      notFound: true,
    };
  }

  return addApolloState(data, {
    props: {
      session,
      sessionId: session?.user?.id,
      chatId,
      ended,
    },
  });
};

export default ActiveChat;
