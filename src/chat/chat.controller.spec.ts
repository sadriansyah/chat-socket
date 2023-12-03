import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { Room } from '../schemas/room.schema';

jest.mock('./chat.service'); // Mock the ChatService

describe('ChatController', () => {
  let controller: ChatController;
  let chatService: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [ChatService],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
  });

  describe('createRoom', () => {
    it('should create a room', async () => {
      const createRoomDto: CreateRoomDto = { name: 'Test Room' };
      const expectedResult = {}; // Replace with the expected result from your service

      jest.spyOn(chatService, 'createRoom').mockResolvedValue(expectedResult);

      const result = await controller.createRoom(createRoomDto);

      expect(result).toBe(expectedResult);
    });
  });

  describe('joinRoom', () => {
    it('should join a room', async () => {
      const user = { user_id: 'userId' };
      const joinRoomDto = { roomId: 'roomId' };
      const expectedResult = {}; // Replace with the expected result from your service

      jest.spyOn(chatService, 'joinRoom').mockResolvedValue(expectedResult);

      const result = await controller.joinRoom(user, joinRoomDto);

      expect(result).toBe(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all rooms', async () => {
      const expectedResult = {};

      jest.spyOn(chatService, 'findAllRoom').mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toBe(expectedResult);
    });
  });

  describe('findById', () => {
    it('should return a room by ID', async () => {
      const roomId = 'roomId';
      const expectedResult: Room = {
        name: '',
        members: [],
      };

      jest.spyOn(chatService, 'findRoomById').mockResolvedValue(expectedResult);

      const result = await controller.findById(roomId);

      expect(result).toBe(expectedResult);
    });
  });

  describe('sendMessage', () => {
    it('should send a message', async () => {
      const user = { user_id: 'userId' };
      const sendMessageDto: SendMessageDto = {
        content: 'Hello',
        roomId: 'roomId',
        toId: 'toUserId',
      };
      const expectedResult = {};

      jest.spyOn(chatService, 'sendMessage').mockResolvedValue(expectedResult);

      const result = await controller.sendMessage(user, sendMessageDto);

      expect(result).toBe(expectedResult);
    });
  });

  describe('getMessage', () => {
    it('should get messages', async () => {
      const roomId = 'roomId';
      const toId = 'toUserId';
      const expectedResult = {};

      jest.spyOn(chatService, 'getMessage').mockResolvedValue(expectedResult);

      const result = await controller.getMessage(roomId, toId);

      expect(result).toBe(expectedResult);
    });
  });
});
