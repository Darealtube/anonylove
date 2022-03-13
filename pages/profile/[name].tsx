import { Box, Button, Container, Grid, Typography, Paper } from "@mui/material";
import styles from "../../styles/Profile.module.css";
import Image from "next/image";
import Head from "next/head";
import NoBg from "../../public/nobg.png";
import anonyUser from "../../public/anonyUser.png";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { addApolloState } from "../../apollo/apolloClient";
import { GET_USER_QUERY } from "../../apollo/query/userQuery";
import { useMutation, useQuery } from "@apollo/client";
import { getUserInfo } from "../../utils/SSR/profile";
import { GetUserResult, GetUserVariables } from "../../types/Queries";
import Information from "../../Components/Profile/Information";
import Link from "next/link";
import { SEND_CONFESSION_REQUEST } from "../../apollo/mutation/requestMutation";
import { useContext } from "react";
import { ActiveChatContext } from "../../Components/Wrapper/AppWrap";

const Profile = ({ name }: { name: string }) => {
  const hasActiveChat = useContext(ActiveChatContext);
  const { data: session } = useSession();
  // GIVE A BLANK OBJECT TO DESTRUCTURE IT FROM. THIS AVOIDS THE 'UNDEFINED' DESTRUCTURE PROBLEM
  const { data: { getUser } = {} } = useQuery<GetUserResult, GetUserVariables>(
    GET_USER_QUERY,
    {
      variables: {
        name,
      },
    }
  );
  const ownProfile = session?.user?.name === getUser?.name;
  const [sendRequest] = useMutation(SEND_CONFESSION_REQUEST);

  const handleRequest = () => {
    sendRequest({
      variables: { anonymous: session?.user?.name, receiver: name },
    });
  };

  return (
    <>
      <Head>
        <title>AnonyLove | Profile</title>
        <meta name="description" content="Face the Fear of Confession" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box className={styles.cover}>
        <Image
          src={getUser?.cover ?? NoBg}
          alt="No Background Image"
          objectFit="cover"
          layout="fill"
        />
      </Box>

      <Box className={styles.main}>
        <Box className={styles.pfp}>
          <Image
            src={getUser?.image ?? anonyUser}
            alt="PFP"
            width={160}
            height={160}
            className={styles.avatar}
          />
        </Box>

        <Typography align="center" variant="h3" mt={1}>
          {getUser?.name}
        </Typography>
      </Box>

      <Container sx={{ position: "relative", bottom: "40px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={12} lg={6}>
            <Information title="Email Address">
              <Typography align="center" variant="h6">
                {getUser?.email}
              </Typography>
            </Information>
            <Information title="Relationship Status">
              <Typography align="center" variant="h6">
                {getUser?.status ?? "Unknown"}
              </Typography>
            </Information>
            {ownProfile ? (
              <Link href="/profile/edit" passHref>
                <Button
                  component="a"
                  variant="outlined"
                  className={styles.reqButton}
                  fullWidth
                >
                  Edit Profile
                </Button>
              </Link>
            ) : (
              <Button
                variant="outlined"
                className={styles.reqButton}
                onClick={handleRequest}
                fullWidth
                disabled={hasActiveChat}
              >
                Send Request
              </Button>
            )}
            {!ownProfile && (
              <Button
                component="a"
                variant="outlined"
                className={styles.reqButton}
                fullWidth
                disabled={hasActiveChat}
              >
                Report User
              </Button>
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={12} lg={6}>
            <Typography
              variant="h1"
              sx={{ position: "absolute", color: "white", ml: 2 }}
            >
              &ldquo;
            </Typography>
            <Paper
              className={styles.bio}
              sx={{ color: "#f6f7f8" }}
              elevation={6}
            >
              {getUser?.bio ?? ""}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { data, exists } = await getUserInfo(context.params?.name as string);

  if (!exists) {
    return {
      notFound: true,
    };
  }

  return addApolloState(data, {
    props: {
      session,
      name: context.params?.name,
    },
  });
};

export default Profile;
