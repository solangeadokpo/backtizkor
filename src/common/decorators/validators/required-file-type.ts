import { BadRequestException } from "@nestjs/common";
import { MediaType } from "src/common/constants/enums/media-type.enum";

export function isRequiredFileType(...requiredTypes: MediaType[]) {
  return (req: any, file: Express.Multer.File, callback: Function) => {
    const patterns: { [key in MediaType]: RegExp } = {
      [MediaType.IMAGE]: /^image\/(jpeg|png|webp|gif)$/,
      [MediaType.VIDEO]: /^video\/(mp4|quicktime|webm|x-msvideo)$/,
      [MediaType.AUDIO]: /^audio\/(mpeg|mp3|wav)$/,
      [MediaType.DOCUMENT]: /^application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet)$/,
    };

    const matched = requiredTypes.some((type) => {
      const pattern = patterns[type];
      return pattern && file.mimetype.match(pattern);
    });

    if (!matched) {
      return callback(
        new BadRequestException(
          `Only ${requiredTypes.join(", ")} files are allowed`
        ),
        false
      );
    }
    callback(null, true);
  };
}
