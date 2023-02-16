import { GameFunc } from "../../../../GameFunc";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_mirana_leap = { "ID": "5050", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Ability.Leap", "HasShardUpgrade": "1", "AbilityCooldown": "0", "AbilityCharges": "3", "AbilityChargeRestoreTime": "45 40 35 30", "AbilityManaCost": "40", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "leap_distance": "575" }, "02": { "var_type": "FIELD_FLOAT", "leap_speed": "1300.0" }, "03": { "var_type": "FIELD_FLOAT", "leap_acceleration": "6000.0" }, "04": { "var_type": "FIELD_INTEGER", "leap_speedbonus": "8 16 24 32" }, "05": { "var_type": "FIELD_INTEGER", "leap_speedbonus_as": "25 50 75 100", "LinkedSpecialBonus": "special_bonus_unique_mirana_1" }, "06": { "var_type": "FIELD_FLOAT", "leap_bonus_duration": "2.5" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_mirana_leap extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "mirana_leap";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_mirana_leap = Data_mirana_leap;
    Init() {
        this.SetDefaultSpecialValue("count_per_kill", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("bonus_damage", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("max_kills", 1000);

    }

    Init_old() {
        this.SetDefaultSpecialValue("count_per_kill", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("bonus_damage", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("max_kills", 1000);

    }



    GetBehavior() {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        undefined
        modifier_mirana_3_buff.apply(hCaster, hCaster, this, null)
    }

    GetIntrinsicModifierName() {
        return "modifier_mirana_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mirana_3 extends BaseModifier_Plus {
    count_per_kill: number;
    bonus_damage: number;
    max_kills: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.count_per_kill = this.GetSpecialValueFor("count_per_kill")
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
        this.max_kills = this.GetSpecialValueFor("max_kills")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        let iExtraDamage = this.GetCasterPlus().HasTalent("special_bonus_unique_mirana_custom_7") && this.GetCasterPlus().GetTalentValue("special_bonus_unique_mirana_custom_7") || 0
        return this.GetStackCount() * (this.bonus_damage + iExtraDamage)
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    OnDeath(params: IModifierTable) {
        // if (Spawner.IsEndless()) {
        //     return
        // }
        let hAttacker = params.attacker
        if (!GameFunc.IsValid(hAttacker) || hAttacker.GetUnitLabel() == "builder") {
            return
        }
        if (hAttacker.GetTeamNumber() == params.unit.GetTeamNumber()) {
            return
        }
        hAttacker = hAttacker.GetSource()
        if (hAttacker == this.GetParentPlus() && !hAttacker.IsIllusion()) {
            let factor = params.unit.IsConsideredHero() && 5 || 1
            this.ChangeStackCount(factor * this.count_per_kill)
            if (!modifier_mirana_3_buff.exist(hAttacker) && this.GetStackCount() >= this.max_kills) {
                modifier_mirana_3_buff.apply(hAttacker, hAttacker, this.GetAbilityPlus(), null)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_mirana_3_buff extends BaseModifier_Plus {
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    G_SPELL_AMPLIFY_BONUS() {
        return this.GetCasterPlus().GetTalentValue('special_bonus_unique_mirana_custom_8')
    }
}
