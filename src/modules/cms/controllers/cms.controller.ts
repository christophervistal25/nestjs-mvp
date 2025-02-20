import { Controller, Get, Post, Body, Put, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CmsPageService } from '../services/cms.service';
import { CreateCmsPageDto } from '../dto/create-cms-page.dto';
import { UpdateCmsPageDto } from '../dto/update-cms-page.dto';
import { CmsPage } from '../entities/cms-page.entity';

@ApiTags('cms')
@Controller('cms/pages')
export class CmsController {
  constructor(private readonly cmsService: CmsPageService) {}

  @Get()
  @ApiOperation({ summary: 'Get all CMS pages' })
  @ApiResponse({
    status: 200,
    description: 'Returns all CMS pages',
    type: [CmsPage],
  })
  findAll(): Promise<CmsPage[]> {
    return this.cmsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new CMS page' })
  @ApiResponse({
    status: 201,
    description: 'The page has been successfully created.',
    type: CmsPage,
  })
  create(@Body() createCmsPageDto: CreateCmsPageDto): Promise<CmsPage> {
    return this.cmsService.create(createCmsPageDto);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get a CMS page by slug' })
  @ApiParam({ name: 'slug', description: 'Page slug' })
  @ApiQuery({
    name: 'tenant_id',
    required: false,
    description: 'Tenant ID for filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the requested page',
    type: CmsPage,
  })
  findBySlug(
    @Param('slug') slug: string,
    @Query('tenant_id') tenantId?: string,
  ): Promise<CmsPage> {
    return this.cmsService.findBySlug(slug, tenantId);
  }

  @Put(':pageId')
  @ApiOperation({ summary: 'Update a CMS page' })
  @ApiParam({ name: 'pageId', description: 'Page ID' })
  @ApiResponse({
    status: 200,
    description: 'The page has been successfully updated.',
    type: CmsPage,
  })
  update(
    @Param('pageId') pageId: string,
    @Body() updateCmsPageDto: UpdateCmsPageDto,
  ): Promise<CmsPage> {
    return this.cmsService.update(pageId, updateCmsPageDto);
  }
}
