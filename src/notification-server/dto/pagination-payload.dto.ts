import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationPayloadDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
