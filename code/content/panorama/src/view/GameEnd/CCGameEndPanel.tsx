
import React from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { CSSHelper } from "../../helper/CSSHelper";
import { NetHelper } from "../../helper/NetHelper";
import { PathHelper } from "../../helper/PathHelper";
import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import "./CCGameEndPanel.less";
interface ICCGameEndPanel extends NodePropsData {

}

export class CCGameEndPanel extends CCPanel<ICCGameEndPanel> {

    onInitUI() {
        NetHelper.ListenOnLua(GameProtocol.Protocol.push_GameEndResult, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            const data = e.data!;

            this.UpdateState({ PopUpEffect: true });
        }))
    }



    render() {
        const PopUpEffect = this.GetState<boolean>("PopUpEffect") || false;
        const sName = "activity";
        const DataComp = (GGameScene.Local.TCharacter.DataComp!)!;
        const selectindex = this.GetState<number>("selectindex") || 0;
        return (
            <Panel className={CSSHelper.ClassMaker("CCGameEndPanel", { PopUpEffect: PopUpEffect })} ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PanelBg" fullcontent={true} verticalAlign="top" marginTop="120px" onClose={() => this.close()} >
                    <CCPanel id="PanelHeader" flowChildren="right">
                        <CCImage id="PanelIcon" backgroundImage={PathHelper.getCustomImageUrl("icon/" + sName + ".png")} />
                        <CCLabel id="PanelName" localizedText={"#lang_MenuButton_" + sName} />
                        <CCPanel flowChildren="right" horizontalAlign="right" verticalAlign="center" marginRight={"20px"}>
                        </CCPanel>
                    </CCPanel>
                    <CCPanel id="PanelContent" flowChildren="right">

                        <CCPanel id="PanelContentBg">

                        </CCPanel>
                    </CCPanel>
                    {this.props.children}
                    {this.__root___childs}
                </CCPopUpDialog>
            </Panel>
        )
    };
}