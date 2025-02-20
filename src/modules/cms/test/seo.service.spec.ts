import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeoService } from '../services/seo.service';
import { SeoConfig } from '../entities/seo-config.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateSeoConfigDto } from '../dto/create-seo-config.dto';
import { UpdateSeoConfigDto } from '../dto/update-seo-config.dto';

describe('SeoService', () => {
  let service: SeoService;
  let repository: Repository<SeoConfig>;

  // Mock data
  const mockSeoConfig: SeoConfig = {
    config_id: '123e4567-e89b-12d3-a456-426614174000',
    tenant_id: '123e4567-e89b-12d3-a456-426614174001',
    meta_title: 'Test Title',
    meta_description: 'Test Description',
    keywords: ['test', 'seo', 'keywords'],
    index_follow: true,
    og_image_url: 'https://example.com/image.jpg',
    canonical_url: 'https://example.com',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockCreateSeoConfigDto: CreateSeoConfigDto = {
    tenant_id: mockSeoConfig.tenant_id,
    meta_title: mockSeoConfig.meta_title,
    meta_description: mockSeoConfig.meta_description,
    keywords: mockSeoConfig.keywords,
    index_follow: mockSeoConfig.index_follow,
    og_image_url: mockSeoConfig.og_image_url,
    canonical_url: mockSeoConfig.canonical_url,
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockSeoConfig),
    save: jest.fn().mockResolvedValue(mockSeoConfig),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeoService,
        {
          provide: getRepositoryToken(SeoConfig),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SeoService>(SeoService);
    repository = module.get<Repository<SeoConfig>>(
      getRepositoryToken(SeoConfig),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('service', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have repository injected', () => {
      expect(repository).toBeDefined();
    });
  });

  describe('create', () => {
    it('should create a new SEO configuration', async () => {
      const result = await service.create(mockCreateSeoConfigDto);

      expect(result).toEqual(mockSeoConfig);
      expect(repository.create).toHaveBeenCalledWith(mockCreateSeoConfigDto);
      expect(repository.save).toHaveBeenCalledWith(mockSeoConfig);
    });

    it('should handle creation with minimal required fields', async () => {
      const minimalDto: CreateSeoConfigDto = {
        tenant_id: mockSeoConfig.tenant_id,
        meta_title: mockSeoConfig.meta_title,
        meta_description: mockSeoConfig.meta_description,
        keywords: mockSeoConfig.keywords,
      };

      const minimalConfig: SeoConfig = {
        ...mockSeoConfig,
        og_image_url: null,
        canonical_url: null,
        index_follow: true, // default value
      };

      mockRepository.create.mockReturnValueOnce(minimalConfig);
      mockRepository.save.mockResolvedValueOnce(minimalConfig);

      const result = await service.create(minimalDto);

      expect(result).toEqual(minimalConfig);
      expect(repository.create).toHaveBeenCalledWith(minimalDto);
      expect(repository.save).toHaveBeenCalledWith(minimalConfig);
    });

    it('should handle database errors during creation', async () => {
      mockRepository.save.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.create(mockCreateSeoConfigDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findByTenantId', () => {
    it('should return SEO configuration when found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockSeoConfig);

      const result = await service.findByTenantId(mockSeoConfig.tenant_id);

      expect(result).toEqual(mockSeoConfig);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { tenant_id: mockSeoConfig.tenant_id },
      });
    });

    it('should throw NotFoundException when configuration not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      const nonExistentId = 'non-existent-id';

      await expect(service.findByTenantId(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { tenant_id: nonExistentId },
      });
    });
  });

  describe('update', () => {
    const updateDto: UpdateSeoConfigDto = {
      meta_title: 'Updated Title',
      meta_description: 'Updated Description',
      keywords: ['updated', 'keywords'],
    };

    it('should update existing SEO configuration', async () => {
      const updatedConfig: SeoConfig = {
        ...mockSeoConfig,
        ...updateDto,
      };

      mockRepository.findOne.mockResolvedValueOnce(mockSeoConfig);
      mockRepository.save.mockResolvedValueOnce(updatedConfig);

      const result = await service.update(mockSeoConfig.tenant_id, updateDto);

      expect(result).toEqual(updatedConfig);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { tenant_id: mockSeoConfig.tenant_id },
      });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
    });

    it('should throw NotFoundException when updating non-existent configuration', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      const nonExistentId = 'non-existent-id';

      await expect(service.update(nonExistentId, updateDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { tenant_id: nonExistentId },
      });
      expect(repository.save).not.toHaveBeenCalled();
    });

    it('should handle partial updates', async () => {
      const partialUpdateDto: UpdateSeoConfigDto = {
        meta_title: 'Only Title Updated',
      };

      const partiallyUpdatedConfig: SeoConfig = {
        ...mockSeoConfig,
        meta_title: partialUpdateDto.meta_title || '',
      };

      mockRepository.findOne.mockResolvedValueOnce(mockSeoConfig);
      mockRepository.save.mockResolvedValueOnce(partiallyUpdatedConfig);

      const result = await service.update(
        mockSeoConfig.tenant_id,
        partialUpdateDto,
      );

      expect(result).toEqual(partiallyUpdatedConfig);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(partialUpdateDto),
      );
    });

    it('should handle database errors during update', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockSeoConfig);
      mockRepository.save.mockRejectedValueOnce(new Error('Database error'));

      await expect(
        service.update(mockSeoConfig.tenant_id, updateDto),
      ).rejects.toThrow('Database error');
    });
  });

  describe('input validation', () => {
    it('should handle null values in optional fields', async () => {
      const dtoWithNulls: CreateSeoConfigDto = {
        ...mockCreateSeoConfigDto,
        og_image_url: null,
        canonical_url: null,
      };

      const configWithNulls: SeoConfig = {
        ...mockSeoConfig,
        og_image_url: null,
        canonical_url: null,
      };

      mockRepository.create.mockReturnValueOnce(configWithNulls);
      mockRepository.save.mockResolvedValueOnce(configWithNulls);

      const result = await service.create(dtoWithNulls);

      expect(result).toEqual(configWithNulls);
      expect(repository.create).toHaveBeenCalledWith(dtoWithNulls);
    });

    it('should handle empty arrays in keywords', async () => {
      const dtoWithEmptyKeywords: CreateSeoConfigDto = {
        ...mockCreateSeoConfigDto,
        keywords: [],
      };

      const configWithEmptyKeywords: SeoConfig = {
        ...mockSeoConfig,
        keywords: [],
      };

      mockRepository.create.mockReturnValueOnce(configWithEmptyKeywords);
      mockRepository.save.mockResolvedValueOnce(configWithEmptyKeywords);

      const result = await service.create(dtoWithEmptyKeywords);

      expect(result).toEqual(configWithEmptyKeywords);
      expect(repository.create).toHaveBeenCalledWith(dtoWithEmptyKeywords);
    });
  });
});
