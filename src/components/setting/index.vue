<script setup lang="ts">
import { Langs } from 'src/enums';
import { language, langField } from 'src/i18n';
import { activeTheme } from 'src/theme'

const props = withDefaults(defineProps<{ show: boolean }>(), {
  show: false,
})
const emit = defineEmits(['update:show'])

const show = computed({
  get: () => props.show,
  set: (val: boolean) => emit('update:show', val)
})


const langOptions = ref([
  { label: '简体中文', value: Langs.zhCN },
  { label: 'English', value: Langs.enUS },
])

function updateModel(value: boolean) {
  emit('update:show', false)
}
</script>

<template>
  <n-modal v-model:show="show" :title="langField.setting" style="width: 50%;" preset="card" size="huge"
    :bordered="false" @update:show="updateModel">
    <n-space class="space" justify="space-between">
      <n-h4>{{ langField.settingLange }}</n-h4>
      <n-select style="width: 160px" v-model:value="language" :options="langOptions" />
    </n-space>
    <n-space class="space" justify="space-between">
      <n-h4>{{ langField.theme }}</n-h4>
      <n-switch v-model:value="activeTheme">
        <template #checked>
          {{ langField.themeDark }}
        </template>
        <template #unchecked>
          {{ langField.themeLight }}
        </template>
      </n-switch>
    </n-space>
  </n-modal>
</template>

<style scoped>
.space {
  margin-bottom: 10px;
}
</style>