import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateUserToGroupDto {
    @ApiProperty()
    role: string;

    @ApiProperty()
    isBlocked: boolean;
}
