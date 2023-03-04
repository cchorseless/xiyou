
    import { AI_ability } from "../../../ai/AI_ability";
    import { GameFunc } from "../../../GameFunc";
    import { ResHelper } from "../../../helper/ResHelper";
    import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
    import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
    import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
    import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
    import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
    @registerAbility()
export class item_imba_moon_shard extends BaseItem_Plus {
GetIntrinsicModifierName():string {
    return "modifier_item_imba_moon_shard";
}
OnSpellStart():void {
    let caster = this.GetCasterPlus();
    if (caster.IsTempestDouble()) {
        return;
    }
    let pos = caster.GetAbsOrigin();
    let target = this.GetCursorTarget();
    let current_stacks = this.GetCurrentCharges();
    if (target) {
        if (target.IsTempestDouble()) {
            target = undefined;
        }
        EmitSoundOnClient("Item.MoonShard.Consume", caster.GetPlayerOwner());
        if (target != caster) {
            EmitSoundOnClient("Item.MoonShard.Consume", target.GetPlayerOwner());
        }
        let moon_buff = target.findBuff<modifier_item_imba_moon_shard_active>("modifier_item_imba_moon_shard_active");
        if (moon_buff) {
            moon_buff.SetStackCount(moon_buff.GetStackCount() + 1);
        } else {
            moon_buff = target.AddNewModifier(caster,this, "modifier_item_imba_moon_shard_active", {});
            moon_buff.SetStackCount(1);
        }
        if (current_stacks > 1) {
            this.SetCurrentCharges(current_stacks - 1);
        } else {
            caster.RemoveItem();
        }
    } else {
        EmitSoundOn("Item.DropWorld", caster);
        let moon = CreateItem("item_imba_moon_shard", caster, caster);
        CreateItemOnPositionSync(pos, moon);
        moon.SetPurchaser(caster);
        moon.SetPurchaseTime(this.GetPurchaseTime());
        if (current_stacks > 1) {
            this.SetCurrentCharges(current_stacks - 1);
        } else {
            caster.RemoveItem();
        }
    }
}
}
@registerModifier()
export class modifier_item_imba_moon_shard extends BaseModifier_Plus {
IsHidden():boolean {
    return false;
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
BeCreated(p_0:any,):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    if (!IsServer()) {
        return;
    }
    this.StartIntervalThink(0.2);
}
OnIntervalThink():void {
    if (!IsServer()) {
        return;
    }
    let ability = this.GetItemPlus();
    let caster = this.GetCasterPlus();
    let stack = ability.GetCurrentCharges();
    let empty_slot = 0;
    for (let i = 0; i <= 5; i += 1) {
        let item = caster.GetItemInSlot(i);
        if (!item || item.GetAbilityName() == ability.GetAbilityName()) {
            empty_slot = empty_slot + 1;
        }
    }
    if (empty_slot < stack) {
        stack = empty_slot;
    }
    this.SetStackCount(stack);
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
        2: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
CC_GetModifierAttackSpeedBonus_Constant():number {
    if (this.GetItemPlus()) {
        return this.GetStackCount() * this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
    }
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
CC_GetBonusNightVision():number {
    if (this.GetItemPlus()) {
        return this.GetItemPlus().GetSpecialValueFor("bonus_night_vision");
    }
}
}
@registerModifier()
export class modifier_item_imba_moon_shard_active extends BaseModifier_Plus {
public consume_as_1 : any; 
public consume_vision_1 : any; 
public consume_as_2 : any; 
public consume_vision_2 : any; 
public consume_as_3 : any; 
IsHidden():boolean {
    return false;
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
GetTexture():string {
    return "item_moon_shard";
}
BeCreated(p_0:any,):void {
    if (IsServer()) {
        if (!this.GetItemPlus()) {
            this.Destroy();
        }
    }
    if (this.GetItemPlus()) {
        this.consume_as_1 = this.GetItemPlus().GetSpecialValueFor("consume_as_1");
        this.consume_vision_1 = this.GetItemPlus().GetSpecialValueFor("consume_vision_1");
        this.consume_as_2 = this.GetItemPlus().GetSpecialValueFor("consume_as_2");
        this.consume_vision_2 = this.GetItemPlus().GetSpecialValueFor("consume_vision_2");
        this.consume_as_3 = this.GetItemPlus().GetSpecialValueFor("consume_as_3");
    } else {
        this.consume_as_1 = 70;
        this.consume_vision_1 = 250;
        this.consume_as_2 = 50;
        this.consume_vision_2 = 150;
        this.consume_as_3 = 30;
    }
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
        2: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
CC_GetModifierAttackSpeedBonus_Constant():number {
    if (this.GetStackCount() == 1 && this.consume_as_1) {
        return this.consume_as_1;
    } else if (this.GetStackCount() == 2 && this.consume_as_1 && this.consume_as_2) {
        return this.consume_as_1 + this.consume_as_2;
    } else if (this.consume_as_1 && this.consume_as_2 && this.consume_as_3) {
        return this.consume_as_1 + this.consume_as_2 + (this.GetStackCount() - 2) * this.consume_as_3;
    }
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
CC_GetBonusNightVision():number {
    if (this.GetStackCount() == 1 && this.consume_vision_1) {
        return this.consume_vision_1;
    } else if (this.consume_vision_1 && this.consume_vision_2) {
        return this.consume_vision_1 + this.consume_vision_2;
    }
}
}
