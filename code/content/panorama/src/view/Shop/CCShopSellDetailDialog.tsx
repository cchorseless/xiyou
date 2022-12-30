
import React, { createRef, PureComponent } from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { JsonConfigHelper } from "../../../../scripts/tscripts/shared/Gen/JsonConfigHelper";
import { EEnum } from "../../../../scripts/tscripts/shared/Gen/Types";
import { TShopSellItem } from "../../game/service/shop/TShopSellItem";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCWaitProgressDialog } from "../Common/CCWaitProgressDialog";
import { CCCoinAddPanel } from "./CCCoinAddPanel";
import { CCShopItem } from "./CCShopItem";
import "./CCShopSellDetailDialog.less";

interface ICCShopSellDetailDialog {
    entity: TShopSellItem
}

export class CCShopSellDetailDialog extends CCPanel<ICCShopSellDetailDialog> {

    onInitUI() {
        this.props.entity && this.props.entity.RegRef(this);
        GGameScene.Local.TCharacter.DataComp?.RegRef(this);
        this.UpdateState({ iNum: 0 })
    }

    onBtnBuyClick() {
        const iNum = this.GetState<number>("iNum");
        const sellitem = this.GetStateEntity(this.props.entity)!;
        if (sellitem.SellConfig.VipLimit == 1) {
            this.close();
            let MemberShip = GGameScene.Local.TCharacter.ActivityComp?.MemberShip;
            if (!MemberShip?.IsVip()) {
                // TipsHelper.showErrorMessage()
                return;
            }
            CCWaitProgressDialog.showProgressDialog({
                protocol: GameProtocol.Protocol.Buy_ShopItem,
                data: {
                    ShopId: sellitem.ShopId + "",
                    ItemId: sellitem.SellConfig.ItemConfigId + "",
                    ItemCount: iNum
                } as C2H_Buy_ShopItem,
            })
        }
    }
    render() {
        const DataComp = this.GetStateEntity(GGameScene.Local.TCharacter.DataComp!)!;
        const MetaStone = DataComp.NumericComp!.GetAsInt(EEnum.EMoneyType.MetaStone)
        const StarStone = DataComp.NumericComp!.GetAsInt(EEnum.EMoneyType.StarStone)
        const sellitem = this.GetStateEntity(this.props.entity)!;
        const sellinfo = sellitem.SellConfig;
        const itemid = sellinfo.ItemConfigId;
        const itemconfig = JsonConfigHelper.GetRecordItemConfig(itemid)
        const iNum = this.GetState<number>("iNum");
        let maxNum = sellinfo.SellCount - sellitem.BuyCount;
        if (maxNum) { maxNum = 9999 };
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
        return (
            <Panel className="CC_ShopSellDetailDialog" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PopUpBg" onClose={() => this.close()}>
                    <CCShopItem itemid={sellinfo.ItemConfigId} count={sellinfo.ItemCount} />
                    <Label id="ShopDetailDesc" text={itemconfig?.ItemDes} html={true} />
                    <Panel id="NumberEntry" hittest={false}>
                        <Button id="NumberReduce" enabled={iNum > 0} onactivate={() => this.UpdateState({ iNum: iNum - 1 })} />
                        <TextEntry text={String(iNum)} textmode="numeric" ontextentrychange={(t) => { this.UpdateState({ iNum: (Number(t.text) || 0) }) }} />
                        <Button id="NumberAdd" enabled={iNum < maxNum} onactivate={() => this.UpdateState({ iNum: iNum + 1 })} />
                    </Panel>
                    {/* 购买按钮 */}
                    <Button className={CSSHelper.ClassMaker("BuyButton ", buttonID)} onactivate={() => this.onBtnBuyClick()} enabled={bEnable}>
                        {/* RMB */}
                        {buttonID == "RMBBtn" && <Label localizedText="#Shop_Buy_With_Money" dialogVariables={{ price: String(price * iNum) }} />}
                        {/* Free */}
                        {buttonID == "FreeBtn" && <Label localizedText="#DialogBox_Rcv" />}
                        {/* Moon */}
                        {buttonID == "MoonBtn" && <Panel id="MoonWithNum" hittest={false}>
                            <Image />
                            <Label text={price * iNum} />
                        </Panel>}
                        {/* Star */}
                        {buttonID == "StarBtn" && <Panel id="StarWithNum" hittest={false}>
                            <Image />
                            <Label text={price * iNum} />
                        </Panel>}
                    </Button>
                    <CCPanel flowChildren="down" >
                        <CCCoinAddPanel cointype="MetaStone" value={MetaStone} />
                        <CCCoinAddPanel marginLeft={"20px"} cointype="StarStone" value={StarStone} />
                    </CCPanel>
                    {this.props.children}
                    {this.__root___childs}
                </CCPopUpDialog>
            </Panel>
        )
    }
}