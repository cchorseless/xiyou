
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_hand_of_midas_custom = {"ID":"65","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_CREEP","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS | DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","AbilityCastRange":"600","AbilityCastPoint":"0.0","AbilityCooldown":"90.0","AbilityManaCost":"0","ItemCost":"2200","ItemShopTags":"attack_speed;hard_to_tag","ItemQuality":"common","ItemAliases":"hand of midas","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"40"},"02":{"var_type":"FIELD_FLOAT","xp_multiplier":"2.1"},"03":{"var_type":"FIELD_INTEGER","bonus_gold":"160"}}} ;

@registerAbility()
export class item_hand_of_midas_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_hand_of_midas";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_hand_of_midas_custom = Data_item_hand_of_midas_custom ;
};

    