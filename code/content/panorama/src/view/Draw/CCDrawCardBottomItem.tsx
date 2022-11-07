import React from "react";
import { KVHelper } from "../../helper/KVHelper";
import { CCLabel } from "../allCustomUIElement/CCLabel/CCLabel";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";

import "./CCDrawCardBottomItem.less";

interface ICCDrawCardBottomItem {
    unitname: string;
}
export class CCDrawCardBottomItem extends CCPanel<ICCDrawCardBottomItem> {



    render() {
        const unitname = this.props.unitname;
        let KV_DATA = KVHelper.KVData();
        let cardinfo = KV_DATA.building_unit_tower[unitname];
        let iteminfo = KV_DATA.building_item_card[cardinfo!.CardName];
        const Rarity = cardinfo?.Rarity || "R";
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_DrawCardBottomItem" className={Rarity} hittest={false} {...this.initRootAttrs()}>
                <CCLabel type="UnitName" horizontalAlign="center" />
                <CCPanel horizontalAlign="center" flowChildren="right" >
                    {
                        [1, 2, 3, 4].map((a, i) => {
                            let abilityname = cardinfo["Ability" + i] as string;
                            if (abilityname != "ability_empty") {

                            }
                        })
                    }
                </CCPanel>
            </Panel>
        )
    }
}