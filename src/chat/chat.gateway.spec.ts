import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { JwtModule } from '@nestjs/jwt';
import { WsJwtGuard } from '../guard/ws-jwt.guard';

jest.mock('./chat.service');

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let chatService: ChatService;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway, ChatService, WsJwtGuard],
      imports: [
        JwtModule.register({
          secret: 'chat-key',
          signOptions: { expiresIn: '1h' },
        }),
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    chatService = module.get<ChatService>(ChatService);

    server = {
      emit: jest.fn(),
      to: jest.fn(() => server),
    } as any;

    gateway.server = server;
  });

  describe('handleCreateRoom', () => {
    it('should handle creating a room', async () => {
      const createRoomDto = {};
      const room = { id: 'roomId', name: 'Test Room' };
      jest.spyOn(chatService, 'createRoom').mockResolvedValue(room);

      await gateway.handleCreateRoom(createRoomDto);

      expect(server.emit).toHaveBeenCalledWith('room', {
        roomId: room.id,
        roomName: room.name,
      });
    });
  });

  describe('handleJoinRoom', () => {
    it('should handle joining a room', async () => {
      const user = { id: 'userId', username: 'testUser' };
      const message = { room: 'roomId' };
      const room = { id: 'roomId', name: 'Test Room' };
      jest.spyOn(chatService, 'joinRoom').mockResolvedValue(room);

      await gateway.handleJoinRoom(message, { user } as unknown as Socket);
      expect(server.emit).toHaveBeenCalledWith(
        'room',
        `${user.username} joined ${room.name}`,
      );
    });
  });

  describe('handleMessage', () => {
    it('should handle sending a message', async () => {
      const user = { id: 'userId' };
      const message = { content: 'Hello', roomId: 'roomId' };
      const newMessage = {};
      jest.spyOn(chatService, 'sendMessage').mockResolvedValue(newMessage);

      await gateway.handleMessage(message, { user } as unknown as Socket);

      expect(server.emit).toHaveBeenCalledWith('message', newMessage);
    });
  });

  describe('handleGetMessage', () => {
    it('should handle getting messages', async () => {
      const message = { roomId: 'roomId', toId: 'toUserId' };
      const currentMessage = {};
      jest.spyOn(chatService, 'getMessage').mockResolvedValue(currentMessage);

      await gateway.handleGetMessage(message);

      expect(server.emit).toHaveBeenCalledWith('message', currentMessage);
    });
  });

  describe('handlePrivateMessage', () => {
    it('should handle sending a private message', async () => {
      const user = { id: 'userId' };
      const message = { content: 'Hello', toId: 'toUserId' };
      const newMessage = {};
      jest.spyOn(chatService, 'sendMessage').mockResolvedValue(newMessage);

      await gateway.handlePrivateMessage(message, {
        user,
      } as unknown as Socket);

      expect(server.emit).toHaveBeenCalledWith('message', newMessage);
    });
  });
});
