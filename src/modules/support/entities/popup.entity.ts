import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from '../../../utils/entity-helper';
import { Exclude } from 'class-transformer';
import { FileEntity } from '../../files/entities/file.entity';

@Entity({ name: 'popup' })
export class PopupEntity extends EntityHelper {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: false })
  adminId: string;

  @ManyToOne(() => FileEntity, (item: FileEntity) => item.id, { nullable: true })
  @JoinColumn({ name: 'fileId', referencedColumnName: 'id' })
  file?: FileEntity;

  @Column({ type: 'bigint' })
  fileId: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ type: 'bigint', nullable: false })
  displayOrder: string;

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
