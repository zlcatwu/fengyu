import { computed } from '@vue/composition-api'
import {
  IDisplayedDataOpt, IDataWrapperFn, ITableData, ISortOptions,
  IColumnOptions, SORT_TYPE, ITablePaginationOptions
} from '../table/types';

export function useDisplayedData (props: IDisplayedDataOpt) {
  const sortWrapper: IDataWrapperFn = ({ data, sortOptions, columns }: {
    data: ITableData[],
    sortOptions: ISortOptions,
    columns: IColumnOptions[]
  }) => {
    const sortedData = [...data];
    if (sortOptions.remote || sortOptions.sortType === SORT_TYPE.NONE) {
      return sortedData;
    }

    const sortColumn = columns?.find(col => col.dataIndex === sortOptions.sortKey);
    let defaultFn = (a: ITableData, b: ITableData) => a[sortOptions.sortKey] > b[sortOptions.sortKey] ? 1 : -1;
    const sortFn = sortColumn?.sortFn || defaultFn;
    const descSortFn = (a: ITableData, b: ITableData) => -sortFn(a, b);

    sortedData.sort(sortOptions.sortType === SORT_TYPE.ASC ? sortFn : descSortFn);

    return sortedData;
  };
  const paginationWrapper: IDataWrapperFn = ({ data, paginationOptions }: {
    data: ITableData[],
    paginationOptions: ITablePaginationOptions
  }) => {
    const paginationData = [...data];
    if (paginationOptions.remote || !paginationOptions.enable) {
      return paginationData;
    }

    const start = paginationOptions.limit * (paginationOptions.page - 1);
    const end = start + paginationOptions.limit;
    return paginationData.slice(start, end);
  };
  const compose: (...fns: IDataWrapperFn[]) => (data: ITableData[], opt: Partial<IDisplayedDataOpt>) => ITableData[] = (...fns) => {
    return (data, opt) => fns.reduce((handledData, curFn) => curFn.call(null, {
        ...opt,
        data: handledData
      } as IDisplayedDataOpt), data);
  };
  const displayedData = computed(() => {
    // 数据流： sort => pagination，每一层的 data 传递给下一层
    const fn = compose(sortWrapper, paginationWrapper);
    let data = fn(props.data, props);
    return data;
  });
  return {
    displayedData
  };
}
