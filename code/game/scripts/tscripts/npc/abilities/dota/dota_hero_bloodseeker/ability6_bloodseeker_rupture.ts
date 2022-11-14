import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_bleeding } from "../../../modifier/effect/modifier_bleeding";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
/** dota原技能数据 */
export const Data_bloodseeker_rupture = { "ID": "5018", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "FightRecapLevel": "2", "AbilitySound": "hero_bloodseeker.rupture", "HasScepterUpgrade": "1", "AbilityCastPoint": "0.4", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "70", "AbilityManaCost": "100 150 200", "AbilityCastRange": "800", "AbilityModifierSupportValue": "0.0", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "10 11 12" }, "02": { "var_type": "FIELD_INTEGER", "movement_damage_pct": "33 44 55", "CalculateSpellDamageTooltip": "0" }, "03": { "var_type": "FIELD_FLOAT", "hp_pct": "10", "CalculateSpellDamageTooltip": "0" }, "04": { "var_type": "FIELD_INTEGER", "damage_cap_amount": "200", "CalculateSpellDamageTooltip": "0" }, "05": { "var_type": "FIELD_INTEGER", "abilitycastrange": "", "LinkedSpecialBonus": "special_bonus_unique_bloodseeker_3" }, "06": { "var_type": "FIELD_INTEGER", "max_charges_scepter": "2", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_INTEGER", "charge_restore_time_scepter": "40", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_bloodseeker_rupture extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bloodseeker_rupture";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bloodseeker_rupture = Data_bloodseeker_rupture;
    Init() {
        this.SetDefaultSpecialValue("bleed_damage", [3000, 3200, 3500, 4000, 4500, 6000]);
        this.SetDefaultSpecialValue("all_stats_bleed_damage", [3, 3.5, 4, 4.5, 5, 6]);
        this.SetDefaultSpecialValue("radius", 350);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("trigger_chance", 50);

    }



    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget() as BaseNpc_Plus
        let radius = this.GetSpecialValueFor("radius")
        let bleed_damage = this.GetSpecialValueFor("bleed_damage")
        let duration = this.GetSpecialValueFor("duration")
        let all_stats_bleed_damage = this.GetSpecialValueFor("all_stats_bleed_damage") + hCaster.GetTalentValue("special_bonus_unique_bloodseeker_custom_7")
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        if (hTarget.TriggerSpellAbsorb(this)) {
            return
        }
        // 音效
        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("hero_bloodseeker.rupture", hCaster), hCaster)
        let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
        let fDamage = bleed_damage + (hCaster.GetStrength() + hCaster.GetAgility() + hCaster.GetIntellect()) * all_stats_bleed_damage
        for (let hTarget of (tTarget as BaseNpc_Plus[])) {

            if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                // 添加流血层数
                modifier_bleeding.Bleeding(hTarget, hCaster, this, duration, (tDamageTable) => {
                    return fDamage
                }, true)
                if (hCaster.HasTalent("special_bonus_unique_bloodseeker_custom_5")) {
                    modifier_bloodseeker_6_amplify_pure.apply(hTarget, hCaster, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })
                }
            }
        }
    }
    OnCastAbility(hTarget: BaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let bleed_damage = this.GetSpecialValueFor("bleed_damage")
        let duration = this.GetSpecialValueFor("duration")
        let all_stats_bleed_damage = this.GetSpecialValueFor("all_stats_bleed_damage") + hCaster.GetTalentValue("special_bonus_unique_bloodseeker_custom_7")
        let fDamage = bleed_damage + (hCaster.GetStrength() + hCaster.GetAgility() + hCaster.GetIntellect()) * all_stats_bleed_damage
        if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
            // 添加流血层数
            modifier_bleeding.Bleeding(hTarget, hCaster, this, duration, (tDamageTable) => {
                return fDamage
            }, true)
            if (hCaster.HasTalent("special_bonus_unique_bloodseeker_custom_5")) {
                modifier_bloodseeker_6_amplify_pure.apply(hTarget, hCaster, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_bloodseeker_6"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bloodseeker_6 extends BaseModifier_Plus {
    trigger_chance: number;
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
    Init(params: ModifierTable) {
        this.trigger_chance = this.GetSpecialValueFor("trigger_chance")
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierTable) {
        let hParent = this.GetParentPlus()
        if (!GameFunc.IsValid(params.target) || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == hParent && !params.attacker.IsIllusion() && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, hParent.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            let ability = this.GetAbilityPlus() as ability6_bloodseeker_rupture
            if (hParent.HasScepter() && GameFunc.mathUtil.PRD(this.trigger_chance, hParent, "modifier_bloodseeker_6") && ability.OnCastAbility != null) {
                ability.OnCastAbility(params.target)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bloodseeker_6_amplify_pure extends BaseModifier_Plus {
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
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_PURE_DAMAGE_PERCENTAGE)
    G_INCOMING_PURE_DAMAGE_PERCENTAGE() {
        return this.GetCasterPlus().GetTalentValue("special_bonus_unique_bloodseeker_custom_5")
    }
}
