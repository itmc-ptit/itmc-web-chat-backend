import { IsString } from '@nestjs/class-validator';

export class CreateUserToGroupDto {
  @IsString()
  readonly groupChatId: string;

  @IsString()
  readonly userId: string;
}