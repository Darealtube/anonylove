import Head from "next/head";
import styles from "../../styles/Profile.module.css";
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
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { getSession, useSession } from "next-auth/react";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_USER_QUERY } from "../../apollo/query/userQuery";
import { GetUserResult, GetUserVariables } from "../../types/Queries";
import { MutableRefObject, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { addApolloState } from "../../apollo/apolloClient";
import { editUserInfo } from "../../utils/SSR/profile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { getImages } from "../../utils/Media/getImage";
import Information from "../../Components/Profile/Information";
import Link from "next/link";
import { EDIT_USER_PROFILE } from "../../apollo/mutation/userMutation";
import { useRouter } from "next/router";
import { uploadImage } from "../../utils/Media/uploadMedia";

const EditProfile = () => {
  const router = useRouter();
  const pfp = useRef<HTMLInputElement | null>(null);
  const cover = useRef<HTMLInputElement | null>(null);
  const { data: session } = useSession();
  const [editProfile] = useMutation(EDIT_USER_PROFILE);
  const { data: { getUser } = {} } = useQuery<GetUserResult, GetUserVariables>(
    EDIT_USER_QUERY,
    {
      variables: {
        name: session?.user?.name as string,
      },
    }
  );

  const [profile, setProfile] = useState({
    name: getUser?.name,
    image: getUser?.image,
    cover: getUser?.cover,
    bio: getUser?.bio,
    status: getUser?.status ?? "Single",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const handleSelect = (e: SelectChangeEvent<string>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

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

  const handleSubmit = async () => {
    editProfile({
      variables: {
        ...profile,
        image:
          session?.user?.image === profile.image
            ? profile.image
            : await uploadImage(profile.image as string),
        cover:
          getUser?.cover === profile.cover
            ? profile.cover
            : await uploadImage(profile.cover as string),
        originalName: session?.user?.name,
      },
    })
      .then((res) => {
        if (res.errors) {
          throw new Error("An error occurred. Try again.");
        } else {
          router.replace(`/profile/${profile.name}`);
        }
      })
      .catch((err) => console.log(err));
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
          onChange={handleChange}
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
              <Typography align="center" variant="h6">
                {getUser?.email}
              </Typography>
            </Information>
            <Information title="Relationship Status">
              <Select
                id="status"
                name="status"
                labelId="Status"
                value={profile.status}
                onChange={handleSelect}
                label="Relationship Status"
                fullWidth
                sx={{ color: "#f6f7f8" }}
                SelectDisplayProps={{ style: { textAlign: "center" } }}
              >
                <MenuItem value={"Single"}>Single</MenuItem>
                <MenuItem value={"In a Relationship"}>
                  In a Relationship
                </MenuItem>
                <MenuItem value={"It's Complicated"}>
                  It&apos;s Complicated
                </MenuItem>
              </Select>
            </Information>

            <Link href={`/profile/${session?.user?.name}`} passHref>
              <Button
                component="a"
                variant="outlined"
                className={styles.reqButton}
                fullWidth
              >
                Cancel
              </Button>
            </Link>

            <Button
              variant="outlined"
              className={styles.reqButton}
              fullWidth
              onClick={handleSubmit}
            >
              Save
            </Button>
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
                onChange={handleChange}
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
    </>
  );
};

export default EditProfile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { data } = await editUserInfo(session?.user?.name as string);

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
