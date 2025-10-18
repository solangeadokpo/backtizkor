import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MediaType } from "src/common/constants/enums/media-type.enum";

export interface MediaItemProps {
  url: string;
  type: MediaType;
}

@Schema()
export class MediaItem {
  @Prop({ required: true })
  url: string;

  @Prop({ type: String, enum: MediaType, required: true })
  type: MediaType;

  constructor(props: MediaItemProps) {
    this.url = props.url;
    this.type = props.type;
  }
}

export type MediaItemDocument = MediaItem & Document;
export const MediaItemSchema = SchemaFactory.createForClass(MediaItem);
