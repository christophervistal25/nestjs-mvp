import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmsPageService } from '../services/cms.service';
import { CmsPage } from '../entities/cms-page.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CmsPageService', () => {
  let service: CmsPageService;
  let repository: Repository<CmsPage>;

  const mockCmsPage = {
    page_id: '123e4567-e89b-12d3-a456-426614174000',
    tenant_id: '123e4567-e89b-12d3-a456-426614174001',
    slug: 'test-page',
    title: 'Test Page',
    content: 'Test Content',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(null), // Default to null for no existing page
    getMany: jest.fn().mockResolvedValue([mockCmsPage]),
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockCmsPage),
    save: jest.fn().mockResolvedValue(mockCmsPage),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CmsPageService,
        {
          provide: getRepositoryToken(CmsPage),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CmsPageService>(CmsPageService);
    repository = module.get<Repository<CmsPage>>(getRepositoryToken(CmsPage));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      slug: 'test-page',
      title: 'Test Page',
      content: 'Test Content',
      tenant_id: '123e4567-e89b-12d3-a456-426614174001',
    };

    it('should create a new cms page when slug is unique', async () => {
      // Mock that no existing page is found
      mockQueryBuilder.getOne.mockResolvedValueOnce(null);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCmsPage);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'LOWER(cms_page.slug) = LOWER(:slug)',
        { slug: createDto.slug },
      );
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when slug already exists', async () => {
      // Mock that an existing page is found
      mockQueryBuilder.getOne.mockResolvedValueOnce(mockCmsPage);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
      expect(repository.create).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('findBySlug', () => {
    beforeEach(() => {
      // Reset getOne mock to return a page by default
      mockQueryBuilder.getOne.mockResolvedValue(mockCmsPage);
    });

    it('should find a page by slug without tenant_id', async () => {
      const result = await service.findBySlug('test-page');

      expect(result).toEqual(mockCmsPage);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'cms_page.slug = :slug',
        { slug: 'test-page' },
      );
      // Remove expectation for andWhere since it's not called without tenant_id
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('should find a page by slug with tenant_id', async () => {
      const result = await service.findBySlug(
        'test-page',
        mockCmsPage.tenant_id,
      );

      expect(result).toEqual(mockCmsPage);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'cms_page.slug = :slug',
        { slug: 'test-page' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'cms_page.tenant_id = :tenant_id',
        { tenant_id: mockCmsPage.tenant_id },
      );
    });

    it('should throw NotFoundException when page not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValueOnce(null);

      await expect(service.findBySlug('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto = {
      title: 'Updated Title',
      content: 'Updated Content',
    };

    it('should update an existing page', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockCmsPage);
      mockRepository.save.mockResolvedValueOnce({
        ...mockCmsPage,
        ...updateDto,
      });

      const result = await service.update(mockCmsPage.page_id, updateDto);
      expect(result.title).toEqual(updateDto.title);
      expect(result.content).toEqual(updateDto.content);
    });

    it('should throw NotFoundException when updating non-existent page', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.update('non-existent', { title: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
