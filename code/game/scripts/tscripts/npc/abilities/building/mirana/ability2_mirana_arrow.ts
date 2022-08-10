import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { BaseModifierMotionVertical, registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_mirana_3, modifier_mirana_3_buff } from "./ability3_mirana_leap";

/** dota原技能数据 */
export const Data_mirana_arrow = { "ID": "5048", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_DIRECTIONAL | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_Mirana.ArrowCast", "HasScepterUpgrade": "1", "AbilityCastRange": "3000", "AbilityCastPoint": "0.5 0.5 0.5 0.5", "AbilityCooldown": "19 18 17 16", "AbilityDuration": "3.11 3.11 3.11 3.11", "AbilityDamage": "60 150 240 330", "AbilityManaCost": "100 100 100 100", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "arrow_speed": "900.0" }, "02": { "var_type": "FIELD_INTEGER", "arrow_width": "115" }, "03": { "var_type": "FIELD_INTEGER", "arrow_range": "3000" }, "04": { "var_type": "FIELD_INTEGER", "arrow_max_stunrange": "1500" }, "05": { "var_type": "FIELD_FLOAT", "arrow_min_stun": "0.01" }, "06": { "var_type": "FIELD_FLOAT", "arrow_max_stun": "3.5 4 4.5 5.0" }, "07": { "var_type": "FIELD_INTEGER", "arrow_bonus_damage": "180" }, "08": { "var_type": "FIELD_INTEGER", "arrow_vision": "500" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_mirana_arrow extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "mirana_arrow";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_mirana_arrow = Data_mirana_arrow;
    Init() {
        this.SetDefaultSpecialValue("leap_duration", 0.42);
        this.SetDefaultSpecialValue("leap_acceleration", 6000);
        this.SetDefaultSpecialValue("leap_speedbonus_as", [200, 230, 260, 290, 320, 350]);
        this.SetDefaultSpecialValue("leap_bonus_duration", 4);
        this.SetDefaultSpecialValue("leap_radius", 300);
        this.SetDefaultSpecialValue("leap_damage", [200, 400, 600, 800, 1000, 1200]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("leap_duration", 0.42);
        this.SetDefaultSpecialValue("leap_acceleration", 6000);
        this.SetDefaultSpecialValue("leap_speedbonus_as", [200, 230, 260, 290, 320, 350]);
        this.SetDefaultSpecialValue("leap_bonus_duration", 4);
        this.SetDefaultSpecialValue("leap_radius", 300);
        this.SetDefaultSpecialValue("leap_damage", [200, 400, 600, 800, 1000, 1200]);

    }



    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        return this.GetSpecialValueFor("leap_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let leap_radius = this.GetSpecialValueFor("leap_radius")
        let leap_bonus_duration = this.GetSpecialValueFor("leap_bonus_duration")

        ProjectileManager.ProjectileDodge(hCaster)

        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_mirana/mirana_leap_start.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: hCaster
        });

        let hModel = hCaster.FirstMoveChild()
        while (hModel != null) {
            if (hModel.GetClassname() != "" && hModel.GetClassname() == "dota_item_wearable" && hModel.GetModelName() == "models/items/mirana/ti8_wyvernmount/ti8_wyvernmount.vmdl") {
                ParticleManager.SetParticleControlEnt(iParticleID, 0, hModel, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
                ParticleManager.SetParticleControlEnt(iParticleID, 1, hModel, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
                ParticleManager.SetParticleControlEnt(iParticleID, 2, hModel, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
                ParticleManager.SetParticleControlEnt(iParticleID, 3, hModel, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            }
            hModel = hModel.NextMovePeer()
        }
        ParticleManager.ReleaseParticleIndex(iParticleID)
        modifier_mirana_2_jump.apply(hCaster, hCaster, this, null)
        modifier_mirana_2_buff.apply(hCaster, hCaster, this, { duration: leap_bonus_duration })
        let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, leap_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, 0, false)
        for (let hTarget of (tTargets)) {
            if (modifier_mirana_3_buff.exist(hCaster)) {
                modifier_mirana_2_invis.apply(hTarget, hCaster, this, { duration: leap_bonus_duration })
            }
            if (hCaster.HasTalent("special_bonus_unique_mirana_custom_3")) {
                modifier_mirana_2_buff.apply(hTarget, hCaster, this, { duration: leap_bonus_duration })
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_mirana_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mirana_2 extends BaseModifier_Plus {
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
            if (ability == null || ability.IsNull()) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }
            let hCaster = ability.GetCasterPlus()
            if (!GameFunc.IsValid(hCaster)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }
            // 隐身buff会导致自动攻击失效，加一个攻击指令
            if (modifier_mirana_2_invis.exist(hCaster) && !hCaster.IsAttacking() && !hCaster.IsChanneling()) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE,
                    Position: hCaster.GetAbsOrigin()
                })
            }

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

            let range = hCaster.Script_GetAttackRange()

            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets.length > 0) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_mirana_2_jump extends BaseModifierMotionVertical {
    leap_acceleration: number;
    leap_duration: number;
    vForwardVector: Vector;
    vAcceleration: number;
    vStartVerticalVelocity: number;
    vUpVector: Vector;
    fTime: number;
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
            this.fTime = 0
            this.GetAbilityPlus().SetActivated(false)
            if (this.ApplyVerticalMotionController()) {
                this.GetParentPlus().EmitSound("Ability.Leap")
                this.leap_acceleration = this.GetSpecialValueFor("leap_acceleration")
                this.vForwardVector = this.GetParentPlus().GetForwardVector()
                this.leap_duration = this.GetSpecialValueFor("leap_duration")
                let fHeightDifference = GetGroundHeight(this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus()) - (this.GetParentPlus().GetAbsOrigin()).z
                this.vUpVector = this.GetParentPlus().GetUpVector()
                this.vAcceleration = -this.vUpVector * this.leap_acceleration
                this.vStartVerticalVelocity = Vector(0, 0, fHeightDifference) / this.leap_duration - this.vAcceleration * this.leap_duration / 2
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_mirana/mirana_leap_trail.vpcf",
                    resNpc: this.GetCasterPlus(),
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: this.GetParentPlus()
                });

                let hModel = this.GetParentPlus().FirstMoveChild()
                while (hModel != null) {
                    if (hModel.GetClassname() != "" && hModel.GetClassname() == "dota_item_wearable" && hModel.GetModelName() == "models/items/mirana/ti8_wyvernmount/ti8_wyvernmount.vmdl") {
                        ParticleManager.SetParticleControlEnt(iParticleID, 0, hModel, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true)
                        ParticleManager.SetParticleControlEnt(iParticleID, 1, hModel, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true)
                        ParticleManager.SetParticleControlEnt(iParticleID, 2, hModel, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true)
                        ParticleManager.SetParticleControlEnt(iParticleID, 3, hModel, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true)
                    }
                    hModel = hModel.NextMovePeer()
                }
                this.AddParticle(iParticleID, false, false, -1, false, false)
            } else {
                this.Destroy()
            }
        } else {
            if (modifier_mirana_3_buff.exist(this.GetCasterPlus())) {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_mirana/mirana_moonlight_recipient.vpcf",
                    resNpc: this.GetCasterPlus(),
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: this.GetParentPlus()
                });

                ParticleManager.ReleaseParticleIndex(iParticleID)
            }
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetAbilityPlus().SetActivated(true)
            this.GetParentPlus().StartGesture(GameActivity_t.ACT_MIRANA_LEAP_END)
            this.GetParentPlus().RemoveVerticalMotionController(this)
        }
    }
    UpdateVerticalMotion(me: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            me.SetAbsOrigin((me.GetAbsOrigin() + (this.vAcceleration * this.fTime + this.vStartVerticalVelocity) * dt) as Vector)
            this.fTime = this.fTime + dt
            if (this.fTime > this.leap_duration) {
                this.Destroy()
            }
        }
    }
    OnVerticalMotionInterrupted() {
        if (IsServer()) {
            this.Destroy()
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_3
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DISABLE_TURNING)
    GetDisableTurning(params: ModifierTable) {
        return 1
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_mirana_2_buff extends BaseModifier_Plus {
    leap_radius: number;
    duration: number;
    leap_speedbonus_as: number;
    leap_speedbonus_talent_pct: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
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
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.leap_radius = this.GetSpecialValueFor("leap_radius")
        this.duration = this.GetSpecialValueFor("leap_bonus_duration")
        this.leap_speedbonus_as = this.GetSpecialValueFor("leap_speedbonus_as") + hCaster.GetTalentValue("special_bonus_unique_mirana_custom_1")
        this.leap_speedbonus_talent_pct = hCaster.GetTalentValue("special_bonus_unique_mirana_custom_3")
    }

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            // if (GameFunc.IsValid(this.hPtclThinker)) {
            //      this.hPtclThinker.sBuffName.remove( this.hPtclThinker );
            // }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)

    G_MAX_ATTACKSPEED_BONUS() {
        return (this.GetCasterPlus() == this.GetParentPlus() && this.GetCasterPlus().GetTalentValue("special_bonus_unique_mirana_custom_6") || 0)
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: ModifierTable) {
        return this.GetParentPlus() == this.GetCasterPlus() && this.leap_speedbonus_as || (this.leap_speedbonus_as * this.leap_speedbonus_talent_pct * 0.01)
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_mirana_2_invis extends BaseModifier_Plus {
    leap_damage: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
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
    Init(params: ModifierTable) {
        this.leap_damage = this.GetSpecialValueFor("leap_damage")
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
            this.GetParentPlus().Purge(false, true, false, true, true)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            this.StartIntervalThink(-1)
            let hParent = this.GetParentPlus()
            if (!hParent.IsAttacking() && !hParent.IsChanneling()) {
                ExecuteOrderFromTable({
                    UnitIndex: hParent.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE,
                    Position: hParent.GetAbsOrigin()
                })
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster)) {
            let extra_damage = hCaster.HasTalent("special_bonus_unique_mirana_custom_7") && hCaster.GetTalentValue("special_bonus_unique_mirana_custom_7") || 0
            if (this.GetParentPlus() == hCaster) {
                return this.leap_damage
            } else {
                return this.leap_damage + modifier_mirana_3.GetStackIn(hCaster) * (1 + extra_damage)
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    GetInvisibilityLevel(params: ModifierTable) {
        return math.min(this.GetElapsedTime(), 1)
    }
}
