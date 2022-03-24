import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tiny_tree_grab = { "ID": "5108", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_TREE | DOTA_UNIT_TARGET_CUSTOM", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_CUSTOM", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_Tiny.CraggyExterior.Stun", "LinkedAbility": "tiny_toss_tree", "HasScepterUpgrade": "1", "HasShardUpgrade": "1", "AbilityCastRange": "165", "AbilityCastPoint": "0.2", "AbilityCooldown": "16 14 12 10", "AbilityManaCost": "40", "AbilityModifierSupportBonus": "35", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "speed_reduction": "0" }, "01": { "var_type": "FIELD_INTEGER", "attack_count": "5", "LinkedSpecialBonus": "special_bonus_unique_tiny_6" }, "02": { "var_type": "FIELD_INTEGER", "bonus_damage": "25", "LinkedSpecialBonus": "special_bonus_unique_tiny_7", "CalculateSpellDamageTooltip": "0" }, "03": { "var_type": "FIELD_INTEGER", "bonus_damage_buildings": "90 120 150 180", "CalculateSpellDamageTooltip": "0" }, "04": { "var_type": "FIELD_INTEGER", "attack_range": "350" }, "05": { "var_type": "FIELD_INTEGER", "splash_width": "200" }, "06": { "var_type": "FIELD_INTEGER", "splash_range": "400" }, "07": { "var_type": "FIELD_INTEGER", "splash_pct": "40 60 80 100" }, "08": { "var_type": "FIELD_INTEGER", "throw_splash_pct": "150" }, "09": { "var_type": "FIELD_FLOAT", "bat_increase": "0.0" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_tiny_tree_grab extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tiny_tree_grab";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tiny_tree_grab = Data_tiny_tree_grab;
    Init() {
                this.SetDefaultSpecialValue("bonus_base_damage", [0.2,0.4,0.6,0.8,1.0]);
        this.SetDefaultSpecialValue("attack_speed_reduction", [0,50,100,150,200]);
        this.SetDefaultSpecialValue("cooldown_pct", 20);

        }

}
