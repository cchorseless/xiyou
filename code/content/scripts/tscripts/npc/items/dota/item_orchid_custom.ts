
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_orchid_custom = {"ID":"98","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","FightRecapLevel":"1","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCastRange":"900","AbilityCastPoint":"0.0","AbilityCooldown":"18.0","AbilitySharedCooldown":"orchid","AbilityManaCost":"100","ItemCost":"3475","ItemShopTags":"int;attack_speed;damage;regen_mana;damage;hard_to_tag","ItemQuality":"rare","ItemAliases":"orchid malevolence;silence","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_intellect":"20"},"02":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"25"},"03":{"var_type":"FIELD_INTEGER","bonus_damage":"30"},"04":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"4"},"05":{"var_type":"FIELD_FLOAT","silence_damage_percent":"30"},"06":{"var_type":"FIELD_FLOAT","silence_duration":"5"}}} ;

@registerAbility()
export class item_orchid_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_orchid";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_orchid_custom = Data_item_orchid_custom ;
};

    