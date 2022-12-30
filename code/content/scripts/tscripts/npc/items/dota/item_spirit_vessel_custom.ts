
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_spirit_vessel_custom = {"ID":"267","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityCastRange":"950","AbilityCooldown":"7.0","AbilitySharedCooldown":"urn","ItemRequiresCharges":"1","ItemDisplayCharges":"1","ItemStackable":"0","ItemPermanent":"1","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_NEVER","ItemCost":"2840","ItemQuality":"rare","ItemAliases":"sv;spirit vessel","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","duration":"8.0"},"11":{"var_type":"FIELD_INTEGER","hp_regen_reduction_enemy":"45"},"12":{"var_type":"FIELD_FLOAT","enemy_hp_drain":"4"},"01":{"var_type":"FIELD_INTEGER","bonus_health":"250"},"02":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"1.75"},"03":{"var_type":"FIELD_INTEGER","bonus_all_stats":"2"},"04":{"var_type":"FIELD_FLOAT","bonus_armor":"2"},"05":{"var_type":"FIELD_INTEGER","soul_radius":"1400"},"06":{"var_type":"FIELD_INTEGER","soul_initial_charge":"2"},"07":{"var_type":"FIELD_INTEGER","soul_additional_charges":"1"},"08":{"var_type":"FIELD_INTEGER","soul_heal_amount":"40"},"09":{"var_type":"FIELD_INTEGER","soul_damage_amount":"35"}}} ;

@registerAbility()
export class item_spirit_vessel_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_spirit_vessel";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_spirit_vessel_custom = Data_item_spirit_vessel_custom ;
};

    