import styled from "@emotion/styled";
import {
  TextField,
  outlinedInputClasses,
  inputLabelClasses,
} from "@mui/material";

export const AnonyTextField = styled(TextField)({
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
