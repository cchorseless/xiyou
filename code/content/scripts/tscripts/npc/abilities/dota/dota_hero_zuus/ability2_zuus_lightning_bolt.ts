import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_zuus_lightning_bolt = { "ID": "5111", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Zuus.LightningBolt", "AbilityCastRange": "700 750 800 850", "AbilityCastPoint": "0.4 0.4 0.4 0.4", "AbilityDamage": "125 200 275 350", "AbilityCooldown": "6.0 6.0 6.0 6.0", "AbilityManaCost": "125 130 135 140", "AbilityModifierSupportValue": "0.1", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "true_sight_radius": "750" }, "02": { "var_type": "FIELD_INTEGER", "sight_radius_day": "750" }, "03": { "var_type": "FIELD_INTEGER", "sight_radius_night": "750" }, "04": { "var_type": "FIELD_FLOAT", "sight_duration": "4.5" }, "05": { "var_type": "FIELD_INTEGER", "spread_aoe": "325" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_zuus_lightning_bolt extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "zuus_lightning_bolt";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_zuus_lightning_bolt = Data_zuus_lightning_bolt;
    Init() {
        this.SetDefaultSpecialValue("spread_aoe", 325);
        this.SetDefaultSpecialValue("damage", [200, 600, 1800, 2600, 3400, 6800]);
        this.SetDefaultSpecialValue("cast_range_tooltip", 850);
        this.SetDefaultSpecialValue("gods_wrath_count", [7, 7, 6, 6, 5, 5]);
        this.SetDefaultSpecialValue("shock_bonus", [100, 200, 400, 800, 1600, 3200]);

    }



    Init_old() {
        this.SetDefaultSpecialValue("spread_aoe", 325);
        this.SetDefaultSpecialValue("damage", [200, 600, 1800, 2600, 3400, 6800]);
        this.SetDefaultSpecialValue("cast_range_tooltip", 850);
        this.SetDefaultSpecialValue("gods_wrath_count", [7, 7, 6, 6, 5, 5]);

    }

    OnAbilityPhaseStart() {
        this.GetCasterPlus().EmitSound(ResHelper.GetSoundReplacement("Hero_Zuus.LightningBolt.Cast", this.GetCasterPlus()))
        return true
    }
    OnAbilityPhaseInterrupted() {
        this.GetCasterPlus().StopSound(ResHelper.GetSoundReplacement("Hero_Zuus.LightningBolt.Cast", this.GetCasterPlus()))
    }
    OnSpellStart() {
        let hTarget = this.GetCursorTarget() as IBaseNpc_Plus
        this.FireZuus2(hTarget, this)
    }

    FireZuus2(hTarget: IBaseNpc_Plus, hAbility: IBaseAbility_Plus) {
        let bCalCount = this == hAbility;
        let hCaster = this.GetCasterPlus();
        let spread_aoe = this.GetSpecialValueFor("spread_aoe", 325)
        let vPosition = this.GetCursorPosition()
        if (hTarget == null) {
            hTarget = AoiHelper.FindOneUnitsInRadius(
                hCaster.GetTeamNumber(),
                this.GetCursorPosition(),
                spread_aoe,
                [hCaster],
                DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE);
            if (hTarget != null) {
                hCaster.MakeVisibleDueToAttack(hTarget.GetTeamNumber(), 200);
                vPosition = hTarget.GetAbsOrigin()
            }
        }
        let damage = this.GetSpecialValueFor("damage", 200) + hCaster.GetTalentValue('special_bonus_unique_zuus_custom_8') * hCaster.GetIntellect()
        let tDamageTable = {
            ability: hAbility,
            attacker: hCaster,
            victim: hTarget,
            damage: damage,
            damage_type: this.GetAbilityDamageType(),
        };
        let stun_duration = 0.2
        if (hTarget != null && !hTarget.TriggerSpellAbsorb(this)) {
            let damageBuff = modifier_zuus_2_particle_damage.apply(hTarget, hCaster, this, { duration: 0.1, })
            damageBuff && (damageBuff.damageInfo = tDamageTable)
            modifier_shock.Shock(hTarget, hCaster, hAbility, hAbility.GetSpecialValueFor("shock_bonus", 100))
            modifier_stunned.apply(hTarget, hCaster, hAbility, { duration: stun_duration })
        }
        else {
            modifier_zuus_2_particle_damage_thinker.applyThinker(vPosition, hCaster, hAbility,
                { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION },
                hCaster.GetTeamNumber(), false)
        }
        //  +3 雷击目标
        let sTalentName = "special_bonus_unique_zuus_custom_6"
        if (hCaster.HasTalent(sTalentName) && bCalCount) {
            let bolt_count = hCaster.GetTalentValue(sTalentName)
            let range = this.GetCastRange(hCaster.GetAbsOrigin(), hTarget) + hCaster.GetTalentValue(sTalentName, "range")
            let interval = hCaster.GetTalentValue(sTalentName, "interval")
            let interval_add = interval
            for (let i = 0; i < bolt_count; i++) {
                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), range, [], this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER)
                if (tTargets.length == 0) {
                    break
                }
                for (let hUnit of tTargets) {
                    this.addTimer(interval_add, () => {
                        if (!GameFunc.IsValid(hUnit)) { return }
                        if (!hUnit.TriggerSpellAbsorb(this)) {
                            let damageBuff = modifier_zuus_2_particle_damage.apply(hTarget, hCaster, this, { duration: 0.1, })
                            damageBuff && (damageBuff.damageInfo = tDamageTable)
                            modifier_shock.Shock(hTarget, hCaster, hAbility, hAbility.GetSpecialValueFor("shock_bonus"))
                            modifier_stunned.apply(hTarget, hCaster, hAbility, { duration: stun_duration })
                        }
                    })
                    interval_add = interval_add + interval
                }
            }
        }
        // sTalentName = "special_bonus_unique_zuus_custom_3"
        // let gods_wrath_count = hCaster.HasTalent(sTalentName) && this.GetSpecialValueFor("gods_wrath_count") - hCaster.GetTalentValue(sTalentName) || this.GetSpecialValueFor("gods_wrath_count")
        // if (bCalCount) {
        //     let hModifier  = modifier_zuus_2.findIn(  hCaster )
        //     if (hModifier) {
        //         hModifier.IncrementStackCount()
        //         if (hModifier.GetStackCount() >= gods_wrath_count) {
        //             let zuus_3  = zuus_3.findIn(  hCaster )
        //             if (GameFunc.IsValid(zuus_3)) {
        //                 hModifier.SetStackCount(0)
        //                 if (zuus_3.GetLevel() > 0) {
        //                     zuus_3.OnSpellStart(true)
        //                 }
        //             }
        //         }
        //     }
        // }

    }

    static playAni(m: BaseModifier_Plus) {
        let hParent = m.GetParentPlus()
        let hCaster = m.GetCasterPlus()
        if (IsServer()) {
            EmitSoundOnLocationWithCaster(hParent.GetAbsOrigin(),
                ResHelper.GetSoundReplacement("Hero_Zuus.LightningBolt", hCaster), hCaster)
        }
        else {
            let resinfo: ResHelper.ParticleInfo = {
                resPath: "particles/units/heroes/hero_zuus/zuus_lightning_bolt.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN
            }
            let iParticleID = ResHelper.CreateParticle(resinfo)
            ParticleManager.SetParticleControl(iParticleID, 0, (hParent.GetAbsOrigin() + Vector(0, 0, 4000)) as Vector)
            ParticleManager.SetParticleControl(iParticleID, 1, hParent.GetAbsOrigin())
            ParticleManager.ReleaseParticleIndex(iParticleID)

        }
    }
}
@registerModifier()
export class modifier_zuus_2_particle_damage extends modifier_particle {
    damageInfo: BattleHelper.DamageOptions;
    Init(params: IModifierTable) {
        ability2_zuus_lightning_bolt.playAni(this);
    }

    OnDestroy() {
        super.OnDestroy();
        if (this.damageInfo) {
            BattleHelper.GoApplyDamage(this.damageInfo);
        }
    }

}
@registerModifier()
export class modifier_zuus_2_particle_damage_thinker extends modifier_particle_thinker {
    Init(params: IModifierTable) {
        ability2_zuus_lightning_bolt.playAni(this)
    }

}