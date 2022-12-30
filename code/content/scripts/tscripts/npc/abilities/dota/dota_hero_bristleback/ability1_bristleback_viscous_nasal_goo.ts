
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { ability6_bristleback_warpath } from "./ability6_bristleback_warpath";

/** dota原技能数据 */
export const Data_bristleback_viscous_nasal_goo = { "ID": "5548", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Bristleback.ViscousGoo.Cast", "HasScepterUpgrade": "1", "AbilityCastRange": "600", "AbilityCastPoint": "0.3", "AbilityCooldown": "1.5 1.5 1.5 1.5", "AbilityManaCost": "12 16 20 24", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "stack_limit_scepter": "8", "LinkedSpecialBonus": "special_bonus_unique_bristleback" }, "01": { "var_type": "FIELD_INTEGER", "goo_speed": "1000" }, "02": { "var_type": "FIELD_FLOAT", "goo_duration": "5.0" }, "03": { "var_type": "FIELD_FLOAT", "base_armor": "2" }, "04": { "var_type": "FIELD_FLOAT", "armor_per_stack": "1.5 2.0 2.5 3.0", "LinkedSpecialBonus": "special_bonus_unique_bristleback_4" }, "05": { "var_type": "FIELD_INTEGER", "base_move_slow": "20" }, "06": { "var_type": "FIELD_INTEGER", "move_slow_per_stack": "3 6 9 12" }, "07": { "var_type": "FIELD_INTEGER", "stack_limit": "4", "LinkedSpecialBonus": "special_bonus_unique_bristleback" }, "08": { "var_type": "FIELD_FLOAT", "goo_duration_creep": "10.0" }, "09": { "var_type": "FIELD_INTEGER", "radius_scepter": "950", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_bristleback_viscous_nasal_goo extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bristleback_viscous_nasal_goo";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bristleback_viscous_nasal_goo = Data_bristleback_viscous_nasal_goo;
    Init() {
        this.SetDefaultSpecialValue("radius", 200);
        this.SetDefaultSpecialValue("reduce_move_speed_pct", 20);
        this.SetDefaultSpecialValue("per_layer_reduce_move_speed_pct", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("reduce_armor", 5);
        this.SetDefaultSpecialValue("per_layer_reduce_armor", [0.5, 1, 1.5, 2, 2.5, 3]);
        this.SetDefaultSpecialValue("max_layer", 5);
        this.SetDefaultSpecialValue("duration", 5);

    }


    GetBehavior() {
        let iBehavior = tonumber(tostring(super.GetBehavior()))
        if (this.GetCasterPlus().HasScepter()) {
            iBehavior = iBehavior - DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET
            iBehavior = iBehavior + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET
        }
        return iBehavior
    }
    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        // 音效
        EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Bristleback.ViscousGoo.Cast", hCaster), hCaster)
        if (hCaster.HasScepter()) {
            let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, this.GetCastRange(hCaster.GetAbsOrigin(), hCaster), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            for (let hTarget of (tTarget)) {
                this.OnCastTarget(hTarget)
            }
        } else {
            let hTarget = this.GetCursorTarget()
            this.OnCastTarget(hTarget)
        }
    }
    OnCastTarget(hTarget: IBaseNpc_Plus, vLocation: Vector = null) {
        let hCaster = this.GetCasterPlus()
        let vSourceLoc = vLocation || hCaster.GetAbsOrigin()
        let radius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("duration")
        let info: CreateTrackingProjectileOptions = {
            Target: hTarget,
            //  Source : hCaster,
            Ability: this,
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_bristleback/bristleback_viscous_nasal_goo.vpcf", hCaster),
            iMoveSpeed: 1000,
            vSourceLoc: vSourceLoc,
            bDodgeable: true,
            bIsAttack: false,
            flExpireTime: GameRules.GetGameTime() + 10,
        }
        ProjectileManager.CreateTrackingProjectile(info)
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("duration")
        if (GameFunc.IsValid(hTarget)) {
            let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            for (let hTarget of (tTarget)) {
                if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                    modifier_bristleback_1_buff.apply(hTarget, hCaster, this, { duration: duration })
                }
            }
        }
        return true
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_bristleback_1"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bristleback_1 extends BaseModifier_Plus {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster)
            if (!caster.HasScepter()) {
                range = range + caster.GetCastRangeBonus()
            }
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST

            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                let tOrder: ExecuteOrderOptions = {
                    UnitIndex: caster.entindex(),
                    AbilityIndex: ability.entindex(),
                    OrderType: null,
                    TargetIndex: null
                }

                if (caster.HasScepter()) {
                    tOrder.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET
                } else {
                    tOrder.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET
                    tOrder.TargetIndex = targets[0].entindex()
                }

                ExecuteOrderFromTable(tOrder)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bristleback_1_buff extends BaseModifier_Plus {
    reduce_move_speed_pct: number;
    per_layer_reduce_move_speed_pct: number;
    reduce_armor: number;
    per_layer_reduce_armor: number;
    max_layer: number;
    iParticleID: ParticleID;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.per_layer_reduce_move_speed_pct = this.GetSpecialValueFor("per_layer_reduce_move_speed_pct")
        this.reduce_move_speed_pct = this.GetSpecialValueFor("reduce_move_speed_pct")
        this.reduce_armor = this.GetSpecialValueFor("reduce_armor")
        this.per_layer_reduce_armor = this.GetSpecialValueFor("per_layer_reduce_armor") + hCaster.GetTalentValue("special_bonus_unique_bristleback_custom_4")
        this.max_layer = this.GetSpecialValueFor("max_layer")
        if (IsServer()) {
            let hAbility3 = ability6_bristleback_warpath.findIn(hCaster)
            if (GameFunc.IsValid(hAbility3) && hAbility3.GetLevel() >= 1) {
                let bonus_max_stacks = hAbility3.GetSpecialValueFor("bonus_max_stacks")
                this.max_layer = this.max_layer + bonus_max_stacks
            }
            this.SetStackCount(math.min(this.GetStackCount() + 1, this.max_layer))
        } else if (params.IsOnCreated) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_bristleback/bristleback_viscous_nasal_goo_debuff.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, 0, false, false)
            this.iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_bristleback/bristleback_viscous_nasal_stack_2.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControl(this.iParticleID, 1, Vector(math.floor(this.GetStackCount() / 10), this.GetStackCount() % 10, 0))
            this.AddParticle(this.iParticleID, false, false, -1, false, false)
        }
    }


    OnStackCountChanged(iStackCount: number) {
        if (IsClient()) {
            if (this.GetStackCount() != iStackCount) {
                ParticleManager.SetParticleControl(this.iParticleID, 1, Vector(math.floor(this.GetStackCount() / 10), this.GetStackCount() % 10, 0))
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -(this.reduce_move_speed_pct + this.per_layer_reduce_move_speed_pct * this.GetStackCount())
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)

    EOM_GetModifierPhysicalArmorBonus() {
        return -(this.reduce_armor + this.per_layer_reduce_armor * this.GetStackCount())
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        return -(this.reduce_armor + this.per_layer_reduce_armor * this.GetStackCount())
    }
}
