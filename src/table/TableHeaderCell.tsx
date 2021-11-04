/**
 * Created by uedc on 2021/10/11.
 */

import { computed, defineComponent, inject } from '@vue/composition-api'
import { tableCommonSymbol, TRACE } from '../utils';
import { tableHeaderCellProps, ISortOptions, SORT_TYPE, IColumnOptions, ITableCommonData } from './types';

export default defineComponent({
  name: 'TableHeaderCell',
  props: tableHeaderCellProps,
  setup(props, { emit }) {
    const { nextType, sortCls } = useSortStates(props);
    const { onSortChange: onRootSortChange } = inject(tableCommonSymbol) as ITableCommonData;
    const onSortChange = () => {
      const nextSortOptions: ISortOptions = {
          sortType: nextType.value,
          sortKey: props.column.dataIndex,
          remote: props.sortOptions.remote
      };
      TRACE({
        msg: `onSortChange trigger update:sortOptions ${JSON.stringify(nextSortOptions)}`,
        module: 'TableHeaderCell'
      });
      onRootSortChange(nextSortOptions);
    };
    const onClick = () => emit('cell:click');
    return {
      onSortChange,
      sortCls,
      onClick
    };
  },
  render() {
    return <th onClick={this.onClick} class="fy-table__header-column">
      <span class="fy-table__header-column__value">
        {this.column.slot ? this.column.slot({
          value: this.column.header,
          data: this.column
        }) : this.column.header}
      </span>
      {this.column.sortable && <span
        onClick={() => this.onSortChange() }
        class={this.sortCls} />}
    </th>
  }
})

function useSortStates(options: {
  column: IColumnOptions,
  sortOptions: ISortOptions
}) {
  const sortClsMap = {
      [SORT_TYPE.NONE]: '',
      [SORT_TYPE.ASC]: 'fy-table__header-column_sortable_asc',
      [SORT_TYPE.DESC]: 'fy-table__header-column_sortable_desc',
  };
  const nextSortTypeMap = {
      [SORT_TYPE.NONE]: SORT_TYPE.ASC,
      [SORT_TYPE.ASC]: SORT_TYPE.DESC,
      [SORT_TYPE.DESC]: SORT_TYPE.NONE
  };
  const curType = computed(() => options.column.dataIndex === options.sortOptions.sortKey ? options.sortOptions.sortType : SORT_TYPE.NONE);
  const nextType = computed(() => nextSortTypeMap[curType.value]);
  const sortCls = computed(() => [
    'fy-table__header-column_sortable',
    sortClsMap[options.column.dataIndex === options.sortOptions.sortKey ? options.sortOptions.sortType : SORT_TYPE.NONE]
  ].join(' '));
  return {
      sortCls,
      nextType
  };
}
