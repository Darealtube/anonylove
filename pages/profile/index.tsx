import { Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import Head from "next/head";
import NoBg from "../../public/nobg.png";
import anonyUser from "../../public/anonyUser.png";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { addApolloState } from "../../apollo/apolloClient";
import { GET_PROFILE_QUERY } from "../../apollo/query/userQuery";
import { useQuery } from "@apollo/client";
import { getProfileInfo } from "../../utils/SSR/profile";
import { GetProfileVariables, GetProfileResult } from "../../types/Queries";
import Information from "../../Components/Profile/Information";
import Link from "next/link";
import LinkTree from "../../Components/Profile/LinkTree";
import { AnonyCover } from "../../Components/Style/Profile/AnonyCover";
import { AnonyPFP } from "../../Components/Style/Profile/AnonyPFP";
import { ProfileButton } from "../../Components/Style/Profile/ProfileButton";
import { AnonyBio } from "../../Components/Style/Profile/AnonyBio";

const Profile = ({ id }: { id: string }) => {
  const { data: session } = useSession();
  // GIVE A BLANK OBJECT TO DESTRUCTURE IT FROM. THIS AVOIDS THE 'UNDEFINED' DESTRUCTURE PROBLEM
  const { data: { getProfile } = {} } = useQuery<
    GetProfileResult,
    GetProfileVariables
  >(GET_PROFILE_QUERY, {
    variables: { id },
    skip: !session,
  });

  return (
    <>
      <Head>
        <title>AnonyLove | Profile</title>
        <meta name="description" content="Face the Fear of Confession" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AnonyCover>
        <Image
          src={getProfile?.cover ?? NoBg}
          alt="No Background Image"
          objectFit="cover"
          layout="fill"
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
                src={getProfile?.image ?? anonyUser}
                alt="PFP"
                width={160}
                height={160}
                className="avatar"
              />
            </AnonyPFP>

            <Typography
              align="center"
              variant="h5"
              sx={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              mt={1}
            >
              {getProfile?.name}
            </Typography>
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
                {getProfile?.email ?? "Not Provided"}
              </Typography>
            </Information>
            <Information title="Relationship Status">
              <Typography align="center" variant="h6">
                {getProfile?.status ?? "Unknown"}
              </Typography>
            </Information>
            <Link href="/profile/edit" passHref>
                <ProfileButton variant="outlined" fullWidth>
                  Edit Profile
                </ProfileButton>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={12} lg={6}>
            <Typography
              variant="h1"
              sx={{ position: "absolute", color: "white", ml: 2 }}
            >
              &ldquo;
            </Typography>
            <AnonyBio elevation={6}>{getProfile?.bio ?? ""}</AnonyBio>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { data, exists } = await getProfileInfo(session?.user?.id as string);
  if (!exists) {
    return {
      notFound: true,
    };
  }
  return addApolloState(data, {
    props: {
      session,
      id: session?.user?.id,
    },
  });
};

export default Profile;
