
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_bottle_custom = {"ID":"41","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_SUPPRESS_ASSOCIATED_CONSUMABLE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","Model":"models/props_gameplay/bottle_blue.vmdl","ModelAlternate":"models/props_gameplay/bottle_empty.vmdl","FightRecapLevel":"1","AbilityCooldown":"0.5","AbilityCastRange":"350","AbilityCastPoint":"0.0","ItemCost":"675","ItemShopTags":"consumable","ItemQuality":"common","ItemAliases":"bottle","ItemStackable":"0","ItemShareability":"ITEM_PARTIALLY_SHAREABLE","ItemPermanent":"1","ItemInitialCharges":"3","ItemDisplayCharges":"1","IsTempestDoubleClonable":"0","ShouldBeSuggested":"1","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","health_restore":"115"},"02":{"var_type":"FIELD_INTEGER","mana_restore":"65"},"03":{"var_type":"FIELD_INTEGER","health_restore_pct":"0"},"04":{"var_type":"FIELD_INTEGER","mana_restore_pct":"0"},"05":{"var_type":"FIELD_FLOAT","restore_time":"2.5"},"06":{"var_type":"FIELD_INTEGER","max_charges":"3"},"07":{"var_type":"FIELD_INTEGER","break_on_hero_damage":"1"}}} ;

@registerAbility()
export class item_bottle_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_bottle";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_bottle_custom = Data_item_bottle_custom ;
};

    