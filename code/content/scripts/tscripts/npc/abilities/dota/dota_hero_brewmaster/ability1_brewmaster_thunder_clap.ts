import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { modifier_brewmaster_2_debuff } from "./ability2_brewmaster_cinder_brew";

/** dota原技能数据 */
export const Data_brewmaster_thunder_clap = { "ID": "5400", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_Brewmaster.ThunderClap", "AbilityCooldown": "13", "AbilityCastPoint": "0.4 0.4 0.4", "AbilityManaCost": "90 100 110 120", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "400 400 400 400", "LinkedSpecialBonus": "special_bonus_unique_brewmaster_7" }, "02": { "var_type": "FIELD_INTEGER", "damage": "90 160 230 300" }, "03": { "var_type": "FIELD_INTEGER", "movement_slow": "25 35 45 55" }, "04": { "var_type": "FIELD_INTEGER", "attack_speed_slow": "25 35 45 55" }, "05": { "var_type": "FIELD_FLOAT", "duration": "4.0", "LinkedSpecialBonus": "special_bonus_unique_brewmaster_3" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_brewmaster_thunder_clap extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "brewmaster_thunder_clap";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_brewmaster_thunder_clap = Data_brewmaster_thunder_clap;
    Init() {
        this.SetDefaultSpecialValue("radius", 900);
        this.SetDefaultSpecialValue("damage", [1000, 2000, 3000, 4000, 5000, 6000]);
        this.SetDefaultSpecialValue("movement_slow", [30, 40, 50, 60, 70, 80]);
        this.SetDefaultSpecialValue("duration", [1.1, 1.4, 1.7, 2.0, 2.3, 2.6]);
        this.SetDefaultSpecialValue("attack_bonus_damage", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("damage_amplify_per", 100);

    }



    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_brewmaster_custom_2")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let damage = this.GetSpecialValueFor("damage")
        let attack_bonus_damage = this.GetSpecialValueFor("attack_bonus_damage")
        let damage_amplify_per = this.GetSpecialValueFor("damage_amplify_per")
        let duration = this.GetSpecialValueFor("duration")
        // 特效
        modifier_brewmaster_1_particle.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        // 音效
        EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Brewmaster.ThunderClap", hCaster), hCaster)
        // 效果
        let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
        for (let hTarget of (tTargets as IBaseNpc_Plus[])) {
            if (GFuncEntity.IsValid(hTarget) && hTarget.IsAlive()) {
                let fDamage = damage + hCaster.GetAverageTrueAttackDamage(null) * attack_bonus_damage
                if (modifier_brewmaster_2_debuff.exist(hTarget)) {
                    fDamage = fDamage + fDamage * damage_amplify_per * 0.01
                }
                let damage_table =
                {
                    ability: this,
                    attacker: hCaster,
                    victim: hTarget,
                    damage: fDamage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                }
                BattleHelper.GoApplyDamage(damage_table)
                // 侍从技为土元素，
                // let hAbility_t28  = qualification_build_t28.findIn(  hCaster )
                // if (GFuncEntity.IsValid(hAbility_t28) && hAbility_t28.GetLevel() >= 1) {
                //     modifier_stunned.apply(hTarget, hCaster, this, { duration: hCaster.HasTalent("special_bonus_unique_brewmaster_custom_6") && duration || duration * hTarget.GetStatusResistanceFactor(hCaster) })
                // } else {
                //     modifier_brewmaster_1_debuff.apply(hTarget, hCaster, this, { duration: hCaster.HasTalent("special_bonus_unique_brewmaster_custom_6") && duration || duration * hTarget.GetStatusResistanceFactor(hCaster) })
                // }
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_brewmaster_1"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_brewmaster_1 extends BaseModifier_Plus {
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

            let range = ability.GetSpecialValueFor("radius")

            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets.length > 0) {
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
// Modifiers
@registerModifier()
export class modifier_brewmaster_1_debuff extends BaseModifier_Plus {
    movement_slow: number;
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
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.movement_slow = this.GetSpecialValueFor("movement_slow")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.movement_slow
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_brewmaster_1_particle extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_brewmaster/brewmaster_thunder_clap.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(radius, radius, radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
