
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 秘法鞋
@registerAbility()
export class item_imba_arcane_boots extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_arcane_boots";
    }
    OnAbilityPhaseStart(): boolean {
        if (this.GetCasterPlus().IsClone()) {
            return false;
        }
        return true;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let replenish_mana = this.GetSpecialValueFor("base_replenish_mana") + this.GetSpecialValueFor("replenish_mana_pct") * this.GetCasterPlus().GetMaxMana() * 0.01;
            let replenish_radius = this.GetSpecialValueFor("replenish_radius");
            this.GetCasterPlus().EmitSound("DOTA_Item.ArcaneBoots.Activate");
            let arcane_pfx = ResHelper.CreateParticleEx("particles/items_fx/arcane_boots.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.ReleaseParticleIndex(arcane_pfx);
            let nearby_allies = FindUnitsInRadius(this.GetCasterPlus().GetTeam(), this.GetCasterPlus().GetAbsOrigin(), undefined, replenish_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MANA_ONLY, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, ally] of GameFunc.iPair(nearby_allies)) {
                ally.GiveMana(replenish_mana);
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MANA_ADD, ally, replenish_mana, undefined);
                let arcane_target_pfx = ResHelper.CreateParticleEx("particles/items_fx/arcane_boots_recipient.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ally);
                ParticleManager.ReleaseParticleIndex(arcane_target_pfx);
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_arcane_boots extends BaseModifier_Plus {
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
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE)
    CC_GetModifierMoveSpeedBonus_Special_Boots(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_ms");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_mana");
        }
    }
}
