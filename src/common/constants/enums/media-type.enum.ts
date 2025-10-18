export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
}

export const getMediaType = (mimeType: string): MediaType => {
  if (mimeType.startsWith("image/")) return MediaType.IMAGE;
  if (mimeType.startsWith("video/")) return MediaType.VIDEO;
  if (mimeType.startsWith("audio/")) return MediaType.AUDIO;
  return MediaType.DOCUMENT;
};
