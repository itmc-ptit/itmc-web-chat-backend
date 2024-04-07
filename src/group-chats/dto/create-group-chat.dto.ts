import { ApiProperty } from "@nestjs/swagger";

export class CreateGroupChatDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    hostId: string;
    
    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
