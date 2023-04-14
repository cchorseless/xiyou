
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_windrunner_powershot = { "ID": "5131", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_CHANNELLED", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Ability.Powershot", "HasShardUpgrade": "1", "AbilityCastRange": "2600", "AbilityCastPoint": "0.0", "AbilityCooldown": "12 11 10 9", "AbilityChannelTime": "1.0", "AbilityManaCost": "90 100 110 120", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "powershot_damage": "150 250 350 450", "LinkedSpecialBonus": "special_bonus_unique_windranger_3" }, "02": { "var_type": "FIELD_INTEGER", "damage_reduction": "20", "CalculateSpellDamageTooltip": "0" }, "03": { "var_type": "FIELD_INTEGER", "arrow_width": "125 125 125 125" }, "04": { "var_type": "FIELD_INTEGER", "arrow_range": "2600" }, "05": { "var_type": "FIELD_FLOAT", "arrow_speed": "3000.0 3000.0 3000.0 3000.0" }, "06": { "var_type": "FIELD_FLOAT", "tree_width": "75 75 75 75" }, "07": { "var_type": "FIELD_INTEGER", "vision_radius": "400" }, "08": { "var_type": "FIELD_FLOAT", "vision_duration": "3.34 3.34 3.34 3.34" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_windrunner_powershot extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "windrunner_powershot";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_windrunner_powershot = Data_windrunner_powershot;
    Init() {
        this.SetDefaultSpecialValue("powershot_damage", [110, 130, 160, 200, 250, 300]);
        this.SetDefaultSpecialValue("amplify_damage", [400, 800, 1200, 1800, 2400, 4000]);
        this.SetDefaultSpecialValue("arrow_width", 125);
        this.SetDefaultSpecialValue("arrow_range", 1300);
        this.SetDefaultSpecialValue("arrow_speed", 3000);
        this.SetDefaultSpecialValue("duration", 10);
        this.SetDefaultSpecialValue("extra_count", 4);
        this.SetDefaultSpecialValue("extra_angle", 15);

    }

    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_windrunner_custom_2")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPoint = this.GetCursorPosition()
        let duration = this.GetSpecialValueFor("duration")
        modifier_windrunner_2_buff_attack.apply(hCaster, hCaster, this, { duration: duration })
        EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), ResHelper.GetSoundReplacement("Ability.PowershotPull", hCaster), hCaster)
        let iDamage = this.GetSpecialValueFor("powershot_damage")
        let sProjectileName = ResHelper.GetParticleReplacement("particles/units/heroes/hero_windrunner/windrunner_spell_powershot.vpcf", hCaster)
        let arrow_speed = this.GetSpecialValueFor("arrow_speed")
        let arrow_range = this.GetSpecialValueFor("arrow_range")
        let arrow_width = this.GetSpecialValueFor("arrow_width")
        let vStartPosition = hCaster.GetAbsOrigin()
        let vDirection = ((vPoint - vStartPosition) as Vector).Normalized()

        let tInfo = {
            Source: hCaster,
            Ability: this,
            vSpawnOrigin: vStartPosition,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            EffectName: sProjectileName,
            fDistance: arrow_range,
            fStartRadius: arrow_width,
            fEndRadius: arrow_width,
            vVelocity: (vDirection * arrow_speed) as Vector,
        }
        let iProjectile = ProjectileManager.CreateLinearProjectile(tInfo)
        if (hCaster.HasShard()) {
            let extra_count = this.GetSpecialValueFor("extra_count")
            let extra_angle = this.GetSpecialValueFor("extra_angle")
            for (let i = 0; i <= extra_count - 1; i++) {
                let x = (i % 2 == 0) && 1 || -1
                let y = math.floor(i / 2) + 1
                tInfo.vVelocity = (GFuncVector.Rotation2D(vDirection, math.rad(extra_angle * x * y)) * arrow_speed) as Vector
                ProjectileManager.CreateLinearProjectile(tInfo)
            }
        }

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Ability.Powershot", hCaster))
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, extraData: any) {
        if (!IsValid(hTarget)) {
            return
        }
        let hCaster = this.GetCasterPlus()
        hTarget.EmitSound(ResHelper.GetSoundReplacement("Hero_Windrunner.PowershotDamage", hCaster))
        modifier_windrunner_2_buff.apply(hCaster, hCaster, this, null)
        let iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB +
            BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS +
            BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN +
            BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE +
            BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS +
            BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE +
            BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK +
            BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING
        if (hCaster.HasTalent("special_bonus_unique_windrunner_custom_4")) {
            iAttackState = iAttackState - BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB - BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS
        }
        BattleHelper.Attack(hCaster, hTarget, iAttackState)
        modifier_windrunner_2_buff.remove(hCaster);
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_windrunner_2"
    // }


}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers

@registerModifier()
export class modifier_windrunner_2 extends BaseModifier_Plus {
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
            if (!IsValid(hAbility)) {
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
            let arrow_width = hAbility.GetSpecialValueFor("arrow_width")
            let vPosition = AoiHelper.GetLinearMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), arrow_width, arrow_width, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)

            //  优先攻击目标
            let target = hCaster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
            if (target != null && !target.IsPositionInRange(hCaster.GetAbsOrigin(), range)) {
                target = null
            }
            if (target != null) {
                vPosition = target.GetAbsOrigin()
            }

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
// Modifiers
@registerModifier()
export class modifier_windrunner_2_buff extends BaseModifier_Plus {
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
    powershot_damage: number;
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.powershot_damage = this.GetSpecialValueFor("powershot_damage") + hCaster.GetTalentValue("special_bonus_unique_windrunner_custom_7")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetModifierDamageOutgoing_Percentage() {
        return this.powershot_damage
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_windrunner_2_buff_attack extends BaseModifier_Plus {
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
    amplify_damage: number;
    Init(params: IModifierTable) {
        this.amplify_damage = this.GetSpecialValueFor("amplify_damage")
        if (IsServer()) {
            this.IncrementStackCount()
            this.addTimer(params.duration, () => {
                this.DecrementStackCount()
            })
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage() {
        return this.amplify_damage * this.GetStackCount()
    }
}