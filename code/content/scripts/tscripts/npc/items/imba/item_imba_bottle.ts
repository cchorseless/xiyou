
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_bottle extends BaseItem_Plus {
    public RuneStorage: string;
    bottle_icon: number;
    texture_name: string;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_bottle_texture_controller";
    }
    SetCurrentCharges(charges: number): void {
        return super.SetCurrentCharges(charges);
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        if (this.RuneStorage) {
            // ImbaRunes.PickupRune(this.RuneStorage, caster, true);
            this.SetCurrentCharges(3);
            this.RuneStorage = undefined;
        } else {
            let charges = this.GetCurrentCharges();
            if (charges > 0) {
                caster.AddNewModifier(caster, this, "modifier_item_imba_bottle_heal", {
                    duration: this.GetSpecialValueFor("restore_time")
                });
                this.SetCurrentCharges(charges - 1);
                caster.EmitSound("Bottle.Drink");
            }
        }
    }
    SetStorageRune(type: string) {
        // if (this.GetCasterPlus().GetPlayerID && IMBA_COMBAT_EVENTS == true) {
        //     CustomGameEventManager.Send_ServerToTeam(this.GetCasterPlus().GetTeam(), "create_custom_toast", {
        //         type: "generic",
        //         text: "#custom_toast_BottledRune",
        //         player: this.GetCasterPlus().GetPlayerID(),
        //         runeType: type
        //     });
        // }
        this.RuneStorage = type;
        this.SetCurrentCharges(3);
        this.GetCasterPlus().EmitSound("Bottle.Cork");
    }
    GetAbilityTextureName(): string {
        let texture = "bottle_0_3";
        texture = this.texture_name || texture;
        return texture;
    }
}
@registerModifier()
export class modifier_item_imba_bottle_texture_controller extends BaseModifier_Plus {
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
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetItemPlus(), "modifier_item_imba_bottle_texture_controller_2", {});
        }
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        let item = this.GetItemPlus<item_imba_bottle>();
        let rune_table: { [k: string]: string } = {
            1: tostring(item.bottle_icon) + "_0",
            2: tostring(item.bottle_icon) + "_1",
            3: tostring(item.bottle_icon) + "_2",
            4: tostring(item.bottle_icon) + "_3",
            "5": "arcane",
            "6": "double_damage",
            "7": "haste",
            "8": "regeneration",
            "9": "illusion",
            "10": "invisibility",
            "11": "frost",
            "12": "bounty"
        }
        if (IsServer()) {
            if (this.GetItemPlus().IsCooldownReady() && this.GetParentPlus().HasModifier("modifier_fountain_aura_effect_lua")) {
                this.GetItemPlus().SetCurrentCharges(3);
            }
            let stack = this.GetItemPlus().GetCurrentCharges() + 1;
            for (let i = 5; i <= 12; i++) {
                if (item.RuneStorage == rune_table[i + ""]) {
                    stack = i;
                    return;
                }
            }
            this.SetStackCount(stack);
        }
        if (this.GetStackCount() >= 1 && this.GetStackCount() <= 4) {
            item.texture_name = "bottle_" + rune_table[this.GetStackCount()];
        } else {
            item.texture_name = "bottle_rune_" + rune_table[this.GetStackCount()];
        }
    }
    BeDestroy(): void {
        if (this.GetParentPlus().HasModifier("modifier_item_imba_bottle_texture_controller_2")) {
            this.GetParentPlus().RemoveModifierByName("modifier_item_imba_bottle_texture_controller_2");
        }
    }
}
@registerModifier()
export class modifier_item_imba_bottle_texture_controller_2 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
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
        if (this.GetParentPlus().TempData().bottle_icon) {
            this.SetStackCount(this.GetParentPlus().TempData().bottle_icon);
            this.GetItemPlus<item_imba_bottle>().bottle_icon = this.GetStackCount();
        }
        if (IsClient()) {
            this.GetItemPlus<item_imba_bottle>().bottle_icon = this.GetStackCount();
        }
    }
}
@registerModifier()
export class modifier_item_imba_bottle_heal extends BaseModifier_Plus {
    public health_restore: any;
    public mana_restore: any;
    public pfx: any;
    GetTexture() {
        return "bottle_0_3";
    }
    IsPurgable() {
        return false;
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT
        });
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.health_restore = this.GetItemPlus().GetSpecialValueFor("health_restore") / this.GetItemPlus().GetSpecialValueFor("restore_time");
        this.mana_restore = this.GetItemPlus().GetSpecialValueFor("mana_restore") / this.GetItemPlus().GetSpecialValueFor("restore_time");
        if (!IsServer()) {
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/items_fx/bottle.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.health_restore;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.mana_restore;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(this.pfx, false);
        ParticleManager.ReleaseParticleIndex(this.pfx);
    }
}
