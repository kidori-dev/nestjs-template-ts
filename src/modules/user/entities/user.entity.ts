import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { FileEntity } from '../../files/entities/file.entity';
import { Exclude } from 'class-transformer';
import { IsActiveEnum, UserRoleEnum } from '../../../constants/enums';
import { PointEntity } from '../../point/entities/point.entity';
import { AssetEntity } from '../../asset/entities/asset.entity';

@Entity({ name: 'user' })
export class UserEntity extends EntityHelper {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false, comment: '아이디' })
  loginId: string;

  @Column({ type: 'tinyint', default: 1, nullable: false, comment: '1 매니저 2 유저' })
  role: UserRoleEnum;

  @Column({ type: 'varchar', length: 20, unique: false, nullable: false, comment: '나의 초대 코드' })
  inviteCode: string;

  @ManyToOne(() => UserEntity, (item: UserEntity) => item.children, { nullable: true })
  @JoinColumn({ name: 'referrerUserId', referencedColumnName: 'id' })
  parent: UserEntity;

  @OneToMany(() => UserEntity, (item: UserEntity) => item.parent, { nullable: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'referrerUserId' })
  children: UserEntity[];

  @Column({ type: 'bigint', nullable: true, comment: '내가 추천하고있는 유저의 아이디' })
  referrerUserId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: false, comment: '이름' })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, comment: '이메일' })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: 'tinyint', default: 1, nullable: false, comment: '활성화 여부 1:활성화 2 비활성화' })
  isActive: IsActiveEnum;

  @ManyToOne(() => FileEntity, (item: FileEntity) => item.id, { nullable: true })
  @JoinColumn({ name: 'photoId', referencedColumnName: 'id' })
  photo?: FileEntity;

  @ManyToOne(() => AssetEntity, (item: AssetEntity) => item.id, { nullable: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
  asset: AssetEntity;

  @ManyToOne(() => PointEntity, (item: PointEntity) => item.id, { nullable: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
  point: PointEntity;

  @Column({ type: 'bigint', nullable: true, comment: '프로필 이미지 파일 아이디' })
  photoId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastIp: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  memo: string;

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
