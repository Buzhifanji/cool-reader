import { message } from "@/naive";
import { createDiscreteApi, MessageReactive, NButton, NInput } from "naive-ui";
import { h, ref, unref, VNodeChild } from "vue";

let messageReactive: MessageReactive | null = null;

const text = ref<string>("");

function submit() {
  const value = unref(text);
  if (value) {
  } else {
    message.error("您还未填写笔记！");
  }
}

const renderButton = () => {
  return h("div", { style: { display: "flex", justifyContent: "flex-end" } }, [
    h(
      NButton,
      {
        round: true,
        type: "primary",
        onClick: submit,
      },
      { default: () => "添加" }
    ),
  ]);
};

const renderInput = (): VNodeChild => {
  return h(NInput, {
    type: "textarea",
    placeholder: "输入你的想法",
    clearable: true,
    round: true,
    showCount: true,
    size: "large",
    rows: 6,
    maxlength: 999,
    style: {
      maxWidth: "calc(100vw - 32px)",
      maxHeight: "600px",
      width: "480px",
      marginBottom: "10px",
    },
    onChange: (value) => {
      text.value = value;
    },
  });
};

const renderMessage = (): VNodeChild => {
  return h(
    "div",
    {
      style: {
        padding: "10px 14px",
        boxShadow: "var(--n-box-shadow)",
        background: "var(--n-color)",
        borderRadius: "var(--n-border-radius)",
        cursor: "pointer",
      },
    },
    [renderInput(), renderButton()]
  );
};

export function openIdea() {
  const { message } = createDiscreteApi(["message"], {
    messageProviderProps: {
      placement: "bottom",
      containerStyle: { bottom: "50px" },
    },
  });
  messageReactive = message.create("", {
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
