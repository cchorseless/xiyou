
import React, { createRef, PureComponent } from "react";
import { PublicBagConfig } from "../../../../../game/scripts/tscripts/shared/PublicBagConfig";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCToggleButton } from "../AllUIElement/CCToggleButton/CCToggleButton";
import { CCPublicBagSlotItem } from "./CCPublicBagSlotItem";
import { CCPublicShopBagTitle } from "./CCPublicShopBagTitle";
import { CCPublicShopItem } from "./CCPublicShopItem";
import { CCIcon_XClose } from "../AllUIElement/CCIcons/CCIcon_XClose";
import { CCPanelBG } from "../AllUIElement/CCPanel/CCPanelPart";
import "./CCPublicShopBagPanel.less";
import { CCIcon_Lock } from "../AllUIElement/CCIcons/CCIcon_Lock";
import { CSSHelper } from "../../helper/CSSHelper";


export class CCPublicBag extends CCPanel<{}> {

    onReady() {
        return Boolean(PlayerScene.PublicBagSystemComp)
    }

    onInit() {
        PlayerScene.PublicBagSystemComp.RegRef(this)
    }


    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_PublicBag") }
        const publicBag = this.GetStateEntity(PlayerScene.PublicBagSystemComp)!;
        return (
            <Panel id="CC_PublicBag" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPublicShopBagTitle title={$.Localize("#PublicBag")} />
                <Panel id="CustomPublicBag" hittest={false}>
                    {
                        [...Array(PublicBagConfig.PUBLIC_ITEM_SLOT_MAX - PublicBagConfig.PUBLIC_ITEM_SLOT_MIN + 1)].map((_, index) => {
                            let itemindex = -1 as any;
                            let slot = index + PublicBagConfig.PUBLIC_ITEM_SLOT_MIN;
                            let entity = publicBag.getItemByIndex(slot + "");
                            if (entity) {
                                itemindex = entity.EntityId;
                            }
                            return <CCPublicBagSlotItem key={index + ""} slot={slot} itemIndex={itemindex} />
                        })
                    }
                </Panel>
            </Panel>
        );
    }
}

export class CCPersonBag extends CCPanel<{}> {
    onReady() {
        return Boolean(PlayerScene.Local.CourierBagComp)
    }

    onInit() {
        PlayerScene.Local.CourierBagComp.RegRef(this)
    }


    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_PersonBag") }
        const courierBag = this.GetStateEntity(PlayerScene.Local.CourierBagComp)!;
        return (
            <Panel id="CC_PersonBag" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPublicShopBagTitle title={$.Localize("#PublicBag")} />
                <Panel id="CustomPersonBag" hittest={false}>
                    {
                        [...Array(PublicBagConfig.DOTA_ITEM_BAG_MAX - PublicBagConfig.DOTA_ITEM_BAG_MIN + 1)].map((_, index) => {
                            let itemindex = -1 as any;
                            let slot = index + PublicBagConfig.DOTA_ITEM_BAG_MIN;
                            let entity = courierBag.getItemByIndex(slot + "");
                            if (entity) {
                                itemindex = entity.EntityId;
                            }
                            return <CCPublicBagSlotItem key={index + ""} slot={slot} itemIndex={itemindex} />
                        })
                    }
                </Panel>
                <CCToggleButton id="ToggleBuy2Bag" selected={Boolean(courierBag.bBuyItem2Bag)} onactivate={p => courierBag.setBuyItem2Bag(!p.IsSelected())}>
                    <Label localizedText="#Buy2Bag" />
                </CCToggleButton>
                <CCButton type="Style1" color="Blue" width="200px" height="60px" horizontalAlign="center"
                    onactivate={() => {
                        courierBag.sellAllItem();
                        // Game.PrepareUnitOrders({
                        //     OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_SELL_ITEM,
                        //     UnitIndex: Players.GetLocalPlayerPortraitUnit(),
                        //     // AbilityIndex: m_iItemIndex,
                        //     Position: [1, 0, 0],// Position.x=1 代表是出售所有背包物品
                        //     ShowEffects: false,
                        // });
                    }}  >
                    <Label className="btn_lbl" localizedText="#lang_sellallitem" />
                </CCButton>
            </Panel >
        );
    }
}


export class CCEquipCombine extends CCPanel<{}> {
    onReady() {
        return Boolean(PlayerScene.Local.CourierBagComp)
    }

    onInit() {
        PlayerScene.Local.CourierBagComp.RegRef(this)
    }

    checkCanCombine() {
        const courierBag = PlayerScene.Local.CourierBagComp!;
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
        if (!this.__root___isValid) { return this.defaultRender("CC_PersonBag") }
        const courierBag = this.GetStateEntity(PlayerScene.Local.CourierBagComp)!;
        const bCanCombine = this.checkCanCombine()
        return (
            <Panel id="CC_EquipCombine" ref={this.__root__} hittest={false}>
                <CCPublicShopBagTitle title={$.Localize("#lang_EquipCombine")} />
                <Panel id="EquipCombineFrom" hittest={false}>
                    {
                        [...Array(PublicBagConfig.CUSTOM_COMBINE_SLOT_MAX - PublicBagConfig.CUSTOM_COMBINE_SLOT_MIN + 1)].map((_, index) => {
                            let itemindex = -1 as any;
                            let slot = index + PublicBagConfig.CUSTOM_COMBINE_SLOT_MIN;
                            let entity = courierBag.getItemByIndex(slot + "");
                            if (entity) {
                                itemindex = entity.EntityId;
                            }
                            return <CCPublicBagSlotItem key={index + ""} slot={slot} itemIndex={itemindex} />
                        })
                    }
                </Panel>
                <Panel id="EquipCombineLines" hittest={false} />
                <CCButton type="Style1" enabled={bCanCombine} horizontalAlign="center" onactivate={() => courierBag.onEquipCombine()} >
                    <Label localizedText="#CombineEquipConfrim" />
                </CCButton>
                <Panel id="ToggleBtns" hittest={false}>
                    <CCToggleButton id="ToggleRandomCombine" selected={false} tooltip={$.Localize("#CombineEquipConfrimDesc")}>
                        <Label localizedText="#CombineEquipRandom" />
                    </CCToggleButton>
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
        return Boolean(PlayerScene.Local.CourierShopComp)
    }

    onInit() {
        PlayerScene.Local.CourierShopComp.RegRef(this)
    }


    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_GoldShop") }
        const courierShop = this.GetStateEntity(PlayerScene.Local.CourierShopComp)!;
        const GoldItems = courierShop.getSellItem(PublicBagConfig.EPublicShopType.GoldShop)
        return (
            <Panel id="CC_GoldShop" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPublicShopBagTitle title={$.Localize("#GoldShop")} />
                <Panel id="GoldShopContainer">
                    {GoldItems.map((iteminfo, index) => {
                        let iSlot = iteminfo.iSlot;
                        let iLeft: number | undefined;
                        return (<CCPublicShopItem key={index + ""}
                            iSlot={iSlot} sItemName={iteminfo.sItemName}
                            iLeftCount={iLeft} iLimit={iteminfo.iLimit}
                            iType={PublicBagConfig.EPublicShopType.GoldShop}
                            iLevel={1} />);
                    })}
                </Panel>
            </Panel>
        )
    }
}

export class CCWoodShop extends CCPanel<{}> {
    onReady() {
        return Boolean(PlayerScene.Local.CourierShopComp)
    }

    onInit() {
        PlayerScene.Local.CourierShopComp.RegRef(this)
    }


    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_WoodShop") }
        const courierShop = this.GetStateEntity(PlayerScene.Local.CourierShopComp)!;
        const WoodItems = courierShop.getSellItem(PublicBagConfig.EPublicShopType.WoodShop)
        return (
            <Panel id="CC_WoodShop" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPublicShopBagTitle title={$.Localize("#WoodShop")} />
                <Panel id="WoodShopContainer">
                    {WoodItems.map((iteminfo, index) => {
                        let iSlot = iteminfo.iSlot;
                        let iLeft: number | undefined;
                        return (<CCPublicShopItem key={index + ""}
                            iSlot={iSlot} sItemName={iteminfo.sItemName}
                            iLeftCount={iLeft} iLimit={iteminfo.iLimit}
                            iType={PublicBagConfig.EPublicShopType.WoodShop}
                            iLevel={1} />);
                    })}
                </Panel>
            </Panel>
        )
    }
}


export class CCRandomShop extends CCPanel<{}> {
    onReady() {
        return Boolean(PlayerScene.Local.CourierShopComp)
    }

    onInit() {
        PlayerScene.Local.CourierShopComp.RegRef(this);
        PlayerScene.Local.PlayerDataComp.RegRef(this);
        PlayerScene.Local.RoundManagerComp.RegRef(this);
    }


    render() {
        if (!this.__root___isValid) { return this.defaultRender("CC_RandomShop") }
        const courierShop = this.GetStateEntity(PlayerScene.Local.CourierShopComp)!;
        const PlayerDataComp = this.GetStateEntity(PlayerScene.Local.PlayerDataComp)!;
        const RoundManagerComp = this.GetStateEntity(PlayerScene.Local.RoundManagerComp)!;
        const RandomItems = courierShop.getSellItem(PublicBagConfig.EPublicShopType.RandomShop);
        const currentround = Number(RoundManagerComp.getCurrentBoardRound()!.config.round_show)
        const Unlock = courierShop.randomLockRound >= currentround;

        return (
            <Panel id="CC_RandomShop" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPublicShopBagTitle title={$.Localize("#WoodShop")} />
                <CCPanel id="RandomShopContainer" className={CSSHelper.ClassMaker({ Unlock: Unlock })} >
                    <Panel id="RandomShopLock" >
                        <CCIcon_Lock type="Tui7" horizontalAlign="center" />
                        <Label localizedText={"#RandomShopUnlock"} dialogVariables={{ unlock_round: currentround }} />
                    </Panel>
                    <Panel id="RandomShopList" hittest={false}>
                        {RandomItems.map((iteminfo, index) => {
                            let iSlot = iteminfo.iSlot;
                            let iLeft: number | undefined;
                            return (<CCPublicShopItem key={index + ""}
                                iSlot={iSlot} sItemName={iteminfo.sItemName}
                                iLeftCount={iLeft} iLimit={iteminfo.iLimit}
                                iType={PublicBagConfig.EPublicShopType.RandomShop} />);
                        })}
                    </Panel>
                </CCPanel>
                {
                    Unlock &&
                    <>
                        <Label key="RandomShopTime" id="RandomShopTime" localizedText="#RandomShopTime" html={true} />
                        <CCButton id="RandomShopRefresh" type="Style1" enabled={PlayerDataComp.wood >= courierShop.refreshPrice} onactivate={() => courierShop.refreshRandomShop()} >
                            <Label localizedText="#RandomShopRefresh" />
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


    isShowSelf() {
        return this.__root__.current!.BHasClass("ShowPublicShopBag")
    }
    showSelf(isshow: boolean) {
        this.__root__.current!.SetHasClass("ShowPublicShopBag", isshow)
    }

    render() {
        return (
            <Panel id="CC_PublicShopBagPanel" ref={this.__root__} hittest={false} >
                <CCIcon_XClose type="Tui7" align="right top" onactivate={() => this.showSelf(false)} />
                <CCPanelBG id="ShopLeft" scroll="y">
                    <CCGoldShop />
                    <CCWoodShop />
                    <CCRandomShop />
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