
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_fallen_sky_custom = {"ID":"371","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_DIRECTIONAL | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","AbilityCastRange":"1600","AbilityCooldown":"15.0","ItemCost":"4751","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","land_time":".5"},"11":{"var_type":"FIELD_INTEGER","impact_radius":"315"},"12":{"var_type":"FIELD_FLOAT","max_duration":"2.5"},"13":{"var_type":"FIELD_INTEGER","impact_damage_buildings":"75"},"14":{"var_type":"FIELD_INTEGER","impact_damage_units":"150"},"15":{"var_type":"FIELD_FLOAT","blink_damage_cooldown":"3.0"},"01":{"var_type":"FIELD_INTEGER","bonus_strength":"20"},"02":{"var_type":"FIELD_INTEGER","bonus_intellect":"20"},"03":{"var_type":"FIELD_FLOAT","bonus_health_regen":"15.0"},"04":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"10.0"},"05":{"var_type":"FIELD_INTEGER","burn_dps_buildings":"50"},"06":{"var_type":"FIELD_INTEGER","burn_dps_units":"90"},"07":{"var_type":"FIELD_INTEGER","burn_duration":"6"},"08":{"var_type":"FIELD_FLOAT","stun_duration":"2.0"},"09":{"var_type":"FIELD_FLOAT","burn_interval":"1.0"}}} ;

@registerAbility()
export class item_fallen_sky_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_fallen_sky";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_fallen_sky_custom = Data_item_fallen_sky_custom ;
};

    