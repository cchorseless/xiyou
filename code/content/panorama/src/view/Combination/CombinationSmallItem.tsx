/** Create By Editor*/
import React, { createRef, useState } from "react";
import { KvAllInterface } from "../../config/KvAllInterface";
import { CSSHelper } from "../../helper/CSSHelper";
import { DotaUIHelper } from "../../helper/DotaUIHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { MainPanel } from "../MainPanel/MainPanel";
import { CombinationInfoDialog } from "./CombinationInfoDialog";
import { CombinationSmallItem_UI } from "./CombinationSmallItem_UI";

interface IProps {
    itemname: string;
}
export class CombinationSmallItem extends CombinationSmallItem_UI {
    public infodialog: CombinationInfoDialog | null;
    public isInRangle: boolean = true;
    constructor(prop: any) {
        super(prop);
        this.__root___attrs.onmouseover = async (e) => {
            if (this.infodialog) {
                this.infodialog.close();
                this.infodialog = null;
            }
            let itemname = this.props.itemname;
            let pos = MainPanel.GetInstance()!.stagePos(this.__root__.current!);
            this.isInRangle = true;
            let islongover = await DotaUIHelper.isLongTimeMouseOver();
            if (!this.isInRangle || !islongover) {
                return;
            }
            this.infodialog = await MainPanel.GetInstance()!.addOnlyDialog(CombinationInfoDialog, {
                itemname: itemname,
                x: pos.x + "px",
                y: pos.y + "px",
            });
        };
        this.__root___attrs.onmouseout = (e) => {
            this.isInRangle = false;
            if (this.infodialog) {
                this.infodialog.close();
                this.infodialog = null;
            }
        };
    }
    // 初始化数据
    onStartUI() {
        this.onRefreshUI(this.props as IProps);
    }


    onRefreshUI(k: IProps) {
        if (!k.itemname) {
            return;
        }
        CSSHelper.setLocalText(this.lbl_des, k.itemname);
        let KV_DATA = (GameUI.CustomUIConfig() as KvAllInterface)
        let config = KV_DATA.building_combination.building_combination[k.itemname];
        CSSHelper.setBgImageUrl(this.img_icon, `combination/icon/${config.relationicon}.png`);
    }
}
