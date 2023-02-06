import React from "react";
import { ECombination } from "../../game/components/Combination/ECombination";
import { UnitHelper } from "../../helper/DotaEntityHelper";
import { BaseEntityRoot } from "../../libs/BaseEntityRoot";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCUnitSmallIcon } from "../AllUIElement/CCUnit/CCUnitSmallIcon";

import "./CCCombinationUnitIconGroup.less";

interface ICCCombinationUnitIconGroup {
    sectName: string;
    unitentityindex?: EntityIndex
    playerid?: PlayerID
}


export class CCCombinationUnitIconGroup extends CCPanel<ICCCombinationUnitIconGroup> {

    static defaultProps = {
        playerid: -1
    }

    render() {
        let { sectName, unitentityindex, playerid } = this.props;
        if (playerid == -1) {
            if (unitentityindex != -1) {
                playerid = BaseEntityRoot.GetEntityBelongPlayerId(unitentityindex!);
            }
        }
        const herolist: string[] = [];
        let uniqueConfigList: string[] = [];
        if (playerid !== -1) {
            const allcombs = ECombination.GetCombinationByCombinationName(playerid!, sectName) || [];
            if (allcombs.length > 0) {
                uniqueConfigList = allcombs[0].uniqueConfigList;
            }
        }
        for (let data of GJSONConfig.CombinationConfig.getDataList()) {
            if (data.relation == sectName && data.heroid && !herolist.includes(data.heroid)) {
                herolist.push(data.heroid);
            }
        }
        herolist.sort((a, b) => {
            const r_a = UnitHelper.GetUnitRaretyNumber(a);
            const r_b = UnitHelper.GetUnitRaretyNumber(b);
            return r_a - r_b
        });
        return <Panel ref={this.__root__} className="CCCombinationUnitIconGroup"  {...this.initRootAttrs()}>
            <CCPanel id="AbilityCombination" flowChildren="right-wrap">
                {herolist.length > 0 && herolist.map(
                    (name, index) => {
                        return <CCUnitSmallIcon key={index + ""} width="40px" height="40px" itemname={name} rarity={UnitHelper.GetUnitRarety(name)} brightness={uniqueConfigList.includes(name) ? "1" : "0.2"} />
                    })}
            </CCPanel>
        </Panel>
    }
}