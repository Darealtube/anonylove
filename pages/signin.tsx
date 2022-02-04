import {
  Button,
  Grid,
  Paper,
  Typography,
  Container,
  Box,
  AppBar,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { BuiltInProviderType } from "next-auth/providers";
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from "next-auth/react";

type Providers = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

const SignIn = ({ providers }: { providers: Providers }) => {
  return (
    <Box sx={{ height: "100vh" }}>
      <AppBar color="transparent" position="sticky">
        <Box sx={{ display: "flex", mt: 2, mb: 2, ml: 8, mr: 8 }}>
          <Typography variant="h4">AnonyLove</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            {Object.values(providers).map((provider) => (
              <Button
                key={provider.name}
                onClick={() => signIn(provider.id)}
                variant="outlined"
                fullWidth
                sx={{ ml: 2 }}
              >
                Sign in with {provider.name}
              </Button>
            ))}
          </Box>
        </Box>
      </AppBar>

      <Grid container spacing={2} pl={4} pr={4}>
        <Grid xs={6}>
          <Container>
            <Typography variant="h1" mt={12}>
              Face the fear of confession.
            </Typography>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

/* 
    {Object.values(providers).map((provider) => (
                <Button
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  variant="contained"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Sign in with {provider.name}
                </Button>
              ))} 
*/

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

export default SignIn;
