import {
  create,
  NButton,
  NCard,
  NEllipsis,
  NIcon,
  NImage,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NLayoutSider,
  NMenu,
  NNotificationProvider,
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
    NImage,
    NNotificationProvider,
    NIcon,
    NLayout,
    NLayoutContent,
    NLayoutHeader,
    NLayoutSider,
    NMenu,
    NSpace,
  ],
});
