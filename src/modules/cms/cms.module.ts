import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmsController } from './controllers/cms.controller';
import { SeoController } from './controllers/seo.controller';
import { CmsPageService } from './services/cms.service';

import { CmsPage } from './entities/cms-page.entity';
import { SeoConfig } from './entities/seo-config.entity';
import { SeoService } from './services/seo.service';

@Module({
  imports: [TypeOrmModule.forFeature([CmsPage, SeoConfig])],
  controllers: [CmsController, SeoController],
  providers: [CmsPageService, SeoService],
  exports: [CmsPageService, SeoService],
})
export class CmsModule {}
