import { IsString, MinLength } from 'class-validator';

export class NewMessaggeDto {
  @IsString()
  @MinLength(1)
  messagge: string;
}
