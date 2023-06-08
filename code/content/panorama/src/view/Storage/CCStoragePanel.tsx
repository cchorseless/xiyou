
import React from "react";
import { TItem } from "../../../../scripts/tscripts/shared/service/bag/TItem";
import { CSSHelper } from "../../helper/CSSHelper";
import { PathHelper } from "../../helper/PathHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";

import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCMenuNavigation } from "../AllUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCVerticalTable } from "../AllUIElement/CCTable/CCVerticalTable";
import { CCCoinAddPanel } from "../Shop/CCCoinAddPanel";
import { CCStorageItem } from "./CCStorageItem";
import "./CCStoragePanel.less";
interface ICCStoragePanel extends NodePropsData {

}

export class CCStoragePanel extends CCPanel<ICCStoragePanel> {
    onReady() {
        return Boolean(GGameScene.Local.TCharacter && GGameScene.Local.TCharacter.DataComp && GGameScene.Local.TCharacter.BagComp)
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.TCharacter.DataComp)
        this.ListenUpdate(GGameScene.Local.TCharacter.BagComp)
    }

    closeThis() {
        this.close();
        CCMenuNavigation.GetInstance()?.NoSelectAny();
    }

    addMetaStone() {

    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_StoragePanel")
        }
        const sName = "storage";
        const tablist = [
            "全部",
            "最近获得",
            "限时道具",
            "道具",
            "装备",
            "礼包",
        ];
        const DataComp = (GGameScene.Local.TCharacter.DataComp!)!;
        const BagComp = (GGameScene.Local.TCharacter.BagComp!)!;
        const MetaStone = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.MetaStone)
        const StarStone = DataComp.NumericComp!.GetAsInt(GEEnum.EMoneyType.StarStone)
        const selectindex = this.GetState<number>("selectindex") || 0;
        const selectitem = this.GetState<TItem>("selectitem");
        const allbagitems = BagComp.getAllItem();

        return (
            <Panel id="CC_StoragePanel" className="CC_root" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPopUpDialog id="PanelBg" fullcontent={true} verticalAlign="top" marginTop="120px" onClose={() => this.closeThis()} >
                    <CCPanel id="PanelHeader" flowChildren="right">
                        <CCImage id="PanelIcon" backgroundImage={PathHelper.getCustomImageUrl("icon/" + sName + ".png")} />
                        <CCLabel id="PanelName" localizedText={"#lang_MenuButton_" + sName} />
                        <CCLabel id="StorageCountLimit" text={`(${BagComp.Items.length}/${BagComp.MaxSize})`} />
                        <CCPanel flowChildren="right" horizontalAlign="right" verticalAlign="center" marginRight={"20px"}>
                            <CCCoinAddPanel cointype={GEEnum.EMoneyType.MetaStone} value={MetaStone} onaddcoin={() => this.addMetaStone()} />
                            <CCCoinAddPanel marginLeft={"20px"} cointype={GEEnum.EMoneyType.StarStone} value={StarStone} />
                        </CCPanel>
                    </CCPanel>
                    <CCPanel id="PanelContent" flowChildren="right">
                        <CCVerticalTable marginTop={"20px"} list={tablist}
                            defaultSelected={0}
                            onChange={(index: number, text: string) => {
                                this.UpdateState({ selectindex: index })
                            }} />
                        <CCPanel id="PanelContentBg" >
                            {
                                [...Array(tablist.length)].map((_, _index) => {
                                    let curitems = allbagitems;
                                    switch (_index) {
                                        case 2:
                                            curitems = allbagitems.filter(item => { return GToNumber(item.CreateTime) + 24 * 3600 * 1000 >= GTimerHelper.NowUnix() })
                                            break;
                                        case 3:
                                            curitems = allbagitems.filter(item => { return item.Config.ItemType == GEEnum.EItemType.None })
                                            break;
                                        case 4:
                                            curitems = allbagitems.filter(item => { return item.Config.ItemType == GEEnum.EItemType.TimeItem })
                                            break;
                                        case 5:
                                            curitems = allbagitems.filter(item => { return item.Config.ItemType == GEEnum.EItemType.Treasure })
                                            break;
                                    }
                                    return <CCPanel key={_index + "1111"} className={CSSHelper.ClassMaker({ Hidden: selectindex !== _index })}
                                        flowChildren="right-wrap" width="100%" height="100%" scroll={"y"}  >
                                        {
                                            curitems.map((e, index) => {
                                                return <CCStorageItem key={index + "CCStorageItem"} entity={e} onclick={() => {
                                                    this.UpdateState({ selectitem: e })
                                                }} />
                                            })
                                        }
                                    </CCPanel>
                                })
                            }
                        </CCPanel>
                        <CCPanel className={CSSHelper.ClassMaker({ Hidden: selectitem == null })}>
                            {
                                [0].map((_, index) => {
                                    if (selectitem != null) {
                                        const num = selectitem.ItemCount;
                                        const picurl = PathHelper.getCustomShopItemImageUrl((selectitem.Config!.ItemIcon));
                                        const itemname = $.Localize("#" + (selectitem.Config!.ItemName));
                                        const itemdes = $.Localize("#" + selectitem.Config!.ItemDes);
                                        const rarity = "Rarity_" + GEEnum.ERarity[selectitem.ItemQuality || 1];
                                        return <CCPanel id="StorageItemInfo" flowChildren="down" key={index + ""}>
                                            <CCImage id="StorageItemImg" backgroundImage={picurl} />
                                            {(num != undefined && Number(num) > 1) &&
                                                <Panel id="StorageItemNumBG" >
                                                    <Label id="StorageItemNum" text={`X${num}`} />
                                                </Panel>}
                                            <Label id="StorageItemName" text={itemname} />
                                            <Label id="StorageItemDes" text={itemdes} />
                                            <CCButton id="UseBtn" color="Gold" text={"use"} />
                                        </CCPanel>
                                    }
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