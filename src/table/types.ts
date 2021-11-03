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
  NONE = 'NONE',
  ASC = 'ASC',
  DESC = 'DESC'
}

// export enum SELECT_TYPE {
//   NONE = 'NONE',
//   MULTI = 'MULTI',
//   SINGLE = 'SINGLE'
// }

export type ITableData = {
  [key: string]: any;
}

export type Slot = (...args: any[]) => VNode[]

export type Slots = {
  [key: string]: Slot | undefined
};

// type ITableOptions = {
// }

// export type ISelectOptions = {
//   idProperty: string;
//   selected: Array<String | Number>;
//   selectType: SELECT_TYPE;
//   onBeforeSelect?: () => boolean;
//   renderFn?: () => VNode | void;
// }

export type ISortOptions = {
  sortKey: string;
  sortType: SORT_TYPE;
  remote: boolean;
}

export type IColumnOptions = {
  header: string;
  dataIndex: string;
  // visible?: boolean;
  sortable?: boolean;
  sortFn: (ra: ITableData, rb: ITableData) => number;
  slot?: ITableHeaderSlot & ITableContentSlot;
}

// Props 定义在这里
export const tableProps = {
  data: {
    type: Array as PropType<Array<ITableData>>,
    default: () => []
  },
  // options: {
  //   type: Object as PropType<ITableOptions>,
  //   default: () => ({})
  // },
  // selectOptions: {
  //   type: Object as PropType<ISelectOptions>,
  //   default: () => ({})
  // },
  paginationOptions: {
    type: Object as PropType<ITablePaginationOptions>,
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

export const tableHeaderProps = {
  columns: {
    type: Array as PropType<Array<IColumnOptions>>,
    default: () => []
  },
  sortOptions: {
    type: Object as PropType<ISortOptions>,
    default: () => ({})
  }
}

export const tableBodyProps = {
  columns: {
    type: Array as PropType<Array<IColumnOptions>>,
    default: () => []
  },
  data: {
    type: Array as PropType<Array<ITableData>>,
    default: () => []
  }
}

export const tableBodyCellProps = {
  column: {
    type: Object as PropType<IColumnOptions>,
    default: () => ({})
  },
  data: {
    type: Object as PropType<ITableData>,
    default: () => ({})
  }
}

export const tableHeaderCellProps = {
  column: {
    type: Object as PropType<IColumnOptions>,
    default: () => ({})
  },
  sortOptions: {
    type: Object as PropType<ISortOptions>,
    default: () => ({})
  }
}

// 表格的分页需要关注 enbale 与 remote，但分页器组件不需要关注
export type ITablePaginationOptions = {
  enable: boolean;
  limit: number;
  page: number;
  total: number;
  remote?: boolean;
}

export type ITableHeaderSlot = (options: {
  value: any,
  data: IColumnOptions
}) => VNode;
export type ITableContentSlot = (options: {
  value: any,
  data: ITableData
}) => VNode;

export type ICellClickEvent = {
  record: ITableData;
  column: IColumnOptions;
  index: number;
};

export type IRowClickEvent = {
  record: ITableData;
  index: number;
};

export type TablePublicProps = IxPublicPropTypes<typeof tableProps>
