
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ultimate_scepter_custom = {"ID":"108","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","AbilityCastRange":"600","ItemCost":"4200","ItemShopTags":"int;str;agi;mana_pool;health_pool;hard_to_tag","ItemQuality":"rare","ItemAliases":"ags;ultimate;aghanim's scepter;ags","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_all_stats":"10"},"02":{"var_type":"FIELD_INTEGER","bonus_health":"175"},"03":{"var_type":"FIELD_INTEGER","bonus_mana":"175"}}} ;

@registerAbility()
export class item_ultimate_scepter_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ultimate_scepter";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ultimate_scepter_custom = Data_item_ultimate_scepter_custom ;
};

    