/** Create By Editor*/
import React, { createRef, useState } from "react";
import { DOTAAbilityImageAttributes } from "@demon673/react-panorama";
import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { SkillItem_UI } from "./SkillItem_UI";

interface IProps {
    itemname: string;
}
export class SkillItem extends SkillItem_UI {

    constructor(props: any) {
        super(props)
        this.img_skillicon_attrs.showtooltip = true;
    }
    // 初始化数据
    onStartUI() {
        this.img_skillicon.current!.style.borderRadius = "15px";
        this.onRefreshUI(this.props as IProps);
    }

    onRefreshUI(p: IProps) {
        this.__root__.current!.hittest = true;
        this.img_skillicon.current!.hittest = true;
        // let config = KV_DATA.building_ability_tower.building_ability_tower[p.itemname];
        this.img_skillicon.current!.abilityname = p.itemname;
        this.updateSelf();
    }
}
