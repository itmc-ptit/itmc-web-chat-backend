import { BaseEntity } from 'src/helper/base-entity.model';
import { NotificationType } from './notification-type.enum';
import { Prop } from '@nestjs/mongoose';

export class Notification extends BaseEntity {
  @Prop({
    required: true,
    unique: false,
  })
  type: NotificationType;

  @Prop({
    required: true,
    unique: false,
  })
  message: string;
}
