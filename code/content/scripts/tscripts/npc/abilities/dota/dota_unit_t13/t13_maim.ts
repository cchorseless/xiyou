import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_bleeding } from "../../../modifier/effect/modifier_generic_bleeding";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";


@registerAbility()
export class t13_maim extends BaseAbility_Plus {

    GetIntrinsicModifierName() {
        return "modifier_t13_maim"
    }
    Bleeding(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let damage = this.GetSpecialValueFor("damage")
        let blood_duration = this.GetSpecialValueFor("blood_duration")

        modifier_generic_bleeding.Bleeding(hTarget, hCaster, this, blood_duration, (tDamageTable) => {
            return damage
        }, true)
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t13_maim extends BaseModifier_Plus {
    duration: number;
    blood_chance: number;
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
    Init(params: IModifierTable) {
        this.duration = this.GetSpecialValueFor("duration")
        this.blood_chance = this.GetSpecialValueFor("blood_chance")
    }
    BeRefresh(params: IModifierTable) {

        this.duration = this.GetSpecialValueFor("duration")
        this.blood_chance = this.GetSpecialValueFor("blood_chance")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    OnTakeDamage(params: IModifierTable) {
        if (GFuncEntity.IsValid(params.unit) && params.attacker == this.GetParentPlus() && !params.attacker.PassivesDisabled() && !params.attacker.IsIllusion()) {
            modifier_t13_maim_debuff.apply(params.unit, params.attacker, this.GetAbilityPlus(), { duration: this.duration * params.unit.GetStatusResistanceFactor(params.attacker) })
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (!this.GetAbilityPlus().IsActivated()) {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.PassivesDisabled() && !params.attacker.IsIllusion()) {
            if (GFuncMath.PRD(this.blood_chance, params.attacker, "modifier_t13_maim")) {
                (this.GetAbilityPlus() as t13_maim).Bleeding(params.target)
            }
        }
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t13_maim_debuff extends BaseModifier_Plus {
    incoming_damage_pct: number;
    max_stack_count: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return true
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            if (this.GetStackCount() < this.max_stack_count) {
                this.IncrementStackCount()
            }
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/items2_fx/sange_maim.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeRefresh(params: IModifierTable) {

        this.incoming_damage_pct = this.GetSpecialValueFor("incoming_damage_pct")
        this.max_stack_count = this.GetSpecialValueFor("max_stack_count")
        if (IsServer()) {
            if (this.GetStackCount() < this.max_stack_count) {
                this.IncrementStackCount()
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DOT_DAMAGE_PERCENTAGE)
    G_INCOMING_DOT_DAMAGE_PERCENTAGE() {
        return this.incoming_damage_pct * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.incoming_damage_pct * this.GetStackCount()
    }
}