import { IsString, IsInt, IsUrl, IsUUID, IsEnum } from 'class-validator';

export enum MatchType {
  id = 'id',
  class = 'class',
}

export class CreateEventLogDto {
  @IsString()
  key: string;

  @IsInt()
  timestamp: number;

  @IsUrl()
  url: string;

  @IsUUID()
  sessionId: string;

  @IsEnum(MatchType)
  matchType: MatchType;

  @IsUUID()
  eventId: string;
}
