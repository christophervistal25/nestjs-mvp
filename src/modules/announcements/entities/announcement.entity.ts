import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { AnnouncementStatus } from '../enums/announcement-status.enum';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  announcement_id: string;

  @Column('uuid')
  @Index()
  tenant_id: string;

  @Column()
  @Index()
  title: string;

  @Column('text')
  body: string;

  @Column({ type: 'timestamp' })
  start_date: Date;

  @Column({ type: 'timestamp' })
  end_date: Date;

  @Column({
    type: 'enum',
    enum: AnnouncementStatus,
    default: AnnouncementStatus.ACTIVE,
  })
  @Index()
  status: AnnouncementStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
