import { useQuery, useSubscription } from "@apollo/client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { ReactNode, useEffect, useState } from "react";
import { GET_PROFILE_STATUS } from "../apollo/query/userQuery";
import { NEW_NOTIF_SUBSCRIPTION } from "../apollo/subscription/notifSub";
import { GetProfileResult, GetProfileVariables } from "../types/Queries";
import useTitle from "../utils/Hooks/useTitle";

const TitleWrap = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [chatSeen, setChatSeen] = useState<boolean | undefined>(true);
  const [notifSeen, setNotifSeen] = useState<boolean | undefined>(true);
  const { data } = useQuery<GetProfileResult, GetProfileVariables>(
    GET_PROFILE_STATUS,
    { variables: { id: session?.user?.id as string } }
  );
  const { data: notifS } = useSubscription(NEW_NOTIF_SUBSCRIPTION, {
    variables: { receiver: session?.user?.id },
    onSubscriptionData: ({ subscriptionData }) => {
      setNotifSeen(subscriptionData?.data?.notifSeen);
    },
  });

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
  }, [data, session]);

  useEffect(() => {
    setNotifSeen(data?.getProfile?.notifSeen);
  }, [data]);

  const { title } = useTitle({ notifSeen, chatSeen });
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
