/** Create By Editor*/
import React, { createRef, useState } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { DotaUIHelper } from "../../helper/DotaUIHelper";
import { ChallengeIconItem } from "./ChallengeIconItem";
import { ChallengeShopItem_UI } from "./ChallengeShopItem_UI";
export class ChallengeShopItem extends ChallengeShopItem_UI {
    // public infodialog: CombinationInfoDialog | null;
    public isInRangle: boolean = true;
    constructor(prop: any) {
        super(prop);
        this.btn_poplvup_attrs.onmouseover =  (e) => {
            // if (this.infodialog) {
            //     this.infodialog.close();
            //     this.infodialog = null;
            // }
            // let pos = MainPanel.GetInstance()!.stagePos(this.__root__.current!);
            this.isInRangle = true;
            // let islongover = await DotaUIHelper.isLongTimeMouseOver();
            let islongover = true;
            if (!this.isInRangle || !islongover) {
                return;
            }
            this.panel_lvpop0.current!.visible = false;
            this.panel_lvpop1.current!.visible = true;
            // this.infodialog = await MainPanel.GetInstance()!.addOnlyDialog(CombinationInfoDialog, {
            //     itemname: itemname,
            //     x: pos.x + "px",
            //     y: pos.y + "px",
            // });
        };
        this.btn_poplvup_attrs.onmouseout = (e) => {
            this.isInRangle = false;
            this.panel_lvpop0.current!.visible = true;
            this.panel_lvpop1.current!.visible = false;
            // if (this.infodialog) {
            //     this.infodialog.close();
            //     this.infodialog = null;
            // }
        };
        this.btn_teclvup_attrs.onmouseover =  (e) => {
            // if (this.infodialog) {
            //     this.infodialog.close();
            //     this.infodialog = null;
            // }
            // let pos = MainPanel.GetInstance()!.stagePos(this.__root__.current!);
            this.isInRangle = true;
            let islongover = true;
            // let islongover = await DotaUIHelper.isLongTimeMouseOver();
            if (!this.isInRangle || !islongover) {
                return;
            }
            this.panel_lvtec0.current!.visible = false;
            this.panel_lvtec1.current!.visible = true;
            // this.infodialog = await MainPanel.GetInstance()!.addOnlyDialog(CombinationInfoDialog, {
            //     itemname: itemname,
            //     x: pos.x + "px",
            //     y: pos.y + "px",
            // });
        };
        this.btn_teclvup_attrs.onmouseout = (e) => {
            this.isInRangle = false;
            this.panel_lvtec0.current!.visible = true;
            this.panel_lvtec1.current!.visible = false;
            // if (this.infodialog) {
            //     this.infodialog.close();
            //     this.infodialog = null;
            // }
        };
    }

    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        CSSHelper.setFlowChildren(this.panel_bossall);
        this.panel_lvpop1.current!.visible = false;
        this.panel_lvtec1.current!.visible = false;
        this.addNodeChildAt(this.NODENAME.panel_bossall, ChallengeIconItem, {
            marginLeft: "5px",
            abilityname:"courier_challenge_gold"
        });
        this.addNodeChildAt(this.NODENAME.panel_bossall, ChallengeIconItem, {
            marginLeft: "5px",
            abilityname:"courier_challenge_wood"
        });
        this.addNodeChildAt(this.NODENAME.panel_bossall, ChallengeIconItem, {
            marginLeft: "5px",
            abilityname:"courier_challenge_equip"
        });
        this.addNodeChildAt(this.NODENAME.panel_bossall, ChallengeIconItem, {
            marginLeft: "5px",
            abilityname:"courier_challenge_artifact"
        });
        this.delayUpdateSelf();
    }

    // 销毁
    componentWillUnmount() {
        super.componentWillUnmount();
    }

    onRefreshUI() {

    }
}
