import { PartialType } from '@nestjs/mapped-types';
import { CreateSeoConfigDto } from './create-seo-config.dto';

export class UpdateSeoConfigDto extends PartialType(CreateSeoConfigDto) {}
