import { Type } from 'class-transformer';
import { IsInt, IsString, Length, Min } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(5)
  updateIntervalSeconds: number;
}
