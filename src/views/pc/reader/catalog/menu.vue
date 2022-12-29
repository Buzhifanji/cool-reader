<script setup lang="ts">

const props = withDefaults(
  defineProps<{
    options: any[],
    label: string,
    children: string,
    value: any,
  }>(),
  {
    options: () => [],
    label: 'label',
    children: 'children',
    value: '',
  }
)

const emit = defineEmits(['update:value', 'change'])
const slectedKey = useVModel(props, 'value', emit)

let level = 1;

function flatten(arr: any[], isChild = false) {
  const result: any[] = [];
  for (let i = 0; i < arr.length; i++) {
    const { label, children } = props;
    const item = arr[i];

    result.push({
      ...item,
      key: item[label], // 此处可能 存在bug，书籍目录的名称可能重复
      label: item[label],
      className: `chapter-item-level${level}`
    })

    const _children = item[children]

    if (Array.isArray(_children) && _children.length > 0) {
      level += 1;
      result.push(...flatten(_children, true))
    }
  }
  if (isChild) {
    level -= 1
  }
  return result
}

const list = computed(() => {
  return flatten(props.options);
})

function onClick(value: any) {
  slectedKey.value = value.key
  emit('change', value)
}

</script>

<template>
  <ul class="catalog-list">
    <li v-for="item in list" class="chapter-item" :key="item.key" @click="onClick(item)">
      <div :class="['chapter-item-link', item.className, slectedKey === item.key ? 'chapter-item-link_seleted' : '']">
        <span class="chapter-item-text">
          {{ item.label }}
        </span>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.catalog-list {
  height: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  flex: auto;
  overflow: auto;
  margin-top: -24px;
  height: calc(100% - 220px);
}

.chapter-item {
  height: 52px;
  line-height: 52px;
  padding-left: 22px;
  padding-right: 22px;
  list-style: none;
  cursor: pointer;
}

.chapter-item-link {
  border-radius: 0;
  border: solid #ebedf1;
  border-width: 0 0 1px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #353c46;
}

.chapter-item-link_seleted {
  color: #18a058;
}

.chapter-item-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  word-wrap: normal;
  font-size: 15px;
}

.chapter-item-level2 {
  padding-left: 15px;
}

.chapter-item-level3 {
  padding-left: 30px;
}

.chapter-item-level4 {
  padding-left: 45px;
}
</style>