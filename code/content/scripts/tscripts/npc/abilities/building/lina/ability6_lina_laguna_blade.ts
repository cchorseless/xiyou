import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { ability3_lina_fiery_soul, modifier_lina_3_fiery_soul } from "./ability3_lina_fiery_soul";

/** dota原技能数据 */
export const Data_lina_laguna_blade = { "ID": "5043", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "FightRecapLevel": "2", "AbilitySound": "Ability.LagunaBladeImpact", "HasShardUpgrade": "1", "HasScepterUpgrade": "1", "AbilityCastRange": "600", "AbilityCastPoint": "0.45 0.45 0.45", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "70 60 50", "AbilityManaCost": "250 400 550", "AbilityModifierSupportValue": "0.0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage": "500 700 900", "LinkedSpecialBonus": "special_bonus_unique_lina_5" }, "02": { "var_type": "FIELD_INTEGER", "cast_range_scepter": "0" }, "03": { "var_type": "FIELD_FLOAT", "damage_delay": "0.25", "CalculateSpellDamageTooltip": "0" }, "04": { "var_type": "FIELD_INTEGER", "scepter_width": "125" } } };

@registerAbility()
export class ability6_lina_laguna_blade extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lina_laguna_blade";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lina_laguna_blade = Data_lina_laguna_blade;
    Init() {
        this.SetDefaultSpecialValue("damage", [5000, 7500, 10000, 12500, 15000, 17500]);
        this.SetDefaultSpecialValue("damage_delay", 0.25);
        this.SetDefaultSpecialValue("overflow_radius", 600);
        this.SetDefaultSpecialValue("mana_coef", 50);
        this.SetDefaultSpecialValue("chance_scepter", 30);
        this.SetDefaultSpecialValue("bonus_radius_shard", 150);
        this.SetDefaultSpecialValue("shard_width", 150);

    }


    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        if (this.GetCasterPlus().HasShard()) {
            return super.GetCastRange(vLocation, hTarget) + this.GetSpecialValueFor("bonus_radius_shard")
        }
        return super.GetCastRange(vLocation, hTarget)
    }
    GetBehavior() {
        let iBehavior = tonumber(tostring(super.GetBehavior()))
        if (this.GetCasterPlus().HasShard()) {
            iBehavior = iBehavior + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT
        }
        return iBehavior
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let target = this.GetCursorTarget()
        if (hCaster.HasShard()) {
            let vPosition = this.GetCursorPosition()
            let vDir = ((vPosition - hCaster.GetAbsOrigin()) as Vector).Normalized()
            vDir.z = 0
            vPosition = (hCaster.GetAbsOrigin() + vDir * (this.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus())) as Vector
            this.ShardOnSpellStart(vPosition)
        } else {
            this.EmitSkill(target, false, true)
        }

        hCaster.EmitSound("Ability.LagunaBlade")
    }

    ScepterMutiCast(target: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let chance_scepter = this.GetSpecialValueFor("chance_scepter")
        let hAbility_4 = ability3_lina_fiery_soul.findIn(hCaster)
        let hModifier = modifier_lina_3_fiery_soul.findIn(hCaster) as IBaseModifier_Plus;
        if (hCaster.HasScepter() && IsValid(hAbility_4) && IsValid(hModifier)) {
            chance_scepter = chance_scepter + hModifier.GetStackCount() * hAbility_4.GetSpecialValueFor("chance_factor")
        }
        if (!hCaster.HasScepter() || !GFuncMath.PRD(chance_scepter, hCaster, "lina_3_scepter")) {
            return
        }
        GTimerHelper.AddTimer(0.5, GHandler.create(this, () => {
            // 死亡了就再随机选取一个单位
            if (!IsValid(target) || !target.IsAlive()) {
                let radius = this.GetCastRange(hCaster.GetAbsOrigin(), hCaster)
                let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER)
                if (targets[0] != null) {
                    target = targets[0]
                }
            }
            if (IsValid(target) && target.IsAlive()) {
                this.EmitSkill(target, true, true)
                hCaster.EmitSound("Ability.LagunaBlade")
            }
        }))
    }

    EmitSkill(target: IBaseNpc_Plus, bIgnoreSpellAbsorb: boolean, bScepterMultiCast: boolean) {
        if (target == null) { return }

        let hCaster = this.GetCasterPlus()
        let damage_delay = this.GetSpecialValueFor("damage_delay")

        if (bIgnoreSpellAbsorb || !target.TriggerSpellAbsorb(this)) {
            modifier_lina_6_damage.apply(target, hCaster, this, { duration: damage_delay })

            EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Ability.LagunaBladeImpact", hCaster), hCaster)
            if (bScepterMultiCast) {
                this.ScepterMutiCast(target)
            }
        }
    }
    ShardOnSpellStart(vPosition: Vector) {
        let hCaster = this.GetCasterPlus()
        vPosition.z = GetGroundHeight(vPosition, hCaster) + 32
        let damage_delay = this.GetSpecialValueFor("damage_delay")
        let shard_width = this.GetSpecialValueFor("shard_width")
        let chance_scepter = this.GetSpecialValueFor("chance_scepter")
        let hAbility_4 = ability3_lina_fiery_soul.findIn(hCaster)
        let hModifier = modifier_lina_3_fiery_soul.findIn(hCaster) as IBaseModifier_Plus;
        let particleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_lina/lina_spell_laguna_blade.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControlEnt(particleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", (hCaster.GetAbsOrigin() + Vector(0, 0, 96)) as Vector, true)
        ParticleManager.SetParticleControlEnt(particleID, 1, null, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", vPosition, true)
        ParticleManager.ReleaseParticleIndex(particleID)
        let particleID1 = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_lina/lina_spell_laguna_blade_shard_scorch.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControlEnt(particleID1, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", (hCaster.GetAbsOrigin() + Vector(0, 0, 96)) as Vector, true)
        ParticleManager.SetParticleControlEnt(particleID1, 1, null, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", vPosition, true)
        //  ParticleManager.ReleaseParticleIndex(particleID1)
        //  hCaster.GameTimer(damage_delay, () => {
        // 先选择怪物
        let tTarget = FindUnitsInLine(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), vPosition, null, shard_width, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE)
        for (let hTarget of (tTarget)) {

            if (!hTarget.TriggerSpellAbsorb(this)) {
                modifier_lina_6_damage.apply(hTarget, hCaster, this, { duration: damage_delay, bShard: 1 })
                EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Ability.LagunaBladeImpact", hCaster), hCaster)
            }
        }
        if (hCaster.HasScepter() && IsValid(hAbility_4) && IsValid(hModifier)) {
            chance_scepter = chance_scepter + hModifier.GetStackCount() * hAbility_4.GetSpecialValueFor("chance_factor")
            if (GFuncMath.PRD(chance_scepter, hCaster, "lina_3_scepter")) {
                GTimerHelper.AddTimer(0.5, GHandler.create(this, () => {
                    this.ShardOnSpellStart(vPosition)
                }))
            }
        }
        ParticleManager.DestroyParticle(particleID1, false)
        //  })
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_lina_6"
    // }




}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lina_6 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus()
            if (!IsValid(ability)) {
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

            //  优先攻击目标
            let target = hCaster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
            if (target != null && !target.IsPositionInRange(hCaster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[0]
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lina_6_damage extends BaseModifier_Plus {
    bShard: any;
    overflow_radius: number;
    mana_coef: number;
    damage: number;
    damage_type: DAMAGE_TYPES;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.damage = this.GetSpecialValueFor("damage")
        this.mana_coef = this.GetSpecialValueFor("mana_coef")
        this.overflow_radius = this.GetSpecialValueFor("overflow_radius")
        if (IsServer()) {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
            this.bShard = params.bShard == 1
            if (!this.bShard) {
                let particleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_lina/lina_spell_laguna_blade.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: null
                });

                ParticleManager.SetParticleControlEnt(particleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", (hCaster.GetAbsOrigin() + Vector(0, 0, 96) as Vector), true)
                ParticleManager.SetParticleControlEnt(particleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
                ParticleManager.ReleaseParticleIndex(particleID)
            }
        }
    }
    BeDestroy() {

        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let target = this.GetParentPlus()
            let damage = this.damage
            if (IsValid(hCaster)) {
                damage = damage + hCaster.GetMaxMana() * this.mana_coef / 100
            }

            // 天赋5每次施法增加伤害
            if (hCaster.HasTalent("special_bonus_unique_lina_custom_5")) {
                let damage_add = hCaster.GetTalentValue("special_bonus_unique_lina_custom_5")
                let duration = hCaster.GetTalentValue("special_bonus_unique_lina_custom_5", "duration")
                let mark_modifer = modifier_lina_6_talent_5_mark.findIn(target)
                if (mark_modifer) {
                    let count = mark_modifer.GetStackCount()
                    damage = damage * (1 + count * damage_add / 100)
                }
                modifier_lina_6_talent_5_mark.apply(target, hCaster, this.GetAbilityPlus(), { duration: duration })
            }

            let targetHp = target.GetHealth()
            if (this.bShard) {
                let particleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_lina/lina_spell_laguna_blade_shard_units_hit.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: null
                });

                ParticleManager.SetParticleControlEnt(particleID, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true)
                ParticleManager.ReleaseParticleIndex(particleID)
            }

            let damage_table = {
                ability: this.GetAbilityPlus(),
                victim: target,
                attacker: hCaster,
                damage: damage,
                damage_type: this.damage_type
            }
            // let overflowDamage = math.max(BattleHelper.GoApplyDamage(damage_table) - targetHp, 0)
            // if (overflowDamage > 0) {
            //     let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), target.GetAbsOrigin(), this.overflow_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_CLOSEST)
            //     for (let _target of (targets)) {


            //         if (target != _target) {
            //              modifier_lina_6_particle_overflow.apply( hCaster , _target, this.GetAbilityPlus(), { duration =  BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

            //             let damage_table = {
            //                 ability: this.GetAbilityPlus(),
            //                 victim: _target,
            //                 attacker: hCaster,
            //                 damage: overflowDamage,
            //                 damage_type: this.damage_type
            //             }
            //             BattleHelper.GoApplyDamage(damage_table)
            //         }
            //     }
            // }
        }
    }
}

// // // // // // // // // // // // // // // // // // // -modifier_lina_6_talent_5_mark// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lina_6_talent_5_mark extends BaseModifier_Plus {
    damage_add: number;
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
        this.damage_add = this.GetCasterPlus().GetTalentValue("special_bonus_unique_lina_custom_5")
        if (IsServer()) {
            this.IncrementStackCount()
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip(params: IModifierTable) {
        return this.damage_add * this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lina_6_particle_overflow extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetParentPlus()
        let hParent = this.GetCasterPlus()
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lina/lina_spell_laguna_blade_damage_overflow.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", (hCaster.GetAbsOrigin() + Vector(0, 0, 96) as Vector), true)
            ParticleManager.SetParticleControlEnt(particleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}
