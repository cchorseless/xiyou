
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_slark_dark_pact = { "ID": "5494", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Slark.DarkPact.Cast", "AbilityCastAnimation": "ACT_INVALID", "AbilityCastPoint": "0.001 0.001 0.001 0.001", "AbilityCastRange": "325", "AbilityCooldown": "9.0 8.0 7.0 6.0", "AbilityManaCost": "60", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "delay": "1.5" }, "02": { "var_type": "FIELD_FLOAT", "pulse_duration": "1.0" }, "03": { "var_type": "FIELD_INTEGER", "radius": "325" }, "04": { "var_type": "FIELD_INTEGER", "total_damage": "75 150 225 300", "LinkedSpecialBonus": "special_bonus_unique_slark_2" }, "05": { "var_type": "FIELD_INTEGER", "total_pulses": "10" }, "06": { "var_type": "FIELD_FLOAT", "pulse_interval": "0.1" } } };

@registerAbility()
export class ability1_slark_dark_pact extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "slark_dark_pact";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_slark_dark_pact = Data_slark_dark_pact;
    Init() {
        this.SetDefaultSpecialValue("delay", 1.5);
        this.SetDefaultSpecialValue("pulse_duration", 1);
        this.SetDefaultSpecialValue("radius", 700);
        this.SetDefaultSpecialValue("total_damage", [100, 200, 400, 800, 1600, 3200]);
        this.SetDefaultSpecialValue("stats_factor", [1.0, 1.2, 1.4, 1.6, 1.8, 2.0]);
        this.SetDefaultSpecialValue("total_pulses", 10);
        this.SetDefaultSpecialValue("pulse_interval", 0.1);

    }

    Init_old() {
        this.SetDefaultSpecialValue("delay", 1.5);
        this.SetDefaultSpecialValue("pulse_duration", 1);
        this.SetDefaultSpecialValue("radius", 650);
        this.SetDefaultSpecialValue("total_damage", [150, 200, 250, 300, 450, 600]);
        this.SetDefaultSpecialValue("stats_factor", [1.0, 1.2, 1.4, 1.6, 1.8, 2.0]);
        this.SetDefaultSpecialValue("total_pulses", 10);
        this.SetDefaultSpecialValue("pulse_interval", 0.1);

    }



    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_unique_slark_custom")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = hCaster.GetAbsOrigin()
        let delay = this.GetSpecialValueFor("delay")
        let radius = this.GetSpecialValueFor("radius")
        let total_damage = this.GetSpecialValueFor("total_damage")
        let extra_stats_factor = hCaster.GetTalentValue("special_bonus_unique_slark_custom_3")
        let stats_factor = this.GetSpecialValueFor("stats_factor") + extra_stats_factor
        let total_pulses = this.GetSpecialValueFor("total_pulses")
        let pulse_interval = this.GetSpecialValueFor("pulse_interval")
        modifier_slark_1_particle_slark_dark_pact_start.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Slark.DarkPact.PreCast", hCaster))
        let iCount = 0
        this.addTimer(delay,
            () => {
                if (iCount == 0) {
                    hCaster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1)
                    hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Slark.DarkPact.Cast", hCaster))
                    modifier_slark_1_particle_slark_dark_pact_pulses.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
                }

                hCaster.Purge(false, true, false, true, true)

                let fDamage = (total_damage + (hCaster.GetStrength() + hCaster.GetAgility() + hCaster.GetIntellect()) * stats_factor) * pulse_interval

                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
                for (let hTarget of (tTargets)) {
                    let tDamageTable = {
                        ability: this,
                        victim: hTarget,
                        attacker: hCaster,
                        damage: fDamage,
                        damage_type: this.GetAbilityDamageType()
                    }
                    BattleHelper.GoApplyDamage(tDamageTable)
                }
                iCount = iCount + 1
                if (iCount < total_pulses) {
                    return pulse_interval
                }
            }
        )
    }

    GetIntrinsicModifierName() {
        return "modifier_slark_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_slark_1 extends BaseModifier_Plus {
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
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

            let range = ability.GetSpecialValueFor("radius")
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slark_1_particle_slark_dark_pact_start extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_slark/slark_dark_pact_start.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slark_1_particle_slark_dark_pact_pulses extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let radius = this.GetSpecialValueFor("radius")

        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_slark/slark_dark_pact_pulses.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(radius, radius, radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}