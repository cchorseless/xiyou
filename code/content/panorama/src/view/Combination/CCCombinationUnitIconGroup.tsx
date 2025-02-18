import React from "react";
import { ECombination } from "../../game/components/Combination/ECombination";
import { BaseEntityRoot } from "../../libs/BaseEntityRoot";
import { CCIcon_Scepter } from "../AllUIElement/CCIcons/CCIcon_Scepter";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCUnitSmallIcon } from "../AllUIElement/CCUnit/CCUnitSmallIcon";

import "./CCCombinationUnitIconGroup.less";

interface ICCCombinationUnitIconGroup {
    sectName: string;
    unitentityindex?: EntityIndex,
    castentityindex?: AbilityEntityIndex,
    playerid?: PlayerID
}


export class CCCombinationUnitIconGroup extends CCPanel<ICCCombinationUnitIconGroup> {

    static defaultProps = {
        playerid: -1,
        castentityindex: -1,
        unitentityindex: -1,
    }

    render() {
        let { sectName, castentityindex, playerid, unitentityindex } = this.props;
        if (playerid == -1) {
            if (unitentityindex != -1) {
                playerid = BaseEntityRoot.GetEntityBelongPlayerId(unitentityindex!);
            }
            else if (castentityindex != -1) {
                let unit_entindex = Abilities.GetCaster(castentityindex!)
                playerid = BaseEntityRoot.GetEntityBelongPlayerId(unit_entindex!);
            }
        }
        const herolist: string[] = [];
        const herolistNeedUnlock: string[] = [];
        const itemlist: string[] = [];
        let uniqueConfigList: string[] = [];
        if (playerid !== -1) {
            const allcombs = ECombination.GetCombinationBySectName(playerid!, sectName) || [];
            if (allcombs.length > 0) {
                uniqueConfigList = allcombs[0].uniqueConfigList;
            }
        }
        for (let data of GJSONConfig.CombinationConfig.getDataList()) {
            if (data.SectName == sectName) {
                if (data.heroid.length > 0) {
                    if (data.Equipid == 0) {
                        (!herolist.includes(data.heroid)) && herolist.push(data.heroid);
                    }
                    else {
                        (!herolistNeedUnlock.includes(data.heroid)) && herolistNeedUnlock.push(data.heroid);
                    }
                }
                else if (data.heroid == "" && data.Abilityid.length > 0) {

                }

            }
        }
        herolist.sort((a, b) => {
            const r_a = Entities.GetUnitRarityNumber(a);
            const r_b = Entities.GetUnitRarityNumber(b);
            return r_a - r_b
        });
        return <Panel ref={this.__root__} className="CCCombinationUnitIconGroup"  {...this.initRootAttrs()}>
            <CCPanel id="AbilityCombination" flowChildren="right-wrap">
                {herolist.length > 0 && herolist.map(
                    (name, index) => {
                        return <CCUnitSmallIcon key={index + ""} width="40px" height="40px" itemname={name} brightness={uniqueConfigList.includes(name) ? "1" : "0.2"} />
                    })
                }
                {herolistNeedUnlock.length > 0 && herolistNeedUnlock.map(
                    (name, index) => {
                        return <CCUnitSmallIcon key={index + ""} width="40px" height="40px" itemname={name} brightness={uniqueConfigList.includes(name) ? "1" : "0.2"} >
                            <CCIcon_Scepter on={true} width="25px" height="25px" align="right bottom" />
                        </CCUnitSmallIcon>
                    })
                }
            </CCPanel>
            {/* <CCPanel id="ItemCombination" flowChildren="right-wrap">
                {herolist.length > 0 && herolist.map(
                    (name, index) => {
                        return <CCUnitSmallIcon key={index + ""} width="40px" height="40px" itemname={name} rarity={Entities.GetUnitRarety(name)} brightness={uniqueConfigList.includes(name) ? "1" : "0.2"} />
                    })}
            </CCPanel> */}
        </Panel>
    }
}