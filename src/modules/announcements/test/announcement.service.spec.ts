import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '../entities/announcement.entity';
import { CreateAnnouncementDto } from '../dto/create-announcement.dto';
import { UpdateAnnouncementDto } from '../dto/update-announcement.dto';
import { AnnouncementStatus } from '../enums/announcement-status.enum';
import { NotFoundException } from '@nestjs/common';
import { AnnouncementService } from '../services/announcement.service';

describe('AnnouncementService', () => {
  let service: AnnouncementService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    })),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new announcement', async () => {
      const createDto: CreateAnnouncementDto = {
        title: 'Test Announcement',
        body: 'Test Content',
        tenant_id: '123',
        start_date: new Date(),
        end_date: new Date(),
        status: AnnouncementStatus.SCHEDULED,
      };

      const announcement = { ...createDto, announcement_id: '1' };

      mockRepository.create.mockReturnValue(announcement);
      mockRepository.save.mockResolvedValue(announcement);

      const result = await service.create(createDto);

      expect(result).toEqual(announcement);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(announcement);
    });
  });

  describe('findAll', () => {
    let queryBuilder: any;

    beforeEach(() => {
      queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);
    });

    it('should return all announcements without filters', async () => {
      // Mock data
      const mockAnnouncements = [
        {
          announcement_id: '1',
          title: 'Announcement 1',
          content: 'Content 1',
          tenant_id: '1',
          status: AnnouncementStatus.ACTIVE,
          created_at: new Date('2023-01-01'),
        },
        {
          announcement_id: '2',
          title: 'Announcement 2',
          content: 'Content 2',
          tenant_id: '2',
          status: AnnouncementStatus.SCHEDULED,
          created_at: new Date('2023-01-02'),
        },
      ];

      // Setup mock return
      queryBuilder.getMany.mockResolvedValue(mockAnnouncements);

      // Execute method
      const result = await service.findAll();

      // Verify query building
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
        'announcement',
      );
      expect(queryBuilder.andWhere).not.toHaveBeenCalled();
      expect(queryBuilder.orderBy).toHaveBeenCalledWith(
        'announcement.created_at',
        'DESC',
      );

      // Verify result
      expect(result).toEqual(mockAnnouncements);
      expect(result.length).toBe(2);
    });

    it('should filter by tenant_id when provided', async () => {
      // Mock data
      const mockAnnouncements = [
        {
          announcement_id: '1',
          title: 'Announcement 1',
          content: 'Content 1',
          tenant_id: '1',
          status: AnnouncementStatus.ACTIVE,
          created_at: new Date('2023-01-01'),
        },
      ];

      // Setup mock return
      queryBuilder.getMany.mockResolvedValue(mockAnnouncements);

      // Execute method
      const tenant_id = '1';
      const result = await service.findAll(tenant_id);

      // Verify query building
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
        'announcement',
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'announcement.tenant_id = :tenant_id',
        { tenant_id },
      );
      expect(queryBuilder.orderBy).toHaveBeenCalledWith(
        'announcement.created_at',
        'DESC',
      );

      // Verify result
      expect(result).toEqual(mockAnnouncements);
      expect(result[0].tenant_id).toBe(tenant_id);
    });

    it('should filter by status when provided', async () => {
      // Mock data
      const mockAnnouncements = [
        {
          announcement_id: '1',
          title: 'Announcement 1',
          content: 'Content 1',
          tenant_id: '1',
          status: AnnouncementStatus.ACTIVE,
          created_at: new Date('2023-01-01'),
        },
      ];

      // Setup mock return
      queryBuilder.getMany.mockResolvedValue(mockAnnouncements);

      // Execute method
      const status = AnnouncementStatus.ACTIVE;
      const result = await service.findAll(undefined, status);

      // Verify query building
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
        'announcement',
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'announcement.status = :status',
        { status },
      );
      expect(queryBuilder.orderBy).toHaveBeenCalledWith(
        'announcement.created_at',
        'DESC',
      );

      // Verify result
      expect(result).toEqual(mockAnnouncements);
      expect(result[0].status).toBe(status);
    });

    it('should filter by both tenant_id and status when both provided', async () => {
      // Mock data
      const mockAnnouncements = [
        {
          announcement_id: '1',
          title: 'Announcement 1',
          content: 'Content 1',
          tenant_id: '1',
          status: AnnouncementStatus.ACTIVE,
          created_at: new Date('2023-01-01'),
        },
      ];

      // Setup mock return
      queryBuilder.getMany.mockResolvedValue(mockAnnouncements);

      // Execute method
      const tenant_id = '1';
      const status = AnnouncementStatus.ACTIVE;
      const result = await service.findAll(tenant_id, status);

      // Verify query building
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
        'announcement',
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'announcement.tenant_id = :tenant_id',
        { tenant_id },
      );
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        'announcement.status = :status',
        { status },
      );
      expect(queryBuilder.orderBy).toHaveBeenCalledWith(
        'announcement.created_at',
        'DESC',
      );

      // Verify result
      expect(result).toEqual(mockAnnouncements);
      expect(result[0].tenant_id).toBe(tenant_id);
      expect(result[0].status).toBe(status);
    });

    it('should return empty array when no announcements found', async () => {
      // Setup mock return
      queryBuilder.getMany.mockResolvedValue([]);

      // Execute method
      const result = await service.findAll();

      // Verify query building
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
        'announcement',
      );
      expect(queryBuilder.orderBy).toHaveBeenCalledWith(
        'announcement.created_at',
        'DESC',
      );

      // Verify result
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return an announcement', async () => {
      const announcement = {
        announcement_id: '1',
        title: 'Test',
      };

      mockRepository.findOne.mockResolvedValue(announcement);

      const result = await service.findOne('1');

      expect(result).toEqual(announcement);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { announcement_id: '1' },
      });
    });

    it('should throw NotFoundException if announcement not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an announcement', async () => {
      const updateDto: UpdateAnnouncementDto = {
        title: 'Updated Title',
      };

      const existingAnnouncement = {
        announcement_id: '1',
        title: 'Old Title',
      };

      const updatedAnnouncement = {
        ...existingAnnouncement,
        ...updateDto,
      };

      mockRepository.findOne.mockResolvedValue(existingAnnouncement);
      mockRepository.save.mockResolvedValue(updatedAnnouncement);

      const result = await service.update('1', updateDto);

      expect(result).toEqual(updatedAnnouncement);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedAnnouncement);
    });
  });
});
