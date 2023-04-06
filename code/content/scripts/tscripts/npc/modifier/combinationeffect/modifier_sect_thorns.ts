import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_combination_effect } from "./modifier_combination_effect";

@registerModifier()
export class modifier_sect_thorns_base_a extends modifier_combination_effect {
    Init() {
        let thorns_pect = this.getSpecialData("thorns_pect")
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_thorns || { thorns_pect: 0 };
        t.thorns_pect += thorns_pect;
        parent.TempData().sect_thorns = t;
        modifier_sect_thorns_blade_mail_active.applyOnly(parent, parent)
    }

}
@registerModifier()
export class modifier_sect_thorns_base_b extends modifier_combination_effect {
    Init() {
        let thorns_pect = this.getSpecialData("thorns_pect")
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_thorns || { thorns_pect: 0 };
        t.thorns_pect += thorns_pect;
        parent.TempData().sect_thorns = t;
    }
}
@registerModifier()
export class modifier_sect_thorns_base_c extends modifier_sect_thorns_base_b {
}


@registerModifier()
export class modifier_sect_thorns_blade_mail_active extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/items_fx/blademail.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_blademail.vpcf";
    }
    thorns_pect: number;
    public Init(params?: IModifierTable): void {
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_thorns || { thorns_pect: 0 };
        this.thorns_pect = t.thorns_pect;
        if (IsServer()) {
            this.GetParentPlus().EmitSound("DOTA_Item.BladeMail.Activate");
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus() &&
            keys.attacker.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() &&
            bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) {
            if (!keys.unit.IsOther()) {
                EmitSoundOnClient("DOTA_Item.BladeMail.Damage", keys.attacker);
                let damageTable = {
                    victim: keys.attacker,
                    damage: keys.original_damage * this.thorns_pect * 0.01,
                    damage_type: keys.damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                    attacker: this.GetParentPlus(),
                }
                ApplyDamage(damageTable);
            }
        }
    }
}