import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { ability6_monkey_king_wukongs_command, modifier_monkey_king_6_scepter_active } from "./ability6_monkey_king_wukongs_command";

/** dota原技能数据 */
export const Data_monkey_king_tree_dance = { "ID": "5721", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_TREE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilitySound": "Hero_MonkeyKing.TreeJump.Cast", "FightRecapLevel": "1", "HasShardUpgrade": "1", "AbilityCastRange": "1000", "AbilityCastPoint": "0.3", "AbilityCooldown": "1.0", "AbilityManaCost": "0", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "unperched_stunned_duration": "4.0" }, "11": { "var_type": "FIELD_INTEGER", "top_level_height": "500" }, "12": { "var_type": "FIELD_INTEGER", "impact_damage_tooltip": "140 210 280 350", "LinkedSpecialBonus": "special_bonus_unique_monkey_king_3" }, "13": { "var_type": "FIELD_INTEGER", "impact_movement_slow_tooltip": "20 40 60 80" }, "01": { "var_type": "FIELD_INTEGER", "leap_speed": "700" }, "02": { "var_type": "FIELD_INTEGER", "spring_leap_speed": "1300" }, "03": { "var_type": "FIELD_INTEGER", "give_up_distance": "1850" }, "04": { "var_type": "FIELD_INTEGER", "ground_jump_distance": "900", "LinkedSpecialBonus": "special_bonus_unique_monkey_king_7" }, "05": { "var_type": "FIELD_INTEGER", "perched_jump_distance": "1000", "LinkedSpecialBonus": "special_bonus_unique_monkey_king_7" }, "06": { "var_type": "FIELD_FLOAT", "jump_damage_cooldown": "3.0" }, "07": { "var_type": "FIELD_FLOAT", "perched_day_vision": "800" }, "08": { "var_type": "FIELD_FLOAT", "perched_night_vision": "600" }, "09": { "var_type": "FIELD_FLOAT", "perched_spot_height": "192.0" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_monkey_king_tree_dance extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "monkey_king_tree_dance";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_monkey_king_tree_dance = Data_monkey_king_tree_dance;
    Init() {
        this.SetDefaultSpecialValue("channel_time", 3);
        this.SetDefaultSpecialValue("damage", [500, 1000, 1500, 2000, 2500, 3000]);
        this.SetDefaultSpecialValue("damage_percent", [1, 1.2, 1.4, 1.6, 1.8, 2, 2.2]);
        this.SetDefaultSpecialValue("slow_duration", 3);
        this.SetDefaultSpecialValue("slow_percent", 50);
        this.SetDefaultSpecialValue("damage_amplify_percent", 100);
        this.SetDefaultSpecialValue("reduce_channel_time", 1);
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("spring_leap_speed", 1300);
        this.SetDefaultSpecialValue("move_speed", 700);

    }

    Init_old() {
        this.SetDefaultSpecialValue("move_speed", 700);
        this.SetDefaultSpecialValue("channel_time", 3);
        this.SetDefaultSpecialValue("damage", [500, 1000, 1500, 2000, 2500, 3000]);
        this.SetDefaultSpecialValue("damage_percent", [100, 120, 140, 160, 180, 200, 220]);
        this.SetDefaultSpecialValue("slow_duration", 3);
        this.SetDefaultSpecialValue("slow_percent", 50);
        this.SetDefaultSpecialValue("damage_amplify_percent", 100);
        this.SetDefaultSpecialValue("reduce_channel_time", 1);
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("spring_leap_speed", 1300);

    }


    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let vPosition = this.GetCursorPosition()
        let vTargetPosition = (hCaster.GetAbsOrigin() + RandomVector(1) * RandomFloat(0, 100)) as Vector
        vTargetPosition = GetGroundPosition(vTargetPosition, hCaster)
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        let hSoldier = CreateUnitByName(hCaster.GetUnitName(), vTargetPosition, false, hHero, hHero, hCaster.GetTeamNumber())
        modifier_monkey_king_2_active.apply(hSoldier, hCaster, this, { hTarget_index: hTarget.GetEntityIndex() })
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_monkey_king_2"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_monkey_king_2 extends BaseModifier_Plus {
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
            if (target != null && target.GetClassname() == "dota_item_drop") {
                target = null
            }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
                let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
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
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_2_active extends BaseModifierMotionBoth_Plus {
    move_speed: number;
    spring_leap_speed: number;
    max_distance: number;
    channel_time: number;
    reduce_channel_time: number;
    hTarget: BaseNpc_Plus;
    vTargetPosition: Vector;
    particleID_self: ParticleID;
    vStartPosition: Vector;
    fTime: number;
    fDuration: number;
    vVelocity: Vector;
    vVerticalVelocity: Vector;
    gesture: any;
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
    GetScepterSoldierCount() {
        let hCaster = this.GetCasterPlus()
        let ActivehSoldierCount = 0
        if (GameFunc.IsValid(hCaster) && hCaster.HasScepter()) {
            let hAbility3 = ability6_monkey_king_wukongs_command.findIn(hCaster) as ability6_monkey_king_wukongs_command;
            if (GameFunc.IsValid(hAbility3) && hAbility3.GetLevel() >= 1) {
                if (hAbility3.tScepterSoldiers != null) {
                    for (let hSoldier of (hAbility3.tScepterSoldiers)) {
                        if (modifier_monkey_king_6_scepter_active.exist(hSoldier)) {
                            ActivehSoldierCount = ActivehSoldierCount + 1
                        }
                    }
                }
            }
        }
        return ActivehSoldierCount
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.move_speed = this.GetSpecialValueFor("move_speed")
        this.spring_leap_speed = this.GetSpecialValueFor("spring_leap_speed")
        this.max_distance = this.GetSpecialValueFor("max_distance")
        this.channel_time = this.GetSpecialValueFor("channel_time")
        this.reduce_channel_time = this.GetSpecialValueFor("reduce_channel_time")
        if (IsServer()) {
            this.channel_time = math.max(this.channel_time - this.GetScepterSoldierCount() * this.reduce_channel_time, 0)
            hParent.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_MK_SPRING_CAST, 1.6 / this.channel_time)
            this.StartIntervalThink(this.channel_time)
            this.hTarget = EntIndexToHScript(params.hTarget_index) as BaseNpc_Plus
            let vDirection = (this.hTarget.GetAbsOrigin() - hCaster.GetAbsOrigin()) as Vector
            vDirection.z = 0
            hParent.SetForwardVector(vDirection)
            this.vTargetPosition = GetGroundPosition((hParent.GetAbsOrigin() + vDirection.Normalized() * math.min(vDirection.Length2D(), this.max_distance) as Vector), hCaster)
            this.particleID_self = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_spring_channel.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(this.particleID_self, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            EmitSoundOn("Hero_MonkeyKing.Spring.Channel", hParent)
            this.vStartPosition = this.GetParentPlus().GetAbsOrigin()
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_monkey_king_fur_army.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: hParent
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            this.AddParticle(iParticleID, false, true, 10, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_jump_trail.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.RemoveVerticalMotionController(this)
            hParent.RemoveHorizontalMotionController(this)
            UTIL_Remove(hParent)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_fur_army_attack.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()

            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(this.hTarget)) {
                this.Destroy()
                return
            }
            hParent.EmitSound("Hero_MonkeyKing.TreeJump.Cast")
            ParticleManager.DestroyParticle(this.particleID_self, false)
            this.vTargetPosition = this.hTarget.GetAbsOrigin()
            let vDirection = (this.vTargetPosition - this.vStartPosition) as Vector
            vDirection.z = 0
            let fDistance = vDirection.Length2D()
            this.GetParentPlus().SetAbsOrigin(this.vStartPosition)
            if (this.ApplyHorizontalMotionController() && this.ApplyVerticalMotionController()) {
                this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_MK_SPRING_SOAR)
                this.fDuration = fDistance / this.spring_leap_speed
                this.vVelocity = (vDirection.Normalized() * this.spring_leap_speed) as Vector
                this.SetDuration(this.fDuration, true)
                this.fTime = 0
                this.vVerticalVelocity = (this.vTargetPosition - this.vStartPosition) as Vector
            } else {
                this.Destroy()
            }
            this.StartIntervalThink(-1)
        }
    }

    Effect() {
        let hCaster = this.GetParentPlus()

        let damage = this.GetSpecialValueFor("damage")
        let radius = this.GetSpecialValueFor("radius")
        let damage_percent = this.GetSpecialValueFor("damage_percent")
        let slow_duration = this.GetSpecialValueFor("slow_duration")
        let damage_amplify_percent = this.GetSpecialValueFor("damage_amplify_percent")
        let vPosition = hCaster.GetAbsOrigin()

        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_monkey_king/monkey_king_spring.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControl(iParticleID, 0, vPosition)
        ParticleManager.SetParticleControl(iParticleID, 1, Vector(radius, radius, radius))
        ParticleManager.SetParticleControl(iParticleID, 2, Vector(1, 0, 0))
        ParticleManager.SetParticleControl(iParticleID, 3, Vector(1, 0, 0))
        ParticleManager.ReleaseParticleIndex(iParticleID)

        hCaster.EmitSound("Hero_MonkeyKing.Spring.Impact")

        let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), vPosition, null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, 0, 1, false)
        for (let hTarget of (tTargets as BaseNpc_Plus[])) {
            let fDistance = ((hTarget.GetAbsOrigin() - vPosition) as Vector).Length2D()
            let fDamage = damage + (hCaster.GetAverageTrueAttackDamage(hCaster) * damage_percent)
            fDamage = fDamage + fDamage * (this.GetScepterSoldierCount() * damage_amplify_percent) * 0.01
            let tDamageTable = {
                ability: this.GetAbilityPlus(),
                victim: hTarget,
                attacker: hCaster,
                damage: fDamage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            }
            BattleHelper.GoApplyDamage(tDamageTable)
            modifier_monkey_king_2_slow.apply(hTarget, hCaster, this.GetAbilityPlus(), { duration: slow_duration * hTarget.GetStatusResistanceFactor(hCaster) })
        }
    }
    UpdateHorizontalMotion(hParent: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.fTime = this.fTime + dt
            let vPosition = (this.vStartPosition + this.vVelocity * this.fTime) as Vector
            hParent.SetAbsOrigin(vPosition)
            if (this.fTime >= this.fDuration - 0.26 && !this.gesture) {
                this.gesture = true
                hParent.RemoveGesture(GameActivity_t.ACT_DOTA_MK_SPRING_SOAR)
                hParent.StartGesture(GameActivity_t.ACT_DOTA_MK_SPRING_END)
            }
            if (this.fTime >= this.fDuration) {
                if (((hParent.GetAbsOrigin() - this.vTargetPosition) as Vector).Length2D() <= (this.vVelocity).Length2D() * dt) {
                    hParent.SetAbsOrigin(this.vTargetPosition)
                }
                this.Effect()
                this.Destroy()
            }
        }
    }
    OnHorizontalMotionInterrupted() {
        if (IsServer()) {
            this.Destroy()
        }
    }
    UpdateVerticalMotion(hParent: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let fStartHeight = 0
            let fTargetHeight = 0
            let fMaxHeight = fStartHeight + 192
            let x = (2 * fTargetHeight + 2 * fStartHeight - 4 * fMaxHeight) / (this.GetDuration() * this.GetDuration()) * (this.GetElapsedTime() * this.GetElapsedTime()) + (4 * fMaxHeight - fTargetHeight - 3 * fStartHeight) / this.GetDuration() * this.GetElapsedTime() + fStartHeight
            hParent.SetAbsOrigin(((this.vStartPosition + this.vVerticalVelocity * (this.fTime / this.fDuration)) + Vector(0, 0, x) as Vector))
        }
    }
    OnVerticalMotionInterrupted() {
        if (IsServer()) {
            this.Destroy()
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_SELECT]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO]: true,
            [modifierstate.MODIFIER_STATE_UNTARGETABLE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        return "fur_army_soldier"
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DISABLE_AUTOATTACK)
    Get_DisableAutoAttack() {
        return 1
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TEMPEST_DOUBLE)
    GetTempestDouble(params: ModifierTable) {
        return 1
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    Get_AttackSound() {
        return ""
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_monkey_king_2_slow extends BaseModifier_Plus {
    slow_percent: number;
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
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_monkey_king_spring_slow.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.GetParentPlus().GetAbsOrigin())
            this.AddParticle(iParticleID, false, true, 10, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_spring_slow.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.GetParentPlus().GetAbsOrigin())
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.slow_percent = this.GetSpecialValueFor("slow_percent")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: ModifierTable) {
        return -this.slow_percent
    }
}
