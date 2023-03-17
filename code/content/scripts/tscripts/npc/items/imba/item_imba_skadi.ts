
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_skadi extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_skadi";
    }
    GetAbilityTextureName(): string {
        return "imba_skadi";
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        if (IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        if (caster && caster.HasModifier("modifier_item_imba_skadi")) {
            return caster.findBuffStack("modifier_item_imba_skadi", caster);
        } else {
            return 0;
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let radius = this.GetSpecialValueFor("base_radius");
            let duration = this.GetSpecialValueFor("base_duration");
            let damage = this.GetSpecialValueFor("base_damage");
            if (caster.IsRealUnit() && caster.GetStrength && caster.GetAgility && caster.GetIntellect) {
                radius = radius + caster.GetStrength() * this.GetSpecialValueFor("radius_per_str");
                duration = duration + caster.GetIntellect() * this.GetSpecialValueFor("duration_per_int");
                damage = damage + caster.GetAgility() * this.GetSpecialValueFor("damage_per_agi");
            }
            if (GameServiceConfig.USE_MEME_SOUNDS && RollPercentage(GameServiceConfig.MEME_SOUNDS_CHANCE)) {
                caster.EmitSound("Imba.SkadiDeadWinter");
            } else {
                caster.EmitSound("Imba.SkadiCast");
            }
            let blast_pfx = ResHelper.CreateParticleEx("particles/item/skadi/skadi_ground.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
            ParticleManager.SetParticleAlwaysSimulate(blast_pfx);
            ParticleManager.SetParticleControl(blast_pfx, 0, caster_loc);
            ParticleManager.SetParticleControl(blast_pfx, 2, Vector(radius * 1.15, 1, 1));
            ParticleManager.ReleaseParticleIndex(blast_pfx);
            this.CreateVisibilityNode(caster_loc, radius, duration + this.GetSpecialValueFor("vision_extra_duration"));
            let nearby_enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster_loc, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            if (GameFunc.GetCount(nearby_enemies) > 0) {
                caster.EmitSound("Imba.SkadiHit");
            }
            for (const [_, enemy] of GameFunc.iPair(nearby_enemies)) {
                ApplyDamage({
                    attacker: caster,
                    victim: enemy,
                    ability: this,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                });
                enemy.AddNewModifier(caster, this, "modifier_item_imba_skadi_freeze", {
                    duration: duration * (1 - enemy.GetStatusResistance())
                });
                enemy.AddNewModifier(caster, this, "modifier_generic_stunned", {
                    duration: 0.01
                });
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_skadi extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public parent: IBaseNpc_Plus;
    public radius: number;
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
    BeCreated(keys: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetItemPlus();
            this.parent = this.GetParentPlus();
            this.radius = this.GetItemPlus().GetSpecialValueFor("base_radius");
            if (!this.parent.HasModifier("modifier_item_imba_skadi_unique")) {
                this.parent.AddNewModifier(this.parent, this.ability, "modifier_item_imba_skadi_unique", {});
            }
            this.UpdateCastRange();
            this.StartIntervalThink(0.5);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (!this.parent.IsNull() && !this.parent.HasModifier("modifier_item_imba_skadi")) {
                this.parent.RemoveModifierByName("modifier_item_imba_skadi_unique");
            }
        }
    }
    OnIntervalThink(): void {
        this.UpdateCastRange();
    }
    UpdateCastRange() {
        if (IsServer()) {
            if (this.GetParentPlus().GetStrength) {
                this.SetStackCount((this.radius + this.parent.GetStrength() * this.ability.GetSpecialValueFor("radius_per_str")));
            } else {
                this.SetStackCount(this.radius);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_all_stats");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_all_stats");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_all_stats");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_health");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_mana");
        }
    }
}
@registerModifier()
export class modifier_item_imba_skadi_unique extends BaseModifier_Plus {
    public max_duration: number;
    public min_duration: number;
    public slow_range_cap: number;
    public max_distance: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            GFuncEntity.ChangeAttackProjectileImba(this.GetParentPlus());
            let ability = this.GetItemPlus();
            this.max_duration = ability.GetSpecialValueFor("max_duration");
            this.min_duration = ability.GetSpecialValueFor("min_duration");
            this.slow_range_cap = ability.GetSpecialValueFor("slow_range_cap");
            this.max_distance = ability.GetSpecialValueFor("max_distance");
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            GFuncEntity.ChangeAttackProjectileImba(this.GetParentPlus());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let attacker = this.GetParentPlus();
            if (attacker != keys.attacker) {
                return;
            }
            if (attacker.IsIllusion()) {
                return;
            }
            let target = keys.unit;
            if (/**(!   target.IsHeroOrCreep()) ||*/ attacker.GetTeam() == target.GetTeam()) {
                return;
            }
            let target_distance = (target.GetAbsOrigin() - attacker.GetAbsOrigin() as Vector).Length2D();
            if (target_distance >= this.max_distance) {
                return undefined;
            }
            let slow_duration = this.min_duration + (this.max_duration - this.min_duration) * math.max(this.slow_range_cap - target_distance, 0) / this.slow_range_cap;
            target.AddNewModifier(attacker, this.GetItemPlus(), "modifier_item_imba_skadi_slow", {
                duration: slow_duration * (1 - target.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_item_imba_skadi_slow extends BaseModifier_Plus {
    public slow_as: any;
    public slow_ms: any;
    public heal_reduction_pct: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost_lich.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 10;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.slow_as = this.GetItemPlus().GetSpecialValueFor("slow_as");
        this.slow_ms = this.GetItemPlus().GetSpecialValueFor("slow_ms");
        this.heal_reduction_pct = this.GetItemPlus().GetSpecialValueFor("heal_reduction_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.slow_as;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow_ms;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage(): number {
        return (this.heal_reduction_pct * (-1));
    }
    GetModifierLifestealAmplify() {
        return (this.heal_reduction_pct * (-1));
    }
}
@registerModifier()
export class modifier_item_imba_skadi_freeze extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_crystalmaiden/maiden_frostbite_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 11;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let states = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return states;
    }
}
