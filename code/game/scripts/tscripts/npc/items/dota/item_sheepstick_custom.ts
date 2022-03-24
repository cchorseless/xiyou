
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_sheepstick_custom = {"ID":"96","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","FightRecapLevel":"2","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","AbilityCastRange":"800","AbilityCastPoint":"0.0","AbilityCooldown":"20.0","AbilityManaCost":"250","ItemCost":"5675","ItemShopTags":"int;regen_mana;agi;hard_to_tag","ItemQuality":"rare","ItemAliases":"hex;sheepstick;scythe of vyse","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_strength":"10"},"02":{"var_type":"FIELD_INTEGER","bonus_agility":"10"},"03":{"var_type":"FIELD_INTEGER","bonus_intellect":"35"},"04":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"9.0"},"05":{"var_type":"FIELD_FLOAT","sheep_duration":"3.5"},"06":{"var_type":"FIELD_FLOAT","sheep_movement_speed":"140"}}} ;

@registerAbility()
export class item_sheepstick_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_sheepstick";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_sheepstick_custom = Data_item_sheepstick_custom ;
};

    