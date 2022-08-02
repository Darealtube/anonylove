import { useMutation, useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
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
import { RevealContainer } from "../Components/Style/Chat/RevealContainer";

const RevealConfession = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data: { getProfileActiveChat } = {} } = useQuery<
    getProfileChatResult,
    getProfileChatVariables
  >(REVEAL_USER_CHAT, { variables: { profileId: id } });

  const [endChat] = useMutation(END_CHAT, {
    variables: { chat: getProfileActiveChat?._id },
  });

  const handleEndChat = () => {
    endChat();
    router.push("/");
  };

  return (
    <>
      <RevealContainer>
        <Typography variant="h4" align="center" mb={12}>
          The confesser is...
        </Typography>

        <Box
          mb={16}
          width={320}
          height={320}
          className="avatar"
          position="relative"
        >
          <Image
            src={getProfileActiveChat?.anonymous.image ?? NoPicture}
            alt="Confesser PFP"
            layout="fill"
            objectFit="cover"
            className="avatar"
          />
        </Box>

        <Typography variant="h3" align="center" mb={4}>
          {getProfileActiveChat?.anonymous.name}
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
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
      </RevealContainer>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { data, exists, ended } = await revealChatInfo(
    session?.user?.id as string
  );

  if (!exists) {
    return {
      notFound: true,
    };
  }

  if (!ended) {
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
