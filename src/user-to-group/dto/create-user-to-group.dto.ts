import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class CreateUserToGroupDto {
    // @Transform(({ value }) => value, { toClassOnly: true })
    @ApiProperty()
    userId: string;
    
    // @Transform(({ value }) => value, { toClassOnly: true })
    @ApiProperty()
    chatId: string;
    
    @ApiProperty()
    role: string;
}
