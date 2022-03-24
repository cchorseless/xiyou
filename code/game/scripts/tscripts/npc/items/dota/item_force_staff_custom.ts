
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_force_staff_custom = {"ID":"102","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH | DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC | DOTA_UNIT_TARGET_CUSTOM","FightRecapLevel":"1","AbilityCastRange":"550","AbilityCastPoint":"0.0","AbilityCooldown":"23.0","AbilitySharedCooldown":"force","AbilityManaCost":"100","ItemCost":"2200","ItemShopTags":"int;damage;attack_speed;hard_to_tag","ItemQuality":"rare","ItemAliases":"fs;force staff","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_intellect":"10"},"02":{"var_type":"FIELD_INTEGER","bonus_health":"150"},"03":{"var_type":"FIELD_INTEGER","push_length":"600"},"04":{"var_type":"FIELD_INTEGER","enemy_cast_range":"850"}}} ;

@registerAbility()
export class item_force_staff_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_force_staff";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_force_staff_custom = Data_item_force_staff_custom ;
};

    