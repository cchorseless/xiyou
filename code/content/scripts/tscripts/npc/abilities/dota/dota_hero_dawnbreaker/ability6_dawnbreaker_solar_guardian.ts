import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_stunned } from "../../../modifier/effect/modifier_generic_stunned";

/** dota原技能数据 */
export const Data_dawnbreaker_solar_guardian = { "ID": "7906", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_CHANNELLED", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilityCastRange": "0", "AbilityCastPoint": "0.1 0.1 0.1 0.1", "AbilityChannelTime": "1.7", "AbilityCooldown": "120 110 100", "AbilityManaCost": "150 200 250", "AbilityModifierSupportValue": "0.25", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "airtime_duration": "0.8" }, "02": { "var_type": "FIELD_INTEGER", "radius": "500" }, "03": { "var_type": "FIELD_INTEGER", "base_damage": "30 50 70" }, "04": { "var_type": "FIELD_INTEGER", "base_heal": "45 70 95" }, "05": { "var_type": "FIELD_FLOAT", "pulse_interval": "0.5" }, "06": { "var_type": "FIELD_INTEGER", "land_damage": "130 160 190" }, "07": { "var_type": "FIELD_FLOAT", "land_stun_duration": "1.5 1.75 2" }, "08": { "var_type": "FIELD_INTEGER", "max_offset_distance": "350" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4" };

@registerAbility()
export class ability6_dawnbreaker_solar_guardian extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dawnbreaker_solar_guardian";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dawnbreaker_solar_guardian = Data_dawnbreaker_solar_guardian;
    Init() {
        this.SetDefaultSpecialValue("pluse_interval", 0.5);
        this.SetDefaultSpecialValue("pluse_damage_pct", [80, 100, 120, 140, 160, 190]);
        this.SetDefaultSpecialValue("boom_damage_pct", [200, 250, 300, 350, 400, 450]);
        this.SetDefaultSpecialValue("dizziness_time", 3);
        this.SetDefaultSpecialValue("duration", 1.5);
        this.SetDefaultSpecialValue("damage_range", 850);

    }



    CastFilterResult() {
        let caster = this.GetCasterPlus() as IBaseNpc_Plus & { no_hammer: boolean }
        //  没有锤子无法释放
        if (caster.no_hammer) {
            this.errorStr = "dota_hud_error_dawnbreaker_no_hammer"
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        return UnitFilterResult.UF_SUCCESS
    }


    GetBehavior() {
        let hCaster = this.GetCasterPlus()
        let _Behavior = tonumber(tostring(super.GetBehavior()))
        if (hCaster.HasTalent("special_bonus_unique_dawnbreaker_custom_3")) {
            _Behavior = _Behavior - DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE
        }
        return _Behavior
    }

    GetCastAnimation() {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasTalent("special_bonus_unique_dawnbreaker_custom_3")) {
            return GameActivity_t.ACT_RESET
        }
        return super.GetCastAnimation()
    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        //  天赋 无施法动作
        if (!hCaster.HasTalent("special_bonus_unique_dawnbreaker_custom_3")) {
            //  特效
            hCaster.addTimer(69 * 0.02,
                () => {
                    hCaster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4)
                })
        }
        //  音效
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Dawnbreaker.Solar_Guardian.BlastOff", hCaster))

        modifier_dawnbreaker_6_buff.apply(hCaster, hCaster, this, { duration: duration })
        //  音效
        //  特效
        let p = "particles/units/heroes/hero_dawnbreaker/dawnbreaker_solar_guardian_aoe.vpcf"
        let angle = hCaster.GetForwardVector() * 400
        //  let vpoint = hCaster.GetAbsOrigin() + angle
        let vpoint = hCaster.GetAbsOrigin()
        let _Particle_fire_id = ResHelper.CreateParticle({
            resPath: p,
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_POINT,
            owner: hCaster
        });

        ParticleManager.SetParticleControl(_Particle_fire_id, 0, vpoint)
        ParticleManager.SetParticleControl(_Particle_fire_id, 1, vpoint)
        ParticleManager.SetParticleControl(_Particle_fire_id, 2, Vector(850, 400, 0))
        //  特效2
        let p2 = "particles/units/heroes/hero_dawnbreaker/dawnbreaker_solar_guardian.vpcf"
        let _Particle_fire_id2 = ResHelper.CreateParticle({
            resPath: p2,
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_POINT,
            owner: hCaster
        });

        ParticleManager.SetParticleControl(_Particle_fire_id2, 0, vpoint)
        hCaster.addTimer(duration,
            () => {
                ParticleManager.DestroyParticle(_Particle_fire_id, true)
                ParticleManager.DestroyParticle(_Particle_fire_id2, true)
                //  特效3 落地
                let p3 = "particles/units/heroes/hero_dawnbreaker/dawnbreaker_solar_guardian_landing.vpcf"
                let _Particle_fire_id3 = ResHelper.CreateParticle({
                    resPath: p3,
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_POINT,
                    owner: hCaster
                });

                ParticleManager.SetParticleControl(_Particle_fire_id3, 0, vpoint)
                hCaster.addTimer(1,
                    () => {
                        ParticleManager.DestroyParticle(_Particle_fire_id3, true)
                    })
            })
    }

    GetIntrinsicModifierName() {
        return "modifier_dawnbreaker_6"
    }


}
//  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  // Modifiers
@registerModifier()
export class modifier_dawnbreaker_6 extends BaseModifier_Plus {
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
            if (!IsValid(ability)) {
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
            let range = caster.Script_GetAttackRange()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_dawnbreaker_6_buff extends BaseModifier_Plus {
    pluse_interval: number;
    boom_damage_pct: number;
    pluse_damage_pct: number;
    damage_range: number;
    dizziness_time: number;
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

    FindMissingInRadius(radius: number, p: Vector = null) {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            let caster = ability.GetCasterPlus()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
            let order = FindOrder.FIND_ANY_ORDER
            if (p == null) { p = caster.GetAbsOrigin() }
            let tTargets = AoiHelper.FindEntityInRadius(
                caster.GetTeamNumber(),
                p,
                radius,
                null,
                teamFilter,
                typeFilter,
                flagFilter,
                order)
            return tTargets
        }
    }

    BeCreated(params: IModifierTable) {

        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            hAbility.SetActivated(false)
            this.StartIntervalThink(this.pluse_interval)
        }
    }
    Init(params: IModifierTable) {
        this.pluse_interval = this.GetSpecialValueFor("pluse_interval")
        this.pluse_damage_pct = this.GetSpecialValueFor("pluse_damage_pct")
        this.boom_damage_pct = this.GetSpecialValueFor("boom_damage_pct")
        this.dizziness_time = this.GetSpecialValueFor("dizziness_time")
        this.damage_range = this.GetSpecialValueFor("damage_range")
    }

    BeDestroy() {

        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            this.StartIntervalThink(-1)
            //  造成眩晕和爆炸
            let tTargets = this.FindMissingInRadius(this.damage_range)
            let damage = hParent.GetMaxHealth() * this.boom_damage_pct * 0.01
            for (let hTarget of (tTargets)) {
                //  造成眩晕
                modifier_generic_stunned.apply(hTarget, hParent, hAbility, { duration: this.dizziness_time * hTarget.GetStatusResistanceFactor(hParent) })
                //  造成伤害
                let tDamageTable = {
                    ability: hAbility,
                    victim: hTarget,
                    attacker: hParent,
                    damage: damage,
                    damage_type: hAbility.GetAbilityDamageType()
                }
                BattleHelper.GoApplyDamage(tDamageTable)
            }
            //  音效
            hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_Dawnbreaker.Celestial_Hammer.Cast", hParent))
            hAbility.SetActivated(true)
        }
    }
    OnIntervalThink() {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            //  对目标造成伤害
            let tTargets = this.FindMissingInRadius(this.damage_range)
            let damage = hParent.GetMaxHealth() * this.pluse_damage_pct * 0.01
            for (let hTarget of (tTargets)) {
                let tDamageTable = {
                    ability: hAbility,
                    victim: hTarget,
                    attacker: hParent,
                    damage: damage,
                    damage_type: hAbility.GetAbilityDamageType()
                }
                BattleHelper.GoApplyDamage(tDamageTable)
            }
        }
    }
}
