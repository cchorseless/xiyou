import React, { createRef } from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { TActivityGiftCommond } from "../../../../scripts/tscripts/shared/service/activity/TActivityGiftCommond";
import { TActivityGiftCommondData } from "../../../../scripts/tscripts/shared/service/activity/TActivityGiftCommondData";
import { NetHelper } from "../../helper/NetHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCMainPanel } from "../MainPanel/CCMainPanel";
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
                CCMainPanel.GetInstance()!.addOnlyPanel(CCStorageItemGetDialog, {
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
                <CCActivityRuleNoteItem str="每自然月内累计登录即可领取好礼,每月1号0点(GT+8)重置累计登录。" height="200px" />
                <CCPanelHeader type="Tui7" localizedStr="#累计登录奖励" />
                <Panel className="TotalLoginItemBg" >
                    {/* <CCLabel type="Title" text={`累计签到(${logdaycount}/${totalday})天`} horizontalAlign="center" marginTop={"25px"} /> */}

                </Panel>

            </CCPanel>
        </Panel>
    }
}