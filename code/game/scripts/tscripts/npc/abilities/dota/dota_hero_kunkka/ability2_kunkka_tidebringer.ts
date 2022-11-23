import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionVertical_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { modifier_kunkka_3_ebb, modifier_kunkka_3_tide } from "./ability3_kunkka_x_marks_the_spot";

/** dota原技能数据 */
export const Data_kunkka_tidebringer = { "ID": "5032", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_ATTACK", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilitySound": "Hero_Kunkka.Tidebringer.Attack", "AbilityCooldown": "13.0 10.0 7.0 4.0", "AbilityCastRange": "150", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "cleave_starting_width": "150" }, "02": { "var_type": "FIELD_INTEGER", "cleave_ending_width": "500 550 600 650" }, "03": { "var_type": "FIELD_INTEGER", "cleave_distance": "650 800 950 1100" }, "04": { "var_type": "FIELD_INTEGER", "damage_bonus": "25 50 75 100", "LinkedSpecialBonus": "special_bonus_unique_kunkka_6", "CalculateSpellDamageTooltip": "0" }, "05": { "var_type": "FIELD_INTEGER", "cleave_damage": "165", "LinkedSpecialBonus": "special_bonus_unique_kunkka_4" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_kunkka_tidebringer extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "kunkka_tidebringer";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_kunkka_tidebringer = Data_kunkka_tidebringer;
    Init() {
        this.SetDefaultSpecialValue("duration", [1, 1.25, 1.5, 1.75, 2.0, 2.0]);
        this.SetDefaultSpecialValue("radius", 200);
        this.SetDefaultSpecialValue("damage_factor", [0.35, 0.4, 0.45, 0.5, 0.55, 0.6]);

    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let duration = this.GetSpecialValueFor("duration") + hCaster.GetTalentValue("special_bonus_unique_kunkka_custom_3")
        let radius = this.GetSpecialValueFor("radius")
        if (hTarget.TriggerSpellAbsorb(this)) {
            return
        }
        let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false)
        for (let unit of (tTarget)) {
            if (GameFunc.IsValid(unit) && unit.IsAlive()) {
                modifier_kunkka_2_buff.apply(unit, hCaster, this, { duration: duration })
            }
        }
        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), "Ability.XMarksTheSpot.Target", hCaster)
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_kunkka_2"
    // }

}
// Modifiers
@registerModifier()
export class modifier_kunkka_2 extends BaseModifier_Plus {
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
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_kunkka_2_buff extends BaseModifier_Plus {
    damage_factor: number;
    position: Vector;
    fCurHealth: number;
    Spawner_targetCornerName: any;
    Spawner_lastCornerName: any;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.damage_factor = this.GetSpecialValueFor("damage_factor")
        if (IsServer()) {
            hParent.EmitSound("Ability.XMark.Target_Movement")
            this.position = hParent.GetAbsOrigin()
            this.fCurHealth = hParent.GetHealth()
            // this.Spawner_targetCornerName = hParent.Spawner_targetCornerName
            // this.Spawner_lastCornerName = hParent.Spawner_lastCornerName
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_kunkka/kunkka_spell_x_spot.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.damage_factor = this.GetSpecialValueFor("damage_factor")
    }
    OnDestroy() {
        super.OnDestroy();
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                return
            }
            // 涨潮，拉回原点
            if (modifier_kunkka_3_tide.exist(hCaster)) {
                FindClearSpaceForUnit(hParent, this.position, true)
                // hParent.Spawner_targetCornerName = this.Spawner_targetCornerName
                // hParent.Spawner_lastCornerName = this.Spawner_lastCornerName
                // Spawner.MoveOrder(hParent)
                hParent.StopSound("Ability.XMark.Target_Movement")
                hParent.EmitSound("Ability.XMarksTheSpot.Return")
            }
            // 退潮 根据损失的血量造成额外伤害
            if (modifier_kunkka_3_ebb.exist(hCaster)) {
                let fCurHealth = hParent.GetHealth()
                let fDamage = math.max(this.fCurHealth - fCurHealth, 0) * this.damage_factor
                let damage_table = {
                    ability: hAbility,
                    victim: hParent,
                    attacker: hCaster,
                    damage: fDamage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_DAMAGE_AMPLIFY + BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_SPELL_CRIT,
                }
                BattleHelper.GoApplyDamage(damage_table)
            }
        }
    }
}
