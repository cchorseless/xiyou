import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_dummy } from "../../../modifier/modifier_dummy";
import { modifier_puck_3 } from "./ability3_puck_phase_shift";
/** dota原技能数据 */
export const Data_puck_illusory_orb = { "ID": "5069", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Puck.Illusory_Orb", "AbilityCastPoint": "0.1 0.1 0.1 0.1", "AbilityCastRange": "3000", "AbilityCooldown": "13 12 11 10", "AbilityDamage": "75 150 225 300", "AbilityManaCost": "80 100 120 140", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "225" }, "02": { "var_type": "FIELD_INTEGER", "max_distance": "1950", "LinkedSpecialBonus": "special_bonus_unique_puck", "LinkedSpecialBonusOperation": "SPECIAL_BONUS_PERCENTAGE_ADD" }, "03": { "var_type": "FIELD_INTEGER", "orb_speed": "651", "LinkedSpecialBonus": "special_bonus_unique_puck", "LinkedSpecialBonusOperation": "SPECIAL_BONUS_PERCENTAGE_ADD" }, "04": { "var_type": "FIELD_INTEGER", "orb_vision": "450" }, "05": { "var_type": "FIELD_FLOAT", "vision_duration": "3.34" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_puck_illusory_orb extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "puck_illusory_orb";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_puck_illusory_orb = Data_puck_illusory_orb;
    Init() {
        this.SetDefaultSpecialValue("orb_count", 5);
        this.SetDefaultSpecialValue("orbs_angle", 75);
        this.SetDefaultSpecialValue("radius", 225);
        this.SetDefaultSpecialValue("max_distance", 1300);
        this.SetDefaultSpecialValue("orb_speed", 650);
        this.SetDefaultSpecialValue("damage", [600, 1000, 1500, 2000, 2700, 3500]);
        this.SetDefaultSpecialValue("stack_duration", 10);
        this.SetDefaultSpecialValue("damage_int_factor_per_stack", 2);

    }


    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_unique_puck_custom_7")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()

        let orb_count = this.GetSpecialValueFor("orb_count") + hCaster.GetTalentValue("special_bonus_unique_puck_custom_1")
        let orbs_angle = this.GetSpecialValueFor("orbs_angle")
        let radius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("duration")
        let max_distance = this.GetSpecialValueFor("max_distance")
        let orb_speed = this.GetSpecialValueFor("orb_speed")

        let vStartPosition = hCaster.GetAbsOrigin()
        let vDirection = (vPosition - vStartPosition) as Vector
        vDirection.z = 0
        if (vDirection == Vector(0, 0, 0)) {
            vDirection = hCaster.GetForwardVector()
            vDirection.z = 0
        } else {
            vDirection = vDirection.Normalized()
        }

        for (let i = 1; i <= orb_count; i++) {
            let hDummy = modifier_dummy.applyThinker(vStartPosition, hCaster, this, null, hCaster.GetTeamNumber(), false)
            let sSoundName = ResHelper.GetSoundReplacement("Hero_Puck.Illusory_Orb", hCaster)
            hDummy.EmitSound(sSoundName)

            let _vDirection = RotatePosition(Vector(0, 0, 0), QAngle(0, (orbs_angle / orb_count) * (i - 1) - orbs_angle / 2, 0), vDirection)
            let tInfo = {
                Source: hCaster,
                Ability: this,
                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_puck/puck_illusory_orb.vpcf", hCaster),
                vSpawnOrigin: vStartPosition,
                fDistance: max_distance,
                fStartRadius: radius,
                fEndRadius: radius,
                vVelocity: (_vDirection * orb_speed) as Vector,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                fExpireTime: GameRules.GetGameTime() + 10,
                ExtraData: {
                    dummy_entindex: hDummy.entindex(),
                    sound_name: sSoundName,
                }
            }
            ProjectileManager.CreateLinearProjectile(tInfo)
        }

    }
    OnProjectileThink_ExtraData(vLocation: Vector, ExtraData: any) {
        let hDummy = EntIndexToHScript(ExtraData.dummy_entindex || -1)
        if (GameFunc.IsValid(hDummy)) {
            hDummy.SetAbsOrigin(vLocation)
        }
    }
    OnProjectileHit_ExtraData(hTarget: BaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus()

        if (GameFunc.IsValid(hTarget)) {
            let damage = this.GetSpecialValueFor("damage")
            let stack_duration = this.GetSpecialValueFor("stack_duration")
            let damage_int_factor_per_stack = this.GetSpecialValueFor("damage_int_factor_per_stack") + hCaster.GetTalentValue("special_bonus_unique_puck_custom_5")

            let hModifier = modifier_puck_1_debuff.findIn(hTarget) as modifier_puck_1_debuff;
            let iStackCount = GameFunc.IsValid(hModifier) && hModifier.GetStackCount() || 0
            let iInt = type(hCaster.GetIntellect) == "function" && hCaster.GetIntellect() || 0
            let fDamage = damage + iInt * iStackCount * damage_int_factor_per_stack

            BattleHelper.GoApplyDamage({
                ability: this,
                victim: hTarget,
                attacker: hCaster,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType(),
            })

            modifier_puck_1_debuff.apply(hTarget, hCaster, this, { duration: stack_duration })
            if (hCaster.HasScepter()) {
                let buff = modifier_puck_3.findIn(hCaster) as modifier_puck_3;
                if (buff) {
                    buff.Process(hCaster, hCaster)
                }
            }

            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Puck.IIllusory_Orb_Damage", hCaster), hCaster)

            return false
        }

        let hDummy = EntIndexToHScript(ExtraData.dummy_entindex || -1) as BaseNpc_Plus
        if (GameFunc.IsValid(hDummy)) {
            hDummy.StopSound(ExtraData.sound_name)
            modifier_dummy.remove(hDummy);
        }

        return true
    }


    GetIntrinsicModifierName() {
        return "modifier_puck_1"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_puck_1 extends BaseModifier_Plus {
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
            let start_width = ability.GetSpecialValueFor("radius")
            let end_width = ability.GetSpecialValueFor("radius")

            let position = AoiHelper.GetLinearMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), start_width, end_width, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)

            if (position && position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_puck_1_debuff extends BaseModifier_Plus {
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
        if (IsServer()) {

            this.IncrementStackCount()
            this.addTimer(params.duration, () => { })
            this.DecrementStackCount()
        }
    }

}
