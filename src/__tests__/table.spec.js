import { mount } from '@vue/test-utils'
import { FyTable } from '../table'
import TableBodyCell from '../table/TableBodyCell'
import TableHeaderCell from '../table/TableHeaderCell'
import { SORT_TYPE } from '../table/types'
import Pagination from '../pagination/Pagination'

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

  test('options with sample columns and data', () => {
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

  test('sort: sortable class should exits', () => {
    const wrapper = TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name', sortable: true }
        ]
      }
    });
    expect(wrapper.findAllComponents(TableHeaderCell).at(0).html().includes('fy-table__header-column_sortable')).toBeTruthy();
  });

  test('sort: built-in sort', async () => {
    const data = [
        { name: 'name-5', rank: 5 },
        { name: 'name-3', rank: 3 },
        { name: 'name-2', rank: 2 },
        { name: 'name-4', rank: 4 },
        { name: 'name-1', rank: 1 }
    ];
    const wrapper = TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name' },
          { dataIndex: 'rank', header: 'Rank', sortable: true }
        ],
        data: [
          ...data
        ],
        sortOptions: {
          sortKey: '',
          sortType: SORT_TYPE.NONE
        }
      }
    });
    let sortedData = [...data];
    // .sync 写法单纯触发事件不会更新视图，需要手动 setProps 一下
    wrapper.vm.$on('update:sortOptions', (opt) => {
      wrapper.setProps({
        sortOptions: opt
      })
    });
    // 点一次升序
    await wrapper.findAllComponents(TableHeaderCell).at(1).trigger('click');
    sortedData.sort((a, b) => a.rank > b.rank ? 1 : -1);
    for (let i = 0; i < sortedData.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2).html().includes(sortedData[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2 + 1).html().includes(sortedData[i].rank)).toBeTruthy();
    }
    // 再点一次降序
    await wrapper.findAllComponents(TableHeaderCell).at(1).trigger('click');
    sortedData.sort((a, b) => a.rank > b.rank ? -1 : 1);
    for (let i = 0; i < sortedData.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2).html().includes(sortedData[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2 + 1).html().includes(sortedData[i].rank)).toBeTruthy();
    }
    // 再点一次不排序
    await wrapper.findAllComponents(TableHeaderCell).at(1).trigger('click');
    for (let i = 0; i < data.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2).html().includes(data[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2 + 1).html().includes(data[i].rank)).toBeTruthy();
    }

    // 点击 sortable: false 的列，应该无效果
    await wrapper.findAllComponents(TableHeaderCell).at(0).trigger('click');
    for (let i = 0; i < data.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2).html().includes(data[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2 + 1).html().includes(data[i].rank)).toBeTruthy();
    }
  });

  test('sort: custom sort', async () => {
    const data = [
      { name: 'name-1', rank: 5 },
      { name: 'name-2', rank: 3 },
      { name: 'name-3', rank: 2 },
      { name: 'name-4', rank: 4 },
      { name: 'name-5', rank: 1 }
    ];
    const sortFn = (a, b) => a.rank < b.rank ? 1 : -1;
    const wrapper = TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name' },
          { dataIndex: 'rank', header: 'Rank', sortable: true, sortFn }
        ],
        data
      }
    });
    // .sync 写法单纯触发事件不会更新视图，需要手动 setProps 一下
    wrapper.vm.$on('update:sortOptions', (opt) => {
      wrapper.setProps({
        sortOptions: opt
      })
    });
    await wrapper.findAllComponents(TableHeaderCell).at(1).trigger('click');
    const sortedData = [...data];
    sortedData.sort(sortFn);
    for (let i = 0; i < sortedData.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2).html().includes(sortedData[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2 + 1).html().includes(sortedData[i].rank)).toBeTruthy();
    }

    await wrapper.findAllComponents(TableHeaderCell).at(1).trigger('click');
    sortedData.sort((a, b) => -sortFn(a, b));
    for (let i = 0; i < sortedData.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2).html().includes(sortedData[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2 + 1).html().includes(sortedData[i].rank)).toBeTruthy();
    }

    await wrapper.findAllComponents(TableHeaderCell).at(1).trigger('click');
    for (let i = 0; i < data.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2).html().includes(data[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2 + 1).html().includes(data[i].rank)).toBeTruthy();
    }
  })

  test('sort: remote sort', async () => {
    const data = [
      { name: 'name-1', rank: 5 },
      { name: 'name-2', rank: 3 },
      { name: 'name-3', rank: 2 },
      { name: 'name-4', rank: 4 },
      { name: 'name-5', rank: 1 }
    ];
    const wrapper = TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name' },
          { dataIndex: 'rank', header: 'Rank', sortable: true }
        ],
        data,
        sortOptions: {
          sortKey: '',
          sortType: SORT_TYPE.NONE,
          remote: true
        }
      }
    });
    // .sync 写法单纯触发事件不会更新视图，需要手动 setProps 一下
    wrapper.vm.$on('update:sortOptions', (opt) => {
      wrapper.setProps({
        sortOptions: opt
      })
    });
    // 配了 remote 的点击后不会引起数据更新，单纯外发事件交由外部处理
    await wrapper.findAllComponents(TableHeaderCell).at(1).trigger('click');
    for (let i = 0; i < data.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2).html().includes(data[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2 + 1).html().includes(data[i].rank)).toBeTruthy();
    }
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

  test('pagination: limit < data.length', () => {
    const wrapper = TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name', sortable: true }
        ],
        data: [
          { name: 'xxx' },
          { name: 'yyy' },
          { name: 'zzz' }
        ],
        paginationOptions: {
          enable: true,
          limit: 5,
          page: 1
        }
      }
    });
    expect(wrapper.findComponent(Pagination).exists()).toBeTruthy();
  });

  test('pagination: limit > data.length', async () => {
    const wrapper = TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name' }
        ],
        data: [
          { name: 'name-1' },
          { name: 'name-2' },
          { name: 'name-3' }
        ],
        paginationOptions: {
          enable: true,
          limit: 2,
          page: 1
        }
      }
    });
    // 共2页，当前第1页
    expect(wrapper.findComponent(Pagination).html().includes('(1 / 2)')).toBeTruthy();
    // .sync 写法单纯触发事件不会更新视图，需要手动 setProps 一下
    wrapper.vm.$on('update:paginationOptions', (opt) => {
      wrapper.setProps({
        paginationOptions: opt
      })
    });

    // 在第一页点上一页，应该无效果
    await wrapper.findComponent(Pagination).find('.fy-pagination__prev').trigger('click');
    expect(wrapper.findAllComponents(TableBodyCell).at(0).html().includes('name-1')).toBeTruthy();

    // 正常跳转下一页
    await wrapper.findComponent(Pagination).find('.fy-pagination__next').trigger('click');
    expect(wrapper.findAllComponents(TableBodyCell).at(0).html().includes('name-3')).toBeTruthy();

    // 在最后一页点下一页，应该无效果
    await wrapper.findComponent(Pagination).find('.fy-pagination__next').trigger('click');
    expect(wrapper.findAllComponents(TableBodyCell).at(0).html().includes('name-3')).toBeTruthy();
  });

  test('pagination: remote pagination', async () => {
    const wrapper = TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name' }
        ],
        data: [
          { name: 'name-1' },
          { name: 'name-2' }
        ],
        paginationOptions: {
          limit: 2,
          page: 1,
          total: 10,
          remote: true,
          enable: true
        }
      }
    });
    // .sync 写法单纯触发事件不会更新视图，需要手动 setProps 一下
    wrapper.vm.$on('update:paginationOptions', (opt) => {
      wrapper.setProps({
        paginationOptions: opt
      })
    });

    expect(wrapper.findComponent(Pagination).html().includes('1 / 5')).toBeTruthy();

    // 有下一页，但点击只触发事件，数据更新交由外部去做
    await wrapper.findComponent(Pagination).find('.fy-pagination__next').trigger('click');
    expect(wrapper.findAllComponents(TableBodyCell).at(0).html().includes('name-1')).toBeTruthy();
  });

})
