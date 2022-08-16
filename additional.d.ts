// Handle type error in importing mp3 files

declare module "*.mp3" {
  const src: string;
  export default src;
}
