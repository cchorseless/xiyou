import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCIcon_Star } from "../AllUIElement/CCIcons/CCIcon_Star";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCBuildingTopBarItem.less";
import { CCEntityHpBarItem } from "./CCEntityHpBarItem";
import { CCEntityHpMpBarItem } from "./CCEntityHpMpBarItem";
import { CCOverHeadBaseItem } from "./CCOverHeadBaseItem";

export class CCBuildingTopBarItem extends CCOverHeadBaseItem {

    HasOverhead(iEntIndex: EntityIndex): boolean {
        let entityroot = GBuildingEntityRoot.GetEntity(iEntIndex);
        if (entityroot && entityroot.BuildingComp!.IsShowOverhead) {
            return Entities.IsValidEntity(iEntIndex) && Entities.IsAlive(iEntIndex) && !Entities.IsInvisible(iEntIndex);
        }
        return false;
    }

    onInitUI() {
        const entityid = this.props.entityid as EntityIndex;
        let building = GBuildingEntityRoot.GetEntity(entityid);
        building?.BuildingComp?.RegRef(this);
    }

    render() {
        const entityid = this.props.entityid as EntityIndex;
        const building = GBuildingEntityRoot.GetEntity(entityid)!;
        const BuildingComp = this.GetStateEntity(building.BuildingComp!)!;
        let rare = building!.Config().Rarity.toUpperCase();

        let ismy = Entities.IsControllableByPlayer(entityid, Game.GetLocalPlayerInfo().player_id);
        return (<Panel ref={this.__root__}   {...this.initRootAttrs()}>
            <CCPanel id="stargroup" flowChildren="right" >
                {Array(5).map((element, index) => {
                    return <CCIcon_Star key={index + ""} type={BuildingComp.iStar > index ? "Filled" : "UnFilled"} />;
                })}
            </CCPanel>
            <CCPanel id="nameBg" flowChildren="right" backgroundImage={CSSHelper.getCustomImageUrl(`rarity/rare_${rare.toLowerCase()}.png`)}>
                <CCPanel id="unitprop" backgroundImage={CSSHelper.getCustomImageUrl(`common/icon_prop_${BuildingComp.PrimaryAttribute}.png`)} />;
                <Label id="unitname" localizedText={"#" + building!.ConfigID} />;
            </CCPanel>
            {
                ismy ? <CCEntityHpMpBarItem entityid={entityid} /> : <CCEntityHpBarItem entityid={entityid} />
            }
            {this.__root___childs}
            {this.props.children}
        </Panel>)
    }
}
