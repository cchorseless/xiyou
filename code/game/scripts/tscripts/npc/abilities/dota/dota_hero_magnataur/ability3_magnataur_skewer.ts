import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_magnataur_skewer = { "ID": "5520", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Magnataur.Skewer.Cast", "HasScepterUpgrade": "0", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "22 20 18 16", "AbilityManaCost": "80 80 80 80", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "skewer_manacost": "40", "RequiresScepter": "1" }, "01": { "var_type": "FIELD_INTEGER", "skewer_speed": "900" }, "02": { "var_type": "FIELD_INTEGER", "range": "900 1000 1100 1200", "LinkedSpecialBonus": "special_bonus_unique_magnus_3" }, "03": { "var_type": "FIELD_INTEGER", "slow_pct": "10 20 30 40" }, "04": { "var_type": "FIELD_INTEGER", "skewer_radius": "145" }, "05": { "var_type": "FIELD_FLOAT", "slow_duration": "3.25" }, "06": { "var_type": "FIELD_INTEGER", "skewer_damage": "70 150 230 310" }, "07": { "var_type": "FIELD_INTEGER", "tree_radius": "200" }, "08": { "var_type": "FIELD_INTEGER", "tool_attack_slow": "10 20 30 40" }, "09": { "var_type": "FIELD_FLOAT", "skewer_cooldown": "6", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_magnataur_skewer extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "magnataur_skewer";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_magnataur_skewer = Data_magnataur_skewer;
    Init() {
        this.SetDefaultSpecialValue("skewer_speed", 950);
        this.SetDefaultSpecialValue("range", 800);
        this.SetDefaultSpecialValue("skewer_radius", 135);
        this.SetDefaultSpecialValue("skewer_damage_distance", 100);
        this.SetDefaultSpecialValue("skewer_damage", [300, 600, 900, 1200, 1500, 2000]);
        this.SetDefaultSpecialValue("skewer_damage_per_str", 0);
        this.SetDefaultSpecialValue("scepter_reduce_cooldown", 5);

    }


    GetCooldown(iLevel: number) {
        let fCooldown = super.GetCooldown(iLevel)
        if (this.GetCasterPlus().HasScepter()) {
            fCooldown = fCooldown - this.GetSpecialValueFor("scepter_reduce_cooldown")
        }
        return fCooldown
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCastPoint()
        let skewer_speed = this.GetSpecialValueFor("skewer_speed")
        let range = this.GetSpecialValueFor("range")
        let skewer_radius = this.GetSpecialValueFor("skewer_radius")
        let vDirection = vPosition - hCaster.GetAbsOrigin() as Vector

        // let sLastCornerName = hTarget.Spawner_lastCornerName
        // let sNextCornerName = hTarget.Spawner_targetCornerName
        // let hLastCorner = Entities.FindByName(null, sLastCornerName)
        // let hNextCorner = Entities.FindByName(null, sNextCornerName)
        // if (hLastCorner && hNextCorner) {
        //     vDirection = (hLastCorner.GetAbsOrigin() - hNextCorner.GetAbsOrigin()) as Vector
        //     vDirection.z = 0
        //     if (vDirection.x == 0) {
        //         vPosition.x = hLastCorner.GetAbsOrigin().x
        //     } else if (vDirection.y == 0) {
        //         vPosition.y = hLastCorner.GetAbsOrigin().y
        //     }
        //     vDirection = vDirection.Normalized()

        //     range = math.min(range, ((vPosition - hLastCorner.GetAbsOrigin()) as Vector).Length2D())
        // } else {
        //     this.EndCooldown()
        //     this.RefundManaCost()
        //     return
        // }
        let vStartPosition = (vPosition - vDirection * skewer_radius) as Vector
        let hThinker = CreateUnitByName(hCaster.GetUnitName(), vStartPosition, false, hCaster, hCaster, hCaster.GetTeamNumber())
        for (let i = hThinker.GetAbilityCount() - 1; i >= 0; i--) {
            let hAbility = hThinker.GetAbilityByIndex(i)
            if (GameFunc.IsValid(hAbility)) {
                hThinker.RemoveAbilityByHandle(hAbility)
            }
        }
        hThinker.SetForwardVector(vDirection)
        hThinker.StartGesture(GameActivity_t.ACT_DOTA_MAGNUS_SKEWER_START)
        hThinker.EmitSound(ResHelper.GetSoundReplacement("Hero_Magnataur.Skewer.Cast", hCaster))
        modifier_magnataur_3_thinker.apply(hThinker, hCaster, this, null)
        modifier_magnataur_3_dummy.apply(hThinker, hCaster, this, { duration: 10 })
        let vTargetPosition = (vStartPosition + vDirection * range) as Vector
        let tInfo = {
            Ability: this,
            Source: hCaster,
            vSpawnOrigin: vStartPosition,
            vVelocity: (vDirection * skewer_speed) as Vector,
            fDistance: range,
            fStartRadius: skewer_radius,
            fEndRadius: skewer_radius,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            fExpireTime: GameRules.GetGameTime() + 10.0,
            ExtraData: {
                thinker_ent_index: hThinker.entindex(),
                target_position_x: vTargetPosition.x,
                target_position_y: vTargetPosition.y,
                target_position_z: vTargetPosition.z,
            }
        }
        ProjectileManager.CreateLinearProjectile(tInfo)
    }
    OnProjectileHit_ExtraData(hTarget: BaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hTarget)) {
            if (ExtraData.target_position_x != null && ExtraData.target_position_y != null && ExtraData.target_position_z != null) {
                let skewer_speed = this.GetSpecialValueFor("skewer_speed")
                let skewer_radius = this.GetSpecialValueFor("skewer_radius")
                let vTargetPosition = Vector(ExtraData.target_position_x, ExtraData.target_position_y, ExtraData.target_position_z)
                let vDirection = (vTargetPosition - vLocation) as Vector
                vDirection.z = 0
                modifier_magnataur_3_move.apply(hTarget, hCaster, this, {
                    duration: vDirection.Length2D() / skewer_speed,
                    start_position: vLocation + vDirection.Normalized() * skewer_radius,
                    target_position: vTargetPosition + vDirection.Normalized() * skewer_radius
                })
            }

            return false
        }

        EmitSoundOnLocationWithCaster(vLocation, ResHelper.GetSoundReplacement("Hero_Magnataur.Skewer.Target", hCaster), hCaster)

        let hThinker = EntIndexToHScript(ExtraData.thinker_ent_index || -1) as BaseNpc_Plus
        if (GameFunc.IsValid(hThinker)) {
            hThinker.StartGesture(GameActivity_t.ACT_DOTA_MAGNUS_SKEWER_END)
            modifier_magnataur_3_thinker.remove(hThinker);
            let hModifier = modifier_magnataur_3_dummy.apply(hThinker, hCaster, this)
            if (GameFunc.IsValid(hModifier)) {
                hModifier.SetDuration(1, true)
            }
        }
        return true
    }
    OnProjectileThink_ExtraData(vLocation: Vector, ExtraData: any) {
        let hThinker = EntIndexToHScript(ExtraData.thinker_ent_index || -1) as BaseNpc_Plus
        if (GameFunc.IsValid(hThinker)) {
            let hModifier = modifier_magnataur_3_thinker.findIn(hThinker)
            if (GameFunc.IsValid(hModifier)) {
                hModifier.vPosition = vLocation
            }
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_magnataur_3"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_magnataur_3 extends BaseModifier_Plus {
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
            if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_FARTHEST
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
export class modifier_magnataur_3_thinker extends BaseModifierMotionHorizontal_Plus {
    vPosition: Vector;
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
            if (this.ApplyHorizontalMotionController()) {
                this.vPosition = this.GetParentPlus().GetAbsOrigin()
            } else {
                this.Destroy()
            }
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_magnataur/magnataur_skewer.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_horn", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().RemoveHorizontalMotionController(this)
        }
    }
    UpdateHorizontalMotion(hParent: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            if (this.vPosition != null) {
                hParent.SetAbsOrigin(this.vPosition)
            }
        }
    }
    OnHorizontalMotionInterrupted() {
        if (IsServer()) {
            this.Destroy()
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_3
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_magnataur_3_dummy extends BaseModifier_Plus {
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
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
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
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_magnataur_3_move extends BaseModifierMotionHorizontal_Plus {
    skewer_damage: number;
    skewer_damage_distance: number;
    skewer_damage_per_str: number;
    vTargetPosition: Vector;
    vStartPosition: Vector;
    fDistance: number;
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
        return true
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        this.skewer_damage_distance = this.GetSpecialValueFor("skewer_damage_distance")
        this.skewer_damage = this.GetSpecialValueFor("skewer_damage")
        let extra_skewer_damage_per_str = hCaster.HasTalent("special_bonus_unique_magnataur_custom_1") && hCaster.GetTalentValue("special_bonus_unique_magnataur_custom_1") || 0
        this.skewer_damage_per_str = this.GetSpecialValueFor("skewer_damage_per_str") + extra_skewer_damage_per_str
        if (IsServer()) {
            if (this.ApplyHorizontalMotionController()) {
                this.vStartPosition = GameFunc.VectorFunctions.StringToVector(params.start_position)
                this.vTargetPosition = GameFunc.VectorFunctions.StringToVector(params.target_position)
                this.fDistance = 0
            } else {
                this.Destroy()
            }
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().RemoveHorizontalMotionController(this)
        }
    }
    Damage() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
                return
            }

            let iStr = 0
            if (hCaster.GetStrength != null) {
                iStr = hCaster.GetStrength()
            }

            let tDamageTable = {
                ability: hAbility,
                victim: hParent,
                attacker: hCaster,
                damage: this.skewer_damage + this.skewer_damage_per_str * iStr,
                damage_type: hAbility.GetAbilityDamageType(),
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        }
    }
    UpdateHorizontalMotion(hParent: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let fPercent = this.GetElapsedTime() / this.GetDuration()
            // let vPosition = VectorLerp(fPercent, this.vStartPosition, this.vTargetPosition)
            // let vDirection = (vPosition - hParent.GetAbsOrigin()) as Vector
            // hParent.SetAbsOrigin(vPosition)
            // this.fDistance = this.fDistance + vDirection.Length2D()
            while (this.fDistance >= this.skewer_damage_distance) {
                this.fDistance = this.fDistance - this.skewer_damage_distance
                this.Damage()
            }
        }
    }
    OnHorizontalMotionInterrupted() {
        if (IsServer()) {
            this.Destroy()
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_FLAIL
    }



}
