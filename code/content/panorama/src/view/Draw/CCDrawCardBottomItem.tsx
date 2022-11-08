import React from "react";
import { KVHelper } from "../../helper/KVHelper";
import { CCAbilityIcon } from "../allCustomUIElement/CCAbility/CCAbilityIcon";
import { CCIconButton } from "../allCustomUIElement/CCButton/CCIconButton";
import { CCIcon_Gold } from "../allCustomUIElement/CCIcons/CCIcon_Gold";
import { CCIcon_Population } from "../allCustomUIElement/CCIcons/CCIcon_Population";
import { CCIcon_Share } from "../allCustomUIElement/CCIcons/CCIcon_Share";
import { CCIcon_Wanted } from "../allCustomUIElement/CCIcons/CCIcon_Wanted";
import { CCLabel } from "../allCustomUIElement/CCLabel/CCLabel";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";

import "./CCDrawCardBottomItem.less";

interface ICCDrawCardBottomItem {
    unitname: string;
    onShare: () => void;
    onWanted: () => void;
}
export class CCDrawCardBottomItem extends CCPanel<ICCDrawCardBottomItem> {


    render() {
        const unitname = this.props.unitname;
        let KV_DATA = KVHelper.KVData();
        let cardinfo = KV_DATA.building_unit_tower[unitname];
        let iteminfo = KV_DATA.building_item_card[cardinfo!.CardName];
        const Rarity = cardinfo?.Rarity || "A";
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_DrawCardBottomItem" className={Rarity} hittest={false} {...this.initRootAttrs()}>
                <CCLabel type="UnitName" horizontalAlign="center" />
                <CCPanel horizontalAlign="center" flowChildren="right" >
                    {
                        [1, 2, 3, 4].map((a, i) => {
                            let abilityname = cardinfo["Ability" + i] as string;
                            if (abilityname != "ability_empty") {
                                return <CCAbilityIcon abilityname={abilityname} />
                            }
                        })
                    }
                </CCPanel>
                <CCPanel horizontalAlign="center" flowChildren="right">
                    <CCIconButton icon={<CCIcon_Share />} onactivate={() => { this.props.onShare() }} tooltip={"#todo"} />
                    <CCPanel flowChildren="right">
                        <CCIcon_Gold />
                        <CCLabel type="Gold" text={"x" + iteminfo?.ItemCost} />
                    </CCPanel>
                    <CCPanel flowChildren="right">
                        <CCIcon_Population />
                        <CCLabel type="Gold" text={"x" + cardinfo?.Population} />
                    </CCPanel>
                    <CCIconButton icon={<CCIcon_Wanted />} onactivate={() => { this.props.onWanted() }} tooltip={"#todo"} />
                </CCPanel>
            </Panel>
        )
    }
}