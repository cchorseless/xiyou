
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_sphere_custom = {"ID":"123","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","FightRecapLevel":"1","AbilityCastRange":"700","AbilityCooldown":"12.0","ItemCost":"4600","ItemShopTags":"regen_health;regen_mana;str;agi;int;hard_to_tag","ItemQuality":"epic","ItemAliases":"ls;linken's sphere","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ActiveDescriptionLine":"2","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_all_stats":"14"},"02":{"var_type":"FIELD_FLOAT","bonus_health_regen":"7"},"03":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"5.0"},"04":{"var_type":"FIELD_FLOAT","block_cooldown":"12.0"}}} ;

@registerAbility()
export class item_sphere_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_sphere";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_sphere_custom = Data_item_sphere_custom ;
};

    