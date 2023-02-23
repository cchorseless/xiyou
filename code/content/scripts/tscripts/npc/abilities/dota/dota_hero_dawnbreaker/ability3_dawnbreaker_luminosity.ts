
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_dawnbreaker_luminosity = { "ID": "7918", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "AbilityCastAnimation": "ACT_DOTA_OVERRIDE_ABILITY_3", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "heal_radius": "650" }, "02": { "var_type": "FIELD_INTEGER", "heal_pct": "30 40 50 60" }, "03": { "var_type": "FIELD_INTEGER", "bonus_damage": "120 140 160 180" }, "04": { "var_type": "FIELD_INTEGER", "attack_count": "3" }, "05": { "var_type": "FIELD_FLOAT", "proc_cooldown": "0.00" }, "06": { "var_type": "FIELD_INTEGER", "heal_from_creeps": "50" }, "07": { "var_type": "FIELD_INTEGER", "allied_healing_pct": "35" } } };

@registerAbility()
export class ability3_dawnbreaker_luminosity extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dawnbreaker_luminosity";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dawnbreaker_luminosity = Data_dawnbreaker_luminosity;
    Init() {
        this.SetDefaultSpecialValue("heal_radius", 650);
        this.SetDefaultSpecialValue("heal_strength_pct", [15, 20, 25, 32, 40]);
        this.SetDefaultSpecialValue("bonus_damage_pct", [500, 550, 600, 650, 720]);
        this.SetDefaultSpecialValue("attack_count", 3);
        this.SetDefaultSpecialValue("heal_base", [500, 1000, 2000, 3500, 5000]);
        this.SetDefaultSpecialValue("temp_healing_duration", 7);

    }


    GetIntrinsicModifierName() {
        return "modifier_dawnbreaker_3_buff"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_dawnbreaker_3_buff extends BaseModifier_Plus {
    bonus_damage_pct: any;
    heal_radius: number;
    attack_count: number;
    temp_healing_duration: number;
    hasHeal: boolean;
    IsHidden() {
        let count = this.GetStackCount()
        if (count > 0) {
            return false
        } else {
            return true
        }
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


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE)
    CC_GetModifierCriticalStrike(params: IModifierTable) {
        return this.bonus_damage_pct
    }

    getAttack_count() {
        let attack_count = this.GetSpecialValueFor("attack_count")
        //  天赋 熠熠生辉需要攻击次数-1
        let parent = this.GetParentPlus()
        if (parent.HasTalent("special_bonus_unique_dawnbreaker_custom_6")) {
            let _heal = parent.GetTalentValue("special_bonus_unique_dawnbreaker_custom_6")
            attack_count = attack_count - _heal
        }
        return attack_count
    }

    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.SetStackCount(this.attack_count)
        }
    }
    Init(params: IModifierTable) {
        this.heal_radius = this.GetSpecialValueFor("heal_radius")
        this.bonus_damage_pct = 100
        this.attack_count = 0
        this.temp_healing_duration = this.GetSpecialValueFor("temp_healing_duration")
    }


    updateAttack_count(params: IModifierTable) {
        //  显示BUFF剩余攻击暴击次数
        if ((this.attack_count == this.getAttack_count())) {
            if (this.hasHeal == false) {
                //  治疗其他单位
                let ability = this.GetAbilityPlus()
                let caster = ability.GetCasterPlus()
                let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
                let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
                let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
                let order = FindOrder.FIND_ANY_ORDER
                let tTargets = AoiHelper.FindEntityInRadius(
                    caster.GetTeamNumber(),
                    caster.GetAbsOrigin(),
                    this.heal_radius,
                    null,
                    teamFilter,
                    typeFilter,
                    flagFilter,
                    order)
                for (let hTarget of (tTargets)) {
                    if (hTarget.GetBuilding) {
                        let hBuilding = hTarget.GetBuilding()
                        // let szname = hBuilding.GetUnitEntityName()
                        // let rare = DotaTD.GetCardRarity(szname)
                        // //  只能作用于自己的单位
                        // if (hTarget.GetPlayerOwnerID() == caster.GetPlayerOwnerID()) {
                        //     if (rare == "ssr" || rare == "sr") {
                        //          modifier_dawnbreaker_3_buff_heal.apply( hTarget , caster, ability, { duration = this.temp_healing_duration })
                        //     }
                        // }
                    }
                }
                this.hasHeal = true
            }
            this.bonus_damage_pct = this.GetSpecialValueFor("bonus_damage_pct")
        } else if (this.attack_count < this.getAttack_count()) {
            this.bonus_damage_pct = 100
            this.hasHeal = false
        } else {
            this.attack_count = 0
            this.bonus_damage_pct = 100
            this.hasHeal = false
        }
        this.SetStackCount(this.attack_count)
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
            //  没有不记录攻击次数的标记就+1
            if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)) {
                this.attack_count = this.attack_count + 1
            }
            this.updateAttack_count(params)
        }
    }
}

//  function modifier_dawnbreaker_3_buff:
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_dawnbreaker_3_buff_heal extends BaseModifier_Plus {
    temp_healing_duration: number;
    healthMax_add: any;
    heal_base: number;
    heal_strength_pct: number;
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

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus() {
        return this.healthMax_add
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_PERCENTAGE)
    CC_GetModifierHealthPercentage() {
        //  天赋  熠熠生辉治疗附带提升7%最大生命值的效果
        let caster = this.GetCasterPlus()
        if (caster.HasTalent("special_bonus_unique_dawnbreaker_custom_8")) {
            let _heal = caster.GetTalentValue("special_bonus_unique_dawnbreaker_custom_8")
            return _heal * this.GetStackCount()
        }
        return 0
    }

    healSelf() {
        if (IsServer()) {
            let caster = this.GetCasterPlus()
            let parent = this.GetParentPlus()
            let heal_result = this.heal_base + this.heal_strength_pct * caster.GetStrength()
            //  格外气血增加
            let healthMax_add = math.max(0, heal_result - caster.GetMaxHealth() + caster.GetHealth())
            //  治疗单位
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            let curHealth = math.min(heal_result + hParent.GetHealth(), hParent.GetMaxHealth())
            hParent.ModifyHealth(curHealth, hAbility, false, 0)
            this.SetStackCount(this.GetStackCount() + 1)
            //  增加格外气血
            this.healthMax_add = healthMax_add + this.healthMax_add
            //  过一段时间修改BUFF
            hParent.addTimer(this.temp_healing_duration,
                () => {
                    undefined
                    this.healthMax_add = this.healthMax_add - healthMax_add
                    let stackCount = math.max(this.GetStackCount() - 1, 0)
                    this.SetStackCount(stackCount)
                })

        }
    }

    BeCreated(params: IModifierTable) {

        this.healthMax_add = 0
        this.heal_strength_pct = this.GetSpecialValueFor("heal_strength_pct")
        this.heal_base = this.GetSpecialValueFor("heal_base")
        this.temp_healing_duration = this.GetSpecialValueFor("temp_healing_duration")
        this.healSelf()
    }

    BeRefresh(params: IModifierTable) {

        this.heal_strength_pct = this.GetSpecialValueFor("heal_strength_pct")
        this.heal_base = this.GetSpecialValueFor("heal_base")
        this.temp_healing_duration = this.GetSpecialValueFor("temp_healing_duration")
        this.healSelf()
    }


    BeDestroy() {

        this.healthMax_add = 0
        this.SetStackCount(0)
    }
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
}
