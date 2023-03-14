
// import React from "react";
// import { ECombination } from "../../game/components/Combination/ECombination";
// import { CSSHelper } from "../../helper/CSSHelper";
// import { BaseEntityRoot } from "../../libs/BaseEntityRoot";
// import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";

// interface IProps extends NodePropsData {
//     sectName: string;
//     castentityindex?: AbilityEntityIndex,
//     playerid?: PlayerID
// }

// export class CCCombinationDesItem extends CCPanel<IProps> {

//     render() {
//         let { sectName, castentityindex, playerid } = this.props;
//         if (playerid == -1) {
//             if (castentityindex != -1) {
//                 let unitentityindex = Abilities.GetCaster(castentityindex!);
//                 playerid = BaseEntityRoot.GetEntityBelongPlayerId(unitentityindex);
//             }
//         }
//         let uniqueConfigList: string[] = [];
//         if (playerid !== -1) {
//             const allcombs = ECombination.GetCombinationBySectName(playerid!, sectName) || [];
//             if (allcombs.length > 0) {
//                 uniqueConfigList = allcombs[0].uniqueConfigList;
//             }
//         }
//         let data = GJSONConfig.CombinationConfig.getDataList()
//         for (let info of data) {
//             if (info.relation == sectName) {
//                 return info.relationicon;
//             }
//         }
//         return <Panel ref={this.__root__} className="CCCombinationDesItem"  {...this.initRootAttrs()}>
//             <CCPanel id="AbilityCombination" flowChildren="right-wrap">
//                 {herolist.length > 0 && herolist.map(
//                     (name, index) => {
//                         return <CCUnitSmallIcon key={index + ""} width="40px" height="40px" itemname={name} rarity={UnitHelper.GetUnitRarety(name)} brightness={uniqueConfigList.includes(name) ? "1" : "0.2"} />
//                     })}
//             </CCPanel>
//         </Panel>
//     }
// }
