import { Paper, Container, Box, Typography, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const ReplyBar = ({
  text,
  handleClose,
}: {
  text: string;
  handleClose: () => void;
}) => {
  return (
    <>
      <Paper square>
        <Container sx={{ display: "flex", mt: 2, mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "95%",
              flexGrow: 1,
            }}
          >
            <Typography>Replying to:</Typography>
            <Typography
              variant="body1"
              textOverflow={"ellipsis"}
              noWrap
              sx={{ overflow: "hidden" }}
            >
              {text}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} sx={{ width: "5%" }}>
            <ClearIcon />
          </IconButton>
        </Container>
      </Paper>
    </>
  );
};

export default ReplyBar;
