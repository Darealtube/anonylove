import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Cropper } from "react-cropper";
import { getImages } from "../utils/Media/getImage";
import "cropperjs/dist/cropper.css";
import NoBg from "../public/nobg.png";

type CropperType = {
  open: boolean;
  handler: (image: string) => void;
  type: "cover" | "pfp";
};

const pfpCropBox = { width: 160, height: 160, aspectRatio: 1 };
const coverCropBox = { width: 1280, height: 304, aspectRatio: 1280 / 304 };

const ImageCropper = ({
  cropper: { open, handler, type },
  handleClose,
}: {
  cropper: CropperType;
  handleClose: () => void;
}) => {
  const [cropperElement, setCropperElement] = useState<Cropper | null>(null);
  const [tempImg, setTempImg] = useState<string | undefined>(NoBg.src);
  const cropSize = type === "pfp" ? pfpCropBox : coverCropBox;

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ((e.currentTarget.files as FileList)?.length != 0) {
      getImages((e.currentTarget.files as FileList)[0], (result) => {
        setTempImg(result);
      });
    }
  };

  const handleCrop = () => {
    if (cropperElement) {
      handler(cropperElement.getCroppedCanvas().toDataURL());
    }
    handleClose();
    setTempImg(NoBg.src);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Typography>Edit Photo</Typography>
        </DialogTitle>

        <DialogContent sx={{ overflow: "hidden", maxWidth: "100%" }}>
          <input type="file" accept="image/*" onChange={handlePhoto} />
          <Cropper
            style={{ height: 400, width: "100%" }}
            src={tempImg}
            aspectRatio={cropSize.aspectRatio}
            minCropBoxHeight={cropSize.height}
            minCropBoxWidth={cropSize.width}
            cropBoxResizable={false}
            cropBoxMovable={false}
            viewMode={1}
            dragMode={"move"}
            draggable={false}
            toggleDragModeOnDblclick={false}
            background={false}
            responsive={true}
            checkOrientation={false}
            onInitialized={(instance) => {
              setCropperElement(instance);
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCrop}>Crop and Finish</Button>
        </DialogActions>
      </Dialog>

      {type === "pfp" && (
        <style>
          {`
            .cropper-crop-box,
            .cropper-view-box {
              border-radius: 50%; 
            }

            .cropper-view-box {
              box-shadow: 0 0 0 1px #39f;
              outline: 0;
            }
          `}
        </style>
      )}
    </>
  );
};

export default ImageCropper;
