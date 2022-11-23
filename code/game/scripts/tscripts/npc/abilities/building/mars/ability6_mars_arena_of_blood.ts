import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_knockback } from "../../../modifier/modifier_knockback";
import { modifier_mars_1_hit_obstacle_stun, modifier_mars_1_move } from "./ability1_mars_spear";

/** dota原技能数据 */
export const Data_mars_arena_of_blood = { "ID": "6598", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilitySound": "Hero_Mars.ArenaOfBlood.Start", "AbilityCastRange": "400", "AbilityCastPoint": "0.2", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1", "AbilityCooldown": "90 75 60", "AbilityManaCost": "150 175 200", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "warrior_fade_min_dist": "350.0" }, "11": { "var_type": "FIELD_FLOAT", "warrior_fade_max_dist": "450.0" }, "01": { "var_type": "FIELD_FLOAT", "duration": "5 6 7" }, "02": { "var_type": "FIELD_INTEGER", "radius": "550" }, "03": { "var_type": "FIELD_INTEGER", "width": "100" }, "04": { "var_type": "FIELD_INTEGER", "spear_damage": "100 160 220" }, "05": { "var_type": "FIELD_FLOAT", "formation_time": "0.3" }, "06": { "var_type": "FIELD_INTEGER", "spear_distance_from_wall": "160" }, "07": { "var_type": "FIELD_FLOAT", "spear_attack_interval": "1.0" }, "08": { "var_type": "FIELD_INTEGER", "warrior_count": "14" }, "09": { "var_type": "FIELD_FLOAT", "first_warrior_angle": "0.0" } } };

@registerAbility()
export class ability6_mars_arena_of_blood extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "mars_arena_of_blood";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_mars_arena_of_blood = Data_mars_arena_of_blood;
    Init() {
        this.SetDefaultSpecialValue("spear_distance_from_wall", 160);
        this.SetDefaultSpecialValue("spear_attack_interval", 1);
        this.SetDefaultSpecialValue("shard_attack_interval", 0.5);
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("duration", [5, 5.5, 6, 6.5, 7, 8]);
        this.SetDefaultSpecialValue("formation_time", 0.3);
        this.SetDefaultSpecialValue("attack_damage_percent", [200, 250, 300, 350, 400, 450]);
        this.SetDefaultSpecialValue("knockback_duration", 0.3);
        this.SetDefaultSpecialValue("knockback_distance", 200);
        this.SetDefaultSpecialValue("warrior_fade_min_dist", 350);
        this.SetDefaultSpecialValue("warrior_fade_max_dist", 450);
        this.SetDefaultSpecialValue("width", 100);

    }

    vLastPosition: Vector;

    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_mars_custom_2"
        return super.GetCooldown(iLevel) + hCaster.GetTalentValue(sTalentName)
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        modifier_mars_6_thinker.applyThinker(vPosition, hCaster, this, null, hCaster.GetTeamNumber(), false)
        //  记录上一次释放的位置
        this.vLastPosition = vPosition
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_mars_6"
    // }

}
// // // // // // // // // // // // // // // // // // // -Modifiers// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_mars_6 extends BaseModifier_Plus {
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
        if (IsServer()) {
            let ability = this.GetAbilityPlus() as ability6_mars_arena_of_blood
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
            let radius = ability.GetAOERadius()
            //  优先释放在上一次释放的位置
            if (ability.vLastPosition != null && hCaster.IsPositionInRange(ability.vLastPosition, range)) {
                let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), ability.vLastPosition, radius, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)

                //  施法命令
                if (targets.length > 0) {
                    ExecuteOrderFromTable({
                        UnitIndex: hCaster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        Position: ability.vLastPosition,
                        AbilityIndex: ability.entindex(),
                    })
                }
            } else {
                let position = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), radius, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)

                //  施法命令
                if (position && position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
                    ExecuteOrderFromTable(
                        {
                            UnitIndex: hCaster.entindex(),
                            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                            AbilityIndex: ability.entindex(),
                            Position: position
                        }
                    )
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mars_6_thinker extends BaseModifier_Plus {
    delay: number;
    duration: number;
    radius: number;
    phase_delay: any;
    phase_duration: boolean;
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
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.delay = this.GetSpecialValueFor("formation_time")
        this.duration = this.GetSpecialValueFor("duration")
        this.radius = this.GetSpecialValueFor("radius")
        if (IsServer()) {
            this.phase_delay = true
            this.StartIntervalThink(this.delay)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_mars/mars_arena_of_blood.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius + 50, 0, 0))
            ParticleManager.SetParticleControl(iParticleID, 2, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 3, hParent.GetAbsOrigin())
            this.AddParticle(iParticleID, false, false, -1, false, false)
            EmitSoundOn(ResHelper.GetSoundReplacement("Hero_Mars.ArenaOfBlood.Start", hCaster), hParent)

        }
    }
    OnRemoved() {
        if (IsServer()) {
            EmitSoundOn("Hero_Mars.ArenaOfBlood.End", this.GetParentPlus())
            StopSoundOn("Hero_Mars.ArenaOfBlood", this.GetParentPlus())
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (this.phase_delay) {
                this.phase_delay = false
                modifier_mars_6_wall_aura.apply(hParent, hCaster, hAbility, {})
                modifier_mars_6_spear_aura.apply(hParent, hCaster, hAbility, {})
                this.SummonBlockers()
                EmitSoundOn("Hero_Mars.ArenaOfBlood", hParent)
                this.StartIntervalThink(this.duration)
                this.phase_duration = true
                return
            }
            if (this.phase_duration) {
                this.Destroy()
                return
            }
        }
    }
    SummonBlockers() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let origin = hParent.GetAbsOrigin()
        if (!GameFunc.IsValid(hCaster)) {
            this.Destroy()
            return
        }
        let angle = 0
        let vector = (origin + Vector(this.radius, 0, 0)) as Vector
        let zero = Vector(0, 0, 0)
        let one = Vector(1, 0, 0)
        let count = 28
        let angle_diff = 360 / count
        for (let i = 0; i <= count - 1; i++) {
            let location = RotatePosition(origin, QAngle(0, angle_diff * i, 0), vector)
            let facing = RotatePosition(zero, QAngle(0, 200 + angle_diff * i, 0), one)
            let callback = (unit: CDOTA_BaseNPC) => {
                unit.SetForwardVector(facing)
                unit.SetNeverMoveToClearSpace(true)
                modifier_mars_6_blocker.apply(unit, hCaster, hAbility, { duration: this.duration, model: i % 2 == 0 })
            }
            // CreateUnitByNameAsync("npc_dota_mars_3_soldier", location, false, hCaster, null, hCaster.GetTeamNumber(), callback)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mars_6_blocker extends BaseModifier_Plus {
    fade_min: number;
    fade_max: number;
    fade_range: number;
    origin: Vector;
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
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (params.model == 1) {
                this.fade_min = this.GetSpecialValueFor("warrior_fade_min_dist")
                this.fade_max = this.GetSpecialValueFor("warrior_fade_max_dist")
                this.fade_range = this.fade_max - this.fade_min
                this.origin = hParent.GetAbsOrigin()
                hParent.SetOriginalModel("models/heroes/mars/mars_soldier.vmdl")
                hParent.SetRenderAlpha(0)
                // hParent.model = 1
                this.StartIntervalThink(0)
            }
        }
    }

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().ForceKill(false)
        }
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
                return
            }
            let alpha = 0
            let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), null, this.fade_max, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            if (tTarget.length > 0) {
                let hTarget = tTarget[0]
                let range = math.max(hParent.GetRangeToUnit(hTarget), this.fade_min)
                range = math.min(range, this.fade_max) - this.fade_min
                alpha = this.Interpolate(range / this.fade_range, 255, 0)
                if (alpha >= 255) {
                    if (!modifier_mars_1_move.exist(hTarget) && modifier_mars_6_spear_aura.exist(hTarget)) {
                        hTarget.InterruptMotionControllers(true)
                    }
                }
            }
            hParent.SetRenderAlpha(alpha)
        }
    }
    Interpolate(value: number, min: number, max: number) {
        return value * (max - min) + min
    }
    CheckState() {
        let state = {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_SELECT]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_UNTARGETABLE]: true,
        }
        return state
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mars_6_wall_aura extends BaseModifier_Plus {
    radius: number;
    width: number;
    twice_width: number;
    aura_radius: number;
    owner: boolean;
    aura_origin: Vector;
    MAX_SPEED: number;
    MIN_SPEED: number;
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
    IsAura() {
        return this.owner
    }
    GetAura() {
        return "modifier_mars_6_wall_aura"
    }
    GetAuraRadius() {
        return this.aura_radius
    }
    GetAuraDuration() {
        return 0.3
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return 0
    }
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.radius = this.GetSpecialValueFor("radius")
            this.width = this.GetSpecialValueFor("width")
            this.twice_width = this.width * 2
            this.aura_radius = this.radius + this.twice_width
            this.MAX_SPEED = 550
            this.MIN_SPEED = 1
            this.owner = params.isProvidedByAura != 1
            if (!this.owner) {
                this.aura_origin = Vector(params.aura_origin_x, params.aura_origin_y, 0)
            } else {
                this.aura_origin = hParent.GetAbsOrigin()
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_LIMIT)
    GetMoveSpeed_Limit() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            if (this.owner) { return 0 }
            let parent_vector = (hParent.GetAbsOrigin() - this.aura_origin) as Vector
            let parent_direction = parent_vector.Normalized()
            let actual_distance = parent_vector.Length2D()
            let wall_distance = actual_distance - this.radius
            let isInside = (wall_distance) < 0
            wall_distance = math.min(math.abs(wall_distance), this.twice_width)
            wall_distance = math.max(wall_distance, this.width) - this.width
            let parent_angle = 0
            if (isInside) {
                parent_angle = VectorToAngles(parent_direction).y
            } else {
                parent_angle = VectorToAngles((-parent_direction) as Vector).y
            }
            let unit_angle = hParent.GetAnglesAsVector().y
            let wall_angle = math.abs(AngleDiff(parent_angle, unit_angle))

            let limit = 0
            if (wall_angle > 90) {
                limit = 0
            } else {
                limit = this.Interpolate(wall_distance / this.width, this.MIN_SPEED, this.MAX_SPEED)
            }
            return limit
        }
    }
    Interpolate(value: number, min: number, max: number) {
        return value * (max - min) + min
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mars_6_spear_aura extends BaseModifier_Plus {
    duration: any;
    radius: any;
    width: number;
    shard_attack_interval: number;
    knockback_duration: number;
    knockback_distance: number;
    spear_radius: number;
    owner: boolean;
    aura_origin: Vector;
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
    IsAura() {
        return this.owner
    }
    GetAura() {
        return "modifier_mars_6_spear_aura"
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAuraDuration() {
        return this.duration
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return 0
    }
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    GetAuraEntityReject(unit: BaseNpc_Plus) {
        if (!IsServer()) { return }
        if (unit.FindModifierByNameAndCaster("modifier_mars_6_spear_aura", this.GetCasterPlus())) {
            return true
        }
        let distance = ((unit.GetAbsOrigin() - this.aura_origin) as Vector).Length2D()
        if ((distance - this.spear_radius) < 0 || !unit.IsPositionInRange(this.aura_origin, this.radius)) {
            this.GetParentPlus().InterruptMotionControllers(true)
            return true
        }
        return false
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hCaster)) {
            this.Destroy()
            return
        }
        this.radius = this.GetSpecialValueFor("radius")
        this.width = this.GetSpecialValueFor("spear_distance_from_wall")
        this.duration = this.GetSpecialValueFor("spear_attack_interval") + hCaster.GetTalentValue("special_bonus_unique_mars_custom_7")
        this.shard_attack_interval = this.GetSpecialValueFor("shard_attack_interval")
        if (hCaster.HasShard()) {
            this.duration = this.duration - this.shard_attack_interval
        }
        this.knockback_duration = this.GetSpecialValueFor("knockback_duration")
        this.knockback_distance = this.GetSpecialValueFor("knockback_distance")
        this.spear_radius = this.radius - this.width
        if (IsServer()) {
            this.owner = params.isProvidedByAura != 1
            this.aura_origin = hParent.GetAbsOrigin()
            if (!this.owner) {
                this.aura_origin = Vector(params.aura_origin_x, params.aura_origin_y, 0)
                let direction = ((this.aura_origin - hParent.GetAbsOrigin()) as Vector).Normalized()
                direction.z = 0
                let arena_walls = Entities.FindAllByClassnameWithin("npc_dota_phantomassassin_gravestone", hParent.GetAbsOrigin(), 160)
                // for (let arena_wall of (arena_walls as BaseNpc_Plus[])) {
                //     if ( modifier_mars_6_blocker.exist( arena_wall ) && arena_wall.model) {
                //         arena_wall.FadeGesture(GameActivity_t.ACT_DOTA_ATTACK)
                //         arena_wall.StartGesture(GameActivity_t.ACT_DOTA_ATTACK)
                //         break
                //     }
                // }
                //  Create Particle
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_mars/mars_arena_of_blood_spear.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                    owner: hParent
                });

                ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
                ParticleManager.SetParticleControlForward(iParticleID, 0, direction)
                ParticleManager.ReleaseParticleIndex(iParticleID)
                //  Create Sound
                EmitSoundOnLocationWithCaster(hParent.GetAbsOrigin(), "Hero_Mars.Phalanx.Attack", this.GetCasterPlus())
                EmitSoundOn("Hero_Mars.Phalanx.Target", hParent)
                if (GameFunc.IsValid(arena_walls[0])) {
                    let vCenter = arena_walls[0].GetAbsOrigin()
                    let modifierKnockback = {
                        center_x: vCenter.x,
                        center_y: vCenter.y,
                        center_z: vCenter.z,
                        should_stun: false,
                        duration: this.knockback_duration,
                        knockback_duration: this.knockback_duration,
                        knockback_distance: this.knockback_distance,
                        knockback_height: 30
                    }
                    modifier_mars_6_buff.apply(hCaster, hCaster, hAbility, {})
                    let iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS
                    if (hCaster.HasScepter()) {
                        iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN
                    }
                    BattleHelper.Attack(hCaster, hParent, iAttackState)
                    modifier_mars_6_buff.remove(hCaster);
                    if (!modifier_mars_1_move.exist(hParent) && !modifier_mars_1_hit_obstacle_stun.exist(hParent)) {
                        modifier_knockback.apply(hParent, hCaster, hAbility, modifierKnockback)
                    }
                }
            }
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        this.radius = this.GetSpecialValueFor("radius")
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mars_6_buff extends BaseModifier_Plus {
    attack_damage_percent: number;
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
    Init(params: ModifierTable) {
        this.attack_damage_percent = this.GetSpecialValueFor('attack_damage_percent')
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage() {
        return this.attack_damage_percent
    }
}
