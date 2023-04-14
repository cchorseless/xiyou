import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_centaur_stampede = { "ID": "5517", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES_ENEMIES_NO", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "2", "AbilitySound": "Hero_Centaur.Stampede", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "HasScepterUpgrade": "1", "AbilityCooldown": "90", "AbilityManaCost": "150 200 250", "AbilityModifierSupportValue": "0.2", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "3.5 4 4.5", "LinkedSpecialBonus": "special_bonus_unique_centaur_7" }, "02": { "var_type": "FIELD_INTEGER", "base_damage": "0" }, "03": { "var_type": "FIELD_FLOAT", "strength_damage": "1.5 2.25 3.0", "CalculateSpellDamageTooltip": "1" }, "04": { "var_type": "FIELD_FLOAT", "slow_duration": "2.3" }, "05": { "var_type": "FIELD_INTEGER", "radius": "105" }, "06": { "var_type": "FIELD_INTEGER", "slow_movement_speed": "100" }, "07": { "var_type": "FIELD_INTEGER", "damage_reduction": "40", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_centaur_stampede extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "centaur_stampede";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_centaur_stampede = Data_centaur_stampede;
    Init() {
        this.SetDefaultSpecialValue("damage_per_health", 0.2);
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("strength_damage", [3, 6, 9, 12, 15, 18]);
        this.SetDefaultSpecialValue("width", 600);
        this.SetDefaultSpecialValue("distance", 900);
        this.SetDefaultSpecialValue("slow_movement_speed", 100);
        this.SetDefaultSpecialValue("slow_duration", 2.3);
        this.SetDefaultSpecialValue("bonus_physical_damage", 50);

    }


    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_centaur_custom_3")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vCasterLoc = hCaster.GetAbsOrigin()
        let vCastPoint = this.GetCursorPosition()
        let vDirection = ((vCastPoint - vCasterLoc) as Vector).Normalized()
        let width = this.GetSpecialValueFor("width")
        let distance = this.GetSpecialValueFor("distance")
        let vPoint = vCasterLoc + vDirection * distance
        let duration = this.GetSpecialValueFor("duration")
        let vStartPosition = vCasterLoc - vDirection * width
        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vCasterLoc, width, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
        for (let hTarget of (tTargets)) {
            modifier_centaur_6_buff.apply(hTarget, hCaster, this, { duration: duration })
        }

        let info: CreateLinearProjectileOptions = {
            EffectName: "",
            Ability: this,
            vSpawnOrigin: vStartPosition as Vector,
            fDistance: distance + width / 2,
            vVelocity: (vDirection * (distance + width / 2)) as Vector,
            fStartRadius: width,
            fEndRadius: width,
            Source: hCaster,
            iUnitTargetTeam: this.GetAbilityTargetTeam(),
            iUnitTargetType: this.GetAbilityTargetType(),
            iUnitTargetFlags: this.GetAbilityTargetFlags(),
            fExpireTime: GameRules.GetGameTime() + 1
        }
        ProjectileManager.CreateLinearProjectile(info)
        modifier_centaur_6_particle_start.applyThinker(vCastPoint, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Centaur.Stampede.Cast", hCaster))
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (hTarget != null) {
            let hCaster = this.GetCasterPlus()
            let iDamage = this.GetSpecialValueFor("strength_damage") * hCaster.GetStrength()
            let slow_duration = this.GetSpecialValueFor("slow_duration")

            let damage_table = {
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: iDamage,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(damage_table)
            if (hCaster.HasScepter()) {
                modifier_centaur_6_bonus_physical_damage.apply(hTarget, hCaster, this, { duration: slow_duration })
            }
            modifier_centaur_6_slow.apply(hTarget, hCaster, this, { duration: slow_duration })
        }
    }

    GetAOERadius() {
        return this.GetSpecialValueFor("width")
    }
    GetIntrinsicModifierName() {
        return "modifier_centaur_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_centaur_6 extends BaseModifier_Plus {
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let caster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let start_width = ability.GetSpecialValueFor("width")
            let end_width = ability.GetSpecialValueFor("width")

            let position = AoiHelper.GetLinearMostTargetsPosition(caster.GetAbsOrigin(), range - start_width, caster.GetTeamNumber(), start_width, end_width, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)

            if (position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
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
export class modifier_centaur_6_slow extends BaseModifier_Plus {
    slow_movement_speed: number;
    IsHidden() {
        return true
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
    Init(params: IModifierTable) {
        this.slow_movement_speed = this.GetSpecialValueFor("slow_movement_speed")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return -this.slow_movement_speed
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_centaur_6_bonus_physical_damage extends BaseModifier_Plus {
    bonus_physical_damage: any;
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
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.bonus_physical_damage = this.GetSpecialValueFor("bonus_physical_damage")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip(params: IModifierTable) {
        return this.bonus_physical_damage
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
    G_INCOMING_PHYSICAL_DAMAGE_PERCENTAGE() {
        return this.bonus_physical_damage
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_centaur_6_buff extends BaseModifier_Plus {
    damage_per_health: number;
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
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW
    }
    ShouldUseOverheadOffset() {
        return true
    }
    BeCreated(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.damage_per_health = this.GetSpecialValueFor("damage_per_health") + hCaster.GetTalentValue("special_bonus_unique_centaur_custom_8")

        if (IsServer()) {
            this.SetStackCount(this.damage_per_health * this.GetCasterPlus().GetMaxHealth())
        }
        else {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_centaur/centaur_stampede_overhead.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: this.GetEffectAttachType(),
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, false, -1, false, this.ShouldUseOverheadOffset())
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        return this.GetStackCount()
    }
}

// 特效
@registerModifier()
export class modifier_centaur_6_particle_start extends modifier_particle_thinker {
    BeCreated(params: IModifierTable) {

        let distance = this.GetSpecialValueFor("distance")

        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let vCasterLoc = hCaster.GetAbsOrigin()
            let vCastPoint = hParent.GetAbsOrigin()
            let vDirection = ((vCastPoint - vCasterLoc) as Vector).Normalized()
            let vPoint = (vCasterLoc + vDirection * distance) as Vector

            let particleID = ResHelper.CreateParticle({
                resPath: "particles/particle_sr/centaur/centaur_3.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(particleID, 2, (hCaster), ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, vCasterLoc, true)
            ParticleManager.SetParticleControl(particleID, 0, vCasterLoc)
            ParticleManager.SetParticleControlForward(particleID, 0, vDirection)
            ParticleManager.SetParticleControl(particleID, 1, vPoint)
            ParticleManager.SetParticleControlForward(particleID, 3, vDirection)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }

}
