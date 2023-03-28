<script setup lang="ts">
import {onMounted, watch} from "vue";
import {GridItemBean} from "../model/grid-item-bean";
import interact from "interactjs";

let prop = withDefaults(
    defineProps<{
      itemInfo: GridItemBean,//网格项配置
      cellWidth?: number,//单格宽度
      cellHeight?: number,//单格高度
    }>(),
    {
      cellWidth: 0,
      cellHeight: 0,
    }
);

function init() {
  //第一次初始化位置大小
  setItemRect(prop.itemInfo);
  //绑定事件
  bindInteract();
}

let x: number, y: number = 0;

/**
 * 绑定拖拽缩放功能
 */
function bindInteract() {
  let gridItem = document.getElementById('ljqItem') as HTMLDivElement;
  interact(gridItem)
      .resizable({
        //设置可以缩放大小的位置
        edges: {left: false, right: true, bottom: true, top: false},
        modifiers: [
          // interact.modifiers.snap({
          //   targets: [
          //     interact.snappers.grid({x: prop.cellWidth, y: prop.cellHeight})
          //   ],
          // }),
          //限制区域
          interact.modifiers.restrictEdges({
            outer: 'parent'
          }),
          //限制大小
          interact.modifiers.restrictSize({
            min: {
              width: prop.cellWidth * prop.itemInfo.minWidthSpan,
              height: prop.cellHeight * prop.itemInfo.minHeightSpan
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
            prop.itemInfo.widthSpan = Math.round(event.rect.width / prop.cellWidth);
            prop.itemInfo.heightSpan = Math.round(event.rect.height / prop.cellHeight);
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
            prop.itemInfo.leftSpan = Math.round(x / prop.cellWidth);
            prop.itemInfo.topSpan = Math.round(y / prop.cellHeight);
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
  gridItem.style.width = `${item.widthSpan * prop.cellWidth}px`;
  gridItem.style.height = `${item.heightSpan * prop.cellHeight}px`;
  let xp = item.leftSpan * prop.cellWidth;
  let yp = item.topSpan * prop.cellHeight;
  gridItem.style.transform = `translate(${xp}px, ${yp}px)`;
  gridItem.setAttribute('p-x', xp.toString());
  gridItem.setAttribute('p-y', yp.toString());
}

watch([() => prop.cellWidth, () => prop.cellHeight], () => {
  init();
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