
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_phantom_assassin_stifling_dagger = { "ID": "5190", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_PhantomAssassin.Dagger.Cast", "AbilityCastRange": "550 750 950 1150", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "6", "AbilityManaCost": "30", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "move_slow": "-50" }, "02": { "var_type": "FIELD_INTEGER", "dagger_speed": "1200" }, "03": { "var_type": "FIELD_FLOAT", "duration": "1.75 2.5 3.25 4", "LinkedSpecialBonus": "special_bonus_unique_phantom_assassin_5" }, "04": { "var_type": "FIELD_INTEGER", "base_damage": "65" }, "05": { "var_type": "FIELD_INTEGER", "attack_factor": "-75 -60 -45 -30" }, "06": { "var_type": "FIELD_INTEGER", "attack_factor_tooltip": "25 40 55 70" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_phantom_assassin_stifling_dagger extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phantom_assassin_stifling_dagger";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phantom_assassin_stifling_dagger = Data_phantom_assassin_stifling_dagger;
    Init() {
        this.SetDefaultSpecialValue("move_slow", -50);
        this.SetDefaultSpecialValue("dagger_speed", 1200);
        this.SetDefaultSpecialValue("duration", [1.5, 2.0, 2.5, 3.0, 3.5, 4]);
        this.SetDefaultSpecialValue("base_damage", [200, 500, 800, 1100, 1400, 1700]);
        this.SetDefaultSpecialValue("attack_factor", 250);
        this.SetDefaultSpecialValue("tooltip_range", 1200);

    }

    Init_old() {
        this.SetDefaultSpecialValue("move_slow", -50);
        this.SetDefaultSpecialValue("dagger_speed", 1200);
        this.SetDefaultSpecialValue("duration", [1.5, 2.0, 2.5, 3.0, 3.5, 4]);
        this.SetDefaultSpecialValue("base_damage", [200, 500, 800, 1100, 1400, 1700]);
        this.SetDefaultSpecialValue("attack_factor", 250);
        this.SetDefaultSpecialValue("tooltip_range", 1200);

    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()

        let dagger_speed = this.GetSpecialValueFor("dagger_speed")

        let info = {
            Ability: this,
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_phantom_assassin/phantom_assassin_stifling_dagger.vpcf", hCaster),
            iSourceAttachment: hCaster.ScriptLookupAttachment("attach_attack2"),
            iMoveSpeed: dagger_speed,
            Target: hTarget,
            Source: hCaster
        }
        ProjectileManager.CreateTrackingProjectile(info)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_PhantomAssassin.Dagger.Cast", hCaster))
        let sTalentName = "special_bonus_unique_phantom_assassin_custom_5"
        if (hCaster.HasTalent(sTalentName)) {
            let dagger_count = hCaster.GetTalentValue(sTalentName)
            let range = this.GetCastRange(hCaster.GetAbsOrigin(), hTarget) + hCaster.GetTalentValue(sTalentName, "range")
            let interval = hCaster.GetTalentValue(sTalentName, "interval")
            let interval_add = interval
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), range, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER)
            let iCount = 0
            for (let hUnit of (tTargets)) {
                this.addTimer(
                    interval_add,
                    () => {
                        let info = {
                            Ability: this,
                            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_phantom_assassin/phantom_assassin_stifling_dagger.vpcf", hCaster),
                            iSourceAttachment: hCaster.ScriptLookupAttachment("attach_attack2"),
                            iMoveSpeed: dagger_speed,
                            Target: hUnit,
                            Source: hCaster
                        }
                        ProjectileManager.CreateTrackingProjectile(info)
                        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_PhantomAssassin.Dagger.Cast", hCaster))
                    }
                )
                iCount = iCount + 1
                interval_add = interval_add + interval
                if (iCount >= dagger_count) {
                    break
                }
            }
        }
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (hTarget != null) {
            if (!hTarget.TriggerSpellAbsorb(this)) {
                let hCaster = this.GetCasterPlus()
                let duration = this.GetSpecialValueFor("duration")

                EmitSoundOnLocationWithCaster(vLocation, "Hero_PhantomAssassin.Dagger.Target", hCaster)

                let vPosition = hCaster.GetAbsOrigin()
                let vDirection = (vPosition - hTarget.GetAbsOrigin()) as Vector
                vDirection.z = 0
                modifier_phantom_assassin_1_caster.apply(hCaster, hCaster, this, null)
                hCaster.SetAbsOrigin((hTarget.GetAbsOrigin() + vDirection.Normalized()) as Vector)
                BattleHelper.Attack(hCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS)
                modifier_phantom_assassin_1_caster.remove(hCaster);
                hCaster.SetAbsOrigin(vPosition)
                if (!hTarget.IsMagicImmune()) {
                    modifier_phantom_assassin_1_debuff.apply(hTarget, hCaster, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })
                }
            }
        }

        return true
    }

    GetIntrinsicModifierName() {
        return "modifier_phantom_assassin_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_phantom_assassin_1 extends BaseModifier_Plus {
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

            //  优先攻击目标
            let target = caster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") {
                target = null
            }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
                let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
                let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[0]
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                        TargetIndex: target.entindex(),
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_phantom_assassin_1_caster extends BaseModifier_Plus {
    base_damage: number;
    attack_factor: number;
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
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_phantom_assassin_custom_3"
        this.base_damage = this.GetSpecialValueFor("base_damage")
        this.attack_factor = hCaster.HasTalent(sTalentName) && this.GetSpecialValueFor("attack_factor") + hCaster.GetTalentValue(sTalentName) - 100 || this.GetSpecialValueFor("attack_factor") - 100
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        return this.base_damage / ((this.attack_factor + 100) * 0.01)
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: IModifierTable) {
        return this.attack_factor
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_phantom_assassin_1_debuff extends BaseModifier_Plus {
    move_slow: number;
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
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    Init(params: IModifierTable) {
        this.move_slow = this.GetSpecialValueFor("move_slow")
        if (params.IsOnCreated && IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_phantom_assassin/phantom_assassin_stifling_dagger_debuff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: this.GetEffectAttachType(),
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return this.move_slow
    }

}
