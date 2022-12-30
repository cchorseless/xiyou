
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_urn_of_shadows_custom = {"ID":"92","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","FightRecapLevel":"1","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCastRange":"950","AbilityCastPoint":"0.0","AbilityCooldown":"7.0","AbilitySharedCooldown":"urn","ItemRequiresCharges":"1","ItemDisplayCharges":"1","ItemStackable":"0","ItemPermanent":"1","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_NEVER","ItemCost":"840","ItemShopTags":"regen_mana;str;boost_health","ItemQuality":"rare","ItemAliases":"urn of shadows","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","duration":"8.0"},"01":{"var_type":"FIELD_FLOAT","mana_regen":"1.4"},"02":{"var_type":"FIELD_INTEGER","bonus_all_stats":"2"},"03":{"var_type":"FIELD_FLOAT","bonus_armor":"2"},"04":{"var_type":"FIELD_INTEGER","soul_radius":"1400"},"05":{"var_type":"FIELD_INTEGER","soul_initial_charge":"2"},"06":{"var_type":"FIELD_INTEGER","soul_additional_charges":"1"},"07":{"var_type":"FIELD_INTEGER","soul_heal_amount":"30"},"08":{"var_type":"FIELD_INTEGER","soul_damage_amount":"25"}}} ;

@registerAbility()
export class item_urn_of_shadows_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_urn_of_shadows";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_urn_of_shadows_custom = Data_item_urn_of_shadows_custom ;
};

    