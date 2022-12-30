import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_leshrac_diabolic_edict = { "ID": "5242", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC | DOTA_UNIT_TARGET_BUILDING", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Leshrac.Diabolic_Edict", "AbilityCastPoint": "0.5", "AbilityCooldown": "22 22 22 22", "AbilityManaCost": "95 120 135 155", "AbilityDamage": "8 20 32 44", "AbilityDuration": "10", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "num_explosions": "40", "LinkedSpecialBonus": "special_bonus_unique_leshrac_1" }, "02": { "var_type": "FIELD_INTEGER", "radius": "500" }, "03": { "var_type": "FIELD_INTEGER", "tower_bonus": "40" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_leshrac_diabolic_edict extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "leshrac_diabolic_edict";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_leshrac_diabolic_edict = Data_leshrac_diabolic_edict;

    Init() {
        this.SetDefaultSpecialValue("radius", 700);
        this.SetDefaultSpecialValue("interval", 0.25);
        this.SetDefaultSpecialValue("damage", [100, 200, 300, 400, 600, 800]);

    }

    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_leshrac_2"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_leshrac_2 extends BaseModifier_Plus {
    radius: number;
    interval: number;
    damage: number;
    damage_type: DAMAGE_TYPES;
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
        this.radius = this.GetSpecialValueFor("radius")
        this.interval = this.GetSpecialValueFor("interval")
        this.damage = this.GetSpecialValueFor("damage")
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
        if (IsServer()) {
            this.StartIntervalThink(this.interval)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            let hParent = this.GetParentPlus()

            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, 0)
            let hTarget = tTargets[0]
            if (hTarget != null) {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_leshrac/leshrac_diabolic_edict.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: null
                });

                ParticleManager.SetParticleControlEnt(iParticleID, 0, hTarget, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
                ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)

                EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Leshrac.Diabolic_Edict", hCaster), hCaster)

                let damage = this.damage + hCaster.GetTalentValue("special_bonus_unique_leshrac_custom_7") * hCaster.GetAverageTrueAttackDamage(hParent)
                BattleHelper.GoApplyDamage({
                    ability: hAbility,
                    victim: hTarget,
                    attacker: hCaster,
                    damage: damage,
                    damage_type: hAbility.GetAbilityDamageType(),
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_BYPASSES_BLOCK,
                })
            } else {
                let vPosition = (hParent.GetAbsOrigin() + RandomVector(1) * RandomFloat(0, this.radius)) as Vector
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_leshrac/leshrac_diabolic_edict.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: null
                });

                ParticleManager.SetParticleControl(iParticleID, 0, vPosition)
                ParticleManager.SetParticleControl(iParticleID, 1, vPosition)
                ParticleManager.ReleaseParticleIndex(iParticleID)

                EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_Leshrac.Diabolic_Edict", hCaster), hCaster)
            }
        }
    }
}

