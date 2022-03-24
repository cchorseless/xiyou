
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_invis_sword_custom = {"ID":"152","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL","FightRecapLevel":"1","AbilityCooldown":"25.0","AbilitySharedCooldown":"shadow_blade","AbilityManaCost":"75","ItemCost":"3000","ItemShopTags":"damage;attack_speed;movespeed;hard_to_tag","ItemQuality":"epic","ItemAliases":"sb;invis;shadow blade;silver edge","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"25"},"02":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"35"},"03":{"var_type":"FIELD_FLOAT","windwalk_duration":"14.0"},"04":{"var_type":"FIELD_INTEGER","windwalk_movement_speed":"20"},"05":{"var_type":"FIELD_FLOAT","windwalk_fade_time":"0.3"},"06":{"var_type":"FIELD_INTEGER","windwalk_bonus_damage":"175"}}} ;

@registerAbility()
export class item_invis_sword_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_invis_sword";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_invis_sword_custom = Data_item_invis_sword_custom ;
};

    