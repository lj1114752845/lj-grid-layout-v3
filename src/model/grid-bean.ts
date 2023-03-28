import {GridItemBean} from "./grid-item-bean";

class GridBean {
    rows: number = 48;//行数
    cols: number = 48;//列数
    infiniteHeight: boolean = true;//无限高度
    childList: GridItemBean[] = []; //子列表
}

export {
    GridBean
}