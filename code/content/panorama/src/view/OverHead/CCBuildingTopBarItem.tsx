import React from "react";
import { UnitHelper } from "../../helper/DotaEntityHelper";
import { PathHelper } from "../../helper/PathHelper";
import { CCIcon_Star } from "../AllUIElement/CCIcons/CCIcon_Star";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCBuildingTopBarItem.less";
import { CCOverHeadBaseItem } from "./CCOverHeadBaseItem";

export class CCBuildingTopBarItem extends CCOverHeadBaseItem {

    onInitUI() {
        const entityid = this.props.entityid as EntityIndex;
        let building = GBuildingEntityRoot.GetEntity(entityid);
        building?.RegRef(this);
    }


    render() {
        const entityid = this.props.entityid as EntityIndex;
        const BuildingComp = this.GetStateEntity(GBuildingEntityRoot.GetEntity(entityid)!);
        if (!BuildingComp) {
            return this.defaultRender("CC_BuildingTopBarItem");
        }
        let rare = UnitHelper.GetUnitRarety(Entities.GetUnitName(entityid))
        let ismy = Entities.IsControllableByPlayer(entityid, Game.GetLocalPlayerInfo().player_id);
        return (<Panel id="CC_BuildingTopBarItem" ref={this.__root__}   {...this.initRootAttrs()}>
            <CCPanel id="StarGroup" flowChildren="right" >
                {[...Array(5)].map((element, index) => {
                    return <CCIcon_Star width="25px" height="25px" key={index + ""} type={BuildingComp.iStar > index ? "Filled" : "UnFilled"} />
                })}
            </CCPanel>
            <CCPanel id="buildingnNameBg" backgroundImage={PathHelper.getCustomImageUrl(`rarity/titlebg_${rare.toLowerCase()}.png`)}>
                <CCPanel id="unitprop" backgroundImage={PathHelper.getCustomImageUrl(`eom_design/ccunitstats/icon_prop_${BuildingComp.PrimaryAttribute}.png`)} />
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
