import React, { createRef } from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { TActivityGiftCommond } from "../../../../scripts/tscripts/shared/service/activity/TActivityGiftCommond";
import { TActivityGiftCommondData } from "../../../../scripts/tscripts/shared/service/activity/TActivityGiftCommondData";
import { TActivityGiftCommondItem } from "../../../../scripts/tscripts/shared/service/activity/TActivityGiftCommondItem";
import { NetHelper } from "../../helper/NetHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCStorageItemGetDialog } from "../Storage/CCStorageItemGetDialog";
import "./CCActivityGiftCommond.less";
import { CCActivityRuleNoteItem } from "./CCActivityRuleNoteItem";


interface ICCActivityGiftCommond {
}

export class CCActivityGiftCommond extends CCPanel<ICCActivityGiftCommond> {
    onInitUI() {
        this.ListenUpdate(TActivityGiftCommondData.GetOneInstance(GGameScene.Local.BelongPlayerid))
    }

    OnBtnGetPrize(cdk: string) {
        NetHelper.SendToCSharp(GameProtocol.Protocol.GetPrize_ActivityGiftCommond, {
            GiftConfigId: cdk
        }, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            if (e.state) {
                let info = JSON.parse(e.message!) as IFItemInfo;
                CCStorageItemGetDialog.showItemGetDialog({
                    Items: [
                        { ItemConfigId: info.ItemConfigId, ItemCount: info.ItemCount },
                    ]
                })
            }
        }))

    }

    refCDK = createRef<TextEntry>();

    render() {
        const GiftCommond = TActivityGiftCommond.GetOneInstance(-1);
        const Gifts = TActivityGiftCommondItem.GetAllInstance().filter(v => v.IsShowUI);
        const GiftCommondData = TActivityGiftCommondData.GetOneInstance(GGameScene.Local.BelongPlayerid);

        return <Panel className={"CCActivityGiftCommond"} ref={this.__root__}  {...this.initRootAttrs()}>
            <CCPanel flowChildren="down" width="75%" height="100%" >
                <Panel id="CDKContainer" hittest={false}>
                    <TextEntry id="CDKEntry" placeholder="CDK" ref={this.refCDK} />
                    <CCButton width="200px" height="50px" color="Gold" text={"#CDK"} onactivate={() => {
                        if (this.refCDK.current) {
                            let text = this.refCDK.current.text;
                            if (text && text.length > 0) {
                                this.OnBtnGetPrize(text);
                            }
                        }
                    }} />
                </Panel>
            </CCPanel>
            <CCPanel flowChildren="down" width="25%" height="100%" >
                <CCActivityRuleNoteItem str="输入礼包码可以兑换奖励。以下只展示本月礼包码，获取更多礼包码，请关注微信公众号。" height="200px" />
                <CCPanelHeader type="Tui7" localizedStr="#本月礼包码" />
                <CCPanel flowChildren="down" height="200px">
                    {
                        Gifts.map((v, index) => {
                            return <CCPanel flowChildren="right" key={index + ""}>
                                <CCLabel type="Title" text={v.Des} width="100px" verticalAlign="center" />
                                <TextEntry className="LastCDKEntry" text={v.ConfigId} />
                            </CCPanel>
                        })
                    }

                </CCPanel>
                <CCPanelHeader type="Tui7" localizedStr="#微信公众号" />
                <Panel className="WeChatQrCode" />
            </CCPanel>
        </Panel>
    }
}