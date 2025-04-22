import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PointEntity } from './point.entity';
import { EntityHelper } from '../../../utils/entity-helper';
import { PointLogTypeEnum } from '../../../constants/enums';

@Entity({ name: 'point_log' })
export class PointLogEntity extends EntityHelper {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => PointEntity, (point: PointEntity) => point.id)
  @JoinColumn({ name: 'pointId', referencedColumnName: 'id' })
  point: PointEntity;

  @Column({ type: 'bigint' })
  pointId: string;

  @Column({ type: 'bigint' })
  userId: string;

  @Column({ type: 'varchar', length: 20 })
  type: PointLogTypeEnum;

  @Column({ type: 'decimal', precision: 65, scale: 18 })
  previousAmount: string;

  @Column({ type: 'tinyint', width: 1 })
  isPositive: boolean;

  @Column({ type: 'decimal', precision: 65, scale: 18 })
  amount: string;

  @Column({ type: 'decimal', precision: 65, scale: 18 })
  currentAmount: string;

  @CreateDateColumn()
  createdAt: Date;
}
