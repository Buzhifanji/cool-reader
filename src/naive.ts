import {
  create,
  createDiscreteApi,
  NButton,
  NCard,
  NDivider,
  NDrawer,
  NDrawerContent,
  NDropdown,
  NEllipsis,
  NEmpty,
  NGi,
  NGrid,
  NIcon,
  NImage,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  NNotificationProvider,
  NProgress,
  NResult,
  NSpace,
  NTabPane,
  NTabs,
} from "naive-ui";

/**
 * 按需全局安装组件（手动）
 */
export const naive = create({
  components: [
    NButton,
    NCard,
    NEllipsis,
    NEmpty,
    NImage,
    NNotificationProvider,
    NIcon,
    NLayout,
    NLayoutContent,
    NLayoutHeader,
    NLayoutSider,
    NMenu,
    NSpace,
    NResult,
    NProgress,
    NDrawer,
    NDrawerContent,
    NGrid,
    NGi,
    NTabs,
    NTabPane,
    NDivider,
    NDropdown,
  ],
});

// naiveui 脱离上下文的 API
export const { message, notification } = createDiscreteApi([
  "message",
  "notification",
]);
