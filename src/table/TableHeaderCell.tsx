/**
 * Created by uedc on 2021/10/11.
 */

import { defineComponent, inject } from '@vue/composition-api'
import { useSortStates } from '../composables/use-sort-states';
import { tableCommonSymbol, TRACE } from '../utils';
import { tableHeaderCellProps, ISortOptions, ITableCommonData } from './types';

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
        module: 'TableHeaderCell',
        devOnly: true
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
