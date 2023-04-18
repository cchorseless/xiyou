import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 恢复头巾
@registerAbility()
export class item_imba_headdress extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_headdress";
    }
}
@registerModifier()
export class modifier_item_imba_headdress extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    health_regen: number;
    aura_radius: number;
    public Init(params?: IModifierTable): void {
        this.health_regen = this.GetSpecialValueFor("health_regen");
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
        return "modifier_item_imba_headdress_aura";
    }
}

@registerModifier()
export class modifier_item_imba_headdress_aura extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    aura_health_regen: number;
    public Init(params?: IModifierTable): void {
        this.aura_health_regen = this.GetSpecialValueFor("aura_health_regen");

    }
}