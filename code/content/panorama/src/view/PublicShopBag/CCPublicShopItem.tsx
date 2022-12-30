
import React, { createRef, PureComponent } from "react";
import { PublicBagConfig } from "../../../../scripts/tscripts/shared/PublicBagConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { ItemHelper } from "../../helper/DotaEntityHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCItemImage } from "../AllUIElement/CCItem/CCItemImage";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCPublicShopItem.less";
interface ICCPublicShopItem extends IPublicShopItem {
    iType: PublicBagConfig.EPublicShopType,
}

export class CCPublicShopItem extends CCPanel<ICCPublicShopItem, Button> {

    static defaultProps = {
        sItemName: "",
        iLeftCount: 0,
        iLimit: 0,
        iLevel: -1,
    }

    defaultClass() {
        const sItemName = this.props.sItemName!;
        const iLevel = this.props.iLevel!;
        const iLeftCount = this.props.iLeftCount;
        const iPercent = 1;
        const playdata = GGameScene.Local.PlayerDataComp
        const iGoldCost = ItemHelper.GetItemCostLV(sItemName, iLevel) * iPercent;
        const iWoodCost = ItemHelper.GetItemWoodCost(sItemName) * iPercent;
        const iSoulCrystalCost = ItemHelper.GetItemSoulCrystalCost(sItemName) * iPercent;
        const bGoldEnough = playdata.gold >= iGoldCost;
        const bWoodEnough = playdata.wood >= iWoodCost;
        const bSoulCrystalEnough = playdata.soulcrystal >= iSoulCrystalCost;
        return CSSHelper.ClassMaker("CC_PublicShopItem", {
            HasItem: Boolean(sItemName),
            CantBuy: !(bGoldEnough && bWoodEnough && bSoulCrystalEnough && (iLeftCount == undefined || iLeftCount > 0)),
        })
    }

    OnClick_Buy() {
        const sItemName = this.props.sItemName!;
        const iSlot = this.props.iSlot;
        const iType = this.props.iType;
        const iLeftCount = this.props.iLeftCount;
        const iLevel = this.props.iLevel!;
        const iDiscount = GGameScene.Local.PublicShopComp.shopDiscount;
        const iPercent = 1 - iDiscount / 100;
        const playdata = GGameScene.Local.PlayerDataComp
        const iGoldCost = ItemHelper.GetItemCostLV(sItemName, iLevel) * iPercent;
        const iWoodCost = ItemHelper.GetItemWoodCost(sItemName) * iPercent;
        const iSoulCrystalCost = ItemHelper.GetItemSoulCrystalCost(sItemName) * iPercent;
        const bGoldEnough = playdata.gold >= iGoldCost;
        const bWoodEnough = playdata.wood >= iWoodCost;
        const bSoulCrystalEnough = playdata.soulcrystal >= iSoulCrystalCost;
        if (sItemName != "" && iSlot >= 0) {
            if (iLeftCount != undefined && iLeftCount <= 0) {
                TipsHelper.showErrorMessage("dota_hud_error_buy_none_left_count");
            } else if (!bGoldEnough) {
                TipsHelper.showErrorMessage("DOTA_Hud_NeedMoreGold");
            } else if (!bWoodEnough) {
                TipsHelper.showErrorMessage("dota_hud_error_wood_not_enough");
            } else if (!bSoulCrystalEnough) {
                TipsHelper.showErrorMessage("dota_hud_error_candy_not_enough");
            } else {
                Game.EmitSound("General.Buy");
                let iUnitIndex = Players.GetLocalPlayerPortraitUnit();
                let iLocalPlayer = Players.GetLocalPlayer();
                // 如果选中的单位不可控制，先选中英雄
                if (!Entities.IsControllableByPlayer(iUnitIndex, iLocalPlayer)) {
                    iUnitIndex = Players.GetPlayerHeroEntityIndex(iLocalPlayer);
                    GameUI.SelectUnit(iUnitIndex, false);
                }
                Game.PrepareUnitOrders({
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM,
                    UnitIndex: iUnitIndex,
                    TargetIndex: iSlot,
                    Position: [iType, 0, 0],
                });
            }

        }
    }
    render() {
        const sItemName = this.props.sItemName!;
        const iLeftCount = this.props.iLeftCount;
        const iLevel = this.props.iLevel;
        const iLimit = this.props.iLimit;
        const tips = {} as any
        return (
            <Button ref={this.__root__}
                oncontextmenu={() => this.OnClick_Buy()}
                hittestchildren={false} hittest={true}  {...this.initRootAttrs()}>
                <CCPanel id="ShopItemBorder" hittest={false} dialogTooltip={tips} />
                <CCItemImage id="ShopItemImage" itemname={sItemName} iLevel={iLevel} showtooltip={false} />
                {iLeftCount != undefined && <Label id="leftCount" text={`${iLeftCount}/${iLimit}`} />}
            </Button>
        )
    }
}