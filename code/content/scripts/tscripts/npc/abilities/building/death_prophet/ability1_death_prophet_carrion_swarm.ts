
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { ability6_death_prophet_exorcism } from "./ability6_death_prophet_exorcism";

/** dota原技能数据 */
export const Data_death_prophet_carrion_swarm = { "ID": "5090", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_DeathProphet.CarrionSwarm", "AbilityCastRange": "600", "AbilityCastPoint": "0.2", "AbilityCooldown": "8 7 6 5", "AbilityDamage": "75 150 225 300", "AbilityManaCost": "80 95 110 125", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "start_radius": "110" }, "02": { "var_type": "FIELD_INTEGER", "end_radius": "300" }, "03": { "var_type": "FIELD_INTEGER", "range": "810 810 810 810" }, "04": { "var_type": "FIELD_INTEGER", "speed": "1100 1100 1100 1100" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_death_prophet_carrion_swarm extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "death_prophet_carrion_swarm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_death_prophet_carrion_swarm = Data_death_prophet_carrion_swarm;
    Init() {
        this.SetDefaultSpecialValue("damage", [400, 800, 1200, 2000, 2800, 4000]);
        this.SetDefaultSpecialValue("damage_per_int", [4.0, 5.0, 6.0, 7.0, 8.0, 9.0]);
        this.SetDefaultSpecialValue("start_radius", 110);
        this.SetDefaultSpecialValue("end_radius", 300);
        this.SetDefaultSpecialValue("range", 810);
        this.SetDefaultSpecialValue("speed", 1100);

    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let speed = this.GetSpecialValueFor("speed")
        let start_radius = this.GetSpecialValueFor("start_radius")
        let end_radius = this.GetSpecialValueFor("end_radius")
        let range = this.GetSpecialValueFor("range") + hCaster.GetCastRangeBonus()

        let vStartPosition = hCaster.GetAbsOrigin()
        let vTargetPosition = this.GetCursorPosition()
        if (this.GetCursorTarget()) {
            vTargetPosition = this.GetCursorTarget().GetAbsOrigin()
        }
        let vDirection = (vTargetPosition - vStartPosition) as Vector
        vDirection.z = 0
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_death_prophet/death_prophet_carrion_swarm.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControl(iParticleID, 0, vStartPosition)
        ParticleManager.SetParticleControl(iParticleID, 1, (vDirection.Normalized() * speed) as Vector)
        ParticleManager.SetParticleControl(iParticleID, 2, Vector(end_radius, start_radius, 0))

        let hModifier = modifier_death_prophet_1.findIn(hCaster)
        if (GameFunc.IsValid(hModifier)) {
            hModifier.AddParticle(iParticleID, false, false, -1, false, false)
        }

        let tHashtable = HashTableHelper.CreateHashtable()

        tHashtable.end_radius = end_radius
        tHashtable.iParticleID = iParticleID

        let tInfo: CreateLinearProjectileOptions = {
            Ability: this,
            Source: hCaster,
            vSpawnOrigin: vStartPosition,
            vVelocity: (vDirection.Normalized() * speed) as Vector,
            fDistance: range,
            fStartRadius: start_radius,
            fEndRadius: end_radius,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            ExtraData:
            {
                iHashtableIndex: HashTableHelper.GetHashtableIndex(tHashtable),
            },
        }
        tHashtable.iProjectileHandle = ProjectileManager.CreateLinearProjectile(tInfo)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_DeathProphet.CarrionSwarm", hCaster))
    }
    OnProjectileThink_ExtraData(vLocation: Vector, ExtraData: any) {
        let tHashtable = HashTableHelper.GetHashtableByIndex(ExtraData.iHashtableIndex)

        let fNowRadius = ProjectileManager.GetLinearProjectileRadius(tHashtable.iProjectileHandle)
        ParticleManager.SetParticleControl(tHashtable.iParticleID, 2, Vector(tHashtable.end_radius, fNowRadius, 0))
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let tHashtable = HashTableHelper.GetHashtableByIndex(ExtraData.iHashtableIndex)
        if (hTarget != null) {
            if (hTarget.TriggerSpellAbsorb(this)) {
                return
            }
            let hCaster = this.GetCasterPlus()
            let damage = this.GetSpecialValueFor("damage")
            let bonus_damage_per_int = hCaster.GetTalentValue("special_bonus_unique_death_prophet_custom_5")
            let damage_per_int = this.GetSpecialValueFor("damage_per_int") + bonus_damage_per_int

            modifier_death_prophet_1_particle_impact.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_DeathProphet.CarrionSwarm.Damage", hCaster), hCaster)

            let tDamageTable = {
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: damage + hCaster.GetIntellect() * damage_per_int,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(tDamageTable)

            let death_prophet_3 = ability6_death_prophet_exorcism.findIn(hCaster)
            if (GameFunc.IsValid(death_prophet_3) && death_prophet_3.GetLevel() > 0) {
                death_prophet_3.ScepterSpirit(hTarget)
            }

            return false
        }

        if (tHashtable.iParticleID != null) {
            ParticleManager.DestroyParticle(tHashtable.iParticleID, false)
            tHashtable.iParticleID = null
        }

        HashTableHelper.RemoveHashtable(tHashtable)

        return true
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_death_prophet_1"
    // }

}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_death_prophet_1 extends BaseModifier_Plus {
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

            //  优先攻击目标
            let target = caster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[0]
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_death_prophet_1_particle_impact extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hCaster = this.GetParentPlus()
            let hParent = this.GetCasterPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_death_prophet/death_prophet_carrion_swarm_impact.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
