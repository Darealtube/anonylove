import { useQuery } from "@apollo/client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { ReactNode, useEffect, useState } from "react";
import { GET_PROFILE_STATUS } from "../apollo/query/userQuery";
import { GetProfileResult, GetProfileVariables } from "../types/Queries";
import useTitle from "../utils/Hooks/useTitle";
import MessageRing from "../public/hey.mp3";
import { useRouter } from "next/router";

const TitleWrap = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [chatSeen, setChatSeen] = useState<boolean | undefined>(true);
  const [notifSeen, setNotifSeen] = useState<boolean | undefined>(true);
  const { title } = useTitle({ notifSeen, chatSeen });
  const { data } = useQuery<GetProfileResult, GetProfileVariables>(
    GET_PROFILE_STATUS,
    { variables: { profileId: session?.user?.id as string } }
  );

  useEffect(() => {
    if (!data?.getProfile?.activeChat) {
      setChatSeen(true);
    } else {
      const confessedTo =
        session?.user?.id === data?.getProfile?.activeChat?.confessee._id;
      setChatSeen(
        confessedTo
          ? data?.getProfile?.activeChat?.confesseeSeen
          : data?.getProfile?.activeChat?.anonSeen
      );
    }

    setNotifSeen(data?.getProfile?.notifSeen);
  }, [data, session]);

  useEffect(() => {
    setAudio(new Audio(MessageRing));
  }, []);

  useEffect(() => {
    if (
      (router.route !== "/activeChat" && !chatSeen) ||
      (document.hidden && !chatSeen)
    ) {
      audio?.play();
    }
  }, [router, chatSeen, audio, data?.getProfile?.activeChat?.latestMessage]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Face the Fear of Confession" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
    </>
  );
};

export default TitleWrap;
