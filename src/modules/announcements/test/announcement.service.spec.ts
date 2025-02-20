import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnouncementService } from '../services/announcement.service';
import { Announcement } from '../entities/announcement.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateAnnouncementDto } from '../dto/create-announcement.dto';
import { AnnouncementStatus } from '../enums/announcement-status.enum';

describe('AnnouncementService', () => {
  let service: AnnouncementService;
  let repository: Repository<Announcement>;

  const mockAnnouncement = {
    announcement_id: '123e4567-e89b-12d3-a456-426614174000',
    tenant_id: '123e4567-e89b-12d3-a456-426614174001',
    title: 'Test Announcement',
    body: 'Test Content',
    start_date: new Date('2024-02-20'),
    end_date: new Date('2024-02-21'),
    status: AnnouncementStatus.ACTIVE,
    created_at: new Date(),
    updated_at: new Date(),
  };

  // Mock query builder with proper method chaining
  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockAnnouncement]),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(undefined),
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockAnnouncement),
    save: jest.fn().mockResolvedValue(mockAnnouncement),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementService,
        {
          provide: getRepositoryToken(Announcement),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AnnouncementService>(AnnouncementService);
    repository = module.get<Repository<Announcement>>(
      getRepositoryToken(Announcement),
    );

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new announcement', async () => {
      const createDto: CreateAnnouncementDto = {
        tenant_id: mockAnnouncement.tenant_id,
        title: mockAnnouncement.title,
        body: mockAnnouncement.body,
        start_date: mockAnnouncement.start_date,
        end_date: mockAnnouncement.end_date,
        status: mockAnnouncement.status,
      };

      const result = await service.create(createDto);

      expect(result).toEqual(mockAnnouncement);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all announcements', async () => {
      const result = await service.findAll();

      expect(result).toEqual([mockAnnouncement]);
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
        'announcement',
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'announcement.created_at',
        'DESC',
      );
    });

    it('should filter by tenant_id and status', async () => {
      const result = await service.findAll(
        mockAnnouncement.tenant_id,
        AnnouncementStatus.ACTIVE,
      );

      expect(result).toEqual([mockAnnouncement]);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'announcement.tenant_id = :tenant_id',
        { tenant_id: mockAnnouncement.tenant_id },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'announcement.status = :status',
        { status: AnnouncementStatus.ACTIVE },
      );
    });
  });

  describe('findOne', () => {
    it('should find an announcement by id', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockAnnouncement);

      const result = await service.findOne(mockAnnouncement.announcement_id);
      expect(result).toEqual(mockAnnouncement);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { announcement_id: mockAnnouncement.announcement_id },
      });
    });

    it('should throw NotFoundException when announcement not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing announcement', async () => {
      const updateDto = {
        title: 'Updated Title',
        body: 'Updated Content',
      };

      mockRepository.findOne.mockResolvedValueOnce(mockAnnouncement);
      mockRepository.save.mockResolvedValueOnce({
        ...mockAnnouncement,
        ...updateDto,
      });

      const result = await service.update(
        mockAnnouncement.announcement_id,
        updateDto,
      );

      expect(result.title).toEqual(updateDto.title);
      expect(result.body).toEqual(updateDto.body);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when updating non-existent announcement', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.update('non-existent', { title: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an announcement', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockAnnouncement);
      mockRepository.remove.mockResolvedValueOnce(undefined);

      await service.remove(mockAnnouncement.announcement_id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { announcement_id: mockAnnouncement.announcement_id },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockAnnouncement);
    });

    it('should throw NotFoundException when removing non-existent announcement', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatusBasedOnDates', () => {
    it('should update statuses based on dates', async () => {
      await service.updateStatusBasedOnDates();

      expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.update).toHaveBeenCalled();
      expect(mockQueryBuilder.set).toHaveBeenCalledWith({
        status: AnnouncementStatus.ACTIVE,
      });
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
      expect(mockQueryBuilder.execute).toHaveBeenCalled();

      // Verify second update for EXPIRED status
      expect(mockQueryBuilder.set).toHaveBeenCalledWith({
        status: AnnouncementStatus.EXPIRED,
      });
    });
  });
});
