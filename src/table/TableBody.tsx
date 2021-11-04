/**
 * Created by uedc on 2021/10/11.
 */

import { defineComponent, inject } from '@vue/composition-api'
import { tableCommonSymbol } from '../utils';
import TableBodyCell from './TableBodyCell';
import { ITableCommonData, tableBodyProps } from './types';

export default defineComponent({
  name: 'TableBody',
  props: tableBodyProps,
  setup() {
    const { onCellClick, onRowClick } = inject(tableCommonSymbol) as ITableCommonData;
    return {
      onCellClick,
      onRowClick
    };
  },
  render() {
    return <tbody>
      {this.data.map((record, rowIdx) => <tr
        onClick={() => this.onRowClick({ record, index: rowIdx })}
        class="fy-table__body-row">
        {this.columns.map((column, colIdx) => <TableBodyCell
          on={{
            'cell:click': () => this.onCellClick({ record, index: colIdx, column })
          }}
          column={column}
          data={record}
        />)}
      </tr>)}
    </tbody>
  }
})

