
import React from "react";
import { PublicBagConfig } from "../../../../scripts/tscripts/shared/PublicBagConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { TipsHelper } from "../../helper/TipsHelper";

import { CCIcon_CoinType } from "../AllUIElement/CCIcons/CCIcon_CoinType";
import { CCItemImage } from "../AllUIElement/CCItem/CCItemImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCPublicShopItem.less";
interface ICCPublicShopItem extends IPublicShopItem {
    iType: PublicBagConfig.EPublicShopType,
}

export class CCPublicShopItem extends CCPanel<ICCPublicShopItem> {

    static defaultProps = {
        sItemName: "",
        iLeftCount: 0,
        iLimit: 0,
        iLevel: -1,
    }
    onInitUI() {
        this.ListenUpdate(GGameScene.Local.PlayerDataComp);
    }
    onStartUI() {
        // this.addDragEvent();
    }
    addDragEvent() {
        const pSelf = this.__root__.current!;
        $.RegisterEventHandler("DragLeave", pSelf, (pPanel: Panel, pDraggedPanel: IDragItem) => {
            if (pSelf && pPanel == pSelf) {
                if (pDraggedPanel.m_pPanel == undefined) {
                    return false;
                }
                if (!pDraggedPanel.bIsDragItem) {
                    return false;
                }
                if (pDraggedPanel.m_pPanel == pPanel) {
                    return false;
                }

                pPanel.RemoveClass("potential_drop_target");
                return true;
            }
            return false;
        });
        $.RegisterEventHandler("DragEnter", pSelf, (pPanel: Panel, pDraggedPanel: IDragItem) => {
            if (pSelf && pPanel == pSelf) {
                // 从哪里拖过来
                if (pDraggedPanel.m_pPanel == undefined) {
                    return true;
                }
                // 拖动类型
                if (!pDraggedPanel.bIsDragItem) {
                    return true;
                }
                // 自己拖动到自己
                if (pDraggedPanel.m_pPanel == pPanel) {
                    return true;
                }
                pPanel.AddClass("potential_drop_target");
                return true;
            }
            return false;
        });
        $.RegisterEventHandler("DragDrop", pSelf, (pPanel: Panel, pDraggedPanel: IDragItem) => {
            const itemIndex = this.props.itemIndex!;
            const iType = this.props.iType!;
            const slot = this.props.slot!;
            if (pSelf && pPanel == pSelf) {
                if (pDraggedPanel.m_pPanel == undefined) {
                    return true;
                }
                if (!pDraggedPanel.bIsDragItem) {
                    return true;
                }
                if (pDraggedPanel.m_pPanel == pSelf) {
                    pDraggedPanel.m_DragCompleted = true;
                    return false;
                }
                let iDraggedItemIndex = pDraggedPanel.overrideentityindex;
                if (iDraggedItemIndex && iDraggedItemIndex != -1) {
                    // let from = pDraggedPanel.m_DragType! as PublicBagConfig.EBagSlotType;
                    // let to = iType;
                    // let fromslot = pDraggedPanel.m_Slot!;
                    // let toslot = slot;
                    // GGameScene.Local.CourierBagComp.MoveItem(from, fromslot, to, toslot, Abilities.GetCaster(iDraggedItemIndex));
                    pDraggedPanel.m_DragCompleted = true;
                }
                return true;
            }
            return false;
        });
    }
    OnClick_Buy() {
        const sItemName = this.props.sItemName!;
        const iSlot = this.props.iSlot;
        const iLeftCount = this.props.iLeftCount!;
        const iLevel = this.props.iLevel!;
        const iLimit = this.props.iLimit!;
        const iDiscount = GGameScene.Local.CourierShopComp.iDiscount;
        const iPercent = 1 - iDiscount / 100;
        const playdata = GGameScene.Local.PlayerDataComp
        let costcount = 0;
        let costenough = false;
        switch (this.props.iCoinType) {
            case GEEnum.EMoneyType.Gold:
                costcount = Items.GetItemCostLV(sItemName, iLevel) * iPercent;
                costenough = playdata.gold >= costcount;
                break;
            case GEEnum.EMoneyType.Wood:
                costcount = Items.GetItemWoodCost(sItemName) * iPercent;
                costenough = playdata.wood >= costcount;
                break;
            case GEEnum.EMoneyType.SoulCrystal:
                costcount = Items.GetItemSoulCrystalCost(sItemName) * iPercent;
                costenough = playdata.soulcrystal >= costcount;
                break;
        }
        const showlimit = iLimit != null && iLimit != 0;
        if (sItemName != "" && iSlot >= 0) {
            if (showlimit && iLeftCount && iLeftCount <= 0) {
                TipsHelper.showErrorMessage("dota_hud_error_buy_none_left_count");
            }
            if (!costenough) {
                switch (this.props.iCoinType) {
                    case GEEnum.EMoneyType.Gold:
                        TipsHelper.showErrorMessage("DOTA_Hud_NeedMoreGold");
                        return;
                    case GEEnum.EMoneyType.Wood:
                        TipsHelper.showErrorMessage("dota_hud_error_wood_not_enough");
                        return;
                    case GEEnum.EMoneyType.SoulCrystal:
                        TipsHelper.showErrorMessage("dota_hud_error_SoulCrystal_not_enough");
                        return;
                }
            } else {
                let iUnitIndex = Players.GetLocalPlayerPortraitUnit();
                let iLocalPlayer = Players.GetLocalPlayer();
                // 如果选中的单位不可控制，先选中英雄
                if (!Entities.IsControllableByPlayer(iUnitIndex, iLocalPlayer)) {
                    iUnitIndex = Players.GetPlayerHeroEntityIndex(iLocalPlayer);
                    GameUI.SelectUnit(iUnitIndex, false);
                }
                GGameScene.Local.CourierShopComp.BuyItem(iUnitIndex, this.props.iType, iSlot);
            }

        }
    }
    render() {
        const sItemName = this.props.sItemName!;
        const iLeftCount = this.props.iLeftCount;
        const iLevel = this.props.iLevel!;
        const iLimit = this.props.iLimit!;
        const iDiscount = GGameScene.Local.CourierShopComp.iDiscount;
        const iPercent = 1 - iDiscount / 100;
        const playdata = GGameScene.Local.PlayerDataComp;
        let costcount = 0;
        let costenough = false;
        switch (this.props.iCoinType) {
            case GEEnum.EMoneyType.Gold:
                costcount = Items.GetItemCostLV(sItemName, iLevel) * iPercent;
                costenough = playdata.gold >= costcount;
                break;
            case GEEnum.EMoneyType.Wood:
                costcount = Items.GetItemWoodCost(sItemName) * iPercent;
                costenough = playdata.wood >= costcount;
                break;
            case GEEnum.EMoneyType.SoulCrystal:
                costcount = Items.GetItemSoulCrystalCost(sItemName) * iPercent;
                costenough = playdata.soulcrystal >= costcount;
                break;
        }
        const showlimit = iLimit != null && iLimit != 0;
        return (
            <Panel ref={this.__root__} className={CSSHelper.ClassMaker("CC_PublicShopItem", {
                HasItem: GToBoolean(sItemName),
                CantBuy: !(costenough && (showlimit == false || (iLeftCount && iLeftCount > 0))),
            })}  {...this.initRootAttrs()}>
                <CCPanel width="100%" height="40px">
                    <CCPanel id="ShopItemBorder" hittest={false} />
                    <CCItemImage id="ShopItemImage" hittest={true} hittestchildren={true} onactivate={() => this.OnClick_Buy()} oncontextmenu={() => this.OnClick_Buy()} itemname={sItemName} iLevel={iLevel} showtooltip={true} />
                    {showlimit && <Label id="leftCount" text={`${iLeftCount}/${iLimit}`} />}
                </CCPanel>
                <CCPanel flowChildren="right" horizontalAlign="center">
                    <CCIcon_CoinType verticalAlign="center" width="16px" height="16px" cointype={this.props.iCoinType} />
                    <CCLabel type="Gold" text={costcount} fontSize={'16px'} />
                </CCPanel>
            </Panel>
        )
    }
}