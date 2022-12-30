
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_elixer_custom = {"ID":"302","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_SUPPRESS_ASSOCIATED_CONSUMABLE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","Model":"models/props_gameplay/neutral_box.vmdl","AbilityCastRange":"250","AbilityCastPoint":"0.0","SpellDispellableType":"SPELL_DISPELLABLE_YES","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","ItemInitialCharges":"3","ItemPermanent":"0","IsTempestDoubleClonable":"0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","health":"500"},"02":{"var_type":"FIELD_INTEGER","mana":"250"},"03":{"var_type":"FIELD_FLOAT","duration":"6"}}} ;

@registerAbility()
export class item_elixer_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_elixer";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_elixer_custom = Data_item_elixer_custom ;
};

    