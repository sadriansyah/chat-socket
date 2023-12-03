import { IsNotEmpty, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  content: string;

  @IsOptional()
  roomId: string;

  @IsOptional()
  toId: string;
}
