import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EntityHelper } from '../../../utils/entity-helper';
import { Exclude } from 'class-transformer';
import { TransactionStatusEnum, TransactionTypeEnum } from '../../../constants/enums';

@Entity({ name: 'asset_transaction' })
export class AssetTxEntity extends EntityHelper {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'bigint', nullable: false })
  userId: string;

  @Column({ type: 'tinyint', nullable: false })
  type: TransactionTypeEnum;

  @Column({ type: 'tinyint', nullable: false, default: 1 })
  status: TransactionStatusEnum;

  @Column({ type: 'decimal', precision: 65, scale: 18, nullable: false })
  amount: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  bankName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  accountHolderName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  accountNumber: string;

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
