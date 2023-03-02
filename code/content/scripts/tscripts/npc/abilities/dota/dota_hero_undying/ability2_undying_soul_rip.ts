
import { GameSetting } from "../../../../GameSetting";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_undying_soul_rip = { "ID": "5443", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_CUSTOM", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_CUSTOM", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Undying.SoulRip.Cast", "AbilityCastAnimation": "ACT_DOTA_UNDYING_SOUL_RIP", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0.35", "AbilityCastRange": "750", "AbilityCooldown": "24.0 18.0 12.0 6.0", "AbilityManaCost": "100 110 120 130", "AbilityModifierSupportValue": "0.0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage_per_unit": "19 26 33 40", "LinkedSpecialBonus": "special_bonus_unique_undying_6" }, "02": { "var_type": "FIELD_INTEGER", "max_units": "8 9 10 11" }, "03": { "var_type": "FIELD_INTEGER", "radius": "1300" }, "04": { "var_type": "FIELD_INTEGER", "tombstone_heal": "4 8 12 16" } } };

@registerAbility()
export class ability2_undying_soul_rip extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "undying_soul_rip";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_undying_soul_rip = Data_undying_soul_rip;
    Init() {
        this.SetDefaultSpecialValue("damage_per_unit", [220, 290, 360, 430, 500, 570]);
        this.SetDefaultSpecialValue("max_units", [6, 8, 10, 12, 14, 16]);
        this.SetDefaultSpecialValue("radius", 1300);
        this.SetDefaultSpecialValue("damage_radius", 600);
        this.SetDefaultSpecialValue("damage_per_unit_pct", 5);

    }

    Init_old() {
        this.SetDefaultSpecialValue("damage_per_unit", [220, 290, 360, 430, 500, 570]);
        this.SetDefaultSpecialValue("max_units", [6, 8, 10, 12, 14, 16]);
        this.SetDefaultSpecialValue("radius", 1300);
        this.SetDefaultSpecialValue("damage_radius", 600);

    }

    hLastTarget: any;

    OnSpellStart() {
        let hTarget = this.GetCursorTarget()
        if (hTarget.TriggerSpellAbsorb(this)) {
            return
        }
        let hCaster = this.GetCasterPlus() as BaseNpc_Hero_Plus
        let fRadius = this.GetSpecialValueFor("radius")
        let fDamageRadius = this.GetSpecialValueFor("damage_radius")
        let fDamagePerUnit = this.GetSpecialValueFor("fDamagePerUnit")
        let flDuration = this.GetDuration() + hCaster.GetTalentValue("special_bonus_unique_undying_custom_1")
        let iMaxUnits = this.GetSpecialValueFor("max_units")
        let fTombstoneHeal = this.GetSpecialValueFor("tombstone_heal")
        let tUnits = FindUnitsInRadius(
            hCaster.GetTeamNumber(),
            hCaster.GetAbsOrigin(),
            null,
            fRadius,
            DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH,
            DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
            DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
            FindOrder.FIND_ANY_ORDER,
            false
        )

        for (let i = tUnits.length - 1; i >= 0; i--) {
            let hUnit = tUnits[i]
            if (hUnit == null
                || !hUnit.IsAlive()
                || hUnit.GetEntityIndex() == hCaster.GetEntityIndex()
                || hUnit.GetEntityIndex() == hTarget.GetEntityIndex()
            ) {
                table.remove(tUnits, i)
            }
        }

        if (tUnits.length > iMaxUnits) {
            let iRemove = tUnits.length - iMaxUnits
            for (let i = 1; i <= iRemove; i++) {
                let iRemoveIndex = RandomInt(1, tUnits.length)
                table.remove(tUnits, iRemoveIndex)
            }
        }

        let iValidCount = tUnits.length
        let fAmount = iValidCount * fDamagePerUnit
        let iExtraDamage = hCaster.GetStrength()
        let fDamage = fAmount + iExtraDamage

        let bIsTombstone = hTarget.IsOther() && string.find(hTarget.GetUnitName(), "npc_dota_unit_tombstone") != null
        if (hTarget.GetTeamNumber() == hCaster.GetTeamNumber()) {
            if (bIsTombstone) {
                hTarget.Heal(fTombstoneHeal, this)
            } else {
                hTarget.Heal(fAmount, this)
                SendOverheadEventMessage(hTarget.GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, hTarget, fAmount, hCaster.GetPlayerOwner())
            }
        } else {
            if (!bIsTombstone) {
                let tDamage = {
                    attacker: hCaster,
                    damage: fDamage,
                    damage_type: this.GetAbilityDamageType(),
                    ability: this,
                    victim: hTarget
                }
                BattleHelper.GoApplyDamage(tDamage)
            }
        }

        for (let hUnit of (tUnits)) {
            if (!(hUnit as IBaseNpc_Plus).IsFriendly(hCaster)) {
                let tDamage = {
                    attacker: hCaster,
                    damage: fDamagePerUnit,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS, //  + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL,
                    ability: this,
                    victim: hUnit
                }
                BattleHelper.GoApplyDamage(tDamage)
            }

            modifier_undying_2_particle_target.apply(hUnit, hTarget, this, {
                duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION,
                iTeamNumb: hCaster.GetTeamNumber(),
            })
        }
        modifier_undying_2_health_buff.apply(hTarget, hCaster, this, { duration: flDuration, iUnits: tUnits.length })

        tUnits = FindUnitsInRadius(
            hCaster.GetTeamNumber(),
            hCaster.GetAbsOrigin(),
            null,
            fDamageRadius,
            DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
            DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE,
            FindOrder.FIND_ANY_ORDER,
            false
        )
        for (let hUnit of (tUnits)) {
            let tDamage = {
                attacker: hCaster,
                damage: tUnits.length * fDamagePerUnit,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this,
                victim: hUnit
            }
            BattleHelper.GoApplyDamage(tDamage)
        }

        modifier_undying_2_particle_start.apply(hCaster, hTarget, this, {
            duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION,
            iUnitsCount: tUnits.length,
        })

        let sSoundCast = "Hero_Undying.SoulRip.Cast"
        EmitSoundOn(sSoundCast, this.GetCasterPlus())
        this.hLastTarget = hTarget
    }

    OnOwnerDied() {
        let sSoundCast = "Hero_Undying.SoulRip.Cast"
        StopSoundOn(sSoundCast, this.GetCasterPlus())
    }

    GetIntrinsicModifierName() {
        return "modifier_undying_2"
    }

    OnStolen(hSourceAbility: this) {
        this.hLastTarget = hSourceAbility.hLastTarget
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_undying_2 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus() as ability2_undying_soul_rip
            if (!GFuncEntity.IsValid(ability)) {
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
            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus() + caster.GetHullRadius()
            //  优先上一个目标
            let target = GFuncEntity.IsValid(ability.hLastTarget) && ability.hLastTarget || null
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range + target.GetHullRadius())) {
                target = null
            }
            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags()
                let order = FindOrder.FIND_CLOSEST
                let targets = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), null, range, teamFilter, typeFilter, flagFilter, order, false)
                for (let i = targets.length - 1; i >= 0; i--) {
                    if (targets[i].GetUnitLabel() == "builder") {
                        table.remove(targets, i)
                    }
                }
                //  优先英雄单位
                table.sort(targets, (a, b) => {
                    return a.GetUnitLabel() == "HERO" && b.GetUnitLabel() != "HERO"
                })
                target = targets[0]
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
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
export class modifier_undying_2_health_buff extends BaseModifier_Plus {
    damage_per_unit: number;
    damage_per_unit_pct: number;
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
        this.damage_per_unit = this.GetSpecialValueFor("damage_per_unit")
        this.damage_per_unit_pct = this.GetSpecialValueFor("damage_per_unit_pct")
        let iUnits = params.iUnits
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            this.changeStackCount(iUnits)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-iUnits)
            })
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus() {
        return this.GetStackCount() * this.damage_per_unit
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS)
    CC_GetModifierHealthPercentage() {
        if (GFuncEntity.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard()) {
            return this.GetStackCount() * this.damage_per_unit_pct
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return this.GetStackCount() * this.damage_per_unit
    }
}

// 特效
@registerModifier()
export class modifier_undying_2_particle_target extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hTarget = this.GetCasterPlus()
            let hUnit = this.GetParentPlus()
            let sParticleCast = "particles/units/heroes/hero_undying/undying_soul_rip_damage.vpcf"
            if (hTarget.GetTeamNumber() == this.GetStackCount()) {
                sParticleCast = "particles/units/heroes/hero_undying/undying_soul_rip_heal.vpcf"
            }
            let iParticle = ResHelper.CreateParticle({
                resPath: sParticleCast,
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
                owner: hTarget
            });

            ParticleManager.SetParticleControlEnt(iParticle, 0, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticle, 1, hUnit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hUnit.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticle)
        } else {
            this.SetStackCount(params.iTeamNumb)
        }
    }
}

// 特效
@registerModifier()
export class modifier_undying_2_particle_start extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hTarget = this.GetCasterPlus()
            let iParticle = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_undying/undying_decay_aoe.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
                owner: hTarget
            });

            ParticleManager.SetParticleControl(iParticle, 1, Vector(this.GetStackCount() * 10, 0, 0))
            ParticleManager.ReleaseParticleIndex(iParticle)
        } else {
            this.SetStackCount(params.iUnitsCount)
        }
    }
}
