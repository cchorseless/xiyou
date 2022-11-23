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
import { ability3_lina_fiery_soul, modifier_lina_3_fiery_soul } from "./ability3_lina_fiery_soul";
/** dota原技能数据 */
export const Data_lina_dragon_slave = { "ID": "5040", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Lina.DragonSlave", "AbilityCastRange": "1075", "AbilityCastPoint": "0.45", "AbilityCooldown": "8", "AbilityDuration": "0.6875 0.6875 0.6875 0.6875", "AbilityDamage": "85 160 235 310", "AbilityManaCost": "100 115 130 145", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "dragon_slave_speed": "1200" }, "02": { "var_type": "FIELD_INTEGER", "dragon_slave_width_initial": "275" }, "03": { "var_type": "FIELD_INTEGER", "dragon_slave_width_end": "200" }, "04": { "var_type": "FIELD_INTEGER", "dragon_slave_distance": "1075" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_lina_dragon_slave extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lina_dragon_slave";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lina_dragon_slave = Data_lina_dragon_slave;
    Init() {
        this.SetDefaultSpecialValue("dragon_slave_speed", 1200);
        this.SetDefaultSpecialValue("dragon_slave_width_initial", 275);
        this.SetDefaultSpecialValue("dragon_slave_width_end", 200);
        this.SetDefaultSpecialValue("dragon_slave_distance", 1300);
        this.SetDefaultSpecialValue("chance_scepter", 50);

    }


    DragonSlave(vStartPosition: Vector, vTargetPosition: Vector, bScepterMultiCast: boolean) {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_lina_custom_4"

        let dragon_slave_speed = this.GetSpecialValueFor("dragon_slave_speed")
        let dragon_slave_width_initial = this.GetSpecialValueFor("dragon_slave_width_initial")
        let dragon_slave_width_end = this.GetSpecialValueFor("dragon_slave_width_end")
        let dragon_slave_distance = this.GetSpecialValueFor("dragon_slave_distance") + hCaster.GetCastRangeBonus()
        let dragon_slave_damage = this.GetAbilityDamage() + hCaster.GetTalentValue(sTalentName) * hCaster.GetIntellect()

        let vDirection = GameFunc.VectorFunctions.HorizonVector((vTargetPosition - vStartPosition) as Vector)

        let info = {
            Ability: this,
            Source: hCaster,
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_lina/lina_spell_dragon_slave.vpcf", hCaster),
            vSpawnOrigin: vStartPosition,
            vVelocity: (vDirection * dragon_slave_speed) as Vector,
            fDistance: dragon_slave_distance,
            fStartRadius: dragon_slave_width_initial,
            fEndRadius: dragon_slave_width_end,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            ExtraData: {
                dragon_slave_damage: dragon_slave_damage
            }
        }
        ProjectileManager.CreateLinearProjectile(info)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Lina.DragonSlave.Cast", hCaster))
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Lina.DragonSlave", hCaster))
        // 神杖多重施法
        if (bScepterMultiCast) {
            this.ScepterMutiCast(vStartPosition, vTargetPosition)
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()

        let vStartPosition = hCaster.GetAbsOrigin()
        let vTargetPosition = this.GetCursorPosition()
        if (this.GetCursorTarget()) {
            vTargetPosition = this.GetCursorTarget().GetAbsOrigin()
        }
        this.DragonSlave(vStartPosition, vTargetPosition, true)
    }
    ScepterMutiCast(vStartPosition: Vector, vTargetPosition: Vector) {
        let caster = this.GetCasterPlus()
        let chance_scepter = this.GetSpecialValueFor("chance_scepter")
        let hAbility_4 = ability3_lina_fiery_soul.findIn(caster)
        let hModifier = modifier_lina_3_fiery_soul.findIn(caster) as BaseModifier_Plus;
        if (caster.HasScepter() && GameFunc.IsValid(hAbility_4) && GameFunc.IsValid(hModifier)) {
            chance_scepter = chance_scepter + hModifier.GetStackCount() * hAbility_4.GetSpecialValueFor("chance_factor")
        }
        if (!caster.HasScepter() || !GameFunc.mathUtil.PRD(chance_scepter, caster, "lina_1_scepter")) {
            return
        }
        this.addTimer(0.5, () => {
            this.DragonSlave(vStartPosition, vTargetPosition, true)
        })
    }
    OnProjectileHit_ExtraData(hTarget: BaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (hTarget != null) {
            if (hTarget.TriggerSpellAbsorb(this)) {
                return
            }
            let damage_table = {
                ability: this,
                attacker: this.GetCasterPlus(),
                victim: hTarget,
                damage: ExtraData.dragon_slave_damage,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
        return false
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_lina_1"
    // }

}
// // // // // // // // // // // // // // // // // // // -Modifiers// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lina_1 extends BaseModifier_Plus {
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
            let start_width = ability.GetSpecialValueFor("dragon_slave_width_initial")
            let end_width = ability.GetSpecialValueFor("dragon_slave_width_end")

            let position = AoiHelper.GetLinearMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), start_width, end_width, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)

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
