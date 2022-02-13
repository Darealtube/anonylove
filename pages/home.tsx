import {
  Box,
  TextField,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  styled,
  inputLabelClasses,
  outlinedInputClasses,
} from "@mui/material";
import Head from "next/head";
import AppWrap from "../Components/AppWrap";

const StyledTextField = styled(TextField)({
  [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: "#F6F7F8"
  },
  [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: "#70161E"
  },
  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: "#F6F7F8"
  },
  [`& .${inputLabelClasses.outlined}`]: {
    color: "#F6F7F8"
  },
  [`&:hover .${inputLabelClasses.outlined}`]: {
    color: "#70161E"
  },
  [`& .${inputLabelClasses.outlined}.${inputLabelClasses.focused}`]: {
    color: "#F6F7F8"
  }
});

const Home = () => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <>
      <Head>
        <title>AnonyLove | Home</title>
        <meta name="description" content="Face the Fear of Confession" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppWrap>
        <Container
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "auto",
            mb: 4,
          }}
        >
          <Typography variant={sm ? "h4" : "h1"} textAlign="center" mt={4}>
            AnonyLove
          </Typography>

          <StyledTextField
            id="search-users"
            label="Search a person to confess to..."
            variant="outlined"
            sx={{
              width: "80%",
              mt: 4,
              mb: 4,
              color: "white",
            }}
            inputProps={{ style: { color: "white" } }}
          />

          <Box width="80%">
            <Typography variant={sm ? "body1" : "h5"} textAlign="center">
              The way to confess to someone is to drop everything you&apos;ve
              prepared for and just go do it. Fuck the script, fuck the
              response, fuck the expectations in your conversations, fuck your
              insecurities, fuck your shame, the only thing you should think
              about is what is true and immediate. You confess, and what happens
              next is your responsibility. Just go for it :D
            </Typography>

            <Typography variant={sm ? "body2" : "h6"} textAlign="center" mt={8}>
              &quot;If you&apos;re stuck on a problem, don&apos;t sit there and
              think about it; just start working on it. Even if you don&apos;t
              know what you&apos;re doing, the simple act of working on it will
              eventually cause the right ideas to show up in your head.&quot;
            </Typography>
          </Box>
        </Container>
      </AppWrap>
    </>
  );
};

export default Home;
