import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate } from 'class-validator';

export type BaseEntityDocument = BaseEntity & Document;

@Schema()
export class BaseEntity {
  @ApiProperty()
  @IsDate()
  @Expose({ name: 'create_at' })
  @Prop({
    required: false,
    default: null,
  })
  createAt: Date;

  @ApiProperty()
  @IsDate()
  @Expose({ name: 'update_at' })
  @Prop({
    required: false,
    default: new Date(),
  })
  updateAt: Date;

  @ApiProperty()
  @IsDate()
  @Expose({ name: 'delete_at' })
  @Prop({
    required: false,
    default: null,
  })
  deleteAt: Date;
}

export const BaseEntitySchema = SchemaFactory.createForClass(BaseEntity);
