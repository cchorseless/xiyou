
import React from "react";
import { PathHelper } from "../../helper/PathHelper";

import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCMenuNavigation } from "../AllUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCVerticalTable } from "../AllUIElement/CCTable/CCVerticalTable";
import { CCCoinAddPanel } from "../Shop/CCCoinAddPanel";
import { CCBattlePassChargeItem } from "./CCBattlePassChargeItem";
import "./CCBattlePassPanel.less";
import { CCBattlePassPrizeItem } from "./CCBattlePassPrizeItem";
import { CCBattlePassTaskItem } from "./CCBattlePassTaskItem";
interface ICCBattlePassPanel extends NodePropsData {

}

export class CCBattlePassPanel extends CCPanel<ICCBattlePassPanel> {
    onReady() {
        return Boolean(GGameScene.Local.TCharacter && GGameScene.Local.TCharacter.BattlePassComp)
    }
    onInitUI() {
        this.ListenUpdate(GGameScene.Local.TCharacter.BattlePassComp)
    }

    closeThis() {
        this.close();
        CCMenuNavigation.GetInstance()?.NoSelectAny();
    }

    addMetaStone() {

    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_BattlePassPanel")
        }
        const sName = "battlepass";
        const DataComp = (GGameScene.Local.TCharacter.DataComp!)!;
        const MetaStone = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.MetaStone)
        const StarStone = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.StarStone)
        const selectindex = this.GetState<number>("selectindex") || 0;
        return (<Panel id="CC_BattlePassPanel" className="CC_root" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
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
                    <CCVerticalTable marginTop={"20px"} list={[
                        "奖励",
                        "任务",
                        "兑换",
                    ]} defaultSelected={0} onChange={(index: number, text: string) => {
                        this.UpdateState({ selectindex: index })
                    }} />
                    {
                        <CCPanel id="PanelContentBg"  >
                            <CCBattlePassPrizeItem opacity={selectindex == 0 ? "1" : "0"} />

                            <CCBattlePassTaskItem opacity={selectindex == 1 ? "1" : "0"} />

                            <CCBattlePassChargeItem opacity={selectindex == 2 ? "1" : "0"} />

                        </CCPanel>


                    }
                </CCPanel>
                {this.props.children}
                {this.__root___childs}
            </CCPopUpDialog>
        </Panel>
        )
    };
}




