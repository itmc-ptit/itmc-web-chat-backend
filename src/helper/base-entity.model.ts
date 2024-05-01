import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export type BaseEntityDocument = BaseEntity & Document;

@Schema()
export class BaseEntity {
  @ApiProperty()
  @Prop({ required: false })
  @Expose({ name: 'create_at' })
  createAt: Date;

  @ApiProperty()
  @Prop({ required: false })
  @Expose({ name: 'update_at' })
  updateAt: Date;

  @ApiProperty()
  @Prop({ required: false })
  @Expose({ name: 'delete_at' })
  deleteAt: Date;
}

export const BaseEntitySchema = SchemaFactory.createForClass(BaseEntity);
