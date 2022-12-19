
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
import "./CCPublicShopPanel.less";

interface ICCPublicShopPanel extends NodePropsData {

}

export class CCPublicShopPanel extends CCPanel<ICCPublicShopPanel> {

}


export class CCGoldShop extends CCPanel<{}> {

    render() {
        return (
            <Panel id="CC_GoldShop" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <CCPublicShopBagTitle title={$.Localize("#GoldShop")} />
                <Panel id="CommonShopContainer">
                    {Object.entries(CustomUIConfig.ShopKv.common).map(([index, { sItem, difficulty, limit }]) => {
                        if (iDifficulty >= difficulty) {
                            let iSlot = parseInt(index);
                            let iLeft: number | undefined;
                            if (limit != undefined) {
                                let iBoughtCount = safeNumber(shop_buy_count.common?.[iSlot], 0);
                                if (iBoughtCount) {
                                    iLeft = limit - iBoughtCount;
                                }
                            }
                            return (<CCPublicShopItem key={sItem} iSlot={iSlot} sItemName={sItem} iLeftCount={iLeft} iLimit={limit} iType={PublicBagConfig.EPublicShopType.COMMON} iLevel={1} />);
                        }
                    })}
                </Panel>
            </Panel>
        )
    }
}



export class CCRandomShop extends CCPanel<{}> {



}