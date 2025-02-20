import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { AnnouncementStatus } from '../enums/announcement-status.enum';

export class CreateAnnouncementDto {
  @ApiProperty({ description: 'Tenant ID for multi-tenancy support' })
  @IsUUID()
  @IsNotEmpty()
  tenant_id: string;

  @ApiProperty({ description: 'Announcement title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Announcement content' })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ description: 'Start date of the announcement' })
  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @ApiProperty({ description: 'End date of the announcement' })
  @IsDate()
  @Type(() => Date)
  end_date: Date;

  @ApiProperty({
    description: 'Announcement status',
    enum: AnnouncementStatus,
    default: AnnouncementStatus.ACTIVE,
  })
  @IsEnum(AnnouncementStatus)
  status: AnnouncementStatus;
}
