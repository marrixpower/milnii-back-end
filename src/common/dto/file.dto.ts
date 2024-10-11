import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  creationDate: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  duration: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  extension: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  height: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  size: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  width: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  originalFilename: string;

  @IsString()
  @IsOptional()
  filename: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;
}
