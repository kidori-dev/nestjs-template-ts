/** 유저관련 */
export enum UserRoleEnum {
  MANAGER = 1,
  CUSTOMER = 2,
}

/** 자산 관련*/
export enum TransactionTypeEnum {
  DEPOSIT = 1,
  WITHDRAW = 2,
}

export enum TransactionStatusEnum {
  PENDING = 1, // 대기
  CANCELED = 2, // 취소
  COMPLETED = 3, // 완료
  REJECTED = 4, // 거절
}

export enum AssetLogTypeEnum {
  DEPOSIT = 'deposit', //입금
  WITHDRAW = 'withdraw', //출금
  WITHDRAW_CANCEL = 'withdraw_cancel', //출금취소
  WITHDRAW_REJECT = 'withdraw_reject', //출금거절
  POINT_SWAP = 'point_swap', //포인트스왑
}

export enum PointLogTypeEnum {
  SWAP = 'swap', // 스왑
}

export enum InquiryStatusEnum {
  PENDING = 1, // 대기
  REJECTED = 2, // 거절
  COMPLETED = 3, // 완료
}

/** 글로벌 활성화 */
export enum IsActiveEnum {
  ACTIVE = 1,
  INACTIVE = 2,
}

export enum OrderDirection {
  UP = 'up',
  DOWN = 'down',
}
