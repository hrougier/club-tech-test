import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMediaDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(512)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  description?: string;
}
