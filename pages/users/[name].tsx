import { Box, Container, Grid } from "@mui/material";
import Image from "next/image";
import Head from "next/head";
import NoBg from "../../public/nobg.png";
import anonyUser from "../../public/anonyUser.png";
import AppWrap from "../../Components/Wrapper/AppWrap";

const Profile = () => {
  return (
    <>
      <Head>
        <title>AnonyLove | Profile</title>
        <meta name="description" content="Face the Fear of Confession" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppWrap>
        <Box width="100%" position="relative" height="40%">
          <Image
            src={NoBg}
            alt="No Background Image"
            objectFit="cover"
            layout="fill"
          />
        </Box>

        <Grid spacing={2}>
          <Container>
            <Grid item xs={4}>
              <Box
                width={160}
                height={160}
                borderRadius="50%"
                position="relative"
                bottom={80}
                ml={4}
                sx={{ backgroundColor: "#F6F7F8" }}
              >
                <Image
                  src={anonyUser}
                  alt="PFP"
                  layout="fill"
                  objectFit="cover"
                />
              </Box>
            </Grid>
          </Container>
        </Grid>
      </AppWrap>
    </>
  );
};

export default Profile;
