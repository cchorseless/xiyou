
    import { AI_ability } from "../../../ai/AI_ability";
    import { GameFunc } from "../../../GameFunc";
    import { ResHelper } from "../../../helper/ResHelper";
    import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
    import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
    import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
    import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
    import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
    @registerAbility()
export class item_imba_power_treads_2 extends BaseItem_Plus {
public state : any; 
public type : any; 
GetBehavior():DOTA_ABILITY_BEHAVIOR|Uint64 {
    return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET;
}
GetIntrinsicModifierName():string {
    return "modifier_imba_power_treads_2";
}
OnSpellStart():void {
    if (IsServer()) {
        let caster = this.GetCasterPlus();
        if (!caster.IsHero() || caster.IsClone()) {
            return;
        }
        let modifiers = caster.FindAllModifiersByName("modifier_imba_power_treads_2");
        for (const [_, modifier] of ipairs(modifiers)) {
            if (modifier.GetItemPlus() == this) {
                let state = modifier.GetStackCount();
                modifier.SetStackCount((state - 1 + Attributes.DOTA_ATTRIBUTE_MAX) % Attributes.DOTA_ATTRIBUTE_MAX);
                this.state = state;
                return;
            }
        }
        for (let i = 0; i <= 2; i += 1) {
            let mod = caster.FindModifierByName("modifier_imba_mega_treads_stat_multiplier_0" + i);
            if (mod) {
                caster.RemoveModifierByName("modifier_imba_mega_treads_stat_multiplier_0" + i);
            }
        }
        caster.CalculateStatBonus(true);
        this.type = this.GetCasterPlus().findBuffStack("modifier_imba_power_treads_2", this.GetCasterPlus());
    }
}
GetAbilityTextureName():string {
    if (IsClient()) {
        if (this.state) {
            return "imba_mega_treads_" + this.state;
        } else {
            return "imba_mega_treads_" + this.GetCasterPlus().findBuffStack("modifier_imba_power_treads_2", this.GetCasterPlus());
        }
    }
}
}
@registerModifier()
export class modifier_imba_power_treads_2 extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
GetAttributes():DOTAModifierAttribute_t {
    return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
}
/** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
        3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
        4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
        5: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
    }
    return Object.values(funcs);
} */
BeCreated(p_0:any,):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    if (IsServer()) {
        if (this.GetParentPlus().IsClone()) {
            return;
        }
        if (this.GetParentPlus().IsHero()) {
            let ability = this.GetItemPlus();
            let parent = this.GetParentPlus();
            if (parent.IsRealHero()) {
                this.StartIntervalThink(0.2);
            } else {
                this.AddTimer(FrameTime(), () => {
                    let ownerFinder = FindUnitsInRadius(parent.GetTeamNumber(), parent.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_DEAD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, hero] of ipairs(ownerFinder)) {
                        if (hero.GetName() == parent.GetName()) {
                            for (let i = 0; i <= 5; i += 1) {
                                let hero_item = hero.GetItemInSlot(i);
                                if (hero_item && hero_item.GetName() == "item_imba_power_treads_2") {
                                    let illusion_item = parent.GetItemInSlot(i);
                                    let ability = this.GetItemPlus();
                                    if (illusion_item != undefined && ability != undefined && illusion_item == ability) {
                                        let state = 0;
                                        if (hero_item.state != undefined) {
                                            state = (hero_item.state - 1 + Attributes.DOTA_ATTRIBUTE_MAX) % Attributes.DOTA_ATTRIBUTE_MAX;
                                        }
                                        illusion_item.state = state;
                                        this.SetStackCount(state);
                                        ability.state = state;
                                        let healthPcnt = hero.GetHealthPercent() / 100;
                                        let manaPcnt = hero.GetManaPercent() / 100;
                                        let maxHealth = parent.GetMaxHealth();
                                        let maxMana = parent.GetMaxMana();
                                        parent.SetHealth(maxHealth * healthPcnt);
                                        parent.SetMana(maxMana * manaPcnt);
                                        return;
                                    }
                                }
                            }
                            return;
                        }
                    }
                    this.StartIntervalThink(0.2);
                });
            }
        }
        if (this.GetItemPlus() && this.GetItemPlus().type) {
            this.SetStackCount(this.GetItemPlus().type);
        }
    }
    if (IsClient()) {
        this.StartIntervalThink(0.2);
    }
}
OnIntervalThink():void {
    if (IsClient()) {
        let state = this.GetStackCount();
        let ability = this.GetItemPlus();
        if (!ability) {
            return undefined;
        }
        ability.state = state;
    } else if (IsServer()) {
        let state = this.GetStackCount();
        let ability = this.GetItemPlus();
        let parent = this.GetParentPlus();
        if (!parent.IsRealHero()) {
            return;
        }
        if (!parent.HasModifier("modifier_imba_mega_treads_stat_multiplier_0" + state)) {
            parent.AddNewModifier(parent, ability, "modifier_imba_mega_treads_stat_multiplier_0" + state, {});
        }
    }
}
BeDestroy():void {
    if (IsServer()) {
        for (let i = 0; i <= 2; i += 1) {
            let parent = this.GetParentPlus();
            parent.RemoveModifierByName("modifier_imba_mega_treads_stat_multiplier_0" + i);
        }
    }
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE)
CC_GetModifierMoveSpeedBonus_Special_Boots():number {
    let ability = this.GetItemPlus();
    let speed_bonus = ability.GetSpecialValueFor("bonus_movement_speed");
    return speed_bonus;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
CC_GetModifierBonusStats_Strength():number {
    if (this.GetStackCount() != Attributes.DOTA_ATTRIBUTE_STRENGTH) {
        return;
    }
    let parent = this.GetParentPlus();
    if (!parent.IsHero() || parent.IsClone()) {
        return;
    }
    let ability = this.GetItemPlus();
    let stat_bonus = ability.GetSpecialValueFor("bonus_stat");
    return stat_bonus;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
CC_GetModifierBonusStats_Agility():number {
    if (this.GetStackCount() != Attributes.DOTA_ATTRIBUTE_AGILITY) {
        return;
    }
    let ability = this.GetItemPlus();
    let parent = this.GetParentPlus();
    if (!parent.IsHero() || parent.IsClone()) {
        return;
    }
    let stat_bonus = ability.GetSpecialValueFor("bonus_stat");
    return stat_bonus;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
CC_GetModifierBonusStats_Intellect():number {
    if (this.GetStackCount() != Attributes.DOTA_ATTRIBUTE_INTELLECT) {
        return;
    }
    let parent = this.GetParentPlus();
    if (!parent.IsHero() || parent.IsClone()) {
        return;
    }
    let ability = this.GetItemPlus();
    let stat_bonus = ability.GetSpecialValueFor("bonus_stat");
    return stat_bonus;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
CC_GetModifierAttackSpeedBonus_Constant():number {
    let ability = this.GetItemPlus();
    let bonus_attack_speed = ability.GetSpecialValueFor("bonus_attack_speed");
    return bonus_attack_speed;
}
}
@registerModifier()
export class modifier_imba_mega_treads_stat_multiplier_00 extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsDebuff():boolean {
    return false;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
/** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
    }
    return Object.values(funcs);
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
CC_GetModifierStatusResistanceStacking():number {
    return this.GetItemPlus().GetSpecialValueFor("str_mode_tenacity");
}
}
@registerModifier()
export class modifier_imba_mega_treads_stat_multiplier_01 extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsDebuff():boolean {
    return false;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
/** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT
    }
    return Object.values(funcs);
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
CC_GetModifierEvasion_Constant(p_0:ModifierAttackEvent,):number {
    return this.GetItemPlus().GetSpecialValueFor("agi_mode_evasion");
}
}
@registerModifier()
export class modifier_imba_mega_treads_stat_multiplier_02 extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsDebuff():boolean {
    return false;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
/** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING
    }
    return Object.values(funcs);
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING)
CC_GetModifierCastRangeBonusStacking(p_0:ModifierAbilityEvent,):number {
    return this.GetItemPlus().GetSpecialValueFor("int_mode_cast_range");
}
}
