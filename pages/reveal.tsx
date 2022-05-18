import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, Container, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { addApolloState } from "../apollo/apolloClient";
import { REVEAL_USER_CHAT } from "../apollo/query/chatQuery";
import { getUserChatResult, getUserChatVariables } from "../types/Queries";
import { revealChatInfo } from "../utils/SSR/chat";
import NoPicture from "../public/anonyUser.png";
import styles from "../styles/RevealChat.module.css";
import { END_CHAT } from "../apollo/mutation/chatMutation";
import { useRouter } from "next/router";
import Link from "next/link";

const RevealConfession = ({
  name,
  chatId,
}: {
  name: string;
  chatId: string;
}) => {
  const router = useRouter();
  const { data: { getUserActiveChat } = {} } = useQuery<
    getUserChatResult,
    getUserChatVariables
  >(REVEAL_USER_CHAT, {
    variables: {
      name,
    },
  });

  const [endChat] = useMutation(END_CHAT, {
    variables: { chat: getUserActiveChat?._id },
    update: (cache) => {
      cache.evict({ id: `Chat:${chatId}` });
      cache.gc();
      router.replace("/");
    },
  });

  const handleEndChat = () => {
    endChat();
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>AnonyLove | Confession</title>
        <meta name="description" content="Face the fear of confession." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container
        sx={{
          diplay: "flex",
          alignItems: "center",
          textAlign: "center",
          flexDirection: "column",
          height: "100%",
          pt: 3,
          pb: 3,
        }}
      >
        <Typography variant="h4" align="center" mb={12}>
          The confesser is...
        </Typography>

        <Box mb={16}>
          <Image
            src={getUserActiveChat?.anonymous.image ?? NoPicture}
            alt="Confesser PFP"
            className={styles.avatar}
            width={320}
            height={320}
          />
        </Box>

        <Typography variant="h5" align="center" mb={4}>
          {getUserActiveChat?.anonymous.name}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Link href={`/profile/${getUserActiveChat?.anonymous.name}`} passHref>
            <Button className="anonybutton" fullWidth component="a">
              Visit Profile
            </Button>
          </Link>
          <Button className="anonybutton" fullWidth onClick={handleEndChat}>
            End Chat
          </Button>
        </Box>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { data, exists, expired, chatId } = await revealChatInfo(
    session?.user?.name as string
  );

  if (!exists) {
    return {
      notFound: true,
    };
  }

  if (!expired) {
    return {
      redirect: {
        destination: "/activeChat",
        permanent: true,
      },
    };
  }

  return addApolloState(data, {
    props: {
      session,
      name: session?.user?.name,
      chatId,
    },
  });
};

export default RevealConfession;
