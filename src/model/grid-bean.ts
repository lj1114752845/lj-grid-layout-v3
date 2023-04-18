import {GridItemBean} from "./grid-item-bean";

class GridBean {
    //行数
    rows: number = 48;
    //列数
    cols: number = 48;
    //无限高度 暂时不支持无限高度
    infiniteHeight: boolean = true;
}

export {
    GridBean
}