
    import { AI_ability } from "../../../ai/AI_ability";
    import { GameFunc } from "../../../GameFunc";
    import { ResHelper } from "../../../helper/ResHelper";
    import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
    import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
    import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
    import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
    import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
    @registerAbility()
export class item_imba_javelin extends BaseItem_Plus {
GetIntrinsicModifierName():string {
    this.AddTimer(FrameTime(), () => {
        if (!this.IsNull()) {
            for (const [_, modifier] of ipairs(this.GetParentPlus().FindAllModifiersByName("modifier_item_imba_javelin"))) {
                modifier.SetStackCount(_);
            }
        }
    });
    return "modifier_item_imba_javelin";
}
}
@registerModifier()
export class modifier_item_imba_javelin extends BaseModifier_Plus {
public ability : IBaseItem_Plus; 
public parent : IBaseNpc_Plus; 
public bonus_damage : number; 
public bonus_range : number; 
public bonus_chance : number; 
public bonus_chance_damage : number; 
public pierce_proc : any; 
public pierce_records : any; 
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
BeCreated(p_0:any,):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    this.ability = this.GetItemPlus();
    this.parent = this.GetParentPlus();
    this.bonus_damage = this.ability.GetSpecialValueFor("bonus_damage");
    this.bonus_range = this.ability.GetSpecialValueFor("bonus_range");
    this.bonus_chance = this.ability.GetSpecialValueFor("bonus_chance");
    this.bonus_chance_damage = this.ability.GetSpecialValueFor("bonus_chance_damage");
    this.pierce_proc = false;
    this.pierce_records = {}
}
BeDestroy():void {
    if (!IsServer()) {
        return;
    }
    for (const [_, modifier] of ipairs(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
        modifier.SetStackCount(_);
    }
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
        3: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_MAGICAL,
        4: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
CC_GetModifierPreAttack_BonusDamage():number {
    return this.bonus_damage;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
CC_GetModifierAttackRangeBonus():number {
    if (!this.parent.IsRangedAttacker() && this.GetStackCount() == 1 && !this.GetParentPlus().HasItemInInventory("item_imba_maelstrom") && !this.GetParentPlus().HasItemInInventory("item_imba_mjollnir") && !this.GetParentPlus().HasItemInInventory("item_imba_jarnbjorn") && !this.GetParentPlus().HasItemInInventory("item_imba_monkey_king_bar")) {
        return this.bonus_range;
    }
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_MAGICAL)
CC_GetModifierProcAttack_BonusDamage_Magical(keys:ModifierAttackEvent):number {
    for (const [_, record] of ipairs(this.pierce_records)) {
        if (record == keys.record) {
            table.remove(this.pierce_records, _);
            if (!this.parent.IsIllusion() && !keys.target.IsBuilding()) {
                this.parent.EmitSound("DOTA_Item.MKB.proc");
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, keys.target, this.bonus_chance_damage, undefined);
                return this.bonus_chance_damage;
            }
        }
    }
}
@registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
CC_OnAttackRecord(keys:ModifierAttackEvent):void {
    if (keys.attacker == this.parent) {
        if (this.pierce_proc) {
            table.insert(this.pierce_records, keys.record);
            this.pierce_proc = false;
        }
        if ((!keys.target.IsMagicImmune() || this.GetName() == "modifier_item_imba_monkey_king_bar") && GFuncRandom.PRD(this.bonus_chance, )) {
            this.pierce_proc = true;
        }
    }
}
CheckState():Partial<Record<modifierstate,boolean>> {
    let state = {}
    if (this.pierce_proc) {
        state = {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
        }
    }
    return state;
}
}
@registerAbility()
export class item_imba_monkey_king_bar extends BaseItem_Plus {
GetIntrinsicModifierName():string {
    return "modifier_item_imba_monkey_king_bar";
}
}
