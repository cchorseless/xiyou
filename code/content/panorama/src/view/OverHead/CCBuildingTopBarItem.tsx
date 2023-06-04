import React from "react";
import { PathHelper } from "../../helper/PathHelper";
import { CCIcon_Star } from "../AllUIElement/CCIcons/CCIcon_Star";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCBuildingTopBarItem.less";
import { CCOverHeadBaseItem } from "./CCOverHeadBaseItem";

export class CCBuildingTopBarItem extends CCOverHeadBaseItem {

    onInitUI() {
        const entityid = this.props.entityid as EntityIndex;
        let building = GBuildingEntityRoot.GetEntity(entityid)!;
        this.ListenUpdate(building);
    }


    render() {
        const entityid = this.props.entityid as EntityIndex;
        const BuildingComp = (GBuildingEntityRoot.GetEntity(entityid)!);
        if (!BuildingComp) {
            return this.defaultRender("CC_BuildingTopBarItem");
        }
        const iStar = Entities.GetStar(entityid)
        let rare = Entities.GetUnitRarity(Entities.GetUnitName(entityid))
        let ismy = Entities.IsControllableByPlayer(entityid, Game.GetLocalPlayerInfo().player_id);
        return (<Panel id="CC_BuildingTopBarItem" ref={this.__root__}   {...this.initRootAttrs()}>
            <CCPanel id="StarGroup" flowChildren="right" >
                {[...Array(5)].map((element, index) => {
                    return <CCIcon_Star width="25px" height="25px" key={index + ""} type={iStar > index ? (index == 0 ? "Filled" : "Spe") : "UnFilled"} />
                })}
            </CCPanel>
            <CCPanel id="UnitNameBg" backgroundImage={PathHelper.getCustomImageUrl(`rarity/titlebg_${rare.toLowerCase()}.png`)}>
                <CCPanel id="unitprop" backgroundImage={PathHelper.getCustomImageUrl(`eom_design/ccunitstats/icon_prop_${Entities.GetPrimaryAttribute(entityid)}.png`)} />
                <CCLabel align="center center" text={$.Localize("#" + BuildingComp!.ConfigID)} type="UnitName" />
            </CCPanel>
            {
                // ismy ? <CCEntityHpMpBarItem entityid={entityid} /> : <CCEntityHpBarItem entityid={entityid} />
            }
            {this.__root___childs}
            {this.props.children}
        </Panel>)
    }
}
