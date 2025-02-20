import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmsController } from './controllers/cms.controller';
import { CmsPageService } from './services/cms.service';
import { CmsPage } from './entities/cms-page.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CmsPage])],
  controllers: [CmsController],
  providers: [CmsPageService],
  exports: [CmsPageService],
})
export class CmsModule {}
