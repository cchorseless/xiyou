/** Create By Editor*/
import React, { createRef, useState } from "react";
import { DOTAAbilityImageAttributes } from "react-panorama-eom";
import { KV_DATA } from "../../config/KvAllInterface";
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
        this.__root__.current!.hittest = true;
        this.img_skillicon.current!.hittest = true;
        // let config = KV_DATA.building_ability_tower.building_ability_tower[p.itemname];
        this.img_skillicon.current!.abilityname = p.itemname;
    }
}
