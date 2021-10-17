<template>
  <div>
    <TestTable :test="test">
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
    const test = ref(true)

    return { test }
  },
})
</script>
