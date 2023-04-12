
import { KVHelper } from "../../../helper/KVHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_aegis extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_aegis";
    }
}
@registerModifier()
export class modifier_item_imba_aegis extends BaseModifier_Plus {
    public reincarnate_time: number;
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetDuration(this.GetSpecialValueFor("disappear_time"), true);
        this.reincarnate_time = this.GetSpecialValueFor("reincarnate_time");
        this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_item_imba_aegis_pfx", {});
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.REINCARNATION,
            2: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */

    GetPriority(): modifierpriority {
        return 4;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.REINCARNATION)
    CC_ReincarnateTime(): number {
        if (IsServer()) {
        }
        return this.reincarnate_time;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() || keys.unit.GetCloneSource() == this.GetParentPlus()) {
            this.AddTimer(FrameTime(), () => {
                this.Destroy();
            });
        }
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let item = this.GetItemPlus();
        if (this.GetParentPlus().IsAlive()) {
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), undefined, "modifier_imba_regen_rune", {
                duration: KVHelper.GetItemData("item_imba_rune_regen", "RuneDuration", true)
            });
            this.GetParentPlus().EmitSound("Aegis.Expire");
            this.GetParentPlus().RemoveModifierByName("modifier_item_imba_aegis_pfx");
        }
        if (item) {
            // if (item.GetContainer) {
            //     UTIL_Remove(item.GetContainer());
            // }
            GFuncEntity.SafeDestroyItem(item);
        }
    }
}
@registerModifier()
export class modifier_item_imba_aegis_pfx extends BaseModifier_Plus {
    public reincarnate_time: number;
    public vision_radius: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_RESPAWN
        });
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        this.reincarnate_time = this.GetSpecialValueFor("reincarnate_time");
        this.vision_radius = this.GetSpecialValueFor("vision_radius");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_RESPAWN)
    CC_OnRespawn(keys: ModifierUnitEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus()) {
            this.PlayEffects();
            this.Destroy();
        }
    }
    PlayEffects() {
        if (!IsServer()) {
            return;
        }
        AddFOWViewer(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.vision_radius, this.reincarnate_time, false);
        let particle = ResHelper.CreateParticleEx("particles/items_fx/aegis_respawn_timer.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(particle, 1, Vector(0, 0, 0));
        ParticleManager.SetParticleControl(particle, 3, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle);
    }
}
