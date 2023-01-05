<script setup lang="ts">
import { Langs } from 'src/enums';
import { language, langField } from 'src/i18n';
import { config } from 'src/config'
import { message } from 'src/naive';

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

function handleChange() {
  message.success(langField.value.updateSuccess)
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
      <n-switch v-model:value="config.theme" @update:value="handleChange">
        <template #checked>
          {{ langField.themeDark }}
        </template>
        <template #unchecked>
          {{ langField.themeLight }}
        </template>
      </n-switch>
    </n-space>
    <n-space class="space" justify="space-between">
      <n-h4>{{ langField.multiWindow }}</n-h4>
      <n-switch v-model:value="config.multiWindow" @update:value="handleChange">
        <template #checked>
          {{ langField.yes }}
        </template>
        <template #unchecked>
          {{ langField.no }}
        </template>
      </n-switch>
    </n-space>
    <n-text tag="div" depth="3" class="tip">{{ langField.multiWindowTip }}</n-text>
  </n-modal>
</template>

<style scoped>
.space {
  margin-bottom: 10px;
}

.tip {
  margin-top: -30px;
  margin-bottom: 10px;

}
</style>