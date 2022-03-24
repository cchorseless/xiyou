
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_clumsy_net_custom = {"ID":"360","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilityCastRange":"600","AbilityCooldown":"25.0","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"1.75"},"02":{"var_type":"FIELD_INTEGER","all_stats":"5"},"03":{"var_type":"FIELD_INTEGER","mana_regen":"2"}}} ;

@registerAbility()
export class item_clumsy_net_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_clumsy_net";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_clumsy_net_custom = Data_item_clumsy_net_custom ;
};

    