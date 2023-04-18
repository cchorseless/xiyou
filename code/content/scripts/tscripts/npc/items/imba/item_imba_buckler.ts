import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 玄冥盾牌
@registerAbility()
export class item_imba_buckler extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_buckler_aura";
    }
}
@registerModifier()
export class modifier_item_imba_buckler_aura extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    armor: number;
    aura_radius: number;
    public Init(params?: IModifierTable): void {
        this.armor = this.GetSpecialValueFor("armor");
        this.aura_radius = this.GetSpecialValueFor("bonus_aoe_radius");
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
        return "modifier_item_imba_buckler_buff";
    }
}

@registerModifier()
export class modifier_item_imba_buckler_buff extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    bonus_aoe_armor: number;
    public Init(params?: IModifierTable): void {
        this.bonus_aoe_armor = this.GetSpecialValueFor("bonus_aoe_armor");
    }
}