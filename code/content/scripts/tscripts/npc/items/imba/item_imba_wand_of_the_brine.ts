
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_wand_of_the_brine extends BaseItem_Plus {
    public bubble_duration: number;
    OnSpellStart(): void {
        if (IsServer()) {
            this.bubble_duration = this.GetSpecialValueFor("bubble_duration");
            let hTarget = this.GetCursorTarget();
            hTarget.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_wand_of_the_brine_bubble", {
                duration: this.bubble_duration
            });
            hTarget.Purge(false, true, false, true, true);
            EmitSoundOn("DOTA_Item.GhostScepter.Activate", this.GetCasterPlus());
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_wand_of_the_brine";
    }
}
@registerModifier()
export class modifier_item_imba_wand_of_the_brine_bubble extends BaseModifier_Plus {
    public bubble_heal_per_tick: any;
    public heal_tick_interval: number;
    public nFXIndex: any;
    BeCreated(kv: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            this.bubble_heal_per_tick = this.GetItemPlus().GetSpecialValueFor("bubble_heal_per_tick");
            this.heal_tick_interval = this.GetItemPlus().GetSpecialValueFor("heal_tick_interval");
            this.nFXIndex = ResHelper.CreateParticleEx("particles/item/wand_of_the_brine/wand_of_the_brine_bubble.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
            ParticleManager.SetParticleControlEnt(this.nFXIndex, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetOrigin(), true);
            ParticleManager.SetParticleControl(this.nFXIndex, 1, Vector(2.5, 2.5, 2.5));
            this.StartIntervalThink(this.heal_tick_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.GetParentPlus().Heal(this.bubble_heal_per_tick, this.GetItemPlus());
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, this.GetParentPlus(), this.bubble_heal_per_tick, undefined);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {}
        if (IsServer()) {
            state[modifierstate.MODIFIER_STATE_STUNNED] = true;
            state[modifierstate.MODIFIER_STATE_ROOTED] = true;
            state[modifierstate.MODIFIER_STATE_DISARMED] = true;
            state[modifierstate.MODIFIER_STATE_OUT_OF_GAME] = true;
            state[modifierstate.MODIFIER_STATE_MAGIC_IMMUNE] = true;
            state[modifierstate.MODIFIER_STATE_INVULNERABLE] = true;
            state[modifierstate.MODIFIER_STATE_OUT_OF_GAME] = true;
            state[modifierstate.MODIFIER_STATE_UNSELECTABLE] = true;
            state[modifierstate.MODIFIER_STATE_NO_HEALTH_BAR] = true;
        }
        return state;
    }
    BeDestroy(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.nFXIndex, false);
        }
    }
}
@registerModifier()
export class modifier_item_imba_wand_of_the_brine extends BaseModifier_Plus {
    public bonus_intelligence: number;
    public bonus_mana_regen_pct: number;
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
    BeCreated(kv: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.bonus_intelligence = this.GetItemPlus().GetSpecialValueFor("bonus_intelligence");
        this.bonus_mana_regen_pct = this.GetItemPlus().GetSpecialValueFor("bonus_mana_regen_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect( /** params */): number {
        return this.bonus_intelligence;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE)
    CC_GetModifierTotalPercentageManaRegen( /** params */): number {
        return (this.bonus_mana_regen_pct - 100) / 100;
    }
}
