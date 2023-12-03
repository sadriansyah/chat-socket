import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/guard/ws-jwt.guard';
import { ChatService } from './chat.service';

@UseGuards(WsJwtGuard)
@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('new-room')
  async handleCreateRoom(@MessageBody() message: any): Promise<void> {
    const room = await this.chatService.createRoom(message);
    this.server.emit('room', {
      roomId: room.id,
      roomName: room.name,
    });
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() message: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = client;
    const room = await this.chatService.joinRoom(user.id, message.room);
    client.join(room.id);
    this.server.emit('room', `${user.username} joined ${room.name}`);
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody() message: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = client;
    const { content, roomId } = message;
    const newMessage = await this.chatService.sendMessage(user.id, {
      content: content,
      roomId: roomId,
      toId: null,
    });

    this.server.emit('message', newMessage);
  }

  @SubscribeMessage('get-message')
  async handleGetMessage(@MessageBody() message: any): Promise<any> {
    const { roomId, toId } = message;
    const currentMessage = await this.chatService.getMessage(roomId, toId);
    this.server.emit('message', currentMessage);
  }

  @SubscribeMessage('send-private')
  async handlePrivateMessage(
    @MessageBody() message: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { user } = client;
    const { content, toId } = message;
    const newMessage = await this.chatService.sendMessage(user.id, {
      content: content,
      roomId: null,
      toId: toId,
    });

    this.server.emit('message', newMessage);
  }
}
