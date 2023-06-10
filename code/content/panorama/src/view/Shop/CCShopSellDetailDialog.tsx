
import React from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { JsonConfigHelper } from "../../../../scripts/tscripts/shared/Gen/JsonConfigHelper";
import { TShopSellItem } from "../../../../scripts/tscripts/shared/service/shop/TShopSellItem";
import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCIcon_CoinType } from "../AllUIElement/CCIcons/CCIcon_CoinType";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCWaitProgressDialog } from "../Common/CCWaitProgressDialog";
import { CCShopItem } from "./CCShopItem";
import "./CCShopSellDetailDialog.less";

interface ICCShopSellDetailDialog {
    entity: TShopSellItem
}

export class CCShopSellDetailDialog extends CCPanel<ICCShopSellDetailDialog> {

    onInitUI() {
        this.props.entity && this.ListenUpdate(this.props.entity);
        this.UpdateState({ iNum: 1 })
    }

    onBtnBuyClick() {
        const iNum = this.GetState<number>("iNum");
        const sellitem = (this.props.entity)!;
        let tCharacter = GTCharacter.GetOneInstance(GGameScene.Local.BelongPlayerid);
        if (!tCharacter.IsVip() && sellitem.SellConfig!.VipLimit) {
            TipsHelper.showErrorMessage("not vip")
            return;
        }
        CCWaitProgressDialog.showProgressDialog({
            protocol: GameProtocol.Protocol.Buy_ShopItem,
            data: {
                ShopConfigId: sellitem.ShopId,
                SellConfigId: sellitem.SellConfig!.SellConfigid,
                PriceType: CSSHelper.IsChineseLanguage() ? 0 : 1,
                ItemCount: iNum
            } as C2H_Buy_ShopItem,
        })
        this.close();
    }
    render() {
        const sellitem = (this.props.entity)!;
        const sellinfo = sellitem.SellConfig!;
        const itemid = sellinfo.ItemConfigId;
        const itemconfig = JsonConfigHelper.GetRecordItemConfig(itemid)
        const iNum = this.GetState<number>("iNum");
        let maxNum = 9999;
        if (sellinfo.SellCount > 0) { maxNum = sellinfo.SellCount - sellitem.BuyCount };
        // 按钮类型
        let price = sellinfo.RealPrice || 0;
        let iOriginPrice = sellinfo.OriginPrice || 0;
        // 海外价格
        if (!CSSHelper.IsChineseLanguage()) {
            price = sellinfo.OverSeaRealPrice || 0;
            iOriginPrice = sellinfo.OverSeaOriginPrice || 0;
        }
        let buttonID = "";
        if (price == 0) {
            buttonID = "FreeBtn";
        }
        else if (sellinfo.CostType == GEEnum.EMoneyType.MetaStone) {
            buttonID = "MetaBtn";
        }
        else if (sellinfo.CostType == GEEnum.EMoneyType.StarStone) {
            buttonID = "StarBtn";
        }
        else if (sellinfo.CostType == GEEnum.EMoneyType.Money) {
            buttonID = "RMBBtn";
        }
        // 限购
        let bEnable = true;
        let iLimitCount = sellinfo.SellCount;
        if (iLimitCount > 0) {
            bEnable = sellitem.BuyCount < iLimitCount;
        }
        return (
            <Panel className="CCShopSellDetailDialog" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PopUpBg" title="商品购买" onClose={() => this.close()}>
                    <CCPanel flowChildren="right" >
                        <CCShopItem itemname={sellinfo.ItemName} itemid={sellinfo.ItemConfigId} count={sellinfo.ItemCount} />
                        <CCPanel flowChildren="down" >
                            <Label id="ShopDetailDesc" text={itemconfig?.ItemDes} html={true} />
                            <Panel id="NumberEntry" hittest={false}>
                                <CCButton id="NumberReduce" enabled={iNum > 0} onactivate={() => {
                                    if (iNum <= 1) { return }
                                    this.UpdateState({ iNum: iNum - 1 })
                                }
                                } />
                                <TextEntry text={String(iNum)} textmode="numeric" ontextentrychange={(t) => {
                                    let curcount = Number(t.text);
                                    if (curcount <= 0) { curcount = 1 }
                                    else if (curcount >= maxNum) { curcount = maxNum }
                                    this.UpdateState({ iNum: curcount })
                                }} />
                                <CCButton id="NumberAdd" enabled={iNum < maxNum} onactivate={() => {
                                    if (iNum >= maxNum) { return }
                                    this.UpdateState({ iNum: iNum + 1 })
                                }
                                } />
                            </Panel>
                            {/* 购买按钮 */}
                            <CCButton className={CSSHelper.ClassMaker("BuyButton ", buttonID)} onactivate={() => this.onBtnBuyClick()} enabled={bEnable}>
                                {/* RMB */}
                                {buttonID == "RMBBtn" && <Label localizedText={"#" + KVHelper.KVLang().Shop_Buy_With_Money.Des} dialogVariables={{ price: String(price * iNum) }} />}
                                {/* Free */}
                                {buttonID == "FreeBtn" && <Label localizedText={"#" + KVHelper.KVLang().Free.Des} />}
                                {/* Moon */}
                                {buttonID == "MetaBtn" && <Panel id="MoonWithNum" hittest={false}>
                                    <CCIcon_CoinType cointype={GEEnum.EMoneyType.MetaStone} />
                                    <Label text={price * iNum} />
                                </Panel>}
                                {/* Star */}
                                {buttonID == "StarBtn" && <Panel id="StarWithNum" hittest={false}>
                                    <CCIcon_CoinType cointype={GEEnum.EMoneyType.StarStone} />
                                    <Label text={price * iNum} />
                                </Panel>}
                            </CCButton>
                        </CCPanel>
                    </CCPanel>
                    {this.props.children}
                    {this.__root___childs}
                </CCPopUpDialog>
            </Panel>
        )
    }
}