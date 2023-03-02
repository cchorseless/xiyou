
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";

/** dota原技能数据 */
export const Data_vengefulspirit_magic_missile = { "ID": "5122", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_VengefulSpirit.MagicMissile", "AbilityCastRange": "575 600 625 650", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "12 11 10 9", "AbilityManaCost": "100 110 120 130", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "magic_missile_speed": "1350" }, "02": { "var_type": "FIELD_FLOAT", "magic_missile_stun": "1.4 1.5 1.6 1.7" }, "03": { "var_type": "FIELD_INTEGER", "magic_missile_damage": "90 180 270 360", "LinkedSpecialBonus": "special_bonus_unique_vengeful_spirit_1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_vengefulspirit_magic_missile extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "vengefulspirit_magic_missile";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_vengefulspirit_magic_missile = Data_vengefulspirit_magic_missile;
    Init() {
        this.SetDefaultSpecialValue("magic_missile_speed", 1200);
        this.SetDefaultSpecialValue("magic_missile_stun_duration", [1.4, 1.5, 1.6, 1.7, 1.8, 2.0]);
        this.SetDefaultSpecialValue("magic_missile_damage", [900, 1200, 1500, 2000, 2500, 3500]);
        this.SetDefaultSpecialValue("agi_factor", [1, 1.5, 2, 2.5, 3, 4]);
        this.SetDefaultSpecialValue("distance", 1000);
        this.SetDefaultSpecialValue("magic_missile_width", 100);

    }

    Init_old() {
        this.SetDefaultSpecialValue("magic_missile_speed", 900);
        this.SetDefaultSpecialValue("magic_missile_stun_duration", [1.4, 1.5, 1.6, 1.7, 1.8, 2.0]);
        this.SetDefaultSpecialValue("magic_missile_damage", [900, 1200, 1500, 2000, 2500, 3500]);
        this.SetDefaultSpecialValue("agi_factor", [1, 1.5, 2, 2.5, 3, 4]);
        this.SetDefaultSpecialValue("distance", 1200);
        this.SetDefaultSpecialValue("magic_missile_width", 100);

    }

    nProjID: ProjectileID;
    magic_missile_speed: number;
    magic_missile_width: number;

    OnSpellStart() {
        let vPosition = this.GetCursorPosition()
        this.SpellStart1(vPosition)
    }
    SpellStart1(vPosition: Vector) {
        let hCaster = this.GetCasterPlus()
        let distance = this.GetSpecialValueFor("distance") + hCaster.GetCastRangeBonus()
        this.magic_missile_speed = this.GetSpecialValueFor("magic_missile_speed")
        this.magic_missile_width = this.GetSpecialValueFor("magic_missile_width")
        let tInfo = {
            Ability: this,
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_vengefulspirit/vengeful_magic_missle.vpcf", hCaster),
            vSpawnOrigin: hCaster.GetAbsOrigin(),
            fDistance: distance,
            vVelocity: ((vPosition - hCaster.GetAbsOrigin()) as Vector).Normalized() * this.magic_missile_speed as Vector,
            fStartRadius: this.magic_missile_width,
            fEndRadius: this.magic_missile_width,
            Source: hCaster,
            bHasFrontalCone: false,
            bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            bProvidesVision: true,
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            iVisionRadius: 0,
        }
        this.nProjID = ProjectileManager.CreateLinearProjectile(tInfo)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_VengefulSpirit.MagicMissile", hCaster))
    }
    OnProjectileHit(hTarget: IBaseNpc_Plus, vLocation: Vector) {
        let hCaster = this.GetCasterPlus() as BaseNpc_Hero_Plus
        if (GFuncEntity.IsValid(hTarget) && hTarget.IsAlive()) {
            let damage = this.GetSpecialValueFor("magic_missile_damage")
            let agi_factor = this.GetSpecialValueFor("agi_factor")
            let magic_missile_stun_duration = this.GetSpecialValueFor("magic_missile_stun_duration") + hCaster.GetTalentValue("special_bonus_unique_vengefulspirit_custom_1")
            let fDamage = damage + (hCaster.GetAgility && hCaster.GetAgility() * agi_factor || 0)
            let tDamageTable = {
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(tDamageTable)
            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_VengefulSpirit.MagicMissileImpact", hCaster), hCaster)
            modifier_stunned.apply(hTarget, hCaster, this, { duration: magic_missile_stun_duration * hTarget.GetStatusResistanceFactor(hCaster) })
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_vengefulspirit_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
// Modifiers
@registerModifier()
export class modifier_vengefulspirit_1 extends BaseModifier_Plus {
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
            let hAbility = this.GetAbilityPlus()
            if (!GFuncEntity.IsValid(hAbility)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = hAbility.GetCasterPlus()

            if (!hAbility.GetAutoCastState()) {
                return
            }

            if (hCaster.IsTempestDouble()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!hAbility.IsAbilityReady()) {
                return
            }

            let start_width = hAbility.GetSpecialValueFor("magic_missile_width")
            let end_width = hAbility.GetSpecialValueFor("magic_missile_width")
            let range = hAbility.GetCastRange(hCaster.GetAbsOrigin(), null) + hCaster.GetCastRangeBonus()

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
