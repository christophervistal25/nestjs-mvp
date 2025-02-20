import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsBoolean,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateSeoConfigDto {
  @ApiProperty({ description: 'Tenant ID' })
  @IsUUID()
  @IsNotEmpty()
  tenant_id: string;

  @ApiProperty({ description: 'Meta title for SEO' })
  @IsString()
  @IsNotEmpty()
  meta_title: string;

  @ApiProperty({ description: 'Meta description for SEO' })
  @IsString()
  @IsNotEmpty()
  meta_description: string;

  @ApiProperty({ description: 'Keywords for SEO', type: [String] })
  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @ApiProperty({
    description: 'Whether to allow search engine indexing and following',
  })
  @IsBoolean()
  @IsOptional()
  index_follow?: boolean;

  @ApiProperty({
    description: 'Open Graph image URL',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  og_image_url?: string | null;

  @ApiProperty({
    description: 'Canonical URL',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  canonical_url?: string | null;
}
