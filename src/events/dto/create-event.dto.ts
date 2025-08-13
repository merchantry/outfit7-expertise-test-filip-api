import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayMaxSize,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum EventType {
  crosspromo = 'crosspromo',
  liveops = 'liveops',
  app = 'app',
  ads = 'ads',
}

export class CreateEventDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(10)
  priority: number;

  @IsEnum(EventType)
  type: EventType;

  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  tags: string[];
}
