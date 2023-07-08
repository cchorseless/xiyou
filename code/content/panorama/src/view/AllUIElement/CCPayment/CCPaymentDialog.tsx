import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";

import { GameProtocol } from "../../../../../scripts/tscripts/shared/GameProtocol";
import { TPayOrderItem } from "../../../../../scripts/tscripts/shared/service/common/TPayOrderItem";
import { TShopSellItem } from "../../../../../scripts/tscripts/shared/service/shop/TShopSellItem";
import { CSSHelper } from "../../../helper/CSSHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { TipsHelper } from "../../../helper/TipsHelper";
import { CCNotifyDialog } from "../../Common/CCNotifyDialog";
import { CCStorageItemGetDialog } from "../../Storage/CCStorageItemGetDialog";
import { CCButton } from "../CCButton/CCButton";
import { CCImage } from "../CCImage/CCImage";
import { CCPopUpDialog } from "../CCPopUpDialog/CCPopUpDialog";
import { CCPayQrcode } from "./CCPayQrcode";
import "./CCPaymentDialog.less";

interface ICCPaymentDialog extends NodePropsData {
    entity: TShopSellItem,
    iNum: number,
}
const AliPayLogo = "file://{images}/custom_game/eom_design/ccpayment/alipay_logo.png";
const WechatLogo = "file://{images}/custom_game/eom_design/ccpayment/wxpay_logo.png";
export class CCPaymentDialog extends CCPanel<ICCPaymentDialog> {


    onInitUI() {
        this.ListenClassUpdate(TPayOrderItem, (data) => {
            GLogHelper.print("TPayOrderItem:" + data.Id, this.orderIdList, data.State)
            if (this.orderIdList.includes(data.Id)) {
                this.close();
                if (data.State.includes(GameProtocol.EPayOrderState.PayAddItemByEmail)) {
                    CCNotifyDialog.showNotifyDialog({ title: "购买成功", Msg: "背包已满，请前往邮件领取道具。" })
                }
                else if (data.State.includes(GameProtocol.EPayOrderState.PayAddItemSuccess)) {
                    CCStorageItemGetDialog.showItemGetDialog({
                        Items: [{ ItemConfigId: data.ItemConfigId, ItemCount: data.ItemCount }]
                    })
                }
                else {
                    TipsHelper.showErrorMessage("购买失败")
                }
            }
        })
        const sLanguage = $.Language().toLowerCase();
        const bschinese = sLanguage == "schinese";
        if (bschinese) {

        }
    }

    orderIdList: string[] = [];
    createOrder(paytype: number) {
        const sellitem = this.props.entity;
        const iNum = this.props.iNum;
        this.UpdateState({ ["isrefresh_" + paytype]: true })
        NetHelper.SendToCSharp(GameProtocol.Protocol.Buy_ShopItem,
            {
                ShopConfigId: sellitem.ShopId,
                SellConfigId: sellitem.SellConfig!.SellConfigid,
                PriceType: CSSHelper.IsChineseLanguage() ? 0 : 1,
                ItemCount: iNum,
                PayType: paytype,
            } as C2H_Buy_ShopItem,
            GHandler.create(this, (data: JS_TO_LUA_DATA) => {
                if (data.state) {
                    let obj = GFromJson(data.message!) as { orderid: string, message: string };
                    if (obj) {
                        this.orderIdList.push(obj.orderid);
                        GLogHelper.print("orderid:" + obj.orderid)
                        this.UpdateState({ ["qrcode_" + paytype]: obj.message, ["isrefresh_" + paytype]: true })
                    }

                }
                else {
                    TipsHelper.showErrorMessage("获取二维码失败")
                    this.UpdateState({ ["isrefresh_" + paytype]: false })
                }
            })
        )
    }

    render() {
        const sLanguage = $.Language().toLowerCase();
        const sellitem = this.props.entity;
        const bschinese = sLanguage == "schinese";
        const alirefresh = this.GetState<boolean>("isrefresh_" + GameProtocol.EPayOrderSourceType.AliPay_QrCode, false);
        const wechatrefresh = this.GetState<boolean>("isrefresh_" + GameProtocol.EPayOrderSourceType.WeChat_QrCodeV3, false);
        const aliqrcode = this.GetState<string>("qrcode_" + GameProtocol.EPayOrderSourceType.AliPay_QrCode, "");
        const wechatqrcode = this.GetState<string>("qrcode_" + GameProtocol.EPayOrderSourceType.WeChat_QrCodeV3, "");
        return (
            <Panel className="CCPaymentDialog" ref={this.__root__} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PanelBg" title={"购买道具：" + sellitem.SellConfig?.ItemName} verticalAlign="top" marginTop="120px" onClose={() => this.close()} >
                    <Panel id="DefaultPayments">
                        <Panel className="Pleasewait" hittest={false}>
                            <Image id="refresh" visible={alirefresh} />
                            <CCPanel flowChildren="down" align="center center" visible={!alirefresh}>
                                <CCImage src={AliPayLogo} width="80px" height="80px" horizontalAlign="center" />
                                <CCButton id="RefreshButton" text="获取二维码" onactivate={() => {
                                    this.createOrder(GameProtocol.EPayOrderSourceType.AliPay_QrCode)

                                }} />
                            </CCPanel>

                            {
                                aliqrcode != "" && <CCPayQrcode link={aliqrcode} logo={AliPayLogo} align="center center" />
                            }
                        </Panel>
                        <Panel className="Pleasewait" hittest={false}>
                            <Image id="refresh" visible={wechatrefresh} />
                            <CCPanel flowChildren="down" align="center center" visible={!wechatrefresh}>
                                <CCImage src={WechatLogo} width="80px" height="80px" horizontalAlign="center" />
                                <CCButton id="RefreshButton" text="获取二维码" onactivate={() => {
                                    this.createOrder(GameProtocol.EPayOrderSourceType.WeChat_QrCodeV3)
                                }} />
                            </CCPanel>
                            {
                                wechatqrcode != "" && <CCPayQrcode link={wechatqrcode} logo={WechatLogo} align="center center" />
                            }

                        </Panel>
                    </Panel>
                </CCPopUpDialog>

                {/* <Panel id="MorePaymentMethod" hittest={false}>
                    <TextEntry id="PaymentSearch" ontextentrychange={onSearch} oninputsubmit={onSearch} ref={refText} placeholder="#DOTA_Search" />
                    <Panel id="MorePaymentMethodList" hittest={false}>
                        {filteredPayments.map(([pmid, enable]) => {
                            if (enable > 0) {
                                let payType = (notPayssion.indexOf(pmid) == -1 ? "4000" : pmid) as PaymentType;
                                return (
                                    <Panel key={pmid} className="Paytype" onactivate={() => { requestLinkAndOpen(payType, pmid); }}>
                                        <Image src={`file://{images}/custom_game/eom_design/ccpayment/${pmid}.png`} />
                                    </Panel>
                                );
                            }
                        })}
                    </Panel>
                </Panel>
                <Panel id="overSeaCodeContainer" className="CommonWindowBG" visible={overSeaCode != undefined} hittest={false}>
                    <Button className="CommonCloseButton" onactivate={() => { SetOverSeaCode(undefined); }} />
                    {overSeaCode}
                </Panel> */}
            </Panel>
        )
    }
}