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
export const Data_nevermore_shadowraze3 = { "ID": "5061", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "OnLearnbar": "0", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "LinkedAbility": "nevermore_shadowraze1", "AbilityCastAnimation": "ACT_DOTA_RAZE_3", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0.55", "AbilityCooldown": "10", "AbilityManaCost": "75 80 85 90", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "shadowraze_damage": "90 160 230 300", "LinkedSpecialBonus": "special_bonus_unique_nevermore_2" }, "02": { "var_type": "FIELD_INTEGER", "shadowraze_radius": "250" }, "03": { "var_type": "FIELD_INTEGER", "shadowraze_range": "700" }, "04": { "var_type": "FIELD_INTEGER", "shadowraze_cooldown": "3" }, "05": { "var_type": "FIELD_INTEGER", "stack_bonus_damage": "50 60 70 80", "CalculateSpellDamageTooltip": "0" }, "06": { "var_type": "FIELD_FLOAT", "duration": "8" } } };

@registerAbility()
export class ability3_nevermore_shadowraze3 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "nevermore_shadowraze3";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_nevermore_shadowraze3 = Data_nevermore_shadowraze3;
    Init() {
                this.SetDefaultSpecialValue("presence_incoming_damage_ptg", [16,22,28,34,40]);
        this.SetDefaultSpecialValue("presence_radius", 1100);
        this.SetDefaultSpecialValue("fear_incoming_damage_ptg", [6,8,10,12,16]);
        this.SetDefaultSpecialValue("max_damage_percent", 50);
        this.SetDefaultSpecialValue("min_range", 200);
        this.SetDefaultSpecialValue("range_decay_factor", 100);
        this.SetDefaultSpecialValue("range_decay_damage", [7,6,5,4,3]);

        }

    Init_old() {
                this.SetDefaultSpecialValue("presence_incoming_damage_ptg", [10,16,22,28,34,40]);
        this.SetDefaultSpecialValue("presence_radius", 1100);
        this.SetDefaultSpecialValue("fear_incoming_damage_ptg", [4,6,8,10,12,16]);
        this.SetDefaultSpecialValue("max_damage_percent", 50);
        this.SetDefaultSpecialValue("min_range", 200);
        this.SetDefaultSpecialValue("range_decay_factor", 100);
        this.SetDefaultSpecialValue("range_decay_damage", [7,6,5,4,3]);

        }

}
