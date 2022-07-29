export const encrypt = (info: any) =>
  Buffer.from(info.toString()).toString("base64");
