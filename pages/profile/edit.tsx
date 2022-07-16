import Image from "next/image";
import NoBg from "../../public/nobg.png";
import anonyUser from "../../public/anonyUser.png";
import {
  Container,
  IconButton,
  TextField,
  Grid,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { getSession, useSession } from "next-auth/react";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_PROFILE_QUERY } from "../../apollo/query/userQuery";
import { GetProfileResult, GetProfileVariables } from "../../types/Queries";
import { MutableRefObject, useContext, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { addApolloState } from "../../apollo/apolloClient";
import { editProfileInfo } from "../../utils/SSR/profile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { getImages } from "../../utils/Media/getImage";
import Information from "../../Components/Profile/Information";
import Link from "next/link";
import { EDIT_USER_PROFILE } from "../../apollo/mutation/userMutation";
import { useRouter } from "next/router";
import { uploadImage } from "../../utils/Media/uploadMedia";
import LinkTree from "../../Components/Profile/LinkTree";
import { AnonyCover } from "../../Components/Style/Profile/AnonyCover";
import { AnonyPFP } from "../../Components/Style/Profile/AnonyPFP";
import { ProfileButton } from "../../Components/Style/Profile/ProfileButton";
import { AnonyBio } from "../../Components/Style/Profile/AnonyBio";
import { ErrorContext } from "../../Components/ErrorProvider";

const EditProfile = () => {
  const router = useRouter();
  const errorHandler = useContext(ErrorContext);
  const pfp = useRef<HTMLInputElement | null>(null);
  const cover = useRef<HTMLInputElement | null>(null);
  const { data: session } = useSession();
  const [editProfile] = useMutation(EDIT_USER_PROFILE, {
    onError: () => {
      errorHandler("You can only edit 3 times per hour.");
    },
  });
  const { data: { getProfile } = {} } = useQuery<
    GetProfileResult,
    GetProfileVariables
  >(EDIT_PROFILE_QUERY, {
    variables: {
      id: session?.user?.id as string,
    },
  });

  const [profile, setProfile] = useState({
    name: getProfile?.name,
    image: getProfile?.image,
    cover: getProfile?.cover,
    bio: getProfile?.bio,
    status: getProfile?.status ?? "Single",
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
          getProfile?.cover === profile.cover
            ? profile.cover
            : await uploadImage(profile.cover as string),
        userId: session?.user?.id,
      },
    })
      .then((res) => {
        if (res.errors) {
          throw new Error("An error occurred. Try again.");
        } else {
          router.replace(`/profile/`);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <AnonyCover>
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
      </AnonyCover>

      <Grid container sx={{ display: "flex" }}>
        <Grid item xs={6} sx={{ position: "relative", bottom: "80px" }}>
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <AnonyPFP>
              <Image
                src={profile.image ?? anonyUser}
                alt="PFP"
                layout="fill"
                objectFit="cover"
                className="avatar"
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
            </AnonyPFP>

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
                  fontSize: "20px",
                  textAlign: "center",
                },
              }}
            />
          </Container>
        </Grid>

        <Grid item xs={6}>
          <LinkTree />
        </Grid>
      </Grid>

      <Container sx={{ position: "relative", bottom: "40px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={12} lg={6}>
            <Information title="Email Address">
              <Typography align="center" variant="h6">
                {getProfile?.email}
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
              <ProfileButton variant="outlined" fullWidth>
                Cancel
              </ProfileButton>
            </Link>

            <ProfileButton variant="outlined" fullWidth onClick={handleSubmit}>
              Save
            </ProfileButton>
          </Grid>

          <Grid item xs={12} sm={6} md={12} lg={6}>
            <Typography
              variant="h1"
              sx={{ position: "absolute", color: "white", ml: 2 }}
            >
              &ldquo;
            </Typography>
            <AnonyBio elevation={6}>
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
            </AnonyBio>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default EditProfile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { data } = await editProfileInfo(session?.user?.id as string);

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
