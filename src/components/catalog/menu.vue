<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    options: any[],
    keyFiled: string,
    label: string,
    children: string,
    value: string,
  }>(),
  {
    options: () => [],
    keyFiled: 'key',
    label: 'label',
    children: 'children',
    value: '',
  }
)

const emit = defineEmits(['update:value'])
const slectedKey = useVModel(props, 'value', emit)

let level = 1;

function flatten(arr: any[], isChild = false) {
  const result: any[] = [];
  for (let i = 0; i < arr.length; i++) {
    const { keyFiled, label, children } = props;
    const item = arr[i];

    result.push({
      key: item[keyFiled],
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

function onClick(value: string) {
  slectedKey.value = value
  emit('update:value', value)
}

</script>

<template>
  <ul class="catalog-list">
    <li v-for="item, index in list" class="chapter-item" @click="onClick(item.key)">
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
  height: calc(100% - 200px);
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