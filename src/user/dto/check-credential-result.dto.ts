import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CheckCredentialsResultDto {
  @ApiProperty()
  @IsOptional()
  firebaseEmail?: boolean;

  @ApiProperty()
  @IsOptional()
  firebasePhone?: boolean;

  @ApiProperty()
  @IsOptional()
  localEmail?: boolean;

  @ApiProperty()
  @IsOptional()
  localPhone?: boolean;
}
