import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_poison } from "../../../modifier/effect/modifier_poison";
import { modifier_knockback } from "../../../modifier/modifier_knockback";
import { modifier_particle } from "../../../modifier/modifier_particle";
/** dota原技能数据 */
export const Data_queenofpain_sonic_wave = { "ID": "5176", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_DIRECTIONAL | DOTA_ABILITY_BEHAVIOR_POINT", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "FightRecapLevel": "2", "HasScepterUpgrade": "1", "AbilitySound": "Hero_QueenOfPain.SonicWave", "AbilityCastRange": "700", "AbilityCastPoint": "0.452 0.452 0.452", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "125", "AbilityManaCost": "250 400 550", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "starting_aoe": "100" }, "02": { "var_type": "FIELD_INTEGER", "distance": "900" }, "03": { "var_type": "FIELD_INTEGER", "final_aoe": "450" }, "04": { "var_type": "FIELD_INTEGER", "speed": "900" }, "05": { "var_type": "FIELD_INTEGER", "damage": "340 450 560", "LinkedSpecialBonus": "special_bonus_unique_queen_of_pain_4" }, "06": { "var_type": "FIELD_FLOAT", "cooldown_scepter": "40", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_INTEGER", "damage_scepter": "420 560 680", "RequiresScepter": "1" }, "08": { "var_type": "FIELD_INTEGER", "knockback_distance": "350" }, "09": { "var_type": "FIELD_FLOAT", "knockback_duration": "1.4" } } };

@registerAbility()
export class ability6_queenofpain_sonic_wave extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "queenofpain_sonic_wave";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_queenofpain_sonic_wave = Data_queenofpain_sonic_wave;
    Init() {
        this.SetDefaultSpecialValue("knockback_distance_scepter", 250);
        this.SetDefaultSpecialValue("knockback_duration", 0.5);
        this.SetDefaultSpecialValue("delay", 0.452);
        this.SetDefaultSpecialValue("starting_aoe", 100);
        this.SetDefaultSpecialValue("distance", 900);
        this.SetDefaultSpecialValue("final_aoe", 450);
        this.SetDefaultSpecialValue("speed", 900);
        this.SetDefaultSpecialValue("damage", [3400, 4300, 5200, 6100, 7000, 8000]);
        this.SetDefaultSpecialValue("damage_scepter", [13400, 14300, 15200, 16100, 17000, 18000]);
        this.SetDefaultSpecialValue("damage_per_int", [4.5, 5, 6, 7.5, 9, 11]);
        this.SetDefaultSpecialValue("knockback_distance", 200);

    }

    Init_old() {
        this.SetDefaultSpecialValue("delay", 0.452);
        this.SetDefaultSpecialValue("starting_aoe", 100);
        this.SetDefaultSpecialValue("distance", 900);
        this.SetDefaultSpecialValue("final_aoe", 450);
        this.SetDefaultSpecialValue("speed", 900);
        this.SetDefaultSpecialValue("damage", [3400, 4300, 5200, 6100, 7000, 8000]);
        this.SetDefaultSpecialValue("damage_scepter", [13400, 14300, 5200, 16100, 17000, 18000]);
        this.SetDefaultSpecialValue("bleeding_duration", 5);
        this.SetDefaultSpecialValue("bleeding_damage_percent", 5);

    }



    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_unique_queenofpain_custom_2")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        let delay = this.GetSpecialValueFor("delay")
        let starting_aoe = this.GetSpecialValueFor("starting_aoe")
        let distance = this.GetSpecialValueFor("distance")
        let final_aoe = this.GetSpecialValueFor("final_aoe")
        let speed = this.GetSpecialValueFor("speed")

        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_queenofpain/queen_blink_start.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControlForward(iParticleID, 0, hCaster.GetForwardVector())
        ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAbsOrigin())
        ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
        ParticleManager.ReleaseParticleIndex(iParticleID)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_QueenOfPain.Blink_out", hCaster))

        let sLastCornerName = "hTarget.Spawner_lastCornerName"
        let sNextCornerName = "hTarget.Spawner_targetCornerName"
        let vDirection = (-hTarget.GetForwardVector()) as Vector
        let hLastCorner = Entities.FindByName(null, sLastCornerName)
        let hNextCorner = Entities.FindByName(null, sNextCornerName)
        if (hLastCorner && hNextCorner) {
            vDirection = (hLastCorner.GetAbsOrigin() - hNextCorner.GetAbsOrigin()) as Vector
            vDirection.z = 0
        }

        let fOffsetDistance = delay * hTarget.GetMoveSpeedModifier(hTarget.GetBaseMoveSpeed(), false) + starting_aoe

        let vPosition = (hTarget.GetAbsOrigin() - vDirection.Normalized() * fOffsetDistance) as Vector

        let hDummy = CreateUnitByName(hCaster.GetUnitName(), vPosition, false, hCaster, hCaster, hCaster.GetTeamNumber())
        hDummy.SetForwardVector(hCaster.GetForwardVector())
        hDummy.FaceTowards(hTarget.GetAbsOrigin())

        iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_queenofpain/queen_blink_end.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: hDummy
        });

        ParticleManager.SetParticleControl(iParticleID, 0, hDummy.GetAbsOrigin())
        ParticleManager.SetParticleControlForward(iParticleID, 0, hDummy.GetForwardVector())
        ParticleManager.SetParticleControlEnt(iParticleID, 1, hDummy, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hDummy.GetAbsOrigin(), true)
        ParticleManager.ReleaseParticleIndex(iParticleID)

        for (let i = hDummy.GetAbilityCount() - 1; i >= 0; i--) {
            let ability = hDummy.GetAbilityByIndex(i)
            if (GameFunc.IsValid(ability)) {
                hDummy.RemoveAbilityByHandle(ability)
            }
        }

        modifier_queenofpain_6_thinker.apply(hDummy, hCaster, this, { duration: delay + (starting_aoe + distance + final_aoe) / speed + BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        hDummy.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4)
        EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_QueenOfPain.Blink_in", hCaster), hCaster)
        this.addTimer(delay, () => {
            let tInfo = {
                Ability: this,
                Source: hCaster,
                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_queenofpain/queen_sonic_wave.vpcf", hCaster),
                vSpawnOrigin: vPosition,
                fDistance: distance,
                fStartRadius: starting_aoe,
                fEndRadius: final_aoe,
                vVelocity: (vDirection.Normalized() * speed) as Vector,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,
                bProvidesVision: false,
                ExtraData: {
                    dummy_ent_index: hDummy.entindex(),
                }
            }
            ProjectileManager.CreateLinearProjectile(tInfo)
            EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_QueenOfPain.SonicWave", hCaster), hCaster)
        })
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (GameFunc.IsValid(hTarget)) {
            let hCaster = this.GetCasterPlus()
            let damage = hCaster.HasScepter() && this.GetSpecialValueFor("damage_scepter") || this.GetSpecialValueFor("damage")
            let damage_per_int = this.GetSpecialValueFor("damage_per_int")
            let knockback_distance = hCaster.HasScepter() && this.GetSpecialValueFor("knockback_distance_scepter") || this.GetSpecialValueFor("knockback_distance")
            let knockback_duration = this.GetSpecialValueFor("knockback_duration")

            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_QueenOfPain.ShadowStrike.Target", hCaster), hCaster)

            let hDummy = EntIndexToHScript(ExtraData.dummy_ent_index || -1) as IBaseNpc_Plus
            if (GameFunc.IsValid(hDummy)) {
                modifier_queenofpain_6_particle.apply(hDummy, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

                let vCenter = hDummy.GetAbsOrigin()

                modifier_knockback.remove(hTarget);
                modifier_knockback.apply(hTarget, hCaster, this, {
                    center_x: vCenter.x,
                    center_y: vCenter.y,
                    center_z: vCenter.z,
                    should_stun: 0,
                    duration: knockback_duration * hTarget.GetStatusResistanceFactor(this.GetCasterPlus()),
                    knockback_duration: knockback_duration,
                    knockback_distance: knockback_distance,
                    knockback_height: 0,
                })
            }

            let tDamageTable = {
                ability: this,
                victim: hTarget,
                attacker: hCaster,
                damage: damage + hCaster.GetIntellect() * damage_per_int,
                damage_type: this.GetAbilityDamageType(),
            }
            BattleHelper.GoApplyDamage(tDamageTable)

            if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                if (hCaster.HasTalent("special_bonus_unique_queenofpain_custom_5")) {
                    let iStackCount = modifier_poison.GetPoisonStackCount(hTarget)
                    if (iStackCount > 0) {
                        let damage_per_stack = hCaster.GetTalentValue("special_bonus_unique_queenofpain_custom_5")
                        modifier_poison.RemovePoison(hTarget)
                        let iParticleID = ResHelper.CreateParticle({
                            resPath: "particles/units/heroes/hero_queenofpain/queen_sonic_wave_poison_explode.vpcf",
                            resNpc: hCaster,
                            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                            owner: hTarget
                        });

                        ParticleManager.SetParticleControlEnt(iParticleID, 0, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
                        ParticleManager.ReleaseParticleIndex(iParticleID)

                        let tDamageTable = {
                            ability: this,
                            victim: hTarget,
                            attacker: hCaster,
                            damage: damage_per_stack * iStackCount,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        }
                        BattleHelper.GoApplyDamage(tDamageTable)
                    }
                }
            }

            return false
        }

        return true
    }

    GetIntrinsicModifierName() {
        return "modifier_queenofpain_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_queenofpain_6 extends BaseModifier_Plus {
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

            let hCaster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()

            //  优先攻击目标
            let target = hCaster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
            if (target != null && !target.IsPositionInRange(hCaster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[0]
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
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
export class modifier_queenofpain_6_thinker extends BaseModifier_Plus {
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
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_queenofpain/queen_sonic_wave_cast.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_UNTARGETABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_SELECT]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_queenofpain_6_particle extends modifier_particle {
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_queenofpain/queen_sonic_wave_tgt.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
            if (hCaster.GetHealthPercent() <= 0) {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_queenofpain/queen_target_death.vpcf",
                    resNpc: hParent,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: hCaster
                });

                ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
                ParticleManager.ReleaseParticleIndex(iParticleID)
            }
        }
    }
}
