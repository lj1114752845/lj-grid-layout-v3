<script setup lang="ts">
import GridLayout from "./components/grid-layout.vue";
import GridItem from "./components/grid-item.vue";
import {GridBean} from "./model/grid-bean";
import {reactive, ref} from "vue";
import {GridItemBean} from "./model/grid-item-bean";

let gridInfo = reactive(new GridBean());
gridInfo.cols = 100;//宽度分为100份
gridInfo.rows = 100;//高度分为100份
let childList: GridItemBean[] = [];
let itemBean = reactive(new GridItemBean());
itemBean.topSpan = 1;
itemBean.leftSpan = 1;
itemBean.widthSpan = 10;
itemBean.heightSpan = 20;
childList.push(itemBean);
let itemBean2 = reactive(new GridItemBean());
itemBean2.topSpan = 50;
itemBean2.leftSpan = 50;
itemBean2.widthSpan = 10;
itemBean2.heightSpan = 20;
childList.push(itemBean2);
/*模拟外部修改位置信息*/
// setTimeout(() => {
//     itemBean.topSpan = 10;
// }, 3000);
let disable = ref(false);
</script>

<template>
    <grid-layout :info="gridInfo" style="background-color: azure">
        <template #default="item">
            <template v-for="item of childList">
                <!--想要实现模块间距 设置grid-item内边距 -->
                <grid-item
                        style="padding: 5px"
                        :disable="disable"
                        :item-info="item">
                    <div style="width: 100%;height: 100%;background-color: blueviolet">
                        {{ item }}
                    </div>
                </grid-item>
            </template>
        </template>
    </grid-layout>
</template>

<style scoped>

</style>
