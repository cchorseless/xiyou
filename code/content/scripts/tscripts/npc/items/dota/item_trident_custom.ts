
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_trident_custom = {"ID":"369","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","magic_damage_attack":"30"},"01":{"var_type":"FIELD_INTEGER","bonus_strength":"30"},"02":{"var_type":"FIELD_INTEGER","bonus_agility":"30"},"03":{"var_type":"FIELD_INTEGER","bonus_intellect":"30"},"04":{"var_type":"FIELD_INTEGER","status_resistance":"30"},"05":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"30"},"06":{"var_type":"FIELD_INTEGER","movement_speed_percent_bonus":"10"},"07":{"var_type":"FIELD_INTEGER","hp_regen_amp":"30"},"08":{"var_type":"FIELD_INTEGER","mana_regen_multiplier":"30"},"09":{"var_type":"FIELD_INTEGER","spell_amp":"30"}}} ;

@registerAbility()
export class item_trident_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_trident";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_trident_custom = Data_item_trident_custom ;
};

    