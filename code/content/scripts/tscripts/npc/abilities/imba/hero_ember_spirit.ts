
import { GameFunc } from "../../../GameFunc";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function FindActiveRemnants(caster: IBaseNpc_Plus) {
    let remnants = caster.FindChildByFilter((npc) => {
        return npc.GetUnitName().includes("ember_spirit_remnant") && npc.IsAlive() && !npc.IsRealUnit() && npc.HasModifier("modifier_imba_fire_remnant_state");
    }
    )
    return remnants;
}
function ApplySearingChains(caster: IBaseNpc_Plus, source: IBaseNpc_Plus, target: IBaseNpc_Plus, ability: IBaseAbility_Plus, duration: number) {
    target.EmitSound("Hero_EmberSpirit.SearingChains.Target");
    target.AddNewModifier(caster, ability, "modifier_imba_searing_chains_debuff", {
        damage: ability.GetSpecialValueFor("damage_per_tick"),
        tick_interval: ability.GetSpecialValueFor("tick_interval"),
        duration: duration * (1 - target.GetStatusResistance())
    });
    let impact_pfx = ParticleManager.CreateParticle("particles/units/heroes/hero_ember_spirit/ember_spirit_searing_chains_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, target);
    ParticleManager.SetParticleControl(impact_pfx, 0, source.GetAbsOrigin());
    ParticleManager.SetParticleControl(impact_pfx, 1, target.GetAbsOrigin());
    ParticleManager.ReleaseParticleIndex(impact_pfx);
}


@registerModifier()
export class modifier_imba_flame_guard_talent extends BaseModifier_Plus {
    public learned_guard_talent: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.learned_guard_talent = false;
            this.StartIntervalThink(0.2);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.learned_guard_talent) {
                if (this.GetParentPlus().IsAlive() && this.GetParentPlus().HasTalent("special_bonus_ember_permanent_guard")) {
                    this.GetParentPlus().RemoveModifierByName("modifier_imba_flame_guard_aura");
                    this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_flame_guard_passive", {});
                    this.GetParentPlus().EmitSound("Hero_EmberSpirit.FlameGuard.Loop");
                    this.GetAbilityPlus().SetActivated(false);
                    this.learned_guard_talent = true;
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_flame_guard_passive extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_ember_spirit/ember_spirit_flameguard.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(keys: any): void {
        if (IsServer() && !this.GetParentPlus().IsIllusion()) {
            this.StartIntervalThink(this.GetSpecialValueFor("tick_interval"));
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let damage = ability.GetSpecialValueFor("damage_per_second");
            if (caster.findAbliityPlus("special_bonus_ember_guard_damage") && caster.FindAbilityByName("special_bonus_ember_guard_damage").GetLevel() > 0) {
                damage = damage + caster.findAbliityPlus("special_bonus_ember_guard_damage").GetSpecialValueFor("value");
            }
            damage = damage * ability.GetSpecialValueFor("tick_interval");
            let nearby_enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, ability.GetSpecialValueFor("effect_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(nearby_enemies)) {
                ApplyDamage({
                    victim: enemy,
                    attacker: caster,
                    ability: ability,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                });
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_ember_permanent_guard")) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_ember_permanent_guard");
        }
    }
}
@registerModifier()
export class modifier_imba_flame_guard_aura extends BaseModifier_Plus {
    public tick_interval: number;
    public damage: number;
    public effect_radius: number;
    public remaining_health: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_ember_spirit/ember_spirit_flameguard.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.tick_interval = keys.tick_interval;
            this.damage = keys.damage * this.tick_interval;
            this.effect_radius = keys.effect_radius;
            this.remaining_health = keys.remaining_health;
            this.SetStackCount(this.remaining_health);
            this.StartIntervalThink(this.tick_interval);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.GetParentPlus().StopSound("Hero_EmberSpirit.FlameGuard.Loop");
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.remaining_health <= 0) {
                this.GetParentPlus().RemoveModifierByName("modifier_imba_flame_guard_aura");
            } else {
                let nearby_enemies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.effect_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(nearby_enemies)) {
                    ApplyDamage({
                        victim: enemy,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus(),
                        damage: this.damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                    });
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_SPELL_DAMAGE_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_SPELL_DAMAGE_CONSTANT)
    CC_GetModifierIncomingSpellDamageConstant(keys: ModifierAttackEvent): number {
        if (IsClient()) {
            return this.remaining_health;
        } else {
            if (keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) {
                if (keys.original_damage >= this.remaining_health) {
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MAGICAL_BLOCK, this.GetParentPlus(), this.remaining_health, undefined);
                    this.Destroy();
                    return this.remaining_health * (-1);
                } else {
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MAGICAL_BLOCK, this.GetParentPlus(), keys.original_damage, undefined);
                    this.remaining_health = this.remaining_health - keys.original_damage;
                    this.SetStackCount(this.remaining_health);
                    return keys.original_damage * (-1);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_sleight_of_fist_caster extends BaseModifier_Plus {
    public sleight_caster_particle: any;
    public bonus_damage: number = 0;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
        if (IsServer()) {
            this.sleight_caster_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_ember_spirit/ember_spirit_sleight_of_fist_caster.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(this.sleight_caster_particle, 0, this.GetCasterPlus().GetAbsOrigin());
            ParticleManager.SetParticleControlForward(this.sleight_caster_particle, 1, this.GetCasterPlus().GetForwardVector());
            this.GetParentPlus().AddNoDraw();
            this.GetAbilityPlus().SetActivated(false);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.sleight_caster_particle, false);
            ParticleManager.ReleaseParticleIndex(this.sleight_caster_particle);
            this.GetParentPlus().RemoveNoDraw();
            this.GetAbilityPlus().SetActivated(true);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            let state = {
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
                [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
                [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
                [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
                [modifierstate.MODIFIER_STATE_DISARMED]: true
            }
            return state;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage( /** keys */): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    CC_GetModifierIgnoreCastAngle(): 0 | 1 {
        return 1;
    }
}
@registerModifier()
export class modifier_imba_sleight_of_fist_marker extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_ember_spirit/ember_spirit_sleight_of_fist_targetted_marker.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_searing_chains_attack extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().IsIllusion()) {
                let attacker = this.GetParentPlus();
                if (attacker.findAbliityPlus("special_bonus_ember_chains_on_attack") && attacker.FindAbilityByName("special_bonus_ember_chains_on_attack").GetLevel() > 0) {
                    let talent_ability = attacker.findAbliityPlus("special_bonus_ember_chains_on_attack");
                    let target = keys.target;
                    if (!(target.IsBuilding() || target.IsMagicImmune()) && GFuncRandom.PRD(talent_ability.GetSpecialValueFor("chance"), this)) {
                        ApplySearingChains(attacker, attacker, target, this.GetAbilityPlus(), talent_ability.GetSpecialValueFor("duration"));
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_searing_chains_debuff extends BaseModifier_Plus {
    public tick_interval: number;
    public damage: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_ember_spirit/ember_spirit_searing_chains_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.tick_interval = keys.tick_interval;
            this.damage = keys.damage;
            this.StartIntervalThink(this.tick_interval);
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_stunned", {
                duration: 0.1 * (1 - this.GetParentPlus().GetStatusResistance())
            });
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus(),
                damage: this.damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
        }
    }
}
@registerModifier()
export class modifier_imba_fire_remnant_charges extends BaseModifier_Plus {
    public max_charges: any;
    public learned_charges_talent: any;
    public learned_charges_scepter: any;
    OnStackCountChanged(stack: number): void {
        if (!IsServer()) {
            return;
        }
        let max_charges = this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges");
        if (this.GetCasterPlus().HasScepter()) {
            max_charges = max_charges + this.GetSpecialValueFor("scepter_additional_charges");
        }
        if (this.GetStackCount() > max_charges) {
            this.SetStackCount(max_charges);
        }
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.GetCasterPlus().TempData().spirit_charges = 0;
            if (this.GetCasterPlus().HasScepter()) {
                this.SetStackCount(this.GetSpecialValueFor("max_charges") + this.GetSpecialValueFor("scepter_additional_charges"));
            } else {
                this.SetStackCount(this.GetSpecialValueFor("max_charges"));
            }
            this.max_charges = this.GetStackCount();
            this.learned_charges_talent = false;
            this.StartIntervalThink(0.2);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.learned_charges_talent) {
                let talent = this.GetParentPlus().findAbliityPlus("special_bonus_ember_remnant_charges");
                if (talent && talent.GetLevel() > 0) {
                    this.SetStackCount(this.GetStackCount() + talent.GetSpecialValueFor("value"));
                    this.max_charges = this.GetStackCount();
                    this.learned_charges_talent = true;
                }
            }
            if (!this.learned_charges_scepter && this.GetCasterPlus().HasScepter()) {
                this.SetStackCount(this.GetStackCount() + this.GetSpecialValueFor("scepter_additional_charges"));
                this.max_charges = this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges") + this.GetSpecialValueFor("scepter_additional_charges");
                this.learned_charges_scepter = true;
                if (this.GetStackCount() > 0) {
                    this.GetAbilityPlus().SetActivated(true);
                }
            } else if (this.learned_charges_scepter && !this.GetCasterPlus().HasScepter()) {
                this.SetStackCount(this.GetStackCount() - this.GetSpecialValueFor("scepter_additional_charges"));
                this.max_charges = this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges");
                this.learned_charges_scepter = false;
                if (this.GetStackCount() <= 0) {
                    this.GetAbilityPlus().SetActivated(false);
                }
            }
            if (this.GetParentPlus().IsAlive() && this.GetCasterPlus().TempData().spirit_charges > 0) {
                this.SetStackCount(this.GetStackCount() + this.GetCasterPlus().TempData().spirit_charges);
                this.GetCasterPlus().TempData().spirit_charges = 0;
                this.GetAbilityPlus().SetActivated(true);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(params: ModifierAbilityEvent): void {
        if (params.unit != this.GetParentPlus()) {
            return;
        }
        if (params.ability.GetAbilityName() == "item_refresher" || params.ability.GetAbilityName() == "item_refresher_shard") {
            this.SetStackCount(this.max_charges);
            this.GetAbilityPlus().SetActivated(true);
        }
    }
}
@registerModifier()
export class modifier_imba_fire_remnant_state extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_ember_spirit/ember_spirit_fire_remnant.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    StatusEffectPriority(): modifierpriority {
        return 2;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_burn.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            let state = {
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
                [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
                [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
                [modifierstate.MODIFIER_STATE_ROOTED]: true,
                [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
            }
            return state;
        }
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(),
                "modifier_kill", {
                duration: this.GetDuration()
            });
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            GFuncEntity.SafeDestroyUnit(this.GetParentPlus());
            this.GetAbilityPlus<imba_ember_spirit_fire_remnant>().CollectRemnant();
        }
    }
}
@registerModifier()
export class modifier_imba_fire_remnant_cooldown extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
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
    BeDestroy(): void {
        if (IsServer()) {
            let charges_modifier = this.GetParentPlus().findBuff<modifier_imba_fire_remnant_charges>("modifier_imba_fire_remnant_charges");
            charges_modifier.SetStackCount(math.min(charges_modifier.GetStackCount() + 1, charges_modifier.max_charges));
            this.GetAbilityPlus().SetActivated(true);
        }
    }
}
@registerModifier()
export class modifier_imba_fire_remnant_dash extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_ember_spirit/ember_spirit_remnant_dash.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            return {
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
                [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
                [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
                [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true
            };
        }
    }
}
@registerAbility()
export class imba_ember_spirit_searing_chains extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_searing_chains_attack";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let max_targets = this.GetSpecialValueFor("units_per_charge");
            let main_targets = this.GetSpecialValueFor("units_per_charge");
            let duration = this.GetSpecialValueFor("duration");
            if (caster.findBuff<modifier_imba_fire_remnant_charges>("modifier_imba_fire_remnant_charges")) {
                main_targets = max_targets * (1 + caster.findBuff<modifier_imba_fire_remnant_charges>("modifier_imba_fire_remnant_charges").GetStackCount());
            }
            if (caster.findAbliityPlus("special_bonus_ember_chains_duration") && caster.FindAbilityByName("special_bonus_ember_chains_duration").GetLevel() > 0) {
                duration = duration + caster.findAbliityPlus("special_bonus_ember_chains_duration").GetSpecialValueFor("value");
            }
            caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
            caster.EmitSound("Hero_EmberSpirit.SearingChains.Cast");
            let cast_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_ember_spirit/ember_spirit_searing_chains_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(cast_pfx, 0, caster_loc);
            ParticleManager.SetParticleControl(cast_pfx, 1, Vector(this.GetSpecialValueFor("effect_radius"), 1, 1));
            ParticleManager.ReleaseParticleIndex(cast_pfx);
            let nearby_enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster_loc, undefined, this.GetSpecialValueFor("effect_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
            for (let i = 0; i < main_targets; i++) {
                if (nearby_enemies[i]) {
                    ApplySearingChains(caster, caster, nearby_enemies[i], this, duration);
                }
            }
            let active_remnants = FindActiveRemnants(caster);
            if (active_remnants) {
                for (const [_, remnant] of GameFunc.iPair(active_remnants)) {
                    remnant.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
                    let nearby_enemies = FindUnitsInRadius(caster.GetTeamNumber(), remnant.GetAbsOrigin(), undefined, this.GetSpecialValueFor("effect_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
                    for (let i = 0; i < max_targets; i++) {
                        if (nearby_enemies[i]) {
                            ApplySearingChains(caster, remnant, nearby_enemies[i], this, duration);
                        }
                    }
                }
            }
        }
    }
}
@registerAbility()
export class imba_ember_spirit_sleight_of_fist extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("effect_radius");
    }
    OnOwnerDied(): void {
        if (!this.IsActivated()) {
            this.SetActivated(true);
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target_loc = this.GetCursorPosition();
            let caster_loc = caster.GetAbsOrigin();
            let original_direction = (caster.GetAbsOrigin() - target_loc as Vector).Normalized();
            let effect_radius = this.GetSpecialValueFor("effect_radius");
            let remnant_radius = effect_radius * 0.75;
            let attack_interval = this.GetSpecialValueFor("attack_interval");
            let sleight_targets: EntityIndex[] = []
            caster.EmitSound("Hero_EmberSpirit.SleightOfFist.Cast");
            let cast_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_ember_spirit/ember_spirit_sleight_of_fist_cast.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
            ParticleManager.SetParticleControl(cast_pfx, 0, target_loc);
            ParticleManager.SetParticleControl(cast_pfx, 1, Vector(effect_radius, 1, 1));
            ParticleManager.ReleaseParticleIndex(cast_pfx);
            let nearby_enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_loc, undefined, effect_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
            for (const enemy of (nearby_enemies)) {
                sleight_targets.push(enemy.GetEntityIndex());
                enemy.AddNewModifier(caster, this, "modifier_imba_sleight_of_fist_marker", {
                    duration: (sleight_targets.length - 1) * attack_interval
                });
            }
            let active_remnants = FindActiveRemnants(caster);
            if (active_remnants) {
                for (const remnant of (active_remnants)) {
                    nearby_enemies = FindUnitsInRadius(caster.GetTeamNumber(), remnant.GetAbsOrigin(), undefined, remnant_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
                    for (const enemy of (nearby_enemies)) {
                        sleight_targets.push(enemy.GetEntityIndex());
                        enemy.AddNewModifier(caster, this, "modifier_imba_sleight_of_fist_marker", {
                            duration: (sleight_targets.length - 1) * attack_interval
                        });
                    }
                    remnant.EmitSound("Hero_EmberSpirit.SleightOfFist.Cast");
                    let remnant_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_ember_spirit/ember_spirit_sleight_of_fist_cast.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                    ParticleManager.SetParticleControl(remnant_pfx, 0, remnant.GetAbsOrigin());
                    ParticleManager.SetParticleControl(remnant_pfx, 1, Vector(remnant_radius, 1, 1));
                    ParticleManager.ReleaseParticleIndex(remnant_pfx);
                }
            }
            if (caster.findAbliityPlus("special_bonus_ember_sleight_extra_targets") && caster.FindAbilityByName("special_bonus_ember_sleight_extra_targets").GetLevel() > 0) {
                let bonus_targets = caster.findAbliityPlus("special_bonus_ember_sleight_extra_targets").GetSpecialValueFor("bonus_targets");
                for (let i = 0; i < bonus_targets; i++) {
                    if (sleight_targets[i]) {
                        sleight_targets.push(sleight_targets[i]);
                    }
                }
            }
            if (GameFunc.GetCount(sleight_targets) >= 1) {
                let previous_position = caster.GetAbsOrigin();
                let current_count = 0;
                let current_target = EntIndexToHScript(sleight_targets[current_count]) as IBaseNpc_Plus;
                caster.AddNewModifier(caster, this, "modifier_imba_sleight_of_fist_caster", {});
                this.AddTimer(FrameTime(), () => {
                    if (current_target && !current_target.IsNull() && current_target.IsAlive() && !(current_target.IsInvisible() && !caster.CanEntityBeSeenByMyTeam(current_target)) && !current_target.IsAttackImmune()) {
                        caster.EmitSound("Hero_EmberSpirit.SleightOfFist.Damage");
                        let slash_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_ember_spirit/ember_spirit_sleightoffist_tgt.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, current_target);
                        ParticleManager.SetParticleControl(slash_pfx, 0, current_target.GetAbsOrigin());
                        ParticleManager.ReleaseParticleIndex(slash_pfx);
                        let trail_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_ember_spirit/ember_spirit_sleightoffist_trail.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                        ParticleManager.SetParticleControl(trail_pfx, 0, current_target.GetAbsOrigin());
                        ParticleManager.SetParticleControl(trail_pfx, 1, previous_position);
                        ParticleManager.ReleaseParticleIndex(trail_pfx);
                        if (caster.HasModifier("modifier_imba_sleight_of_fist_caster")) {
                            caster.SetAbsOrigin(current_target.GetAbsOrigin() + original_direction * 64 as Vector);
                            caster.PerformAttack(current_target, true, true, true, false, false, false, false);
                        }
                    }
                    current_count = current_count + 1;
                    if (GameFunc.GetCount(sleight_targets) > current_count && caster.HasModifier("modifier_imba_sleight_of_fist_caster")) {
                        previous_position = current_target.GetAbsOrigin();
                        current_target = EntIndexToHScript(sleight_targets[current_count]) as IBaseNpc_Plus;
                        if (!(current_target.IsInvisible() && !caster.CanEntityBeSeenByMyTeam(current_target)) && !current_target.IsAttackImmune()) {
                            return attack_interval;
                        } else {
                            return;
                        }
                    } else {
                        this.AddTimer(attack_interval - FrameTime(), () => {
                            if (caster.HasModifier("modifier_imba_sleight_of_fist_caster")) {
                                FindClearSpaceForUnit(caster, caster_loc, true);
                            }
                            caster.RemoveModifierByName("modifier_imba_sleight_of_fist_caster");
                            for (const [_, target] of GameFunc.iPair(sleight_targets)) {
                                (EntIndexToHScript(target) as IBaseNpc_Plus).RemoveModifierByName("modifier_imba_sleight_of_fist_marker");
                            }
                        });
                    }
                });
            }
        }
    }
}
@registerAbility()
export class imba_ember_spirit_fire_remnant extends BaseAbility_Plus {
    GetAssociatedPrimaryAbilities(): string {
        return "imba_ember_spirit_activate_fire_remnant";
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    OnStolen(self: CDOTABaseAbility): void {
        let caster = this.GetCasterPlus();
        this.AddTimer(FrameTime(), () => {
            if (caster.HasModifier("modifier_imba_fire_remnant_charges")) {
                // caster.findBuff<modifier_imba_fire_remnant_charges>("modifier_imba_fire_remnant_charges").BeRefresh();
            }
        });
    }
    CollectRemnant() {
        if (IsServer()) {
            if (this.GetCasterPlus().IsAlive()) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_fire_remnant_cooldown", {
                    duration: this.GetSpecialValueFor("remnant_recharge")
                });
            } else {
                this.GetCasterPlus().TempData<number>().spirit_charges += 1;
            }
            if (FindActiveRemnants(this.GetCasterPlus())) {
                this.GetCasterPlus().findAbliityPlus<imba_ember_spirit_activate_fire_remnant>("imba_ember_spirit_activate_fire_remnant").SetActivated(false);
            }
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_fire_remnant_charges";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("effect_radius");
    }
    GetCastRange(vLocation: Vector, hTarget: CDOTA_BaseNPC | undefined): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCastRange(vLocation, hTarget);
        } else {
            return super.GetCastRange(vLocation, hTarget) + this.GetSpecialValueFor("scepter_additional_cast_range");
        }
    }
    OnUpgrade(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let activate_ability = caster.findAbliityPlus<imba_ember_spirit_activate_fire_remnant>("imba_ember_spirit_activate_fire_remnant");
            activate_ability.SetLevel(this.GetLevel());
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let target_loc = this.GetCursorPosition();
        let charges_modifier = this.GetCasterPlus().findBuff<modifier_imba_fire_remnant_charges>("modifier_imba_fire_remnant_charges");
        if (charges_modifier.GetStackCount() > 0) {
            charges_modifier.SetStackCount(charges_modifier.GetStackCount() - 1);
            this.GetCasterPlus().EmitSound("Hero_EmberSpirit.FireRemnant.Cast");
            let remnant = BaseNpc_Plus.CreateUnitByName("npc_imba_ember_spirit_remnant", target_loc, this.GetCasterPlus(), true);
            remnant.SetOwner(this.GetCasterPlus());
            remnant.EmitSound("Hero_EmberSpirit.FireRemnant.Activate");
            remnant.SetRenderColor(255, 0, 0);
            remnant.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_fire_remnant_state", {
                duration: this.GetSpecialValueFor("duration")
            });
            this.GetCasterPlus().findAbliityPlus<imba_ember_spirit_activate_fire_remnant>("imba_ember_spirit_activate_fire_remnant").SetActivated(true);
            if (charges_modifier.GetStackCount() <= 0) {
                this.SetActivated(false);
            }
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_fire_remnant_timer", {
                duration: this.GetSpecialValueFor("duration")
            });
            let ability_flame_guard = this.GetCasterPlus().findAbliityPlus<imba_ember_spirit_flame_guard>("imba_ember_spirit_flame_guard");
            if (ability_flame_guard) {
                let effect_radius = ability_flame_guard.GetSpecialValueFor("effect_radius");
                let damage = ability_flame_guard.GetSpecialValueFor("damage_per_second");
                let tick_interval = ability_flame_guard.GetSpecialValueFor("tick_interval");
                if (this.GetCasterPlus().findAbliityPlus("special_bonus_ember_guard_damage") && this.GetCasterPlus().FindAbilityByName("special_bonus_ember_guard_damage").GetLevel() > 0) {
                    damage = damage + this.GetCasterPlus().findAbliityPlus("special_bonus_ember_guard_damage").GetSpecialValueFor("value");
                }
                if (this.GetCasterPlus().HasModifier("modifier_imba_flame_guard_aura")) {
                    remnant.EmitSound("Hero_EmberSpirit.FlameGuard.Loop");
                    remnant.AddNewModifier(this.GetCasterPlus(), ability_flame_guard, "modifier_imba_flame_guard_aura", {
                        damage: damage * 0.5,
                        tick_interval: tick_interval,
                        effect_radius: effect_radius,
                        remaining_health: 1000,
                        duration: this.GetCasterPlus().findBuff<modifier_imba_flame_guard_aura>("modifier_imba_flame_guard_aura").GetRemainingTime()
                    });
                } else if (this.GetCasterPlus().findAbliityPlus("special_bonus_ember_permanent_guard") && this.GetCasterPlus().FindAbilityByName("special_bonus_ember_permanent_guard").GetLevel() > 0) {
                    remnant.EmitSound("Hero_EmberSpirit.FlameGuard.Loop");
                    remnant.AddNewModifier(this.GetCasterPlus(), ability_flame_guard, "modifier_imba_flame_guard_aura", {
                        damage: damage * 0.5,
                        tick_interval: tick_interval,
                        effect_radius: effect_radius,
                        remaining_health: 1000
                    });
                }
            }
        }
    }
}
@registerAbility()
export class imba_ember_spirit_flame_guard extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_flame_guard_talent";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let effect_radius = this.GetSpecialValueFor("effect_radius");
            let duration = this.GetSpecialValueFor("duration");
            let damage = this.GetSpecialValueFor("damage_per_second");
            let tick_interval = this.GetSpecialValueFor("tick_interval");
            let absorb_amount = this.GetSpecialValueFor("absorb_amount") * caster.GetMaxHealth() * 0.01;
            if (caster.findAbliityPlus("special_bonus_ember_guard_damage") && caster.FindAbilityByName("special_bonus_ember_guard_damage").GetLevel() > 0) {
                damage = damage + caster.findAbliityPlus("special_bonus_ember_guard_damage").GetSpecialValueFor("value");
            }
            caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3);
            let active_remnants = FindActiveRemnants(caster);
            if (active_remnants) {
                for (const [_, remnant] of GameFunc.iPair(active_remnants)) {
                    remnant.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3);
                    remnant.EmitSound("Hero_EmberSpirit.FlameGuard.Cast");
                    remnant.EmitSound("Hero_EmberSpirit.FlameGuard.Loop");
                    remnant.AddNewModifier(caster, this, "modifier_imba_flame_guard_aura", {
                        damage: damage * 0.5,
                        tick_interval: tick_interval,
                        effect_radius: effect_radius,
                        remaining_health: absorb_amount,
                        duration: duration
                    });
                }
            }
            caster.EmitSound("Hero_EmberSpirit.FlameGuard.Cast");
            caster.EmitSound("Hero_EmberSpirit.FlameGuard.Loop");
            caster.RemoveModifierByName("modifier_imba_flame_guard_aura");
            caster.AddNewModifier(caster, this, "modifier_imba_flame_guard_aura", {
                damage: damage,
                tick_interval: tick_interval,
                effect_radius: effect_radius,
                remaining_health: absorb_amount,
                duration: duration
            });
        }
    }
}
@registerAbility()
export class imba_ember_spirit_activate_fire_remnant extends BaseAbility_Plus {
    GetAssociatedSecondaryAbilities(): string {
        return "imba_ember_spirit_fire_remnant";
    }
    GetManaCost(level: number): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetManaCost(level);
        } else {
            return this.GetSpecialValueFor("scepter_mana_cost");
        }
    }
    OnUpgrade(): void {
        if (IsServer()) {
            if (this.GetLevel() == 1) {
                this.SetActivated(false);
            }
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target_loc = this.GetCursorPosition();
            let active_remnants = FindActiveRemnants(caster);
            if (active_remnants.length > 0) {
                let closest_remnant_position = active_remnants[0].GetAbsOrigin();
                let closest_distance = (closest_remnant_position - target_loc as Vector).Length2D();
                for (const [_, remnant] of GameFunc.iPair(active_remnants)) {
                    if ((remnant.GetAbsOrigin() - target_loc as Vector).Length2D() < closest_distance) {
                        closest_remnant_position = remnant.GetAbsOrigin();
                        closest_distance = (closest_remnant_position - target_loc as Vector).Length2D();
                    }
                    let nearby_enemies = FindUnitsInRadius(caster.GetTeamNumber(), remnant.GetAbsOrigin(), undefined, this.GetSpecialValueFor("effect_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, enemy] of GameFunc.iPair(nearby_enemies)) {
                        ApplyDamage({
                            victim: enemy,
                            attacker: caster,
                            damage: this.GetSpecialValueFor("damage"),
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                            ability: this
                        });
                    }
                    remnant.EmitSound("Hero_EmberSpirit.FireRemnant.Explode");
                    GridNav.DestroyTreesAroundPoint(remnant.GetAbsOrigin(), this.GetSpecialValueFor("effect_radius"), false);
                    if (remnant != caster) {
                        remnant.ForceKill(false);
                    }
                    if (caster.HasModifier("modifier_imba_fire_remnant_timer")) {
                        caster.RemoveModifierByName("modifier_imba_fire_remnant_timer");
                    }
                }
                ProjectileHelper.ProjectileDodgePlus(caster);
                caster.RemoveModifierByName("modifier_imba_sleight_of_fist_caster");
                FindClearSpaceForUnit(caster, closest_remnant_position, true);
                caster.EmitSound("Hero_EmberSpirit.FireRemnant.Stop");
                this.SetActivated(false);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_fire_remnant_timer extends BaseModifier_Plus {
    IsHidden(): boolean {
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
}
