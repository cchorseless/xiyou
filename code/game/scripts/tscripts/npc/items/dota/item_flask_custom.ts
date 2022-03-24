
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_flask_custom = {"ID":"39","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_SUPPRESS_ASSOCIATED_CONSUMABLE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","Model":"models/props_gameplay/salve.vmdl","AbilityCastRange":"250","AbilityCastPoint":"0.0","SpellDispellableType":"SPELL_DISPELLABLE_YES","ItemCost":"110","ItemShopTags":"consumable","ItemQuality":"consumable","ItemAliases":"healing salve","ItemStackable":"1","ItemPermanent":"0","ItemInitialCharges":"1","IsTempestDoubleClonable":"0","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","buff_duration":"10"},"02":{"var_type":"FIELD_INTEGER","health_regen":"40"},"03":{"var_type":"FIELD_INTEGER","break_on_hero_damage":"1"}}} ;

@registerAbility()
export class item_flask_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_flask";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_flask_custom = Data_item_flask_custom ;
};

    