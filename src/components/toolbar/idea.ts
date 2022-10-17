import {
  createDiscreteApi,
  MessageReactive,
  MessageRenderMessage,
  NAlert,
} from "naive-ui";
import { h } from "vue";

let messageReactive: MessageReactive | null = null;

const renderMessage: MessageRenderMessage = (props) => {
  const { type } = props;
  return h(
    NAlert,
    {
      closable: false,
      onClose: props.onClose,
      type: type === "loading" ? "default" : type,
      title: "你看你手上拿的是什么啊",
      style: {
        boxShadow: "var(--n-box-shadow)",
        maxWidth: "calc(100vw - 32px)",
        width: "480px",
        cursor: "pointer",
      },
    },
    {
      default: () => props.content,
    }
  );
};

export function openIdea() {
  const { message } = createDiscreteApi(["message"], {
    messageProviderProps: {
      placement: "bottom",
      containerStyle: { bottom: "50px" },
    },
  });
  messageReactive = message.create("那东西我们早就不屑啦，哈哈哈", {
    render: renderMessage,
    closable: true,
    duration: 0,
    showIcon: false,
  });
}

export function removeMessage() {
  if (messageReactive) {
    messageReactive.destroy();
    messageReactive = null;
  }
}
