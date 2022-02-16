import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { createTheme, ThemeProvider } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../apollo/apolloClient";

const theme = createTheme({
  typography: {
    fontFamily: "Lora, serif",
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const apolloClient = useApollo(pageProps);
  return (
    <>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </ThemeProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
