import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_axe_counter_helix = { "ID": "5009", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilitySound": "Hero_Axe.CounterHelix", "HasShardUpgrade": "1", "AbilityCooldown": "0.3", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage": "60 100 140 180", "LinkedSpecialBonus": "special_bonus_unique_axe_4" }, "02": { "var_type": "FIELD_INTEGER", "radius": "275" }, "03": { "var_type": "FIELD_INTEGER", "trigger_chance": "17 18 19 20" }, "04": { "var_type": "FIELD_FLOAT", "cooldown": "0.3" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_axe_counter_helix extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "axe_counter_helix";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_axe_counter_helix = Data_axe_counter_helix;
    Init() {
        this.SetDefaultSpecialValue("radius", 350);
        this.SetDefaultSpecialValue("reduce_move_speed", [12, 14, 16, 20, 25]);
        this.SetDefaultSpecialValue("damage_str_factor", [1.2, 1.4, 1.6, 1.8, 2]);
        this.SetDefaultSpecialValue("increase_str_pct", 2);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("damage_interval", 1);
        this.SetDefaultSpecialValue("shard_increase_str_pct", 1);

    }



    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnAbilityPhaseStart() {
        let particleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_axe/axe_battle_hunger_cast.vpcf",
            resNpc: this.GetCasterPlus(),
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: this.GetCasterPlus()
        });

        ParticleManager.SetParticleControlEnt(particleID, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true)
        ParticleManager.ReleaseParticleIndex(particleID)
        return true
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        let radius = this.GetSpecialValueFor("radius")
        let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
        for (let hUnit of (tTargets)) {

            this._OnSpellStart(hUnit)
        }
    }
    _OnSpellStart(hTarget: BaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        if (GameFunc.IsValid(hTarget)) {
            modifier_axe_3_debuff.apply(hTarget, hCaster, this, { duration: duration })
            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), "Hero_Axe.Battle_Hunger", hCaster)
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_axe_3"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_axe_3 extends BaseModifier_Plus {
    increase_str_pct: number;
    shard_increase_str_pct: number;
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
        this.increase_str_pct = this.GetSpecialValueFor("increase_str_pct")
        this.shard_increase_str_pct = this.GetSpecialValueFor("shard_increase_str_pct")
        if (IsServer() && params.IsOnCreated) {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus() + caster.GetHullRadius()
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
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags()
                let order = FindOrder.FIND_CLOSEST
                let targets = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), null, range, teamFilter, typeFilter, flagFilter, order, false)
                for (let i = targets.length - 1; i >= 0; i--) {
                    if (targets[i].GetUnitLabel() != "HERO") {
                        table.remove(targets, i)
                    }
                }
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
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_STRENGTH_PERCENTAGE)
    EOM_GetModifierStats_Strength_Percentage() {
        if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard()) {
            return (this.increase_str_pct + this.shard_increase_str_pct) * this.GetStackCount()
        }
        return this.increase_str_pct * this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_axe_3_debuff extends BaseModifier_Plus {
    reduce_move_speed: number;
    damage_interval: number;
    damage_str_factor: number;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            if (GameFunc.IsValid(hCaster)) {
                let hModifier = modifier_axe_3.findIn(hCaster) as modifier_axe_3;
                if (GameFunc.IsValid(hModifier)) {
                    hModifier.IncrementStackCount()
                }
            }
            this.StartIntervalThink(this.damage_interval)
        } else {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_axe/axe_battle_hunger.vpcf",
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, false, -1, false, true)
        }
    }
    Init(params: ModifierTable) {
        this.reduce_move_speed = this.GetSpecialValueFor("reduce_move_speed")
        this.damage_str_factor = this.GetSpecialValueFor("damage_str_factor")
        this.damage_interval = this.GetSpecialValueFor("damage_interval")
    }
    OnDestroy() {
        super.OnDestroy();
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            if (GameFunc.IsValid(hCaster)) {
                let hModifier = modifier_axe_3.findIn(hCaster) as modifier_axe_3;
                if (GameFunc.IsValid(hModifier)) {
                    hModifier.DecrementStackCount()
                }
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let caster = this.GetCasterPlus()
            let target = this.GetParentPlus()
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(caster) || !GameFunc.IsValid(ability)) {
                this.Destroy()
                return
            }
            let damage_table = {
                ability: ability,
                victim: target,
                attacker: caster,
                damage: caster.GetStrength() * this.damage_str_factor * this.damage_interval,
                damage_type: ability.GetAbilityDamageType(),
                eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_DOT,
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: ModifierTable) {
        return -this.reduce_move_speed
    }
}
