import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
/** dota原技能数据 */
export const Data_clinkz_strafe = { "ID": "5259", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Clinkz.Strafe", "AbilityCooldown": "34 30 26 22", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityManaCost": "70", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "3 4 5 6", "LinkedSpecialBonus": "special_bonus_unique_clinkz_2" }, "02": { "var_type": "FIELD_INTEGER", "attack_speed_bonus_pct": "90 120 150 180", "LinkedSpecialBonus": "special_bonus_unique_clinkz_7" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_clinkz_strafe extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "clinkz_strafe";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_clinkz_strafe = Data_clinkz_strafe;
    Init() {
        this.SetDefaultSpecialValue("duration", 20);
        this.SetDefaultSpecialValue("attack_gain_percent", [70, 75, 80, 85, 90, 100]);
        this.SetDefaultSpecialValue("permanent_bonus_damage", 2);
        this.SetDefaultSpecialValue("armor_reduction", 3);
        this.SetDefaultSpecialValue("armor_reduction_duration", 3);

    }

    CastFilterResultTarget(hTarget: IBaseNpc_Plus) {
        if (IsServer()) {
            if (!hTarget.IsSummoned()) {
                this.errorStr = "dota_hud_error_only_can_cast_on_summoned"
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
            // if (TableFindKey(NOT_DEVOUR_UNIT, hTarget.GetUnitName())) {
            //     this.errorStr = "dota_hud_error_not_target_use"
            //     return UnitFilterResult.UF_FAIL_CUSTOM
            // }
            return UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber())
        }
    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let duration = this.GetSpecialValueFor("duration")
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        let attack_gain_percent = this.GetSpecialValueFor("attack_gain_percent")
        // 特效
        modifier_clinkz_1_particle.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        // 音效
        EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), "Hero_Clinkz.DeathPact.Cast", hCaster)
        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), "Hero_Clinkz.DeathPact", hTarget)
        let bonus_damage = hTarget.GetAverageTrueAttackDamage(null) * attack_gain_percent * 0.01
        hTarget.ForceKill(false)
        if (hCaster.HasShard()) {
            let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, this.GetCastRange(hCaster.GetAbsOrigin(), hCaster), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            for (let hUnit of (tTarget)) {

                // if (hUnit.IsSummoned() && !TableFindKey(NOT_DEVOUR_UNIT, hUnit.GetUnitName())) {
                //     bonus_damage = bonus_damage + hUnit.GetAverageTrueAttackDamage(null) * attack_gain_percent * 0.01
                //     hUnit.ForceKill(false)
                // }
            }
        }
        modifier_clinkz_1_buff.apply(hCaster, hCaster, this, { duration: duration, bonus_damage: bonus_damage })
    }

    GetIntrinsicModifierName() {
        return "modifier_clinkz_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_clinkz_1 extends BaseModifier_Plus {
    armor_reduction_duration: number;
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    Init(params: IModifierTable) {
        this.armor_reduction_duration = this.GetSpecialValueFor("armor_reduction_duration")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        let hParent = this.GetParentPlus()
        if (!GameFunc.IsValid(params.target)) { return }
        let target = params.target as IBaseNpc_Plus
        if (params.target.GetClassname() == "dota_item_drop") { return }

        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            modifier_clinkz_1_reduce_armor.apply(params.target, params.attacker, this.GetAbilityPlus(), { duration: this.armor_reduction_duration * target.GetStatusResistanceFactor(params.attacker) })
        }
    }
    OnSummonned(params: IModifierTable) {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hSummon = params.unit //  召唤者
            let hSummoned = params.target //  被召唤者
            if (GameFunc.IsValid(hSummoned) && hSummon == hParent && hSummoned.GetUnitName() == "npc_dota_clinkz_skeleton_archer") {
                modifier_clinkz_1_summoned_attack_buff.apply(hSummoned, hParent, this.GetAbilityPlus(), null)
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus() as ability1_clinkz_strafe
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
            let target
            // if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
            //     target = null
            // }

            //  搜索范围
            if (target == null) {
                let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
                let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
                let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
                let order = FindOrder.FIND_CLOSEST
                let targets = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), null, range, teamFilter, typeFilter, flagFilter, order, false) as IBaseNpc_Plus[]
                for (let i = targets.length - 1; i >= 0; i--) {
                    // if (!targets[i]. IsSummoned() || TableFindKey(NOT_DEVOUR_UNIT, targets[i]: GetUnitName()) ) {
                    //     table.remove(targets, i)
                    // }
                }
                //  优先自己的召唤物
                // table.sort(targets, (a, b) => {
                //     return a.GetSummoner() == caster && b.GetSummoner() != caster
                // })
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
// // // // // // // // // // // // // // // // // // // -modifier_clinkz_1_summoned_attack_buff 小骷髅继承减甲效果// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_clinkz_1_summoned_attack_buff extends BaseModifier_Plus {
    armor_reduction_duration: number;
    IsHidden() {
        return true
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    Init(params: IModifierTable) {
        this.armor_reduction_duration = this.GetSpecialValueFor("armor_reduction_duration")
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        let hParent = this.GetParentPlus()
        if (!GameFunc.IsValid(params.target)) { return }
        if (params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            modifier_clinkz_1_reduce_armor.apply(params.target, params.attacker, this.GetAbilityPlus(), { duration: this.armor_reduction_duration * (params.target as IBaseNpc_Plus).GetStatusResistanceFactor(params.attacker) })
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_clinkz_1_buff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_clinkz_1_buff extends BaseModifier_Plus {
    health_gain_percent: number;
    _tooltip: number;
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
    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        this.health_gain_percent = this.GetSpecialValueFor("health_gain_percent")
        if (IsServer()) {
            let bonus_damage = params.bonus_damage || 0
            this.SetStackCount(bonus_damage)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_PERCENTAGE)
    g_HP_PERCENTAGE() {
        return this.health_gain_percent
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        this._tooltip = (this._tooltip || 0) % 2 + 1
        if (this._tooltip == 1) {
            return this.GetStackCount()
        } else if (this._tooltip == 2) {
            return this.health_gain_percent
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    On_Death(params: IModifierTable) {
        let hAbility = this.GetAbilityPlus()
        let hParent = this.GetParentPlus()
        let hAttacker = params.attacker
        if (GameFunc.IsValid(hAttacker) && hAttacker.GetUnitLabel() != "builder") {
            if (hAttacker.GetTeamNumber() == params.unit.GetTeamNumber()) {
                return
            }
            if (type(hAttacker.GetSource) == "function") {
                let hSource = hAttacker.GetSource()
                if (GameFunc.IsValid(hSource)) {
                    hAttacker = hSource
                }
            }
            if (hAttacker == hParent && !hAttacker.IsIllusion()) {
                modifier_clinkz_1_attacker_damage.apply(hParent, hParent, hAbility, null)
            }

        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_clinkz_1_reduce_armor extends BaseModifier_Plus {
    armor_reduction: number;
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
    Init(params: IModifierTable) {
        this.armor_reduction = this.GetSpecialValueFor("armor_reduction")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return -this.armor_reduction
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    G_PHYSICAL_ARMOR_BONUS() {
        return -this.armor_reduction
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// 永久提升攻击力
// Modifiers
@registerModifier()
export class modifier_clinkz_1_attacker_damage extends BaseModifier_Plus {
    permanent_bonus_damage: number;
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
    Init(params: IModifierTable) {
        this.permanent_bonus_damage = this.GetSpecialValueFor("permanent_bonus_damage")
        if (IsServer()) {
            this.IncrementStackCount()
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        return this.GetStackCount() * this.permanent_bonus_damage
    }
}
// // // // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_clinkz_1_particle extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_clinkz/clinkz_death_pact.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), false)
            ParticleManager.SetParticleControlEnt(particleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}
