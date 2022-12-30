
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ancient_janggo_custom = {"ID":"185","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","ItemPermanent":"1","FightRecapLevel":"1","AbilityCooldown":"30.0","AbilityCastRange":"1200","ItemCost":"1700","ItemShopTags":"str;agi;int;damage;move_speed;attack_speed;hard_to_tag","ItemQuality":"rare","ItemAliases":"drum of endurance","ItemInitialCharges":"8","ItemDisplayCharges":"1","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","aura_movement_speed":"20"},"02":{"var_type":"FIELD_INTEGER","bonus_str":"6"},"03":{"var_type":"FIELD_INTEGER","bonus_int":"6"},"04":{"var_type":"FIELD_INTEGER","bonus_attack_speed_pct":"45"},"05":{"var_type":"FIELD_INTEGER","bonus_movement_speed_pct":"13"},"06":{"var_type":"FIELD_INTEGER","duration":"6"},"07":{"var_type":"FIELD_INTEGER","radius":"1200"},"08":{"var_type":"FIELD_INTEGER","charges_tooltip":"8"}}} ;

@registerAbility()
export class item_ancient_janggo_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ancient_janggo";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ancient_janggo_custom = Data_item_ancient_janggo_custom ;
};

    