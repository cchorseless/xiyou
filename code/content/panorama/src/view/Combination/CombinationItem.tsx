/** Create By Editor*/
import React, { createRef, useState } from "react";
import { KV_DATA } from "../../config/KvAllInterface";
import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { CombinationItem_UI } from "./CombinationItem_UI";
interface IProps {
    itemname: string;
}
export class CombinationItem extends CombinationItem_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        this.onRefreshUI(this.props as IProps);
    }
    /**
     *更新渲染
     * @param prevProps 上一个状态的 props
     * @param prevState
     * @param snapshot
     */
    componentDidUpdate(prevProps: any, prevState: any, snapshot?: any) {
        super.componentDidUpdate(prevProps, prevState, snapshot);
    }
    // 销毁
    componentWillUnmount() {
        super.componentWillUnmount();
    }
    onRefreshUI(p: IProps) {
        if (!p.itemname) {
            return;
        }
        CSSHelper.setLocalText(this.lbl_des, p.itemname);
        let config = KV_DATA.building_combination.building_combination[p.itemname];
        let cardinfo = KV_DATA.building_unit_tower.building_unit_tower[config.heroid];
        CSSHelper.setBgImageUrl(this.img_rarety, `common/rarity/CardRarity_${cardinfo.Rarity.toUpperCase()}.png`);
        CSSHelper.setBgImageUrl(this.heroicon, `items/heroes/${config.heroid.replace("building_hero_", "")}.png`);
    }
}
