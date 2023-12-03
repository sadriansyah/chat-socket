import { JwtModuleAsyncOptions, JwtSignOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: async () => ({
    secret: process.env.SECRET_KEY,
    signOptions: {
      expiresIn: 60,
    },
  }),
};

export const refreshTokenConfig: JwtSignOptions = {
  expiresIn: 3600 * 24,
};
