import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateMediaDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  description?: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
