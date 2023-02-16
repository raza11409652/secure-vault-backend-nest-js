import { Prop, Schema } from '@nestjs/mongoose';
// import { Types } from 'mongoose';
@Schema({ collection: 'auth_session', timestamps: true })
export class AuthSessionSchema {
  @Prop({ type: String, default: null })
  sessionKey: string;
  //   @Prop({ type: String, default: null })
  // //   user: Types.Obje;
}
