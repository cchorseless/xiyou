
import React from "react";
import { PathHelper } from "../../helper/PathHelper";

import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCMenuNavigation } from "../AllUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCVerticalTable } from "../AllUIElement/CCTable/CCVerticalTable";
import { CCRecordMainItem } from "./CCRecordMainItem";
import "./CCRecordPanel.less";
interface ICCRecordPanel extends NodePropsData {

}

export class CCRecordPanel extends CCPanel<ICCRecordPanel> {
    onReady() {
        return Boolean(GGameScene.Local.TCharacter && GGameScene.Local.TCharacter.DataComp)
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.TCharacter.DataComp)
    }

    closeThis() {
        this.close();
        CCMenuNavigation.GetInstance()?.NoSelectAny();
    }

    addMetaStone() {

    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_RecordPanel")
        }
        const sName = "record";
        const selectindex = this.GetState<number>("selectindex") || 0;
        return (
            <Panel id="CC_RecordPanel" className="CC_root" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PanelBg" fullcontent={true} verticalAlign="top" marginTop="120px" onClose={() => this.closeThis()} >
                    <CCPanel id="PanelHeader" flowChildren="right">
                        <CCImage id="PanelIcon" backgroundImage={PathHelper.getCustomImageUrl("icon/" + sName + ".png")} />
                        <CCLabel id="PanelName" localizedText={"#lang_MenuButton_" + sName} />
                    </CCPanel>
                    <CCPanel id="PanelContent" flowChildren="right">
                        <CCVerticalTable marginTop={"20px"}
                            defaultSelected={0}
                            list={[
                                "主页",
                                "战绩",
                            ]} onChange={(index: number, text: string) => {
                                this.UpdateState({ selectindex: index })
                            }} />
                        {
                            <CCPanel id="PanelContentBg"  >
                                <CCRecordMainItem opacity={selectindex == 0 ? "1" : "0"} />

                                {/* <CCBattlePassTaskItem opacity={selectindex == 1 ? "1" : "0"} /> */}

                                {/* <CCBattlePassChargeItem opacity={selectindex == 2 ? "1" : "0"} /> */}

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