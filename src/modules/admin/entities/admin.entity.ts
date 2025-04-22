import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { Exclude } from 'class-transformer';

@Entity({ name: 'admin' })
export class AdminEntity extends EntityHelper {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false, comment: '아이디' })
  loginId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Exclude({ toPlainOnly: true })
  password: string;

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
