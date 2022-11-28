
import React, { createRef, PureComponent } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { EMoneyType } from "../../game/service/account/CharacterDataComponent";
import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCImage } from "../allCustomUIElement/CCImage/CCImage";
import { CCLabel } from "../allCustomUIElement/CCLabel/CCLabel";
import { CCMenuNavigation } from "../allCustomUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../allCustomUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCVerticalTable } from "../allCustomUIElement/CCTable/CCVerticalTable";
import { CCCoinAddPanel } from "./CCCoinAddPanel";

interface ICCStorePanel extends NodePropsData {

}

export class CCStorePanel extends CCPanel<ICCStorePanel> {
    onReady() {
        return Boolean(PlayerScene.Local.TCharacter && PlayerScene.Local.TCharacter.DataComp)
    }

    onInitUI() {
        PlayerScene.Local.TCharacter.DataComp?.RegRef(this)
    }

    closeThis() {
        this.close();
        CCMenuNavigation.GetInstance()?.NoSelectAny();
    }

    addMetaStone() {

    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_StorePanel")
        }
        const sName = "store";
        const DataComp = this.GetStateEntity(PlayerScene.Local.TCharacter.DataComp!)!;
        const MetaStone = DataComp.NumericComp!.GetAsInt(EMoneyType.MetaStone)
        const StarStone = DataComp.NumericComp!.GetAsInt(EMoneyType.StarStone)
        const selecttext = this.GetState<number>("selectindex") || 0;
        return (
            <Panel id="CC_StorePanel" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog fullcontent={true} verticalAlign="top" marginTop="120px" onClose={() => this.closeThis()} >
                    <CCPanel id="StoreHeader" flowChildren="right">
                        <CCImage backgroundImage={CSSHelper.getCustomImageUrl("icon/" + sName + ".png")} />
                        <CCPanel flowChildren="down">
                            <CCLabel id="PanelName" />
                            <CCLabel id="PanelDes" />
                        </CCPanel>
                        <CCCoinAddPanel cointype="MetaStone" value={MetaStone} onaddcoin={() => this.addMetaStone()} />
                        <CCCoinAddPanel cointype="StarStone" value={StarStone} />
                    </CCPanel>
                    <CCPanel id="StoreContent" flowChildren="right">
                        <CCVerticalTable list={[
                            "Home",
                            "Props",
                            "Chest",
                            "Resource",
                            "Star",]} onChange={(index: number, text: string) => {
                                this.UpdateState({ selectindex: index })
                            }} />


                    </CCPanel>
                    {this.props.children}
                    {this.__root___childs}
                </CCPopUpDialog>
            </Panel>
        )
    };
}