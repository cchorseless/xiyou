
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_nullifier_custom = {"ID":"225","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_INVULNERABLE","FightRecapLevel":"1","AbilityCooldown":"11.0","AbilityCastRange":"900","AbilityManaCost":"75","ItemCost":"4725","ItemQuality":"epic","ItemAliases":"nlf;nullifier","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"80"},"02":{"var_type":"FIELD_INTEGER","bonus_armor":"8"},"03":{"var_type":"FIELD_INTEGER","bonus_regen":"6"},"04":{"var_type":"FIELD_FLOAT","mute_duration":"5.0"},"05":{"var_type":"FIELD_INTEGER","projectile_speed":"1100"},"06":{"var_type":"FIELD_INTEGER","slow_pct":"80"},"07":{"var_type":"FIELD_FLOAT","slow_interval_duration":"0.5"}}} ;

@registerAbility()
export class item_nullifier_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_nullifier";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_nullifier_custom = Data_item_nullifier_custom ;
};

    