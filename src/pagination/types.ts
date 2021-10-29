export type IPaginationOptions = {
  limit: number;
  page: number;
  total: number;
}

export const paginationProps = {
  limit: {
    type: Number,
    default: 10
  },
  page: {
    type: Number,
    default: 1
  },
  total: {
    type: Number,
    default: 0
  }
}
