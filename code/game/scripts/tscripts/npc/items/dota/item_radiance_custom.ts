
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_radiance_custom = {"ID":"137","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_TOGGLE","AbilityCastRange":"700","ItemCost":"5150","ItemShopTags":"damage","ItemQuality":"epic","ItemAliases":"radiance","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"60"},"03":{"var_type":"FIELD_INTEGER","aura_damage":"60"},"04":{"var_type":"FIELD_INTEGER","aura_damage_illusions":"35"},"05":{"var_type":"FIELD_INTEGER","blind_pct":"17"},"06":{"var_type":"FIELD_INTEGER","aura_radius":"700"}}} ;

@registerAbility()
export class item_radiance_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_radiance";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_radiance_custom = Data_item_radiance_custom ;
};

    