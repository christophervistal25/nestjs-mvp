import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('seo_configs')
export class SeoConfig {
  @PrimaryGeneratedColumn('uuid')
  config_id: string;

  @Column('uuid')
  @Index({ unique: true })
  tenant_id: string;

  @Column()
  meta_title: string;

  @Column('text')
  meta_description: string;

  @Column('simple-array')
  keywords: string[];

  @Column({ default: true })
  index_follow: boolean;

  @Column({ nullable: true })
  og_image_url: string | null;

  @Column({ nullable: true })
  canonical_url: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
