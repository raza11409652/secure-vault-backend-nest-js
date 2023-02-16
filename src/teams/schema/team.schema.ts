import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type TeamDocument = Teams & Document;
@Schema({ collection: 'teams', timestamps: true })
export class Teams {
  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  createdBy: Types.ObjectId;
  @Prop({ type: String, default: null })
  masterPassword: string;
  @Prop({ type: String, default: null })
  name: string;
  @Prop({ type: Boolean, default: true })
  active: boolean;
}

const TeamSchema = SchemaFactory.createForClass(Teams);
TeamSchema.index({ createdBy: 1 });
export { TeamSchema };
