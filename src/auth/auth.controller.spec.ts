import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

jest.mock('../user/user.service');
jest.mock('./auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UserService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'user',
        password: '12345678',
      };

      const expectedUser = {
        username: 'user',
      };

      jest.spyOn(userService, 'create').mockResolvedValue(expectedUser);

      const result = await authController.register(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('login', () => {
    it('should log in a user', async () => {
      const loginDto: LoginDto = {
        username: 'user',
        password: '12345678',
      };

      const expectedToken = 'mytoken';

      jest.spyOn(authService, 'login').mockResolvedValue(expectedToken);

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedToken);
    });
  });
});
