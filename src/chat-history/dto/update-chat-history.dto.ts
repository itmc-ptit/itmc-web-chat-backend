import { ApiProperty } from "@nestjs/swagger";

export class UpdateChatHistoryDto {
    @ApiProperty()
    message: string;

    @ApiProperty()
    attachment: string;
}
