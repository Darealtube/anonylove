import {
  Container,
  Box,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

const LinkTree = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {xs ? (
          <>
            <IconButton sx={{ mt: 2, color: "#284B63" }}>
              <FacebookIcon />
            </IconButton>
            <IconButton sx={{ mt: 2, color: "#0075C4" }}>
              <TwitterIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Button
              sx={{ mt: 2, width: "40%" }}
              className="fbbutton"
              startIcon={<FacebookIcon />}
            >
              Facebook
            </Button>
            <Button
              sx={{ mt: 2, width: "40%" }}
              className="twtbutton"
              startIcon={<TwitterIcon />}
            >
              Twitter
            </Button>
          </>
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
        {xs ? (
          <>
            <IconButton sx={{ mt: 2, color: "#F397D6" }}>
              <InstagramIcon />
            </IconButton>
            <IconButton sx={{ mt: 2, color: "#EAC435" }}>
              <ChatBubbleIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Button
              sx={{ mt: 2, width: "40%" }}
              className="instabutton"
              startIcon={<InstagramIcon />}
            >
              Instagram
            </Button>
            <Button
              sx={{ mt: 2, width: "40%" }}
              className="snapbutton"
              startIcon={<ChatBubbleIcon />}
            >
              Snapshot
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default LinkTree;
