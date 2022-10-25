/** Create By Editor*/
import React, { createRef, useState } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { PlayerConfig } from "../../game/system/Player/PlayerConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { DotaUIHelper } from "../../helper/DotaUIHelper";
import { EventHelper } from "../../helper/EventHelper";
import { FuncHelper } from "../../helper/FuncHelper";
import { NetHelper } from "../../helper/NetHelper";
import { PathHelper } from "../../helper/PathHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { GameEnum } from "../../libs/GameEnum";
import { ChallengeIconItem } from "./ChallengeIconItem";
import { ChallengeShopItem_UI } from "./ChallengeShopItem_UI";
export class ChallengeShopItem extends ChallengeShopItem_UI<NodePropsData> {
    // public infodialog: CombinationInfoDialog | null;
    public isInRangle: boolean = true;
    constructor(prop: any) {
        super(prop);
        this.btn_poplvup_attrs.onmouseover = (e) => {
            this.isInRangle = true;
            let islongover = true;
            if (!this.isInRangle || !islongover) {
                return;
            }
            this.panel_lvpop0.current!.visible = false;
            this.panel_lvpop1.current!.visible = true;
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
        this.btn_teclvup_attrs.onmouseover = (e) => {
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
            abilityname: "courier_challenge_gold",
        });
        this.addNodeChildAt(this.NODENAME.panel_bossall, ChallengeIconItem, {
            marginLeft: "5px",
            abilityname: "courier_challenge_wood",
        });
        this.addNodeChildAt(this.NODENAME.panel_bossall, ChallengeIconItem, {
            marginLeft: "5px",
            abilityname: "courier_challenge_equip",
        });
        this.addNodeChildAt(this.NODENAME.panel_bossall, ChallengeIconItem, {
            marginLeft: "5px",
            abilityname: "courier_challenge_artifact",
        });
        this.delayUpdateSelf();
    }

    onStartUI() {
        this.onRefreshUI();
        EventHelper.AddClientEvent(
            PlayerScene.Local.PlayerDataComp.updateEventName,
            FuncHelper.Handler.create(this, () => {
                this.onRefreshUI();
            })
        );
    }
    onRefreshUI() {
        let playerdata = PlayerScene.Local.PlayerDataComp;
        this.lbl_lvpopdes.current!.text = `Lv:${playerdata.popuLevel}/${playerdata.popuLevelMax}`;
        this.lbl_teclvdes.current!.text = `Lv:${playerdata.techLevel}/${playerdata.techLevelMax}`;
        CSSHelper.setBgImageUrl(this.img_popneed0, PathHelper.getMoneyIcon(GameEnum.Item.EItemIndex.Gold));
        CSSHelper.setBgImageUrl(this.img_popneed1, PathHelper.getMoneyIcon(GameEnum.Item.EItemIndex.Wood));
        this.lbl_popneedcount0.current!.text = `${playerdata.popuLevelUpCostGold}`;
        this.lbl_popneedcount1.current!.text = `${playerdata.popuLevelUpCostWood}`;
        this.lbl_tecneedcount.current!.text = `${playerdata.techLevelUpCostGold}`;
    }

    onbtnpop_click = () => {
        let playerdata = PlayerScene.Local.PlayerDataComp;
        if (playerdata.popuLevel >= playerdata.popuLevelMax) {
            TipsHelper.showErrorMessage("max level");
            return;
        }
        if (playerdata.gold < playerdata.popuLevelUpCostGold) {
            TipsHelper.showErrorMessage("gold is not enough");
            return;
        }
        if (playerdata.wood < playerdata.popuLevelUpCostWood) {
            TipsHelper.showErrorMessage("wood is not enough");
            return;
        }
        NetHelper.SendToLua(PlayerConfig.EProtocol.reqApplyPopuLevelUp);
    };
    onbtntec_click = () => {
        let playerdata = PlayerScene.Local.PlayerDataComp;
        if (playerdata.techLevel >= playerdata.techLevelMax) {
            TipsHelper.showErrorMessage("max level");
            return;
        }
        if (playerdata.gold < playerdata.techLevelUpCostGold) {
            TipsHelper.showErrorMessage("gold is not enough");
            return;
        }

        NetHelper.SendToLua(PlayerConfig.EProtocol.reqApplyTechLevelUp);
    };

}
