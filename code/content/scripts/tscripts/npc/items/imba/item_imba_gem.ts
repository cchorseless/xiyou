
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_gem extends BaseItem_Plus {
    dummy_unit: IBaseNpc_Plus;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_gem_of_true_sight";
    }
    OnItemEquipped(hItem: CDOTA_Item): void {
        if (hItem == this) {
            if (this.dummy_unit && IsValidEntity(this.dummy_unit) && this.dummy_unit.HasModifier("modifier_item_imba_gem_of_true_sight_dropped")) {
                this.dummy_unit.RemoveModifierByName("modifier_item_imba_gem_of_true_sight_dropped");
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_gem_of_true_sight extends BaseModifier_Plus {
    public radius: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetModifierAura(): string {
        return "modifier_truesight";
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER;
    }
    GetAuraDuration(): number {
        return 0.5;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().IsCourier() || (this.GetParentPlus().IsConsideredHero() && !this.GetParentPlus().IsRealUnit())) {
            this.GetParentPlus().RemoveModifierByName("modifier_item_imba_gem_of_true_sight");
            return;
        }
        if (params.radius) {
            this.radius = params.radius;
        } else {
            this.radius = this.GetItemPlus().GetSpecialValueFor("radius");
        }
    }
    DropGem() {
        // if (this.GetParentPlus().IsFakeHero()) {
        //     return;
        // }
        if (!this.GetItemPlus() || (this.GetItemPlus() && this.GetItemPlus().GetAbilityName() != "item_imba_gem")) {
            return;
        }
        let pos = this.GetCasterPlus().GetAbsOrigin();
        if (this.GetItemPlus().GetContainer) {
            if (this.GetItemPlus().GetContainer()) {
                if (this.GetItemPlus().GetContainer().GetAbsOrigin) {
                    if (this.GetItemPlus().GetContainer().GetAbsOrigin()) {
                        pos = this.GetItemPlus().GetContainer().GetAbsOrigin();
                    }
                }
            }
        }
        let item = this.GetItemPlus<item_imba_gem>();
        if (!this.GetParentPlus().IsRealUnit()) {
            this.GetParentPlus().DropItem(item, true);
            item.dummy_unit = this.GetCasterPlus().CreateDummyUnit(pos, -1, true);
            item.dummy_unit.AddNewModifier(this.GetCasterPlus(), item, "modifier_item_imba_gem_of_true_sight_dropped", {});
            return;
        }
        if (!this.GetParentPlus().IsReincarnating()) {
            this.GetParentPlus().DropItem(this.GetItemPlus(), true);
            item.dummy_unit = this.GetCasterPlus().CreateDummyUnit(pos, -1, true);
            item.dummy_unit.AddNewModifier(this.GetCasterPlus(), item, "modifier_item_imba_gem_of_true_sight_dropped", {});
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (params.unit == this.GetParentPlus()) {
            this.DropGem();
        }
    }
    BeRemoved(): void {
        if (!IsServer()) {
            return;
        }
        this.DropGem();
    }
}
@registerModifier()
export class modifier_item_imba_gem_of_true_sight_dropped extends BaseModifier_Plus {
    public pfx: any;
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_FLYING]: true
        };
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().SetDayTimeVisionRange(this.GetItemPlus().GetSpecialValueFor("dropped_radius"));
        this.GetParentPlus().SetNightTimeVisionRange(this.GetItemPlus().GetSpecialValueFor("dropped_radius"));
        this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_gem_of_true_sight", {
            radius: this.GetItemPlus().GetSpecialValueFor("dropped_radius")
        });
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        let item_is_on_ground = false;
        for (const item of (Entities.FindAllByClassname("dota_item_drop") as IBaseItem_Plus[])) {
            if (item == this.GetItemPlus()) {
                item_is_on_ground = true;
                return;
            }
        }
        if (item_is_on_ground == false) {
            this.StartIntervalThink(-1);
            if (this.GetParentPlus()) {
                this.GetParentPlus().RemoveModifierByName("modifier_item_imba_gem_of_true_sight_dropped");
            }
        } else {
            if (!this.pfx) {
                this.pfx = ParticleManager.CreateParticleForTeam("particles/items_fx/gem_truesight_aura.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus(), this.GetParentPlus().GetTeam());
                ParticleManager.SetParticleControl(this.pfx, 0, this.GetParentPlus().GetAbsOrigin());
                ParticleManager.SetParticleControl(this.pfx, 1, Vector(this.GetItemPlus().GetSpecialValueFor("dropped_radius"), 0, 0));
            }
        }
    }
    BeRemoved(): void {
        if (!IsServer()) {
            return;
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
        if (this.GetParentPlus()) {
            GFuncEntity.SafeDestroyUnit(this.GetParentPlus());
        }
    }
}
