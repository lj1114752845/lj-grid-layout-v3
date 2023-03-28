<script setup lang="ts">
import {inject, onMounted, ref, watch} from "vue";
import {GridItemBean} from "../model/grid-item-bean";
import interact from "interactjs";

let prop = withDefaults(
    defineProps<{
      itemInfo: GridItemBean,//网格项配置
      disable: boolean,//是否禁用拖拽缩放能力
    }>(),
    {
      disable: false
    }
);
let cellWidth = inject("cellWidth", ref(0));
let cellHeight = inject("cellHeight", ref(0));

let interactObj: any;

function init() {
  //第一次初始化位置大小
  setItemRect(prop.itemInfo);
  bindInteract();
}

/**
 * 绑定拖拽缩放功能
 */
function bindInteract() {
  if (prop.disable) {
    return;
  }
  let gridItem = document.getElementById('ljqItem') as HTMLDivElement;
  interactObj = interact(gridItem)
      .resizable({
        //设置可以缩放大小的位置
        edges: {left: false, right: true, bottom: true, top: false},
        modifiers: [
          //限制区域
          interact.modifiers.restrictEdges({
            outer: 'parent'
          }),
          //限制大小
          interact.modifiers.restrictSize({
            min: {
              width: cellWidth.value * prop.itemInfo.minWidthSpan,
              height: cellHeight.value * prop.itemInfo.minHeightSpan
            }
          }),
        ],
        listeners: {
          move: (event) => {
            gridItem.style.width = `${event.rect.width}px`;
            gridItem.style.height = `${event.rect.height}px`;
          },
          end: (event) => {
            //鼠标释放后 找到 计算出拖拽后最合适的跨度
            prop.itemInfo.widthSpan = Math.round(event.rect.width / cellWidth.value);
            prop.itemInfo.heightSpan = Math.round(event.rect.height / cellHeight.value);
            setItemRect(prop.itemInfo);
          }
        }
      })
      .draggable({
        //inertia: true,//是否有惯性 快速移动释放鼠标后仍然移动一段距离
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            //endOnly: true //允许临时拖出父大小范围
          })
        ],
        //autoScroll: true,//启用超出后出现滚动条
        listeners: {
          move: (event) => {
            let x: number = parseFloat(gridItem.getAttribute('p-x') || '0') + event.dx;
            let y: number = parseFloat(gridItem.getAttribute('p-y') || '0') + event.dy;
            gridItem.style.transform = `translate(${x}px, ${y}px)`;
            gridItem.setAttribute('p-x', x.toString());
            gridItem.setAttribute('p-y', y.toString());
          },
          end: (event) => {
            let x: number = parseFloat(gridItem.getAttribute('p-x') || '0');
            let y: number = parseFloat(gridItem.getAttribute('p-y') || '0');
            prop.itemInfo.leftSpan = Math.round(x / cellWidth.value);
            prop.itemInfo.topSpan = Math.round(y / cellHeight.value);
            setItemRect(prop.itemInfo);
          }
        }
      });
}

/**
 * 设置位置以及大小
 * @param item
 */
function setItemRect(item: GridItemBean) {
  let gridItem = document.getElementById('ljqItem') as HTMLDivElement;
  gridItem.style.width = `${item.widthSpan * cellWidth.value}px`;
  gridItem.style.height = `${item.heightSpan * cellHeight.value}px`;
  let xp = item.leftSpan * cellWidth.value;
  let yp = item.topSpan * cellHeight.value;
  gridItem.style.transform = `translate(${xp}px, ${yp}px)`;
  gridItem.setAttribute('p-x', xp.toString());
  gridItem.setAttribute('p-y', yp.toString());
}

watch([cellWidth, cellHeight], () => {
  init();
});

watch(() => prop.disable, () => {
  if (prop.disable && interactObj !== undefined) {
    interactObj.unset();//释放
    interactObj = undefined;
  } else {
    bindInteract();//重新挂载功能
  }
});

onMounted(() => {
  init();
})
</script>

<template>
  <div id="ljqItem" class="grid-item">
    <slot></slot>
  </div>
</template>

<style scoped>
.grid-item {
}
</style>