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
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_magnataur_reverse_polarity = { "ID": "5521", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "2", "AbilitySound": "Hero_Magnataur.ReversePolarity.Cast", "AbilityDraftUltShardAbility": "magnataur_horn_toss", "AbilityCastPoint": "0.3 0.3 0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "130", "AbilityManaCost": "150 225 300", "AbilityCastRange": "410 410 410", "AbilityModifierSupportValue": "0.5", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "pull_radius": "410" }, "02": { "var_type": "FIELD_INTEGER", "polarity_damage": "75 150 225" }, "03": { "var_type": "FIELD_FLOAT", "hero_stun_duration": "2.75 3.25 3.75", "LinkedSpecialBonus": "special_bonus_unique_magnus_5" }, "04": { "var_type": "FIELD_FLOAT", "pull_duration": "0.0 0.0 0.0" } } };

@registerAbility()
export class ability6_magnataur_reverse_polarity extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "magnataur_reverse_polarity";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_magnataur_reverse_polarity = Data_magnataur_reverse_polarity;
    Init() {
        this.SetDefaultSpecialValue("pull_radius", 400);
        this.SetDefaultSpecialValue("polarity_damage", [1000, 2000, 3000, 4000, 5000, 6000]);
        this.SetDefaultSpecialValue("stun_duration", [2, 2.5, 3, 3.5, 4, 4.5]);

    }

    iPreParticleID: ParticleID;
    vLastPosition: Vector;

    GetAOERadius() {
        return this.GetSpecialValueFor("pull_radius")
    }
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let pull_radius = this.GetSpecialValueFor("pull_radius")
        this.iPreParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_magnataur/magnataur_reverse_polarity.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: hCaster
        });
        ParticleManager.SetParticleControl(this.iPreParticleID, 1, Vector(pull_radius, pull_radius, pull_radius))
        ParticleManager.SetParticleControl(this.iPreParticleID, 2, Vector(this.GetCastPoint(), 0, 0))
        ParticleManager.SetParticleControl(this.iPreParticleID, 3, vPosition)
        let vDirection = (vPosition - hCaster.GetAbsOrigin()) as Vector
        vDirection.z = 0
        ParticleManager.SetParticleControlForward(this.iPreParticleID, 3, vDirection.Normalized())
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Magnataur.ReversePolarity.Anim", hCaster))
        return true
    }
    OnAbilityPhaseInterrupted() {
        let hCaster = this.GetCasterPlus()
        if (this.iPreParticleID != null) {
            ParticleManager.DestroyParticle(this.iPreParticleID, true)
            this.iPreParticleID = null
        }
        hCaster.StopSound(ResHelper.GetSoundReplacement("Hero_Magnataur.ReversePolarity.Anim", hCaster))
    }
    OnSpellStart() {
        if (this.iPreParticleID != null) {
            ParticleManager.DestroyParticle(this.iPreParticleID, false)
            this.iPreParticleID = null
        }
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let pull_radius = this.GetSpecialValueFor("pull_radius")
        let polarity_damage = this.GetSpecialValueFor("polarity_damage")
        let extra_stun_duration = hCaster.GetTalentValue("special_bonus_unique_magnataur_custom_3")
        let stun_duration = this.GetSpecialValueFor("stun_duration") + extra_stun_duration

        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, pull_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST)
        for (let hTarget of (tTargets)) {
            FindClearSpaceForUnit(hTarget, vPosition, true)
            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Magnataur.ReversePolarity.Stun", hCaster), hCaster)
            modifier_stunned.apply(hTarget, hCaster, this, { duration: stun_duration * hTarget.GetStatusResistanceFactor(hCaster) })
            let tDamageTable = {
                ability: this,
                victim: hTarget,
                attacker: hCaster,
                damage: polarity_damage,
                damage_type: this.GetAbilityDamageType(),
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        }

        EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_Magnataur.ReversePolarity.Cast", hCaster), hCaster)
        //  记录上一次释放的位置
        this.vLastPosition = vPosition
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_magnataur_6"
    // }

    OnStolen(hSourceAbility: this) {
        this.vLastPosition = hSourceAbility.vLastPosition
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_magnataur_6 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus() as ability6_magnataur_reverse_polarity
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST

            if (ability.vLastPosition != null && caster.IsPositionInRange(ability.vLastPosition, range)) {
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), ability.vLastPosition, radius, null, teamFilter, typeFilter, flagFilter, order)

                //  施法命令
                if (targets.length > 0) {
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        Position: ability.vLastPosition,
                        AbilityIndex: ability.entindex(),
                    })
                }
            } else {
                let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(),
                    range,
                    caster.GetTeamNumber(),
                    radius,
                    null,
                    teamFilter,
                    typeFilter,
                    flagFilter,
                    order)

                //  施法命令
                if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        AbilityIndex: ability.entindex(),
                        Position: position,
                    })
                }
            }
        }
    }
}
