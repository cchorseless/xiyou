
import React from "react";
import { EEnum } from "../../../../scripts/tscripts/shared/Gen/Types";
import { TShopSellItem } from "../../../../scripts/tscripts/shared/service/shop/TShopSellItem";
import { CSSHelper } from "../../helper/CSSHelper";
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
        this.props.entity && this.props.entity.RegRef(this);
    }

    onBtnBuyClick() {
        const sellitem = this.GetStateEntity(this.props.entity)!;
        if (sellitem.SellConfig.VipLimit == 1) {
            let MemberShip = GTActivityMemberShipData.GetOneInstance(GGameScene.Local.BelongPlayerid);
            if (!MemberShip?.IsVip()) {
                // TipsHelper.showErrorMessage()
                return;
            }
            CCMainPanel.GetInstance()!.addOnlyPanel(CCShopSellDetailDialog, { entity: this.props.entity })
        }
    }

    render() {
        const sellitem = this.GetStateEntity(this.props.entity)!;
        const sellinfo = sellitem.SellConfig;
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
        else if (sellinfo.CostType == EEnum.EMoneyType.MetaStone) {
            buttonID = "MoonBtn";
        }
        else if (sellinfo.CostType == EEnum.EMoneyType.StarStone) {
            buttonID = "StarBtn";
        }
        else if (sellinfo.CostType == EEnum.EMoneyType.Money) {
            buttonID = "RMBBtn";
        }
        // 限购
        let bEnable = true;
        let iLimitCount = sellinfo.SellCount;
        if (iLimitCount > 0) {
            bEnable = sellitem.BuyCount < iLimitCount;
        }
        let discont = 100 - sellinfo.Discount;
        return (
            <Panel className="CC_ShopSellItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                {/* 商品图 */}
                <CCShopItem itemid={sellinfo.ItemConfigId} count={sellinfo.ItemCount} >
                    {/* 限购倒计时 */}
                    {end_time > 0 &&
                        <Countdown id="SaleCountingDown" className="HeadTag" endTime={Number(end_time) || 0} hittest={false}>
                            <Label id="Timer" localizedText="{t:d:t:countdown_time}" />
                            <Label id="LimitedSaleTime" localizedText="#LimitedSaleTime" />
                        </Countdown>}
                    {/* 期间限购 */}
                    {iLimitCount > 0 &&
                        <Panel id="SaleLimit" hittest={false}>
                            <Label key={iLimitCount} localizedText={`#Shop_Goods_limit_${sellinfo.SellRefreshType}`} dialogVariables={{ current: sellitem.BuyCount || 0, total: iLimitCount || 0 }} />
                        </Panel>}
                    {/* 折扣 */}
                    {discont > 0 && discont < 100 &&
                        <Panel id="Discount" hittest={false}>
                            <Label localizedText="-{d:discont}%" dialogVariables={{ discont: Math.round(discont) }} />
                        </Panel>
                    }
                    {
                        sellinfo.VipLimit == 1 &&
                        <Panel id="VipLimit" hittest={false} />
                    }
                </CCShopItem>
                {/* 购买按钮 */}
                <Button className={CSSHelper.ClassMaker("ShopItemButton ", buttonID)} onactivate={() => this.onBtnBuyClick()} enabled={bEnable}>
                    {/* RMB */}
                    {buttonID == "RMBBtn" && <Label localizedText="#Shop_Buy_With_Money" dialogVariables={{ price: String(price) }} />}
                    {/* Free */}
                    {buttonID == "FreeBtn" && <Label localizedText="#DialogBox_Rcv" />}
                    {/* Moon */}
                    {buttonID == "MoonBtn" && <Panel id="MoonWithNum" hittest={false}>
                        <Image />
                        <Label text={price} />
                    </Panel>}
                    {/* Star */}
                    {buttonID == "StarBtn" && <Panel id="StarWithNum" hittest={false}>
                        <Image />
                        <Label text={price} />
                    </Panel>}
                </Button>
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    }
}