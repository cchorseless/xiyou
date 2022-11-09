import React from "react";
import { KVHelper } from "../../helper/KVHelper";
import { CCAbilityIcon } from "../allCustomUIElement/CCAbility/CCAbilityIcon";
import { CCIconButton } from "../allCustomUIElement/CCButton/CCIconButton";
import { CCIcon_CoinType } from "../allCustomUIElement/CCIcons/CCIcon_CoinType";
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
                <CCPanel horizontalAlign="center" flowChildren="right">
                    <CCLabel textAlign={"center"} type="UnitName" localizedText={"#" + unitname} verticalAlign="center" height="20px" />
                    <CCIconButton marginLeft={"10px"} icon={<CCIcon_Share />} onactivate={() => { this.props.onShare() }} tooltip={"#todo"} />
                    <CCIconButton icon={<CCIcon_Wanted />} onactivate={() => { this.props.onWanted() }} tooltip={"#todo"} />
                </CCPanel>

                <CCPanel horizontalAlign="center" flowChildren="right" marginTop={"10px"}>
                    {
                        [1, 2, 3, 6].map((a, i) => {
                            let abilityname = cardinfo["Ability" + a] as string;
                            if (abilityname && abilityname != "ability_empty") {
                                return <CCAbilityIcon key={"" + i} abilityname={abilityname} />
                            }
                        })
                    }
                </CCPanel>
                <CCPanel horizontalAlign="center" flowChildren="right">
                    <CCPanel flowChildren="right">
                        <CCIcon_CoinType cointype="Gold" />
                        <CCLabel type="Gold" text={"x" + iteminfo?.ItemCost} />
                    </CCPanel>
                    <CCPanel flowChildren="right" marginLeft={"10px"}>
                        <CCIcon_CoinType cointype="Population" />
                        <CCLabel type="Gold" text={"x" + cardinfo?.Population} />
                    </CCPanel>
                </CCPanel>
            </Panel>
        )
    }
}