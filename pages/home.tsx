import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  AutocompleteInputChangeReason,
} from "@mui/material";
import Image from "next/image";
import { SyntheticEvent, useState } from "react";
import useSearch from "../utils/Hooks/useSearch";
import BrandLogo from "../public/brandlogo.png";
import { User } from "../types/models";
import { AnonyHome } from "../Components/Style/Home/AnonyHome";
import AnonySearchBar from "../Components/Style/Home/AnonySearchBar";
import dynamic from "next/dynamic";

const SearchOptions = dynamic(() => import("../Components/Home/SearchOptions"));

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
      <AnonyHome>
        <Box mt={4}>
          <Image src={BrandLogo} alt="LOGO" width={304} height={192} />
        </Box>
        <AnonySearchBar
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
            <SearchOptions props={props} option={option} />
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
      </AnonyHome>
    </>
  );
};

export default Home;
