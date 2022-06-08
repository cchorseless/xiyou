/** Create By Editor*/
import React, { createRef, useState } from "react";
import { KV_DATA } from "../../config/KvAllInterface";
import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { CombinationInfoDialog_UI } from "./CombinationInfoDialog_UI";
import { CombinationItem } from "./CombinationItem";

interface IProps {
    itemname: string;
}
export class CombinationInfoDialog extends CombinationInfoDialog_UI {

    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        CSSHelper.setFlowChildren(this.box, "down");
    }

    onStartUI() {
        this.onRefreshUI(this.props as IProps);
    }
    onbtn_click = () => {
        this.close()
    }

    onRefreshUI(p: IProps) {
        if (!p.itemname) {
            return;
        }
        this.clearNode(this.NODENAME.box);
        CSSHelper.setLocalText(this.lbl_des, p.itemname);
        let config = KV_DATA.building_combination.building_combination[p.itemname];
        CSSHelper.setBgImageUrl(this.title_img_icon, `combination/icon/${config.relationicon}.png`);
        for (let i = 1; i <= Number(config.count); i++) {
            this.addNodeChildAsyncAt(this.NODENAME.box, CombinationItem, {
                itemname: `${config.relation}_${i}`,
                marginLeft: "5px",
                marginTop: "10px",
            });
        }
        this.__root__.current!.style.height = 130 + 90 * Number(config.count) + "px";
    }
}
