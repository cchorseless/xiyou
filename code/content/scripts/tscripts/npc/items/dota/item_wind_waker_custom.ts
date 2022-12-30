
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_wind_waker_custom = {"ID":"610","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityUnitTargetType":"DOTA_UNIT_TARGET_CUSTOM","FightRecapLevel":"1","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCastRange":"550","AbilityCastPoint":"0.0","AbilityCooldown":"18.0","AbilitySharedCooldown":"cyclone","AbilityManaCost":"175","ItemCost":"7125","ItemShopTags":"int;regen_mana;move_speed;hard_to_tag","ItemQuality":"rare","ItemAliases":"cyclone;wind waker;ww","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"50"},"02":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"6.0"},"03":{"var_type":"FIELD_INTEGER","bonus_intellect":"35"},"04":{"var_type":"FIELD_FLOAT","cyclone_duration":"2.5"},"05":{"var_type":"FIELD_INTEGER","tooltip_drop_damage":"50"},"06":{"var_type":"FIELD_INTEGER","tornado_speed":"360"}}} ;

@registerAbility()
export class item_wind_waker_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_wind_waker";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_wind_waker_custom = Data_item_wind_waker_custom ;
};

    