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
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { modifier_earth_spirit_3 } from "./ability3_earth_spirit_geomagnetic_grip";

/** dota原技能数据 */
export const Data_earth_spirit_magnetize = { "ID": "5612", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "2", "AbilitySound": "Hero_EarthSpirit.Magnetize.Cast", "AbilityDraftPreAbility": "earth_spirit_stone_caller", "AbilityDraftUltScepterAbility": "earth_spirit_petrify", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_6", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastRange": "350", "AbilityCastPoint": "0.01", "AbilityCooldown": "100 90 80", "AbilityManaCost": "100.0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "cast_radius": "350" }, "02": { "var_type": "FIELD_INTEGER", "damage_per_second": "40 80 120" }, "03": { "var_type": "FIELD_FLOAT", "damage_duration": "6.0" }, "04": { "var_type": "FIELD_INTEGER", "rock_search_radius": "400" }, "05": { "var_type": "FIELD_INTEGER", "rock_explosion_radius": "600" }, "06": { "var_type": "FIELD_FLOAT", "damage_interval": "1.0" }, "07": { "var_type": "FIELD_FLOAT", "rock_explosion_delay": "8.0" }, "08": { "var_type": "FIELD_FLOAT", "silence_duration": "5.0" }, "09": { "var_type": "FIELD_FLOAT", "slow_duration": "2.0" } } };

@registerAbility()
export class ability6_earth_spirit_magnetize extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "earth_spirit_magnetize";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_earth_spirit_magnetize = Data_earth_spirit_magnetize;
    Init() {
        this.SetDefaultSpecialValue("radius", 900);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("damage", [1000, 1800, 2600, 3500, 4300, 5200]);
        this.SetDefaultSpecialValue("duration_enhanced", 6);
        this.SetDefaultSpecialValue("shard_all_attribute_damage", 8);
        this.SetDefaultSpecialValue("damage_pct_perS", [25, 30, 35, 40, 45, 50]);
        this.OnInit();
    }






    OnSpellStart() {
        let hCaster = this.GetCasterPlus() as BaseNpc_Plus & { tMagnetized: Array<any> }
        let radius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("duration") + hCaster.GetTalentValue('special_bonus_unique_earth_spirit_custom_6')
        let duration_enhanced = this.GetSpecialValueFor("duration_enhanced")
        let teamFilter = this.GetAbilityTargetTeam()
        let typeFilter = this.GetAbilityTargetType()
        let flagFilter = this.GetAbilityTargetFlags()
        let order = FindOrder.FIND_ANY_ORDER
        let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), radius, null, teamFilter, typeFilter, flagFilter, order)
        if (targets[0] != null) {
            for (let hTarget of (targets)) {
                modifier_earth_spirit_6_magnetized.apply(hTarget, hCaster, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })
            }
        }

        if (hCaster.HasScepter()) {
            let mdf4 = modifier_earth_spirit_3.findIn(hCaster)
            if (GameFunc.IsValid(mdf4) && mdf4.UseStone()) {
                modifier_earth_spirit_6_enhanced_aura.apply(hCaster, hCaster, this, { duration: duration_enhanced })
            }
        }

        modifier_earth_spirit_6_cast_particle.applyThinker(hCaster.GetAbsOrigin(), hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthSpirit.Magnetize.Cast", hCaster))
    }

    OnInit() {
        this.addTimer(0, () => {
            (this.GetCasterPlus() as BaseNpc_Plus & { tMagnetized: Array<any> }).tMagnetized = []
        })
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_earth_spirit_6"
    // }


}
// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_6// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_6 extends BaseModifier_Plus {
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
        if (!IsServer()) {
            return
        }
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hAbility)) {
            this.StartIntervalThink(-1)
            this.Destroy()
            return
        }

        let hCaster = hAbility.GetCasterPlus()

        if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
            this.StartIntervalThink(-1)
            return
        }

        if (!hAbility.GetAutoCastState()) {
            return
        }

        if (!hAbility.IsAbilityReady()) {
            return
        }

        let radius = hAbility.GetSpecialValueFor("radius")
        let teamFilter = hAbility.GetAbilityTargetTeam()
        let typeFilter = hAbility.GetAbilityTargetType()
        let flagFilter = hAbility.GetAbilityTargetFlags()
        let order = FindOrder.FIND_ANY_ORDER
        let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), radius, null, teamFilter, typeFilter, flagFilter, order)
        if (targets[0] != null) {
            ExecuteOrderFromTable({
                UnitIndex: hCaster.entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                AbilityIndex: hAbility.entindex(),
            })
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_6_magnetized// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_6_magnetized extends BaseModifier_Plus {
    damage: number;
    shard_all_attribute_damage: number;
    damage_pct_perS: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return false
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

    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.StartIntervalThink(0)
        if (IsServer()) {
            table.insert((this.GetCasterPlus() as BaseNpc_Plus & { tMagnetized: Array<any> }).tMagnetized, this.GetParentPlus())
        }

    }

    Init(params: ModifierTable) {
        this.damage = this.GetSpecialValueFor("damage")
        this.shard_all_attribute_damage = this.GetSpecialValueFor("shard_all_attribute_damage")
        this.damage_pct_perS = this.GetSpecialValueFor("damage_pct_perS")
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hCaster = this.GetCasterPlus() as BaseNpc_Plus & { tMagnetized: Array<any> }
            if (GameFunc.IsValid(hCaster)) {
                this.GetParentPlus().EmitSound(ResHelper.GetSoundReplacement("Hero_EarthSpirit.Magnetize.End", this.GetCasterPlus()))
                GameFunc.ArrayFunc.ArrayRemove(hCaster.tMagnetized, this.GetParentPlus())
            }
        }
    }
    OnIntervalThink() {
        let hAbility = this.GetAbilityPlus()
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()

        if (IsServer()) {
            if (!GameFunc.IsValid(hAbility) || !GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthSpirit.Magnetize.Target.Tick", hCaster))

            // 天赋4 力量系数
            let damage = this.damage
            if (hCaster.GetStrength) {
                damage = damage + hCaster.GetStrength() * hCaster.GetTalentValue('special_bonus_unique_earth_spirit_custom_4')
            }

            if (hCaster.HasShard()) {
                damage = damage + this.shard_all_attribute_damage * hCaster.GetAllStats()
            }
            //  pipixia 添加技能百分比伤害
            damage = damage + hCaster.GetMaxHealth() * this.damage_pct_perS / 100;
            //  pipixia }
            BattleHelper.GoApplyDamage({
                ability: hAbility,
                attacker: hCaster,
                victim: hParent,
                damage: damage,
                damage_type: hAbility.GetAbilityDamageType()
            })
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earth_spirit/espirit_magnetize_target.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
            ParticleManager.SetParticleControlEnt(particleID, 1, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
            ParticleManager.SetParticleControl(particleID, 2, Vector(500, 1, 1))
            this.AddParticle(particleID, false, false, -1, false, false)
        }

        this.StartIntervalThink(1)
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    G_INCOMING_DAMAGE_PERCENTAGE() {
        return this.GetCasterPlus().GetTalentValue('special_bonus_unique_earth_spirit_custom_8')
    }
}

// // // // // // // // // // // // // // // // // // // -modifier_earth_spirit_6_enhanced_aura// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_6_enhanced_aura extends BaseModifier_Plus {
    duration: any;
    radius: number;
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
        return true
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
    GetAuraRadius() {
        return this.radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
    }
    GetAura() {
        return 'modifier_earth_spirit_6_magnetized'
    }
    GetAuraDuration() {
        return this.duration
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        //   做一个特效标识光环范围
        if (IsClient()) {
            this.StartIntervalThink(0)
        }
    }
    Init(params: ModifierTable) {
        this.duration = this.GetSpecialValueFor("duration") + this.GetCasterPlus().GetTalentValue('special_bonus_unique_earth_spirit_custom_6')
        this.radius = this.GetSpecialValueFor("radius")
    }

    OnIntervalThink() {
        if (IsServer()) {
            return
        }
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        let particleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_earth_spirit/espirit_magnetize_target.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            owner: hParent
        });

        ParticleManager.SetParticleControlEnt(particleID, 0, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
        ParticleManager.SetParticleControlEnt(particleID, 1, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
        ParticleManager.SetParticleControl(particleID, 2, Vector(this.radius * 1.5, 1, 1))
        this.AddParticle(particleID, false, false, -1, false, false)
        this.StartIntervalThink(1)
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earth_spirit_6_cast_particle extends modifier_particle_thinker {
    radius: number;
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            this.radius = this.GetSpecialValueFor("radius")
            let sParticleName = ResHelper.GetParticleReplacement("particles/units/heroes/hero_earth_spirit/espirit_magnetize_pulse.vpcf", hCaster)
            let iParticle = ResHelper.CreateParticle({
                resPath: sParticleName,
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticle, 2, Vector(this.radius, 0, 0))
            ParticleManager.ReleaseParticleIndex(iParticle)
        }
    }
}