export const getVideoSuffix = (video: string) => {
  if (video === "") {
    return video;
  }
  if (video.split("watch?v=").length < 2) {
    return "";
  }
  return video.split("watch?v=")[1];
};
