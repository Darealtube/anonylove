import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { createTheme, ThemeProvider } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../apollo/apolloClient";
import { useRouter } from "next/router";
import AppWrap from "../Components/Wrapper/AppWrap";
import TitleWrap from "../Components/TitleWrap";
import ErrorProvider from "../Components/ErrorProvider";

// YOU CAN MODIFY THE SITE'S FONT HERE
const theme = createTheme({
  typography: {
    fontFamily: "Lora, serif",
  },
});


// THE PROVIDERS YOU SEE HERE ARE FOR THE DIFFERENT FUNCTIONS THE WHOLE WEBSITE HAS

// APOLLO PROVIDER: PROVIDES THE WHOLE SITE WITH THE INITIALIZED APOLLO CLIENT

// THEME PROVIDER: PROVIDES DESIGN OUT OF THE BOX FROM MATERIAL UI

// SESSION PROVIDER: PROVIDES THE SESSION VALUE PASSED IN THE SSR PROPS IN SOME PAGES AND 
// PRESERVES IT FOR OTHER PAGES TO AVOID MAKING A REQUEST AGAIN TOO SOON

// ERROR PROVIDER: PROVIDES THE ERROR SNACKBAR AND HANDLES THE ERROR STATE OF THE WHOLE WEBSITE

// TITLEWRAP: PROVIDES THE PAGE TITLE OF THE SITE (ALSO HANDLES THE CHANGING TITLE WHEN THERE IS A NEW MESSAGE)

// APPWRAP: THE SIDEBAR AND THE DESIGN OF THE MAIN PAGES (EXCEPT FOR THE LOGIN PAGE, HENCE THE CONDITIONAL ROUTING)

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
                  <ErrorProvider>
                    <Component {...pageProps} />
                  </ErrorProvider>
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
