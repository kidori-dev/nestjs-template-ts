import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EntityHelper } from '../../../utils/entity-helper';
import { Exclude } from 'class-transformer';
import { InquiryStatusEnum } from '../../../constants/enums';

@Entity({ name: 'inquiry' })
export class InquiryEntity extends EntityHelper {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: false })
  userId: string;

  @Column({ type: 'bigint', nullable: true })
  adminId: string;

  @Column({ type: 'tinyint', nullable: false, default: 1 })
  status: InquiryStatusEnum;

  @Column({ type: 'varchar', length: 200, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'text', nullable: true })
  reply: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;

  @Exclude()
  __entity: string;
}
