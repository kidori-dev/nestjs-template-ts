import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';

@Entity({ name: 'email_code' })
export class EmailCode extends EntityHelper {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Index()
  @Column()
  code: string;

  @IsEmail()
  @Column()
  email: string;

  @Column()
  expireAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Exclude()
  __entity: string;
}
