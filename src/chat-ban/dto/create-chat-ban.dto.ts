import { ApiProperty } from "@nestjs/swagger";

export class CreateChatBanDto {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    charId: string;

    @ApiProperty()
    bannedBy: string;

    @ApiProperty()
    banReason: string;
}
