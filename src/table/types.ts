/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PropOptions, PropType } from 'vue-types/dist/types'
type Prop<T, D = T> = PropOptions<T, D> | PropType<T>
type PublicRequiredKeys<T> = {
  [K in keyof T]: T[K] extends { required: true } ? K : never
}[keyof T]

type PublicOptionalKeys<T> = Exclude<keyof T, PublicRequiredKeys<T>>
type InferPropType<T> = T extends null
  ? any // null & true would fail to infer
  : T extends { type: null | true }
    ? any // As TS issue https://github.com/Microsoft/TypeScript/issues/14829 // somehow `ObjectConstructor` when inferred from { (): T } becomes `any` // `BooleanConstructor` when inferred from PropConstructor(with PropMethod) becomes `Boolean`
    : T extends ObjectConstructor | { type: ObjectConstructor }
      ? Record<string, any>
      : T extends BooleanConstructor | { type: BooleanConstructor }
        ? boolean
        : T extends Prop<infer V, infer D>
          ? unknown extends V
            ? D
            : V
          : T

// eslint-disable-next-line @typescript-eslint/ban-types
export type IxPublicPropTypes<O> = O extends object
  ? { [K in PublicRequiredKeys<O>]: InferPropType<O[K]> } & { [K in PublicOptionalKeys<O>]?: InferPropType<O[K]> }
  : { [K in string]: any }

type IPaginationOptions = {
  enable: boolean;
  limit: number;
}

type IColumnOptions = {
  dataIndex: string;
  header: string;
  sortable?: boolean;
}

export type ITableData = {
  [key: string]: any;
}

type ITableOptions = {
  columns: IColumnOptions[];
  pagination: IPaginationOptions;
}

export enum SORT_TYPE {
  NONE,
  ASC,
  DESC
}

type ITableValue = {
  data: ITableData[];
  page: number;
  sortKey: string;
  sortType: SORT_TYPE;
}

// Props 定义在这里
export const tableProps = {
  options: {
    type: Object as PropType<ITableOptions>,
    default: () => ({})
  },
  value: {
    type: Object as PropType<ITableValue>,
    default: () => ({})
  }
}

export const paginationProps = {
  page: {
    type: Number,
    default: 1
  },
  total: {
    type: Number,
    default: 0
  },
  limit: {
    type: Number,
    default: 10
  }
}

export const tableHeadCellProps = {
  sortable: {
    type: Boolean,
    default: false
  },
  sortType: {
    type: Number,
    default: SORT_TYPE.NONE
  },
  content: {
    type: null,
    default: ''
  },
  dataIndex: {
    type: String
  }
}
export type TableHeadCellProps = IxPublicPropTypes<typeof tableHeadCellProps>;

export const tableCellProps = {
  content: {
    type: null,
    default: ''
  },
  dataIndex: {
    type: String
  }
}
export type TableCellProps = IxPublicPropTypes<typeof tableCellProps>;

export const tableRowProps = {
  columns: {
    type: Array as PropType<Array<TableCellProps>>,
    default: () => []
  },
  sortKey: {
    type: String,
    default: ''
  },
  sortType: {
    type: Number,
    default: SORT_TYPE.NONE
  },
  isHead: {
    type: Boolean,
    default: false
  }
}
export type TableRowProps = IxPublicPropTypes<typeof tableRowProps>;

export type TablePublicProps = IxPublicPropTypes<typeof tableProps>
