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
  Switch,
  Box,
} from "@mui/material";
import { getSession, useSession } from "next-auth/react";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_PROFILE_QUERY } from "../../apollo/query/userQuery";
import { GetProfileResult, GetProfileVariables } from "../../types/Queries";
import { useContext, useState } from "react";
import { GetServerSideProps } from "next";
import { addApolloState } from "../../apollo/apolloClient";
import { editProfileInfo } from "../../utils/SSR/profile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Information from "../../Components/Profile/Information";
import Link from "next/link";
import { EDIT_USER_PROFILE } from "../../apollo/mutation/userMutation";
import { useRouter } from "next/router";
import { uploadImage } from "../../utils/Media/uploadMedia";
import { AnonyCover } from "../../Components/Style/Profile/AnonyCover";
import { AnonyPFP } from "../../Components/Style/Profile/AnonyPFP";
import { ProfileButton } from "../../Components/Style/Profile/ProfileButton";
import { AnonyBio } from "../../Components/Style/Profile/AnonyBio";
import { ErrorContext } from "../../Components/ErrorProvider";
import dynamic from "next/dynamic";

type CropperType = {
  open: boolean;
  handler: (image: string) => void;
  type: "cover" | "pfp";
};

const ImageCropper = dynamic(() => import("../../Components/ImageCropper"));

const EditProfile = () => {
  const router = useRouter();
  const errorHandler = useContext(ErrorContext);
  const { data: session } = useSession();
  const [cropper, setCropper] = useState<CropperType>({
    open: false,
    handler: (image: string) => {},
    type: "pfp",
  });
  const [editProfile] = useMutation(EDIT_USER_PROFILE, {
    onError: (error) => {
      errorHandler(error.message);
    },
  });
  const { data: { getProfile } = {} } = useQuery<
    GetProfileResult,
    GetProfileVariables
  >(EDIT_PROFILE_QUERY, {
    variables: {
      profileId: session?.user?.id as string,
    },
  });

  const [profile, setProfile] = useState({
    name: getProfile?.name,
    image: getProfile?.image,
    cover: getProfile?.cover,
    bio: getProfile?.bio,
    status: getProfile?.status ?? "Single",
    requestsDisabled: getProfile?.requestsDisabled ?? false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const handleDisableRequests = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.currentTarget.name]: e.currentTarget.checked,
    });
  };

  const handleSelect = (e: SelectChangeEvent<string>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeCover = (image: string) => {
    setProfile({
      ...profile,
      cover: image,
    });
  };

  const handleChangePFP = (image: string) => {
    setProfile({
      ...profile,
      image,
    });
  };

  const handleCropPFP = () => {
    setCropper({ ...cropper, open: true, handler: handleChangePFP });
  };

  const handleCropCover = () => {
    setCropper({ open: true, handler: handleChangeCover, type: "cover" });
  };

  const handleCloseCropper = () => {
    setCropper({ open: false, handler: (image: string) => {}, type: "pfp" });
  };

  // WILL ONLY UPLOAD IMAGE TO CLOUDINARY IF IT'S NOT THE SAME IMAGE AS BEFORE
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
        profileId: session?.user?.id,
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
          width={1280}
          height={304}
        />
        <IconButton
          sx={{ position: "absolute", color: "#f6f7f8" }}
          onClick={handleCropCover}
        >
          <CameraAltIcon />
        </IconButton>
      </AnonyCover>

      <Grid container sx={{ display: "flex" }}>
        <Grid
          item
          xs={12}
          sm={6}
          md={12}
          lg={6}
          sx={{ position: "relative", bottom: "80px" }}
        >
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
                objectFit="contain"
                className="avatar"
              />
              <IconButton
                sx={{ position: "absolute", color: "#f6f7f8" }}
                onClick={handleCropPFP}
              >
                <CameraAltIcon />
              </IconButton>
            </AnonyPFP>
          </Container>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={12}
          lg={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            bottom: "40px",
          }}
        >
          <TextField
            id="name"
            name="name"
            variant="standard"
            sx={{ width: "80%", mb: 2, mt: 2 }}
            value={profile.name}
            onChange={handleChange}
            inputProps={{
              style: {
                color: "white",
                fontSize: "42px",
                fontWeight: "bolder",
                textAlign: "center",
              },
            }}
          />
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

            <Box display="flex" alignItems="center" mt={4}>
              <Switch
                checked={profile.requestsDisabled}
                onChange={handleDisableRequests}
                color="warning"
                name="requestsDisabled"
              />
              <Typography>Disable Confession Requests</Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <ImageCropper cropper={cropper} handleClose={handleCloseCropper} />
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
