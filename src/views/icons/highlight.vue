<script setup lang="ts">
const props = withDefaults(defineProps<{ size?: number }>(), { size: 16 })
</script>
<template>
  <n-icon :size="props.size">
    <svg t="1672905284389" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
      p-id="1389" width="200" height="200">
      <path
        d="M979.715525 658.309219H861.11257c-22.924852 0-41.512031 18.587179-41.512031 41.512031s18.587179 41.512031 41.512031 41.512031h118.602955c22.924852 0 41.512031-18.587179 41.512031-41.512031s-18.587179-41.512031-41.512031-41.512031zM979.715525 799.637592h-278.707969c-22.924852 0-41.512031 18.587179-41.512031 41.512032s18.587179 41.512031 41.512031 41.512031h278.717941c22.924852 0 41.512031-18.587179 41.512031-41.512031s-18.597151-41.512031-41.522003-41.512032zM979.715525 940.975938H542.86696c-22.924852 0-41.512031 18.587179-41.512031 41.512031 0 22.924852 18.587179 41.512031 41.512031 41.512031h436.848565c22.924852 0 41.512031-18.587179 41.512031-41.512031 0-22.924852-18.587179-41.512031-41.512031-41.512031zM994.014889 254.297339L766.132485 26.404962C749.100885 9.373363 726.455239 0 702.363702 0c-24.091537 0-46.727211 9.383334-63.768782 26.414934L12.155135 652.844748A41.505051 41.505051 0 0 0 0.00965 683.068857l6.082714 290.295041c0.468668 22.226836 18.357831 40.145913 40.584667 40.634524l290.634077 6.411779c0.309122 0.009972 0.608271 0.009972 0.917393 0.009972 10.998744 0 21.558734-4.367588 29.346603-12.155457L994.014889 381.824931c35.160082-35.160082 35.160082-92.36751 0-127.527592z m-58.703177 68.824415L321.416278 937.017187l-233.147443-5.145377L83.392692 699.023517 697.30807 85.118112c1.735069-1.735069 3.709458-2.094049 5.055632-2.09405 1.356146 0 3.330535 0.35898 5.055633 2.09405l227.892377 227.882404c2.792066 2.792066 2.792066 7.329172 0 10.121238z"
        p-id="1390"></path>
    </svg>
  </n-icon>
</template>