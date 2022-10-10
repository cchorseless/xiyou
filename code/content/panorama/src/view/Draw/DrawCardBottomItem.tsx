/** Create By Editor*/
import React, { createRef, useState } from "react";
import { KvAllInterface } from "../../config/KvAllInterface";
import { CSSHelper } from "../../helper/CSSHelper";
import { PathHelper } from "../../helper/PathHelper";
import { CombinationSmallItem } from "../Combination/CombinationSmallItem";
import { SkillItem } from "../Skill/SkillItem";
import { DrawCardBottomItem_UI } from "./DrawCardBottomItem_UI";

interface IProps {
    itemname: string;
    index: number;
}
export class DrawCardBottomItem extends DrawCardBottomItem_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        CSSHelper.setFlowChildren(this.box_combina);
        CSSHelper.setFlowChildren(this.box_skill);
        this.box_skill.current!.style.width = "fit-children";
        this.box_skill.current!.style.horizontalAlign = "center";
        this.box_combina.current!.style.width = "fit-children";
    }
    onStartUI() {
        this.onRefreshUI(this.props as IProps);
    }
    onRefreshUI(k: IProps) {
        let KV_DATA = (GameUI.CustomUIConfig() as KvAllInterface)
        let cardinfo = KV_DATA.building_unit_tower.building_unit_tower[k.itemname];
        let iteminfo = KV_DATA.building_item_card.building_item_card[cardinfo!.CardName];
        this.lbl_gold.current!.text = "X" + iteminfo?.ItemCost;
        this.lbl_population.current!.text = "X" + cardinfo?.Population;
        CSSHelper.setBgImageUrl(this.frameBg, `common/rarity/item_rarity_border_${PathHelper.getRaretyIndex(cardinfo?.Rarity!)}.png`);
        for (let i = 1; i <= 4; i++) {
            let abilityname = cardinfo["Ability" + i] as string;
            if (abilityname == "ability_empty") {
                continue;
            }
            this.addNodeChildAsyncAt(this.NODENAME.box_skill, SkillItem, {
                itemname: abilityname,
                marginLeft: "5px",
                marginTop: "10px",
            });

            let relationname = cardinfo["Relation_" + i] as string;
            if (!relationname) {
                continue;
            }
            this.addNodeChildAsyncAt(this.NODENAME.box_combina, CombinationSmallItem, {
                itemname: relationname,
                marginLeft: "10px",
                marginTop: "30px",
            });
        }
        this.titleitem.current!.onRefreshUI(k);
    }
}
