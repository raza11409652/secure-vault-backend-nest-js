import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
export type TeamInviteDocument = TeamInvite & Document;
@Schema({ collection: 'team_invite', timestamps: true })
export class TeamInvite {
  @Prop({ type: Types.ObjectId, required: true, ref: 'users' })
  user: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, ref: 'teams' })
  team: Types.ObjectId;
  @Prop({ type: String, default: 'CREATED', enum: ['CREATED', 'USED'] })
  status: 'CREATED' | 'USED';
}
const TeamInviteSchema = SchemaFactory.createForClass(TeamInvite);
export { TeamInviteSchema };
