import { mount } from '@vue/test-utils'
import { FyTable } from '../table'
import TableBodyCell from '../table/TableBodyCell'
import TableHeaderCell from '../table/TableHeaderCell'
import { SORT_TYPE } from '../table/types'
import Pagination from '../pagination/Pagination'

const SORTABLE_CLASS = 'fy-table__header-column_sortable';
const NEXT_CLASS = 'fy-pagination__next';

describe('Table', () => {
  const TableMount = options => mount(FyTable, options)

  test('render', () => {
    const wrapper = TableMount()
    expect(wrapper.html()).toMatchSnapshot()
    expect(() => {
      wrapper.vm.$forceUpdate()
      wrapper.vm.$destroy()
    }).not.toThrow()
  })

  test('options with simple columns and data', () => {
    const columns = [
      { dataIndex: 'name', header: 'Name' },
      { dataIndex: 'account', header: 'Account' }
    ];
    const data = [
      { name: 'name-1', account: 'account-1' },
      { name: 'name-2', account: 'account-2' }
    ];
    const wrapper = TableMount({
      propsData: {
        columns,
        data
      }
    });
    // 验证头部渲染正常
    const headerCells = wrapper.findAllComponents(TableHeaderCell);
    columns.forEach((column, idx) => {
      expect(headerCells.at(idx).html().includes(column.header)).toBeTruthy();
    });
    // 验证内容渲染正常
    const bodyCells = wrapper.findAllComponents(TableBodyCell);
    data.forEach((record, idx) => {
      expect(bodyCells.at(idx * 2).html().includes(record.name)).toBeTruthy();
      expect(bodyCells.at(idx * 2 + 1).html().includes(record.account)).toBeTruthy();
    });
  });

  test('slot', () => {
    const columns = [
      { dataIndex: 'name', header: 'Name' },
      { dataIndex: 'account', header: 'Account' }
    ];
    const data = [
      { name: 'name-1', account: 'account-1' },
      { name: 'name-2', account: 'account-2' }
    ];
    const wrapper = TableMount({
      propsData: {
        columns,
        data,
      },
      scopedSlots: {
        header__name: '<div slot-scope="scope">{{ scope.data.header.toUpperCase() }}</div>',
        body__name: '<div slot-scope="scope">{{scope.data.name.toUpperCase()}}</div>'
      }
    });

    const nameIdx = 0;
    const nameHeaderCell = wrapper.findAllComponents(TableHeaderCell).at(nameIdx);
    nameHeaderCell.html().includes(columns[nameIdx].header.toUpperCase());
    const nameBodyCells = wrapper.findAllComponents(TableBodyCell);
    data.forEach((record, idx) => {
      expect(nameBodyCells.at(idx * 2).html().includes(record.name.toUpperCase())).toBeTruthy();
    });
  });

  test('event trigger', async () => {
    const columns = [
      { dataIndex: 'name', header: 'Name', sortable: true }
    ];
    const data = [
      { name: 'name-1' },
      { name: 'name-2' }
    ];
    const wrapper = TableMount({
      propsData: {
        columns,
        data,
        paginationOptions: {
          enable: true,
          limit: 1,
          page: 1
        },
        sortOptions: {
          sortKey: '',
          sortType: SORT_TYPE.NONE
        }
      }
    });
    let events = [];
    wrapper.vm.$on('cell:click', data => events.push({
      event: 'cell:click',
      data
    }));
    wrapper.vm.$on('row:click', data => events.push({
      event: 'row:click',
      data
    }));
    wrapper.vm.$on('sort:change', data => events.push({
      event: 'sort:change',
      data
    }));
    wrapper.vm.$on('pagination:change', data => events.push({
      event: 'pagination:change',
      data
    }));
    await wrapper.findAllComponents(TableBodyCell).at(0).trigger('click');
    await wrapper.findComponent(TableHeaderCell).find('.' + SORTABLE_CLASS).trigger('click');
    await wrapper.findComponent(Pagination).find('.' + NEXT_CLASS).trigger('click');
    expect(events[0].event === 'cell:click').toBeTruthy();
    expect(events[0].data).toEqual({
      record: data[0],
      index: 0,
      column: columns[0]
    });
    expect(events[1].event === 'row:click').toBeTruthy();
    expect(events[1].data).toEqual({
      record: data[0],
      index: 0
    });
    expect(events[2].event === 'sort:change').toBeTruthy();
    expect(events[2].data).toEqual({
      sortKey: 'name',
      sortType: SORT_TYPE.ASC
    });
    expect(events[3].event === 'pagination:change').toBeTruthy();
    expect(events[3].data).toEqual({
      enable: true,
      page: 2,
      limit: 1
    });
  });

  test('filter function', () => {
    const data = [
      { name: 'name-1', age: 30 },
      { name: 'name-2', age: 50 },
      { name: 'name-3', age: 66 },
      { name: 'name-3', age: 58 },
      { name: 'name-3', age: 28 }
    ];
    const filterFn = record => record.age > 40;
    const paginationOptions = {
      enable: true,
      page: 1,
      limit: 2
    };
    const wrapper = TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name' },
          { dataIndex: 'age', header: 'Age' }
        ],
        data,
        paginationOptions,
        options: {
          filterFn: ({ data }) => data.filter(filterFn)
        }
      }
    });
    expect(wrapper.findComponent(Pagination).find('.fy-pagination__page').html().includes('1 / 2')).toBeTruthy();
    const handledData = data.filter(filterFn).slice(0, paginationOptions.limit)
    const cells = wrapper.findAllComponents(TableBodyCell);
    handledData.forEach((record, idx) => {
      expect(cells.at(idx * 2 + 1).html().includes(record.age)).toBeTruthy();
    });
  });

  test('wrong filter function', () => {
    const data = [
      { name: 'name-1', age: 30 },
      { name: 'name-2', age: 50 },
      { name: 'name-3', age: 66 },
      { name: 'name-3', age: 58 },
      { name: 'name-3', age: 28 }
    ];
    const paginationOptions = {
      enable: true,
      page: 1,
      limit: 2
    };
    const errorSpy = jest.spyOn(console, 'error');
    TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name' },
          { dataIndex: 'age', header: 'Age' }
        ],
        data,
        paginationOptions,
        options: {
          filterFn: ({ data }) => null
        }
      }
    });
    expect(errorSpy).toHaveBeenCalled();
  });

})
