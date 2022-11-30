
import React, { createRef, PureComponent } from "react";
import { EEnum } from "../../../../../game/scripts/tscripts/shared/Gen/Types";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCDividerLine } from "../allCustomUIElement/CCDivider/CCDividerLine";
import { CCImage } from "../allCustomUIElement/CCImage/CCImage";
import { CCLabel } from "../allCustomUIElement/CCLabel/CCLabel";
import { CCMenuNavigation } from "../allCustomUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../allCustomUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCVerticalTable } from "../allCustomUIElement/CCTable/CCVerticalTable";
import { CCCoinAddPanel } from "./CCCoinAddPanel";
import "./CCShopPanel.less";
interface ICCShopPanel extends NodePropsData {

}

export class CCShopPanel extends CCPanel<ICCShopPanel> {
    onReady() {
        return Boolean(PlayerScene.Local.TCharacter && PlayerScene.Local.TCharacter.DataComp)
    }

    onInitUI() {
        PlayerScene.Local.TCharacter.DataComp?.RegRef(this);
        LogHelper.print(PlayerScene.Local.TCharacter.ShopComp?.ShopUnit)
    }

    closeThis() {
        this.close();
        CCMenuNavigation.GetInstance()?.NoSelectAny();
    }

    addMetaStone() {

    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_ShopPanel")
        }
        const sName = "store";
        const DataComp = this.GetStateEntity(PlayerScene.Local.TCharacter.DataComp!)!;
        const MetaStone = DataComp.NumericComp!.GetAsInt(EEnum.EMoneyType.MetaStone)
        const StarStone = DataComp.NumericComp!.GetAsInt(EEnum.EMoneyType.StarStone)
        const selectindex = this.GetState<number>("selectindex") || 0;
        return (
            <Panel id="CC_ShopPanel" className="CC_root" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PanelBg" fullcontent={true} verticalAlign="top" marginTop="120px" onClose={() => this.closeThis()} >
                    <CCPanel id="PanelHeader" flowChildren="right">
                        <CCImage id="PanelIcon" backgroundImage={CSSHelper.getCustomImageUrl("icon/" + sName + ".png")} />
                        <CCLabel id="PanelName" localizedText={"#lang_MenuButton_" + sName} />
                        <CCPanel flowChildren="right" horizontalAlign="right" verticalAlign="center" marginRight={"20px"}>
                            <CCCoinAddPanel cointype="MetaStone" value={MetaStone} onaddcoin={() => this.addMetaStone()} />
                            <CCCoinAddPanel marginLeft={"20px"} cointype="StarStone" value={StarStone} />
                        </CCPanel>
                    </CCPanel>
                    <CCPanel id="PanelContent" flowChildren="right">
                        <CCVerticalTable marginTop={"20px"} list={[
                            "Home",
                            "Props",
                            "Chest",
                            "Resource",
                            "Star",]} onChange={(index: number, text: string) => {
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