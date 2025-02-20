import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '../entities/announcement.entity';
import { CreateAnnouncementDto } from '../dto/create-announcement.dto';
import { UpdateAnnouncementDto } from '../dto/update-announcement.dto';
import { AnnouncementStatus } from '../enums/announcement-status.enum';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
  ) {}

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = this.announcementRepository.create(
      createAnnouncementDto,
    );
    return await this.announcementRepository.save(announcement);
  }

  async findAll(
    tenant_id?: string,
    status?: AnnouncementStatus,
  ): Promise<Announcement[]> {
    const queryBuilder =
      this.announcementRepository.createQueryBuilder('announcement');

    if (tenant_id) {
      queryBuilder.andWhere('announcement.tenant_id = :tenant_id', {
        tenant_id,
      });
    }

    if (status) {
      queryBuilder.andWhere('announcement.status = :status', { status });
    }

    return await queryBuilder
      .orderBy('announcement.created_at', 'DESC')
      .getMany();
  }

  async findOne(announcement_id: string): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({
      where: { announcement_id },
    });

    if (!announcement) {
      throw new NotFoundException(
        `Announcement with ID ${announcement_id} not found`,
      );
    }

    return announcement;
  }

  async update(
    announcement_id: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = await this.findOne(announcement_id);
    Object.assign(announcement, updateAnnouncementDto);
    return await this.announcementRepository.save(announcement);
  }

  async remove(announcement_id: string): Promise<void> {
    const announcement = await this.findOne(announcement_id);
    await this.announcementRepository.remove(announcement);
  }

  // Add a method to automatically update status based on dates
  async updateStatusBasedOnDates(): Promise<void> {
    const now = new Date();

    // Update to ACTIVE if start_date has passed and end_date hasn't
    await this.announcementRepository
      .createQueryBuilder()
      .update(Announcement)
      .set({ status: AnnouncementStatus.ACTIVE })
      .where('start_date <= :now', { now })
      .andWhere('end_date > :now', { now })
      .andWhere('status = :scheduled', {
        scheduled: AnnouncementStatus.SCHEDULED,
      })
      .execute();

    // Update to EXPIRED if end_date has passed
    await this.announcementRepository
      .createQueryBuilder()
      .update(Announcement)
      .set({ status: AnnouncementStatus.EXPIRED })
      .where('end_date <= :now', { now })
      .andWhere('status != :expired', { expired: AnnouncementStatus.EXPIRED })
      .execute();
  }
}
