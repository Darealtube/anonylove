import { useMediaQuery, useTheme, Grid, Container } from "@mui/material";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { ReactNode, useState } from "react";
import ChatList from "./ChatList";
import styles from "../../styles/AppWrap.module.css";
import { useQuery } from "@apollo/client";
import { GET_USER_CONFESSION_REQUESTS } from "../../apollo/query/requestQuery";

const MobileChatList = dynamic(() => import("./MobileChatList"));

const AppWrap = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [chatOpen, setChatOpen] = useState(false);
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("md"));
  const { data: query } = useQuery(GET_USER_CONFESSION_REQUESTS, {
    variables: {
      limit: 4,
      name: session?.user?.name,
    },
    skip: !session,
  });

  const handleChatOpen = () => {
    setChatOpen(!chatOpen);
  };

  return (
    <Grid
      container
      sx={{ height: "100vh", color: "black" }}
      className={styles.mainmenu}
    >
      {!sm ? (
        <Grid
          item
          md={4}
          sx={{
            backgroundColor: "#F6F7F8",
            height: "100%",
            overflow: "auto",
          }}
        >
          <Container>
            <ChatList session={session} />
          </Container>
        </Grid>
      ) : (
        <MobileChatList
          open={chatOpen}
          handleChatList={handleChatOpen}
          session={session}
        />
      )}
      <Grid
        item
        xs={12}
        md={8}
        sx={{ color: "white", height: "100%", overflow: "auto" }}
      >
        {children}
      </Grid>
    </Grid>
  );
};

export default AppWrap;
