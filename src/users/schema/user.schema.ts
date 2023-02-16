import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;
@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, default: null })
  lastName: string;
  @Prop({ type: String, required: true, unique: true })
  email: string;
  @Prop({ type: String, default: null })
  password: string;
  @Prop({ type: Boolean, default: false })
  isEmailVerified: boolean;

  @Prop({ type: String, default: 'ADMIN', enum: ['USER', 'ADMIN'] })
  role: 'USER' | 'ADMIN';
  @Prop({ type: Types.ObjectId, default: null, ref: 'teams' })
  team: Types.ObjectId;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 });
UserSchema.index({ _id: 1, team: 1 });

export { UserSchema };
