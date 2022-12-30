import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_huskar_life_break = { "ID": "5274", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "2", "AbilitySound": "Hero_Huskar.Life_Break", "HasScepterUpgrade": "1", "AbilityCastPoint": "0.3 0.3 0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "16 14 12", "AbilityManaCost": "0 0 0", "AbilityCastRange": "550", "AbilityDuration": "3 4 5", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "health_cost_percent": "0.32 0.38 0.44" }, "02": { "var_type": "FIELD_FLOAT", "health_damage": "0.32 0.38 0.44" }, "03": { "var_type": "FIELD_INTEGER", "charge_speed": "1200" }, "04": { "var_type": "FIELD_INTEGER", "tooltip_health_damage": "32 38 44" }, "05": { "var_type": "FIELD_INTEGER", "tooltip_health_cost_percent": "32 38 44", "CalculateSpellDamageTooltip": "1" }, "06": { "var_type": "FIELD_INTEGER", "movespeed": "-60 -60 -60" }, "07": { "var_type": "FIELD_FLOAT", "slow_durtion_tooltip": "3 4 5" }, "08": { "var_type": "FIELD_FLOAT", "taunt_duration": "3.0", "RequiresScepter": "1" }, "09": { "var_type": "FIELD_INTEGER", "cast_range_bonus": "300", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_huskar_life_break extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "huskar_life_break";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_huskar_life_break = Data_huskar_life_break;
    Init() {
        this.SetDefaultSpecialValue("health_cost_percent", [55, 60, 65, 70, 80, 90]);
        this.SetDefaultSpecialValue("duration", 15);

    }

    hLastTarget: CDOTA_BaseNPC;


    CastFilterResultTarget(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        if (hTarget == hCaster) {
            this.errorStr = "dota_hud_error_cant_cast_on_self"
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        return UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, this.GetCasterPlus().GetTeamNumber())
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let duration = this.GetSpecialValueFor("duration")
        let health_cost_percent = this.GetSpecialValueFor("health_cost_percent")
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        if (modifier_huskar_6_debuff.exist(hTarget)) {
            modifier_huskar_6_debuff.remove(hTarget);
        }
        let fMaxHealth = hTarget.GetMaxHealth()
        let fBonusMaxHealth = fMaxHealth * health_cost_percent * 0.01
        modifier_huskar_6_debuff.apply(hTarget, hCaster, this, { duration: duration })
        modifier_huskar_6_buff.apply(hCaster, hCaster, this, { duration: duration, fBonusMaxHealth: fBonusMaxHealth })
        this.hLastTarget = hTarget
    }


    // GetIntrinsicModifierName() {
    //     return "modifier_huskar_6"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_huskar_6 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus() as ability6_huskar_life_break
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus() + caster.GetHullRadius()

            //  优先上一个目标
            let target = GameFunc.IsValid(ability.hLastTarget) && ability.hLastTarget || null
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
                    if (targets[i].GetUnitLabel() == "builder" || targets[i] == caster) {
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
export class modifier_huskar_6_buff extends BaseModifier_Plus {
    fBonusMaxHealth: any;
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
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (!GameFunc.IsValid(hCaster)) {
            return
        }
        if (IsServer()) {
            this.fBonusMaxHealth = params.fBonusMaxHealth || 0
            this.SetStackCount(this.fBonusMaxHealth)
        }
    }

    OnDestroy() {
        super.OnDestroy();
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (!GameFunc.IsValid(hCaster)) {
            return
        }
        if (IsServer()) {
            this.SetStackCount(0)
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        return this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.HEALTH_BONUS)
    G_HEALTH_BONUS() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_huskar_6_debuff extends BaseModifier_Plus {
    health_cost_percent: any;
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
    Init(params: ModifierTable) {
        let hParent = this.GetParentPlus()
        this.health_cost_percent = this.GetSpecialValueFor("health_cost_percent")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return -this.health_cost_percent
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.HP_PERCENTAGE)
    g_HEALTH_PERCENTAGE() {
        return -this.health_cost_percent
    }
}
