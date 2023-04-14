import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_feared } from "../../../modifier/effect/modifier_generic_feared";
import { modifier_generic_stunned } from "../../../modifier/effect/modifier_generic_stunned";
import { modifier_dummy } from "../../../modifier/modifier_dummy";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { unit_dummy } from "../../../units/common/unit_dummy";
import { modifier_kunkka_3_ebb, modifier_kunkka_3_talent, modifier_kunkka_3_tide } from "./ability3_kunkka_x_marks_the_spot";

/** dota原技能数据 */
export const Data_kunkka_ghostship = { "ID": "5035", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_DIRECTIONAL | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "2", "AbilitySound": "Ability.Ghostship", "AbilityDraftUltShardAbility": "kunkka_tidal_wave", "AbilityCastAnimation": "ACT_DOTA_CAST_GHOST_SHIP", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastRange": "1000", "AbilityCastPoint": "0.3", "AbilityCooldown": "80 70 60", "AbilityDamage": "400 500 600", "AbilityManaCost": "125 175 225", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "tooltip_delay": "3.1" }, "02": { "var_type": "FIELD_INTEGER", "ghostship_distance": "2000" }, "03": { "var_type": "FIELD_INTEGER", "ghostship_width": "425 425 425" }, "04": { "var_type": "FIELD_INTEGER", "movespeed_bonus": "12" }, "05": { "var_type": "FIELD_FLOAT", "buff_duration": "10" }, "06": { "var_type": "FIELD_FLOAT", "stun_duration": "1.4 1.4 1.4" }, "07": { "var_type": "FIELD_INTEGER", "ghostship_speed": "650" }, "08": { "var_type": "FIELD_FLOAT", "ghostship_absorb": "40" } } };

@registerAbility()
export class ability6_kunkka_ghostship extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "kunkka_ghostship";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_kunkka_ghostship = Data_kunkka_ghostship;
    Init() {
        this.SetDefaultSpecialValue("tooltip_delay", 3.1);
        this.SetDefaultSpecialValue("ghostship_distance", 2000);
        this.SetDefaultSpecialValue("stun_duration", 1);
        this.SetDefaultSpecialValue("damage", [1000, 2000, 3000, 4000, 5000, 6000]);
        this.SetDefaultSpecialValue("stun_radius", 425);
        this.SetDefaultSpecialValue("ghostship_speed", 750);
        this.SetDefaultSpecialValue("tide_fear_duration", 2);
        this.SetDefaultSpecialValue("ebb_damage_pct", [100, 200, 300, 400, 500, 600]);

    }


    vLastPosition: Vector;



    Ghostship(caster_position: Vector, target_position: Vector) {
        let caster = this.GetCasterPlus()
        let ghostship_distance = this.GetSpecialValueFor("ghostship_distance")
        let stun_radius = this.GetSpecialValueFor("stun_radius")
        let ghostship_speed = this.GetSpecialValueFor("ghostship_speed")
        let vDirection = (target_position - caster_position) as Vector
        vDirection.z = 0
        let vTargetPosition = target_position
        let vStartPosition = (vTargetPosition - vDirection.Normalized() * ghostship_distance) as Vector
        let particleID = ParticleManager.CreateParticleForTeam(ResHelper.GetParticleReplacement("particles/units/heroes/hero_kunkka/kunkka_ghostship_marker.vpcf", caster), ParticleAttachment_t.PATTACH_CUSTOMORIGIN, null, caster.GetTeamNumber())
        ParticleManager.SetParticleControl(particleID, 0, vTargetPosition)
        ParticleManager.SetParticleControl(particleID, 1, Vector(stun_radius, stun_radius, stun_radius))
        let hModifier = modifier_kunkka_6.findIn(caster)
        if (IsValid(hModifier)) {
            hModifier.AddParticle(particleID, false, false, -1, false, false)
        }
        let thinker = unit_dummy.CreateOne(vStartPosition, caster, false)
        modifier_dummy.apply(thinker, caster, this, null)
        EmitSoundOn(ResHelper.GetSoundReplacement("Ability.Ghostship", caster), thinker)

        let info = {
            Ability: this,
            Source: caster,
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_kunkka/kunkka_ghost_ship.vpcf", caster),
            vSpawnOrigin: vStartPosition,
            vVelocity: (vDirection.Normalized() * ghostship_speed) as Vector,
            fDistance: ghostship_distance,
            fStartRadius: stun_radius,
            fEndRadius: stun_radius,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            bProvidesVision: true,
            iVisionTeamNumber: caster.GetTeamNumber(),
            iVisionRadius: stun_radius,
            ExtraData: {
                thinker_index: thinker.entindex(),
                //  maker_particle_ent_id : hPtclThinker.entindex(),
                maker_particle_id: particleID,
            },
        }
        ProjectileManager.CreateLinearProjectile(info)

        EmitSoundOnLocationForAllies(caster_position, ResHelper.GetSoundReplacement("Ability.Ghostship.bell", caster), caster)
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let caster_position = caster.GetAbsOrigin()
        let target_position = this.GetCursorPosition()
        let stun_radius = this.GetSpecialValueFor("stun_radius")

        let tTargets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), target_position, stun_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_CLOSEST)
        for (let hUnit of (tTargets)) {

            modifier_kunkka_6_marks.apply(hUnit, caster, this, { duration: 2.6 })
        }
        EmitSoundOnLocationWithCaster(target_position, ResHelper.GetSoundReplacement("Ability.XMarksTheSpot.Target", caster), caster)

        this.Ghostship(caster_position, target_position)

        if (modifier_kunkka_3_talent.exist(caster)) {
            let hModifier = modifier_kunkka_3_talent.findIn(caster)
            let duration = caster.GetTalentValue("special_bonus_unique_kunkka_custom_8", "duration")
            if (hModifier.GetStackCount() == hModifier.max_charge) {
                let fInterval = hModifier.interval * caster.GetCooldownReduction()
                hModifier.SetDuration(fInterval, true)
                hModifier.StartIntervalThink(fInterval)
                hModifier.DecrementStackCount()
                let ability = ability6_kunkka_ghostship.findIn(caster)
                if (hModifier.GetAbilityPlus().GetToggleState() == true) {
                    modifier_kunkka_3_ebb.apply(caster, caster, ability, { duration: duration })
                } else {
                    modifier_kunkka_3_tide.apply(caster, caster, ability, { duration: duration })
                }
            }
        }

        if (caster.HasTalent("special_bonus_unique_kunkka_custom_6")) {
            let ghostship_interval = caster.GetTalentValue("special_bonus_unique_kunkka_custom_6", "ghostship_interval")
            let ghostship_num = caster.GetTalentValue("special_bonus_unique_kunkka_custom_6")
            let count = 1
            GTimerHelper.AddTimer(ghostship_interval, GHandler.create(this, () => {
                this.Ghostship(caster_position, target_position)
                count = count + 1
                if (count < ghostship_num) {
                    return ghostship_interval
                }
            }))
        }
        //  记录上一次释放的位置
        this.vLastPosition = target_position
    }
    OnProjectileThink_ExtraData(vLocation: Vector, ExtraData: any) {
        let thinker = EntIndexToHScript(ExtraData.thinker_index || -1)
        if (thinker) {
            thinker.SetAbsOrigin(vLocation)
        }
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus()

        if (hTarget != null) {
            let stun_duration = this.GetSpecialValueFor("stun_duration")
            let tide_fear_duration = this.GetSpecialValueFor("tide_fear_duration")
            let sTalentName = "special_bonus_unique_kunkka_custom_8"
            let damage = this.GetSpecialValueFor("damage") + hCaster.GetTalentValue(sTalentName)

            let damage_table = {
                ability: this,
                victim: hTarget,
                attacker: hCaster,
                damage: damage,
                damage_type: this.GetAbilityDamageType(),
            }
            BattleHelper.GoApplyDamage(damage_table)

            modifier_generic_stunned.apply(hTarget, hCaster, this, { duration: stun_duration * hTarget.GetStatusResistanceFactor(hCaster) })
            if (modifier_kunkka_3_tide.exist(hCaster)) {
                modifier_generic_feared.apply(hTarget, hCaster, this, { duration: (tide_fear_duration + stun_duration) * hTarget.GetStatusResistanceFactor(hCaster) })
            } else if (modifier_kunkka_3_ebb.exist(hCaster)) {
                damage_table.damage = hCaster.GetAverageTrueAttackDamage(hTarget)
                damage_table.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                BattleHelper.GoApplyDamage(damage_table)
            }

            return false
        }

        EmitSoundOnLocationWithCaster(vLocation, ResHelper.GetSoundReplacement("Ability.Ghostship.crash", hCaster), hCaster)

        if (ExtraData.maker_particle_id != null) {
            ParticleManager.DestroyParticle(ExtraData.maker_particle_id, false)
        }
        let thinker = EntIndexToHScript(ExtraData.thinker_index)
        if (thinker) {
            thinker.StopSound(ResHelper.GetSoundReplacement("Ability.Ghostship", hCaster))
            UTIL_Remove(thinker)
        }
        return true
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_kunkka_6"
    // }

    OnStolen(hSourceAbility: this) {
        this.vLastPosition = hSourceAbility.vLastPosition
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_kunkka_6 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus() as ability6_kunkka_ghostship
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

            let teamFilter = ability.GetAbilityTargetTeam()
            let typeFilter = ability.GetAbilityTargetType()
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()

            //  优先释放在上一次释放的位置
            let radius = ability.GetSpecialValueFor("stun_radius")
            if (ability.vLastPosition != null && caster.IsPositionInRange(ability.vLastPosition, range)) {
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), ability.vLastPosition, radius, null, teamFilter, typeFilter, flagFilter, order)

                //  施法命令
                if (targets.length > 0) {
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        Position: ability.vLastPosition,
                        AbilityIndex: ability.entindex(),
                    })
                }
            } else {
                //  优先攻击目标
                let target = caster.GetAttackTarget()
                if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
                if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                    target = null
                }

                //  搜索范围
                if (target == null) {
                    let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                    target = targets[0]
                }

                //  施法命令
                if (target != null) {
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        Position: target.GetAbsOrigin(),
                        AbilityIndex: ability.entindex(),
                    })
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_kunkka_6_marks extends BaseModifier_Plus {
    stun_radius: number;
    position: Vector;
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
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    GetTexture() {
        return "kunkka_x_marks_the_spot"
    }
    BeCreated(params: IModifierTable) {

        this.stun_radius = this.GetSpecialValueFor("stun_radius")
        let caster = this.GetCasterPlus()
        let target = this.GetParentPlus()
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            // this.Spawner_targetCornerName = target.Spawner_targetCornerName
            // this.Spawner_lastCornerName = target.Spawner_lastCornerName
            this.position = target.GetAbsOrigin()
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_kunkka/kunkka_spell_x_spot.vpcf",
                resNpc: caster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, target, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, target.GetAbsOrigin(), true)
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.stun_radius = this.GetSpecialValueFor("stun_radius")
    }
    BeDestroy() {

        if (IsServer()) {
            let target = this.GetParentPlus()
            FindClearSpaceForUnit(target, this.position, true)
            // target.Spawner_targetCornerName = this.Spawner_targetCornerName
            // target.Spawner_lastCornerName = this.Spawner_lastCornerName
            // Spawner.MoveOrder(target)

        }
    }
}

// 特效
@registerModifier()
export class modifier_kunkka_6_particle_marker extends modifier_particle_thinker {
    BeCreated(params: IModifierTable) {

        let stun_radius = this.GetSpecialValueFor("stun_radius")
        if (IsClient()) {
            let caster = this.GetCasterPlus()
            let vTargetPosition = this.GetParentPlus().GetAbsOrigin()
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_kunkka/kunkka_ghostship_marker.vpcf",
                resNpc: caster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(particleID, 0, vTargetPosition)
            ParticleManager.SetParticleControl(particleID, 1, Vector(stun_radius, stun_radius, stun_radius))
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
}
