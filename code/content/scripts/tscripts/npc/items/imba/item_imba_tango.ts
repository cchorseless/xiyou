
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

function TangoCastFilterResult(ability: IBaseItem_Plus, target: IBaseNpc_Plus) {
    if (target == ability.GetCaster()) {
        return UnitFilterResult.UF_FAIL_CUSTOM;
    }
    if (target.IsIllusion()) {
        return UnitFilterResult.UF_FAIL_ILLUSION;
    }
    if (!IsServer()) {
        return;
    }
    if (target.IsOther()) {
        if (target.GetTeamNumber() != ability.GetCaster().GetTeamNumber() || target.GetOwner() == ability.GetCaster() || target.GetUnitName().includes("ward_base")) {
            return UnitFilterResult.UF_SUCCESS;
        } else {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
    }
    if (target.GetTeamNumber() != ability.GetCaster().GetTeamNumber()) {
        return UnitFilterResult.UF_FAIL_ENEMY;
    } else if (GFuncEntity.Custom_IsTree(target)) {
        return UnitFilterResult.UF_SUCCESS;
    } else if (target.IsConsideredHero() && !target.IsIllusion() && target.HasInventory() && target.GetTeamNumber() == ability.GetCaster().GetTeamNumber()) {
        return UnitFilterResult.UF_SUCCESS;
    }
    let unitFilter = UnitFilter(target, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags(), ability.GetCaster().GetTeamNumber());
    return unitFilter;
}
function CastErrorTarget(ability: IBaseItem_Plus, target: IBaseNpc_Plus) {
    if (target == ability.GetCaster()) {
        return "dota_hud_error_cant_cast_on_self";
    }
    if (target.IsOther()) {
        return "Can only eat your and the enemy's wards.";
    }
}
function UseTango(ability: IBaseItem_Plus) {
    let caster = ability.GetCaster();
    let target = ability.GetCursorTarget();
    let cast_sound = "DOTA_Item.Tango.Activate";
    let single_tango = "item_imba_tango_single";
    let orig_tango = "item_imba_tango";
    let modifier_tango = "modifier_imba_tango";
    let duration = ability.GetSpecialValueFor("duration");
    let ironwood_multiplier = ability.GetSpecialValueFor("ironwood_multiplier");
    let ward_multiplier = ability.GetSpecialValueFor("ward_multiplier");
    let ward_eat_cd = ability.GetSpecialValueFor("ward_eat_cd");
    let stacks = 1;
    let gave_tango = false;
    if (target.IsConsideredHero && target.IsConsideredHero()) {
        if (GFuncEntity.Custom_HasAnyAvailableInventorySpace(target)) {
            target.AddItemByName(single_tango);
        }
        else {
            let single_tango_item = BaseItem_Plus.CreateItem(single_tango, target.GetPlayerOwner(), undefined);
            CreateItemOnPositionSync(target.GetAbsOrigin(), single_tango_item);
        }
        if (ability.GetAbilityName() == single_tango) {
            ability.EndCooldown();
        }
        gave_tango = true;
    } else if (GFuncEntity.Custom_IsTree(target)) {
        if (GFuncEntity.Custom_IsTempTree(target)) {
            stacks = ironwood_multiplier;
            target.Kill();
        } else {
            (target as any as CDOTA_MapTree).CutDown(caster.GetTeamNumber());
        }
    } else {
        target.Kill(ability, caster);
        if (ability.GetAbilityName() == orig_tango) {
            ability.StartCooldown(ward_eat_cd);
            if (caster.HasItemInInventory(single_tango)) {
                caster.FindItemInInventory(single_tango).StartCooldown(ward_eat_cd);
            }
        }
        if (ability.GetAbilityName() == single_tango) {
            if (caster.HasItemInInventory(orig_tango)) {
                caster.FindItemInInventory(orig_tango).StartCooldown(ward_eat_cd);
            }
        }
        stacks = ward_multiplier;
    }
    if (!gave_tango) {
        EmitSoundOn(cast_sound, caster);
        if (caster.HasModifier(modifier_tango)) {
            let modifier = caster.FindModifierByName(modifier_tango);
            modifier.SetStackCount(modifier.GetStackCount() + stacks);
            modifier.ForceRefresh();
        } else {
            let modifier = caster.AddNewModifier(caster, ability, modifier_tango, {
                duration: duration
            });
            modifier.SetStackCount(stacks);
        }
    }
    ability.SpendCharge();
}

@registerAbility()
export class item_imba_tango extends BaseItem_Plus {
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        return TangoCastFilterResult(this, target);
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return CastErrorTarget(this, target);
    }
    OnSpellStart(): void {
        UseTango(this);
    }
}
@registerModifier()
export class modifier_imba_tango extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public parent: IBaseNpc_Plus;
    public hp_regen: any;
    public duration: number;
    public stack_table: number[];
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
            this.stack_table = []
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
            let item_time = this.stack_table[0];
            if (GameRules.GetGameTime() - item_time >= this.duration) {
                if (this.GetStackCount() == 1) {
                    this.Destroy();
                    return;
                } else {
                    this.stack_table.shift();
                    this.DecrementStackCount();
                    // if (this.parent.CalculateStatBonus) {
                    //     this.parent.CalculateStatBonus(true);
                    // }
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
            this.stack_table.push(GameRules.GetGameTime());
        }
    }
}
@registerAbility()
export class item_imba_tango_single extends BaseItem_Plus {
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        return TangoCastFilterResult(this, target);
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return CastErrorTarget(this, target);
    }
    OnSpellStart(): void {
        UseTango(this);
    }
}
