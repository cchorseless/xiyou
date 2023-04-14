
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_juggernaut_omni_slash = { "ID": "5030", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "2", "HasScepterUpgrade": "1", "AbilityDraftUltScepterAbility": "juggernaut_swift_slash", "AbilityCastRange": "350", "AbilityCastPoint": "0.3 0.3 0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "140", "AbilityManaCost": "200 275 350", "AbilityModifierSupportValue": "0.0", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "attack_rate_multiplier": "1.5" }, "02": { "var_type": "FIELD_INTEGER", "bonus_damage": "30 40 50", "CalculateSpellDamageTooltip": "0" }, "03": { "var_type": "FIELD_INTEGER", "bonus_attack_speed": "40", "CalculateSpellDamageTooltip": "0" }, "04": { "var_type": "FIELD_FLOAT", "duration": "3 3.25 3.5", "LinkedSpecialBonus": "special_bonus_unique_juggernaut_2" }, "05": { "var_type": "FIELD_INTEGER", "omni_slash_radius": "425" } } };

@registerAbility()
export class ability6_juggernaut_omni_slash extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "juggernaut_omni_slash";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_juggernaut_omni_slash = Data_juggernaut_omni_slash;
    Init() {
        this.SetDefaultSpecialValue("bonus_damage", [30, 40, 50, 60, 70, 80]);
        this.SetDefaultSpecialValue("omni_slash_radius", 475);
        this.SetDefaultSpecialValue("attack_rate_multiplier", 1.1);
        this.SetDefaultSpecialValue("duration", [3, 3.25, 3.5, 3.75, 4, 4.5]);

    }


    hitting: boolean;


    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let target = this.GetCursorTarget()

        if (!IsValid(target) || !target.IsAlive()) {
            return
        }
        let duration = this.GetSpecialValueFor("duration") + caster.GetTalentValue('special_bonus_unique_juggernaut_custom_3')
        let dummy = BaseNpc_Plus.CreateUnitByName(caster.GetUnitName(), caster.GetAbsOrigin(), caster, false)
        let abilitycount = dummy.GetAbilityCount()
        for (let i = abilitycount - 1; i >= 0; i--) {
            let ability = dummy.GetAbilityByIndex(i)
            if (IsValid(ability)) {
                dummy.RemoveAbilityByHandle(ability)
            }
        }
        modifier_juggernaut_6_thinker.apply(dummy, caster, this, { duration: duration, target_entindex: target.entindex() })

        //  天赋多重幻影
        if (caster.HasTalent("special_bonus_unique_juggernaut_custom_5")) {
            let max_count = caster.GetTalentValue("special_bonus_unique_juggernaut_custom_5", "count")
            let interval = caster.GetTalentValue("special_bonus_unique_juggernaut_custom_5", "interval")
            let count = 0
            GTimerHelper.AddTimer(interval, GHandler.create(this, () => {
                if (!IsValid(target) || !target.IsAlive()) {
                    let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), this.GetCastRange(caster.GetAbsOrigin(), caster), null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), 0)
                    target = targets[0]
                }
                if (!IsValid(target)) {
                    return
                }
                let dummy = BaseNpc_Plus.CreateUnitByName(caster.GetUnitName(), caster.GetAbsOrigin(), caster, false)
                let abilitycount = dummy.GetAbilityCount()
                for (let i = abilitycount - 1; i >= 0; i--) {
                    let ability = dummy.GetAbilityByIndex(i)
                    if (IsValid(ability)) {
                        dummy.RemoveAbilityByHandle(ability)
                    }
                }
                modifier_juggernaut_6_thinker.apply(dummy, caster, this, { duration: duration, target_entindex: target.entindex() })
                count = count + 1
                if (count >= max_count) {
                    return
                }
                return interval
            }))
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_juggernaut_6"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_juggernaut_6 extends BaseModifier_Plus {
    bonus_damage: number;
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
    Init(params: IModifierTable) {
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
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
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)

    GetDamageOutgoing_Percentage(params: IModifierTable) {
        if (IsServer()) {
            let ability = this.GetAbilityPlus() as ability6_juggernaut_omni_slash
            if (ability.hitting) {
                return this.bonus_damage
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_juggernaut_6_thinker extends BaseModifier_Plus {
    bonus_damage: number;
    omni_slash_radius: number;
    attack_rate_multiplier: number;
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
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
        this.omni_slash_radius = this.GetSpecialValueFor("omni_slash_radius")
        this.attack_rate_multiplier = this.GetSpecialValueFor("attack_rate_multiplier")
        if (IsServer()) {
            let caster = this.GetCasterPlus()
            let dummy = this.GetParentPlus()
            let jump_interval = caster.GetSecondsPerAttack() / this.attack_rate_multiplier
            let target = EntIndexToHScript(params.target_entindex) as IBaseNpc_Plus
            if (!target.TriggerSpellAbsorb(this.GetAbilityPlus())) {
                let vDirection = (target.GetAbsOrigin() - dummy.GetAbsOrigin()) as Vector
                vDirection.z = 0
                let position = (target.GetAbsOrigin() + vDirection.Normalized() * (dummy.GetHullRadius() + target.GetHullRadius())) as Vector

                let particleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_juggernaut/juggernaut_omni_dash.vpcf",
                    resNpc: caster,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: dummy
                });

                ParticleManager.SetParticleControl(particleID, 0, dummy.GetAbsOrigin())
                ParticleManager.SetParticleControlForward(particleID, 0, (-vDirection as Vector).Normalized())
                ParticleManager.SetParticleControlEnt(particleID, 1, target, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, target.GetAbsOrigin(), true)
                ParticleManager.SetParticleControlEnt(particleID, 2, target, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, target.GetAbsOrigin(), true)
                ParticleManager.ReleaseParticleIndex(particleID)
                EmitSoundOnLocationWithCaster(dummy.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Juggernaut.OmniSlash", caster), caster)
                particleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_juggernaut/juggernaut_omni_slash_trail.vpcf",
                    resNpc: caster,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: dummy
                });
                ParticleManager.SetParticleControl(particleID, 0, dummy.GetAbsOrigin())
                FindClearSpaceForUnit(dummy, position, true)
                ParticleManager.SetParticleControl(particleID, 1, dummy.GetAbsOrigin())
                ParticleManager.ReleaseParticleIndex(particleID)
                dummy.SetForwardVector((-vDirection as Vector).Normalized())
                dummy.FaceTowards(target.GetAbsOrigin())
                modifier_juggernaut_6_particle_slash_tgt.apply(target, caster, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
                EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Juggernaut.OmniSlash.Damage", caster), caster)
                this.HitTarget(target)
            } else {
                jump_interval = 0
            }

            this.StartIntervalThink(jump_interval)
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_juggernaut/juggernaut_omnislash_light.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetCasterPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, false)
            particleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_omnislash.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetCasterPlus()
            });

            this.AddParticle(particleID, false, true, 10, false, false)
        }
    }
    BeDestroy() {

        if (IsServer()) {
            modifier_juggernaut_6_delay_remove.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), { duration: 0.5 })
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            let caster = this.GetCasterPlus()
            let dummy = this.GetParentPlus()

            if (!IsValid(ability) || !IsValid(caster)) {
                this.Destroy()
                UTIL_Remove(this.GetParentPlus())
                return
            }

            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), dummy.GetAbsOrigin(), this.omni_slash_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, 0)
            let target = targets[0]
            if (target != null) {
                let jump_interval = caster.GetSecondsPerAttack() / this.attack_rate_multiplier
                let vDirection = (target.GetAbsOrigin() - dummy.GetAbsOrigin()) as Vector
                vDirection.z = 0
                let position = (target.GetAbsOrigin() + vDirection.Normalized() * (dummy.GetHullRadius() + target.GetHullRadius())) as Vector

                EmitSoundOnLocationWithCaster(dummy.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Juggernaut.OmniSlash", caster), caster)

                let particleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_juggernaut/juggernaut_omni_slash_trail.vpcf",
                    resNpc: caster,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: dummy
                });

                ParticleManager.SetParticleControl(particleID, 0, dummy.GetAbsOrigin())
                FindClearSpaceForUnit(dummy, position, true)
                ParticleManager.SetParticleControl(particleID, 1, dummy.GetAbsOrigin())
                ParticleManager.ReleaseParticleIndex(particleID)
                dummy.SetForwardVector((-vDirection as Vector).Normalized())
                dummy.FaceTowards(target.GetAbsOrigin())
                modifier_juggernaut_6_particle_slash_tgt.apply(target, caster, ability, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
                EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), ResHelper.GetParticleReplacement("Hero_Juggernaut.OmniSlash.Damage", caster), caster)
                this.HitTarget(target)
                this.StartIntervalThink(jump_interval)

            } else {
                modifier_juggernaut_6_particle_omni_end.apply(dummy, caster, ability, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
                this.Destroy()
            }
        }
    }
    HitTarget(target: IBaseNpc_Plus) {
        if (IsServer()) {
            let ability = this.GetAbilityPlus() as ability6_juggernaut_omni_slash
            if (!IsValid(ability)) {
                return
            }
            ability.hitting = true
            let caster = this.GetCasterPlus()
            let position = caster.GetAbsOrigin()
            let vDirection = (target.GetAbsOrigin() - position) as Vector
            vDirection.z = 0
            caster.SetAbsOrigin((target.GetAbsOrigin() - vDirection.Normalized()) as Vector)
            BattleHelper.Attack(caster, target, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)

            caster.SetAbsOrigin(position)

            ability.hitting = false
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        return this.bonus_damage
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    overrideAnimation() {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    GetIgnoreCastAngle(params: IModifierTable) {
        return 1
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_juggernaut_6_delay_remove extends BaseModifier_Plus {
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
    BeDestroy() {

        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_juggernaut_6_particle_slash_tgt extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_juggernaut/juggernaut_omni_slash_tgt.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 1, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_juggernaut_6_particle_omni_end extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_juggernaut/juggernaut_omni_end.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(particleID, 1, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 2, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 3, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}
