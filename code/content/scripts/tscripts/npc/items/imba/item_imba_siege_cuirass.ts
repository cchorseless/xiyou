
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 自定义
@registerAbility()
export class item_imba_siege_cuirass extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_siege_cuirass";
    }

    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "DOTA_Item.DoE.Activate";
        let modifier_active = "modifier_imba_siege_cuirass_active";
        let active_hero_multiplier = ability.GetSpecialValueFor("active_hero_multiplier");
        let duration = ability.GetSpecialValueFor("duration");
        let radius = ability.GetSpecialValueFor("radius");
        EmitSoundOn(sound_cast, caster);
        let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false);
        let stacks = 0;
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (ally.IsRealUnit()) {
                stacks = stacks + active_hero_multiplier;
            } else {
                stacks = stacks + 1;
            }
        }
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (ally.HasModifier("modifier_imba_drums_active")) {
                ally.RemoveModifierByName("modifier_imba_drums_active");
            }
            let modifier_active_handler = ally.AddNewModifier(caster, ability, modifier_active, {
                duration: duration
            });
            if (modifier_active_handler) {
                modifier_active_handler.SetStackCount(stacks);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_siege_cuirass_active extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public parent: IBaseNpc_Plus;
    public particle_buff: any;
    public active_as_per_ally: any;
    public active_ms_per_ally: any;
    public bonus_attack_speed_pct: number;
    public bonus_movement_speed_pct: number;
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        this.particle_buff = "particles/items_fx/drum_of_endurance_buff.vpcf";
        this.active_as_per_ally = this.ability.GetSpecialValueFor("active_as_per_ally");
        this.active_ms_per_ally = this.ability.GetSpecialValueFor("active_ms_per_ally");
        this.bonus_attack_speed_pct = this.ability.GetSpecialValueFor("bonus_attack_speed_pct");
        this.bonus_movement_speed_pct = this.ability.GetSpecialValueFor("bonus_movement_speed_pct");
        let particle_buff_fx = ResHelper.CreateParticleEx(this.particle_buff, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(particle_buff_fx, 0, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_buff_fx, 1, Vector(0, 0, 0));
        this.AddParticle(particle_buff_fx, false, false, -1, false, false);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed_pct + this.active_as_per_ally * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.bonus_movement_speed_pct + this.active_ms_per_ally * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_siege_cuirass extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public modifier_self: any;
    public modifier_aura_positive: any;
    public modifier_aura_negative: any;
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
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.modifier_self = "modifier_imba_siege_cuirass";
        this.modifier_aura_positive = "modifier_imba_siege_cuirass_aura_positive";
        this.modifier_aura_negative = "modifier_imba_siege_cuirass_aura_negative";
        if (this.GetItemPlus() && IsServer()) {
            if (!this.caster.HasModifier(this.modifier_aura_positive)) {
                this.caster.AddNewModifier(this.caster, this.ability, this.modifier_aura_positive, {});
                this.caster.AddNewModifier(this.caster, this.ability, this.modifier_aura_negative, {});
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_as");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_armor");
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.caster && !this.caster.IsNull() && !this.caster.HasModifier(this.modifier_self)) {
                this.caster.RemoveModifierByName(this.modifier_aura_positive);
                this.caster.RemoveModifierByName(this.modifier_aura_negative);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_siege_cuirass_aura_positive extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public modifier_siege: any;
    public radius: number;
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.modifier_siege = "modifier_imba_siege_cuirass_aura_positive_effect";
        this.radius = this.ability.GetSpecialValueFor("radius");
    }
    IsDebuff(): boolean {
        return false;
    }
    AllowIllusionDuplicate(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING;
    }
    GetModifierAura(): string {
        return this.modifier_siege;
    }
    IsAura(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_siege_cuirass_aura_positive_effect extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public aura_as_ally: any;
    public aura_ms_ally: any;
    public aura_armor_ally: any;
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.aura_as_ally = this.ability.GetSpecialValueFor("aura_as_ally");
        this.aura_ms_ally = this.ability.GetSpecialValueFor("aura_ms_ally");
        this.aura_armor_ally = this.ability.GetSpecialValueFor("aura_armor_ally");
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.aura_as_ally;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.aura_ms_ally;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.aura_armor_ally;
    }
}
@registerModifier()
export class modifier_imba_siege_cuirass_aura_negative extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public modifier_siege: any;
    public radius: number;
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.modifier_siege = "modifier_imba_siege_cuirass_aura_negative_effect";
        this.radius = this.ability.GetSpecialValueFor("radius");
    }
    IsDebuff(): boolean {
        return false;
    }
    AllowIllusionDuplicate(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING;
    }
    GetModifierAura(): string {
        return this.modifier_siege;
    }
    IsAura(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_siege_cuirass_aura_negative_effect extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public aura_as_reduction_enemy: any;
    public aura_ms_reduction_enemy: any;
    public aura_armor_reduction_enemy: any;
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.aura_as_reduction_enemy = this.ability.GetSpecialValueFor("aura_as_reduction_enemy") * (-1);
        this.aura_ms_reduction_enemy = this.ability.GetSpecialValueFor("aura_ms_reduction_enemy") * (-1);
        this.aura_armor_reduction_enemy = this.ability.GetSpecialValueFor("aura_armor_reduction_enemy") * (-1);
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.aura_as_reduction_enemy;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.aura_ms_reduction_enemy;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.aura_armor_reduction_enemy;
    }
}
