import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Cemetery {
  @Prop({ required: true })
  name: string;

  @Prop()
  address?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  country: string;

  @Prop({ type: { lat: Number, lng: Number }, required: true, _id: false })
  coordinates: {
    lat: number;
    lng: number;
  };
}
