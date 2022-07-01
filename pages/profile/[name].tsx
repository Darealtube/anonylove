import { Box, Container, Grid, Typography } from "@mui/material";
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
import { useState } from "react";
import LinkTree from "../../Components/Profile/LinkTree";
import { AnonyPFP } from "../../Components/Style/Profile/AnonyPFP";
import { AnonyCover } from "../../Components/Style/Profile/AnonyCover";
import { ProfileButton } from "../../Components/Style/Profile/ProfileButton";
import { AnonyBio } from "../../Components/Style/Profile/AnonyBio";

const User = ({
  name,
  youSentRequest,
}: {
  name: string;
  youSentRequest: boolean;
}) => {
  const [disableRequest, setDisableRequest] = useState(false);
  const { data: session } = useSession();
  // GIVE A BLANK OBJECT TO DESTRUCTURE IT FROM. THIS AVOIDS THE 'UNDEFINED' DESTRUCTURE PROBLEM
  const { data: { getUser } = {} } = useQuery<GetUserResult, GetUserVariables>(
    GET_USER_QUERY,
    {
      variables: {
        name,
        from: session?.user?.id as string,
      },
      skip: !session,
    }
  );
  const ownProfile = session?.user?.name === getUser?.name;
  const [sendRequest] = useMutation(SEND_CONFESSION_REQUEST);

  const handleRequest = () => {
    setDisableRequest(true);
    sendRequest({
      variables: { anonymous: session?.user?.id, receiver: getUser?._id },
    });
  };

  return (
    <>
      <Head>
        <title>AnonyLove | Profile</title>
        <meta name="description" content="Face the Fear of Confession" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AnonyCover>
        <Image
          src={getUser?.cover ?? NoBg}
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
                src={getUser?.image ?? anonyUser}
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
              {getUser?.name}
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
                {getUser?.email ?? "Not Provided"}
              </Typography>
            </Information>
            <Information title="Relationship Status">
              <Typography align="center" variant="h6">
                {getUser?.status ?? "Unknown"}
              </Typography>
            </Information>
            {ownProfile ? (
              <Link href="/profile/edit" passHref>
                <ProfileButton variant="outlined" fullWidth>
                  Edit Profile
                </ProfileButton>
              </Link>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <ProfileButton variant="outlined" fullWidth>
                  Report User
                </ProfileButton>
                <ProfileButton
                  variant="outlined"
                  onClick={handleRequest}
                  fullWidth
                  disabled={disableRequest || youSentRequest}
                >
                  Send Request
                </ProfileButton>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={12} lg={6}>
            <Typography
              variant="h1"
              sx={{ position: "absolute", color: "white", ml: 2 }}
            >
              &ldquo;
            </Typography>
            <AnonyBio elevation={6}>{getUser?.bio ?? ""}</AnonyBio>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const { data, exists, youSentRequest } = await getUserInfo(
    context.params?.name as string,
    session?.user?.id as string
  );

  if (!exists) {
    return {
      notFound: true,
    };
  }

  return addApolloState(data, {
    props: {
      session,
      name: context.params?.name,
      youSentRequest,
    },
  });
};

export default User;
