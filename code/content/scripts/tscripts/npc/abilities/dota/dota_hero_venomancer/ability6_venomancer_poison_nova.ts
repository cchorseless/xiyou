
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_poison } from "../../../modifier/effect/modifier_poison";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_venomancer_poison_nova = { "ID": "5181", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "2", "AbilitySound": "Hero_Venomancer.PoisonNova", "HasScepterUpgrade": "1", "AbilityCastPoint": "0.0 0.0 0.0", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "140.0 120.0 100.0", "AbilityManaCost": "200 300 400", "AbilityModifierSupportValue": "0.0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "885", "LinkedSpecialBonus": "special_bonus_unique_venomancer_6" }, "02": { "var_type": "FIELD_INTEGER", "start_radius": "255 255 255" }, "03": { "var_type": "FIELD_FLOAT", "duration": "20", "LinkedSpecialBonus": "special_bonus_unique_venomancer_4" }, "04": { "var_type": "FIELD_INTEGER", "damage": "40 65 90" }, "05": { "var_type": "FIELD_FLOAT", "cooldown_scepter": "100.0 80.0 60.0", "RequiresScepter": "1" }, "06": { "var_type": "FIELD_FLOAT", "duration_scepter": "18", "LinkedSpecialBonus": "special_bonus_unique_venomancer_4", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_INTEGER", "damage_scepter": "75 100 125", "RequiresScepter": "1" }, "08": { "var_type": "FIELD_INTEGER", "speed": "500" } } };

@registerAbility()
export class ability6_venomancer_poison_nova extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "venomancer_poison_nova";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_venomancer_poison_nova = Data_venomancer_poison_nova;
    Init() {
        this.SetDefaultSpecialValue("radius", 830);
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("poison_count_per_sec_agi", [3, 3.5, 4, 4.5, 5, 6]);
        this.SetDefaultSpecialValue("count_multiple_scepter", 2);
        this.SetDefaultSpecialValue("extend_duration", 3);
        this.SetDefaultSpecialValue("extend_radius", 325);
        this.SetDefaultSpecialValue("start_radius", [255, 255, 255]);
        this.SetDefaultSpecialValue("speed", 500);
        this.SetDefaultSpecialValue("poison_ticktime_pct", -30);

    }

    Init_old() {
        this.SetDefaultSpecialValue("radius", 830);
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("poison_count_per_sec_agi", [0.3, 0.6, 0.9, 1.2, 1.5, 2.0]);
        this.SetDefaultSpecialValue("count_multiple_scepter", 2);
        this.SetDefaultSpecialValue("extend_duration", 3);
        this.SetDefaultSpecialValue("extend_radius", 325);
        this.SetDefaultSpecialValue("start_radius", [255, 255, 255]);
        this.SetDefaultSpecialValue("speed", 500);

    }


    radius: number;
    start_radius: number;
    speed: number;
    tTargetsRecord: any[];
    vCastPos: Vector;
    fRadius: number;

    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_unique_venomancer_custom_3")
    }
    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        this.radius = this.GetSpecialValueFor("radius")
        this.start_radius = this.GetSpecialValueFor("start_radius")
        this.speed = this.GetSpecialValueFor("speed")
        this.tTargetsRecord = []
        this.fRadius = 0
        this.vCastPos = hCaster.GetAbsOrigin()
        this.radius = this.start_radius
        this.addFrameTimer(
            1, () => {
                this.fRadius = this.fRadius + this.speed * FrameTime()
                if (this.fRadius > this.radius) {
                    this.fRadius = this.radius
                    this.damageTargets()
                } else {
                    this.damageTargets()
                    return 1
                }
            }
        )
        EmitSoundOnLocationWithCaster(this.vCastPos, ResHelper.GetSoundReplacement("Hero_Venomancer.PoisonNova", hCaster), hCaster)
        modifier_venomancer_6_particle_venomancer_poison_nova_cast.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
    }
    damageTargets() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration") + hCaster.GetTalentValue("special_bonus_unique_venomancer_custom_5")
        let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), this.vCastPos, null, this.fRadius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false)
        if (tTargets[0] != null) {
            for (let hTarget of (tTargets)) {
                if (this.tTargetsRecord.indexOf(hTarget) == -1) {
                    table.insert(this.tTargetsRecord, hTarget)
                    modifier_poison.Poison(hTarget, hCaster, this, modifier_poison.GetPoisonStackCount(hTarget) * hCaster.GetTalentValue("special_bonus_unique_venomancer_custom_7") * 0.01)
                    EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Venomancer.PoisonNovaImpact", hCaster), hCaster)
                    modifier_venomancer_6_debuff.apply(hTarget, hCaster, this, { duration: duration })
                }
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_venomancer_6"
    }


}

// // // // // // // // // // // // // // // // // // // -modifier_venomancer_6// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_venomancer_6 extends BaseModifier_Plus {
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
            this.Destroy()
            return
        }
        if (!hAbility.GetAutoCastState()) {
            return
        }
        if (!hAbility.IsAbilityReady()) {
            return
        }

        let fRange = hAbility.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
        let teamFilter = hAbility.GetAbilityTargetTeam()
        let typeFilter = hAbility.GetAbilityTargetType()
        let flagFilter = hAbility.GetAbilityTargetFlags()
        let order = FindOrder.FIND_CLOSEST
        let targets = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, fRange, teamFilter, typeFilter, flagFilter, order, false)
        if (targets[0] != null) {
            ExecuteOrderFromTable(
                {
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: hAbility.entindex()
                }
            )
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_venomancer_6_debuff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_venomancer_6_debuff extends BaseModifier_Plus {
    extend_duration: number;
    extend_radius: number;
    poison_count_per_sec_agi: number;
    poison_count_per: number;
    count_multiple_scepter: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.POISON_TICKTIME_PERCENTAGE)
    poison_ticktime: number;
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            modifier_poison.Poison(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), this.poison_count_per * 1) // 在一开始就毒一次
            this.StartIntervalThink(1)
        }
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus() as BaseNpc_Hero_Plus
        if (!GameFunc.IsValid(hCaster) || hCaster.GetAgility == null) {
            this.Destroy()
            return
        }
        this.extend_duration = this.GetSpecialValueFor("extend_duration")
        this.extend_radius = this.GetSpecialValueFor("extend_radius")
        this.poison_count_per_sec_agi = this.GetSpecialValueFor("poison_count_per_sec_agi")
        this.poison_count_per = math.floor(this.poison_count_per_sec_agi * hCaster.GetAgility())
        this.count_multiple_scepter = this.GetSpecialValueFor("count_multiple_scepter")
        if (this.GetCasterPlus().HasScepter()) {
            this.poison_count_per = this.poison_count_per * this.count_multiple_scepter
        }
        this.poison_ticktime = this.GetSpecialValueFor("poison_ticktime_pct") + hCaster.GetTalentValue("special_bonus_unique_venomancer_custom_6")
    }
    BeDestroy() {

        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                return
            }
            let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), null, this.extend_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false)
            for (let hTarget of (tTarget)) {
                if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                    let hModifier = modifier_venomancer_6_debuff.findIn(hTarget) as IBaseModifier_Plus;
                    if (GameFunc.IsValid(hModifier)) {
                        hModifier.SetDuration(hModifier.GetRemainingTime() + this.extend_duration, true)
                        modifier_venomancer_6_particle_venomancer_3_infect.apply(hTarget, hParent, this.GetAbilityPlus(), { duration: modifier_venomancer_6_debuff.LOCAL_PARTICLE_MODIFIER_DURATION })
                    }
                }
            }
        }
    }
    OnIntervalThink() {
        if (!IsServer()) {
            return
        }
        let hAbility = this.GetAbilityPlus()
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (!GameFunc.IsValid(hAbility) || !GameFunc.IsValid(hCaster)) {
            this.StartIntervalThink(-1)
            this.Destroy()
            return
        }
        modifier_poison.Poison(hParent, hCaster, hAbility, this.poison_count_per * 1)
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    Tooltip() {
        return this.poison_count_per
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
export class modifier_venomancer_6_particle_venomancer_poison_nova_cast extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let radius = this.GetSpecialValueFor("radius")
        let start_radius = this.GetSpecialValueFor("start_radius")
        let speed = this.GetSpecialValueFor("speed")
        if (IsClient()) {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_venomancer/venomancer_poison_nova_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
                owner: hCaster
            });

            ParticleManager.ReleaseParticleIndex(iPtclID)
            iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_venomancer/venomancer_poison_nova.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iPtclID, 0, hCaster.GetAbsOrigin())
            ParticleManager.SetParticleControl(iPtclID, 1, Vector(radius, (radius - start_radius) / speed * 1.5, speed)) // 参数3控制特效的life duration
            ParticleManager.ReleaseParticleIndex(iPtclID)
        }
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // //
export class modifier_venomancer_6_particle_venomancer_3_infect extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/particle_sr/venomancer/venomancer_3_infect.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
                owner: this.GetCasterPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), false)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }

}
