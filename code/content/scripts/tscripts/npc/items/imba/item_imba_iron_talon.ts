
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_iron_talon extends BaseItem_Plus {
    hunt_stacks: number;
    CastFilterResultTarget(hTarget: IBaseNpc_Plus): UnitFilterResult {
        if (!IsServer()) {
            return;
        }
        if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            if ((hTarget.IsCreep() || (hTarget.IsOther() && (hTarget.GetClassname() == ("npc_dota_ward_base") || hTarget.GetClassname() == ("npc_dota_techies_mines")))) && !hTarget.IsRoshan()) {
                return UnitFilterResult.UF_SUCCESS;
            } else if (hTarget.IsOther() && !(hTarget.GetClassname().includes("ward_base") || hTarget.GetClassname() == ("npc_dota_techies_mines"))) {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
        }
        let nResult = UnitFilter(hTarget, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
        return nResult;
    }
    GetCustomCastErrorTarget(hTarget: CDOTA_BaseNPC): string {
        if (!IsServer()) {
            return;
        }
        if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            if (hTarget.IsOther() && !(hTarget.GetClassname().includes("npc_dota_ward_base") || hTarget.GetClassname().includes("npc_dota_techies_mines"))) {
                return "Ability Can't Target This Ward-Type Unit";
            }
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (target && target.IsOther()) {
            return this.GetSpecialValueFor("cast_range_ward");
        } else {
            return super.GetCastRange(location, target);
        }
    }
    GetCooldown(level: number): number {
        if (IsClient()) {
            return super.GetCooldown(level);
        } else if (this.GetCursorTarget() && ((this.GetCursorTarget() as any as CDOTA_MapTree).CutDown || this.GetCursorTarget().IsOther())) {
            return this.GetSpecialValueFor("alternative_cooldown");
        } else {
            return super.GetCooldown(level);
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_iron_talon";
    }
    OnSpellStart(): void {
        if ((this.GetCursorTarget() as any as CDOTA_MapTree).CutDown) {
            (this.GetCursorTarget() as any as CDOTA_MapTree).CutDown(this.GetCasterPlus().GetTeamNumber());
        } else {
            if (!this.GetCursorTarget().IsCreep) {
                this.GetCursorTarget().Kill();
            } else if (this.GetCursorTarget().IsCreep()) {
                this.GetCursorTarget().EmitSound("DOTA_Item.IronTalon.Activate");
                let talon_particle = ResHelper.CreateParticleEx("particles/items3_fx/iron_talon_active.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCursorTarget());
                ParticleManager.SetParticleControl(talon_particle, 1, this.GetCursorTarget().GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(talon_particle);
                let damageTable = {
                    victim: this.GetCursorTarget(),
                    damage: this.GetCursorTarget().GetHealth() * this.GetSpecialValueFor("creep_damage_pct") * 0.01,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this
                }
                ApplyDamage(damageTable);
            } else if (this.GetCursorTarget().IsOther()) {
                this.GetCursorTarget().Kill(this, this.GetCasterPlus());
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_iron_talon extends BaseModifier_Plus {
    public damage_bonus: number;
    public damage_bonus_ranged: number;
    public bonus_armor: number;
    public hunt_bonus: number;
    public hunt_bonus_ranged: number;
    public hunt_max: any;
    public hunt_max_ranged: number;
    AllowIllusionDuplicate(): boolean {
        return false;
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
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.damage_bonus = this.GetItemPlus().GetSpecialValueFor("damage_bonus");
        this.damage_bonus_ranged = this.GetItemPlus().GetSpecialValueFor("damage_bonus_ranged");
        this.bonus_armor = this.GetItemPlus().GetSpecialValueFor("bonus_armor");
        this.hunt_bonus = this.GetItemPlus().GetSpecialValueFor("hunt_bonus");
        this.hunt_bonus_ranged = this.GetItemPlus().GetSpecialValueFor("hunt_bonus_ranged");
        this.hunt_max = this.GetItemPlus().GetSpecialValueFor("hunt_max");
        this.hunt_max_ranged = this.GetItemPlus().GetSpecialValueFor("hunt_max_ranged");
        if (!IsServer()) {
            return;
        }
        if (this.GetItemPlus() && this.GetItemPlus<item_imba_iron_talon>().hunt_stacks) {
            this.SetStackCount(this.GetItemPlus<item_imba_iron_talon>().hunt_stacks);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: Enum_MODIFIER_EVENT.ON_DEATH,
            4: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP_2
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(keys?: { target: IBaseNpc_Plus } /** keys */): number {
        if (!IsServer()) {
            return;
        }
        if ((this.GetParentPlus().FindAllModifiersByName("modifier_item_imba_iron_talon")[0] == this) && keys.target && !keys.target.IsRealUnit() && !keys.target.IsOther() && !keys.target.IsBuilding() && keys.target.GetClassname() != "npc_dota_lone_druid_bear" && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            if (this.GetParentPlus().HasItemInInventory("item_quelling_blade")) {
                return this.GetStackCount();
            } else if (!this.GetParentPlus().IsRangedAttacker()) {
                return this.damage_bonus + this.GetStackCount();
            } else {
                return this.damage_bonus_ranged + this.GetStackCount();
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_armor;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetParentPlus().IsIllusion() && (this.GetParentPlus().FindAllModifiersByName("modifier_item_imba_iron_talon")[0] == this) && keys.attacker == this.GetParentPlus() && keys.unit.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_NEUTRALS && ((!this.GetParentPlus().IsRangedAttacker() && this.GetStackCount() < this.hunt_max) || (this.GetParentPlus().IsRangedAttacker() && this.GetStackCount() < this.hunt_max_ranged))) {
            if (!this.GetParentPlus().IsRangedAttacker()) {
                this.SetStackCount(math.min(this.GetStackCount() + this.hunt_bonus, this.hunt_max));
            } else {
                this.SetStackCount(math.min(this.GetStackCount() + this.hunt_bonus_ranged, this.hunt_max_ranged));
            }
            if (this.GetItemPlus()) {
                this.GetItemPlus<item_imba_iron_talon>().hunt_stacks = this.GetStackCount();
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.damage_bonus + this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    CC_OnTooltip2(): number {
        return this.damage_bonus_ranged + this.GetStackCount();
    }
}
