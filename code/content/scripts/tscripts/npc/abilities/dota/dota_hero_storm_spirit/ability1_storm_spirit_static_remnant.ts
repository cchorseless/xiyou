import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";

/** dota原技能数据 */
export const Data_storm_spirit_static_remnant = { "ID": "5098", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_StormSpirit.StaticRemnantPlant", "AbilityCastPoint": "0 0 0 0", "AbilityCooldown": "3.5", "AbilityDuration": "12.0", "AbilityManaCost": "70 80 90 100", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "static_remnant_radius": "235" }, "02": { "var_type": "FIELD_INTEGER", "static_remnant_damage_radius": "260" }, "03": { "var_type": "FIELD_FLOAT", "static_remnant_delay": "1.0" }, "04": { "var_type": "FIELD_INTEGER", "static_remnant_damage": "120 175 230 285", "LinkedSpecialBonus": "special_bonus_unique_storm_spirit_5" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_storm_spirit_static_remnant extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "storm_spirit_static_remnant";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_storm_spirit_static_remnant = Data_storm_spirit_static_remnant;
    Init() {
        this.SetDefaultSpecialValue("static_remnant_radius", 700);
        this.SetDefaultSpecialValue("static_remnant_damage_radius", 725);
        this.SetDefaultSpecialValue("static_remnant_duration", 6);
        this.SetDefaultSpecialValue("static_remnant_damage", [200, 400, 800, 1600, 3200, 6400]);
        this.SetDefaultSpecialValue("intellect_factor", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("static_remnant_delay", 1);
        this.SetDefaultSpecialValue("shock_bonus_int", 3);

    }

    Init_old() {
        this.SetDefaultSpecialValue("static_remnant_radius", 235);
        this.SetDefaultSpecialValue("static_remnant_damage_radius", 260);
        this.SetDefaultSpecialValue("static_remnant_duration", 12);
        this.SetDefaultSpecialValue("static_remnant_damage", [500, 800, 1500, 2000, 2500, 3000]);
        this.SetDefaultSpecialValue("intellect_factor", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("static_remnant_delay", 1);
        this.SetDefaultSpecialValue("super_state_damage_factor", 2);
        this.SetDefaultSpecialValue("super_state_damage_radius", 100);

    }


    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("static_remnant_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        this.ReleaseRemnant()
    }
    ReleaseRemnant(vPosition: Vector = null) {
        let hCaster = this.GetCasterPlus()
        let static_remnant_duration = this.GetSpecialValueFor("static_remnant_duration")
        vPosition = vPosition || hCaster.GetAbsOrigin()

        let hThinker = CreateUnitByName(hCaster.GetUnitName(), vPosition, false, hCaster, hCaster, hCaster.GetTeamNumber())
        hThinker.SetForwardVector(hCaster.GetForwardVector())
        hThinker.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1)
        for (let i = hThinker.GetAbilityCount() - 1; i >= 0; i--) {
            let ability = hThinker.GetAbilityByIndex(i) as IBaseAbility_Plus
            if (GameFunc.IsValid(ability)) {
                hThinker.RemoveAbilityByHandle(ability)
            }
        }
        modifier_storm_spirit_1_thinker.apply(hThinker, hCaster, this, { duration: static_remnant_duration })
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_StormSpirit.StaticRemnantPlant", hCaster))
    }

    GetIntrinsicModifierName() {
        return "modifier_storm_spirit_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_storm_spirit_1 extends BaseModifier_Plus {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster)
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
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
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_storm_spirit_1_thinker extends BaseModifier_Plus {
    bCanDamage: any;
    static_remnant_radius: any;
    static_remnant_damage: number;
    intellect_factor: number;
    static_remnant_damage_radius: number;
    static_remnant_delay: number;
    super_state_damage_factor: number;
    super_state_damage_radius: number;
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
    IsAura() {
        return true
    }
    GetAuraEntityReject(hEntity: IBaseNpc_Plus) {
        if (this.bCanDamage) {
            this.Destroy()
        }
        return true
    }
    GetAuraRadius() {
        return this.static_remnant_radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.static_remnant_radius = this.GetSpecialValueFor("static_remnant_radius")
        this.static_remnant_damage_radius = this.GetSpecialValueFor("static_remnant_damage_radius")
        this.static_remnant_damage = this.GetSpecialValueFor("static_remnant_damage")
        this.intellect_factor = this.GetSpecialValueFor("intellect_factor")
        this.static_remnant_delay = this.GetSpecialValueFor("static_remnant_delay")
        this.super_state_damage_factor = this.GetSpecialValueFor("super_state_damage_factor")
        this.super_state_damage_radius = this.GetSpecialValueFor("super_state_damage_radius")
        if (IsServer()) {
            this.bCanDamage = false
            this.StartIntervalThink(this.static_remnant_delay)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_stormspirit/stormspirit_1_static_remnant.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.static_remnant_damage_radius, this.static_remnant_damage_radius, this.static_remnant_damage_radius))
            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/storm_spirit_1_static_remnant.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            this.bCanDamage = true
            this.StartIntervalThink(-1)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            let vPosition = hParent.GetAbsOrigin()
            UTIL_Remove(hParent)
            if (GameFunc.IsValid(hCaster) && GameFunc.IsValid(hAbility)) {
                let fDamage = this.static_remnant_damage + hCaster.GetIntellect() * this.intellect_factor
                let iShockCount = hAbility.GetSpecialValueFor("shock_bonus_int") * hCaster.GetIntellect()
                let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), vPosition, null, this.static_remnant_damage_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
                for (let hTarget of (tTargets as IBaseNpc_Plus[])) {
                    BattleHelper.GoApplyDamage({
                        ability: hAbility,
                        attacker: hCaster,
                        victim: hTarget,
                        damage: fDamage,
                        damage_type: hAbility.GetAbilityDamageType()
                    })
                    modifier_shock.Shock(hTarget, hCaster, hAbility, iShockCount)
                }

                EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_StormSpirit.StaticRemnantExplode", hCaster), hCaster)
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        }
    }
}
