
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { ability1_abyssal_underlord_firestorm } from "./ability1_abyssal_underlord_firestorm";
import { ability2_abyssal_underlord_pit_of_malice } from "./ability2_abyssal_underlord_pit_of_malice";

/** dota原技能数据 */
export const Data_abyssal_underlord_dark_rift = { "ID": "5616", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_BUILDING | DOTA_UNIT_TARGET_CREEP", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_INVULNERABLE", "AbilitySound": "Hero_AbyssalUnderlord.DarkRift.Cast", "HasScepterUpgrade": "1", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilityCastRange": "0", "AbilityCastPoint": "0.6", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "130 115 100", "AbilityManaCost": "100 200 300", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "600" }, "02": { "var_type": "FIELD_FLOAT", "teleport_delay": "6.0 5.0 4.0" }, "03": { "var_type": "FIELD_FLOAT", "scepter_teleport_delay": "5.0 4.0 3.0" }, "04": { "var_type": "FIELD_INTEGER", "max_charges": "2", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_abyssal_underlord_dark_rift extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "abyssal_underlord_dark_rift";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_abyssal_underlord_dark_rift = Data_abyssal_underlord_dark_rift;
    Init() {
        this.SetDefaultSpecialValue("base_damage", [300, 600, 900, 1500, 1800, 2600]);
        this.SetDefaultSpecialValue("teleport_delay", 2.4);
        this.SetDefaultSpecialValue("teleport_count", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("damage", [3, 5, 7, 9, 11, 13]);
        this.SetDefaultSpecialValue("damage_per_unit", 20);
        this.SetDefaultSpecialValue("teleport_radius", 3000);

    }




    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_abyssal_underlord_custom_3")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let vPosition = this.GetCursorPosition()
        if (IsValid(hTarget) && hTarget.IsAlive()) {
            if (hTarget.TriggerSpellAbsorb(this)) {
                return
            }
            let iPlayerID = hCaster.GetPlayerOwnerID()
            let teleport_delay = this.GetSpecialValueFor("teleport_delay")
            let teleport_count = this.GetSpecialValueFor("teleport_count")
            let damage = this.GetSpecialValueFor("damage") * hCaster.GetStrength()
            let damage_per_unit = this.GetSpecialValueFor("damage_per_unit")
            let teleport_radius = this.GetSpecialValueFor("teleport_radius")

            let hModifier = modifier_abyssal_underlord_6_target.apply(hTarget, hCaster, this, { duration: teleport_delay })
            if (IsValid(hModifier)) {
                // hModifier.tUnits = []
                // table.insert(hModifier.tUnits, hTarget)
                // let tTargets = Spawner.GetMissing(iPlayerID)
                // let cal_distance = (hUnit) => {
                //     if (!hUnit.IsAlive()) {
                //         return 0
                //     }
                //     //  如果已经是另一个大招的传送目标，他的优先级最低
                //     if ( modifier_abyssal_underlord_6_teleport.exist( hUnit )) {
                //         return 0
                //     }
                //     //  优先以最远的单位为目标
                //     return ((hCaster.GetAbsOrigin() - hUnit.GetAbsOrigin()) as Vector).Length2D()
                // }
                // table.sort(tTargets, (hUnit_a, hUnit_b) => {
                //     return cal_distance(hUnit_a) - cal_distance(hUnit_b) > 0
                // })

                // for (let hUnit of (tTargets)) {
                //     if (hUnit.IsAlive() && hUnit != hTarget && teleport_count > 0 && hUnit.IsPositionInRange(vPosition, teleport_radius)) {
                //         teleport_count = teleport_count - 1
                //          modifier_abyssal_underlord_6_teleport.apply( hUnit , hCaster, this, { duration: teleport_delay })
                //          modifier_abyssal_underlord_6_stun.apply( hUnit , hCaster, this, { duration: teleport_delay * hUnit.GetStatusResistanceFactor(hCaster) })
                //         table.insert(hModifier.tUnits, hUnit)
                //     }
                // }
            }
            hCaster.EmitSound("Hero_AbyssalUnderlord.DarkRift.Cast")
            hTarget.EmitSound("Hero_AbyssalUnderlord.DarkRift.Target")
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_abyssal_underlord_6"
    }


}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_abyssal_underlord_6 extends BaseModifier_Plus {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER)

            if (targets[0] != null && ability.IsAbilityReady()) {
                // let n = caster.GetPlayerOwnerID() + 1
                // if (IsValid(Spawner.Spawner[n])) {
                //     let cal_distance = (hUnit) => { //  优先向离诞生点最近的单位释放
                //         return (Spawner.Spawner[n]: GetAbsOrigin() - hUnit.GetAbsOrigin()).Length2D()
                //     }
                //     table.sort(targets, (hUnit_a, hUnit_b) => {
                //         return cal_distance(hUnit_b) - cal_distance(hUnit_a) > 0
                //     })
                // }

                for (let hTarget of (targets)) {
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                        TargetIndex: hTarget.entindex(),
                        AbilityIndex: ability.entindex()
                    })
                    break
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_abyssal_underlord_6_target extends BaseModifier_Plus {
    base_damage: number;
    damage: number;
    damage_per_unit: number;
    tUnits: Array<any>;
    IsHidden() {
        return true
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT + DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE + DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    BeCreated(params: IModifierTable) {

        this.base_damage = this.GetSpecialValueFor("base_damage")
        this.damage = this.GetSpecialValueFor("damage")
        this.damage_per_unit = this.GetSpecialValueFor("damage_per_unit")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/heroes_underlord/abbysal_underlord_darkrift_ambient.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });
            ParticleManager.SetParticleControl(iParticleID, 0, this.GetParentPlus().GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(600, 1, 1))
            ParticleManager.SetParticleControl(iParticleID, 2, (this.GetParentPlus().GetAbsOrigin() + Vector(0, 0, 100) as Vector))
            ParticleManager.SetParticleControl(iParticleID, 5, this.GetParentPlus().GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 6, this.GetParentPlus().GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 7, this.GetParentPlus().GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 8, this.GetParentPlus().GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 9, this.GetParentPlus().GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 20, this.GetParentPlus().GetAbsOrigin())
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }

    BeDestroy() {

        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            let vLoction = hParent.GetAbsOrigin()
            if (IsValid(hCaster) && IsValid(hAbility)) {
                let iUnitCount = 0
                for (let hTarget of (this.tUnits)) {
                    if (IsValid(hTarget) && hTarget.IsAlive()) {
                        if (!hTarget.IsAncient()) {
                            FindClearSpaceForUnit(hTarget, (vLoction + RandomVector(1) * RandomFloat(0, 125) as Vector), true)
                        }
                        iUnitCount = iUnitCount + (hTarget.IsConsideredHero() && 5 || 1)
                    }
                }
                let iStr = 0
                if (hCaster.GetStrength != null) {
                    iStr = hCaster.GetStrength()
                }
                // 延迟一帧，不然吃不到4技能的光环效果
                hCaster.addFrameTimer(1, () => {
                    if (IsValid(hCaster) && IsValid(hParent)) {
                        let fDamage = this.base_damage + this.damage * iStr * (1 + iUnitCount * this.damage_per_unit * 0.01)
                        for (let hTarget of (this.tUnits)) {
                            if (IsValid(hTarget) && hTarget.IsAlive()) {
                                let damage_table = {
                                    ability: hAbility,
                                    victim: hTarget,
                                    attacker: hCaster,
                                    damage: fDamage,
                                    damage_type: hAbility.GetAbilityDamageType()
                                }
                                BattleHelper.GoApplyDamage(damage_table)
                                if (!hTarget.IsAncient()) {
                                    // hTarget.Spawner_targetCornerName = hParent.Spawner_targetCornerName
                                    // hTarget.Spawner_lastCornerName = hParent.Spawner_lastCornerName
                                    // Spawner.MoveOrder(hTarget)
                                }
                            }
                        }
                        this.tUnits = null
                        hCaster.EmitSound("Hero_AbyssalUnderlord.DarkRift.Complete")
                        hCaster.StopSound("Hero_AbyssalUnderlord.DarkRift.Cast")
                        hParent.StopSound("Hero_AbyssalUnderlord.DarkRift.Target")

                        if (hCaster.HasScepter()) {
                            let hAbility1 = ability1_abyssal_underlord_firestorm.findIn(hCaster)
                            if (IsValid(hAbility1) && hAbility1.OnSpellStart != null) {
                                hCaster.SetCursorPosition(hParent.GetAbsOrigin())
                                hAbility1.OnSpellStart()
                            }
                            let hAbility2 = ability2_abyssal_underlord_pit_of_malice.findIn(hCaster)
                            if (IsValid(hAbility2) && hAbility2.OnSpellStart != null) {
                                hCaster.SetCursorPosition(hParent.GetAbsOrigin())
                                hAbility2.OnSpellStart()
                            }
                        }
                    }
                })
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_abyssal_underlord_6_stun extends BaseModifier_Plus {
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
        return true
    }
    AllowIllusionDuplicate() {
        return false
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_abyssal_underlord_6_teleport extends modifier_particle {
    BeCreated() {
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/heroes_underlord/abyssal_underlord_darkrift_target.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(1, 1, 1))
            ParticleManager.SetParticleControl(iParticleID, 6, this.GetParentPlus().GetAbsOrigin())
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}
