import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from '../schemas/auth.schema';
import { UserService } from '../user/user.service';
import { refreshTokenConfig } from '../config/jwt.config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<AuthDocument>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;
    const user = await this.userService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Username or password is wrong');
    }

    const accessToken = await this.createAccessToken(user._id, user.username);
    const refreshToken = await this.createRefreshToken(user._id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async createAccessToken(id: string, username: string): Promise<any> {
    const expiresIn = '1d';
    const accessToken = await this.jwtService.signAsync(
      { id, username },
      { expiresIn },
    );

    return accessToken;
  }

  async createRefreshToken(id: string): Promise<string> {
    const refreshToken = await this.configRefreshToken(
      id,
      +refreshTokenConfig.expiresIn,
    );
    const payload = {
      jid: refreshToken._id,
    };

    const refreshSign = await this.jwtService.signAsync(
      payload,
      refreshTokenConfig,
    );
    return refreshSign;
  }

  async configRefreshToken(userId: string, ttl: number) {
    const expiredAt = new Date();
    expiredAt.setTime(expiredAt.getTime() + ttl);

    const authSave = {
      userId: userId,
      isRevoked: false,
      expiredAt: expiredAt,
    };

    const create = new this.authModel(authSave);
    return await create.save();
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token is expired');
      } else {
        throw new InternalServerErrorException('Failed to decode token');
      }
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<any> {
    const payload = await this.decodeToken(refreshToken);
    const isRefreshToken = await this.authModel.findOne({ _id: payload.jid });
    if (isRefreshToken) {
      throw new UnauthorizedException('Refresh token is not found');
    }

    if (isRefreshToken.isRevoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    const user = await this.userService.findById(isRefreshToken.userId);

    const accessToken = await this.createAccessToken(
      isRefreshToken.userId,
      user.username,
    );

    return accessToken;
  }

  async revokeRefreshToken(id: string): Promise<any> {
    const refreshToken = await this.authModel.findOne({ _id: id });
    if (!refreshToken) {
      throw new NotFoundException('Refresh token is not found');
    }

    const payload = {
      userId: refreshToken.userId,
      isRevoked: true,
      expiredAt: refreshToken.expiredAt,
    };

    await this.authModel.findOneAndReplace({ _id: id }, payload, { new: true });
  }
}
