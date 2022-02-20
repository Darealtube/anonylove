import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import styles from "../../styles/Profile.module.css";
import Image from "next/image";
import Head from "next/head";
import NoBg from "../../public/nobg.png";
import anonyUser from "../../public/anonyUser.png";
import AppWrap from "../../Components/Wrapper/AppWrap";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { addApolloState } from "../../apollo/apolloClient";
import { GET_USER_QUERY } from "../../apollo/query/userQuery";
import { useQuery } from "@apollo/client";
import { getUser } from "../../utils/SSR/profile";
import { getUserResult, getUserVariables } from "../../types/Queries";

const Profile = ({ name }: { name: string }) => {
  const { data: user } = useQuery<getUserResult, getUserVariables>(
    GET_USER_QUERY,
    {
      variables: {
        name,
      },
    }
  );

  return (
    <>
      <Head>
        <title>AnonyLove | Profile</title>
        <meta name="description" content="Face the Fear of Confession" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppWrap>
        <Box className={styles.cover}>
          <Image
            src={NoBg}
            alt="No Background Image"
            objectFit="cover"
            layout="fill"
          />
        </Box>

        <Box className={styles.main}>
          <Box className={styles.pfp}>
            <Image
              src={user?.getUser?.image ?? anonyUser}
              alt="PFP"
              width={160}
              height={160}
              className={styles.avatar}
            />
          </Box>

          <Typography align="center" variant="h3" mt={1}>
            {user?.getUser?.name}
          </Typography>
        </Box>

        <Container sx={{ position: "relative", bottom: "40px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={12} lg={6}>
              <Box mb={2}>
                <Typography align="center" variant="h6">
                  {user?.getUser?.email}
                </Typography>
                <Divider sx={{ backgroundColor: "white" }} />
                <Typography align="center">Email Address</Typography>
              </Box>
              <Box mb={2}>
                <Typography align="center" variant="h6">
                  Single
                </Typography>
                <Divider sx={{ backgroundColor: "white" }} />
                <Typography align="center">Relationship Status</Typography>
                <Button
                  variant="outlined"
                  className={styles.reqButton}
                  fullWidth
                >
                  Send Request
                </Button>
                <Button
                  variant="outlined"
                  className={styles.reqButton}
                  fullWidth
                >
                  Report User
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={12} lg={6}>
              <Typography
                variant="h1"
                sx={{ position: "absolute", color: "white", ml: 2 }}
              >
                &ldquo;
              </Typography>
              <Paper className={styles.bio} elevation={6}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                varius interdum lobortis. Nunc ultricies tellus enim, aliquam
                interdum leo tincidunt ut. Integer finibus nunc et lorem
                gravida, non tincidunt dolor fringilla. Suspendisse pellentesque
                sem tempus lobortis sollicitudin. Praesent at tortor in lorem
                vehicula sagittis at in ipsum. Ut lectus enim, fermentum eget
                odio sit amet, tempus condimentum risus. Etiam aliquet felis
                orci, in tincidunt erat facilisis ut. Praesent blandit feugiat
                pulvinar.
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </AppWrap>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { data, exists } = await getUser(context.params?.name as string);

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
