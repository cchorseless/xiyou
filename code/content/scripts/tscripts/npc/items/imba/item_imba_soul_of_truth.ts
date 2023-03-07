
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { item_imba_gem } from "./item_imba_gem";
@registerAbility()
export class item_imba_soul_of_truth extends BaseItem_Plus {
    GetAbilityTextureName(): string {
        return "imba_soul_of_truth";
    }
    CastFilterResult(): UnitFilterResult {
        if (this.GetCasterPlus().HasModifier("modifier_imba_soul_of_truth_buff")) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
    }
    GetCustomCastError(): string {
        if (this.GetCasterPlus().HasModifier("modifier_imba_soul_of_truth_buff")) {
            return "#dota_hud_error_soul_of_truth_already_active";
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus();
            let duration = this.GetSpecialValueFor("duration");
            hCaster.AddNewModifier(hCaster, this, "modifier_imba_soul_of_truth_buff", {
                duration: duration
            });
            hCaster.AddNewModifier(hCaster, this, "modifier_item_imba_gem_of_true_sight", {
                duration: duration
            });
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_soul_of_truth_buff extends BaseModifier_Plus {
    public radius: number;
    public armor: any;
    public health_regen: any;
    public eye_pfx: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let hItem = this.GetItemPlus();
        if (hItem) {
            this.radius = hItem.GetSpecialValueFor("radius");
            this.armor = hItem.GetSpecialValueFor("armor");
            this.health_regen = hItem.GetSpecialValueFor("health_regen");
        } else if (!this.GetParentPlus().IsRealUnit()) {
            let main_hero = this.GetParentPlus().GetOwnerPlus();
            let main_hero_modifier = main_hero.FindModifierByName(this.GetName()) as modifier_imba_soul_of_truth_buff;
            if (main_hero && main_hero_modifier) {
                this.radius = main_hero_modifier.radius;
                this.armor = main_hero_modifier.armor;
                this.health_regen = main_hero_modifier.health_regen;
            }
        }
        this.eye_pfx = ResHelper.CreateParticleEx("particles/item/soul_of_truth/soul_of_truth_overhead.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        this.AddParticle(this.eye_pfx, false, false, modifierpriority.MODIFIER_PRIORITY_HIGH, false, false);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH,
            2: Enum_MODIFIER_EVENT.ON_RESPAWN
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if ((keys.unit == this.GetParentPlus()) /**&& (!keys.reincarnate)*/) {
            if (keys.unit.IsTempestDouble() && keys.attacker == keys.unit) {
                return;
            }
            if (this.eye_pfx) {
                ParticleManager.DestroyParticle(this.eye_pfx, false);
                ParticleManager.ReleaseParticleIndex(this.eye_pfx);
                this.eye_pfx = undefined;
                this.Destroy();
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let gem = BaseItem_Plus.CreateItem("item_imba_gem", undefined, undefined) as item_imba_gem;
            gem.SetOwner(undefined);
            CreateItemOnPositionSync(this.GetParentPlus().GetAbsOrigin(), gem);
            gem.dummy_unit = BaseNpc_Plus.CreateUnitByName("npc_dummy_unit_perma", this.GetParentPlus().GetAbsOrigin(), this.GetCasterPlus(), true);
            gem.dummy_unit.AddNewModifier(this.GetCasterPlus(), gem, "modifier_item_imba_gem_of_true_sight_dropped", {});
        }
    }
    GetTexture(): string {
        return "imba_soul_of_truth";
    }
}
