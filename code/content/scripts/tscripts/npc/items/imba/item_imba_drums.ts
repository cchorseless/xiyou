
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_ancient_janggo extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_drums";
    }
    GetAbilityTextureName(): string {
        return "imba_ancient_janggo";
    }
    OnSpellStart(): void {
        EmitSoundOn("DOTA_Item.DoE.Activate", this.GetCasterPlus());
        let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false);
        let stacks = 0;
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (ally.IsRealHero()) {
                stacks = stacks + this.GetSpecialValueFor("hero_multiplier");
            } else {
                stacks = stacks + 1;
            }
        }
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (!ally.HasModifier("modifier_imba_siege_cuirass_active")) {
                let modifier_active_handler = ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_drums_active", {
                    duration: this.GetSpecialValueFor("duration")
                });
                if (modifier_active_handler) {
                    modifier_active_handler.SetStackCount(stacks);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_drums_active extends BaseModifier_Plus {
    public particle_buff: any;
    public bonus_attack_speed_pct: number;
    public bonus_movement_speed_pct: number;
    public active_as_per_ally: any;
    public active_ms_per_ally: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.particle_buff = "particles/items_fx/drum_of_endurance_buff.vpcf";
        this.bonus_attack_speed_pct = this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed_pct");
        this.bonus_movement_speed_pct = this.GetItemPlus().GetSpecialValueFor("bonus_movement_speed_pct");
        this.active_as_per_ally = this.GetItemPlus().GetSpecialValueFor("active_as_per_ally");
        this.active_ms_per_ally = this.GetItemPlus().GetSpecialValueFor("active_ms_per_ally");
        let particle_buff_fx = ResHelper.CreateParticleEx(this.particle_buff, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(particle_buff_fx, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_buff_fx, 1, Vector(0, 0, 0));
        this.AddParticle(particle_buff_fx, false, false, -1, false, false);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.bonus_movement_speed_pct + this.active_ms_per_ally * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed_pct + this.active_as_per_ally * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_drums extends BaseModifier_Plus {
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_int");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_str");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_mana_regen");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_movement_speed");
        }
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraRadius(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("radius");
        }
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_drums_aura_effect";
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (target.HasModifier("modifier_imba_siege_cuirass_aura_positive_effect")) {
            return true;
        }
    }
}
@registerModifier()
export class modifier_imba_drums_aura_effect extends BaseModifier_Plus {
    public aura_ms: any;
    public aura_as: any;
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.aura_ms = this.GetItemPlus().GetSpecialValueFor("aura_ms");
        this.aura_as = this.GetItemPlus().GetSpecialValueFor("aura_as");
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.aura_ms;
    }
}
