
import { GameSetting } from "../../../../GameSetting";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_omniknight_repel = { "ID": "5264", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Omniknight.Repel", "AbilityCastRange": "500", "AbilityCastPoint": "0.25", "AbilityCooldown": "26 22 18 14", "AbilityManaCost": "80 90 100 110", "AbilityModifierSupportValue": "3.0", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "10" }, "02": { "var_type": "FIELD_INTEGER", "status_resistance": "50" }, "03": { "var_type": "FIELD_INTEGER", "bonus_str": "8 16 24 32" }, "04": { "var_type": "FIELD_INTEGER", "hp_regen": "8 12 16 20", "LinkedSpecialBonus": "special_bonus_unique_omniknight_5" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_omniknight_repel extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "omniknight_repel";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_omniknight_repel = Data_omniknight_repel;
    Init() {
        this.SetDefaultSpecialValue("duration", 12);
        this.SetDefaultSpecialValue("attribute_per_level", [60, 120, 180, 240, 300, 360]);
        this.SetDefaultSpecialValue("status_resistance_percent", 20);

    }

    Init_old() {
        this.SetDefaultSpecialValue("duration", 12);
        this.SetDefaultSpecialValue("attribute_per_level", [60, 120, 180, 240, 300, 360]);

    }

    hLastTarget: CDOTA_BaseNPC;


    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_unique_omniknight_custom_5")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        if (!IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        let duration = this.GetSpecialValueFor("duration")
        modifier_omniknight_2_buff.apply(hTarget, hCaster, this, { duration: duration })
        this.hLastTarget = hTarget
    }

    GetIntrinsicModifierName() {
        return "modifier_omniknight_2"
    }

    OnStolen(hSourceAbility: this) {
        this.hLastTarget = hSourceAbility.hLastTarget
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_omniknight_2 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus() as ability2_omniknight_repel
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus() + caster.GetHullRadius()

            //  优先上一个目标
            let target = IsValid(ability.hLastTarget) && ability.hLastTarget || null
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
// Modifiers
@registerModifier()
export class modifier_omniknight_2_buff extends BaseModifier_Plus {
    attribute_per_level: number;
    status_resistance_percent: number;
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
        if (!IsValid(hCaster)) {
            this.Destroy()
            return
        }
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.attribute_per_level = this.GetSpecialValueFor("attribute_per_level") + hCaster.GetTalentValue("special_bonus_unique_omniknight_custom_1")
        this.status_resistance_percent = this.GetSpecialValueFor("status_resistance_percent")
        if (IsServer()) {

            this.IncrementStackCount()

            GTimerHelper.AddTimer(params.duration, GHandler.create(this, () => {
                this.DecrementStackCount()
            }))

        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_omniknight/omniknight_heavenly_grace_buff.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.attribute_per_level * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking() {
        return this.status_resistance_percent * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_PRIMARY_BASE)
    CC_GetModifierBaseStats_Primary() {
        return this.GetStackCount() * this.attribute_per_level
    }
}
