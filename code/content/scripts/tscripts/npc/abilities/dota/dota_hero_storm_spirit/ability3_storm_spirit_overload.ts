import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_shock } from "../../../modifier/effect/modifier_generic_shock";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_storm_spirit_overload = { "ID": "5100", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_StormSpirit.Overload", "AbilityDuration": "0.6 0.6 0.6 0.6", "HasShardUpgrade": "1", "AbilityModifierSupportBonus": "40", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "overload_aoe": "300" }, "02": { "var_type": "FIELD_INTEGER", "overload_move_slow": "-80" }, "03": { "var_type": "FIELD_INTEGER", "overload_attack_slow": "-80" }, "04": { "var_type": "FIELD_INTEGER", "overload_damage": "40 60 80 100", "LinkedSpecialBonus": "special_bonus_unique_storm_spirit_6" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_storm_spirit_overload extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "storm_spirit_overload";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_storm_spirit_overload = Data_storm_spirit_overload;
    Init() {
        this.SetDefaultSpecialValue("overload_stack_duration", 7);
        this.SetDefaultSpecialValue("shard_target_count", 2);
        this.SetDefaultSpecialValue("shard_radius", 600);
        this.SetDefaultSpecialValue("shock_bonus_pct", 50);
        this.SetDefaultSpecialValue("overload_stack", [1, 2, 2, 3, 4]);
        this.SetDefaultSpecialValue("overload_duration", 30);
        this.SetDefaultSpecialValue("overload_aoe", 300);
        this.SetDefaultSpecialValue("overload_move_slow", -80);
        this.SetDefaultSpecialValue("overload_damage", [100, 200, 400, 800, 1600]);
        this.SetDefaultSpecialValue("overload_damage_per_mana", 1);
        this.SetDefaultSpecialValue("overload_stack_damage", [50, 100, 200, 400, 800]);
        this.SetDefaultSpecialValue("overload_stack_damage_per_int", 0.5);
        this.SetDefaultSpecialValue("overload_max_stack_damage_per_int", 20);

    }

    Init_old() {
        this.SetDefaultSpecialValue("per_second_reduce_layer_max", 100);
        this.SetDefaultSpecialValue("super_state_layer", 100);
        this.SetDefaultSpecialValue("reduce_move_speed_percent", 80);
        this.SetDefaultSpecialValue("reduce_move_speed_duration", 0.6);
        this.SetDefaultSpecialValue("out_super_state", 0);
        this.SetDefaultSpecialValue("per_second_add_damage_percent", 10);
        this.SetDefaultSpecialValue("attack_get_layer", 1);
        this.SetDefaultSpecialValue("cast_spell_get_layer", 10);
        this.SetDefaultSpecialValue("attack_bouns_damage", [500, 1000, 1500, 2000, 2500]);
        this.SetDefaultSpecialValue("bouns_intellect_damage_factor", [5, 6, 7, 8, 10]);
        this.SetDefaultSpecialValue("attack_radius", 300);
        this.SetDefaultSpecialValue("per_second_reduce_layer", 5);

    }



    Overload() {
        let hCaster = this.GetCasterPlus()
        let overload_duration = this.GetSpecialValueFor("overload_duration")

        modifier_storm_spirit_3_buff.apply(hCaster, hCaster, this, { duration: overload_duration })

        if (hCaster.HasTalent("special_bonus_unique_storm_spirit_custom_7")) {
            let fRadius = hCaster.GetTalentValue("special_bonus_unique_storm_spirit_custom_7")
            let iValue = hCaster.GetTalentValue("special_bonus_unique_storm_spirit_custom_7", "value2")
            let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, fRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_CLOSEST, false)
            for (let hTarget of (tTargets)) {
                if (hTarget != hCaster && hTarget.GetUnitLabel() != "builder" && hTarget.GetUnitLabel() == "HERO") {
                    modifier_storm_spirit_3_buff.apply(hTarget, hCaster, this, { duration: overload_duration, overload_stack: iValue })
                }
            }
        }
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus()
        let fDuration = this.GetSpecialValueFor("overload_duration")
        let shard_target_count = this.GetSpecialValueFor("shard_target_count")
        let overload_damage = this.GetSpecialValueFor("overload_damage")
        let overload_aoe = this.GetSpecialValueFor("overload_aoe")
        let overload_damage_per_mana = this.GetSpecialValueFor("overload_damage_per_mana")
        let overload_stack_duration = this.GetSpecialValueFor("overload_stack_duration")
        let overload_stack_damage = this.GetSpecialValueFor("overload_stack_damage")
        let overload_max_stack_damage_per_int = this.GetSpecialValueFor("overload_max_stack_damage_per_int")
        let overload_stack_damage_per_int = this.GetSpecialValueFor("overload_stack_damage_per_int")
        let shard_radius = this.GetSpecialValueFor("shard_radius")
        let hAttacker = EntIndexToHScript(ExtraData.attacker_index) as IBaseNpc_Plus
        let count = ExtraData.count
        if (IsValid(hTarget) && IsValid(hAttacker) && hCaster.HasShard()) {
            let fDamage = overload_damage + hAttacker.GetMaxMana() * overload_damage_per_mana
            let iInt = hAttacker.GetIntellect()
            let shock_bonus_pct = this.GetSpecialValueFor("shock_bonus_pct") / 100
            modifier_storm_spirit_3_particle.apply(hAttacker, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

            let tTargets = FindUnitsInRadius(hAttacker.GetTeamNumber(), hTarget.GetAbsOrigin(), null, overload_aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false)
            let iCount = 1 + hCaster.GetTalentValue("special_bonus_unique_storm_spirit_custom_3")
            for (let i = 1; i <= iCount; i++) {
                for (let hTarget of (tTargets as IBaseNpc_Plus[])) {
                    let iStack = 0
                    let hModifier = modifier_storm_spirit_3_stack_debuff.findIn(hTarget) as modifier_storm_spirit_3_stack_debuff;
                    if (IsValid(hModifier)) {
                        iStack = hModifier.GetStackCount()
                    }
                    modifier_storm_spirit_3_debuff.apply(hTarget, hAttacker, this, { duration: fDuration * hTarget.GetStatusResistanceFactor(hAttacker) })
                    modifier_storm_spirit_3_stack_debuff.apply(hTarget, hAttacker, this, { duration: overload_stack_duration })
                    let true_damage = fDamage + iStack * overload_stack_damage + iInt * math.min(overload_max_stack_damage_per_int, iStack * overload_stack_damage_per_int)
                    BattleHelper.GoApplyDamage({
                        ability: this,
                        attacker: hAttacker,
                        victim: hTarget,
                        damage: true_damage,
                        damage_type: this.GetAbilityDamageType()
                    })
                    modifier_generic_shock.Shock(hTarget, hCaster, this, true_damage * shock_bonus_pct)
                }
            }
            let targets = AoiHelper.FindEntityInRadius(hAttacker.GetTeamNumber(), hTarget.GetAbsOrigin(), shard_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, 0)
            for (let target of (targets)) {
                if (target != hTarget) {
                    let info = {
                        Ability: this,
                        EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_stormspirit/stormspirit_base_attack.vpcf", hCaster),
                        vSourceLoc: hTarget.GetAttachmentOrigin(hTarget.ScriptLookupAttachment("attach_hitloc")),
                        iMoveSpeed: hAttacker.GetProjectileSpeed(),
                        Target: target,
                        ExtraData: {
                            attacker_index: hAttacker.GetEntityIndex(),
                            count: count + 1,
                        }
                    }
                    if (count < shard_target_count) {
                        ProjectileManager.CreateTrackingProjectile(info)
                    }
                    break
                }
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_storm_spirit_3"
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_storm_spirit_3// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_storm_spirit_3 extends BaseModifier_Plus {
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    OnAbilityExecuted(params: IModifierTable) {
        let hParent = this.GetParentPlus()

        if (hParent == params.unit && !hParent.PassivesDisabled() && !hParent.IsIllusion()) {
            let hAbility = params.ability

            if (IsValid(hAbility) && !hAbility.IsItem() && hAbility.ProcsMagicStick()) {
                (this.GetAbilityPlus() as ability3_storm_spirit_overload).Overload()
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_storm_spirit_3_buff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_storm_spirit_3_buff extends BaseModifier_Plus {
    overload_stack: number;
    overload_damage: number;
    overload_stack_damage_per_int: number;
    shard_radius: number;
    overload_max_stack_damage_per_int: number;
    overload_aoe: number;
    overload_damage_per_mana: number;
    overload_stack_damage: number;
    shard_target_count: number;
    overload_stack_duration: number;
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
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.overload_stack = this.GetSpecialValueFor("overload_stack") + (IsValid(hCaster) && hCaster.GetTalentValue("special_bonus_unique_storm_spirit_custom_6") || 0)
        this.overload_aoe = this.GetSpecialValueFor("overload_aoe")
        this.overload_damage = this.GetSpecialValueFor("overload_damage")
        this.overload_damage_per_mana = this.GetSpecialValueFor("overload_damage_per_mana")
        this.overload_stack_damage = this.GetSpecialValueFor("overload_stack_damage")
        this.overload_stack_damage_per_int = this.GetSpecialValueFor("overload_stack_damage_per_int")
        this.overload_max_stack_damage_per_int = this.GetSpecialValueFor("overload_max_stack_damage_per_int")
        this.overload_stack_duration = this.GetSpecialValueFor("overload_stack_duration")
        this.shard_target_count = this.GetSpecialValueFor("shard_target_count")
        this.shard_radius = this.GetSpecialValueFor("shard_radius")
        if (IsServer()) {
            let iStackCount = params.overload_stack || this.overload_stack
            this.changeStackCount(iStackCount)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-iStackCount)
            })
        } else if (params.IsOnCreated && IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_stormspirit/stormspirit_overload_ambient.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (!IsValid(params.target) || params.target.GetClassname() == "dota_item_drop") { return }

        let hAbility = this.GetAbilityPlus()
        if (!IsValid(hAbility)) {
            this.Destroy()
            return
        }
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (params.attacker == hParent && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, hParent.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            let fDuration = hAbility.GetDuration()
            let fDamage = this.overload_damage + hParent.GetMaxMana() * this.overload_damage_per_mana
            let iInt = hParent.GetIntellect()
            let shock_bonus_pct = this.GetSpecialValueFor("shock_bonus_pct") / 100
            modifier_storm_spirit_3_particle.apply(hParent, params.target, hAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

            let tTargets = FindUnitsInRadius(hParent.GetTeamNumber(), params.target.GetAbsOrigin(), null, this.overload_aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            let iCount = 1 + hCaster.GetTalentValue("special_bonus_unique_storm_spirit_custom_3")
            for (let i = 1; i <= iCount; i++) {
                for (let hTarget of (tTargets as IBaseNpc_Plus[])) {

                    let iStack = 0
                    let hModifier = modifier_storm_spirit_3_stack_debuff.findIn(hTarget) as modifier_storm_spirit_3_stack_debuff;
                    if (IsValid(hModifier)) {
                        iStack = hModifier.GetStackCount()
                    }
                    modifier_storm_spirit_3_debuff.apply(hTarget, hParent, hAbility, { duration: fDuration * hTarget.GetStatusResistanceFactor(hParent) })

                    modifier_storm_spirit_3_stack_debuff.apply(hTarget, hParent, hAbility, { duration: this.overload_stack_duration })
                    let true_damage = fDamage + iStack * this.overload_stack_damage + iInt * math.min(this.overload_max_stack_damage_per_int, iStack * this.overload_stack_damage_per_int)
                    BattleHelper.GoApplyDamage({
                        ability: hAbility,
                        attacker: hParent,
                        victim: hTarget,
                        damage: true_damage,
                        damage_type: hAbility.GetAbilityDamageType()
                    })
                    modifier_generic_shock.Shock(hTarget, hParent, hAbility, true_damage * shock_bonus_pct)
                }

                this.DecrementStackCount()
                if (this.GetStackCount() <= 0) {
                    this.Destroy()
                }
            }
            if (hCaster.HasShard()) {
                let count = 0
                let targets = FindUnitsInRadius(params.attacker.GetTeamNumber(), params.target.GetAbsOrigin(), null, this.shard_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false)
                for (let target of (targets)) {


                    if (target != params.target) {
                        let info = {
                            Ability: this.GetAbilityPlus(),
                            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_stormspirit/stormspirit_base_attack.vpcf"),
                            vSourceLoc: params.target.GetAttachmentOrigin(params.target.ScriptLookupAttachment("attach_hitloc")),
                            iMoveSpeed: hParent.GetProjectileSpeed(),
                            Target: target,
                            ExtraData: {
                                attacker_index: params.attacker.GetEntityIndex(),
                                count: count + 1,
                            }
                        }
                        ProjectileManager.CreateTrackingProjectile(info)
                        break
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        return "overload"
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_storm_spirit_3_debuff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_storm_spirit_3_debuff extends BaseModifier_Plus {
    overload_move_slow: number;
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
    Init(params: IModifierTable) {
        this.overload_move_slow = this.GetSpecialValueFor("overload_move_slow")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)

    GetMoveSpeedBonus_Percentage() {
        return this.overload_move_slow
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_storm_spirit_3_stack_debuff extends BaseModifier_Plus {
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
        if (IsServer()) {
            this.IncrementStackCount()
            this.addTimer(params.duration, () => {
                this.DecrementStackCount()
            })
        }
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_storm_spirit_3_particle extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let overload_aoe = this.GetSpecialValueFor("overload_aoe")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_stormspirit/stormspirit_3_explode.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(overload_aoe, overload_aoe, overload_aoe))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
