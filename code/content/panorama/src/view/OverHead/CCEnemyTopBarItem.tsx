import React from "react";
import { PathHelper } from "../../helper/PathHelper";
import { CCIcon_Star } from "../AllUIElement/CCIcons/CCIcon_Star";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCEnemyTopBarItem.less";
import { CCOverHeadBaseItem } from "./CCOverHeadBaseItem";

export class CCEnemyTopBarItem extends CCOverHeadBaseItem {

    render() {
        const entityid = this.props.entityid as EntityIndex;
        const iStar = Entities.GetStar(entityid)
        const unitname = Entities.GetUnitName(entityid)
        const rare = Entities.GetUnitRarity(unitname)
        // let ismy = Entities.IsControllableByPlayer(entityid, Game.GetLocalPlayerInfo().player_id);
        return (<Panel className="CCEnemyTopBarItem" ref={this.__root__}   {...this.initRootAttrs()}>
            <CCPanel id="StarGroup" flowChildren="right" >
                {[...Array(5)].map((element, index) => {
                    return <CCIcon_Star width="25px" height="25px" key={index + ""} type={iStar > index ? (index == 0 ? "Filled" : "Spe") : "UnFilled"} />
                })}
            </CCPanel>
            {/* <CCPanel id="UnitNameBg" backgroundImage={PathHelper.getCustomImageUrl(`rarity/titlebg_${rare.toLowerCase()}.png`)}> */}
            <CCPanel id="UnitNameBg" >
                <CCPanel id="unitprop" backgroundImage={PathHelper.getCustomImageUrl(`eom_design/ccunitstats/icon_prop_${Entities.GetPrimaryAttribute(entityid)}.png`)} />
                <CCLabel align="center center" text={$.Localize("#" + unitname)} type="UnitName" color="Red" />
            </CCPanel>
            {
                // ismy ? <CCEntityHpMpBarItem entityid={entityid} /> : <CCEntityHpBarItem entityid={entityid} />
            }
            {this.__root___childs}
            {this.props.children}
        </Panel>)
    }
}
