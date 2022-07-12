import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { createTheme, ThemeProvider } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../apollo/apolloClient";
import { useRouter } from "next/router";
import AppWrap from "../Components/Wrapper/AppWrap";
import TitleWrap from "../Components/TitleWrap";

const theme = createTheme({
  typography: {
    fontFamily: "Lora, serif",
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const apolloClient = useApollo(pageProps);
  const router = useRouter();
  return (
    <>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <SessionProvider session={session}>
            {router.route === "/" ? (
              <Component {...pageProps} />
            ) : (
              <TitleWrap>
                <AppWrap>
                  <Component {...pageProps} />
                </AppWrap>
              </TitleWrap>
            )}
          </SessionProvider>
        </ThemeProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
