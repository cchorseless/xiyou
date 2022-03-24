
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_magic_wand_custom = {"ID":"36","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","Model":"models/props_gameplay/magic_wand.vmdl","AbilityCooldown":"13.0","AbilitySharedCooldown":"magicwand","AbilityCastRange":"1200","ItemCost":"450","ItemShopTags":"regen_health;regen_mana;boost_health;boost_mana;int;agi;str","ItemQuality":"common","ItemAliases":"magic wand","ItemRequiresCharges":"1","ItemDisplayCharges":"1","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","max_charges":"20"},"02":{"var_type":"FIELD_INTEGER","charge_radius":"1200"},"03":{"var_type":"FIELD_INTEGER","bonus_all_stats":"3"},"04":{"var_type":"FIELD_INTEGER","restore_per_charge":"15"}}} ;

@registerAbility()
export class item_magic_wand_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_magic_wand";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_magic_wand_custom = Data_item_magic_wand_custom ;
};

    