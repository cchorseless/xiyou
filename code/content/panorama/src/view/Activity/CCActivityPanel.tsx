
import React from "react";
import { EEnum } from "../../../../scripts/tscripts/shared/Gen/Types";
import { PathHelper } from "../../helper/PathHelper";
import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCMenuNavigation } from "../AllUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCVerticalTable } from "../AllUIElement/CCTable/CCVerticalTable";
import { CCCoinAddPanel } from "../Shop/CCCoinAddPanel";
import "./CCActivityPanel.less";
interface ICCActivityPanel extends NodePropsData {

}

export class CCActivityPanel extends CCPanel<ICCActivityPanel> {
    onReady() {
        return Boolean(GGameScene.Local.TCharacter && GGameScene.Local.TCharacter.DataComp)
    }

    onInitUI() {
        GGameScene.Local.TCharacter.DataComp!.RegRef(this)
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
        const DataComp = this.GetStateEntity(GGameScene.Local.TCharacter.DataComp!)!;
        const MetaStone = DataComp.NumericComp!.GetAsInt(EEnum.EMoneyType.MetaStone)
        const StarStone = DataComp.NumericComp!.GetAsInt(EEnum.EMoneyType.StarStone)
        const selectindex = this.GetState<number>("selectindex") || 0;
        return (
            <Panel id="CC_ActivityPanel" className="CC_root" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PanelBg" fullcontent={true} verticalAlign="top" marginTop="120px" onClose={() => this.closeThis()} >
                    <CCPanel id="PanelHeader" flowChildren="right">
                        <CCImage id="PanelIcon" backgroundImage={PathHelper.getCustomImageUrl("icon/" + sName + ".png")} />
                        <CCLabel id="PanelName" localizedText={"#lang_MenuButton_" + sName} />
                        <CCPanel flowChildren="right" horizontalAlign="right" verticalAlign="center" marginRight={"20px"}>
                            <CCCoinAddPanel cointype="MetaStone" value={MetaStone} onaddcoin={() => this.addMetaStone()} />
                            <CCCoinAddPanel marginLeft={"20px"} cointype="StarStone" value={StarStone} />
                        </CCPanel>
                    </CCPanel>
                    <CCPanel id="PanelContent" flowChildren="right">
                        <CCVerticalTable marginTop={"20px"} list={[
                            "首充",
                            "每月30天登陆",
                            "每日在线祈福",
                            "储钱罐翻倍",
                            "赛季开始7天登录",
                            "赛季累计消费原石奖励",
                            "赛季累计获得原石奖励",
                            "赛季累计在线奖励",
                            "师徒关系",
                        ]} onChange={(index: number, text: string) => {
                            this.UpdateState({ selectindex: index })
                        }} />
                        {

                        }
                    </CCPanel>
                    {this.props.children}
                    {this.__root___childs}
                </CCPopUpDialog>
            </Panel>
        )
    };
}