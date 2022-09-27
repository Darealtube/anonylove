// UPLOADS IMAGES ALONGSIDE WITH THE SIGNATURE TO THE MEDIA CDN (CLOUDINARY)
export const uploadImage = async (image: File | string) => {
  let url: string = "";
  const data = new FormData();
  const sign = await getSignature(); // Get returned sign and timestamp

  if (sign) {
    const { signature, timestamp } = sign;
    data.append("file", image);
    data.append("signature", signature); // Signature
    data.append("timestamp", timestamp); // Timestamp
    data.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY as string);

    await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        url = data.secure_url;
      })
      .catch((err: Error) => console.log(err.message));
  } else {
    return url;
  }
  return url;
};

const getSignature = async () => {
  //Call API which handles the signature and timestamp
  const response = await fetch("/api/signMedia")
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const { signature, timestamp } = data;
      return { signature, timestamp };
    })
    .catch(() => {
      return null;
    });
  return response;
};
