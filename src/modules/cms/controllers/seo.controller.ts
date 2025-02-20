import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeoService } from '../services/seo.service';
import { CreateSeoConfigDto } from '../dto/create-seo-config.dto';
import { UpdateSeoConfigDto } from '../dto/update-seo-config.dto';
import { SeoConfig } from '../entities/seo-config.entity';

@ApiTags('seo')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Post()
  @ApiOperation({ summary: 'Create SEO configuration for a tenant' })
  @ApiResponse({ status: 201, type: SeoConfig })
  create(@Body() createSeoConfigDto: CreateSeoConfigDto): Promise<SeoConfig> {
    return this.seoService.create(createSeoConfigDto);
  }

  @Get(':tenant_id')
  @ApiOperation({ summary: 'Get SEO configuration for a tenant' })
  @ApiResponse({ status: 200, type: SeoConfig })
  findByTenantId(
    @Param('tenant_id', ParseUUIDPipe) tenant_id: string,
  ): Promise<SeoConfig> {
    return this.seoService.findByTenantId(tenant_id);
  }

  @Put(':tenant_id')
  @ApiOperation({ summary: 'Update SEO configuration for a tenant' })
  @ApiResponse({ status: 200, type: SeoConfig })
  update(
    @Param('tenant_id', ParseUUIDPipe) tenant_id: string,
    @Body() updateSeoConfigDto: UpdateSeoConfigDto,
  ): Promise<SeoConfig> {
    return this.seoService.update(tenant_id, updateSeoConfigDto);
  }
}
