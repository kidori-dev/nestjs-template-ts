import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AssetEntity } from './asset.entity';
import { EntityHelper } from '../../../utils/entity-helper';
import { AssetLogTypeEnum } from '../../../constants/enums';

@Entity({ name: 'asset_log' })
export class AssetLogEntity extends EntityHelper {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => AssetEntity, (point: AssetEntity) => point.id)
  @JoinColumn({ name: 'assetId', referencedColumnName: 'id' })
  asset: AssetEntity;

  @Column({ type: 'bigint', nullable: false })
  assetId: string;

  @Column({ type: 'bigint', nullable: false })
  userId: string;

  @Column({ type: 'bigint', nullable: false })
  refId: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  type: AssetLogTypeEnum;

  @Column({ type: 'decimal', precision: 65, scale: 18, nullable: false })
  previousAmount: string;

  @Column({ type: 'boolean', nullable: false })
  isPositive: boolean;

  @Column({ type: 'decimal', precision: 65, scale: 18, nullable: false })
  amount: string;

  @Column({ type: 'decimal', precision: 65, scale: 18, nullable: false })
  currentAmount: string;

  @CreateDateColumn()
  createdAt: Date;
}
