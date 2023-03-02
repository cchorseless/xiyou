
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_antimage_mana_void = { "ID": "5006", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "FightRecapLevel": "2", "AbilitySound": "Hero_Antimage.ManaVoid", "HasScepterUpgrade": "1", "AbilityDraftUltScepterAbility": "antimage_mana_overload", "AbilityCastRange": "600", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "70.0 70.0 70.0", "AbilityManaCost": "100 200 300", "AbilityModifierSupportValue": "0.0", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "mana_void_damage_per_mana": "0.8 0.95 1.1", "LinkedSpecialBonus": "special_bonus_unique_antimage_6" }, "02": { "var_type": "FIELD_FLOAT", "mana_void_ministun": "0.3", "LinkedSpecialBonus": "special_bonus_unique_antimage_8" }, "03": { "var_type": "FIELD_INTEGER", "mana_void_aoe_radius": "500" } } };

@registerAbility()
export class ability6_antimage_mana_void extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "antimage_mana_void";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_antimage_mana_void = Data_antimage_mana_void;
    Init() {
        this.SetDefaultSpecialValue("damage_bonus_per_mana", 5);
        this.SetDefaultSpecialValue("main_damage_per_agi", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("mana_void_ministun", 0.3);
        this.SetDefaultSpecialValue("mana_void_aoe_radius", 500);
        this.SetDefaultSpecialValue("mana_void_ministun_scepter", 2);
        this.SetDefaultSpecialValue("mana_void_aoe_radius_scepter", 1000);
        this.SetDefaultSpecialValue("damage_per_reduce_mana", 1);
        this.SetDefaultSpecialValue("damage_max_mana", 15);

    }




    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_antimage_custom_5")
    }

    GetAOERadius() {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("mana_void_aoe_radius_scepter")
        }
        return this.GetSpecialValueFor("mana_void_aoe_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget() as IBaseNpc_Plus
        if (!GFuncEntity.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        let damage_bonus_per_mana = this.GetSpecialValueFor("damage_bonus_per_mana")
        let damage_per_reduce_mana = this.GetSpecialValueFor("damage_per_reduce_mana")
        let damage_max_mana = this.GetSpecialValueFor("damage_max_mana")

        let mana_void_ministun = hCaster.HasScepter() && this.GetSpecialValueFor("mana_void_ministun_scepter") || this.GetSpecialValueFor("mana_void_ministun")
        let main_damage_per_agi = this.GetSpecialValueFor("main_damage_per_agi")
        let mana_void_aoe_radius = hCaster.HasScepter() && this.GetSpecialValueFor("mana_void_aoe_radius_scepter") || this.GetSpecialValueFor("mana_void_aoe_radius")

        if (!hTarget.TriggerSpellAbsorb(this)) {
            let fMaxMana = hTarget.GetMaxMana()
            let fReduce = fMaxMana - hTarget.GetMana()
            let fDamage = fMaxMana * damage_max_mana * (1 + (fReduce * damage_bonus_per_mana) / (fMaxMana * damage_per_reduce_mana))
            modifier_stunned.apply(hTarget, hCaster, this, { duration: mana_void_ministun * hTarget.GetStatusResistanceFactor(hCaster) })
            let fMainDamage = hCaster.GetAgility() * main_damage_per_agi

            let tDamageTable = {
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: fMainDamage + fDamage,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(tDamageTable)

            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), mana_void_aoe_radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
            for (let hUnit of (tTargets)) {
                if (hUnit != hTarget) {
                    let tDamageTable = {
                        ability: this,
                        attacker: hCaster,
                        victim: hUnit,
                        damage: fDamage,
                        damage_type: this.GetAbilityDamageType()
                    }
                    BattleHelper.GoApplyDamage(tDamageTable)
                }
            }
            modifier_antimage_6_particle_antimage_manavoid.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Antimage.ManaVoid", hCaster), hCaster)
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_antimage_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_antimage_6 extends BaseModifier_Plus {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            let target = AoiHelper.GetAOEMostTargetsSpellTarget(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)

            if (target != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                        TargetIndex: target.entindex(),
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_antimage_6_particle_antimage_manavoid extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let mana_void_aoe_radius = hCaster.HasScepter() && this.GetSpecialValueFor("mana_void_aoe_radius_scepter") || this.GetSpecialValueFor("mana_void_aoe_radius")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_antimage/antimage_manavoid.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(mana_void_aoe_radius, 0, 0))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
