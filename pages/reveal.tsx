import { useMutation, useQuery } from "@apollo/client";
import { Box, Container, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { addApolloState } from "../apollo/apolloClient";
import { REVEAL_USER_CHAT } from "../apollo/query/chatQuery";
import {
  getProfileChatResult,
  getProfileChatVariables,
} from "../types/Queries";
import { revealChatInfo } from "../utils/SSR/chat";
import NoPicture from "../public/anonyUser.png";
import { END_CHAT } from "../apollo/mutation/chatMutation";
import { useRouter } from "next/router";
import Link from "next/link";
import { AnonyButton } from "../Components/Style/Global/AnonyButton";

const RevealConfession = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data: { getProfileActiveChat } = {} } = useQuery<
    getProfileChatResult,
    getProfileChatVariables
  >(REVEAL_USER_CHAT, { variables: { id } });

  const [endChat] = useMutation(END_CHAT, {
    variables: { chat: getProfileActiveChat?._id },
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
            src={getProfileActiveChat?.anonymous.image ?? NoPicture}
            alt="Confesser PFP"
            className="avatar"
            width={320}
            height={320}
          />
        </Box>

        <Typography variant="h3" align="center" mb={4}>
          {getProfileActiveChat?.anonymous.name}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Link
            href={`/profile/${getProfileActiveChat?.anonymous.name}`}
            passHref
          >
            <AnonyButton fullWidth>Visit Profile</AnonyButton>
          </Link>
          <AnonyButton fullWidth onClick={handleEndChat}>
            End Chat
          </AnonyButton>
        </Box>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { data, exists, expired } = await revealChatInfo(
    session?.user?.id as string
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
      id: session?.user?.id,
    },
  });
};

export default RevealConfession;
