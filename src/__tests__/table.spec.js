import { mount } from '@vue/test-utils'
import { FyTable } from '../table'
import TableHeadCell from '../table/TableHeadCell';
import Pagination from '../table/Pagination';
import TableCell from '../table/TableCell';
import TableRow from '../table/TableRow';

describe('Table', () => {
  const TableMount = options => mount(FyTable, options)

  test('empty options render', () => {
    const wrapper = TableMount({});
    expect(wrapper.find('.fy-table').exists()).toBe(true);
  })

  test('options with columns but no data', () => {
    const columns = [
      { dataIndex: 'id', header: 'ID' },
      { dataIndex: 'name', header: 'Name' },
      { dataIndex: 'phone', header: 'Phone' }
    ]
    const wrapper = TableMount({
      propsData: {
        options: {
          columns
        }
      }
    })
    const headCells = wrapper.findAllComponents(TableHeadCell)
    columns.forEach((item, idx) => {
      expect(headCells.at(idx).text()).toBe(columns[idx].header)
    })
  })

  test('options with columns and data', () => {
    const columns = [
      { dataIndex: 'id', header: 'ID' },
      { dataIndex: 'name', header: 'Name' },
      { dataIndex: 'phone', header: 'Phone' }
    ]
    const data = [
      { id: 1, name: 'aaa', phone: '123' },
      { id: 2, name: 'bbb', phone: '456' }
    ];
    const wrapper = TableMount({
      propsData: {
        options: {
          columns
        },
        value: {
          data
        }
      }
    })
    const tableRows = wrapper.findAllComponents(TableRow)
    expect(tableRows.length).toBe(data.length + 1);
    data.forEach((item, idx) => {
      const cells = tableRows.at(idx + 1).findAllComponents(TableCell);
      columns.forEach((col, colIdx) => {
        expect(cells.at(colIdx).text()).toBe(String(item[col.dataIndex]));
      });
    })
  })

  test('options with pagiation enable', () => {
    const wrapper = TableMount({
      propsData: {
        options: {
          pagination: { enable: true }
        }
      }
    })
    expect(wrapper.findComponent(Pagination).exists()).toBe(true);
  })

  test('options with pagination disable', () => {
    const wrapper = TableMount({
      propsData: {
        options: {
          pagination: { enable: false }
        }
      }
    })
    expect(wrapper.findComponent(Pagination).exists()).toBe(false);
  })

  test('options with pagination default disable', () => {
    const wrapper = TableMount({
      propsData: {
        options: {}
      }
    })
    expect(wrapper.findComponent(Pagination).exists()).toBe(false);
  })

  test('options with pagination.limit', () => {
    const columns = [
      { dataIndex: 'id', header: 'ID' },
      { dataIndex: 'name', header: 'Name' },
      { dataIndex: 'phone', header: 'Phone' }
    ]
    const data = [
      { id: 1, name: 'aaa', phone: '123' },
      { id: 2, name: 'bbb', phone: '456' },
      { id: 3, name: 'ccc', phone: '1234' },
      { id: 4, name: 'ddd', phone: '4441' },
      { id: 5, name: 'eee', phone: '2312' }
    ];
    const limit = 2;
    const wrapper = TableMount({
      propsData: {
        options: {
          columns,
          pagination: {
            enable: true,
            limit
          }
        },
        value: {
          data,
          page: 1
        }
      }
    })

    // TODO: how to test v-model?
    const tableRows = wrapper.findAllComponents(TableRow)
    expect(tableRows.length).toBe(limit + 1);
    data.slice(0, limit).forEach((item, idx) => {
      const cells = tableRows.at(idx + 1).findAllComponents(TableCell);
      columns.forEach((col, colIdx) => {
        expect(cells.at(colIdx).text()).toBe(String(item[col.dataIndex]));
      });
    })
  })

  test('options with pagination.limit default', () => {
    const columns = [
      { dataIndex: 'id', header: 'ID' },
      { dataIndex: 'name', header: 'Name' },
      { dataIndex: 'phone', header: 'Phone' }
    ]
    const data = [
      { id: 1, name: 'aaa', phone: '123' },
      { id: 2, name: 'bbb', phone: '456' },
      { id: 3, name: 'ccc', phone: '1234' },
      { id: 4, name: 'ddd', phone: '4441' },
      { id: 5, name: 'eee', phone: '2312' },
      { id: 6, name: 'eee', phone: '2312' },
      { id: 7, name: 'eee', phone: '2312' },
      { id: 8, name: 'eee', phone: '2312' },
      { id: 9, name: 'eee', phone: '2312' },
      { id: 10, name: 'eee', phone: '2312' },
      { id: 11, name: 'eee', phone: '2312' },
      { id: 12, name: 'eee', phone: '2312' }
    ];
    const defaultLimit = 10;
    const wrapper = TableMount({
      propsData: {
        options: {
          columns,
          pagination: {
            enable: true
          }
        },
        value: {
          data,
          page: 1
        }
      }
    })

    const tableRows = wrapper.findAllComponents(TableRow)
    expect(tableRows.length).toBe(defaultLimit + 1);
    data.slice(0, defaultLimit).forEach((item, idx) => {
      const cells = tableRows.at(idx + 1).findAllComponents(TableCell);
      columns.forEach((col, colIdx) => {
        expect(cells.at(colIdx).text()).toBe(String(item[col.dataIndex]));
      });
    })
  })

  test('options with pagination.limit', async () => {
    const columns = [
      { dataIndex: 'id', header: 'ID' },
      { dataIndex: 'name', header: 'Name' },
      { dataIndex: 'phone', header: 'Phone' }
    ]
    const data = [
      { id: 1, name: 'aaa', phone: '123' },
      { id: 2, name: 'bbb', phone: '456' },
      { id: 3, name: 'ccc', phone: '1234' },
      { id: 4, name: 'ddd', phone: '4441' }
    ];
    const limit = 2;
    const wrapper = TableMount({
      propsData: {
        options: {
          columns,
          pagination: {
            enable: true,
            limit
          }
        },
        value: {
          data,
          page: 1
        }
      }
    })

    const pagination = wrapper.findComponent(Pagination);
    // TODO: It seems not change the data, but the code did run
    await pagination.find('.fy-table-pagination__next').trigger('click');
    const tableRows = wrapper.findAllComponents(TableRow)
    expect(tableRows.length).toBe(limit + 1);
    data.slice(limit, limit * 2).forEach((item, idx) => {
      const cells = tableRows.at(idx + 1).findAllComponents(TableCell);
      columns.forEach((col, colIdx) => {
        expect(cells.at(colIdx).text()).toBe(String(item[col.dataIndex]));
      });
    })
  })

})
