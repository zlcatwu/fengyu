/**
 * Created by uedc on 2021/10/11.
 */

import { defineComponent } from '@vue/composition-api'
import TableHeaderCell from './TableHeaderCell';
import { tableHeaderProps } from './types';

export default defineComponent({
    name: 'TableHeader',
    props: tableHeaderProps,
    render() {
      return <thead>
        <tr class="fy-table__header-row">
          {this.columns.map(column => <TableHeaderCell
            column={column}
            sortOptions={this.sortOptions}
          />)}
        </tr>
      </thead>
    }
})
