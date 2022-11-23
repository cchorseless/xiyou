import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { ability3_earthshaker_aftershock } from "./ability3_earthshaker_aftershock";
/** dota原技能数据 */
export const Data_earthshaker_fissure = { "ID": "5023", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_EarthShaker.Fissure", "HasShardUpgrade": "1", "AbilityCastRange": "1400", "AbilityCastPoint": "0.69 0.69 0.69 0.69", "AbilityCooldown": "21 19 17 15", "AbilityDamage": "110 160 210 260", "AbilityManaCost": "110 130 150 170", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "fissure_range": "1400", "LinkedSpecialBonus": "special_bonus_unique_earthshaker_3" }, "02": { "var_type": "FIELD_FLOAT", "fissure_duration": "6.5 7 7.5 8.0" }, "03": { "var_type": "FIELD_INTEGER", "fissure_radius": "225" }, "04": { "var_type": "FIELD_FLOAT", "stun_duration": "1.0 1.25 1.5 1.75" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_earthshaker_fissure extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "earthshaker_fissure";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_earthshaker_fissure = Data_earthshaker_fissure;
    Init() {
        this.SetDefaultSpecialValue("fissure_range", 1400);
        this.SetDefaultSpecialValue("fissure_duration", 3);
        this.SetDefaultSpecialValue("fissure_radius", 225);
        this.SetDefaultSpecialValue("stun_duration", [1.0, 1.25, 1.5, 1.75, 2, 2.25]);
        this.SetDefaultSpecialValue("damage", [1000, 2000, 3000, 4000, 5000, 6000]);
        this.SetDefaultSpecialValue("damage_per_str", [4, 4, 6, 6, 8, 8]);
        this.SetDefaultSpecialValue("scepter_fissure_range", 1800);
        this.SetDefaultSpecialValue("shard_cool_down", 2);

    }

    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_fissure_range")
        }
        return this.GetSpecialValueFor("fissure_range")
    }
    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasShard()) {
            return super.GetCooldown(iLevel) - this.GetSpecialValueFor("shard_cool_down")
        }
        return super.GetCooldown(iLevel)
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let fissure_range = this.GetCastRange(hCaster.GetAbsOrigin(), null) + hCaster.GetCastRangeBonus()
        let fissure_duration = this.GetSpecialValueFor("fissure_duration") + hCaster.GetTalentValue("special_bonus_unique_earthshaker_custom_2")
        let fissure_radius = this.GetSpecialValueFor("fissure_radius")
        let stun_duration = this.GetSpecialValueFor("stun_duration")
        let damage = this.GetSpecialValueFor("damage")
        let damage_per_str = this.GetSpecialValueFor("damage_per_str")
        let distance_between_blocker = 24
        let blocker_collision = 24
        let vStartPosition = hCaster.GetAbsOrigin()
        let vTargetPosition = this.GetCursorPosition()
        let vDirection = (vTargetPosition - vStartPosition) as Vector
        vDirection.z = 0
        vStartPosition = GetGroundPosition((vStartPosition + vDirection.Normalized() * distance_between_blocker * 2) as Vector, hCaster)
        vTargetPosition = GetGroundPosition((vStartPosition + vDirection.Normalized() * (fissure_range - distance_between_blocker * 2)) as Vector, hCaster)
        fissure_range = fissure_range - distance_between_blocker * 2

        let iStr = hCaster.GetStrength != null && hCaster.GetStrength() || 0
        let fDamage = damage + damage_per_str * iStr

        let tTargets = FindUnitsInLine(hCaster.GetTeamNumber(), vStartPosition, vTargetPosition, null, fissure_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE)
        for (let hTarget of (tTargets as BaseNpc_Plus[])) {
            modifier_earthshaker_1_stun.apply(hTarget, hCaster, this, { duration: stun_duration * hTarget.GetStatusResistanceFactor(hCaster) })
            BattleHelper.GoApplyDamage({
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType(),
            })
        }
        modifier_earthshaker_1_thinker.applyThinker(((vStartPosition + vTargetPosition) / 2) as Vector, hCaster, this, {
            duration: fissure_duration,
            vStartPosition: GameFunc.VectorFunctions.VectorToString(vStartPosition),
            vTargetPosition: GameFunc.VectorFunctions.VectorToString(vTargetPosition),
        }, hCaster.GetTeamNumber(), false)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthShaker.Fissure.Cast", hCaster))
        EmitSoundOnLocationWithCaster(((vStartPosition + vTargetPosition) / 2) as Vector, ResHelper.GetSoundReplacement("Hero_EarthShaker.Fissure", hCaster), hCaster)
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_earthshaker_1"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_earthshaker_1 extends BaseModifier_Plus {
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hAbility)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = hAbility.GetCasterPlus()

            if (!hAbility.GetAutoCastState()) {
                return
            }

            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!hAbility.IsAbilityReady()) {
                return
            }

            let range = hAbility.GetCastRange(hCaster.GetAbsOrigin(), null) + hCaster.GetCastRangeBonus()
            let start_width = hAbility.GetSpecialValueFor("fissure_radius")
            let end_width = hAbility.GetSpecialValueFor("fissure_radius")

            let vPosition = AoiHelper.GetLinearMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), start_width, end_width, null, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)

            if (vPosition != vec3_invalid && hCaster.IsPositionInRange(vPosition, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: hAbility.entindex(),
                    Position: vPosition
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earthshaker_1_stun extends BaseModifier_Plus {
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
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_stunned.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: this.GetEffectAttachType(),
                owner: this.GetParentPlus()
            });
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_DISABLED
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earthshaker_1_thinker extends BaseModifier_Plus {
    fissure_range: any;
    blocker_collision: number;
    vStartPosition: Vector;
    vTargetPosition: Vector;
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
        return true
    }
    GetAuraRadius() {
        return this.fissure_range
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }
    GetAuraDuration() {
        return 0.25
    }
    GetAura() {
        return "modifier_earthshaker_1_root"
    }
    GetAuraEntityReject(hTarget: BaseNpc_Plus) {
        if (CalcDistanceToLineSegment2D(hTarget.GetAbsOrigin(), this.vStartPosition, this.vTargetPosition) <= this.blocker_collision + hTarget.GetHullRadius()) {
            return false
        }
        return true
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        this.blocker_collision = 64
        this.fissure_range = this.GetAbilityPlus().GetCastRange(hCaster.GetAbsOrigin(), null) + hCaster.GetCastRangeBonus()
        if (IsServer()) {
            this.vStartPosition = GameFunc.VectorFunctions.StringToVector(params.vStartPosition)
            this.vTargetPosition = GameFunc.VectorFunctions.StringToVector(params.vTargetPosition)
            LogHelper.print(params, this.vStartPosition, this.vTargetPosition, 1)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earthshaker/earthshaker_fissure.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            });
            ParticleManager.SetParticleControl(iParticleID, 0, this.vStartPosition)
            ParticleManager.SetParticleControl(iParticleID, 1, this.vTargetPosition)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(params.duration, 0, 1))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
        else {
            LogHelper.print(params)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            EmitSoundOnLocationWithCaster(this.vStartPosition, ResHelper.GetSoundReplacement("Hero_EarthShaker.FissureDestroy", hCaster), hCaster)
            EmitSoundOnLocationWithCaster(this.vTargetPosition, ResHelper.GetSoundReplacement("Hero_EarthShaker.FissureDestroy", hCaster), hCaster)
            EmitSoundOnLocationWithCaster(((this.vStartPosition + this.vTargetPosition) / 2) as Vector, ResHelper.GetSoundReplacement("Hero_EarthShaker.FissureDestroy", hCaster), hCaster)
            if (GameFunc.IsValid(hParent)) {
                UTIL_Remove(hParent)
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    OnAbilityExecuted(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hCaster)) {
            this.Destroy()
            return
        }
        if (hCaster.HasShard() && params.unit != null && params.unit == hCaster && params.ability != null && !params.ability.IsItem() && params.ability.ProcsMagicStick() && params.unit.IsAlive()) {
            let hAbility4 = hCaster.FindAbilityByName('ability3_earthshaker_aftershock') as ability3_earthshaker_aftershock;
            if (GameFunc.IsValid(hAbility4) && hAbility4.GetLevel() >= 1 && !hCaster.PassivesDisabled()) {
                let aftershock_range = hAbility4.GetSpecialValueFor("aftershock_range")
                let tTargets = FindUnitsInLine(hCaster.GetTeamNumber(), this.vStartPosition, this.vTargetPosition, null, aftershock_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE)
                let count = math.floor(((this.vTargetPosition - this.vStartPosition) as Vector).Length2D() / 128)
                let vDir = ((this.vTargetPosition - this.vStartPosition) as Vector).Normalized()
                let tPos = [] as Vector[]
                for (let i = 1; i <= count; i++) {
                    let vPos = this.vStartPosition + vDir * i * 128
                    table.insert(tPos, vPos)
                }
                if (hAbility4.ShardTriggerAfterShock) {
                    hAbility4.ShardTriggerAfterShock(tTargets, tPos)
                }
            }
        }
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earthshaker_1_root extends BaseModifier_Plus {
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
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
    }
}
