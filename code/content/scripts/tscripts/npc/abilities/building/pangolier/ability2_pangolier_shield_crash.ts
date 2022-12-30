
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionVertical_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { ability1_pangolier_swashbuckle } from "./ability1_pangolier_swashbuckle";
import { ability3_pangolier_lucky_shot, modifier_pangolier_3, modifier_pangolier_3_reduce_health, modifier_pangolier_3_remove_armor, modifier_pangolier_3_remove_magic_armor, modifier_pangolier_3_silent, modifier_pangolier_3_stun } from "./ability3_pangolier_lucky_shot";
import { ability6_pangolier_gyroshell, modifier_pangolier_6_rolling } from "./ability6_pangolier_gyroshell";

/** dota原技能数据 */
export const Data_pangolier_shield_crash = { "ID": "6461", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "HasScepterUpgrade": "1", "AbilityCastRange": "0", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "18 16 14 12", "AbilityManaCost": "60 70 80 90", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "rolling_thunder_cooldown": "2.5" }, "01": { "var_type": "FIELD_INTEGER", "damage": "90 160 230 300", "LinkedSpecialBonus": "special_bonus_unique_pangolier_2" }, "02": { "var_type": "FIELD_INTEGER", "hero_stacks": "12 14 16 18" }, "03": { "var_type": "FIELD_FLOAT", "duration": "10.0" }, "04": { "var_type": "FIELD_INTEGER", "radius": "500" }, "05": { "var_type": "FIELD_FLOAT", "jump_duration": "0.4" }, "06": { "var_type": "FIELD_FLOAT", "jump_duration_gyroshell": "0.75" }, "07": { "var_type": "FIELD_INTEGER", "jump_height": "250" }, "08": { "var_type": "FIELD_INTEGER", "jump_height_gyroshell": "350" }, "09": { "var_type": "FIELD_INTEGER", "jump_horizontal_distance": "225" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_pangolier_shield_crash extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "pangolier_shield_crash";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_pangolier_shield_crash = Data_pangolier_shield_crash;
    Init() {
        this.SetDefaultSpecialValue("all_factor_damage", [2, 3, 4, 5, 6, 7]);
        this.SetDefaultSpecialValue("damage", [1000, 2000, 3000, 4000, 5000, 6000]);
        this.SetDefaultSpecialValue("unit_stacks", [100, 300, 500, 700, 900, 1100]);
        this.SetDefaultSpecialValue("duration", 4);
        this.SetDefaultSpecialValue("radius", 1200);
        this.SetDefaultSpecialValue("jump_duration", 0.4);
        this.SetDefaultSpecialValue("jump_height", 300);
        this.SetDefaultSpecialValue("scepter_attack_count", 2);
        this.SetDefaultSpecialValue("lucky_duration", 1);

    }

    Init_old() {
        this.SetDefaultSpecialValue("damage", [300, 600, 900, 1200, 1500, 1800]);
        this.SetDefaultSpecialValue("unit_stacks", [9, 18, 27, 36, 45, 54]);
        this.SetDefaultSpecialValue("duration", 4);
        this.SetDefaultSpecialValue("radius", 800);
        this.SetDefaultSpecialValue("jump_duration", 0.4);
        this.SetDefaultSpecialValue("jump_height", 300);
        this.SetDefaultSpecialValue("scepter_attack_count", 2);
        this.SetDefaultSpecialValue("lucky_duration", 1);

    }

    vCasterLoc: Vector;


    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        let fCooldown = hCaster.HasTalent("special_bonus_unique_pangolier_custom_4") && modifier_pangolier_6_rolling.exist(hCaster) && hCaster.GetTalentValue("special_bonus_unique_pangolier_custom_4") || super.GetCooldown(iLevel)
        return fCooldown
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let jump_duration = this.GetSpecialValueFor("jump_duration")
        this.vCasterLoc = GetGroundPosition(hCaster.GetAbsOrigin(), hCaster)
        modifier_pangolier_2_jump.apply(hCaster, hCaster, this, { duration: jump_duration })
        let modifier = modifier_pangolier_6_rolling.findIn(hCaster)
        if (modifier != null && modifier.GetRemainingTime() < jump_duration) {
            modifier_pangolier_6_rolling.apply(hCaster, hCaster, ability6_pangolier_gyroshell.findIn(hCaster), { duration: modifier.GetRemainingTime() + jump_duration })
        }
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_pangolier/pangolier_tailthump_cast.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
            owner: hCaster
        });

        ParticleManager.ReleaseParticleIndex(iParticleID)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Pangolier.TailThump.Cast", hCaster))
    }
    TailThump() {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let damage = this.GetSpecialValueFor("damage")
        let lucky_duration = this.GetSpecialValueFor("lucky_duration")
        let bonus_duration = hCaster.HasTalent("special_bonus_unique_pangolier_custom_2") && hCaster.GetTalentValue("special_bonus_unique_pangolier_custom_2") || 0
        let duration = this.GetSpecialValueFor("duration") + bonus_duration
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Pangolier.TailThump", hCaster))
        let modifier_pangolier4 = modifier_pangolier_3.findIn(hCaster) as modifier_pangolier_3;
        let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
        // 全属性系数伤害
        let all_factor_damage = this.GetSpecialValueFor("all_factor_damage")
        let fDamage = damage + (hCaster.GetIntellect() + hCaster.GetAgility() + hCaster.GetStrength()) * all_factor_damage
        for (let hTarget of (targets)) {
            let damage_table = {
                ability: this,
                victim: hTarget,
                attacker: hCaster,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(damage_table)
            if (hCaster.HasShard()) {
                let hAbility4 = ability3_pangolier_lucky_shot.findIn(hCaster)
                if (GameFunc.IsValid(hAbility4) && hAbility4.GetLevel() >= 1) {
                    hAbility4._OnSpellStart(hTarget)
                }
            }
            // 幸运一击效果延长一秒
            let hModifierStun = modifier_pangolier_3_stun.findIn(hTarget)
            if (GameFunc.IsValid(hModifierStun)) {
                if (GameFunc.IsValid(modifier_pangolier4) && modifier_pangolier4.tData) {
                    modifier_pangolier4.tData[0] = math.max(GameRules.GetGameTime() + lucky_duration * hTarget.GetStatusResistanceFactor(hCaster), modifier_pangolier4.tData[0])
                }
                hModifierStun.SetDuration(hModifierStun.GetRemainingTime() + lucky_duration * hTarget.GetStatusResistanceFactor(hCaster), true)
            }
            let hModifierSilent = modifier_pangolier_3_silent.findIn(hTarget) as modifier_pangolier_3_silent;
            if (GameFunc.IsValid(hModifierSilent)) {
                if (GameFunc.IsValid(modifier_pangolier4) && modifier_pangolier4.tData) {
                    modifier_pangolier4.tData[2] = math.max(GameRules.GetGameTime() + lucky_duration * hTarget.GetStatusResistanceFactor(hCaster), modifier_pangolier4.tData[2])
                }
                hModifierSilent.SetDuration(hModifierSilent.GetRemainingTime() + lucky_duration * hTarget.GetStatusResistanceFactor(hCaster), true)
            }
            let hModifierRemoveAllArmor = modifier_pangolier_3_remove_armor.findIn(hTarget) as modifier_pangolier_3_remove_armor;
            if (GameFunc.IsValid(hModifierRemoveAllArmor)) {
                if (GameFunc.IsValid(modifier_pangolier4) && modifier_pangolier4.tData) {
                    modifier_pangolier4.tData[3] = math.max(GameRules.GetGameTime() + lucky_duration * hTarget.GetStatusResistanceFactor(hCaster), modifier_pangolier4.tData[3])
                }
                hModifierRemoveAllArmor.SetDuration(hModifierRemoveAllArmor.GetRemainingTime() + lucky_duration * hTarget.GetStatusResistanceFactor(hCaster), true)
            }
            let hModifierRemoveAllMagicArmor = modifier_pangolier_3_remove_magic_armor.findIn(hTarget) as modifier_pangolier_3_remove_magic_armor;
            if (GameFunc.IsValid(hModifierRemoveAllMagicArmor)) {
                if (GameFunc.IsValid(modifier_pangolier4) && modifier_pangolier4.tData) {
                    modifier_pangolier4.tData[4] = math.max(GameRules.GetGameTime() + lucky_duration * hTarget.GetStatusResistanceFactor(hCaster), modifier_pangolier4.tData[4])
                }
                hModifierRemoveAllMagicArmor.SetDuration(hModifierRemoveAllMagicArmor.GetRemainingTime() + lucky_duration * hTarget.GetStatusResistanceFactor(hCaster), true)
            }
            let hModifierReduceHealth = modifier_pangolier_3_reduce_health.findIn(hTarget) as modifier_pangolier_3_reduce_health;
            if (GameFunc.IsValid(hModifierReduceHealth)) {
                if (GameFunc.IsValid(modifier_pangolier4) && modifier_pangolier4.tData) {
                    modifier_pangolier4.tData[5] = math.max(GameRules.GetGameTime() + lucky_duration * hTarget.GetStatusResistanceFactor(hCaster), modifier_pangolier4.tData[5])
                }
                hModifierReduceHealth.SetDuration(hModifierReduceHealth.GetRemainingTime() + lucky_duration * hTarget.GetStatusResistanceFactor(hCaster), true)
            }

            let hModifier = modifier_pangolier_2_buff.apply(hCaster, hCaster, this, { duration: duration }) as modifier_pangolier_2_buff
            if (GameFunc.IsValid(hModifier)) {
                hModifier.IncrementStackCount()
            }
        }
    }


    GetIntrinsicModifierName() {
        return "modifier_pangolier_2"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_pangolier_2 extends BaseModifier_Plus {
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

            let range = ability.GetSpecialValueFor("radius")
            let teamFilter = ability.GetAbilityTargetTeam()
            let typeFilter = ability.GetAbilityTargetType()
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_2_jump extends BaseModifierMotionVertical_Plus {
    flTime: number;
    jump_duration: number;
    jump_height: number;
    scepter_attack_count: number;
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
        this.jump_height = this.GetSpecialValueFor("jump_height")
        this.jump_duration = this.GetSpecialValueFor("jump_duration")
        this.scepter_attack_count = this.GetSpecialValueFor("scepter_attack_count")
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            if (hCaster.HasScepter()) {
                let iRange = ability1_pangolier_swashbuckle.findIn(hCaster).GetSpecialValueFor("range");
                let vDirection = (hCaster.GetForwardVector() * iRange) as Vector
                for (let i = 1; i <= 4; i++) {
                    let vPosition = GameFunc.VectorFunctions.Rotation2D(vDirection, math.rad(i * 90)) + hCaster.GetAbsOrigin()
                    // undefined
                }
            }
            if (this.ApplyVerticalMotionController()) {
                this.flTime = 0

                hCaster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2)
            } else {
                this.Destroy()
            }
        }
    }
    OnDestroy() {
        super.OnDestroy();
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus()
            let hAbility_3 = ability6_pangolier_gyroshell.findIn(hCaster)
            let bounce_duration = hAbility_3.GetSpecialValueFor("bounce_duration")
            hCaster.RemoveVerticalMotionController(this)
            // hAbility.TailThump()
            // hAbility_3.Bounce()
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_pangolier/pangolier_tailthump.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
                owner: hCaster
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let z = math.sin(this.flTime * (3.1415926 / this.jump_duration)) * this.jump_height
            this.flTime = this.flTime + dt
            me.SetAbsOrigin((GetGroundPosition(me.GetAbsOrigin(), me) + Vector(0, 0, z)) as Vector)
        }
    }
    OnVerticalMotionInterrupted() {
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_2_buff extends BaseModifier_Plus {
    unit_stacks: number;
    duration: number;
    iParticleID: ParticleID;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.unit_stacks = this.GetSpecialValueFor("unit_stacks")
        this.duration = this.GetSpecialValueFor("duration")
        let hCaster = this.GetCasterPlus()
        if (IsClient()) {
            if (params.IsOnCreated) {
                this.iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_pangolier/pangolier_tailthump_buff.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: hCaster
                });

                ParticleManager.SetParticleControl(this.iParticleID, 0, hCaster.GetAbsOrigin())
                ParticleManager.SetParticleControlEnt(this.iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
                ParticleManager.SetParticleControl(this.iParticleID, 3, Vector(this.GetStackCount() * 10, 0, 0))
                this.AddParticle(this.iParticleID, false, false, -1, false, false)
            }
            if (params.IsOnRefresh) {
                ParticleManager.SetParticleControl(this.iParticleID, 3, Vector(this.GetStackCount() * 10, 0, 0))
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierTable) {
        return this.unit_stacks * this.GetStackCount()
    }

}
