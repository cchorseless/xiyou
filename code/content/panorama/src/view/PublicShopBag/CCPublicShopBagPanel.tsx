
import React, { createRef, PureComponent } from "react";
import { PublicBagConfig } from "../../../../../game/scripts/tscripts/shared/PublicBagConfig";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { LogHelper } from "../../helper/LogHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCPublicBagSlotItem } from "./CCPublicBagSlotItem";
import "./CCPublicShopBagPanel.less";
interface ICCPublicShopBagPanel extends NodePropsData {

}

export class CCPublicShopBagPanel extends CCPanel<ICCPublicShopBagPanel> {

}



export class CCPublicBag extends CCPanel<ICCPublicShopBagPanel> {


    onInit() {
        PlayerScene.PublicBagSystemComp.RegRef(this)
    }



    render() {
        const publicBag = this.GetStateEntity(PlayerScene.PublicBagSystemComp!)
        const publicBag
        return (
            this.__root___isValid &&
            <Panel className="CC_PublicBag" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <Panel id="PublicBackPackTitle" className="CustomShopTitle" hittest={false}>
                    <Label localizedText="#CustomPublicBackPack" />
                </Panel>
                <Panel id="CustomPublicBackPack" hittest={false}>
                    {(() => {
                        let empty_index = 0;
                        let res: JSX.Element[] = [];
                        for (let i = PublicBagConfig.PUBLIC_ITEM_SLOT_MIN; i <= PublicBagConfig.PUBLIC_ITEM_SLOT_MAX; i++) {
                            let itemindex = publicBackPackItems[i] ?? -1;
                            if (itemindex != -1) {
                                res.push(<CCPublicBagSlotItem key={itemindex} slot={i} itemIndex={itemindex} />);
                            } else {
                                // 这样写可以让空白的格子被复用
                                res.push(<CCPublicBagSlotItem key={"empty_" + (empty_index++)} slot={i} itemIndex={itemindex} />);
                            }
                        }
                        return res;
                    })()}
                </Panel>
            </Panel>
        );
    }
}