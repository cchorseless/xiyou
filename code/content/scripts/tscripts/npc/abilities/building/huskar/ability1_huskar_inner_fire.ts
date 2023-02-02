
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { ability2_huskar_burning_spear, modifier_huskar_2_counter } from "./ability2_huskar_burning_spear";

/** dota原技能数据 */
export const Data_huskar_inner_fire = { "ID": "7300", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilitySound": "Hero_Huskar.Inner_Vitality", "HasShardUpgrade": "1", "AbilityCastRange": "500", "AbilityCastPoint": "0.2", "AbilityCooldown": "14 13 12 11", "AbilityManaCost": "75 100 125 150", "AbilityModifierSupportValue": "0.0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage": "100 170 240 310" }, "02": { "var_type": "FIELD_INTEGER", "radius": "500" }, "03": { "var_type": "FIELD_FLOAT", "disarm_duration": "1.75 2.5 3.25 4" }, "04": { "var_type": "FIELD_INTEGER", "knockback_distance": "400" }, "05": { "var_type": "FIELD_FLOAT", "knockback_duration": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_huskar_inner_fire extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "huskar_inner_fire";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_huskar_inner_fire = Data_huskar_inner_fire;
    Init() {
        this.SetDefaultSpecialValue("health_cost_percent", [32, 38, 44, 50, 56, 62]);
        this.SetDefaultSpecialValue("health_damage", [32, 38, 44, 50, 56, 62]);
        this.SetDefaultSpecialValue("max_damage_factor", [150, 200, 250, 300, 350, 400]);
        this.SetDefaultSpecialValue("radius", 800);
        this.SetDefaultSpecialValue("movespeed", -60);
        this.SetDefaultSpecialValue("slow_durtion", 4);
        this.SetDefaultSpecialValue("stack_cost_percent", 10);
        this.SetDefaultSpecialValue("stack_scepter", 10);
        this.SetDefaultSpecialValue("shard_damage_factor", 0.5);

    }



    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_huskar_custom_4")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let health_cost_percent = this.GetSpecialValueFor("health_cost_percent")
        let health_damage = this.GetSpecialValueFor("health_damage")
        let max_damage_factor = this.GetSpecialValueFor("max_damage_factor") + hCaster.GetTalentValue("special_bonus_unique_huskar_custom_8")
        let stack_cost_percent = this.GetSpecialValueFor("stack_cost_percent")
        let radius = this.GetSpecialValueFor("radius")
        let slow_durtion = this.GetSpecialValueFor("slow_durtion")
        let stack_scepter = this.GetSpecialValueFor("stack_scepter")
        let shard_damage_factor = this.GetSpecialValueFor("shard_damage_factor")

        let fLossHealth = hCaster.GetHealth() * health_cost_percent * 0.01
        let fMaxDamage = hCaster.GetMaxHealth() * max_damage_factor * 0.01

        let bHasScepter = hCaster.HasScepter()

        let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, 0, 0, false) as IBaseNpc_Plus[]
        for (let hTarget of (tTargets)) {
            let damage = math.min(hTarget.GetHealth() * health_damage * 0.01, fMaxDamage)
            BattleHelper.GoApplyDamage({
                ability: this,
                victim: hTarget,
                attacker: hCaster,
                damage: damage,
                damage_type: this.GetAbilityDamageType()
            })
            modifier_huskar_1_debuff.apply(hTarget, hCaster, this, { duration: slow_durtion * hTarget.GetStatusResistanceFactor(hCaster) })
            let hAbility = ability2_huskar_burning_spear.findIn(hCaster)
            if (hAbility != null && hAbility.GetLevel() > 0) {
                let iCount = math.ceil((fLossHealth / hCaster.GetMaxHealth()) * 100 / stack_cost_percent)
                if (bHasScepter) {
                    iCount = iCount + stack_scepter
                }
                if (iCount > 0) {
                    modifier_huskar_2_counter.apply(hTarget, hCaster, hAbility, { duration: hAbility.GetDuration(), iCount: iCount })
                }
            }
            // 魔晶
            let hModifier = modifier_huskar_2_counter.findIn(hTarget)
            if (GameFunc.IsValid(hModifier) && hCaster.HasShard()) {
                let fDamage = hModifier.GetStackCount() * hCaster.GetMaxHealth() * shard_damage_factor
                let damage_table =
                {
                    ability: hAbility,
                    attacker: hCaster,
                    victim: hTarget,
                    damage: fDamage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                }
                BattleHelper.GoApplyDamage(damage_table)
            }
        }
        hCaster.ModifyHealth(hCaster.GetHealth() - fLossHealth, this, false, 0)
        //  particle
        modifier_huskar_1_particle_start.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        //  sound
        hCaster.EmitSound('Hero_Huskar.Inner_Fire.Cast')
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_huskar_1"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_huskar_1 extends BaseModifier_Plus {
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
            let teamFilter = ability.GetAbilityTargetTeam()
            let typeFilter = ability.GetAbilityTargetType()
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_huskar_1_debuff extends BaseModifier_Plus {
    movespeed: number;
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        this.movespeed = this.GetSpecialValueFor("movespeed")
        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_huskar_lifebreak.vpcf",
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, true, 10, false, false)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return this.movespeed
    }
}


// 特效
@registerModifier()
export class modifier_huskar_1_particle_start extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_huskar/huskar_inner_fire.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(radius, radius, radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
