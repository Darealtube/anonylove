// ENCRYPTS THE INFO PASSED IN THE HEADERS (LIKE THE AUTH HEADER IN APOLLO HTTP REQUEST)
export const encrypt = (info: any) =>
  Buffer.from(info.toString()).toString("base64");
