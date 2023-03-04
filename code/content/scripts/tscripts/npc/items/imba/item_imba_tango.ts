
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_tango extends BaseItem_Plus {
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        return TangoCastFilterResult(target);
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return CastErrorTarget(target);
    }
    OnSpellStart(): void {
        UseTango();
    }
}
@registerModifier()
export class modifier_imba_tango extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public parent: IBaseNpc_Plus;
    public hp_regen: any;
    public duration: number;
    public stack_table: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetTexture(): string {
        return "item_tango";
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        this.hp_regen = this.ability.GetSpecialValueFor("hp_regen");
        this.duration = this.ability.GetSpecialValueFor("duration");
        if (IsServer()) {
            this.stack_table = {}
            this.StartIntervalThink(1);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.hp_regen * this.GetStackCount();
    }
    GetEffectName(): string {
        return "particles/items_fx/healing_tango.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    OnIntervalThink(): void {
        let repeat_needed = true;
        while (repeat_needed) {
            let item_time = this.stack_table[1];
            if (GameRules.GetGameTime() - item_time >= this.duration) {
                if (this.GetStackCount() == 1) {
                    this.Destroy();
                    return;
                } else {
                    table.remove(this.stack_table, 1);
                    this.DecrementStackCount();
                    if (this.parent.CalculateStatBonus) {
                        this.parent.CalculateStatBonus(true);
                    }
                }
            } else {
                repeat_needed = false;
            }
        }
    }
    OnStackCountChanged(prev_stacks: number): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetStackCount();
        if (stacks > prev_stacks) {
            table.insert(this.stack_table, GameRules.GetGameTime());
        }
    }
}
@registerAbility()
export class item_imba_tango_single extends BaseItem_Plus {
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        return TangoCastFilterResult(target);
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return CastErrorTarget(target);
    }
    OnSpellStart(): void {
        UseTango();
    }
}
