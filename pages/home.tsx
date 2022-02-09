import { Button, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";

const Home = () => {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>AnonyLove | Home</title>
        <meta name="description" content="Face the Fear of Confession" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Typography>Welcome, {session?.user?.name}</Typography>
      <Button onClick={() => signOut()}>Sign Out</Button>
    </>
  );
};

export default Home;
