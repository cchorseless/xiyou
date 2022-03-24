
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_seer_stone_custom = {"ID":"294","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","FightRecapLevel":"1","AbilityCastRange":"0","AbilityCooldown":"60","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","cast_range_bonus":"350"},"02":{"var_type":"FIELD_INTEGER","vision_bonus":"350"},"03":{"var_type":"FIELD_INTEGER","mana_regen":"10"},"04":{"var_type":"FIELD_INTEGER","radius":"800"},"05":{"var_type":"FIELD_FLOAT","duration":"6"}}} ;

@registerAbility()
export class item_seer_stone_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_seer_stone";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_seer_stone_custom = Data_item_seer_stone_custom ;
};

    