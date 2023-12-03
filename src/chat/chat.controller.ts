import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { Room } from 'src/schemas/room.schema';
import { SendMessageDto } from './dto/send-message.dto';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create-room')
  async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<any> {
    return this.chatService.createRoom(createRoomDto);
  }

  @Post('join-room')
  async joinRoom(@GetUser() user: any, @Body() message: any): Promise<any> {
    return this.chatService.joinRoom(user.user_id, message.roomId);
  }

  @Get('room')
  async findAll(): Promise<any> {
    return this.chatService.findAllRoom();
  }

  @Get('room/:id')
  async findById(@Param('id') id: string): Promise<Room> {
    return this.chatService.findRoomById(id);
  }

  @Post('send-message')
  async sendMessage(
    @GetUser() user: any,
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<any> {
    return this.chatService.sendMessage(user.user_id, sendMessageDto);
  }

  @Get('get-message')
  async getMessage(
    @Query('roomId') roomId?: string,
    @Query('toId') toId?: string,
  ): Promise<any> {
    return this.chatService.getMessage(roomId, toId);
  }
}
