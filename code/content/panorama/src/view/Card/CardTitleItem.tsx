/** Create By Editor*/
import React, { createRef, useState } from "react";
import { KvAllInterface } from "../../config/KvAllInterface";

import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { CardTitleItem_UI } from "./CardTitleItem_UI";
interface IProps {
    itemname: string;
}

export class CardTitleItem extends CardTitleItem_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        CSSHelper.setFlowChildren(this.box);
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

    onRefreshUI(k: IProps) {
        let KV_DATA = (GameUI.CustomUIConfig() as KvAllInterface)
        let cardinfo = KV_DATA.building_unit_tower.building_unit_tower![k.itemname as "building_hero_lina"];
        let iteminfo = KV_DATA.building_item_card.building_item_card![cardinfo!.CardName as "item_building_hero_lina"];
        CSSHelper.setLocalText(this.lbl_name, k.itemname);
        CSSHelper.setBgImageUrl(this.img_rarety, `common/rarity/${cardinfo?.Rarity?.toUpperCase()}.png`);
        switch (cardinfo?.Rarity?.toUpperCase()) {
            case "R":
                this.img_rarety.current!.style.width = "40px";
                break;
            case "SR":
                this.img_rarety.current!.style.width = "60px";
                break;
            case "SSR":
                this.img_rarety.current!.style.width = "88px";
                break;
        }
        CSSHelper.setBgImageUrl(this.img_icon, `card/card_icon/${k.itemname.replace("building_hero_", "")}.png`);
    }
}
