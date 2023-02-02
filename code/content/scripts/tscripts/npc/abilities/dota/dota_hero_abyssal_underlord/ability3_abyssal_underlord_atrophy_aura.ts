
import { GameFunc } from "../../../../GameFunc";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_abyssal_underlord_atrophy_aura = { "ID": "5615", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE | DOTA_ABILITY_BEHAVIOR_AURA", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilityCastRange": "900", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "900" }, "02": { "var_type": "FIELD_INTEGER", "damage_reduction_pct": "5 15 25 35" }, "03": { "var_type": "FIELD_INTEGER", "bonus_damage_from_creep": "2 4 6 8" }, "04": { "var_type": "FIELD_INTEGER", "bonus_damage_from_hero": "30 35 40 45" }, "05": { "var_type": "FIELD_FLOAT", "bonus_damage_duration": "30 45 60 75" }, "06": { "var_type": "FIELD_FLOAT", "bonus_damage_duration_scepter": "70 80 90 100", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_abyssal_underlord_atrophy_aura extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "abyssal_underlord_atrophy_aura";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_abyssal_underlord_atrophy_aura = Data_abyssal_underlord_atrophy_aura;
    Init() {
        this.SetDefaultSpecialValue("radius", 1200);
        this.SetDefaultSpecialValue("permanent_damage", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("bonus_damage", [100, 150, 200, 250, 300]);
        this.SetDefaultSpecialValue("bonus_damage_percent", [80, 90, 100, 110, 120]);
        this.SetDefaultSpecialValue("duration", 30);

    }




    GetIntrinsicModifierName() {
        return "modifier_abyssal_underlord_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_abyssal_underlord_3 extends BaseModifier_Plus {
    radius: number;
    IsHidden() {
        return true
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
    IsAura() {
        return !this.GetParentPlus().IsIllusion() && !this.GetParentPlus().PassivesDisabled()
    }
    GetAuraEntityReject(hEntity: IBaseNpc_Plus) {
        let hParent = this.GetParentPlus()
        if (hParent == hEntity) {
            return true
        }
        return false
    }
    GetAura() {
        return "modifier_abyssal_underlord_3_aura"
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
    }
    Init(params: IModifierTable) {
        this.radius = this.GetSpecialValueFor("radius")
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_abyssal_underlord_3_aura extends BaseModifier_Plus {
    permanent_damage: number;
    bonus_damage: number;
    duration: number;
    bonus_damage_percent: number;
    IsHidden() {
        return GameFunc.IsValid(this.GetCasterPlus()) && this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()
    }
    IsDebuff() {
        return GameFunc.IsValid(this.GetCasterPlus()) && this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (hCaster.GetTeamNumber() == hParent.GetTeamNumber()) {
            this.StartIntervalThink(0)
        }
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.permanent_damage = this.GetSpecialValueFor("permanent_damage")
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
        this.duration = this.GetSpecialValueFor("duration") + hCaster.GetTalentValue("special_bonus_unique_abyssal_underlord_custom_5")
        this.bonus_damage_percent = this.GetSpecialValueFor("bonus_damage_percent")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH, false, true)
    death(params: ModifierInstanceEvent) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (GameFunc.IsValid(hCaster) && hCaster.IsAlive() && !params.unit.IsIllusion() && hCaster.GetTeamNumber() != hParent.GetTeamNumber()) {
            let factor = params.unit.IsConsideredHero() && 5 || 1
            // if (!Spawner.IsEndless()) {
            //     this.hModifier1  =  modifier_abyssal_underlord_3_permanent_damage.apply(  hCaster , hCaster, hAbility, { factor=factor })
            // }
            // this.hModifier2  =  modifier_abyssal_underlord_3_bonus_attack.apply(  hCaster , hCaster, hAbility, { duration=this.duration })
        }
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.StartIntervalThink(-1)
                return
            }
            if (hCaster.GetTeamNumber() == hParent.GetTeamNumber() && hCaster.HasScepter()) {
                let hModifier1 = modifier_abyssal_underlord_3_permanent_damage.findIn(hCaster)
                let hModifier2 = modifier_abyssal_underlord_3_bonus_attack.findIn(hCaster)
                let bonus_damage = 0
                if (GameFunc.IsValid(hModifier1)) {
                    bonus_damage = bonus_damage + hModifier1.GetStackCount() * this.permanent_damage
                }
                if (GameFunc.IsValid(hModifier2)) {
                    bonus_damage = bonus_damage + hModifier2.GetStackCount() * this.bonus_damage
                }
                this.SetStackCount(bonus_damage * this.bonus_damage_percent * 0.01)
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (GameFunc.IsValid(hCaster) && hCaster.GetTeamNumber() == hParent.GetTeamNumber()) {
            return this.GetStackCount()
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_abyssal_underlord_3_permanent_damage extends BaseModifier_Plus {
    permanent_damage: number;
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
        this.permanent_damage = this.GetSpecialValueFor("permanent_damage") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_abyssal_underlord_custom_2")
        if (IsServer()) {
            this.SetStackCount(this.GetStackCount() + (params.factor || 0))
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage() {
        return this.GetStackCount() * this.permanent_damage
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_abyssal_underlord_3_bonus_attack extends BaseModifier_Plus {
    bonus_damage: number;
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
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
        if (IsServer()) {
            this.IncrementStackCount()
            this.addTimer(params.duration, () => {
                this.DecrementStackCount()
            })
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage() {
        return this.GetStackCount() * this.bonus_damage
    }
}
