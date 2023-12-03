import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuthDocument = Auth & Document;

@Schema()
export class Auth {
  @Prop()
  isRevoked: boolean;

  @Prop()
  expiredAt: Date;

  @Prop()
  userId: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
