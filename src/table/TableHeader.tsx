/**
 * Created by uedc on 2021/10/11.
 */

import { defineComponent } from '@vue/composition-api'
import { TRACE } from '../utils';
import TableHeaderCell from './TableHeaderCell';
import { ISortOptions, tableHeaderProps } from './types';

export default defineComponent({
    name: 'TableHeader',
    props: tableHeaderProps,
    setup(props, { emit }) {
      const onUpdateSortOptions = (opt: ISortOptions) => {
        TRACE({
          msg: `onUpdateSortOptions trigger update:sortOptions ${JSON.stringify(opt)}`,
          module: 'TableHeader'
        });
        emit('update:sortOptions', opt);
      };
      return {
        onUpdateSortOptions
      };
    },
    render() {
      return <thead>
        <tr class="fy-table__header-row">
          {this.columns.map(column => <TableHeaderCell
            column={column}
            sortOptions={this.sortOptions}
            on={{
              'update:sortOptions': this.onUpdateSortOptions
            }}
          />)}
        </tr>
      </thead>
    }
})
