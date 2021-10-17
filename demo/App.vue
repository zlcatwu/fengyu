<template>
  <div>
    <TestTable :options="tableOptions" :data="data">
      <span>xxxxxx</span>
    </TestTable>
  </div>
</template>

<script lang="ts">
import { TestTable } from '../src/table'
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  name: 'App',
  components: {
    TestTable,
  },
  setup() {
    const tableOptions = ref({
      columns: [
        { key: 'index', header: 'Index', sortable: false },
        { key: 'name', header: 'Name', sortable: true }
      ],
      pagination: {
        enable: true
      }
    });
    const data = ref([
      { index: 1, name: 'xxx' },
      { index: 2, name: 'yyy' },
      { index: 3, name: 'zzz' }
    ]);

    return { tableOptions, data }
  },
})
</script>
