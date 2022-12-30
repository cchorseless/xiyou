import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { ability6_magnataur_reverse_polarity } from "./ability6_magnataur_reverse_polarity";

/** dota原技能数据 */
export const Data_magnataur_empower = { "ID": "5519", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_Magnataur.Empower.Cast", "AbilityCastRange": "800", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "8", "AbilityManaCost": "45 60 75 90", "AbilityModifierSupportValue": "0.3", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "empower_duration": "40" }, "02": { "var_type": "FIELD_INTEGER", "bonus_damage_pct": "12 20 28 36", "LinkedSpecialBonus": "special_bonus_unique_magnus_2" }, "03": { "var_type": "FIELD_FLOAT", "cleave_damage_pct": "10 20 30 40", "LinkedSpecialBonus": "special_bonus_unique_magnus_2" }, "04": { "var_type": "FIELD_INTEGER", "cleave_starting_width": "150" }, "05": { "var_type": "FIELD_INTEGER", "cleave_ending_width": "360" }, "06": { "var_type": "FIELD_INTEGER", "cleave_distance": "650" }, "07": { "var_type": "FIELD_INTEGER", "aura_radius": "900" }, "08": { "var_type": "FIELD_FLOAT", "self_multiplier": "75" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_magnataur_empower extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "magnataur_empower";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_magnataur_empower = Data_magnataur_empower;
    Init() {
        this.SetDefaultSpecialValue("empower_duration", 10);
        this.SetDefaultSpecialValue("bonus_damage_per_str", 5);
        this.SetDefaultSpecialValue("cleave_damage_pct", [40, 55, 70, 85, 110, 125]);
        this.SetDefaultSpecialValue("cleave_starting_width", 250);
        this.SetDefaultSpecialValue("cleave_ending_width", 500);
        this.SetDefaultSpecialValue("cleave_distance", 1040);
        this.SetDefaultSpecialValue("self_multiplier", 1);

    }


    hLastTarget: IBaseNpc_Plus;


    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_unique_magnataur_custom_2")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        let empower_duration = this.GetSpecialValueFor("empower_duration")
        modifier_magnataur_2_buff.apply(hTarget, hCaster, this, { duration: empower_duration })
        let hAbility4 = ability6_magnataur_reverse_polarity.findIn(hCaster)
        if (GameFunc.IsValid(hAbility4)) {
            modifier_magnataur_2_buff.apply(hTarget, hCaster, hAbility4, { duration: empower_duration })
        }
        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Magnataur.Empower.Target", hCaster), hCaster)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Magnataur.Empower.Cast", hCaster))
        this.hLastTarget = hTarget
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_magnataur_2"
    // }

    OnStolen(hSourceAbility: this) {
        this.hLastTarget = hSourceAbility.hLastTarget
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_magnataur_2 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus() as ability2_magnataur_empower
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
export class modifier_magnataur_2_buff extends BaseModifier_Plus {
    bonus_damage_per_str: number;
    cleave_starting_width: number;
    cleave_damage_pct: number;
    cleave_distance: number;
    cleave_ending_width: number;
    self_multiplier: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
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
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.bonus_damage_per_str = this.GetSpecialValueFor("bonus_damage_per_str")
        let extra_cleave_damage_pct = hCaster.GetTalentValue("special_bonus_unique_magnataur_custom_4")
        this.cleave_damage_pct = this.GetSpecialValueFor("cleave_damage_pct") + extra_cleave_damage_pct
        this.cleave_starting_width = this.GetSpecialValueFor("cleave_starting_width")
        this.cleave_ending_width = this.GetSpecialValueFor("cleave_ending_width")
        this.cleave_distance = this.GetSpecialValueFor("cleave_distance")
        let extra_self_multiplier = hCaster.GetTalentValue("special_bonus_unique_magnataur_custom_8")
        this.self_multiplier = this.GetSpecialValueFor("self_multiplier") + extra_self_multiplier
        if (params.IsOnCreated && IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_magnataur/magnataur_empower.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }

    }


    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierTable) {
        let fValue = 0
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster) && hCaster.GetStrength != null) {
            let bonus_damage_per_str = this.GetParentPlus() == hCaster && this.bonus_damage_per_str * this.self_multiplier || this.bonus_damage_per_str
            fValue = hCaster.GetStrength() * bonus_damage_per_str
        }
        return fValue
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster) && this.GetParentPlus() == hCaster) {
            return this.cleave_damage_pct * this.self_multiplier
        }
        return this.cleave_damage_pct
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }

        if (params.attacker == this.GetParentPlus()) {
            let hCaster = this.GetCasterPlus()
            if (UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                if (!params.attacker.IsRangedAttacker() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE)) {
                    let cleave_damage_pct = (GameFunc.IsValid(hCaster) && this.GetParentPlus() == hCaster) && this.cleave_damage_pct * this.self_multiplier || this.cleave_damage_pct

                    let sParticlePath = ResHelper.GetParticleReplacement("particles/units/heroes/hero_magnataur/magnataur_empower_cleave_effect.vpcf", hCaster)
                    let iParticleID = ResHelper.CreateParticle({
                        resPath: sParticlePath,
                        resNpc: null,
                        iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                        owner: params.attacker
                    });

                    let n = 0

                    AoiHelper.DoCleaveAction(params.attacker, params.target, this.cleave_starting_width, this.cleave_ending_width, this.cleave_distance, (hTarget) => {
                        let tDamageTable = {
                            ability: this.GetAbilityPlus(),
                            victim: hTarget,
                            attacker: params.attacker,
                            damage: params.original_damage * cleave_damage_pct * 0.01,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_USE_COMBAT_PROFICIENCY,
                            eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_CLEAVE + BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_SPELL_CRIT,
                        }
                        BattleHelper.GoApplyDamage(tDamageTable)

                        n = n + 1

                        ParticleManager.SetParticleControlEnt(iParticleID, n + 1, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
                    })
                    ParticleManager.SetParticleControl(iParticleID, 1, Vector(2, 17, n))
                    ParticleManager.ReleaseParticleIndex(iParticleID)
                }
            }
        }
    }
}
