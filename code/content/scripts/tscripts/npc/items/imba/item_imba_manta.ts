
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_manta extends BaseItem_Plus {
    manta_illusions: IBaseNpc_Plus[];
    GetIntrinsicModifierName(): string {
        return "modifier_item_manta_passive";
    }
    GetCooldown(p_0: number,): number {
        if (IsClient()) {
            if (this.GetCasterPlus().IsRangedAttacker()) {
                return this.GetSpecialValueFor("cooldown_ranged_tooltip");
            } else {
                return this.GetSpecialValueFor("cooldown_melee");
            }
        } else {
            if ((this.GetCursorTarget && this.GetCursorTarget() && this.GetCursorTarget().IsRangedAttacker()) || (this.GetCasterPlus().IsRangedAttacker() && this.GetName() == "item_imba_manta")) {
                return this.GetSpecialValueFor("cooldown_ranged_tooltip");
            } else {
                return this.GetSpecialValueFor("cooldown_melee");
            }
        }
    }
    OnSpellStart(): void {
        if (this.GetName() == "item_imba_manta") {
            this.GetCasterPlus().EmitSound("DOTA_Item.Manta.Activate");
            this.GetCasterPlus().Purge(false, true, false, false, false);
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_manta_invulnerable", {
                duration: this.GetSpecialValueFor("invuln_duration")
            });
        } else if (this.GetName() == "item_imba_manta_2") {
            let target = this.GetCursorTarget();
            target.EmitSound("DOTA_Item.Manta.Activate");
            if (target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
                this.GetCasterPlus().Purge(false, true, false, false, false);
            } else {
                this.GetCasterPlus().Purge(true, false, false, false, false);
            }
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_manta_invulnerable", {
                duration: this.GetSpecialValueFor("invuln_duration")
            });
        }
    }
}
@registerModifier()
export class modifier_item_manta_passive extends BaseModifier_Plus {
    public bonus_strength: number;
    public bonus_agility: number;
    public bonus_intellect: number;
    public bonus_attack_speed: number;
    public bonus_movement_speed: number;
    public outgoing_damage: number;
    public incoming_damage: number;
    public distance_multiplier: number;
    public death_illusions: any;
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
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!this.GetItemPlus()) {
            return;
        }
        this.bonus_strength = this.GetItemPlus().GetSpecialValueFor("bonus_strength");
        this.bonus_agility = this.GetItemPlus().GetSpecialValueFor("bonus_agility");
        this.bonus_intellect = this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
        this.bonus_attack_speed = this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
        this.bonus_movement_speed = this.GetItemPlus().GetSpecialValueFor("bonus_movement_speed");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            6: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_strength;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.bonus_agility;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_intellect;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.bonus_movement_speed;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (this.GetItemPlus() && this.GetItemPlus().GetName() == "item_imba_manta_2" && keys.unit == this.GetParentPlus() && this.GetParentPlus().IsRealHero() && keys.attacker != this.GetParentPlus() && (!this.GetParentPlus().IsReincarnating || (this.GetParentPlus().IsReincarnating && !this.GetParentPlus().IsReincarnating())) && (keys.attacker.IsRealHero() || keys.attacker.IsClone() || keys.attacker.IsTempestDouble() || keys.attacker.IsIllusion())) {
            if (!keys.attacker.IsRangedAttacker()) {
                this.outgoing_damage = this.GetItemPlus().GetSpecialValueFor("images_do_damage_percent_melee");
                this.incoming_damage = this.GetItemPlus().GetSpecialValueFor("images_take_damage_percent_melee");
            } else {
                this.outgoing_damage = this.GetItemPlus().GetSpecialValueFor("images_do_damage_percent_ranged");
                this.incoming_damage = this.GetItemPlus().GetSpecialValueFor("images_take_damage_percent_ranged");
            }
            if (keys.attacker.GetHullRadius() > 8) {
                this.distance_multiplier = 108;
            } else {
                this.distance_multiplier = 72;
            }
            this.death_illusions = this.GetCasterPlus().CreateIllusion(keys.attacker.GetOwnerPlus(), {
                outgoing_damage: this.outgoing_damage,
                incoming_damage: this.incoming_damage,
                bounty_base: keys.attacker.GetLevel() * 2,
                bounty_growth: undefined,
                outgoing_damage_structure: undefined,
                outgoing_damage_roshan: undefined,
                duration: this.GetItemPlus().GetSpecialValueFor("tooltip_illusion_duration")
            });
            for (const illusion of (this.death_illusions)) {
                illusion.AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_manta_abyss_boost", {
                    target_entindex: keys.attacker.entindex()
                });
            }
        }
    }
}
@registerModifier()
export class modifier_manta_invulnerable extends BaseModifier_Plus {
    public outgoing_damage: number;
    public incoming_damage: number;
    public distance_multiplier: number;
    public created_manta_illusions: IBaseNpc_Plus[];
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/items2_fx/manta_phase.vpcf";
    }
    BeDestroy(): void {
        let item = this.GetItemPlus<item_imba_manta>();
        if (!IsServer() || !this.GetParentPlus().IsAlive() || !this.GetItemPlus()) {
            return;
        }
        if (this.GetParentPlus() == this.GetCasterPlus()) {
            this.GetParentPlus().Stop();
        }
        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), 1000, 1, false);
        if (item.manta_illusions) {
            for (const illusion of (item.manta_illusions)) {
                if (illusion && !illusion.IsNull()) {
                    illusion.ForceKill(false);
                }
            }
        }
        for (const mod of (this.GetCasterPlus().FindAllModifiersByName("modifier_item_manta_passive"))) {
            if (mod.GetItemPlus() && mod.GetItemPlus() != this.GetItemPlus() && mod.GetItemPlus<item_imba_manta>().manta_illusions) {
                for (const illusion of (mod.GetItemPlus<item_imba_manta>().manta_illusions)) {
                    if (illusion && !illusion.IsNull()) {
                        illusion.ForceKill(false);
                    }
                }
            }
        }
        item.manta_illusions = []
        if (!this.GetParentPlus().IsRangedAttacker()) {
            this.outgoing_damage = this.GetItemPlus().GetSpecialValueFor("images_do_damage_percent_melee");
            this.incoming_damage = this.GetItemPlus().GetSpecialValueFor("images_take_damage_percent_melee");
        } else {
            this.outgoing_damage = this.GetItemPlus().GetSpecialValueFor("images_do_damage_percent_ranged");
            this.incoming_damage = this.GetItemPlus().GetSpecialValueFor("images_take_damage_percent_ranged");
        }
        if (this.GetParentPlus().GetHullRadius() > 8) {
            this.distance_multiplier = 108;
        } else {
            this.distance_multiplier = 72;
        }
        this.created_manta_illusions = this.GetCasterPlus().CreateIllusion(this.GetParentPlus().GetOwnerPlus(), {
            outgoing_damage: this.outgoing_damage,
            incoming_damage: this.incoming_damage,
            bounty_base: this.GetParentPlus().GetLevel() * 2,
            bounty_growth: undefined,
            outgoing_damage_structure: undefined,
            outgoing_damage_roshan: undefined,
            duration: this.GetItemPlus().GetSpecialValueFor("tooltip_illusion_duration")
        }, this.GetItemPlus().GetSpecialValueFor("images_count"));
        if (this.GetParentPlus().HasModifier("modifier_item_imba_yasha_active")) {
            this.GetParentPlus().findBuff("modifier_item_imba_yasha_active").Destroy();
        }
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            this.GetParentPlus().EmitSound("DOTA_Item.IronTalon.Activate");
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_yasha_active", {
                duration: this.GetItemPlus().GetSpecialValueFor("active_duration")
            });
        }
        for (const [_, unit] of GameFunc.iPair(this.created_manta_illusions)) {
            if (unit.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
                unit.EmitSound("DOTA_Item.IronTalon.Activate");
                unit.AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_yasha_active", {
                    duration: this.GetItemPlus().GetSpecialValueFor("active_duration")
                });
                if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                    unit.AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_manta_abyss_boost", {
                        target_entindex: this.GetParentPlus().entindex()
                    });
                }
            }
            if (unit.IsIllusion()) {
                table.insert(this.GetItemPlus<item_imba_manta>().manta_illusions, unit);
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
}
@registerModifier()
export class modifier_item_imba_manta_abyss_boost extends BaseModifier_Plus {
    public abyss_boost_pct: number;
    public target: IBaseNpc_Plus;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.abyss_boost_pct = this.GetItemPlus().GetSpecialValueFor("abyss_boost_pct");
        if (!IsServer()) {
            return;
        }
        this.target = EntIndexToHScript(keys.target_entindex) as IBaseNpc_Plus;
        this.OnIntervalThink();
        this.StartIntervalThink(0.5);
    }
    OnIntervalThink(): void {
        if (!this.GetParentPlus().IsIllusion()) {
            this.StartIntervalThink(-1);
            this.Destroy();
        }
        this.SetStackCount((this.target.GetAverageTrueAttackDamage(this.target) - (this.target.GetBaseDamageMin() + this.target.GetBaseDamageMax()) * 0.5) * this.abyss_boost_pct * 0.01);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.abyss_boost_pct;
    }
}
