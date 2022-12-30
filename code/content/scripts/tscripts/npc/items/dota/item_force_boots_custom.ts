
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_force_boots_custom = {"ID":"291","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH | DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC | DOTA_UNIT_TARGET_CUSTOM","FightRecapLevel":"1","AbilityCastRange":"750","AbilityCooldown":"8.0","AbilityManaCost":"75","ItemCost":"0","ItemIsNeutralDrop":"1","DisplayOverheadAlertOnReceived":"0","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"115"},"02":{"var_type":"FIELD_INTEGER","push_length":"750"},"03":{"var_type":"FIELD_FLOAT","push_duration":"0.5"},"04":{"var_type":"FIELD_INTEGER","hp_regen":"30"}}} ;

@registerAbility()
export class item_force_boots_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_force_boots";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_force_boots_custom = Data_item_force_boots_custom ;
};

    