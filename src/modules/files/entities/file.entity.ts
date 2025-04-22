import {
  AfterInsert,
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Allow } from 'class-validator';
import { EntityHelper } from 'src/utils/entity-helper';
import appConfig from 'src/config/app.config';
import { AppConfig } from 'src/config/config.type';
import { Exclude } from 'class-transformer';

@Entity({ name: 'file' })
export class FileEntity extends EntityHelper {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Allow()
  @Column()
  path: string;

  @AfterLoad()
  @AfterInsert()
  updatePath() {
    if (this.path.startsWith('/')) {
      this.path = (appConfig() as AppConfig).backendDomain + this.path;
    }
  }

  @Index()
  @Column({ type: String, length: 1000, nullable: true })
  uploadName: string;

  @Column({ type: String, length: 1000, nullable: true })
  originalName: string;

  @Column({ nullable: true })
  size: number;

  @Column({ type: String, length: 100, nullable: true })
  contentType: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Exclude()
  __entity: string;
}
