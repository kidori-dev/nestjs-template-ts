import { PaginationResultType } from './types/pagination-result.type';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { plainToInstance } from 'class-transformer';

interface InfinityPaginationOptions<T> {
  instance: ClassConstructor<T> | null | undefined;
  list: any[];
  totalCount: number;
  page: number;
  limit: number;
}

export const infinityPagination = <T>({
  instance,
  list,
  totalCount,
  page,
  limit,
}: InfinityPaginationOptions<T>): PaginationResultType<T> => {
  let lastPage = Math.ceil(totalCount / limit);
  if (lastPage < 1) {
    lastPage = 1;
  }

  return {
    data: instance ? plainToInstance(instance, list) : list,
    totalCount,
    currentPage: page,
    lastPage: lastPage,
    hasNextPage: list.length === limit,
  };
};

// export const infinityPagination = <T>(
//   dto: ClassConstructor<T>,
//   list: T[],
//   totalCount: number,
//   page: number,
//   limit: number,
//   // sort: string = 'desc',
// ): PaginationResultType<T> => {
//   let lastPage = Math.ceil(totalCount / limit);
//   if (lastPage < 1) {
//     lastPage = 1;
//   }
//
//   /** seq 넘버 요청시 추가
//    *
//    if (sort === 'asc') {
//    let startNumber = page === 1 ? page : (page - 1) * limit + 1;
//    for (const item of list) {
//    item.seq = startNumber;
//    startNumber++;
//    }
//    } else {
//    let startNumber = page === 1 ? 0 : (page - 1) * limit;
//    startNumber = totalCount - startNumber;
//    if (list.length < limit) {
//    startNumber = list.length;
//    }
//    for (const item of list) {
//    item.seq = startNumber;
//    startNumber--;
//    }
//    }
//    */
//
//   return {
//     data: list,
//     totalCount,
//     currentPage: page,
//     lastPage: lastPage,
//     hasNextPage: list.length === limit,
//   };
// };
