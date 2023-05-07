
import React from "react";
import { PathHelper } from "../../helper/PathHelper";

import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCMenuNavigation } from "../AllUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCVerticalTable } from "../AllUIElement/CCTable/CCVerticalTable";
import { CCCoinAddPanel } from "../Shop/CCCoinAddPanel";
import { CCHandBookArtifact } from "./CCHandBookArtifact";
import { CCHandBookCourier } from "./CCHandBookCourier";
import { CCHandBookEquip } from "./CCHandBookEquip";
import { CCHandBookFaq } from "./CCHandBookFaq";
import { CCHandBookHero } from "./CCHandBookHero";
import "./CCHandBookPanel.less";
import { CCHandBookWearable } from "./CCHandBookWearable";
interface ICCHandBookPanel extends NodePropsData {

}

export class CCHandBookPanel extends CCPanel<ICCHandBookPanel> {
    onReady() {
        return Boolean(GGameScene.Local.TCharacter && GGameScene.Local.TCharacter.DataComp)
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.TCharacter.DataComp!)
    }

    closeThis() {
        this.hide();
        CCMenuNavigation.GetInstance()?.NoSelectAny();
    }

    addMetaStone() {

    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_HandBookPanel")
        }
        const sName = "handbook";
        const DataComp = (GGameScene.Local.TCharacter.DataComp!)!;
        const MetaStone = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.MetaStone)
        const StarStone = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.StarStone)
        const selectindex = this.GetState<number>("selectindex") || 0;
        return (
            <Panel id="CC_HandBookPanel" className="CC_root" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PanelBg" fullcontent={true} onClose={() => this.closeThis()} >
                    <CCPanel id="PanelHeader" flowChildren="right">
                        <CCImage id="PanelIcon" backgroundImage={PathHelper.getCustomImageUrl("icon/" + sName + ".png")} />
                        <CCLabel id="PanelName" localizedText={"#lang_MenuButton_" + sName} />
                        <CCPanel flowChildren="right" horizontalAlign="right" verticalAlign="center" marginRight={"20px"}>
                            <CCCoinAddPanel cointype={GEEnum.EMoneyType.MetaStone} value={MetaStone} onaddcoin={() => this.addMetaStone()} />
                            <CCCoinAddPanel marginLeft={"20px"} cointype={GEEnum.EMoneyType.StarStone} value={StarStone} />
                        </CCPanel>
                    </CCPanel>
                    <CCPanel id="PanelContent" flowChildren="right" width="100%" height="100%">
                        <CCVerticalTable marginTop={"20px"} list={[
                            $.Localize("#lang_hero"),
                            $.Localize("#lang_wearable"),
                            $.Localize("#lang_courier"),
                            $.Localize("#lang_equip"),
                            $.Localize("#lang_artifact"),
                            $.Localize("#lang_faq")
                        ]} onChange={(index: number, text: string) => {
                            GLogHelper.print("index:" + index + " text:" + text)
                            this.UpdateState({ selectindex: index - 1 })
                        }} />
                        {
                            <CCPanel id="PanelContentBg"  >
                                {
                                    <CCHandBookHero opacity={selectindex == 0 ? "1" : "0"} hittest={false} />
                                }
                                {
                                    <CCHandBookWearable opacity={selectindex == 1 ? "1" : "0"} hittest={false} />
                                }
                                {
                                    <CCHandBookCourier opacity={selectindex == 2 ? "1" : "0"} hittest={false} />
                                }
                                {
                                    <CCHandBookEquip opacity={selectindex == 3 ? "1" : "0"} hittest={false} />
                                }
                                {
                                    <CCHandBookArtifact opacity={selectindex == 4 ? "1" : "0"} hittest={false} />
                                }
                                {
                                    <CCHandBookFaq opacity={selectindex == 5 ? "1" : "0"} hittest={false} />
                                }
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