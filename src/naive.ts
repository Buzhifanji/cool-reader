import {
  create,
  NButton,
  NCard,
  NEllipsis,
  NEmpty,
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
  ],
});
