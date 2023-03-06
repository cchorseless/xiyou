
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_silver_edge extends BaseItem_Plus {
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let particle_invis_start = "particles/generic_hero_status/status_invisibility_start.vpcf";
        let duration = this.GetSpecialValueFor("invis_duration");
        let fade_time = this.GetSpecialValueFor("invis_fade_time");
        EmitSoundOn("DOTA_Item.InvisibilitySword.Activate", caster);
        this.AddTimer(fade_time, () => {
            let particle_invis_start_fx = ResHelper.CreateParticleEx(particle_invis_start, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(particle_invis_start_fx, 0, caster.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_invis_start_fx);
            caster.AddNewModifier(caster, this, "modifier_item_imba_silver_edge_invis", {
                duration: duration
            });
        });
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_silver_edge_passive";
    }
}
@registerModifier()
export class modifier_item_imba_silver_edge_invis extends BaseModifier_Plus {
    public shadow_rip_damage: number;
    public bonus_movespeed: number;
    public bonus_attack_damage: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.shadow_rip_damage = this.GetItemPlus().GetSpecialValueFor("shadow_rip_damage");
        this.bonus_movespeed = this.GetItemPlus().GetSpecialValueFor("invis_ms_pct");
        this.bonus_attack_damage = this.GetItemPlus().GetSpecialValueFor("invis_damage");
        if (IsServer()) {
            if (!this.GetParentPlus().findBuff<modifier_item_imba_silver_edge_invis_flying_disabled>("modifier_item_imba_silver_edge_invis_flying_disabled")) {
                this.GetParentPlus().SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_FLY);
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (!this.GetParentPlus().findBuff("modifier_silver_edge_invis_flying_disabled")) {
                this.GetParentPlus().SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_GROUND);
                GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), 175, false);
                ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 64);
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
        };
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            4: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.bonus_movespeed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            if (params.attacker == this.GetParentPlus()) {
                let ability = this.GetItemPlus();
                let attack_particle = "particles/item/silver_edge/imba_silver_edge.vpcf";
                let initial_pos;
                let cleave_damage = ability.GetSpecialValueFor("shadow_rip_damage");
                let cleave_radius_start = ability.GetSpecialValueFor("shadow_rip_start_width");
                let cleave_radius_end = ability.GetSpecialValueFor("shadow_rip_end_width");
                let cleave_distance = ability.GetSpecialValueFor("shadow_rip_distance");
                let panic_duration = ability.GetSpecialValueFor("panic_duration");
                let break_duration = ability.GetSpecialValueFor("main_debuff_duration");
                if (this.GetParentPlus().IsRangedAttacker()) {
                    initial_pos = this.GetParentPlus().GetAbsOrigin();
                    let target_pos = params.target.GetAbsOrigin();
                    let offset = 100;
                    let distance_vector = Vector(target_pos.x - initial_pos.x, target_pos.y - initial_pos.y, 0);
                    distance_vector = distance_vector.Normalized();
                    target_pos.x = target_pos.x - offset * distance_vector.x;
                    target_pos.y = target_pos.y - offset * distance_vector.y;
                    this.GetParentPlus().SetAbsOrigin(target_pos);
                    let direction = (GFuncVector.CalculateDirection(params.target, this.GetParentPlus()));
                    CreateModifierThinker(this.GetParentPlus(), ability, "modifier_item_imba_silver_edge_invis_attack_cleave_particle", {
                        duration: 1,
                        direction_x: direction.x,
                        direction_y: direction.y,
                        direction_z: direction.z
                    }, target_pos, this.GetParentPlus().GetTeamNumber(), false);
                } else {
                    let cleave_particle = "particles/item/silver_edge/silver_edge_shadow_rip.vpcf";
                    let particle_fx = ResHelper.CreateParticleEx(cleave_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
                    ParticleManager.SetParticleControl(particle_fx, 0, this.GetParentPlus().GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(particle_fx);
                }
                let enemies = AoiHelper.FindUnitsInCone(this.GetParentPlus().GetTeamNumber(), GFuncVector.CalculateDirection(params.target, this.GetParentPlus()), this.GetParentPlus().GetAbsOrigin(), cleave_radius_start, cleave_radius_end, cleave_distance, undefined, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, 0, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    let damager = this.GetParentPlus();
                    ApplyDamage(({
                        victim: enemy,
                        attacker: damager,
                        ability: ability,
                        damage: cleave_damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE
                    }));
                    enemy.AddNewModifier(this.GetParentPlus(), ability, "modifier_item_imba_silver_edge_invis_panic_debuff", {
                        duration: panic_duration * (1 - enemy.GetStatusResistance())
                    });
                }
                params.target.AddNewModifier(this.GetParentPlus(), ability, "modifier_item_imba_silver_edge_invis_break_debuff", {
                    duration: break_duration * (1 - params.target.GetStatusResistance())
                });
                this.GetParentPlus().EmitSound("Imba.SilverEdgeInvisAttack");
                let particle_fx = ResHelper.CreateParticleEx(attack_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
                ParticleManager.SetParticleControl(particle_fx, 0, params.target.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle_fx);
                if (this.GetParentPlus().IsRangedAttacker()) {
                    this.GetParentPlus().SetAbsOrigin(initial_pos);
                }
                this.Destroy();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (keys.unit == parent) {
                this.Destroy();
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.shadow_rip_damage;
    }
}
@registerModifier()
export class modifier_item_imba_silver_edge_passive extends BaseModifier_Plus {
    public echo_ready: any;
    public slow_duration: number;
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
                return;
            }
            this.echo_ready = true;
        }
        this.slow_duration = this.GetItemPlus().GetSpecialValueFor("slow_duration");
        if (this.GetParentPlus().IsRealUnit() && this.GetItemPlus()) {
            this.CheckUnique(true);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            6: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            7: Enum_MODIFIER_EVENT.ON_ATTACK
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
        }
    }
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (params.unit == this.GetParentPlus()) {
                let parent = this.GetParentPlus();
                let disable_duration = this.GetItemPlus().GetSpecialValueFor("invis_flying_damage_disable_duration");
                if (GFuncEntity.IsHeroDamage(params.attacker, params.damage)) {
                    parent.AddNewModifier(parent, this.GetItemPlus(), "modifier_item_imba_silver_edge_invis_flying_disabled", {
                        duration: disable_duration
                    });
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        let item = this.GetItemPlus();
        let parent = this.GetParentPlus();
        if (keys.attacker == parent && item && !parent.IsIllusion() && parent.FindAllModifiersByName(this.GetName())[0] == this) {
            if (!parent.IsRangedAttacker()) {
                if (this.echo_ready == true && !keys.no_attack_cooldown) {
                    this.echo_ready = false;
                    this.StartIntervalThink(KVHelper.GetItemData("item_imba_echo_sabre", "AbilityCooldown", true) as number);
                    parent.AddNewModifier(parent, item, "modifier_imba_echo_rapier_haste", {});
                    if (!keys.target.IsBuilding() && !keys.target.IsOther()) {
                        keys.target.AddNewModifier(parent, this.GetItemPlus(), "modifier_imba_echo_rapier_debuff_slow", {
                            duration: this.slow_duration
                        });
                    }
                }
            }
            if (parent.HasModifier("modifier_imba_echo_rapier_haste") && (!parent.HasAbility("imba_slark_essence_shift") || parent.findAbliityPlus("imba_slark_essence_shift").GetCooldownTime() < parent.FindAbilityByName("imba_slark_essence_shift").GetEffectiveCooldown(parent.FindAbilityByName("imba_slark_essence_shift").GetLevel()))) {
                let mod = parent.findBuff("modifier_imba_echo_rapier_haste");
                mod.DecrementStackCount();
                if (mod.GetStackCount() < 1) {
                    mod.Destroy();
                }
            }
        }
    }
    OnIntervalThink(): void {
        this.StartIntervalThink(-1);
        this.echo_ready = true;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_imba_echo_rapier_haste")) {
            this.GetParentPlus().RemoveModifierByName("modifier_imba_echo_rapier_haste");
        }
    }
}
@registerModifier()
export class modifier_item_imba_silver_edge_invis_flying_disabled extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            this.GetParentPlus().SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_GROUND);
            GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), 175, false);
            ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 64);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.GetParentPlus().findBuff<modifier_item_imba_silver_edge_invis>("modifier_item_imba_silver_edge_invis")) {
                this.GetParentPlus().SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_FLY);
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_silver_edge_invis_panic_debuff extends BaseModifier_Plus {
    public turnrate: any;
    public damage_reduction: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        let ability = this.GetItemPlus();
        this.turnrate = ability.GetSpecialValueFor("panic_turnrate_slow");
        this.damage_reduction = ability.GetSpecialValueFor("panic_damage_reduction");
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return this.turnrate;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierTotalDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.damage_reduction;
    }
    GetEffectName(): string {
        return "particles/item/silver_edge/silver_edge_panic_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_item_imba_silver_edge_invis_break_debuff extends BaseModifier_Plus {
    public damage_reduction: number;
    public heal_reduction: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.damage_reduction = this.GetItemPlus().GetSpecialValueFor("panic_damage_reduction");
        this.heal_reduction = this.GetItemPlus().GetSpecialValueFor("heal_reduction") * (-1);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEAL_AMPLIFY_PERCENTAGE_TARGET,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierTotalDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetParentPlus().HasModifier("modifier_item_imba_silver_edge_invis_panic_debuff")) {
            return 0;
        } else {
            return this.damage_reduction;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEAL_AMPLIFY_PERCENTAGE_TARGET)
    CC_GetModifierHealAmplify_PercentageTarget(): void {
        return this.heal_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage(): number {
        return this.heal_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.heal_reduction;
    }
}
@registerModifier()
export class modifier_item_imba_silver_edge_invis_attack_cleave_particle extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            let direction = Vector(params.direction_x, params.direction_y, params.direction_z);
            this.GetParentPlus().SetForwardVector(direction);
            let cleave_particle = "particles/item/silver_edge/silver_edge_shadow_rip.vpcf";
            let particle_fx = ResHelper.CreateParticleEx(cleave_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
            ParticleManager.SetParticleControl(particle_fx, 0, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_fx);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.GetParentPlus().ForceKill(false);
        }
    }
}
