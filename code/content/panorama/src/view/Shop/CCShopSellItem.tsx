
import React, { createRef, PureComponent } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { EMoneyType } from "../../game/service/account/CharacterDataComponent";
import { TShopSellItem } from "../../game/service/shop/TShopSellItem";
import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCImage } from "../allCustomUIElement/CCImage/CCImage";
import { CCLabel } from "../allCustomUIElement/CCLabel/CCLabel";
import { CCMenuNavigation } from "../allCustomUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCShopItem } from "./CCShopItem";
import "./CCShopSellItem.less";

interface ICCShopSellItem {
    entity: TShopSellItem
}

export class CCShopSellItem extends CCPanel<ICCShopSellItem> {

    onInitUI() {
        this.props.entity && this.props.entity.RegRef(this);
    }


    render() {
        const sellitem = this.GetStateEntity(this.props.entity)!;
        const sellinfo = sellitem.SellConfig;
        // 按钮类型
        let price = sellinfo.RealPrice || 0;
        let iOriginPrice = sellinfo.OriginPrice || 0;
        // 海外价格
        if (!CSSHelper.IsChineseLanguage()) {
            price = sellinfo.OverSeaRealPrice || 0;
            iOriginPrice = sellinfo.OverSeaOriginPrice || 0;
        }
        let buttonType = 0;// 人民币
        let buttonID = "RMBBtn";
        let sClass = "";
        if (price == 0) {
            buttonType = 1;//免费
            buttonID = "FreeBtn";
        }
        else if (pay_type == "300001") {
            buttonType = 2;// 月石
            buttonID = "MoonBtn";
            // sClass = "";
            // if (moonstone < price) {
            // 	sClass = "PriceNotEnought";
            // 	onactive = () => {
            // 		Popups.Show("moonstone_not_enough", {});
            // 	};
            // }
        } else if (pay_type == "300002") {
            buttonType = 3;
            buttonID = "StarBtn";
            // sClass = "";
            // if (starlight < price) {
            // 	sClass = "PriceNotEnought";
            // 	onactive = () => { };//TODO:星辉不足
            // }
        }
        // 限购
        let bEnable = true;
        let iLimitType = Number(limit_type) || 0;
        let iBoughtCount = Number(bought_count) || 0;
        let iLimitCount = Number(limit_count) || 0;
        if (iLimitType > 0) {
            bEnable = iBoughtCount < iLimitCount;
        }
        if (vip == "1") {
            bEnable &&= plus;
        } else if (vip == "2") {
            bEnable &&= plus_p;
        }

        let discont = 100 - price / iOriginPrice * 100;

        return (
            <Panel id="CC_ShopGoodItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                {/* 限购倒计时 */}
                {end_time && <Countdown id="SaleCountingDown" className="HeadTag" endTime={Number(end_time) || 0} hittest={false}>
                    <Label id="Timer" localizedText="{t:d:t:countdown_time}" />
                    <Label id="LimitedSaleTime" localizedText="#LimitedSaleTime" />
                </Countdown>}
                {/* 期间限购 */}
                {iLimitType > 0 &&
                    <Panel id="SaleLimit" hittest={false}>
                        <Label key={limit_type} localizedText={`#Shop_Goods_limit_${limit_type}`} dialogVariables={{ current: Number(bought_count) || 0, total: Number(limit_count) || 0 }} />
                    </Panel>}
                {/* 折扣 */}
                {discont > 0 && discont < 100 &&
                    <Panel id="Discount" hittest={false}>
                        <Label key={limit_type} localizedText="-{d:discont}%" dialogVariables={{ discont: Math.round(discont) }} />
                    </Panel>
                }
                {/* 免费标签 */}
                {buttonType == 1 && <Panel id="FreeTag" className="HeadTag" hittest={false} >
                    <Label localizedText="#Free" />
                </Panel>}
                {/* 商品图 */}
                <CCShopItem itemid={sellinfo.ItemConfigId} count={sellinfo.ItemCount} />
                {/* 购买按钮 */}
                <Button id={buttonID} className={"ShopItemButton " + sClass} onactivate={onactive} enabled={bEnable}>
                    {/* RMB */}
                    {buttonType == 0 && <Label localizedText="#Shop_Buy_With_Money" dialogVariables={{ price: String(price) }} />}
                    {/* Free */}
                    {buttonType == 1 && <Label localizedText="#DialogBox_Rcv" />}
                    {/* Moon */}
                    {buttonType == 2 && <Panel id="MoonWithNum" hittest={false}>
                        <Image />
                        <Label text={price} />
                    </Panel>}
                    {/* Star */}
                    {buttonType == 3 && <Panel id="StarWithNum" hittest={false}>
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