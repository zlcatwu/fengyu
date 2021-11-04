import {
  TablePublicProps,
  Slots
} from '../table/types';
import { computed } from '@vue/composition-api';
import { DEBUG } from '../utils';

export function useColumns (props: TablePublicProps, slots: Slots) {
  DEBUG({
    msg: `useColumns get slots ${Object.keys(slots).join(', ')}}`,
    module: 'Table',
    devOnly: true
  });
  const headerColumns = computed(() => (props.columns?.map(column => ({
    ...column,
    slot: slots[`header__${column.dataIndex}`]
  }))));
  const bodyColumns = computed(() => props.columns?.map(column => ({
    ...column,
    slot: slots[`body__${column.dataIndex}`]
  })));

  return {
    headerColumns,
    bodyColumns
  };
}
