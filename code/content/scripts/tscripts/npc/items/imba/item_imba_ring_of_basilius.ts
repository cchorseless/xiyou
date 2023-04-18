import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 王者之戒
@registerAbility()
export class item_imba_ring_of_basilius extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_ring_of_basilius";
    }
}
@registerModifier()
export class modifier_item_imba_ring_of_basilius extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    mana_regen: number;
    aura_radius: number;
    public Init(params?: IModifierTable): void {
        this.mana_regen = this.GetSpecialValueFor("mana_regen");
        this.aura_radius = this.GetSpecialValueFor("aura_radius");

    }
    IsAura(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.aura_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_item_imba_ring_of_basilius_aura";
    }
}

@registerModifier()
export class modifier_item_imba_ring_of_basilius_aura extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    aura_mana_regen: number;
    public Init(params?: IModifierTable): void {
        this.aura_mana_regen = this.GetSpecialValueFor("aura_mana_regen");

    }
}