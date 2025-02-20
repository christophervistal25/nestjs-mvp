import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AnnouncementService } from '../services/announcement.service';
import { CreateAnnouncementDto } from '../dto/create-announcement.dto';
import { UpdateAnnouncementDto } from '../dto/update-announcement.dto';
import { Announcement } from '../entities/announcement.entity';
import { AnnouncementStatus } from '../enums/announcement-status.enum';

@ApiTags('announcements')
@Controller('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new announcement' })
  @ApiResponse({
    status: 201,
    description: 'The announcement has been successfully created.',
    type: Announcement,
  })
  create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<Announcement> {
    return this.announcementService.create(createAnnouncementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all announcements' })
  @ApiQuery({
    name: 'tenant_id',
    required: false,
    description: 'Filter by tenant ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: AnnouncementStatus,
    description: 'Filter by status',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all announcements',
    type: [Announcement],
  })
  findAll(
    @Query('tenant_id') tenant_id?: string,
    @Query('status') status?: AnnouncementStatus,
  ): Promise<Announcement[]> {
    return this.announcementService.findAll(tenant_id, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an announcement by ID' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the requested announcement',
    type: Announcement,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Announcement> {
    return this.announcementService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an announcement' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  @ApiResponse({
    status: 200,
    description: 'The announcement has been successfully updated.',
    type: Announcement,
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    return this.announcementService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an announcement' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  @ApiResponse({
    status: 200,
    description: 'The announcement has been deleted.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.announcementService.remove(id);
  }
}
