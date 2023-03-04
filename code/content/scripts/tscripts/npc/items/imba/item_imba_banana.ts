
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_banana extends BaseItem_Plus {
    OnSpellStart(): void {
        this.GetCursorTarget().EmitSound("DOTA_Imba_Item.Banana.Cast");
        this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_banana", {});
        // if (this.GetCursorTarget().CalculateStatBonus(true)) {
        //     this.GetCursorTarget().CalculateStatBonus(true);
        // }
        CreateModifierThinker(this.GetCasterPlus(), this, "modifier_item_imba_banana_thinker", {
            duration: this.GetSpecialValueFor("banana_duration")
        }, this.GetCasterPlus().GetAbsOrigin() + (this.GetCasterPlus().GetForwardVector() * (-1) * this.GetSpecialValueFor("banana_drop_distance")) as Vector, this.GetCasterPlus().GetTeamNumber(), false);
        this.SetCurrentCharges(math.max(this.GetCurrentCharges() - 1, 0));
        if (this.GetCurrentCharges() <= 0) {
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_item_imba_banana extends BaseModifier_Plus {
    public int_gain: any;
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetTexture(): string {
        return "item_banana";
    }
    Init(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (this.GetItemPlus()) {
            this.int_gain = this.GetItemPlus().GetSpecialValueFor("int_gain");
        } else {
            this.int_gain = 4;
        }
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.int_gain * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_item_imba_banana_thinker extends BaseModifier_Plus {
    public banana_peel_radius: number;
    public banana_flying_vision: any;
    public think_interval: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.banana_peel_radius = this.GetItemPlus().GetSpecialValueFor("banana_peel_radius");
        this.banana_flying_vision = this.GetItemPlus().GetSpecialValueFor("banana_flying_vision");
        if (!IsServer()) {
            return;
        }
        this.think_interval = 1;
        this.StartIntervalThink(this.think_interval);
    }
    OnIntervalThink(): void {
        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.banana_flying_vision, this.think_interval, false);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModifierModelChange(): string {
        return "models/props_gameplay/banana_prop_open.vmdl";
    }
    IsHidden(): boolean {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraDuration(): number {
        return 0.1;
    }
    GetAuraRadius(): number {
        return this.banana_peel_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_item_imba_banana_thinker_aura";
    }
    GetAuraEntityReject(hTarget: CDOTA_BaseNPC): boolean {
        return hTarget.HasModifier("modifier_item_imba_banana_stun");
    }
}
@registerModifier()
export class modifier_item_imba_banana_thinker_aura extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_banana_stun", {
            duration: 1
        });
        this.GetAuraOwner().AddNoDraw();
        this.GetAuraOwner().ForceKill(false);
    }
}
@registerModifier()
export class modifier_item_imba_banana_stun extends BaseModifier_Plus {
    public banana_slide_duration: number;
    public banana_peel_radius: number;
    public banana_slide_distance: number;
    public banana_directional_changes: any;
    public counter: number;
    public change_time: number;
    public interval: number;
    public direction: any;
    IgnoreTenacity() {
        return true;
    }
    GetTexture(): string {
        return "item_banana";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        this.banana_slide_duration = 1;
        this.banana_peel_radius = 100;
        this.banana_slide_distance = 400;
        this.banana_directional_changes = 4;
        this.counter = 0;
        this.change_time = this.banana_slide_duration / this.banana_directional_changes;
        this.interval = FrameTime();
        this.direction = RandomVector(1);
        this.GetParentPlus().EmitSound("DOTA_Imba_Item.Banana.Slip");
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        this.GetParentPlus().SetAbsOrigin(this.GetParentPlus().GetAbsOrigin() + (this.direction * this.interval * this.banana_slide_distance) as Vector);
        GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), this.banana_peel_radius, true);
        this.counter = this.counter + this.interval;
        if (this.counter >= this.change_time) {
            this.direction = RandomVector(1);
            this.counter = 0;
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        FindClearSpaceForUnit(this.GetParentPlus(), this.GetParentPlus().GetAbsOrigin(), false);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
}
