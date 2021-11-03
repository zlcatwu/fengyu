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
    const wrapper = TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name' },
          { dataIndex: 'account', header: 'Account' }
        ],
        data: [
          { name: 'name-1', account: 'account-1' },
          { name: 'name-2', account: 'account-2' }
        ]
      }
    });
    expect(wrapper.findAllComponents(TableHeaderCell).at(0).html().includes('Name')).toBeTruthy();
    expect(wrapper.findAllComponents(TableHeaderCell).at(1).html().includes('Account')).toBeTruthy();
    expect(wrapper.findAllComponents(TableBodyCell).at(0).html().includes('name-1')).toBeTruthy();
    expect(wrapper.findAllComponents(TableBodyCell).at(1).html().includes('account-1')).toBeTruthy();
    expect(wrapper.findAllComponents(TableBodyCell).at(2).html().includes('name-2')).toBeTruthy();
    expect(wrapper.findAllComponents(TableBodyCell).at(3).html().includes('account-2')).toBeTruthy();
  });

  test('slot', () => {
    const wrapper = TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name' },
          { dataIndex: 'account', header: 'Account' }
        ],
        data: [
          { name: 'name-1', account: 'account-1' },
          { name: 'name-2', account: 'account-2' }
        ],
      },
      slots: {
        header__name: '<div>NAME</div>'
      },
      scopedSlots: {
        body__name: '<div slot-scope="scope">[ {{scope.data.name.toUpperCase()}} ]</div>'
      }
    });
    expect(wrapper.findAllComponents(TableHeaderCell).at(0).html().includes('NAME')).toBeTruthy();
    expect(wrapper.findAllComponents(TableBodyCell).at(0).html().includes('NAME-1')).toBeTruthy();
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

})
