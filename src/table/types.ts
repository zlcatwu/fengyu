/* eslint-disable @typescript-eslint/no-explicit-any */

import { VNode } from 'vue'
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

export enum SORT_TYPE {
  NONE,
  ASC,
  DESC
}

export enum SELECT_TYPE {
  NONE,
  MULTI,
  SINGLE
}

type ITableData = {
  [key: string]: any;
}

type ITableOptions = {
  selectType: SELECT_TYPE,
  selectRenderFn: (record: ITableData) => VNode | void
}

type IPaginationOptions = {
  enable: boolean;
  limit: number;
  page: number;
  total: number;
  remote: boolean;
}

type ISortOptions = {
  sortKey: string;
  sortType: SORT_TYPE;
  sortFn: (ra: ITableData, rb: ITableData) => number;
  remote: boolean;
}

type IColumnOptions = {
  header: string;
  dataIndex: string;
  visible: boolean;
  sortable: boolean;
}

// Props 定义在这里
export const tableProps = {
  data: {
    type: Array as PropType<Array<ITableData>>,
    default: () => []
  },
  options: {
    type: Object as PropType<ITableOptions>,
    default: () => ({})
  },
  paginationOptions: {
    type: Object as PropType<IPaginationOptions>,
    default: () => ({})
  },
  sortOptions: {
    type: Object as PropType<ISortOptions>,
    default: () => ({})
  },
  columns: {
    type: Array as PropType<Array<IColumnOptions>>,
    default: () => []
  }
}

export type TablePublicProps = IxPublicPropTypes<typeof tableProps>
