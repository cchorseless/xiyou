import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_feared } from "../../../modifier/effect/modifier_feared";
import { ability1_drow_ranger_frost_arrows, modifier_drow_ranger_1_debuff } from "./ability1_drow_ranger_frost_arrows";

/** dota原技能数据 */
export const Data_drow_ranger_wave_of_silence = { "ID": "5632", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_DrowRanger.Silence", "AbilityCastRange": "900", "AbilityCastPoint": "0.25", "AbilityCooldown": "16 15 14 13", "AbilityManaCost": "70", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "wave_speed": "2000.0" }, "02": { "var_type": "FIELD_INTEGER", "wave_width": "250" }, "03": { "var_type": "FIELD_FLOAT", "silence_duration": "3 4 5 6", "LinkedSpecialBonus": "special_bonus_unique_drow_ranger_4" }, "04": { "var_type": "FIELD_FLOAT", "knockback_distance_max": "450" }, "05": { "var_type": "FIELD_FLOAT", "knockback_duration": "0.6 0.7 0.8 0.9" }, "06": { "var_type": "FIELD_INTEGER", "knockback_height": "0" }, "07": { "var_type": "FIELD_INTEGER", "wave_length": "900" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_drow_ranger_wave_of_silence extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "drow_ranger_wave_of_silence";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_drow_ranger_wave_of_silence = Data_drow_ranger_wave_of_silence;
    Init() {
        this.SetDefaultSpecialValue("arrow_range_multiplier", 2);
        this.SetDefaultSpecialValue("add_stack", 1);
        this.SetDefaultSpecialValue("wave_speed", 2000);
        this.SetDefaultSpecialValue("wave_width", 250);
        this.SetDefaultSpecialValue("wave_range", 900);
        this.SetDefaultSpecialValue("fear_duration", [2, 2.5, 3, 3.5, 4, 4.5]);
        this.SetDefaultSpecialValue("arrow_count", 12);
        this.SetDefaultSpecialValue("arrow_damage_pct", [285, 350, 410, 480, 550, 650]);
        this.SetDefaultSpecialValue("arrow_width", 90);
        this.SetDefaultSpecialValue("arrow_speed", 1200);
        this.SetDefaultSpecialValue("arrow_angle", 50);

    }


    iMaxCount: number;
    fInterval: number;
    iCount: number;
    tHastable: any;
    fTime: number;

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let wave_speed = this.GetSpecialValueFor("wave_speed")
        let wave_range = this.GetSpecialValueFor("wave_range") + hCaster.GetCastRangeBonus()
        let wave_width = this.GetSpecialValueFor("wave_width")

        let vDirection = (vPosition - hCaster.GetAbsOrigin()) as Vector
        vDirection.z = 0

        let tInfo: CreateLinearProjectileOptions = {
            Ability: this,
            Source: hCaster,
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_drow/drow_silence_wave.vpcf", hCaster),
            vSpawnOrigin: hCaster.GetAbsOrigin(),
            vVelocity: (vDirection.Normalized() * wave_speed) as Vector,
            fDistance: wave_range,
            fStartRadius: wave_width,
            fEndRadius: wave_width,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
        }
        ProjectileManager.CreateLinearProjectile(tInfo)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_DrowRanger.Silence", hCaster))

        hCaster.EmitSound("Hero_DrowRanger.Multishot.Channel")
        this.iMaxCount = this.GetSpecialValueFor("arrow_count")
        this.fInterval = this.GetChannelTime() / math.ceil(this.iMaxCount / 4)
        this.iCount = 0
        this.tHastable = HashTableHelper.CreateHashtable()
        this.tHastable.tTargets = []
        this.tHastable.tProjectile = []
        this.fTime = 0
    }
    OnChannelThink(fInterval: number) {
        if (fInterval == 0) {
            return
        }
        this.fTime = this.fTime + fInterval

        if (this.fInterval >= this.fTime) {
            this.iCount = this.iCount + 1
            if (this.iCount <= 4) {
                let hCaster = this.GetCasterPlus()
                let vPosition = this.GetCursorPosition()

                let arrow_width = this.GetSpecialValueFor("arrow_width")
                let arrow_speed = this.GetSpecialValueFor("arrow_speed")
                let arrow_range_multiplier = this.GetSpecialValueFor("arrow_range_multiplier")
                let arrow_angle = this.GetSpecialValueFor("arrow_angle")
                let fRange = arrow_range_multiplier * hCaster.Script_GetAttackRange()

                let vDirection = (vPosition - hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_attack1"))) as Vector
                vDirection.z = 0
                vDirection = vDirection.Normalized()

                let n = RemapValClamped((this.iCount - 1) % 4, 0, 3, 2, -1)
                vDirection = GameFunc.VectorFunctions.Rotation2D(vDirection, -math.rad(arrow_angle / 5 * n))

                let sParticlePath = "particles/units/heroes/hero_drow/drow_base_attack_linear_proj.vpcf"
                let hAbility = ability1_drow_ranger_frost_arrows.findIn(hCaster)
                if (GameFunc.IsValid(hAbility) && hAbility.IsActivated() && hAbility.GetLevel() > 0) {
                    sParticlePath = "particles/units/heroes/hero_drow/drow_multishot_proj_linear_proj.vpcf"
                    hCaster.EmitSound("Hero_DrowRanger.Multishot.FrostArrows")
                } else {
                    hCaster.EmitSound("Hero_DrowRanger.Multishot.Attack")
                }

                let tInfo = {
                    Ability: this,
                    Source: hCaster,
                    EffectName: ResHelper.GetParticleReplacement(sParticlePath, hCaster),
                    vSpawnOrigin: hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_attack1")),
                    vVelocity: (vDirection * arrow_speed) as Vector,
                    fDistance: fRange,
                    fStartRadius: arrow_width,
                    fEndRadius: arrow_width,
                    iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                    iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                    iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE,
                    bProvidesVision: true,
                    iVisionRadius: arrow_width,
                    iVisionTeamNumber: hCaster.GetTeamNumber(),
                    ExtraData: {
                        hastable_index: HashTableHelper.GetHashtableIndex(this.tHastable),
                        index: this.iCount,
                    }
                }
                this.tHastable.tProjectile[this.iCount] = ProjectileManager.CreateLinearProjectile(tInfo)
            }
        } else {
            this.iCount = 0
            this.tHastable = HashTableHelper.CreateHashtable()
            this.tHastable.tTargets = []
            this.tHastable.tProjectile = []
            this.fTime = 0
        }
    }
    OnChannelFinish(bInterrupted: boolean): void {
        let hCaster = this.GetCasterPlus()
        hCaster.StopSound("Hero_DrowRanger.Multishot.Channel")
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let tHastable = HashTableHelper.GetHashtableByIndex(ExtraData.hastable_index || -1)
        let hCaster = this.GetCasterPlus()
        if (tHastable) {
            if (hTarget != null) {
                if (tHastable.tTargets.indexOf(hTarget) == -1) {
                    let arrow_damage_pct = this.GetSpecialValueFor("arrow_damage_pct")
                    let add_stack = this.GetSpecialValueFor("add_stack")
                    EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), "Hero_DrowRanger.ProjectileImpact", hCaster)
                    modifier_drow_ranger_2_buff.apply(hCaster, hCaster, this, null)
                    BattleHelper.Attack(hCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
                    modifier_drow_ranger_2_buff.remove(hCaster);
                    let hAbility = ability1_drow_ranger_frost_arrows.findIn(hCaster) as ability1_drow_ranger_frost_arrows;
                    if (GameFunc.IsValid(hAbility) && hAbility.IsActivated() && hAbility.GetLevel() > 0) {
                        for (let i = 1; i <= add_stack; i++) {
                            modifier_drow_ranger_1_debuff.apply(hTarget, hCaster, hAbility, null)
                        }
                    }
                    table.insert(tHastable.tTargets, hTarget)
                }

                return false
            }

            tHastable.tProjectile[ExtraData.index] = null
            if ((tHastable.tProjectile.length) == 0) {
                HashTableHelper.RemoveHashtable(tHastable)
            }
        }
        else {
            if (hTarget != null) {
                let fear_duration = this.GetSpecialValueFor("fear_duration")
                modifier_feared.apply(hTarget, hCaster, this, { duration: fear_duration * hTarget.GetStatusResistanceFactor(hCaster) })
            }
        }

        return true
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_drow_ranger_2"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_drow_ranger_2 extends BaseModifier_Plus {
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
            let start_width = ability.GetSpecialValueFor("wave_width")
            let end_width = ability.GetSpecialValueFor("wave_width")

            let position = AoiHelper.GetLinearMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), start_width, end_width, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)

            if (position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
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
// Modifiers
@registerModifier()
export class modifier_drow_ranger_2_buff extends BaseModifier_Plus {
    arrow_damage_pct: number;
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
        this.arrow_damage_pct = this.GetSpecialValueFor("arrow_damage_pct")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage() {
        return this.arrow_damage_pct
    }
}
