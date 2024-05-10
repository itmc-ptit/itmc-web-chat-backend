import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate } from 'class-validator';

export type BaseEntityDocument = BaseEntity & Document;

@Schema()
export class BaseEntity {
  @ApiProperty()
  @IsDate()
  @Prop({ required: false, default: null })
  @Expose({ name: 'create_at' })
  createAt: Date;

  @ApiProperty()
  @IsDate()
  @Prop({ required: false, default: new Date() })
  @Expose({ name: 'update_at' })
  updateAt: Date;

  @ApiProperty()
  @IsDate()
  @Prop({ required: false, default: null })
  @Expose({ name: 'delete_at' })
  deleteAt: Date;
}

export const BaseEntitySchema = SchemaFactory.createForClass(BaseEntity);
