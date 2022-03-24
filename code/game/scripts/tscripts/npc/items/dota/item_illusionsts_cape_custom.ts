
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_illusionsts_cape_custom = {"ID":"363","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityCooldown":"30.0","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","attack_damage_aura":"6"},"02":{"var_type":"FIELD_FLOAT","illusion_duration":"30"},"03":{"var_type":"FIELD_INTEGER","outgoing_damage":"-50"},"04":{"var_type":"FIELD_INTEGER","outgoing_damage_tooltip":"50"},"05":{"var_type":"FIELD_INTEGER","incoming_damage":"100"},"06":{"var_type":"FIELD_INTEGER","tooltip_incoming_damage_total_pct":"200"},"07":{"var_type":"FIELD_INTEGER","bonus_agi":"14"},"08":{"var_type":"FIELD_INTEGER","bonus_str":"14"}}} ;

@registerAbility()
export class item_illusionsts_cape_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_illusionsts_cape";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_illusionsts_cape_custom = Data_item_illusionsts_cape_custom ;
};

    