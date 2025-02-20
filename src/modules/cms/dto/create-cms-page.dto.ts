import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateCmsPageDto {
  @ApiProperty({ description: 'URL friendly identifier' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'Page title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Page content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Tenant ID for multi-tenancy support',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  tenant_id?: string;
}
