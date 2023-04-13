
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function Desolate(attacker: IBaseNpc_Plus, target: IBaseNpc_Plus, ability: IBaseItem_Plus, modifier_name: string, duration: number) {
    if (!target.HasModifier(modifier_name)) {
        target.EmitSound("Item_Desolator.Target");
    }
    target.AddNewModifier(attacker, ability, modifier_name, {
        duration: duration * (1 - target.GetStatusResistance())
    });
}
// 枯萎之石
@registerAbility()
export class item_imba_blight_stone extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_blight_stone";
    }
}
@registerModifier()
export class modifier_item_imba_blight_stone extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            GFuncEntity.ChangeAttackProjectileImba(this.GetParentPlus());
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            GFuncEntity.ChangeAttackProjectileImba(this.GetParentPlus());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let owner = this.GetParentPlus();
            if (owner != keys.attacker) {
                return;
            }
            let target = keys.target;
            if (owner.IsIllusion()) {
                return;
            }
            if (target.HasModifier("modifier_item_imba_desolator_debuff") || target.HasModifier("modifier_item_imba_desolator_2_debuff")) {
                return;
            }
            let ability = this.GetItemPlus();
            Desolate(owner, target, ability, "modifier_item_imba_blight_stone_debuff", ability.GetSpecialValueFor("duration"));
        }
    }
}
@registerModifier()
export class modifier_item_imba_blight_stone_debuff extends BaseModifier_Plus {
    public armor_reduction: any;
    public vision_reduction: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let ability = this.GetItemPlus();
        if (!ability) {
            this.Destroy();
            return undefined;
        }
        this.armor_reduction = (-1) * ability.GetSpecialValueFor("armor_reduction");
        this.vision_reduction = (-1) * ability.GetSpecialValueFor("vision_reduction");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        return this.vision_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        return this.vision_reduction;
    }
}