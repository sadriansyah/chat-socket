import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Room } from './room.schema';
import { User } from './user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  content: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;

  @Prop({ type: Types.ObjectId, ref: 'Room', default: null })
  roomId: Types.ObjectId | Room | null;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  senderId: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  toId: Types.ObjectId | User | null;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
