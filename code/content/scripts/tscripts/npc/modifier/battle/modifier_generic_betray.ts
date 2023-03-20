
// import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
// import { registerModifier } from "../../entityPlus/Base_Plus";
// // 背叛
// @registerModifier()
// export class modifier_generic_betray extends BaseModifier_Plus {

//     public Init(params?: IModifierTable): void {

//     }

//     public BeDestroy(): void {
//         if (this.GetRemainingTime() <= 0) {
//             let target = this.GetParentPlus();
//             let team = target.GetTeam() == DOTATeam_t.DOTA_TEAM_GOODGUYS ? DOTATeam_t.DOTA_TEAM_BADGUYS : DOTATeam_t.DOTA_TEAM_GOODGUYS;
//             target.SetTeam(team);
//             let new_lane_creep = this.GetCasterPlus().CreateSummon(target.GetUnitName(), target.GetAbsOrigin(), -1, false);
//             new_lane_creep.SetBaseMaxHealth(target.GetMaxHealth());
//             new_lane_creep.SetHealth(target.GetHealth());
//             new_lane_creep.SetBaseDamageMin(target.GetBaseDamageMin());
//             new_lane_creep.SetBaseDamageMax(target.GetBaseDamageMax());
//             new_lane_creep.SetMinimumGoldBounty(target.GetGoldBounty());
//             new_lane_creep.SetMaximumGoldBounty(target.GetGoldBounty());
//             target.AddNoDraw();
//             target.ForceKill(false);
//             GFuncEntity.SafeDestroyUnit(target);
//         }
//     }
// }

