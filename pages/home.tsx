import styles from "../styles/Home.module.css";
import {
  Box,
  TextField,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  styled,
  inputLabelClasses,
  CircularProgress,
  Autocomplete,
  AutocompleteInputChangeReason,
  outlinedInputClasses,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { SyntheticEvent, useState } from "react";
import useSearch from "../utils/Hooks/useSearch";
import BrandLogo from "../public/brandlogo.png";
import { User } from "../types/models";
import NoUserImg from "../public/anonyUser.png";
import Link from "next/link";

const StyledAutoComplete = styled(Autocomplete)({
  [`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
    borderColor: "#F6F7F8",
  },
  [`&:hover .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: "#70161E",
    },
  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
    {
      borderColor: "#F6F7F8",
    },
  [`& .${outlinedInputClasses.input}`]: {
    color: "#F6F7F8",
  },
  [`& .${inputLabelClasses.outlined}`]: {
    color: "#F6F7F8",
  },
  [`&:hover .${inputLabelClasses.outlined}`]: {
    color: "#70161E",
  },
  [`& .${inputLabelClasses.outlined}.${inputLabelClasses.focused}`]: {
    color: "#F6F7F8",
  },
});

const Home = () => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("md"));
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { loading, data } = useSearch(search, searchOpen);

  const handleSearchOpen = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearchInput = (
    e: SyntheticEvent<Element, Event>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    setSearch(value);
  };

  return (
    <>
      <Head>
        <title>AnonyLove | Home</title>
        <meta name="description" content="Face the Fear of Confession" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className={styles.homeContainer}>
        <Box mt={4}>
          <Image src={BrandLogo} alt="LOGO" width={304} height={192} />
        </Box>
        <StyledAutoComplete
          id="anonylove-searchbar"
          sx={{ width: "80%", color: "white", mt: 4, mb: 4 }}
          open={searchOpen}
          onOpen={handleSearchOpen}
          onClose={handleSearchOpen}
          inputValue={search}
          onInputChange={handleSearchInput}
          filterOptions={(x) => x}
          options={
            (data?.searchUser as User[]) ? (data?.searchUser as User[]) : []
          }
          loading={loading}
          getOptionLabel={(option) => {
            return (option as User).name;
          }}
          isOptionEqualToValue={(option, value) =>
            (option as User).name === (value as User).name
          }
          renderOption={(props, option) => (
            <Link href={`/profile/${(option as User).name}`} passHref>
              <a>
                <ListItem {...props}>
                  <ListItemAvatar>
                    <Image
                      src={(option as User).image ?? NoUserImg}
                      alt="PFP"
                      width={40}
                      height={40}
                      className={styles.avatar}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={(option as User).name}
                    secondary="Heya!"
                  />
                </ListItem>
              </a>
            </Link>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for a person to confess to..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        <Box width="80%">
          <Typography variant={sm ? "body1" : "h5"} textAlign="center">
            The way to confess to someone is to drop everything you&apos;ve
            prepared for and just go do it. Fuck the script, fuck the response,
            fuck the expectations in your conversations, fuck your insecurities,
            fuck your shame, the only thing you should think about is what is
            true and immediate. You confess, and what happens next is your
            responsibility. Just go for it :D
          </Typography>

          <Typography variant={sm ? "body2" : "h6"} textAlign="center" mt={8}>
            &quot;If you&apos;re stuck on a problem, don&apos;t sit there and
            think about it; just start working on it. Even if you don&apos;t
            know what you&apos;re doing, the simple act of working on it will
            eventually cause the right ideas to show up in your head.&quot;
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Home;
