create table board
(
    id              bigint unsigned auto_increment comment '인덱스'
        primary key,
    userId          bigint unsigned                     not null comment '생성 관리자',
    orderIndex      bigint unsigned                     not null comment '순서',
    title           varchar(100)                        not null comment '제목',
    slug            varchar(200)                        null,
    overview        varchar(100)                        null comment '미리보기',
    content         text                                not null comment '내용',
    category        tinyint                             not null comment '카테고리',
    isEnabled       tinyint   default 1                 not null comment '사용가능여부',
    thumbnailFileId varchar(50)                         null comment '썸네일 파일 아이디',
    createdAt       timestamp default CURRENT_TIMESTAMP null comment '생성일',
    updatedAt       timestamp default CURRENT_TIMESTAMP null comment '수정일',
    deletedAt       timestamp                           null comment '삭제일'
);

create index board_category_order_index_status_index
    on board (category, orderIndex, isEnabled);

create index board_isEnabled_category_index
    on board (isEnabled, category);

create index board_order_index_index
    on board (orderIndex);

create index board_slug_index
    on board (slug);

create table business
(
    id                bigint unsigned auto_increment comment '인덱스'
        primary key,
    name              varchar(20)                         not null comment '사업자명',
    corpId            bigint unsigned                     null,
    site              varchar(100)                        not null comment '사이트',
    businessRegNumber varchar(100)                        not null comment '사업자등록번호',
    mainAddress       varchar(100)                        not null comment '기본주소',
    detailedAddress   varchar(100)                        not null comment '상세주소',
    businessType      varchar(100)                        not null comment '업종',
    isActive          tinyint   default 1                 not null comment '활성화유무',
    isEnabled         tinyint   default 1                 not null comment '사용가능유무',
    createdUserId     bigint unsigned                     not null comment '생성 유저',
    updatedUserId     bigint unsigned                     not null comment '수정 유저',
    createdAt         timestamp default CURRENT_TIMESTAMP null comment '생성일',
    updatedAt         timestamp default CURRENT_TIMESTAMP null comment '수정일',
    deletedAt         timestamp                           null comment '삭제일'
);

create table carrier
(
    id            bigint unsigned auto_increment comment '인덱스'
        primary key,
    name          varchar(20)                         not null comment '운송사명',
    corpId        bigint unsigned                     not null,
    site          varchar(100)                        not null comment '사이트',
    contactNumber varchar(30)                         not null comment '연락처',
    country       varchar(30)                         not null comment '서비스 국가',
    isEnabled     tinyint   default 1                 not null comment '사용가능유무',
    createdUserId bigint unsigned                     not null comment '생성 유저',
    updatedUserId bigint unsigned                     not null comment '수정 유저',
    createdAt     timestamp default CURRENT_TIMESTAMP null comment '생성일',
    updatedAt     timestamp default CURRENT_TIMESTAMP null comment '수정일',
    deletedAt     timestamp                           null comment '삭제일'
);

create table category
(
    id            bigint unsigned auto_increment comment '인덱스'
        primary key,
    name          varchar(20)                         not null comment '카테고리 명',
    description   mediumtext                          not null comment '설명',
    corpId        bigint unsigned                     not null,
    level         tinyint                             not null comment '1 대분류 2 중분류 3 소분류',
    parentId      bigint unsigned                     null comment '카테고리 테이블에서 부모 아이디',
    isEnabled     tinyint   default 1                 not null comment '사용가능여부',
    createdUserId bigint unsigned                     not null comment '생성 유저',
    updatedUserId bigint unsigned                     not null comment '업데이트 유저',
    createdAt     timestamp default CURRENT_TIMESTAMP null comment '생성일',
    updatedAt     timestamp default CURRENT_TIMESTAMP null comment '수정일',
    deletedAt     timestamp                           null comment '삭제일'
)
    comment '상품 카테고리';

create table corp
(
    id            bigint unsigned auto_increment
        primary key,
    name          varchar(50)               not null,
    contactEmail  varchar(100)              null comment '이메일',
    contactNumber varchar(30)               null comment '폰번호',
    isEnabled     tinyint   default 1       null,
    createdAt     timestamp default (now()) null,
    updatedAt     timestamp                 null,
    deletedAt     timestamp                 null,
    constraint corp_pk
        unique (name)
)
    comment '회사';

create table currency
(
    id            bigint unsigned auto_increment
        primary key,
    name          varchar(30)                         not null,
    corpId        bigint unsigned                     not null,
    code          varchar(30)                         not null,
    symbol        varchar(30)                         not null,
    country       varchar(30)                         not null,
    isActive      tinyint   default 1                 not null,
    isEnabled     tinyint   default 1                 not null,
    createdUserId bigint unsigned                     not null,
    updatedUserId bigint unsigned                     not null,
    createdAt     timestamp default CURRENT_TIMESTAMP null,
    updatedAt     timestamp default CURRENT_TIMESTAMP null,
    deletedAt     timestamp                           null
);

create table destination
(
    id            bigint unsigned auto_increment
        primary key,
    name          varchar(100)                        not null,
    corpId        bigint unsigned                     not null,
    level         tinyint                             not null,
    parentId      bigint unsigned                     null,
    isEnabled     tinyint   default 1                 not null,
    createdUserId bigint unsigned                     not null,
    updatedUserId bigint unsigned                     not null,
    createdAt     timestamp default CURRENT_TIMESTAMP null,
    updatedAt     timestamp default CURRENT_TIMESTAMP null,
    deletedAt     timestamp                           null
);

create table file
(
    id           varchar(50)                         not null comment '파일 ID'
        primary key,
    path         varchar(300)                        null comment '파일 URL',
    uploadName   varchar(100)                        null comment '업로드 파일명',
    originalName varchar(100)                        null comment '원본 파일명',
    size         int                                 null comment '파일 사이즈',
    contentType  varchar(50)                         null comment '파일 종류',
    createdAt    timestamp default CURRENT_TIMESTAMP null comment '생성 일시',
    deletedAt    timestamp                           null comment '삭제 일시'
)
    comment '파일 정보';

create table inventory
(
    id               bigint unsigned auto_increment
        primary key,
    inventoryDate    timestamp                           not null,
    corpId           bigint unsigned                     not null,
    status           tinyint   default 1                 not null comment '상태값',
    isReg            tinyint   default 1                 not null,
    accountingType   tinyint   default 1                 not null comment '회계구분 1:구매대행 2:도/소매',
    categoryId1      bigint unsigned                     not null,
    categoryId2      bigint unsigned                     not null,
    categoryId3      bigint unsigned                     not null,
    categoryName1    varchar(20)                         not null,
    categoryName2    varchar(20)                         not null,
    categoryName3    varchar(20)                         not null,
    supplierUrl      varchar(100)                        not null,
    loginId          varchar(100)                        not null,
    orderNumber      varchar(100)                        not null,
    productName      varchar(100)                        not null comment '상품명',
    hsCode           varchar(100)                        not null,
    productUrl       varchar(100)                        not null,
    color            varchar(100)                        not null,
    size             varchar(100)                        not null,
    totalAmount      bigint unsigned                     not null comment '총 구매수량',
    remainAmount     bigint unsigned                     not null,
    currency         varchar(30)                         not null,
    price            decimal(65, 18)                     not null,
    totalPrice       decimal(65, 18)                     not null,
    totalPriceToKrw  decimal(65, 18)                     not null,
    paymentId1       bigint unsigned                     not null,
    paymentId2       bigint unsigned                     not null,
    paymentId3       bigint unsigned                     not null,
    paymentName1     varchar(100)                        not null,
    paymentName2     varchar(100)                        not null,
    paymentName3     varchar(100)                        not null,
    isDomestic       tinyint   default 1                 not null comment '1:국내 2:해외',
    destinationId1   bigint unsigned                     not null,
    destinationId2   bigint unsigned                     not null,
    destinationId3   bigint unsigned                     not null,
    destinationName1 varchar(100)                        not null,
    destinationName2 varchar(100)                        not null,
    destinationName3 varchar(100)                        not null,
    isEnabled        tinyint   default 1                 not null,
    createdUserId    bigint unsigned                     not null,
    updatedUserId    bigint unsigned                     not null,
    createdAt        timestamp default CURRENT_TIMESTAMP null,
    updatedAt        timestamp default CURRENT_TIMESTAMP null,
    deletedAt        timestamp                           null
);

create table market
(
    id              bigint unsigned auto_increment comment '인덱스'
        primary key,
    marketName      varchar(20)                         not null comment '마켓명',
    corpId          bigint unsigned                     not null,
    marketSite      varchar(100)                        not null comment '사이트',
    country         varchar(30)                         not null comment '서비스 국가',
    mainAddress     varchar(100)                        not null comment '기본주소',
    detailedAddress varchar(100)                        not null comment '상세주소',
    businessType    varchar(100)                        not null comment '업종',
    contactUsername varchar(100)                        not null comment '담당자 이름',
    contactEmail    varchar(100)                        not null comment '담당자 이메일',
    contactNumber   varchar(30)                         not null comment '담당자 연락처',
    isActive        tinyint   default 1                 not null comment '활성화유무',
    isEnabled       tinyint   default 1                 not null comment '사용가능유무',
    createdUserId   bigint unsigned                     not null comment '생성 유저',
    updatedUserId   bigint unsigned                     not null comment '수정 유저',
    createdAt       timestamp default CURRENT_TIMESTAMP null comment '생성일',
    updatedAt       timestamp default CURRENT_TIMESTAMP null comment '수정일',
    deletedAt       timestamp                           null comment '삭제일'
);

create table payment
(
    id            bigint unsigned auto_increment
        primary key,
    name          varchar(100)                        not null,
    corpId        bigint unsigned                     not null,
    level         tinyint                             not null,
    parentId      bigint unsigned                     null,
    isEnabled     tinyint   default 1                 not null,
    createdUserId bigint unsigned                     not null,
    updatedUserId bigint unsigned                     not null,
    createdAt     timestamp default CURRENT_TIMESTAMP null,
    updatedAt     timestamp default CURRENT_TIMESTAMP null,
    deletedAt     timestamp                           null
);

create table role
(
    id                 bigint unsigned auto_increment comment '인덱스'
        primary key,
    name               varchar(20)                          not null comment '권한 이름',
    corpId             bigint unsigned                      not null,
    isDefault          tinyint(1) default 0                 not null,
    canManageSetting   tinyint(1) default 0                 not null comment '설정 관리 권한',
    canManageUser      tinyint(1) default 0                 not null comment '회원 관리 권한',
    canCreateOrder     tinyint(1) default 0                 not null comment '주문 작성 권한',
    canManageInventory tinyint(1) default 0                 not null comment '재고 관리 권한',
    canManageCustomer  tinyint(1) default 0                 not null comment '고객 관리 권한',
    canManageShipment  tinyint(1) default 0                 not null comment '출고 관리 권한',
    createdUserId      bigint unsigned                      not null comment '등록자',
    updatedUserId      bigint unsigned                      not null comment '수정자',
    isEnabled          tinyint    default 1                 not null comment '사용가능여부',
    createdAt          timestamp  default CURRENT_TIMESTAMP null comment '생성일',
    updatedAt          timestamp  default CURRENT_TIMESTAMP null comment '수정일',
    deletedAt          timestamp                            null comment '삭제일',
    constraint role_pk
        unique (corpId, name)
)
    comment '권한 관리';

create table sales_online
(
    id        bigint unsigned auto_increment
        primary key,
    createdAt timestamp null comment '생성일',
    updatedAt timestamp null comment '수정일',
    deletedAt timestamp null comment '삭제일'
)
    comment '판매관리 온라인';

create table supplier
(
    id              bigint unsigned auto_increment comment '인덱스'
        primary key,
    supplierName    varchar(20)                         not null comment '매입처명',
    corpId          bigint unsigned                     not null,
    supplierSite    varchar(100)                        not null comment '사이트',
    mainAddress     varchar(100)                        not null comment '기본주소',
    detailedAddress varchar(100)                        not null comment '상세주소',
    country         varchar(30)                         not null comment '서비스 국가',
    contactUsername varchar(100)                        not null comment '담당자 이름',
    contactEmail    varchar(100)                        not null comment '담당자 이메일',
    contactNumber   varchar(30)                         not null comment '담당자 연락처',
    businessType    varchar(100)                        not null comment '업종',
    isActive        tinyint   default 1                 not null comment '활성화유무',
    isEnabled       tinyint   default 1                 not null comment '사용가능유무',
    createdUserId   bigint unsigned                     not null comment '생성 유저',
    updatedUserId   bigint unsigned                     not null comment '수정 유저',
    createdAt       timestamp default CURRENT_TIMESTAMP null comment '생성일',
    updatedAt       timestamp default CURRENT_TIMESTAMP null comment '수정일',
    deletedAt       timestamp                           null comment '삭제일'
);

create table user
(
    id            bigint unsigned auto_increment
        primary key,
    username      varchar(50)                         not null comment '아이디',
    firstName     varchar(50)                         not null comment '이름',
    lastName      varchar(30)                         not null comment '성',
    type          tinyint   default 2                 not null comment '1: 슈퍼어드민 2:일반',
    corpId        bigint unsigned                     null comment '회사 인덱스',
    roleId        bigint unsigned                     null,
    profileImgId  varchar(50)                         null comment '프로필 이미지 파일 아이디',
    email         varchar(100)                        not null comment '이메일',
    contactNumber varchar(30)                         not null,
    country       varchar(30)                         not null,
    password      varchar(255)                        not null,
    isEnabled     tinyint   default 1                 not null,
    createdUserId bigint unsigned                     null,
    updatedUserId bigint unsigned                     null,
    createdAt     timestamp default CURRENT_TIMESTAMP null,
    updatedAt     timestamp default CURRENT_TIMESTAMP null,
    deletedAt     timestamp                           null,
    constraint user_pk
        unique (username)
)
    comment '유저 테이블';

