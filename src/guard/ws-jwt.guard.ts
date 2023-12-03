import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.query.token;
    const secret = client.handshake.query.secret;
    try {
      const decoded = this.jwtService.verify(token, {
        secret: secret,
      });
      client.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
