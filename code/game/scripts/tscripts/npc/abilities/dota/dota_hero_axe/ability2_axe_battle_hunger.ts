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
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
/** dota原技能数据 */
export const Data_axe_battle_hunger = { "ID": "5008", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Axe.Battle_Hunger", "AbilityCastAnimation": "ACT_DOTA_OVERRIDE_ABILITY_2", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "20 15 10 5", "AbilityManaCost": "50 60 70 80", "AbilityCastRange": "700 775 850 925", "AbilityModifierSupportValue": "0.1", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "12.0" }, "02": { "var_type": "FIELD_INTEGER", "slow": "-12" }, "03": { "var_type": "FIELD_INTEGER", "speed_bonus": "12" }, "04": { "var_type": "FIELD_INTEGER", "damage_per_second": "16 24 32 40", "LinkedSpecialBonus": "special_bonus_unique_axe" }, "05": { "var_type": "FIELD_INTEGER", "damage_reduction_scepter": "30", "CalculateSpellDamageTooltip": "0", "RequiresScepter": "1" }, "06": { "var_type": "FIELD_INTEGER", "scepter_range": "400", "RequiresScepter": "1" } } };

@registerAbility()
export class ability2_axe_battle_hunger extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "axe_battle_hunger";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_axe_battle_hunger = Data_axe_battle_hunger;
    Init() {
        this.SetDefaultSpecialValue("radius", 800);
        this.SetDefaultSpecialValue("pure_damage_income", 7);
        this.SetDefaultSpecialValue("pure_duration", 5);
        this.SetDefaultSpecialValue("trigger_chance", [10, 12, 14, 16, 18, 20]);
        this.SetDefaultSpecialValue("chance_per_unit", [2.0, 2.2, 2.4, 2.6, 2.8, 3.0]);
        this.SetDefaultSpecialValue("str_damage_factor", [3, 4, 5, 7, 9, 13]);

    }




    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    CounterHelix() {
        let caster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let pure_duration = this.GetSpecialValueFor("pure_duration")
        let str_damage_factor = this.GetSpecialValueFor("str_damage_factor") + caster.GetTalentValue('special_bonus_unique_axe_custom_4')
        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_Axe.CounterHelix", caster))
        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST)
        for (let target of (targets)) {
            modifier_axe_2_pure_damage_income.apply(target, caster, this, { duration: pure_duration })
            let damage_table = {
                ability: this,
                victim: target,
                attacker: caster,
                damage: caster.GetStrength() * str_damage_factor,
                damage_type: this.GetAbilityDamageType(),
            }
            BattleHelper.GoApplyDamage(damage_table)
        }

        caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3)
    }
    OnSpellStart() {
        this.CounterHelix()
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_axe_2 extends BaseModifier_Plus {
    trigger_chance: number;
    chance_per_unit: number;
    radius: number;
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
        this.trigger_chance = this.GetSpecialValueFor("trigger_chance")
        this.chance_per_unit = this.GetSpecialValueFor("chance_per_unit")
        this.radius = this.GetSpecialValueFor("radius")
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

            let range = ability.GetSpecialValueFor("radius")
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
            let caster = params.attacker as BaseNpc_Plus
            let ability = this.GetAbilityPlus() as ability2_axe_battle_hunger
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), this.radius, null, teamFilter, typeFilter, flagFilter, order)
            let extar_trigger_chance = caster.HasTalent("special_bonus_unique_axe_custom_5") && caster.GetTalentValue("special_bonus_unique_axe_custom_5") || 0
            let chance = this.trigger_chance + extar_trigger_chance + targets.length * this.chance_per_unit
            if (GameFunc.mathUtil.PRD(chance, caster, "axe_2")) {
                ability.CounterHelix()
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_axe_2_pure_damage_income// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_axe_2_pure_damage_income extends BaseModifier_Plus {
    pure_damage_income: number;
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
    Init(params: ModifierTable) {
        this.pure_damage_income = this.GetSpecialValueFor("pure_damage_income") + this.GetCasterPlus().GetTalentValue('special_bonus_unique_axe_custom_8')
        if (IsServer()) {
            this.IncrementStackCount()
            this.addTimer(params.duration, () => {
                this.DecrementStackCount()
            })
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_PURE_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingPureDamagePercentage() {
        return this.pure_damage_income * this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.pure_damage_income * this.GetStackCount()
    }
}
