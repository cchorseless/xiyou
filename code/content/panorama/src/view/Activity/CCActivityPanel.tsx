
import React from "react";
import { PathHelper } from "../../helper/PathHelper";
import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCMenuNavigation } from "../AllUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCVerticalTable } from "../AllUIElement/CCTable/CCVerticalTable";
import { CCCoinAddPanel } from "../Shop/CCCoinAddPanel";
import { CCActivityDailyOnlinePrize } from "./CCActivityDailyOnlinePrize";
import { CCActivityGiftCommond } from "./CCActivityGiftCommond";
import { CCActivityInvestMetaStone } from "./CCActivityInvestMetaStone";
import { CCActivityMonthLogin } from "./CCActivityMonthLogin";
import "./CCActivityPanel.less";
import { CCActivitySevenDayLogin } from "./CCActivitySevenDayLogin";
import { CCActivityTotalGainMetaStone } from "./CCActivityTotalGainMetaStone";
interface ICCActivityPanel extends NodePropsData {

}

export class CCActivityPanel extends CCPanel<ICCActivityPanel> {
    onReady() {
        return Boolean(GGameScene.Local.TCharacter && GGameScene.Local.TCharacter.DataComp)
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.TCharacter.DataComp!)
    }

    closeThis() {
        this.close();
        CCMenuNavigation.GetInstance()?.NoSelectAny();
    }

    addMetaStone() {

    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_ActivityPanel")
        }
        const sName = "activity";
        const DataComp = (GGameScene.Local.TCharacter.DataComp!)!;
        const MetaStone = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.MetaStone)
        const StarStone = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.StarStone)
        const selectindex = this.GetState<number>("selectindex") || 0;
        return (
            <Panel id="CC_ActivityPanel" className="CC_root" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PanelBg" fullcontent={true} verticalAlign="top" marginTop="120px" onClose={() => this.closeThis()} >
                    <CCPanel id="PanelHeader" flowChildren="right">
                        <CCImage id="PanelIcon" backgroundImage={PathHelper.getCustomImageUrl("icon/" + sName + ".png")} />
                        <CCLabel id="PanelName" localizedText={"#lang_MenuButton_" + sName} />
                        <CCPanel flowChildren="right" horizontalAlign="right" verticalAlign="center" marginRight={"20px"}>
                            <CCCoinAddPanel cointype={GEEnum.EMoneyType.MetaStone} value={MetaStone} onaddcoin={() => this.addMetaStone()} />
                            <CCCoinAddPanel marginLeft={"20px"} cointype={GEEnum.EMoneyType.StarStone} value={StarStone} />
                        </CCPanel>
                    </CCPanel>
                    <CCPanel id="PanelContent" flowChildren="right">
                        <CCVerticalTable defaultSelected={0} marginTop={"20px"} list={[
                            "每日在线",
                            "七日登录",
                            "每月登陆",
                            "原石理财",
                            "累计充值",
                            "兑换码"
                        ]} onChange={(index: number, text: string) => {
                            this.UpdateState({ selectindex: index })
                        }} />
                        <CCPanel id="PanelContentBg">
                            {
                                <CCActivityDailyOnlinePrize opacity={selectindex == 0 ? "1" : "0"} hittest={false} />
                            }
                            {
                                <CCActivitySevenDayLogin opacity={selectindex == 1 ? "1" : "0"} hittest={false} />
                            }
                            {
                                <CCActivityMonthLogin opacity={selectindex == 2 ? "1" : "0"} hittest={false} />
                            }
                            {
                                <CCActivityInvestMetaStone opacity={selectindex == 3 ? "1" : "0"} hittest={false} />
                            }

                            {
                                <CCActivityTotalGainMetaStone opacity={selectindex == 4 ? "1" : "0"} hittest={false} />
                            }

                            {
                                <CCActivityGiftCommond opacity={selectindex == 5 ? "1" : "0"} hittest={false} />

                            }
                        </CCPanel>
                    </CCPanel>
                    {this.props.children}
                    {this.__root___childs}
                </CCPopUpDialog>
            </Panel>
        )
    };
}