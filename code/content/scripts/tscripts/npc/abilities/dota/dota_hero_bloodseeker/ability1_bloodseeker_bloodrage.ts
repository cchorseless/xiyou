import { GameSetting } from "../../../../GameSetting";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_bloodseeker_bloodrage = { "ID": "5015", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "hero_bloodseeker.bloodRage", "HasShardUpgrade": "1", "AbilityCastPoint": "0.2", "AbilityManaCost": "25", "AbilityCooldown": "14 12 10 8", "AbilityCastRange": "800", "AbilityModifierSupportValue": "0.1", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "8" }, "02": { "var_type": "FIELD_INTEGER", "attack_speed": "60 90 120 150", "LinkedSpecialBonus": "special_bonus_unique_bloodseeker_5" }, "03": { "var_type": "FIELD_INTEGER", "spell_amp": "15 20 25 30" }, "04": { "var_type": "FIELD_FLOAT", "damage_pct": "2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1", "AbilityCastGestureSlot": "DEFAULT" };

@registerAbility()
export class ability1_bloodseeker_bloodrage extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bloodseeker_bloodrage";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bloodseeker_bloodrage = Data_bloodseeker_bloodrage;
    Init() {
        this.SetDefaultSpecialValue("per_lose_max_health_ptg", 10);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("bonus_amplify_damage", [20, 25, 30, 35, 40, 50]);
        this.SetDefaultSpecialValue("bonus_attack_ptg", [200, 250, 300, 350, 400, 500]);
        this.SetDefaultSpecialValue("reduce_amplify_damage_ptg", [1, 1, 2, 2, 3, 3]);
        this.SetDefaultSpecialValue("reduce_attack_ptg", [10, 10, 20, 20, 30, 30]);
        this.SetDefaultSpecialValue("damage_max_health_pct", 2.5);

    }

    hLastTarget: CDOTA_BaseNPC;


    CastFilterResultTarget(hTarget: IBaseNpc_Plus) {
        if (IsServer()) {
            if (hTarget.GetUnitLabel() != "HERO") {
                this.errorStr = "dota_hud_error_only_can_cast_on_hero_building"
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
            return UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber())
        }
    }

    OnSpellStart() {
        this.hLastTarget = this.GetCursorTarget()
        let hTarget = this.GetCursorTarget()
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        if (!IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("hero_bloodseeker.bloodRage", hCaster), hCaster)
        modifier_bloodseeker_1_buff.apply(hTarget, hCaster, this, { duration: duration })
    }

    GetIntrinsicModifierName() {
        return "modifier_bloodseeker_1"
    }
    OnStolen(hSourceAbility: this) {
        this.hLastTarget = hSourceAbility.hLastTarget
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bloodseeker_1 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus() as ability1_bloodseeker_bloodrage
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
            // 无敌方单位，不会自动释放
            let tTarget = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), null, range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            if (!IsValid(tTarget[0])) {
                return
            }
            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags()
                let order = FindOrder.FIND_CLOSEST
                let targets = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), null, range, teamFilter, typeFilter, flagFilter, order, false)
                for (let i = targets.length - 1; i >= 0; i--) {
                    if (targets[i].GetUnitLabel() != "HERO") {
                        table.remove(targets, i)
                    }
                }
                target = targets[0]
            }
            if (target != null && modifier_bloodseeker_1_buff.exist(target)) {
                return
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
export class modifier_bloodseeker_1_buff extends BaseModifier_Plus {
    bonus_amplify_damage: number;
    bonus_attack_ptg: number;
    damage_max_health_pct: number;
    reduce_amplify_damage_ptg: number;
    per_lose_max_health_ptg: number;
    reduce_attack_ptg: number;
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
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.StartIntervalThink(1)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_bloodseeker/bloodseeker_bloodrage.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.per_lose_max_health_ptg = this.GetSpecialValueFor("per_lose_max_health_ptg")
        this.bonus_amplify_damage = this.GetSpecialValueFor("bonus_amplify_damage") + hCaster.GetTalentValue("special_bonus_unique_bloodseeker_custom_8", "amplify_damage_ptg")
        this.bonus_attack_ptg = this.GetSpecialValueFor("bonus_attack_ptg") + hCaster.GetTalentValue("special_bonus_unique_bloodseeker_custom_8", "attack_damage_ptg")
        this.reduce_amplify_damage_ptg = this.GetSpecialValueFor("reduce_amplify_damage_ptg")
        this.reduce_attack_ptg = this.GetSpecialValueFor("reduce_attack_ptg")
        this.damage_max_health_pct = this.GetSpecialValueFor("damage_max_health_pct")
    }
    BeDestroy() {

        if (IsServer()) {
            this.StartIntervalThink(-1)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            let iLoseHealth = hParent.GetHealth() * this.per_lose_max_health_ptg * 0.01
            hParent.ModifyHealth(hParent.GetHealth() - iLoseHealth, hAbility, false, 0)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    CC_GetModifierSpellAmplifyBonus() {
        return this.bonus_amplify_damage - this.reduce_amplify_damage_ptg * (100 - this.GetParentPlus().GetHealthPercent()) / this.per_lose_max_health_ptg
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: IModifierTable) {
        if (!IsValid(params.target)) { return }
        if (params.target.GetClassname() == "dota_item_drop") { return }
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsValid(hCaster) && params.attacker == hParent && hCaster == hParent && hCaster.HasShard()) {
            let fDamage = params.target.GetHealth() * this.damage_max_health_pct * 0.01
            let damage_table =
            {
                ability: this.GetAbilityPlus(),
                attacker: hParent,
                victim: params.target,
                damage: fDamage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_USE_COMBAT_PROFICIENCY,
                extra_flags: BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_NO_SPELL_CRIT + BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_NO_DAMAGE_AMPLIFY,

            }
            BattleHelper.GoApplyDamage(damage_table)
        }
    }
    // 百分比攻击力
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    GetBaseDamageOutgoing_Percentage() {
        return this.bonus_attack_ptg - this.reduce_attack_ptg * (100 - this.GetParentPlus().GetHealthPercent()) / this.per_lose_max_health_ptg
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    On_Tooltip2() {
        return this.bonus_amplify_damage - this.reduce_amplify_damage_ptg * (100 - this.GetParentPlus().GetHealthPercent()) / this.per_lose_max_health_ptg
    }
}
