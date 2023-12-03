import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from '../schemas/room.schema';
import { Message } from '../schemas/message.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto): Promise<any> {
    const room = new this.roomModel(createRoomDto);
    return await room.save();
  }

  async joinRoom(userId: any, roomId: string): Promise<any> {
    const room = await this.roomModel.findById(roomId);

    if (!room) {
      return new NotFoundException('room ID not found');
    }

    const members = room.members;

    if (!members.includes(userId)) {
      members.push(userId);
      room.members = members;
      return room.save();
    }

    return {
      message: 'User is already in this room',
      roomId: room.id,
      name: room.name,
    };
  }

  async findAllRoom(): Promise<any> {
    return this.roomModel.find().populate('members').exec();
  }

  async findRoomById(id: string): Promise<Room> {
    return await this.roomModel.findById(id).populate('members');
  }

  async sendMessage(userId: any, sendMessageDto: SendMessageDto): Promise<any> {
    const payload = {
      senderId: userId,
      ...sendMessageDto,
    };
    const message = new this.messageModel(payload);
    await message.save();

    await message.populate('senderId roomId toId');

    return message;
  }

  async getMessage(roomId: string = null, toId: string = null): Promise<any> {
    const query = {};
    if (roomId != null) {
      query['roomId'] = roomId;
    }

    if (toId != null) {
      query['toId'] = toId;
    }

    return await this.messageModel
      .find(query)
      .sort({ timestamp: 'desc' })
      .populate('roomId')
      .populate('senderId')
      .populate('toId')
      .exec();
  }
}
