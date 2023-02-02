
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionVertical_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { ability3_lion_mana_drain } from "./ability3_lion_mana_drain";

/** dota原技能数据 */
export const Data_lion_impale = { "ID": "5044", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_Lion.Impale", "AbilityCastRange": "575", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "12.0 12.0 12.0 12.0", "AbilityManaCost": "70 100 130 160", "AbilityDamage": "80 140 200 260", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "width": "125 125 125 125" }, "02": { "var_type": "FIELD_FLOAT", "duration": "1.4 1.8 2.2 2.6" }, "03": { "var_type": "FIELD_INTEGER", "length_buffer": "325" }, "04": { "var_type": "FIELD_INTEGER", "speed": "1600 1600 1600 1600" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_lion_impale extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lion_impale";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lion_impale = Data_lion_impale;
    Init() {
        this.SetDefaultSpecialValue("width", 175);
        this.SetDefaultSpecialValue("duration", [1.4, 1.8, 2.2, 2.6, 2.8, 3.0]);
        this.SetDefaultSpecialValue("length_buffer", 0);
        this.SetDefaultSpecialValue("speed", 1600);
        this.SetDefaultSpecialValue("damage", [80, 365, 704, 1328, 1952, 2576]);
        this.SetDefaultSpecialValue("damage_per_mana", 75);
        this.SetDefaultSpecialValue("bonus_cast_count", 2);
        this.SetDefaultSpecialValue("cast_interval", 1);

    }

    Impale(vStartPosition: Vector, vTargetPosition: Vector) {
        let hCaster = this.GetCasterPlus()

        let speed = this.GetSpecialValueFor("speed")
        let width = this.GetSpecialValueFor("width")
        let length_buffer = this.GetSpecialValueFor("length_buffer")
        let length = this.GetCastRange(vTargetPosition, null) + hCaster.GetCastRangeBonus() + length_buffer
        let vDirection = (vTargetPosition - vStartPosition) as Vector
        vDirection.z = 0
        modifier_lion_1_particle_staff.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_lion/lion_spell_impale_ground.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControlForward(iParticleID, 0, vDirection.Normalized())
        ParticleManager.SetParticleControl(iParticleID, 0, vStartPosition)
        ParticleManager.SetParticleControl(iParticleID, 1, (vStartPosition + vDirection.Normalized() * length) as Vector)
        ParticleManager.SetParticleControl(iParticleID, 2, Vector(1, 1, 1))
        ParticleManager.ReleaseParticleIndex(iParticleID)

        let tInfo = {
            Ability: this,
            Source: hCaster,
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_lion/lion_spell_impale.vpcf", hCaster),
            //  EffectName : "",
            vSpawnOrigin: vStartPosition,
            vVelocity: (vDirection.Normalized() * speed) as Vector,
            fDistance: length,
            fStartRadius: width,
            fEndRadius: width,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
        }
        ProjectileManager.CreateLinearProjectile(tInfo)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Lion.Impale", hCaster))
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Lion.Impale.Projectile", hCaster))
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()

        let vStartPosition = hCaster.GetAbsOrigin()
        let vTargetPosition = this.GetCursorPosition()
        let bonus_cast_count = this.GetSpecialValueFor("bonus_cast_count")
        let cast_interval = this.GetSpecialValueFor("cast_interval")
        if (this.GetCursorTarget()) {
            vTargetPosition = this.GetCursorTarget().GetAbsOrigin()
        }

        this.Impale(vStartPosition, vTargetPosition)
        if (hCaster.HasShard()) {
            for (let i = 1; i <= bonus_cast_count; i++) {
                hCaster.addTimer(cast_interval * i, () => {
                    this.Impale(vStartPosition, vTargetPosition)
                })
            }
        }
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (hTarget != null) {
            if (hTarget.TriggerSpellAbsorb(this)) {
                return
            }
            let hCaster = this.GetCasterPlus()
            let air_time = 0.5
            let duration = this.GetSpecialValueFor("duration") - air_time
            modifier_lion_1_debuff.apply(hTarget, hCaster, this, { duration: air_time + duration * hTarget.GetStatusResistanceFactor(hCaster) })
            modifier_lion_1_motion.remove(hTarget);
            modifier_lion_1_motion.apply(hTarget, hCaster, this, { duration: air_time + duration * hTarget.GetStatusResistanceFactor(hCaster) })
            modifier_lion_1_particle_spikes.apply(hTarget, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Lion.ImpaleHitTarget", hCaster), hCaster)
            let hAbility4 = ability3_lion_mana_drain.findIn(hCaster)
            if (GameFunc.IsValid(hAbility4) && hAbility4.GetTargetMana != null) {
                hAbility4.GetTargetMana(hTarget)
            }
        }
        return false
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_lion_1"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lion_1 extends BaseModifier_Plus {
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            let start_width = ability.GetSpecialValueFor("width")
            let end_width = ability.GetSpecialValueFor("width")

            let position = AoiHelper.GetLinearMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), start_width, end_width, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)

            if (position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: hCaster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        AbilityIndex: ability.entindex(),
                        Position: position
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lion_1_debuff extends BaseModifier_Plus {
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return true
    }
    AllowIllusionDuplicate() {
        return false
    }
    GetEffectName() {
        return "particles/generic_gameplay/generic_stunned.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    goverrideAnimation() {
        return GameActivity_t.ACT_DOTA_DISABLED
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lion_1_motion extends BaseModifierMotionVertical_Plus {
    damage: number;
    damage_per_mana: number;
    damage_type: DAMAGE_TYPES;
    fMotionDuration: number;
    fHeight: number;
    fTime: number;
    vAcceleration: number;
    vStartVerticalVelocity: number;
    IsHidden() {
        return true
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return true
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        this.damage = this.GetSpecialValueFor("damage")
        this.damage_per_mana = this.GetSpecialValueFor("damage_per_mana")
        if (IsServer()) {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
            this.fMotionDuration = 0.5
            this.fHeight = 300
            if (this.ApplyVerticalMotionController()) {
                this.fTime = 0
                let fHeightDifference = this.fHeight - (this.GetParentPlus().GetAbsOrigin()).z
                this.vAcceleration = -this.GetParentPlus().GetUpVector() * 10000
                this.vStartVerticalVelocity = Vector(0, 0, fHeightDifference) / this.fMotionDuration - this.vAcceleration * this.fMotionDuration / 2
            } else {
                this.Destroy()
            }
        }
    }

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            hParent.RemoveVerticalMotionController(this)
            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
                return
            }
            let tDamageTable = {
                ability: hAbility,
                attacker: hCaster,
                victim: hParent,
                damage: this.damage + hCaster.GetMaxMana() * this.damage_per_mana * 0.01,
                damage_type: this.damage_type
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        }
    }
    OnVerticalMotionInterrupted() {
        if (IsServer()) {
            this.Destroy()
        }
    }
    UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.fTime = this.fTime + dt
            me.SetAbsOrigin((me.GetAbsOrigin() + (this.vAcceleration * this.fTime + this.vStartVerticalVelocity) * dt) as Vector)
            if (this.fTime > this.fMotionDuration) {
                EmitSoundOnLocationWithCaster(me.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Lion.ImpaleTargetLand", this.GetCasterPlus()), this.GetCasterPlus())
                this.Destroy()
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    G_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_FLAIL
    }
}
//  Particle
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lion_1_particle_staff extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lion/lion_spell_impale_staff.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lion_1_particle_spikes extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lion/lion_spell_impale_hit_spikes.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 2, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
