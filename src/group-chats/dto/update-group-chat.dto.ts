import { ApiProperty } from "@nestjs/swagger";

export class UpdateGroupChatDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    updatedAt: Date;
}
