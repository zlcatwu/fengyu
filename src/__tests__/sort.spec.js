import { mount } from '@vue/test-utils'
import { FyTable } from '../table'
import TableBodyCell from '../table/TableBodyCell'
import TableHeaderCell from '../table/TableHeaderCell'
import { SORT_TYPE } from '../table/types'

const SORTABLE_CLASS = 'fy-table__header-column_sortable';
const SORTABLE_ASC_CLASS = 'fy-table__header-column_sortable_asc';
const SORTABLE_DESC_CLASS = 'fy-table__header-column_sortable_desc';

describe('Table: sort', () => {
  const TableMount = options => mount(FyTable, options)

  test('sort: sortable class should exits', () => {
    const wrapper = TableMount({
      propsData: {
        columns: [
          { dataIndex: 'name', header: 'Name', sortable: true }
        ]
      }
    });
    expect(wrapper.findAllComponents(TableHeaderCell).at(0).html().includes(SORTABLE_CLASS)).toBeTruthy();
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
    await wrapper.findAllComponents(TableHeaderCell).at(1).find('.' + SORTABLE_CLASS).trigger('click');
    sortedData.sort((a, b) => a.rank > b.rank ? 1 : -1);
    for (let i = 0; i < sortedData.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2).html().includes(sortedData[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2 + 1).html().includes(sortedData[i].rank)).toBeTruthy();
    }
    // 再点一次降序
    await wrapper.findAllComponents(TableHeaderCell).at(1).find('.' + SORTABLE_CLASS).trigger('click');
    sortedData.sort((a, b) => a.rank > b.rank ? -1 : 1);
    for (let i = 0; i < sortedData.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2).html().includes(sortedData[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2 + 1).html().includes(sortedData[i].rank)).toBeTruthy();
    }
    // 再点一次不排序
    await wrapper.findAllComponents(TableHeaderCell).at(1).find('.' + SORTABLE_CLASS).trigger('click');
    for (let i = 0; i < data.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2).html().includes(data[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2 + 1).html().includes(data[i].rank)).toBeTruthy();
    }

    // sortable: false 的列头应该找不到对应的排序样式
    expect(wrapper.findAllComponents(TableHeaderCell).at(0).find('.' + SORTABLE_CLASS).exists()).toBeFalsy();
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

    const rankIdx = 1;
    const rankHeaderCell = wrapper.findAllComponents(TableHeaderCell).at(rankIdx);
    // 升序
    // 检验数据与样式
    await wrapper.findAllComponents(TableHeaderCell).at(rankIdx).find('.' + SORTABLE_CLASS).trigger('click');
    const sortedData = [...data];
    sortedData.sort(sortFn);
    for (let i = 0; i < sortedData.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2).html().includes(sortedData[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2 + 1).html().includes(sortedData[i].rank)).toBeTruthy();
    }
    expect(rankHeaderCell.html().includes(SORTABLE_ASC_CLASS)).toBeTruthy();

    // 降序
    await wrapper.findAllComponents(TableHeaderCell).at(rankIdx).find('.' + SORTABLE_CLASS).trigger('click');
    sortedData.sort((a, b) => -sortFn(a, b));
    for (let i = 0; i < sortedData.length; i++) {
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2).html().includes(sortedData[i].name)).toBeTruthy();
      expect(wrapper.findAllComponents(TableBodyCell).at(i * 2 + 1).html().includes(sortedData[i].rank)).toBeTruthy();
    }
    expect(rankHeaderCell.html().includes(SORTABLE_DESC_CLASS)).toBeTruthy();

    // 恢复
    await wrapper.findAllComponents(TableHeaderCell).at(rankIdx).find('.' + SORTABLE_CLASS).trigger('click');
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

})
