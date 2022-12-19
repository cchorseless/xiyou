
import React, { createRef, PureComponent } from "react";
import { PublicBagConfig } from "../../../../../game/scripts/tscripts/shared/PublicBagConfig";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { KVHelper } from "../../helper/KVHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCToggleButton } from "../AllUIElement/CCToggleButton/CCToggleButton";
import { CCPublicBagSlotItem } from "./CCPublicBagSlotItem";
import { CCPublicShopBagTitle } from "./CCPublicShopBagTitle";
import { CCPublicShopItem } from "./CCPublicShopItem";
import "./CCPublicShopPanel.less";

interface ICCPublicShopPanel extends NodePropsData {

}

export class CCPublicShopPanel extends CCPanel<ICCPublicShopPanel> {

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
                <Panel id="CommonShopContainer">
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



export class CCRandomShop extends CCPanel<{}> {



}