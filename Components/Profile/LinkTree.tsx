import {
  Container,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { AnonyButton } from "../Style/Global/AnonyButton";

const LinkTree = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Container sx={{ display: "flex", flexDirection: "column" }}>
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
            <AnonyButton
              sx={{ mt: 2, width: "40%" }}
              startIcon={<FacebookIcon />}
            >
              Facebook
            </AnonyButton>
            <AnonyButton
              sx={{ mt: 2, width: "40%" }}
              startIcon={<TwitterIcon />}
            >
              Twitter
            </AnonyButton>
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
            <AnonyButton
              sx={{ mt: 2, width: "40%" }}
              startIcon={<InstagramIcon />}
            >
              Instagram
            </AnonyButton>
            <AnonyButton
              sx={{ mt: 2, width: "40%" }}
              startIcon={<ChatBubbleIcon />}
            >
              Snapshot
            </AnonyButton>
          </>
        )}
      </Box>
    </Container>
  );
};

export default LinkTree;
