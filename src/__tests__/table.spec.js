import { mount } from '@vue/test-utils'
import { FyTable } from '../table'
import TableHeadCell from '../table/TableHeadCell';
import Pagination from '../table/Pagination';
import TableCell from '../table/TableCell';
import TableRow from '../table/TableRow';

describe('Table', () => {
  const TableMount = options => mount(FyTable, options)

  test('empty options render without error', () => {
  })

  test('options with sample columns and data', () => {
  });

  test('column.visible: false should not render', () => {});

  test('column.sortable: true should render the sortable class', () => {});

  test('column content slot', () => {});
  test('column header slot', () => {});

  test('pagination.enable: false should not render the pagination', () => {});

  test('pagination.limit < data.length', () => {});
  test('pagination.limit > data.length', () => {});
  test('pagination.limit > data.length');

})
