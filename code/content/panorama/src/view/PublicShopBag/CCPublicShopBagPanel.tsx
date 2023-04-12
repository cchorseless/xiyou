
import React, { createRef } from "react";
import { PublicBagConfig } from "../../../../scripts/tscripts/shared/PublicBagConfig";
import { ERoundBoard } from "../../game/components/Round/ERoundBoard";

import { CSSHelper } from "../../helper/CSSHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCIcon_Lock } from "../AllUIElement/CCIcons/CCIcon_Lock";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelBG } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCToggleButton } from "../AllUIElement/CCToggleButton/CCToggleButton";
import { CCPublicBagSlotItem } from "./CCPublicBagSlotItem";
import "./CCPublicShopBagPanel.less";
import { CCPublicShopBagTitle } from "./CCPublicShopBagTitle";
import { CCPublicShopItem } from "./CCPublicShopItem";


export class CCPublicBag extends CCPanel<{}> {

    onReady() {
        return Boolean(GGameScene.PublicBagSystemComp)
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.PublicBagSystemComp)
    }


    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_PublicBag") }
        const publicBag = GGameScene.PublicBagSystemComp;
        return (
            <Panel id="CC_PublicBag" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPublicShopBagTitle title={$.Localize("#lang_PublicBag")} />
                <Panel id="CustomPublicBag" hittest={false}>
                    {
                        [...Array(PublicBagConfig.PUBLIC_ITEM_SLOT_MAX - PublicBagConfig.PUBLIC_ITEM_SLOT_MIN + 1)].map((_, index) => {
                            let itemindex = -1 as any;
                            let slot = index + PublicBagConfig.PUBLIC_ITEM_SLOT_MIN;
                            let entity = publicBag.getItemByIndex(slot + "");
                            if (entity) {
                                itemindex = entity.EntityId;
                            }
                            return <CCPublicBagSlotItem key={index + ""} iType={PublicBagConfig.EBagSlotType.PublicBagSlot} slot={slot} itemIndex={itemindex} />
                        })
                    }
                </Panel>
            </Panel>
        );
    }
}

export class CCPersonBag extends CCPanel<{}> {
    onReady() {
        return Boolean(GGameScene.Local.CourierBagComp)
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.CourierBagComp)
    }

    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_PersonBag") }
        const courierBag = GGameScene.Local.CourierBagComp;
        GLogHelper.print("CCPersonBag", courierBag.AllItem);
        return (
            <Panel id="CC_PersonBag" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPublicShopBagTitle title={$.Localize("#lang_PersonBag")} />
                <Panel id="CustomPersonBag" hittest={false}>
                    {
                        [...Array(PublicBagConfig.DOTA_ITEM_BAG_MAX - PublicBagConfig.DOTA_ITEM_BAG_MIN + 1)].map((_, index) => {
                            let itemindex = -1 as any;
                            let slot = index + PublicBagConfig.DOTA_ITEM_BAG_MIN;
                            let entity = courierBag.getItemByIndex(slot + "");
                            if (entity) {
                                itemindex = entity.EntityId;
                            }
                            return <CCPublicBagSlotItem key={index + ""} iType={PublicBagConfig.EBagSlotType.BackPackSlot} slot={slot} itemIndex={itemindex} />
                        })
                    }
                </Panel>
                <CCPanel flowChildren="right">
                    <CCToggleButton id="ToggleBuy2Bag" verticalAlign="center" localtext="#lang_Buy2Bag" selected={Boolean(courierBag.bBuyItem2Bag)} onactivate={p => courierBag.setBuyItem2Bag(p.IsSelected())} />
                    <CCButton type="Tui3" color="Blue" width="100px"
                        onactivate={() => {
                            courierBag.sellAllItem();
                        }}  >
                        <CCLabel localizedText="#lang_sellallitem" align="center center" />
                    </CCButton>
                </CCPanel>
            </Panel >
        );
    }
}


export class CCEquipCombine extends CCPanel<{}> {
    onReady() {
        return Boolean(GGameScene.Local.CourierBagComp)
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.CourierBagComp)
    }

    checkCanCombine() {
        const courierBag = GGameScene.Local.CourierBagComp!;
        let iItemSameLevel = -1;
        for (let i = PublicBagConfig.CUSTOM_COMBINE_SLOT_MIN; i <= PublicBagConfig.PUBLIC_ITEM_SLOT_MAX; i++) {
            let entity = courierBag.getItemByIndex(i + "");
            if (entity == null) {
                return false;
            }
            let iItemIndex = entity.EntityId as ItemEntityIndex;
            if (iItemSameLevel == -1) {
                iItemSameLevel = Abilities.GetLevel(iItemIndex);
            } else if (iItemSameLevel != Abilities.GetLevel(iItemIndex)) {
                return false;
            }
        }
        return true;
    }

    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_EquipCombine") }
        const courierBag = (GGameScene.Local.CourierBagComp)!;
        const bCanCombine = this.checkCanCombine()
        return (
            <Panel id="CC_EquipCombine" ref={this.__root__} hittest={false}>
                <CCPublicShopBagTitle title={$.Localize("#lang_EquipCombine")} />
                <Panel id="EquipCombineFrom" hittest={false}>
                    {
                        [...Array(PublicBagConfig.CUSTOM_COMBINE_SLOT_MAX - PublicBagConfig.CUSTOM_COMBINE_SLOT_MIN + 1)].map((_, index) => {
                            let itemindex = -1 as any;
                            let slot = index + PublicBagConfig.CUSTOM_COMBINE_SLOT_MIN;
                            let entity = courierBag.getItemByIndex(slot + "", PublicBagConfig.EBagSlotType.EquipCombineSlot);
                            if (entity) {
                                itemindex = entity.EntityId;
                            }
                            return <CCPublicBagSlotItem key={index + ""} iType={PublicBagConfig.EBagSlotType.EquipCombineSlot} slot={slot} itemIndex={itemindex} />
                        })
                    }
                </Panel>
                <Panel id="EquipCombineLines" hittest={false} />
                <CCButton type="Tui3" enabled={bCanCombine} horizontalAlign="center" onactivate={() => courierBag.onEquipCombine()} >
                    <CCLabel localizedText="#lang_CombineEquipConfrim" align="center center" color="white" />
                </CCButton>
                <Panel id="ToggleBtns" hittest={false}>
                    <CCToggleButton id="ToggleRandomCombine" localtext="#lang_CombineEquipRandom" selected={false} tooltip={$.Localize("#lang_CombineEquipConfrimDesc")} />
                    {/* <CCToggleButton id="ToggleCombineAnimation" selected={false}  {...Tooltips.SimpleTextEvents("CombineEquipNoAnimationDesc")}>
                        <Label localizedText="#CombineEquipNoAnimation" />
                    </CCToggleButton> */}
                </Panel>
            </Panel>
        );
    }
}


export class CCGoldShop extends CCPanel<{}> {
    onReady() {
        return Boolean(GGameScene.Local.CourierShopComp)
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.CourierShopComp)
    }

    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_GoldShop") }
        const courierShop = (GGameScene.Local.CourierShopComp)!;
        const GoldItems = courierShop.getSellItem(PublicBagConfig.EPublicShopType.GoldShop)
        return (
            <Panel id="CC_GoldShop" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPublicShopBagTitle title={$.Localize("#lang_GoldShop")} />
                <Panel id="GoldShopContainer">
                    {GoldItems.map((iteminfo, index) => {
                        return (<CCPublicShopItem key={index + ""}
                            iSlot={iteminfo.iSlot}
                            sItemName={iteminfo.sItemName}
                            iLeftCount={iteminfo.iLeftCount}
                            iLimit={iteminfo.iLimit}
                            iRoundLock={iteminfo.iRoundLock}
                            iCoinType={iteminfo.iCoinType}
                            iType={PublicBagConfig.EPublicShopType.GoldShop}
                            iLevel={1} />)
                    })}
                </Panel>
            </Panel>
        )
    }
}

export class CCWoodShop extends CCPanel<{}> {
    onReady() {
        return Boolean(GGameScene.Local.CourierShopComp)
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.CourierShopComp)
    }


    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_WoodShop") }
        const courierShop = (GGameScene.Local.CourierShopComp)!;
        const WoodItems = courierShop.getSellItem(PublicBagConfig.EPublicShopType.WoodShop)
        return (
            <Panel id="CC_WoodShop" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPublicShopBagTitle title={$.Localize("#lang_WoodShop")} />
                <Panel id="WoodShopContainer">
                    {WoodItems.map((iteminfo, index) => {
                        return (<CCPublicShopItem key={index + ""}
                            iSlot={iteminfo.iSlot}
                            sItemName={iteminfo.sItemName}
                            iLeftCount={iteminfo.iLeftCount}
                            iLimit={iteminfo.iLimit}
                            iRoundLock={iteminfo.iRoundLock}
                            iCoinType={iteminfo.iCoinType}
                            iType={PublicBagConfig.EPublicShopType.WoodShop}
                            iLevel={1} />)
                    })}
                </Panel>
            </Panel>
        )
    }
}

export class CCRoundShop extends CCPanel<{}> {
    onReady() {
        return Boolean(GGameScene.Local.CourierShopComp)
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.CourierShopComp)
        this.ListenUpdate(GGameScene.Local.RoundManagerComp);
    }


    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_RoundShop") }
        const courierShop = (GGameScene.Local.CourierShopComp)!;
        const WoodItems = courierShop.getSellItem(PublicBagConfig.EPublicShopType.RoundShop)
        return (
            <Panel id="CC_RoundShop" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPublicShopBagTitle title={$.Localize("#lang_RoundShop")} />
                <Panel id="RoundShopContainer">
                    {WoodItems.map((iteminfo, index) => {
                        return (<CCPublicShopItem key={index + ""}
                            iSlot={iteminfo.iSlot}
                            sItemName={iteminfo.sItemName}
                            iLeftCount={iteminfo.iLeftCount}
                            iLimit={iteminfo.iLimit}
                            iRoundLock={iteminfo.iRoundLock}
                            iType={PublicBagConfig.EPublicShopType.RoundShop}
                            iCoinType={iteminfo.iCoinType}
                            iLevel={1} />)
                    })}
                </Panel>
            </Panel>
        )
    }
}

export class CCRandomShop extends CCPanel<{}> {
    onReady() {
        return Boolean(GGameScene.Local.CourierShopComp)
    }

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.CourierShopComp);
        this.ListenUpdate(GGameScene.Local.PlayerDataComp);
        this.ListenUpdate(GGameScene.Local.RoundManagerComp);
    }


    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_RandomShop") }
        const courierShop = (GGameScene.Local.CourierShopComp)!;
        const PlayerDataComp = (GGameScene.Local.PlayerDataComp)!;
        const RandomItems = courierShop.getSellItem(PublicBagConfig.EPublicShopType.RandomShop);
        const currentround = ERoundBoard.CurRoundBoard.config.roundIndex
        const Unlock = courierShop.randomLockRound <= currentround;

        return (
            <Panel id="CC_RandomShop" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPublicShopBagTitle title={$.Localize("#lang_RandomShop")} />
                <CCPanel id="RandomShopContainer" className={CSSHelper.ClassMaker({ Unlock: Unlock })} >
                    <Panel id="RandomShopList" hittest={false}>
                        {RandomItems.map((iteminfo, index) => {
                            return (<CCPublicShopItem key={index + ""}
                                iSlot={iteminfo.iSlot}
                                sItemName={iteminfo.sItemName}
                                iLeftCount={iteminfo.iLeftCount}
                                iLimit={iteminfo.iLimit}
                                iRoundLock={iteminfo.iRoundLock}
                                iType={PublicBagConfig.EPublicShopType.RandomShop}
                                iCoinType={iteminfo.iCoinType}
                                iLevel={1} />)
                        })}
                    </Panel>
                    <Panel id="RandomShopLock" >
                        <CCIcon_Lock horizontalAlign="center" />
                        <Label localizedText={"#lang_RandomShopUnlock"} dialogVariables={{ unlock_round: courierShop.randomLockRound }} />
                    </Panel>
                </CCPanel>
                {
                    Unlock &&
                    <>
                        <Label key="RandomShopTime" id="RandomShopTime" localizedText="#lang_RandomShopTime" html={true} />
                        <CCButton id="RandomShopRefresh" horizontalAlign="center" type="Tui3" enabled={PlayerDataComp.wood >= courierShop.refreshPrice} onactivate={() => courierShop.refreshRandomShop()} >
                            <Label localizedText="#lang_RandomShopRefresh" />
                        </CCButton>
                    </>
                }
            </Panel >
        )
    }
}


interface ICCPublicBagPanel extends NodePropsData {

}

export class CCPublicShopBagPanel extends CCPanel<ICCPublicBagPanel> {
    onReady() {
        return Boolean(GGameScene.Local.CourierShopComp && GGameScene.Local.PlayerDataComp && GGameScene.Local.RoundManagerComp && GGameScene.Local.CourierShopComp)
    }

    isShowSelf() {
        return this.__root__.current!.BHasClass("ShowPublicShopBag")
    }
    showSelf(isshow: boolean) {
        this.__root__.current!.SetHasClass("ShowPublicShopBag", isshow)
    }

    SellDragArea = createRef<Panel>();
    render() {
        return (
            <Panel id="CC_PublicShopBagPanel" ref={this.__root__} hittest={false} >
                {/* <CCIcon_XClose type="Tui7" align="right top" onactivate={() => this.showSelf(false)} /> */}
                <CCPanelBG id="ShopLeft" scroll="y">
                    <Panel id="SellDragArea" ref={this.SellDragArea}>
                        <CCGoldShop />
                        <CCWoodShop />
                        <CCRoundShop />
                        <CCRandomShop />
                    </Panel>
                </CCPanelBG>
                <CCPanelBG id="ShopRight"  >
                    <CCPublicBag />
                    <CCPersonBag />
                    <CCEquipCombine />
                </CCPanelBG>
            </Panel >
        )
    }


}