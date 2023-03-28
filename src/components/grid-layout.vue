<script setup lang="ts">
import {onMounted, ref} from "vue";
import {GridBean} from "../model/grid-bean";

let prop = withDefaults(
    defineProps<{
      info: GridBean
    }>(),
    {
      info: () => new GridBean(),
    }
)
let cellWidth = ref(0);//单格宽度
let cellHeight = ref(0);//单格高度

/**
 * 初始化
 */
function init() {
  initSize();
}

function initSize() {
  let layout = document.getElementById('ljqLayout') as HTMLDivElement;
  let style = getComputedStyle(layout);
  let padding = {top: 0, left: 0, right: 0, bottom: 0};
  padding.top = parseFloat(style.getPropertyValue('padding-top'));
  padding.left = parseFloat(style.getPropertyValue('padding-left'));
  padding.right = parseFloat(style.getPropertyValue('padding-right'));
  padding.bottom = parseFloat(style.getPropertyValue('padding-bottom'));
  //取得实际高度与实际宽度
  let width = layout.offsetWidth - padding.left - padding.right;
  let height = layout.offsetHeight - padding.top - padding.bottom;
  if (width === 0 || height === 0 || prop.info.cols === 0 || prop.info.rows === 0) {
    return;
  }
  cellWidth.value = width / prop.info.cols;
  cellHeight.value = height / prop.info.rows;
}

onMounted(() => {
  init();
});
//如果外界没有设置 GridBean 则 从组件内部获取
defineExpose({
  info: prop.info
});
</script>
<template>
  <div id="ljqLayout" class="grid-layout">
    <slot :cell-width="cellWidth" :cell-height="cellHeight"></slot>
  </div>
</template>

<style scoped>
.grid-layout {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
</style>