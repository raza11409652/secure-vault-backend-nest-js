import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type SecureShareDocument = SecureShare & Document;
@Schema({ collection: 'secure_shares', timestamps: true })
export class SecureShare {
  @Prop({ type: String, required: true })
  content: string;
  @Prop({ type: Types.ObjectId, default: null, ref: 'users' })
  user: Types.ObjectId;
  @Prop({ type: String, required: true })
  key: string;
  @Prop({ type: String, required: true })
  keyIV: string;
  @Prop({ type: String, required: true, unique: true })
  findingKey: string;
  @Prop({ type: String, default: null })
  url: string;
  @Prop({ type: Number, default: 1 })
  maxViewAllowed: number;
  @Prop({ type: Number, default: 0 })
  viewCount: number;
}
const SecureShareSchema = SchemaFactory.createForClass(SecureShare);
SecureShareSchema.index({ findingKey: 1 });
SecureShareSchema.index({ user: 1 });

export { SecureShareSchema };
