
import React from "react";
import { TShopSellItem } from "../../../../scripts/tscripts/shared/service/shop/TShopSellItem";
import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCIcon_CoinType } from "../AllUIElement/CCIcons/CCIcon_CoinType";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCMainPanel } from "../MainPanel/CCMainPanel";
import { CCShopItem } from "./CCShopItem";
import { CCShopSellDetailDialog } from "./CCShopSellDetailDialog";
import "./CCShopSellItem.less";

interface ICCShopSellItem {
    entity: TShopSellItem
}

export class CCShopSellItem extends CCPanel<ICCShopSellItem> {

    onInitUI() {
        this.props.entity && this.ListenUpdate(this.props.entity);
    }

    onBtnBuyClick() {
        let tCharacter = GTCharacter.GetOneInstance(GGameScene.Local.BelongPlayerid);
        const sellitem = (this.props.entity)!;
        if (sellitem.SellConfig!.VipLimit && !tCharacter.IsVip()) {
            TipsHelper.showErrorMessage("vip limit")
            return;
        }
        CCMainPanel.GetInstance()!.addOnlyPanel(CCShopSellDetailDialog, { entity: this.props.entity })
    }

    render() {
        const sellitem = (this.props.entity)!;
        const sellinfo = sellitem.SellConfig!;
        const end_time = sellinfo.SellStartTime + sellinfo.SellValidTime;
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
        let discont = sellinfo.Discount;
        return (
            <Panel className="CCShopSellItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                {/* 商品图 */}
                <CCShopItem itemname={sellinfo.ItemName} itemid={sellinfo.ItemConfigId} count={sellinfo.ItemCount} >
                    {/* 限购倒计时 */}
                    {end_time > 0 &&
                        <Countdown id="SaleCountingDown" className="HeadTag" endTime={Number(end_time) || 0} hittest={false}>
                            <Label id="Timer" localizedText="{t:d:t:countdown_time}" />
                            <Label id="LimitedSaleTime" localizedText="#LimitedSaleTime" />
                        </Countdown>}
                    {/* 期间限购 */}
                    {iLimitCount > 0 &&
                        <Panel id="SaleLimit" hittest={false}>
                            <Label key={iLimitCount} localizedText={`#lang_Shop_Goods_limit_${sellinfo.SellRefreshType}`} dialogVariables={{ current: sellitem.BuyCount || 0, total: iLimitCount || 0 }} />
                        </Panel>}
                    {/* 折扣 */}
                    {discont > 0 && discont < 100 &&
                        <Panel id="Discount" hittest={false}>
                            <Label localizedText="-{d:discont}%" dialogVariables={{ discont: Math.round(discont) }} />
                        </Panel>
                    }
                    {
                        sellinfo.VipLimit && <CCPanel id="VipLimit" hittest={false} tooltip={"会员专属"} />
                    }
                </CCShopItem>
                {/* 购买按钮 */}
                <CCButton id="ShopItemButton" className={buttonID} onactivate={() => this.onBtnBuyClick()} enabled={bEnable}>
                    {/* RMB */}
                    {buttonID == "RMBBtn" && <Label localizedText={"#" + KVHelper.KVLang().Shop_Buy_With_Money.Des} dialogVariables={{ price: String(price) }} />}
                    {/* Free */}
                    {buttonID == "FreeBtn" && <Label localizedText={"#" + KVHelper.KVLang().Free.Des} />}
                    {/* Moon */}
                    {buttonID == "MetaBtn" && <CCPanel id="MetaWithNum" hittest={false} align="center center" flowChildren="right">
                        <CCIcon_CoinType cointype={GEEnum.EMoneyType.MetaStone} width="25px" height="25px" />
                        <CCLabel text={price} marginLeft={"6px"} />
                    </CCPanel>}
                    {/* Star */}
                    {buttonID == "StarBtn" && <CCPanel id="StarWithNum" hittest={false}>
                        <CCIcon_CoinType cointype={GEEnum.EMoneyType.StarStone} width="25px" height="25px" />
                        <Label text={price} />
                    </CCPanel>}
                </CCButton>
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
}