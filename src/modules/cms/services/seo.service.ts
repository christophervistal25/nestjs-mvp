import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeoConfig } from '../entities/seo-config.entity';
import { CreateSeoConfigDto } from '../dto/create-seo-config.dto';
import { UpdateSeoConfigDto } from '../dto/update-seo-config.dto';

@Injectable()
export class SeoService {
  constructor(
    @InjectRepository(SeoConfig)
    private readonly seoRepository: Repository<SeoConfig>,
  ) {}

  async create(createSeoConfigDto: CreateSeoConfigDto): Promise<SeoConfig> {
    const config = this.seoRepository.create(createSeoConfigDto);
    return await this.seoRepository.save(config);
  }

  async findByTenantId(tenant_id: string): Promise<SeoConfig> {
    const config = await this.seoRepository.findOne({
      where: { tenant_id },
    });

    if (!config) {
      throw new NotFoundException(
        `SEO configuration for tenant ${tenant_id} not found`,
      );
    }

    return config;
  }

  async update(
    tenant_id: string,
    updateSeoConfigDto: UpdateSeoConfigDto,
  ): Promise<SeoConfig> {
    const config = await this.findByTenantId(tenant_id);
    Object.assign(config, updateSeoConfigDto);
    return await this.seoRepository.save(config);
  }
}
