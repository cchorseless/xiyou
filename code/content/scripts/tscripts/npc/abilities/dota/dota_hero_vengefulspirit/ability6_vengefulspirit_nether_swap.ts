
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_building } from "../../../modifier/modifier_building";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { ability1_vengefulspirit_magic_missile } from "./ability1_vengefulspirit_magic_missile";
import { ability2_vengefulspirit_wave_of_terror } from "./ability2_vengefulspirit_wave_of_terror";

/** dota原技能数据 */
export const Data_vengefulspirit_nether_swap = { "ID": "5125", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_CUSTOM", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_CUSTOM", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_INVULNERABLE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "FightRecapLevel": "2", "AbilitySound": "Hero_VengefulSpirit.NetherSwap", "AbilityCastRange": "800 950 1100", "AbilityCastPoint": "0.4", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "50 40 30", "AbilityManaCost": "100 150 200", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "scepter_radius": "700", "RequiresScepter": "1" }, "02": { "var_type": "FIELD_FLOAT", "scepter_charge_reduction": "2", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_vengefulspirit_nether_swap extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "vengefulspirit_nether_swap";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_vengefulspirit_nether_swap = Data_vengefulspirit_nether_swap;
    Init() {
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("damage_factor", 100);
        this.SetDefaultSpecialValue("bonus_damage_percent", [6, 7, 8, 9, 10, 11]);
        this.SetDefaultSpecialValue("max_bonus_damage_percent", 60);
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("double_damage", 2);

    }

    Init_old() {
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("damage_factor", 100);
        this.SetDefaultSpecialValue("bonus_damage_percent", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("max_bonus_damage_percent", 60);
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("double_damage", 2);

    }



    hLastTarget: CDOTA_BaseNPC_Building;

    CastFilterResultTarget(target: IBaseNpc_Plus) {
        if (IsServer()) {
            let caster = this.GetCasterPlus()
            if (caster == target) {
                this.errorStr = "dota_hud_error_cant_cast_on_self"
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
            if (!modifier_building.exist(target)) {
                this.errorStr = "dota_hud_error_only_can_cast_on_building.length"
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
            if (caster.GetPlayerOwnerID() != target.GetPlayerOwnerID()) {
                return UnitFilterResult.UF_FAIL_NOT_PLAYER_CONTROLLED
            }
            if (modifier_vengefulspirit_6_buff.exist(caster)) {
                ;
                this.errorStr = "dota_hud_error_casted.length"
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
            if (caster.IsIllusion() || caster.IsClone()) {
                this.errorStr = "dota_hud_error_no_illusion"
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, caster.GetTeamNumber())
        }
    }

    GetCustomCastErrorTarget(target: IBaseNpc_Plus) {
        return this.errorStr || ""
    }
    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    // todo
    OnSpellStart() {
        // let hCaster = this.GetCasterPlus()
        // let hTarget = this.GetCursorTarget()
        // let duration = this.GetSpecialValueFor("duration")
        // let double_damage = this.GetSpecialValueFor("double_damage")
        // let vengefulspirit_4_table = []
        // if (!hCaster.IsBuilding() || !hTarget.IsBuilding()) {
        //     return
        // }
        // // 获取塔建筑点，幻象的absorigin
        // let hCasterBuilding = hCaster.GetBuilding != null && hCaster.GetBuilding() || hCaster
        // let hTargetBuilding = hTarget.GetBuilding != null && hTarget.GetBuilding() || hTarget
        // let vOrigin = hCasterBuilding.GetLocation != null && hCasterBuilding.GetLocation() || hCasterBuilding.GetAbsOrigin()
        // let vTarget = (vengefulspirit_4_table.indexOf(hTarget) == -1 || hTarget.IsClone() || hTargetBuilding.GetLocation == null) && hTarget.GetAbsOrigin() || hTargetBuilding.GetLocation()
        // let distance = (vOrigin - vTarget).Length2D()
        // distance = TableFindKey(vengefulspirit_4_table, hTarget) && distance * double_damage || distance
        //  modifier_vengefulspirit_6_buff.apply( hCaster , hCaster, this, { duration: duration, vTarget: (vTarget), distance: distance })
        //  modifier_vengefulspirit_6_buff.apply( hTarget , hCaster, this, { duration: duration, vTarget: (vOrigin), distance: distance })
        // this.hLastTarget = hTarget
    }

    GetIntrinsicModifierName() {
        return "modifier_vengefulspirit_6"
    }

    OnStolen(hSourceAbility: ability6_vengefulspirit_nether_swap) {
        this.hLastTarget = hSourceAbility.hLastTarget
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_vengefulspirit_6 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus() as ability6_vengefulspirit_nether_swap
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
            //  优先上一个目标
            let target = GameFunc.IsValid(ability.hLastTarget) && ability.hLastTarget || null
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range + target.GetHullRadius())) {
                target = null
            }
            if (target == null) {
                let tTarget = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), null, range, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false)
                for (let hTarget of (tTarget)) {
                    if (GameFunc.IsValid(hTarget) && hTarget.IsAlive() && hTarget != caster) {
                        target = hTarget as any
                        break
                    }
                }
            }
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
// Modifiers
@registerModifier()
export class modifier_vengefulspirit_6_buff extends BaseModifier_Plus {
    bonus_damage_percent: number;
    max_bonus_damage_percent: number;
    vOrigin: Vector;
    vTarget: any;
    distance: any;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params)
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.bonus_damage_percent = this.GetSpecialValueFor("bonus_damage_percent")
        this.max_bonus_damage_percent = this.GetSpecialValueFor("max_bonus_damage_percent") + hCaster.GetTalentValue("special_bonus_unique_vengefulspirit_custom_8")
        if (!GameFunc.IsValid(hCaster)) {
            return
        }
        if (IsServer()) {
            this.vOrigin = hParent.GetAbsOrigin()
            this.vTarget = GameFunc.VectorFunctions.StringToVector(params.vTarget)
            this.distance = params.distance || 0
            this.SetStackCount(this.distance)
            if (hCaster.HasScepter()) {
                let hAbility1 = ability1_vengefulspirit_magic_missile.findIn(hCaster)
                let hAbility2 = ability2_vengefulspirit_wave_of_terror.findIn(hCaster)
                if (GameFunc.IsValid(hAbility1)) {
                    hAbility1.SpellStart1(this.vTarget)
                }
                if (GameFunc.IsValid(hAbility2)) {
                    hAbility2.SpellStart2(this.vTarget)
                }
            }
            if (hParent.IsBuilding()) {
                hParent.SetAbsOrigin(this.vTarget)
                hParent.EmitSound("Hero_VengefulSpirit.NetherSwap")
            }
        }
        else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_vengeful/vengeful_nether_swap.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), false)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), false)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.bonus_damage_percent = this.GetSpecialValueFor("bonus_damage_percent")
        this.max_bonus_damage_percent = this.GetSpecialValueFor("max_bonus_damage_percent") + hCaster.GetTalentValue("special_bonus_unique_vengefulspirit_custom_8")
    }
    OnDestroy() {
        super.OnDestroy()
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (hParent.IsBuilding()) {
                hParent.SetAbsOrigin(this.vOrigin)
                hParent.EmitSound("Hero_VengefulSpirit.NetherSwap")
            }
        } else {
            if (!GameFunc.IsValid(hCaster)) {
                return
            }
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_vengeful/vengeful_nether_swap.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), false)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), false)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TELEPORTED)
    teleported(params: ModifierTable) {
        if (IsServer() && params.unit == this.GetParentPlus()) {
            this.vOrigin = params.new_pos
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    GetMAX_ATTACKSPEED_BONUS() {
        return this.GetCasterPlus().GetTalentValue("special_bonus_unique_vengefulspirit_custom_6")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_PHYSICAL_DAMAGE_PERCENTAGE)
    Get_OUTGOING_PHYSICAL_DAMAGE_PERCENTAGE() {
        return math.min(this.bonus_damage_percent * this.GetStackCount() * 0.01, this.max_bonus_damage_percent)
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster)) {
            return hCaster.GetTalentValue("special_bonus_unique_vengefulspirit_custom_6")
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hParent)) {
            return 0
        }
        return math.min(this.bonus_damage_percent * this.GetStackCount() * 0.01, this.max_bonus_damage_percent)
    }


}
