import { GameEnum } from "../../../../GameEnum";
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
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { ability1_omniknight_purification } from "./ability1_omniknight_purification";

/** dota原技能数据 */
export const Data_omniknight_guardian_angel = { "ID": "5266", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "2", "AbilitySound": "Hero_Omniknight.GuardianAngel.Cast", "HasScepterUpgrade": "1", "AbilityDraftUltShardAbility": "omniknight_hammer_of_purity", "AbilityCooldown": "160 150 140", "AbilityCastPoint": "0.4", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityManaCost": "125 175 250", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "5.0 6.5 8.0" }, "02": { "var_type": "FIELD_INTEGER", "radius": "1200" }, "03": { "var_type": "FIELD_FLOAT", "duration_scepter": "8.0 9.0 10.0", "RequiresScepter": "1" }, "04": { "var_type": "FIELD_INTEGER", "scepter_regen": "40", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_omniknight_guardian_angel extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "omniknight_guardian_angel";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_omniknight_guardian_angel = Data_omniknight_guardian_angel;
    Init() {
        this.SetDefaultSpecialValue("duration", 8);
        this.SetDefaultSpecialValue("radius", 400);
        this.SetDefaultSpecialValue("all_primary_stat_percent", [15, 20, 25, 30, 35, 40]);
        this.SetDefaultSpecialValue("interval_scepter", 1);
        this.SetDefaultSpecialValue("spell_crit_chance", 30);
        this.SetDefaultSpecialValue("spell_crit_damage", 300);

    }

    Init_old() {
        this.SetDefaultSpecialValue("duration", 8);
        this.SetDefaultSpecialValue("radius", 400);
        this.SetDefaultSpecialValue("all_primary_stat_percent", [15, 20, 25, 30, 35, 40]);
        this.SetDefaultSpecialValue("nohero_primary_stat_percent", 50);

    }



    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_omniknight_custom_2")
    }
    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()

        let radius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("duration")
        let fRadius = radius
        let iTeamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
        let iTypeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
        let iFlagsFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
        let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, fRadius, iTeamFilter, iTypeFilter, iFlagsFilter, FindOrder.FIND_CLOSEST, false)
        modifier_omniknight_6_buff.remove(hCaster);
        for (let i = tTargets.length - 1; i >= 0; i--) {
            let hTarget = tTargets[i]
            if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                if (hTarget.GetUnitLabel() != "builder" && hTarget.GetUnitLabel() == "HERO") {
                    modifier_omniknight_6_buff.remove(hTarget);
                    modifier_omniknight_6_buff.apply(hTarget, hCaster, this, { duration: duration })
                    EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Omniknight.GuardianAngel", hCaster), hCaster)
                }
            }
        }

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Omniknight.GuardianAngel.Cast", hCaster))
    }

    GetIntrinsicModifierName() {
        return "modifier_omniknight_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
//  Modifiers
@registerModifier()
export class modifier_omniknight_6 extends BaseModifier_Plus {
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

            let range = caster.Script_GetAttackRange()

            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets.length > 0) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_omniknight_6_buff extends BaseModifier_Plus {
    radius: number;
    interval_scepter: number;
    spell_crit_chance: number;
    spell_crit_damage: number;
    all_primary_stat_percent: number;
    fGameTime: number;
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
    ShouldUseOverheadOffset() {
        return true
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.fGameTime = GameRules.GetGameTime()
            this.StartIntervalThink(0)
        } else {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_omniknight/omniknight_guardian_angel_halo_buff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, false, -1, false, true)
            let sParticlePath = "particles/units/heroes/hero_omniknight/omniknight_guardian_angel_ally.vpcf"
            if (hCaster == hParent) {
                sParticlePath = "particles/units/heroes/hero_omniknight/omniknight_guardian_angel_omni.vpcf"
            }
            let iParticleID = ResHelper.CreateParticle({
                resPath: sParticlePath,
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 5, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.radius = this.GetSpecialValueFor("radius")
        this.interval_scepter = this.GetSpecialValueFor("interval_scepter")
        this.all_primary_stat_percent = this.GetSpecialValueFor("all_primary_stat_percent") + hCaster.GetTalentValue("special_bonus_unique_omniknight_custom_7")
        this.spell_crit_chance = this.GetSpecialValueFor("spell_crit_chance")
        this.spell_crit_damage = this.GetSpecialValueFor("spell_crit_damage")
    }

    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            if (!GameFunc.IsValid(hCaster)) {
                return
            }
            if (hCaster.HasScepter()) {
                let fCurGameTime = GameRules.GetGameTime()
                if (fCurGameTime >= this.fGameTime + this.interval_scepter) {
                    this.fGameTime = fCurGameTime
                    let hAbility = ability1_omniknight_purification.findIn(hCaster)
                    if (GameFunc.IsValid(hAbility) && hAbility.GetLevel() > 0) {
                        let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false)
                        for (let hTarget of (tTargets)) {
                            if (GameFunc.IsValid(hTarget) && hAbility.OnSpellStart != null) {
                                let hRecordTarget = hCaster.GetCursorCastTarget()
                                hCaster.SetCursorCastTarget(hTarget)
                                // hAbility.OnSpellStart(hTarget)
                                hCaster.SetCursorCastTarget(hRecordTarget)
                                break
                            }
                        }
                    }
                }
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.all_primary_stat_percent
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_STRENGTH_PERCENTAGE)
    EOM_GetModifierStats_Strength_Percentage() {
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) { return 0 }
        let hParent = this.GetParentPlus()
        if (hCaster == hParent) {
            return this.all_primary_stat_percent
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_AGILITY_PERCENTAGE)
    EOM_GetModifierStats_Agility_Percentage() {
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) { return 0 }
        let hParent = this.GetParentPlus()
        if (hCaster == hParent) {
            return this.all_primary_stat_percent
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_INTELLECT_PERCENTAGE)
    EOM_GetModifierStats_Intellect_Percentage() {
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) { return 0 }
        let hParent = this.GetParentPlus()
        if (hCaster == hParent) {
            return this.all_primary_stat_percent
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    EOM_GetModifierBonusStats_Strength() {
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) { return 0 }
        let hParent = this.GetParentPlus()
        if (hCaster != hParent) {
            return (hCaster.GetStrength() - (/**(GetStrengthWithoutPercentage(hCaster)*/1 * this.all_primary_stat_percent * 0.01)) * this.all_primary_stat_percent * 0.01
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    EOM_GetModifierBonusStats_Agility() {
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) { return 0 }
        let hParent = this.GetParentPlus()
        if (hCaster != hParent) {
            return (hCaster.GetAgility() - (/**(GetAgilityWithoutPercentage(hCaster)*/1 * this.all_primary_stat_percent * 0.01)) * this.all_primary_stat_percent * 0.01
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    EOM_GetModifierBonusStats_Intellect() {
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) { return 0 }
        let hParent = this.GetParentPlus()
        if (hCaster != hParent) {
            return (hCaster.GetIntellect() - (/**(GetIntellectWithoutPercentage(hCaster)*/1 * this.all_primary_stat_percent * 0.01)) * this.all_primary_stat_percent * 0.01
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.SPELL_CRITICALSTRIKE)
    EOM_GetModifierSpellCriticalStrike() {
        if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard()) {
            if (GameFunc.mathUtil.PRD(this.spell_crit_chance, this.GetParentPlus(), "modifier_omniknight_6_buff_shard")) {
                return this.spell_crit_damage
            }
        }
        return 0
    }
}
