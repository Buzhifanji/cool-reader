import { ref } from "vue";

export const useLoadFile = () => {
  /**
   * 因为一次只能读取一个文件，所以设定此变量，防止用户在读取中重复读取文件
   */
  const isLoadFile = ref<boolean>(false);
  const percentage = ref<number>(0);

  function setLoadFile(value: boolean) {
    isLoadFile.value = value;
  }
  return { isLoadFile, setLoadFile, percentage };
};
