
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";

/** dota原技能数据 */
export const Data_bounty_hunter_shuriken_toss = { "ID": "5285", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "FightRecapLevel": "1", "AbilitySound": "Hero_BountyHunter.Shuriken", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilityCastRange": "400", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "8", "AbilityManaCost": "120 125 130 135", "AbilityModifierSupportValue": "0.1", "HasScepterUpgrade": "1", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_damage": "150 225 300 375", "LinkedSpecialBonus": "special_bonus_unique_bounty_hunter_2" }, "02": { "var_type": "FIELD_INTEGER", "speed": "1000 1000 1000 1000" }, "03": { "var_type": "FIELD_INTEGER", "bounce_aoe": "1200" }, "04": { "var_type": "FIELD_FLOAT", "ministun": "0.1" }, "05": { "var_type": "FIELD_INTEGER", "scepter_cast_range": "650", "RequiresScepter": "1" }, "06": { "var_type": "FIELD_FLOAT", "scepter_cooldown": "6", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_bounty_hunter_shuriken_toss extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bounty_hunter_shuriken_toss";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bounty_hunter_shuriken_toss = Data_bounty_hunter_shuriken_toss;
    Init() {
        this.SetDefaultSpecialValue("base_damage", [700, 1000, 1300, 1900, 2500, 3200]);
        this.SetDefaultSpecialValue("attack_factor", [100, 180, 270, 360, 450, 550]);
        this.SetDefaultSpecialValue("speed", 1000);
        this.SetDefaultSpecialValue("bounce_aoe", 1000);
        this.SetDefaultSpecialValue("bounces", 6);
        this.SetDefaultSpecialValue("ministun", 0.1);
        this.SetDefaultSpecialValue("scepter_ministun", 2);

    }




    GetTrackedTarget(vLocation: Vector, tRecordTargets: IBaseNpc_Plus[]) {
        let hCaster = this.GetCasterPlus()
        let tTargets = AoiHelper.FindUnitsInRadiusByModifierName("modifier_bounty_hunter_3_track", hCaster.GetTeamNumber(), vLocation, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST)
        for (let hTarget of (tRecordTargets)) {
            GameFunc.ArrayFunc.ArrayRemove(tTargets, hTarget)
        }
        return tTargets[0]
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus()
        let tHashtable = HashTableHelper.GetHashtableByIndex(ExtraData.hashtable_index)
        let speed = this.GetSpecialValueFor("speed")
        let bounce_aoe = this.GetSpecialValueFor("bounce_aoe")
        let extra_ministun = hCaster.GetTalentValue("special_bonus_unique_bounty_hunter_custom_2")
        let ministun = tHashtable.bHasScepter && this.GetSpecialValueFor("scepter_ministun") || this.GetSpecialValueFor("ministun")
        ministun = ministun + extra_ministun

        if (GameFunc.IsValid(hTarget)) {
            if (hTarget.TriggerSpellAbsorb(this)) {
                return
            }
            vLocation = hTarget.GetAbsOrigin()
        }

        tHashtable.count = tHashtable.count + 1

        if (GameFunc.IsValid(hTarget)) {
            modifier_stunned.apply(hTarget, hCaster, this, { duration: ministun * hTarget.GetStatusResistanceFactor(hCaster) })

            let vPosition = hCaster.GetAbsOrigin()
            let vDirection = (vPosition - hTarget.GetAbsOrigin()) as Vector
            vDirection.z = 0
            modifier_bounty_hunter_1_caster.apply(hCaster, hCaster, this, null)
            hCaster.SetAbsOrigin((hTarget.GetAbsOrigin() + vDirection.Normalized()) as Vector)
            if (tHashtable.bHasScepter) {
                BattleHelper.Attack(hCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
            } else {
                BattleHelper.Attack(hCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
            }

            modifier_bounty_hunter_1_caster.remove(hCaster);
            hCaster.SetAbsOrigin(vPosition)

            table.insert(tHashtable.targets, hTarget)
        }

        if (tHashtable.max_count > tHashtable.count) {
            let hNewTarget = AoiHelper.GetBounceTarget(null, hCaster.GetTeamNumber(), bounce_aoe, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, vLocation, FindOrder.FIND_CLOSEST, false)
            if (hNewTarget != null) {
                let info: CreateTrackingProjectileOptions = {
                    Source: hTarget,
                    Ability: this,
                    EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_bounty_hunter/bounty_hunter_suriken_toss_bounce.vpcf", hCaster),
                    iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                    vSourceLoc: vLocation,
                    iMoveSpeed: speed,
                    Target: hNewTarget,
                    ExtraData: {
                        hashtable_index: HashTableHelper.GetHashtableIndex(tHashtable),
                    },
                }
                ProjectileManager.CreateTrackingProjectile(info)

                return true
            }
        }

        if (tHashtable.bHasScepter) {
            let hNewTarget = this.GetTrackedTarget(vLocation, tHashtable.targets)
            if (hNewTarget != null) {
                tHashtable.count = tHashtable.max_count

                let info: CreateTrackingProjectileOptions = {
                    Source: hTarget,
                    Ability: this,
                    EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_bounty_hunter/bounty_hunter_suriken_toss_bounce.vpcf", hCaster),
                    iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                    vSourceLoc: vLocation,
                    iMoveSpeed: speed,
                    Target: hNewTarget,
                    ExtraData: {
                        hashtable_index: HashTableHelper.GetHashtableIndex(tHashtable),
                    },
                }
                ProjectileManager.CreateTrackingProjectile(info)

                return true
            }
        }

        HashTableHelper.RemoveHashtable(tHashtable)
        return true
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let speed = this.GetSpecialValueFor("speed")
        let bounces = this.GetSpecialValueFor("bounces")
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_BountyHunter.Shuriken", hCaster))
        let tHashtable = HashTableHelper.CreateHashtable()
        tHashtable.count = 0
        tHashtable.max_count = bounces
        tHashtable.targets = {}
        tHashtable.bHasScepter = hCaster.HasScepter()

        let info: CreateTrackingProjectileOptions = {
            Ability: this,
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_bounty_hunter/bounty_hunter_suriken_toss.vpcf", hCaster),
            iSourceAttachment: hCaster.ScriptLookupAttachment("attach_attack1"),
            iMoveSpeed: speed,
            Target: hTarget,
            Source: hCaster,
            ExtraData: {
                hashtable_index: HashTableHelper.GetHashtableIndex(tHashtable),
            }
        }
        ProjectileManager.CreateTrackingProjectile(info)
    }

    GetIntrinsicModifierName() {
        return "modifier_bounty_hunter_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bounty_hunter_1 extends BaseModifier_Plus {
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
                let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
                let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
                let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
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
export class modifier_bounty_hunter_1_caster extends BaseModifier_Plus {
    base_damage: number;
    attack_factor: number;
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
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.base_damage = this.GetSpecialValueFor("base_damage") + hCaster.GetTalentValue("special_bonus_unique_bounty_hunter_custom_4")
        this.attack_factor = this.GetSpecialValueFor("attack_factor") - 100
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    CC_attackSound(params: IModifierTable) {
        return ResHelper.GetSoundReplacement("Hero_BountyHunter.Shuriken.Impact", this.GetCasterPlus())
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        return this.base_damage / ((this.attack_factor + 100) * 0.01)
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: IModifierTable) {
        return this.attack_factor
    }
}
