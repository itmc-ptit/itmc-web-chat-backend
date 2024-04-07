import { ApiProperty } from "@nestjs/swagger";

export class UpdateChatBanDto {
    @ApiProperty()
    endAt: Date;
}
