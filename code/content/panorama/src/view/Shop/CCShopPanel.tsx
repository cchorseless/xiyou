
import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { PathHelper } from "../../helper/PathHelper";
import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCMenuNavigation } from "../AllUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCVerticalTable } from "../AllUIElement/CCTable/CCVerticalTable";
import { CCCoinAddPanel } from "./CCCoinAddPanel";
import "./CCShopPanel.less";
import { CCShopSellItem } from "./CCShopSellItem";

interface ICCShopPanel extends NodePropsData {

}

export class CCShopPanel extends CCPanel<ICCShopPanel> {
    onReady() {
        return Boolean(GGameScene.Local.TCharacter && GGameScene.Local.TCharacter.DataComp)
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.TCharacter.DataComp!);
        GTShopUnit.GetGroupInstance(GGameScene.Local.BelongPlayerid).forEach(e => {
            this.ListenUpdate(e);
        });
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
        const DataComp = (GGameScene.Local.TCharacter.DataComp!)!;
        const MetaStone = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.MetaStone)
        const StarStone = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.StarStone)
        const selectindex = this.GetState<number>("selectindex") || 0;
        const shopunits = GTShopUnit.GetGroupInstance(GGameScene.Local.BelongPlayerid).map((e) => { return (e)! })
        shopunits.sort((a, b) => { return a.ConfigId - b.ConfigId })

        return (
            <Panel id="CC_ShopPanel" className="CC_root" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
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
                        <CCVerticalTable marginTop={"20px"} list={shopunits.map(e => { return $.Localize("#" + e.Config!.ShopName) })}
                            defaultSelected={0}
                            onChange={(index: number, text: string) => { this.UpdateState({ selectindex: index }) }} />
                        <CCPanel id="PanelContent">
                            {
                                [...Array(shopunits.length)].map((_, _index) => {
                                    const shopunit = shopunits[_index];
                                    const allsellitems = shopunit.getAllSellItems();
                                    return <CCPanel key={_index + ""}
                                        className={CSSHelper.ClassMaker({ Hidden: selectindex !== _index })}
                                        flowChildren="right-wrap" scroll={"y"}  >
                                        {
                                            allsellitems.map((e, index) => {
                                                return <CCShopSellItem key={index + ""} entity={e} />
                                            })
                                        }
                                    </CCPanel>
                                })
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