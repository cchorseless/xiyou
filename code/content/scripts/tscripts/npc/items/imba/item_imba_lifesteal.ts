
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_lifesteal extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_lifesteal";
    }

}
@registerModifier()
export class modifier_item_imba_lifesteal extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public particle_lifesteal: any;
    public damage_bonus: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }

    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
                return
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.particle_lifesteal = "particles/generic_gameplay/generic_lifesteal.vpcf";
        if (this.ability) {
            this.damage_bonus = this.ability.GetSpecialValueFor("damage_bonus");
            if (IsServer()) {
                if (!this.caster.HasModifier("modifier_item_imba_lifesteal_unique")) {
                    this.caster.AddNewModifier(this.caster, this.ability, "modifier_item_imba_lifesteal_unique", {});
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    BeDestroy(): void {
        if (IsServer()) {
            if (this.caster && !this.caster.IsNull() && !this.caster.HasModifier("modifier_item_imba_lifesteal")) {
                this.caster.RemoveModifierByName("modifier_item_imba_lifesteal_unique");
            }
        }
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }



}

@registerModifier()
export class modifier_item_imba_lifesteal_unique extends BaseModifier_Plus {
    public lifesteal_pct: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    Init(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.lifesteal_pct = this.GetItemPlus().GetSpecialValueFor("lifesteal_pct");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    CC_PROJECTILE_NAME(k: any) {
        return ResHelper.EProjectileName.lifesteal;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.LIFESTEAL_PERCENTAGE)
    CC_LIFESTEAL_AMPLIFY_PERCENTAGE() {
        return this.lifesteal_pct;
    }
}
