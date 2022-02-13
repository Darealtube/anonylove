import {
  Paper,
  Typography,
  Container,
  Box,
  AppBar,
  useMediaQuery,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  getProviders,
  getSession,
  LiteralUnion,
  useSession,
} from "next-auth/react";
import Head from "next/head";
import styles from "../styles/Login.module.css";
import BrandLogo from "../public/brandlogo.png";
import Image from "next/image";
import { useTheme } from "@mui/system";
import SignInOptions from "../Components/SignInOptions";
import { useEffect, useState } from "react";
import quoteRandomizer, { anonyQuotes } from "../utils/quoteRandomizer";

type Providers = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

const SignIn = ({ providers }: { providers: Providers }) => {
  const { data: session } = useSession();
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("md"));
  const [quote, setQuote] = useState("");

  console.log(session);

  useEffect(() => {
    setQuote(quoteRandomizer(anonyQuotes));
  }, []);

  return (
    <>
      <Head>
        <title>AnonyLove</title>
        <meta name="description" content="Face the fear of confession." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box className={styles.loginPage}>
        <Box
          sx={{
            height: "100vh",
            backdropFilter: "blur(5px)",
          }}
        >
          <AppBar color="transparent" position="sticky" elevation={0}>
            <Box className={styles.appbar}>
              <Image src={BrandLogo} alt={"Brand Logo"} />
              {!sm && <Box sx={{ flexGrow: 1 }} />}
              {!sm && <SignInOptions providers={providers} />}
            </Box>
          </AppBar>

          <Box ml={sm ? 0 : 4} className={styles.main}>
            <Box mt={4}>
              <Typography
                variant={sm ? "h2" : "h1"}
                className={styles.title1}
                sx={{ lineHeight: "90%" }}
                textAlign={sm ? "center" : "initial"}
              >
                <strong>Face the fear of</strong>
              </Typography>
              <Typography
                variant={sm ? "h2" : "h1"}
                textAlign={sm ? "center" : "initial"}
                className={styles.title2}
              >
                <strong>confession.</strong>
              </Typography>
            </Box>

            <Paper elevation={6} className={styles.diduknow}>
              <Container
                sx={{ height: "100%", overflow: "auto", color: "#70161E" }}
              >
                <Typography variant={sm ? "h6" : "h5"} gutterBottom mt={4}>
                  Did you Know?
                </Typography>

                <Typography variant={sm ? "body1" : "h6"} paragraph>
                  {quote}
                </Typography>
              </Container>
            </Paper>

            {sm && (
              <Box
                mt={16}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SignInOptions providers={providers} />
              </Box>
            )}
          </Box>

          {!sm && (
            <Box display="flex" className={styles.heartContainers}>
              <Box className={styles.heart} />
              <Box className={styles.heart} />
              <Box className={styles.heart} />

              <>
                <Box className={styles.heart} />
                <Box className={styles.heart} />
                <Box className={styles.heart} />
                <Box className={styles.heart} />
                <Box className={styles.heart} />
                <Box className={styles.heart} />
                <Box className={styles.heart} />
              </>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return {
    props: { providers, session },
  };
};

export default SignIn;
