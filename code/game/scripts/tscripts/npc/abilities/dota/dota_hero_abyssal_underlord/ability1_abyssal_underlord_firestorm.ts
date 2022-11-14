
import { AI_ability } from "../../../../ai/AI_ability";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_abyssal_underlord_firestorm = { "ID": "5613", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "HasShardUpgrade": "1", "AbilityCastRange": "600 625 650 675", "AbilityCastPoint": "0.5", "FightRecapLevel": "1", "AbilityCooldown": "12.0", "AbilityManaCost": "100 110 120 130", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "building_damage": "33" }, "01": { "var_type": "FIELD_INTEGER", "radius": "425", "LinkedSpecialBonus": "special_bonus_unique_underlord_8" }, "02": { "var_type": "FIELD_FLOAT", "wave_duration": "7.0", "LinkedSpecialBonus": "special_bonus_unique_underlord_7" }, "03": { "var_type": "FIELD_INTEGER", "wave_count": "6", "LinkedSpecialBonus": "special_bonus_unique_underlord_7" }, "04": { "var_type": "FIELD_INTEGER", "wave_damage": "25 40 55 70", "LinkedSpecialBonus": "special_bonus_unique_underlord_2" }, "05": { "var_type": "FIELD_FLOAT", "wave_interval": "1.0" }, "06": { "var_type": "FIELD_FLOAT", "burn_damage": "1 2 3 4", "CalculateSpellDamageTooltip": "0" }, "07": { "var_type": "FIELD_FLOAT", "burn_interval": "1.0" }, "08": { "var_type": "FIELD_FLOAT", "burn_duration": "2.0" }, "09": { "var_type": "FIELD_FLOAT", "first_wave_delay": "0.0" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_abyssal_underlord_firestorm extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "abyssal_underlord_firestorm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_abyssal_underlord_firestorm = Data_abyssal_underlord_firestorm;
    Init() {
        this.SetDefaultSpecialValue("shard_burn_damage", 200);
        this.SetDefaultSpecialValue("radius", 400);
        this.SetDefaultSpecialValue("wave_duration", 7);
        this.SetDefaultSpecialValue("wave_count", 6);
        this.SetDefaultSpecialValue("wave_damage", [80, 240, 400, 560, 720, 880]);
        this.SetDefaultSpecialValue("wave_strength_damage", [4.0, 4.5, 5.0, 5.5, 6.0, 7.0]);
        this.SetDefaultSpecialValue("wave_interval", 1);
        this.SetDefaultSpecialValue("burn_damage", [13, 18, 23, 28, 33, 38]);
        this.SetDefaultSpecialValue("burn_interval", 1);
        this.SetDefaultSpecialValue("burn_duration", 2);

    }



    iPreParticleID: ParticleID;
    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let radius = this.GetSpecialValueFor("radius")
        this.iPreParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/heroes_underlord/underlord_firestorm_pre.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
            owner: hCaster
        })
        ParticleManager.SetParticleControl(this.iPreParticleID, 0, vPosition)
        ParticleManager.SetParticleControl(this.iPreParticleID, 1, Vector(radius, 1, 1))
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_AbyssalUnderlord.Firestorm.Cast", hCaster))
        return true
    }
    OnAbilityPhaseInterrupted() {
        if (this.iPreParticleID != null) {
            ParticleManager.DestroyParticle(this.iPreParticleID, true)
            this.iPreParticleID = null
        }
    }
    OnSpellStart() {
        if (this.iPreParticleID != null) {
            ParticleManager.DestroyParticle(this.iPreParticleID, false)
            this.iPreParticleID = null
        }
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        modifier_abyssal_underlord_1_thinker.applyThinker(vPosition, hCaster, this, null, hCaster.GetTeamNumber(), false)
    }
    AutoSpellSelf() {
        let caster = this.GetCasterPlus()
        let range = this.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
        let radius = this.GetAOERadius()
        AI_ability.POSITION_most_enemy(this, range, radius)
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_abyssal_underlord_1_debuff extends BaseModifier_Plus {
    burn_damage: number;
    shard_burn_damage: number;
    burn_interval: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
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
        this.burn_damage = this.GetSpecialValueFor("burn_damage")
        this.shard_burn_damage = this.GetSpecialValueFor("shard_burn_damage")
        this.burn_interval = this.GetSpecialValueFor("burn_interval")
        if (params.IsOnCreated) {
            if (IsServer()) {
                this.StartIntervalThink(this.burn_interval)
            }
            else {
                let iPtclID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/heroes_underlord/abyssal_underlord_firestorm_wave_burn.vpcf",
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: this.GetParentPlus()
                });
                this.AddParticle(iPtclID, false, false, -1, false, false)
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (GameFunc.IsValid(hCaster) && GameFunc.IsValid(hParent) && GameFunc.IsValid(hAbility)) {
                let tDamageTable: BattleHelper.DamageOptions = {
                    ability: this.GetAbilityPlus(),
                    victim: hParent,
                    attacker: hCaster,
                    damage: (hCaster.HasShard() && (this.burn_damage + this.shard_burn_damage) || this.burn_damage) * hCaster.GetMaxHealth() * 0.01,
                    damage_type: hAbility.GetAbilityDamageType(),
                    eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_DOT,
                }
                BattleHelper.GoApplyDamage(tDamageTable)
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    on_death(params: ModifierInstanceEvent) {
        let hAttacker = params.attacker
        if (!GameFunc.IsValid(hAttacker)) {
            return
        }
        if (hAttacker.GetTeamNumber() == params.unit.GetTeamNumber()) {
            return
        }
        if (hAttacker != null && hAttacker.HasScepter() && hAttacker.GetUnitLabel() != "builder") {
            if (params.unit == this.GetParentPlus() && hAttacker == this.GetCasterPlus() && !hAttacker.PassivesDisabled()) {
                modifier_abyssal_underlord_1_thinker.applyThinker(params.unit.GetAbsOrigin(), this.GetCasterPlus(), this.GetAbilityPlus(), { wave_count: 1 }, this.GetCasterPlus().GetTeamNumber(), false)
            }
        }
    }
}

@registerModifier()
export class modifier_abyssal_underlord_1_thinker extends modifier_particle_thinker {
    wave_interval: number;
    wave_count: any;
    radius: number;
    wave_damage: number;
    wave_strength_damage: number;
    burn_duration: number;
    iCount: number;
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let vPosition = hParent.GetAbsOrigin()
        let extra_wave_count = hCaster.GetTalentValue("special_bonus_unique_abyssal_underlord_custom_4")
        this.wave_interval = params.wave_count && 0 || this.GetSpecialValueFor("wave_interval", 1)
        this.wave_count = params.wave_count && params.wave_count || this.GetSpecialValueFor("wave_count") + extra_wave_count
        this.radius = this.GetSpecialValueFor("radius", 400)
        this.wave_damage = this.GetSpecialValueFor("wave_damage", 80)
        let extra_wave_strength_damage = hCaster.GetTalentValue("special_bonus_unique_abyssal_underlord_custom_1")
        this.wave_strength_damage = this.GetSpecialValueFor("wave_strength_damage", 4) + extra_wave_strength_damage
        this.burn_duration = this.GetSpecialValueFor("burn_duration", 2)
        if (IsServer()) {
            EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_AbyssalUnderlord.Firestorm.Start", hCaster), hCaster)
            this.iCount = 0
            this.StartIntervalThink(this.wave_interval)
            this.OnIntervalThink()
        }
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let vPosition = hParent.GetAbsOrigin()
        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
                this.Destroy()
                return
            }
            let iStr = 0
            if (hCaster.GetStrength != null) {
                iStr = hCaster.GetStrength()
            }
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, this.radius, null, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {
                modifier_abyssal_underlord_1_debuff.apply(hTarget, hCaster, hAbility, { duration: this.burn_duration })
                let tDamageTable = {
                    ability: hAbility,
                    victim: hTarget,
                    attacker: hCaster,
                    damage: this.wave_damage + this.wave_strength_damage * iStr,
                    damage_type: hAbility.GetAbilityDamageType()
                }
                BattleHelper.GoApplyDamage(tDamageTable)
            }
            EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_AbyssalUnderlord.Firestorm", hCaster), hCaster)
            modifier_abyssal_underlord_1_particle_wave.apply(hParent, hCaster, hAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            this.iCount = this.iCount + 1
            if (this.iCount >= this.wave_count) {
                this.SetDuration(BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION, true)
                this.StartIntervalThink(-1)
            }
        }
    }
}

// 特效
@registerModifier()
export class modifier_abyssal_underlord_1_particle_wave extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let vPosition = hParent.GetAbsOrigin()
        let radius = this.GetSpecialValueFor("radius", 400)
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/heroes_underlord/abyssal_underlord_firestorm_wave.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: hCaster
            })
            ParticleManager.SetParticleControl(iParticleID, 0, vPosition)
            ParticleManager.SetParticleControl(iParticleID, 4, Vector(radius, 1, 1))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }

}
