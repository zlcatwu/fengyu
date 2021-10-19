/**
 * Created by uedc on 2021/10/11.
 */

import { defineComponent } from '@vue/composition-api'
import { SORT_TYPE, TableCellProps, TableHeadCellProps, tableRowProps } from './types'
import TableCell from './TableCell';
import TableHeadCell from './TableHeadCell';

export default defineComponent({
  name: 'TableRow',
  props: tableRowProps,
  setup(props, { emit }) {
    const renderHeadCell = (col: TableHeadCellProps) => <TableHeadCell
        sortable={col.sortable}
        sortType={props.sortKey === col.dataIndex ? props.sortType : SORT_TYPE.NONE}
        dataIndex={col.dataIndex}
        on={{
          'update:sortKey': (key: String) => emit('update:sortKey', key)
          }}>
          {col.content}
      </TableHeadCell>;
    const renderCell = (col: TableCellProps) => <TableCell
      dataIndex={col.dataIndex}>
      {col.content}
    </TableCell>;

    return {
      renderHeadCell,
      renderCell
    };
  },
  render() {
    const renderFn = this.isHead ? this.renderHeadCell : this.renderCell;
    return <tr>
      {this.columns.map(col => renderFn.call(this, col))}
    </tr>
  }
})
