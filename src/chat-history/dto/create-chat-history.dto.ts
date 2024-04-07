import { ApiProperty } from "@nestjs/swagger";

export class CreateChatHistoryDto {
    @ApiProperty()
    userId: string;
    
    @ApiProperty()
    chatId: string;
    
    @ApiProperty()
    message: string;

    @ApiProperty()
    attachment: string;
}
