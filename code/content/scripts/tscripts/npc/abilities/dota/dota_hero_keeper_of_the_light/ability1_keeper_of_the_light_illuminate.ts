import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_night_stalker_6_night } from "../dota_hero_night_stalker/ability6_night_stalker_darkness";
import { ability6_keeper_of_the_light_spirit_form } from "./ability6_keeper_of_the_light_spirit_form";

/** dota原技能数据 */
export const Data_keeper_of_the_light_illuminate = { "ID": "5471", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_CHANNELLED", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_KeeperOfTheLight.Illuminate.Discharge", "AbilityDraftPreAbility": "keeper_of_the_light_spirit_form_illuminate", "AbilityCastRange": "1800", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "11", "AbilityChannelTime": "2 2.7 3.4 4.1", "AbilityManaCost": "100 125 150 175", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "channel_vision_duration": "10.34" }, "11": { "var_type": "FIELD_INTEGER", "channel_vision_step": "150" }, "01": { "var_type": "FIELD_INTEGER", "total_damage": "225 325 425 525", "LinkedSpecialBonus": "special_bonus_unique_keeper_of_the_light" }, "02": { "var_type": "FIELD_FLOAT", "max_channel_time": "2 2.7 3.4 4.1" }, "03": { "var_type": "FIELD_INTEGER", "radius": "375" }, "04": { "var_type": "FIELD_INTEGER", "range": "1550" }, "05": { "var_type": "FIELD_FLOAT", "speed": "1050.0" }, "06": { "var_type": "FIELD_INTEGER", "vision_radius": "800 800 800 800" }, "07": { "var_type": "FIELD_FLOAT", "vision_duration": "3.34 3.34 3.34 3.34" }, "08": { "var_type": "FIELD_INTEGER", "channel_vision_radius": "375" }, "09": { "var_type": "FIELD_FLOAT", "channel_vision_interval": "0.5" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_keeper_of_the_light_illuminate extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "keeper_of_the_light_illuminate";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_keeper_of_the_light_illuminate = Data_keeper_of_the_light_illuminate;
    Init() {
        this.SetDefaultSpecialValue("kill_stack_hero", 5);
        this.SetDefaultSpecialValue("min_stack", 4);
        this.SetDefaultSpecialValue("shard_count", 3);
        this.SetDefaultSpecialValue("base_damage", [400, 800, 1600, 2400, 3600, 6000]);
        this.SetDefaultSpecialValue("damage_per_second", [100, 300, 600, 1000, 1500, 2000]);
        this.SetDefaultSpecialValue("max_channel_time", 15);
        this.SetDefaultSpecialValue("radius", 375);
        this.SetDefaultSpecialValue("range", 1550);
        this.SetDefaultSpecialValue("speed", 1050);
        this.SetDefaultSpecialValue("max_stack", [4, 5, 6, 7, 8, 8]);
        this.SetDefaultSpecialValue("day_time_pct", 2);
        this.SetDefaultSpecialValue("kill_stack_creep", 80);

    }


    vLastPosition: Vector;


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vStartPosition = hCaster.GetAbsOrigin()
        let vPosition = this.GetCursorPosition()
        let vDirection = ((vPosition - vStartPosition) as Vector).Normalized()
        let max_channel_time = this.GetSpecialValueFor("max_channel_time")
        let shard_count = this.GetSpecialValueFor("shard_count")

        let fHullRadius = hCaster.GetHullRadius()
        let fDistance = 64 + fHullRadius
        let fDistance_X = (RandomInt(0, 1) == 0) && fDistance || (0 - fDistance)
        let fDistance_Y = (RandomInt(0, 1) == 0) && fDistance || (0 - fDistance)
        let vLocation = (hCaster.GetAbsOrigin() + Vector(fDistance_X, fDistance_Y, 0)) as Vector
        let hThinker = CreateUnitByName(hCaster.GetUnitName(), vLocation, false, hCaster, hCaster, hCaster.GetTeamNumber())
        let abilitycount = hThinker.GetAbilityCount()
        for (let i = abilitycount - 1; i >= 0; i--) {
            let hAbility = hThinker.GetAbilityByIndex(i)
            if (GFuncEntity.IsValid(hAbility)) {
                hThinker.RemoveAbilityByHandle(hAbility)
            }
        }
        hThinker.SetForwardVector(hCaster.GetForwardVector())
        hThinker.EmitSound(ResHelper.GetSoundReplacement("Hero_KeeperOfTheLight.Illuminate.Charge", hCaster))
        let hModifier = modifier_keeper_of_the_light_1_thinker.apply(hThinker, hCaster, this, { duration: max_channel_time, vPosition: vPosition, vDirection: vDirection })
        let hAbility = ability6_keeper_of_the_light_spirit_form.findIn(hCaster)
        if (GFuncEntity.IsValid(hAbility)) {
            // hAbility.SaveModifier(hModifier)
        }
        //  记录上一次释放的位置
        this.vLastPosition = vPosition
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (GFuncEntity.IsValid(hTarget) && hTarget.IsAlive()) {
            let hCaster = this.GetCasterPlus()
            let base_damage = this.GetSpecialValueFor("base_damage")
            let extra_intellect_pct = this.GetCasterPlus().HasTalent("special_bonus_unique_keeper_of_the_light_custom_8") && this.GetCasterPlus().GetTalentValue("special_bonus_unique_keeper_of_the_light_custom_8") || 0
            let damage_per_second = this.GetSpecialValueFor("damage_per_second")
            let fDamage = damage_per_second + base_damage
            let tDamageTable = {
                ability: this,
                victim: hTarget,
                attacker: hCaster,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType(),
            }
            BattleHelper.GoApplyDamage(tDamageTable)

        }
        if (ExtraData.iParticleID) {
            ParticleManager.DestroyParticle(ExtraData.iParticleID, false)
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_keeper_of_the_light_1"
    // }

    OnStolen(hSourceAbility: this) {
        this.vLastPosition = hSourceAbility.vLastPosition
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_keeper_of_the_light_1 extends BaseModifier_Plus {
    kill_stack_creep: number;
    kill_stack_hero: number;
    flTime: number;
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
    BeCreated(params: IModifierTable) {

        this.kill_stack_creep = this.GetSpecialValueFor("kill_stack_creep")
        this.kill_stack_hero = this.GetSpecialValueFor("kill_stack_hero")
        if (IsServer()) {
            this.flTime = 0
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus() as ability1_keeper_of_the_light_illuminate
            if (!GFuncEntity.IsValid(ability)) {
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
            let radius = ability.GetSpecialValueFor("radius")
            if (ability.vLastPosition != null && caster.IsPositionInRange(ability.vLastPosition, range)) {
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), ability.vLastPosition, radius, null, teamFilter, typeFilter, flagFilter, order)
                //  施法命令
                if (targets.length > 0) {
                    ExecuteOrderFromTable(
                        {
                            UnitIndex: caster.entindex(),
                            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                            Position: ability.vLastPosition,
                            AbilityIndex: ability.entindex()
                        }
                    )
                }
            } else {
                //  优先攻击目标
                let target = caster.GetAttackTarget()
                if (target != null && target.GetClassname() == "dota_item_drop") {
                    target = null
                }
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
                    ExecuteOrderFromTable(
                        {
                            UnitIndex: caster.entindex(),
                            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                            Position: target.GetAbsOrigin(),
                            AbilityIndex: ability.entindex()
                        }
                    )
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    death(params: IModifierTable) {
        let hAttacker = params.attacker
        if (!GFuncEntity.IsValid(hAttacker)) {
            return
        }
        if (hAttacker.GetTeamNumber() == params.unit.GetTeamNumber()) {
            return
        }
        if (hAttacker != null && hAttacker.GetUnitLabel() != "builder") {
            hAttacker = hAttacker.GetSource()
            // if (hAttacker != null && hAttacker == this.GetParentPlus() && !hAttacker.IsIllusion() && !hAttacker.PassivesDisabled() && !Spawner.IsEndless()) {
            //     let iCount = this.kill_stack_creep
            //     if (params.unit.IsConsideredHero()) {
            //         iCount = iCount * this.kill_stack_hero
            //     }
            //     this.SetStackCount(this.GetStackCount() + iCount)
            // }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_keeper_of_the_light_1_thinker extends BaseModifier_Plus {
    bFirst: any;
    radius: number;
    range: number;
    speed: number;
    min_stack: number;
    max_stack: number;
    day_time_pct: number;
    shard_count: number;
    left_launch_count: number;
    vPosition: any;
    vDirection: Vector;
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
    DestroyOnExpire() {
        return false
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.radius = this.GetSpecialValueFor("radius")
        this.range = this.GetSpecialValueFor("range")
        this.speed = this.GetSpecialValueFor("speed")
        this.min_stack = this.GetSpecialValueFor("min_stack")
        let extra_max_stack = this.GetCasterPlus().GetTalentValue("special_bonus_unique_keeper_of_the_light_custom_3")
        this.max_stack = this.GetSpecialValueFor("max_stack") + extra_max_stack
        this.day_time_pct = this.GetSpecialValueFor("day_time_pct")
        this.shard_count = this.GetSpecialValueFor("shard_count")
        if (IsServer()) {
            this.left_launch_count = hCaster.HasShard() && this.shard_count || 1
            this.vPosition = GFuncVector.StringToVector(params.vPosition)
            this.vDirection = GFuncVector.StringToVector(params.vDirection)
            this.bFirst = true
            this.GetParentPlus().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CAST_ABILITY_7, 5 / this.GetDuration())
            this.StartIntervalThink(0)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_illuminate_position.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.vPosition + Vector(0, 0, hParent.GetAbsOrigin().z + 64))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_illuminate_charge.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hParent.GetAbsOrigin(), false)
            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_keeper_spirit_form.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }
    OnRemoved() {
        if (IsServer()) {
            if (GFuncEntity.IsValid(this.GetCasterPlus())) {
                // let hAbility  = keeper_of_the_light_3.findIn(  this.GetCasterPlus() )
                // if (GFuncEntity.IsValid(hAbility) && hAbility.RemoveModifier != null) {
                //     hAbility.RemoveModifier(this)
                // }
            }
            UTIL_Remove(this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            if (!GFuncEntity.IsValid(this.GetCasterPlus())) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }
            if (this.left_launch_count > 0) {
                let hCaster = this.GetCasterPlus()
                let hParent = this.GetParentPlus()
                let hAbility = this.GetAbilityPlus()
                // let bDayTime = (Environment.IsBloodmoon() || (Environment.IsDaytime() && !modifier_night_stalker_3_night.exist(hCaster)))
                let day_time_pct = /**bDayTime &&*/ this.day_time_pct || 1
                let stack = math.min(math.floor(this.GetElapsedTime() * day_time_pct), this.max_stack)
                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), this.vPosition, 300, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
                if ((tTargets.length > 0 || this.GetRemainingTime() <= 0) && stack >= this.min_stack) {
                    this.left_launch_count = this.left_launch_count - 1
                    this.EndChannel()
                    this.StartIntervalThink(0.3)
                }
            } else {
                this.StartIntervalThink(-1)
                this.Destroy()
            }
        }
    }
    EndChannel() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (this.bFirst) {
                this.bFirst = false
                let day_time_pct = (/**(Environment.IsDaytime() &&)*/ !modifier_night_stalker_6_night.exist(hCaster) && this.day_time_pct || 1)
                this.SetStackCount(math.min(math.floor(this.GetElapsedTime() * day_time_pct), this.max_stack))
                this.vDirection.z = 0

                hParent.StopSound(ResHelper.GetSoundReplacement("Hero_KeeperOfTheLight.Illuminate.Charge", hCaster))
                hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_KeeperOfTheLight.Illuminate.Discharge", hCaster))
                hParent.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1_END)
            }

            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_illuminate.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControlForward(iParticleID, 0, this.vDirection)
            ParticleManager.SetParticleControl(iParticleID, 1, (this.vDirection * this.speed) as Vector)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(this.radius, 0, 0))
            ParticleManager.SetParticleControl(iParticleID, 3, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControlForward(iParticleID, 3, this.vDirection)
            ParticleManager.SetParticleFoWProperties(iParticleID, 3, -1, this.radius)
            ParticleManager.SetParticleControl(iParticleID, 8, Vector(this.GetStackCount(), 0, 0))
            ParticleManager.SetParticleControl(iParticleID, 10, Vector(this.GetStackCount(), 0, 0))

            let tInfo = {
                Source: hCaster,
                Ability: hAbility,
                vSpawnOrigin: hParent.GetAbsOrigin(),
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP,
                fDistance: this.range,
                fStartRadius: this.radius,
                fEndRadius: this.radius,
                vVelocity: (this.vDirection * this.speed) as Vector,
                ExtraData: {
                    second: this.GetStackCount(),
                    iParticleID: iParticleID,
                }
            }
            ProjectileManager.CreateLinearProjectile(tInfo)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_SELECT]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_keeper_of_the_light_1_particle_mark extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hCaster = this.GetParentPlus()
            let hParent = this.GetCasterPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_illuminate_position.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}
