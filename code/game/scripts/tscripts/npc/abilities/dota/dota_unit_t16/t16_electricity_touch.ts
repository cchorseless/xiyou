import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { LogHelper } from "../../../../helper/LogHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { GameEnum } from "../../../../shared/GameEnum";


@registerAbility()
export class t16_electricity_touch extends BaseAbility_Plus {

    RefreshCharges() {
        let hCaster = this.GetCasterPlus()
        let hModifier = modifier_t16_electricity_touch.findIn(hCaster)
        if (hModifier != null) {
            hModifier.StartIntervalThink(0)
        }
    }
    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    GetIntrinsicModifierName() {
        return "modifier_t16_electricity_touch"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t16_electricity_touch extends BaseModifier_Plus {
    damage: number;
    duration: number;
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
    Init(params: ModifierTable) {
        this.damage = this.GetSpecialValueFor("damage")
        this.duration = this.GetSpecialValueFor("duration")
        this.radius = this.GetSpecialValueFor("radius")
        if (IsServer()) {
            this.StartIntervalThink(0)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
                this.Destroy()
                return
            }
            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }
            if (hCaster.PassivesDisabled()) {
                return
            }

            // let combination_t16_electrical_paralysis  = combination_t16_electrical_paralysis.findIn(  hCaster )
            // let has_combination_t16_electrical_paralysis = GameFunc.IsValid(combination_t16_electrical_paralysis) && combination_t16_electrical_paralysis.IsActivated()

            // let combination_t16_magic_weakness  = combination_t16_magic_weakness.findIn(  hCaster )
            // let has_combination_t16_magic_weakness = GameFunc.IsValid(combination_t16_magic_weakness) && combination_t16_magic_weakness.IsActivated()

            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_CLOSEST)

            if (tTargets.length > 0) {
                for (let hTarget of (tTargets)) {

                    modifier_t16_electricity_touch_debuff.apply(hTarget, hCaster, this.GetAbilityPlus(), { duration: this.duration * hTarget.GetStatusResistanceFactor(hCaster) })

                    // if (has_combination_t16_magic_weakness) {
                    //     combination_t16_magic_weakness.MagicWeakness(hTarget, this.duration)
                    // }

                    let damage = this.damage
                    // if (has_combination_t16_electrical_paralysis) {
                    //     combination_t16_electrical_paralysis.ElectricalParalysis(hTarget)
                    // }

                    let damage_table = {
                        ability: hAbility,
                        attacker: hCaster,
                        victim: hTarget,
                        damage: damage,
                        damage_type: hAbility.GetAbilityDamageType()
                    }
                    BattleHelper.GoApplyDamage(damage_table)
                }

                hAbility.UseResources(true, true, true)
                this.StartIntervalThink(hAbility.GetCooldownTimeRemaining())

                modifier_t16_electricity_touch_particle_electricity_touch.apply(hCaster, hCaster, hAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

                hCaster.EmitSound("Ability.static.start")
            } else {
                this.StartIntervalThink(0)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t16_electricity_touch_debuff extends BaseModifier_Plus {
    armor_reduce: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.armor_reduce = this.GetSpecialValueFor("armor_reduce")
        if (IsServer()) {
            this.IncrementStackCount()
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/t16_electricity_touch_debuff.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        this.armor_reduce = this.GetSpecialValueFor("armor_reduce")
        if (IsServer()) {
            this.IncrementStackCount()
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)

    g_PHYSICAL_ARMOR_BONUS() {
        return -this.armor_reduce * this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return -this.armor_reduce * this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t16_electricity_touch_particle_electricity_touch extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/t16/electricity_touch.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(particleID, 0, (hCaster.GetAbsOrigin() + Vector(0, 0, 96)) as Vector)
            ParticleManager.SetParticleControl(particleID, 1, Vector(radius, 1, 1))
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}