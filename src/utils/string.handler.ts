import * as nanoid from 'nanoid';

export const getNanoId = (l: number) => {
  return nanoid.nanoid(l);
};

export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 10;
  const skip = page * size - size;
  return { limit, skip };
};
export const getPaginationData = (
  totalCount: number,
  page: number,
  limit: number,
  records: Array<any>,
) => {
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalCount / limit);
  return { totalCount, records, totalPages, currentPage };
};
