import { CreateEventDto } from './create-event.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  // Additional properties or methods can be added here if needed
}
