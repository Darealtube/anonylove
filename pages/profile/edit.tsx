import Head from "next/head";
import styles from "../../styles/Profile.module.css";
import AppWrap from "../../Components/Wrapper/AppWrap";
import Image from "next/image";
import NoBg from "../../public/nobg.png";
import anonyUser from "../../public/anonyUser.png";
import {
  Box,
  Container,
  IconButton,
  TextField,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import { getSession, useSession } from "next-auth/react";
import { useQuery } from "@apollo/client";
import { GET_USER_QUERY } from "../../apollo/query/userQuery";
import { getUserResult, getUserVariables } from "../../types/Queries";
import { MutableRefObject, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { addApolloState } from "../../apollo/apolloClient";
import { getUser } from "../../utils/SSR/profile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { getImages } from "../../utils/Media/getImage";
import Information from "../../Components/Profile/Information";

const EditProfile = () => {
  const pfp = useRef<HTMLInputElement | null>(null);
  const cover = useRef<HTMLInputElement | null>(null);
  const { data: session } = useSession();
  const { data: user } = useQuery<getUserResult, getUserVariables>(
    GET_USER_QUERY,
    {
      variables: {
        name: session?.user?.name as string,
      },
    }
  );

  const [profile, setProfile] = useState({
    name: user?.getUser?.name,
    email: user?.getUser?.email,
    image: user?.getUser?.image,
    cover: user?.getUser?.cover,
    bio: user?.getUser?.bio,
    status: user?.getUser?.status,
  });

  const handleChangeCoverClick = () => {
    (cover as MutableRefObject<HTMLInputElement>).current.click();
  };

  const handleChangePFPClick = () => {
    (pfp as MutableRefObject<HTMLInputElement>).current.click();
  };

  const handleChangeCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ((e.currentTarget.files as FileList)?.length != 0) {
      getImages((e.currentTarget.files as FileList)[0], (result) => {
        setProfile({
          ...profile,
          cover: result,
        });
      });
    }
  };

  const handleChangePFP = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ((e.currentTarget.files as FileList)?.length != 0) {
      getImages((e.currentTarget.files as FileList)[0], (result) => {
        setProfile({
          ...profile,
          image: result,
        });
      });
    }
  };

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
            src={profile.cover ?? NoBg}
            alt="No Background Image"
            objectFit="cover"
            layout="fill"
          />
          <IconButton
            sx={{ position: "absolute", color: "#f6f7f8" }}
            onClick={handleChangeCoverClick}
          >
            <CameraAltIcon />
          </IconButton>
          <input
            type="file"
            hidden={true}
            accept="image/*"
            ref={cover}
            onChange={handleChangeCover}
          />
        </Box>

        <Box className={styles.main}>
          <Box className={styles.pfp}>
            <Image
              src={profile.image ?? anonyUser}
              alt="PFP"
              layout="fill"
              objectFit="cover"
              className={styles.avatar}
            />
            <IconButton
              sx={{ position: "absolute", color: "#f6f7f8" }}
              onClick={handleChangePFPClick}
            >
              <CameraAltIcon />
            </IconButton>
            <input
              type="file"
              hidden={true}
              accept="image/*"
              ref={pfp}
              onChange={handleChangePFP}
            />
          </Box>

          <TextField
            id="name"
            name="name"
            variant="standard"
            sx={{ width: "80%" }}
            value={profile.name}
            inputProps={{
              style: {
                color: "white",
                fontSize: "40px",
                textAlign: "center",
              },
            }}
          />
        </Box>

        <Container sx={{ position: "relative", bottom: "40px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={12} lg={6}>
              <Information title="Email Address">
                <TextField
                  id="email"
                  name="email"
                  variant="standard"
                  sx={{ width: "100%" }}
                  value={profile.email}
                  inputProps={{
                    style: {
                      color: "white",
                      fontSize: "20px",
                      textAlign: "center",
                    },
                  }}
                />
              </Information>
              <Information title="Relationship Status">
                <TextField
                  id="status"
                  name="status"
                  variant="standard"
                  sx={{ width: "100%" }}
                  value={profile.status}
                  inputProps={{
                    style: {
                      color: "white",
                      fontSize: "20px",
                      textAlign: "center",
                    },
                  }}
                />
              </Information>
            </Grid>

            <Grid item xs={12} sm={6} md={12} lg={6}>
              <Typography
                variant="h1"
                sx={{ position: "absolute", color: "white", ml: 2 }}
              >
                &ldquo;
              </Typography>
              <Paper className={styles.bio} elevation={6}>
                <TextField
                  id="bio"
                  name="bio"
                  variant="outlined"
                  sx={{ width: "80%", color: "white" }}
                  value={profile.bio}
                  multiline
                  rows={7}
                  inputProps={{
                    style: {
                      color: "white",
                    },
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </AppWrap>
    </>
  );
};

export default EditProfile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { data } = await getUser(session?.user?.name as string);

  if (!session) {
    return {
      redirect: {
        destination: "/home",
        permanent: true,
      },
    };
  }

  return addApolloState(data, {
    props: {
      session,
    },
  });
};
