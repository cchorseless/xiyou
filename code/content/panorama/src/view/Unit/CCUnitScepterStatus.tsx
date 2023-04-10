import React from "react";
import { CCIcon_Scepter } from "../AllUIElement/CCIcons/CCIcon_Scepter";

import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCUnitScepterStatus.less";
interface ICCUnitScepterStatus extends NodePropsData {
    CurSelectUnit: EntityIndex;
}
export class CCUnitScepterStatus extends CCPanel<ICCUnitScepterStatus> {

    render() {
        const CurSelectUnit = this.props.CurSelectUnit;
        let isHasScepter = false
        let buildingroot = GBuildingEntityRoot.GetEntity(CurSelectUnit);
        if (buildingroot) {
            let herounit = buildingroot.GetHeroUnit();
            if (herounit) {
                isHasScepter = herounit.HeroEquipComp.GetEntityBySlot(GEEnum.EEquipSolt.Scepter) != null;
            }
        }
        return (
            <Panel className="CCUnitScepterStatus" ref={this.__root__}    {...this.initRootAttrs()}>
                <CCIcon_Scepter on={isHasScepter} />
            </Panel>
        )
    }
}