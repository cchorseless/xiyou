
import React, { createRef, PureComponent } from "react";
import { PublicBagConfig } from "../../../../../game/scripts/tscripts/shared/PublicBagConfig";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { LogHelper } from "../../helper/LogHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPublicBagSlotItem } from "./CCPublicBagSlotItem";
import "./CCPublicShopBagPanel.less";
interface ICCPublicShopBagPanel extends NodePropsData {

}

export class CCPublicShopBagPanel extends CCPanel<ICCPublicShopBagPanel> {

}



export class CCPublicBag extends CCPanel<ICCPublicShopBagPanel> {

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
                <Panel id="PublicBackPackTitle" className="CustomShopTitle" hittest={false}>
                    <Label localizedText="#CustomPublicBackPack" />
                </Panel>
                <Panel id="CustomPublicBackPack" hittest={false}>
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