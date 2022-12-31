

<script setup lang="ts">
import { useContextMenu } from "./book";
import { langField } from "src/i18n/index";
import { BookData } from "src/interfaces";
import { createWin, setReaderWinUlr } from "src/core/windows";
import { handleCover } from "src/utils";
import { downloadFile, useBookListStore, useDownloadFieStore } from "src/core/book";
import { notification } from "src/naive";
import { config } from "src/config";
import { RouterName } from "src/enums";

const downloadFileStore = useDownloadFieStore();
const bookListStore = useBookListStore();

bookListStore.init();

const {
  showDropdownRef,
  xRef,
  yRef,
  handleSelect,
  handleContextMenu,
  onClickOutside,
  menus,
} = useContextMenu();

const router = useRouter();

const stop = onKeyStroke(["i", "I"], (e) => {
  e.preventDefault();
  downloadFile()
});

const open = ({ id, bookName }: BookData) => {
  if (config.multiWindow) {
    const url = setReaderWinUlr(id)
    createWin(id, { url, title: bookName })
  } else {
    router.push({ name: RouterName.reader, query: { id } })
  }
}

const deleteBook = (id: string) => {
  bookListStore.remove(id).then(({ result, name }) => {
    if (result) {
      notification.success({
        content: langField.value.deleteSuccess,
        meta: name,
        duration: 2000,
        keepAliveOnHover: true,
      });
    }
  })
}

onUnmounted(() => {
  stop()
})

</script>

<template>
  <n-progress v-if="downloadFileStore.downloadProgress" type="line" :percentage="downloadFileStore.downloadProgress"
    :indicator-placement="'inside'" processing />
  <template v-if="bookListStore.bookList.length">
    <!-- <div class="card-wrapper">
      <n-card :bordered="false" v-for="item in books" :key="item.id" @contextmenu="handleContextMenu($event, item.id)"
        @click="open(item)">
        <template #cover>
          <div class="book-cover">
            <n-image :src="item.cover" :fallback-src="DefaultBookCover" preview-disabled />
            <span class="book-cover-detour"></span>
          </div>
        </template>
        <n-ellipsis :line-clamp="2">
          {{ item.bookName }}
        </n-ellipsis>
      </n-card>
      <n-dropdown placement="bottom-start" trigger="manual" :x="xRef" :y="yRef" :options="menus" :show="showDropdownRef"
        :on-clickoutside="onClickOutside" @select="handleSelect" />
    </div> -->
    <!-- 列表模式 -->
    <div class="list-wrapper" v-for="item in bookListStore.bookList" :key="item.id">
      <div class="list-content-left" @click="open(item)">
        <img class="list-img" :src="handleCover(item.cover)" alt="">
      </div>
      <div class="list-content-center" @click="open(item)">
        <div>{{ item.bookName }}</div>
        <div>作者</div>
        <div class="progress">
          <div class="progress-content" :style="{ width: item.readProgress + '%' }"></div>
        </div>
      </div>
      <div class="list-content-right">
        <n-popover trigger="hover" placement="bottom">
          <template #trigger>
            <i class="icon" @click="deleteBook(item.id)">
              <svg t="1670912142614" class="icon" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="5110" width="200" height="200">
                <path
                  d="M354.133 418.133c-17.066 0-34.133 12.8-34.133 34.134V793.6c0 17.067 12.8 34.133 34.133 34.133S384 810.667 384 793.6V452.267c0-21.334-12.8-34.134-29.867-34.134z m157.867 0c-17.067 0-34.133 12.8-34.133 34.134V793.6c0 17.067 12.8 34.133 34.133 34.133s34.133-12.8 34.133-34.133V452.267c0-21.334-17.066-34.134-34.133-34.134z m128 34.134V793.6c0 17.067 12.8 34.133 34.133 34.133s34.134-12.8 34.134-34.133V452.267c0-17.067-12.8-34.134-34.134-34.134S640 430.933 640 452.267z"
                  p-id="5111" fill="#515151"></path>
                <path
                  d="M938.667 128H725.333v-21.333C725.333 46.933 678.4 0 618.667 0H405.333C345.6 0 298.667 46.933 298.667 106.667V128H85.333c-25.6 0-42.666 17.067-42.666 42.667s17.066 42.666 42.666 42.666H128v704C128 977.067 174.933 1024 234.667 1024h554.666C849.067 1024 896 977.067 896 917.333v-704h42.667c25.6 0 42.666-17.066 42.666-42.666S964.267 128 938.667 128zM384 106.667c0-12.8 8.533-21.334 21.333-21.334h213.334c12.8 0 21.333 8.534 21.333 21.334V128H384v-21.333z m426.667 810.666c0 12.8-8.534 21.334-21.334 21.334H234.667c-12.8 0-21.334-8.534-21.334-21.334v-704h597.334v704z"
                  p-id="5112" fill="#515151"></path>
              </svg>
            </i>
          </template>
          <span>删除</span>
        </n-popover>
        <n-popover trigger="hover" placement="bottom">
          <template #trigger>
            <i class="icon">
              <svg t="1670912176743" class="icon" viewBox="0 0 1117 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="5321" width="200" height="200">
                <path
                  d="M965.694 933.837H142.041A44.757 44.757 0 0 1 97.016 889.5c0-20.134 13.96-36.473 32.638-41.88a55.994 55.994 0 0 1-30.299-22.053 53.962 53.962 0 0 1-4.64-51.852l82.189-191.186a33.06 33.06 0 0 1 8.169-11.89l448.721-442.047a133.773 133.773 0 0 1 94.385-38.468c35.514 0 68.996 13.654 94.231 38.43a129.86 129.86 0 0 1 39.005 93.004 129.63 129.63 0 0 1-39.005 92.812L373.46 756.611a36.013 36.013 0 0 1-12.004 7.862l-191.838 80.693h796.077c24.776 0 44.988 19.867 44.988 44.335 0 24.43-20.212 44.336-44.988 44.336zM786.283 221.559a56.378 56.378 0 0 0-17.105-40.462 58.104 58.104 0 0 0-75.363-5.523l80.924 79.735c7.363-9.742 11.544-21.401 11.544-33.75z m-64.164 86.752l-82.112-80.923-369.754 364.193 82.112 80.923L722.12 308.311zM288.51 714.538l-60.865-59.982-45.026 104.433 105.89-44.45z"
                  p-id="5322" fill="#515151"></path>
              </svg>
            </i>
          </template>
          <span>编辑</span>
        </n-popover>
      </div>
    </div>
  </template>
  <n-space justify="center" style="height: 100%" align="center" st v-else>
    <n-result status="418" :title="langField.noBookTitle" :description="langField.noBookDesc">
      <template #footer>
        <n-button @click="downloadFile">{{ langField.noBookUpload }}</n-button>
      </template>
    </n-result>
  </n-space>

</template>

<style scoped>
@media (max-width: 516px) {
  .n-card {
    margin-left: 0;
    width: calc((100vw - 72px)/3);
    max-width: 148px;
  }

  .cover {
    width: calc((100vw - 72px)/3);
    height: calc((100vw - 72px)/3*1.45);
    max-width: 148px;
    max-height: 214.6px;
  }
}

@media (max-width: 960px) {
  .n-card {
    margin-left: 30px;
  }
}

@media (max-width: 1120px) {
  .n-card {
    margin-left: 40px;
  }
}

.n-card {
  display: block;
  width: 128px;
  height: auto;
  margin-left: 36px;
  margin-bottom: 44px;
  cursor: pointer;
}

.card-wrapper,
.list-wrapper {
  display: flex;
}

.list-wrapper {
  cursor: pointer;
  padding-top: 15px;
  padding-right: 20px;
}

.list-content-left {
  max-height: 100%;
  max-width: 100%;
}

.list-img {
  object-fit: fill;
  width: 57px;
  height: 74px;
}

.list-content-center {
  flex: 1;
  margin: 0 20px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
}

.progress {
  background-color: #f6f6f6;
  border-radius: 5px;
  width: 100%;
  height: 2px;
}

.progress-content {
  height: 100%;
  /* width: 20%; */
  background-color: #2080f0;
}


.list-content-right {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.icon-wrapper {
  position: relative;
}

.popover {
  position: absolute;
  display: flex;
  padding: 8px 14px;
  margin-top: 10px;
  background-color: rgb(72, 72, 78);
  color: rgba(255, 255, 255, 0.82);
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.24), 0 6px 12px 0 rgba(0, 0, 0, 0.16), 0 9px 18px 8px rgba(0, 0, 0, 0.1);
  word-break: break-word;
  border-radius: 3px;
  transition: box-shadow .3s cubic-bezier(0.4, 0, 0.2, 1), background-color .3s cubic-bezier(0.4, 0, 0.2, 1), color .3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon {
  height: 1em;
  width: 1em;
  line-height: 1em;
  text-align: center;
  display: inline-block;
  position: relative;
  fill: currentColor;
  transform: translateZ(0);
}

.book-cover {
  display: block;
  width: 100%;
  height: 174px;
  box-shadow: 0 2px 16px rgb(0 0 0 / 8%);
  background: #d8d8d8;
  position: relative;
}

.book-cover-detour {
  background-image: linear-gradient(90deg, hsla(0, 0%, 63.1%, .25), rgba(21, 21, 20, .1) 1%, hsla(0, 0%, 100%, .15) 4%, hsla(0, 0%, 58%, .1) 8%, hsla(0, 0%, 89%, 0) 57%, rgba(223, 218, 218, .03) 91%, rgba(223, 218, 218, .05) 98%, hsla(0, 0%, 100%, .1));
  box-shadow: inset 0 0 0 0 rgb(0 0 0 / 10%);

  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.n-card :deep(.n-card__content) {
  margin-top: 14px;
  font-size: 15px;
  line-height: 18px;
  height: 36px;
  max-height: 36px;
  padding: 0;
}

.n-image {
  height: 100%;
  width: 100%;
}
</style>
