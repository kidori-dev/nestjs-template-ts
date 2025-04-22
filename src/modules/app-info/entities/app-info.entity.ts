import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EntityHelper } from '../../../utils/entity-helper';
import { Exclude } from 'class-transformer';

@Entity({ name: 'app_info' })
export class AppInfoEntity extends EntityHelper {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  information1: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  information2: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  information3: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

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
