import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export interface SecureLock {
  encKey: string;
  password?: string;
  username?: string;
  notes?: string;
}
export type SecureVaultDocument = SecureVault & Document;
@Schema({ collection: 'secure_vault', timestamps: true })
export class SecureVault {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true, enum: ['PASSWORD', 'NOTES'] })
  type: 'PASSWORD' | 'NOTES';
  @Prop({ type: String, default: null })
  url: string;
  @Prop({ type: String, default: null })
  username: string;
  @Prop({ type: String, default: null })
  password: string;
  @Prop({ type: String, default: null })
  notes: string;
  @Prop({ type: String, default: null })
  fileAttachment: string;
  @Prop({ type: Types.ObjectId, default: null, ref: 'users' })
  user: Types.ObjectId;
  @Prop({ type: Types.ObjectId, default: null, ref: 'teams' })
  team: Types.ObjectId;
  @Prop({ type: Array<Types.ObjectId>, default: [], ref: 'users' })
  users: Array<Types.ObjectId>;
  @Prop({ type: Object, default: null })
  secureLock: SecureLock;
  @Prop({ type: Boolean, default: true })
  masterPasswordRequired: boolean;
  @Prop({ type: String, default: 'ALL' })
  visibility: 'ALL' | 'CUSTOM';
}

const SecureVaultSchema = SchemaFactory.createForClass(SecureVault);
SecureVaultSchema.index({ user: 1 });
SecureVaultSchema.index({ users: 1, visibility: 1, team: 1, user: 1 });

export { SecureVaultSchema };
