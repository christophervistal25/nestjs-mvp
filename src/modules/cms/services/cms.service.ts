import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmsPage } from '../entities/cms-page.entity';
import { CreateCmsPageDto } from '../dto/create-cms-page.dto';
import { UpdateCmsPageDto } from '../dto/update-cms-page.dto';

@Injectable()
export class CmsPageService {
  constructor(
    @InjectRepository(CmsPage)
    private readonly cmsPageRepository: Repository<CmsPage>,
  ) {}

  async findAll(): Promise<CmsPage[]> {
    const queryBuilder = this.cmsPageRepository.createQueryBuilder('cms_page');

    return await queryBuilder.orderBy('cms_page.created_at', 'DESC').getMany();
  }

  async create(createCmsPageDto: CreateCmsPageDto): Promise<CmsPage> {
    // First check if slug already exists
    const existingPage = await this.cmsPageRepository
      .createQueryBuilder('cms_page')
      .where('LOWER(cms_page.slug) = LOWER(:slug)', {
        slug: createCmsPageDto.slug,
      })
      .getOne();

    // If a page with this slug exists, throw conflict exception
    if (existingPage) {
      throw new ConflictException('Page with this slug already exists');
    }

    // If slug is unique, create and save the new page
    const page = this.cmsPageRepository.create(createCmsPageDto);
    return await this.cmsPageRepository.save(page);
  }

  async findBySlug(slug: string, tenant_id?: string): Promise<CmsPage> {
    const queryBuilder = this.cmsPageRepository
      .createQueryBuilder('cms_page')
      .where('cms_page.slug = :slug', { slug });

    if (tenant_id && typeof tenant_id === 'string') {
      queryBuilder.andWhere('cms_page.tenant_id = :tenant_id', { tenant_id });
    }

    const page = await queryBuilder.getOne();

    if (!page) {
      throw new NotFoundException(`Page with slug ${slug} not found`);
    }

    return page;
  }

  async findOne(page_id: string): Promise<CmsPage> {
    const page = await this.cmsPageRepository.findOne({
      where: { page_id },
    });

    if (!page) {
      throw new NotFoundException(`Page with ID ${page_id} not found`);
    }

    return page;
  }

  async update(
    page_id: string,
    updateCmsPageDto: UpdateCmsPageDto,
  ): Promise<CmsPage> {
    const page = await this.findOne(page_id);
    Object.assign(page, updateCmsPageDto);
    return await this.cmsPageRepository.save(page);
  }
}
