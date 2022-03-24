
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_shadow_amulet_custom = {"ID":"215","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","FightRecapLevel":"1","AbilityCastRange":"600","AbilityCooldown":"7.0","AbilityManaCost":"0","ItemCost":"1000","ItemShopTags":"","ItemAliases":"shadow amulet","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","fade_time":"1.25"}}} ;

@registerAbility()
export class item_shadow_amulet_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_shadow_amulet";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_shadow_amulet_custom = Data_item_shadow_amulet_custom ;
};

    