
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_rod_of_atos_custom = {"ID":"206","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","FightRecapLevel":"1","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySharedCooldown":"atos","AbilityCooldown":"18","AbilityCastRange":"1100","AbilityCastPoint":"0.0","AbilityManaCost":"50","ItemCost":"2750","ItemShopTags":"int;regen_health","ItemQuality":"rare","ItemAliases":"rod of atos","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_intellect":"20"},"02":{"var_type":"FIELD_INTEGER","bonus_strength":"10"},"03":{"var_type":"FIELD_INTEGER","bonus_agility":"10"},"04":{"var_type":"FIELD_FLOAT","duration":"2.0"}}} ;

@registerAbility()
export class item_rod_of_atos_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_rod_of_atos";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_rod_of_atos_custom = Data_item_rod_of_atos_custom ;
};

    