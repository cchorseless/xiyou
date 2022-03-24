
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_orb_of_venom_custom = {"ID":"181","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","SpellDispellableType":"SPELL_DISPELLABLE_YES","ItemCost":"275","ItemShopTags":"hard_to_tag","ItemQuality":"component","ItemAliases":"oov;orb of venom","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","poison_damage_melee":"2.0"},"02":{"var_type":"FIELD_FLOAT","poison_damage_range":"2.0"},"03":{"var_type":"FIELD_INTEGER","poison_movement_speed_melee":"-13"},"04":{"var_type":"FIELD_INTEGER","poison_movement_speed_range":"-4"},"05":{"var_type":"FIELD_FLOAT","poison_duration":"2.0"}}} ;

@registerAbility()
export class item_orb_of_venom_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_orb_of_venom";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_orb_of_venom_custom = Data_item_orb_of_venom_custom ;
};

    