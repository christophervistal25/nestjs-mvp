import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('cms_pages')
export class CmsPage {
  @PrimaryGeneratedColumn('uuid')
  page_id: string;

  @Column('uuid', { nullable: true })
  @Index()
  tenant_id: string;

  @Column()
  @Index({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
