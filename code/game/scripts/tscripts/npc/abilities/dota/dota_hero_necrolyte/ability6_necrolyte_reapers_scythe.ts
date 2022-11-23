import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_necrolyte_reapers_scythe = { "ID": "5161", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "FightRecapLevel": "2", "AbilitySound": "Hero_Necrolyte.ReapersScythe.Target", "AbilityCastPoint": "0.45", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "120", "AbilityManaCost": "200 350 500", "AbilityCastRange": "600", "AbilityModifierSupportValue": "0.1", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "damage_per_health": "0.7 0.8 0.9" }, "02": { "var_type": "FIELD_FLOAT", "stun_duration": "1.5 1.5 1.5" }, "03": { "var_type": "FIELD_INTEGER", "respawn_constant": "15 25 35" } } };

@registerAbility()
export class ability6_necrolyte_reapers_scythe extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "necrolyte_reapers_scythe";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_necrolyte_reapers_scythe = Data_necrolyte_reapers_scythe;
    Init() {
        this.SetDefaultSpecialValue("stun_duration", 1.5);
        this.SetDefaultSpecialValue("damage_factor", [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]);
        this.SetDefaultSpecialValue("scepter_aoe_radius", 800);
        this.SetDefaultSpecialValue("max_mana_damage_factor", 9);
        this.SetDefaultSpecialValue("max_health_damage_factor", 20);
        this.SetDefaultSpecialValue("scepter_extra_count", 2);
        this.SetDefaultSpecialValue("scepter_cd_reduce", 2);

    }

    Init_old() {
        this.SetDefaultSpecialValue("stun_duration", 1.5);
        this.SetDefaultSpecialValue("damage_factor", [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]);
        this.SetDefaultSpecialValue("scepter_aoe_radius", 800);
        this.SetDefaultSpecialValue("scepter_extra_count", 2);
        this.SetDefaultSpecialValue("max_mana_damage_factor", 9);
        this.SetDefaultSpecialValue("max_health_damage_factor", 20);

    }


    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        let reduce = 0
        if (hCaster.HasScepter()) {
            reduce = this.GetSpecialValueFor("scepter_cd_reduce")
        }
        return super.GetCooldown(iLevel) - reduce
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()

        let stun_duration = this.GetSpecialValueFor("stun_duration")
        let damage_factor = this.GetSpecialValueFor("damage_factor")
        let scepter_aoe_radius = this.GetSpecialValueFor("scepter_aoe_radius")
        let scepter_extra_count = this.GetSpecialValueFor("scepter_extra_count")
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        if (hTarget.TriggerSpellAbsorb(this)) {
            return
        }
        // 声音
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Necrolyte.ReapersScythe.Cast", hCaster))

        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        this.ApplyDamage(hTarget)
        if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
            modifier_necrolyte_6_stun.apply(hTarget, hCaster, this, { duration: stun_duration })
        }

        if (hCaster.HasScepter()) {
            let teamFilter = this.GetAbilityTargetTeam()
            let typeFilter = this.GetAbilityTargetType()
            let flagFilter = this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), scepter_aoe_radius, null, teamFilter, typeFilter, flagFilter, FindOrder.FIND_ANY_ORDER)
            let iCount = 0
            for (let hUnit of (tTargets)) {
                if (hUnit != hTarget) {
                    this.ApplyDamage(hTarget)
                    if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                        modifier_necrolyte_6_stun.apply(hUnit, hCaster, this, { duration: stun_duration })
                    }

                    iCount = iCount + 1
                    if (iCount >= scepter_extra_count) {
                        break
                    }
                }
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_necrolyte_6"
    }
    ApplyDamage(hUnit: BaseNpc_Plus) {
        if (!GameFunc.IsValid(hUnit)
            || !hUnit.IsAlive()) {
            return
        }

        let hCaster = this.GetCasterPlus()
        let fMaxHealth = hCaster.GetMaxHealth()
        let max_health_damage_factor = this.GetSpecialValueFor("max_health_damage_factor")
        let max_mana_damage_factor = this.GetSpecialValueFor("max_mana_damage_factor")

        let fDamage = math.min(fMaxHealth * max_health_damage_factor * 0.01, hCaster.GetMaxMana() * max_mana_damage_factor)
        // 给予当前单位伤害
        let tDamageTable = {
            victim: hUnit,
            attacker: hCaster,
            damage: fDamage,
            damage_type: this.GetAbilityDamageType(),
            ability: this,
        }
        BattleHelper.GoApplyDamage(tDamageTable)
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_necrolyte_6 extends BaseModifier_Plus {
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
            if (ability == null || ability.IsNull()) {
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
            if (target != null && modifier_necrolyte_6_stun.exist(target)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + ability.GetAbilityTargetFlags()
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                for (let unit of (targets)) {
                    if (!modifier_necrolyte_6_stun.exist(unit)) {
                        target = unit
                        break
                    }
                }
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR_PERCENTAGE)
    EOM_GetModifierIgnoreMagicalArmorPercentage(params: ModifierTable) {
        if (IsServer()) {
            if (params != null && params.inflictor == this.GetAbilityPlus()) {
                return this.GetCasterPlus().GetTalentValue("special_bonus_unique_necrolyte_custom_7")
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_necrolyte_6_stun extends BaseModifier_Plus {
    damage_factor: number;
    max_mana_damage_factor: number;
    passing: boolean;
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
        return true
    }
    RemoveOnDeath() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: ModifierTable) {
        let hTarget = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_necrolyte_custom_6"
        this.damage_factor = this.GetSpecialValueFor("damage_factor")
        this.max_mana_damage_factor = this.GetSpecialValueFor("max_mana_damage_factor") + hCaster.GetTalentValue(sTalentName)
        if (params.IsOnCreated && IsServer()) {
            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Necrolyte.ReapersScythe.Target", hCaster), hCaster)
        } else if (params.IsOnCreated && IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_necrolyte/necrolyte_scythe.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_necrolyte/necrolyte_scythe_start.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }

    OnDestroy() {
        super.OnDestroy();
        let hTarget = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hTarget)) {
                return
            }
            let fLoseHealth = math.max(hTarget.GetMaxHealth() - hTarget.GetHealth(), 0)
            let fDamage = math.min(fLoseHealth * this.damage_factor, this.GetCasterPlus().GetMaxMana() * this.max_mana_damage_factor)
            // 给予当前单位伤害
            let tDamageTable = {
                victim: hTarget,
                attacker: hCaster,
                damage: fDamage,
                damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                ability: this.GetAbilityPlus(),
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_necrolyte/necrolyte_scythe_orig.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_DISABLED
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MIN_HEALTH)
    GetMinHealth() {
        if (!this.passing) {
            return 1
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    OnTakeDamage(params: ModifierTable) {
        if (GameFunc.IsValid(params.unit) && params.unit == this.GetParentPlus() && !this.passing) {
            if (params.damage >= params.unit.GetHealth()) {
                this.passing = true
                params.unit.Kill(this.GetAbilityPlus(), this.GetCasterPlus())
                this.passing = false
            }
        }
    }
}
