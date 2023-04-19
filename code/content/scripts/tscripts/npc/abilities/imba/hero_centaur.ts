
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_centaur_thick_hide extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_centaur_thick_hide";
    }
    IsInnateAbility() {
        return true;
    }
}
@registerModifier()
export class modifier_imba_centaur_thick_hide extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetAbilityPlus() && !this.GetParentPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("damage_reduction_pct") * (-1);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (this.GetAbilityPlus() && !this.GetParentPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("debuff_duration_red_pct");
        }
    }
}
@registerAbility()
export class imba_centaur_hoof_stomp extends BaseAbility_Plus {
    public enemy_entindex_table: { [k: string]: boolean };
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target) - this.GetCasterPlus().GetCastRangeBonus();
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Centaur.HoofStomp");
        if (this.GetCasterPlus().GetUnitName().includes("centaur") && RandomInt(1, 100) <= 50) {
            EmitSoundOn("centaur_cent_hoof_stomp_0" + RandomInt(1, 2), this.GetCasterPlus());
        }
        let particle_stomp_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_centaur/centaur_warstomp.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(particle_stomp_fx, 0, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_stomp_fx, 1, Vector(this.GetSpecialValueFor("radius"), 1, 1));
        ParticleManager.SetParticleControl(particle_stomp_fx, 2, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_stomp_fx);
        this.enemy_entindex_table = {}
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false))) {
            this.enemy_entindex_table[enemy.entindex() + ""] = true;
            if (!enemy.IsMagicImmune()) {
                enemy.ApplyStunned(this, this.GetCasterPlus(), this.GetSpecialValueFor("stun_duration") * (1 - enemy.GetStatusResistance()));
                ApplyDamage({
                    victim: enemy,
                    damage: this.GetSpecialValueFor("stomp_damage"),
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this
                });
                if (enemy.IsRealUnit() && !enemy.IsAlive() && this.GetCasterPlus().GetUnitName().includes("centaur") && RollPercentage(25)) {
                    EmitSoundOn("centaur_cent_hoof_stomp_0" + RandomInt(4, 5), this.GetCasterPlus());
                }
            }
        }
        let buff_thinker = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_hoof_stomp_arena_thinker_buff", {
            duration: this.GetSpecialValueFor("pit_duration")
        }, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
        let debuff_thinker = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_hoof_stomp_arena_thinker_debuff", {
            duration: this.GetSpecialValueFor("pit_duration")
        }, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
    }

    // GetManaCost(level: number): number {
    //     return 0;
    // }

    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_hoof_stomp_arena_thinker_buff extends BaseModifier_Plus {
    public radius: number;
    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraDuration(): number {
        return 0.25;
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
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_hoof_stomp_arena_buff";
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        return target != this.GetCasterPlus() && !this.GetCasterPlus().HasTalent("special_bonus_imba_centaur_2");
    }
}
@registerModifier()
export class modifier_imba_hoof_stomp_arena_thinker_debuff extends BaseModifier_Plus {
    public radius: number;
    public particle_arena_fx: any;
    public enemy_entindex_table: any;
    BeCreated(keys: any): void {
        this.radius = this.GetSpecialValueFor("radius");
        if (!IsServer()) {
            return;
        }
        this.particle_arena_fx = ResHelper.CreateParticleEx("particles/hero/centaur/centaur_hoof_stomp_arena.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.particle_arena_fx, 0, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_arena_fx, 1, Vector(this.radius + 45, 1, 1));
        this.AddParticle(this.particle_arena_fx, false, false, -1, false, false);
        this.enemy_entindex_table = keys.enemy_entindex_table;
        let ability = this.GetAbilityPlus<imba_centaur_hoof_stomp>()
        if (ability.enemy_entindex_table) {
            this.enemy_entindex_table = ability.enemy_entindex_table;
            ability.enemy_entindex_table = undefined;
        }
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraDuration(): number {
        return 0.25;
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
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_hoof_stomp_arena_debuff";
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        return this.enemy_entindex_table && !this.enemy_entindex_table[target.entindex() + ""] && target.IsMagicImmune();
    }
}
@registerModifier()
export class modifier_imba_hoof_stomp_arena_buff extends BaseModifier_Plus {
    public radius: number;
    public pit_dmg_reduction: any;
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.radius = this.GetSpecialValueFor("radius");
            this.pit_dmg_reduction = this.GetSpecialValueFor("pit_dmg_reduction") * (-1);
        } else {
            this.radius = 350;
            this.pit_dmg_reduction = -10;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.pit_dmg_reduction;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (!IsServer()) {
            return;
        }
        if (!this.GetAuraOwner() || (this.GetParentPlus().GetAbsOrigin() - this.GetAuraOwner().GetAbsOrigin() as Vector).Length2D() > this.radius) {
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_hoof_stomp_arena_debuff extends BaseModifier_Plus {
    public radius: number;
    public maximum_distance: number;
    public position: Vector;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.radius = this.GetSpecialValueFor("radius");
            this.maximum_distance = this.GetSpecialValueFor("maximum_distance");
        } else {
            this.radius = 350;
            this.maximum_distance = 400;
        }
        this.position = this.GetParentPlus().GetAbsOrigin();
        if (IsServer()) {
            this.OnIntervalThink();
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        if (this.GetAuraOwner()) {
            if ((this.GetParentPlus().GetAbsOrigin() - this.GetAuraOwner().GetAbsOrigin() as Vector).Length2D() > this.radius && (this.position - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() < this.maximum_distance) {
                FindClearSpaceForUnit(this.GetParentPlus(), this.GetAuraOwner().GetAbsOrigin() + ((this.GetParentPlus().GetAbsOrigin() - this.GetAuraOwner().GetAbsOrigin() as Vector).Normalized() * this.radius) as Vector, false);
            }
            if ((this.GetParentPlus().GetAbsOrigin() - this.GetAuraOwner().GetAbsOrigin() as Vector).Length2D() <= this.radius) {
                this.position = this.GetParentPlus().GetAbsOrigin();
            }
        }
    }
}
@registerAbility()
export class imba_centaur_double_edge extends BaseAbility_Plus {
    public phase_double_edge_pfx: any;
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            this.phase_double_edge_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_centaur/centaur_double_edge_phase.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetCasterPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControl(this.phase_double_edge_pfx, 0, this.GetCasterPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(this.phase_double_edge_pfx, 3, this.GetCasterPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(this.phase_double_edge_pfx, 9, this.GetCasterPlus().GetAbsOrigin());
        }
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        if (this.phase_double_edge_pfx) {
            ParticleManager.ClearParticle(this.phase_double_edge_pfx, false);
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let target = this.GetCursorTarget();
            let sound_cast = "Hero_Centaur.DoubleEdge";
            let cast_response;
            let kill_response = "centaur_cent_doub_edge_0" + RandomInt(5, 6);
            let damage = ability.GetSpecialValueFor("damage") + (caster.GetStrength() * caster.GetTalentValue("special_bonus_imba_centaur_4") * 0.01);
            let radius = ability.GetSpecialValueFor("radius");
            if (RollPercentage(75)) {
                let cast_response_number = RandomInt(1, 11);
                while (cast_response_number == 5 || cast_response_number == 6) {
                    cast_response_number = RandomInt(1, 11);
                }
                if (cast_response_number < 10) {
                    cast_response = "centaur_cent_doub_edge_0";
                } else {
                    cast_response = "centaur_cent_doub_edge_";
                }
                cast_response = cast_response + cast_response_number;
                EmitSoundOn(cast_response, caster);
            }
            EmitSoundOn(sound_cast, caster);
            if (caster.GetTeamNumber() != target.GetTeamNumber()) {
                if (target.TriggerSpellAbsorb(ability)) {
                    return undefined;
                }
            }
            let particle_edge_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_centaur/centaur_double_edge.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster, caster);
            ParticleManager.SetParticleControl(particle_edge_fx, 0, target.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_edge_fx, 1, target.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_edge_fx, 2, target.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_edge_fx, 3, target.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_edge_fx, 4, target.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_edge_fx, 5, target.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_edge_fx, 9, target.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_edge_fx);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsMagicImmune()) {
                    let damageTable = {
                        victim: enemy,
                        attacker: caster,
                        damage: damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        ability: ability
                    }
                    ApplyDamage(damageTable);
                    let particle_edge_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_centaur/centaur_double_edge_body.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster, caster);
                    ParticleManager.SetParticleControl(particle_edge_fx, 2, enemy.GetAbsOrigin());
                    ParticleManager.SetParticleControl(particle_edge_fx, 4, enemy.GetAbsOrigin());
                    ParticleManager.SetParticleControl(particle_edge_fx, 5, enemy.GetAbsOrigin());
                    ParticleManager.SetParticleControl(particle_edge_fx, 9, enemy.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(particle_edge_fx);
                    if (!enemy.IsIllusion() && !enemy.IsAlive()) {
                        if (RollPercentage(15)) {
                            EmitSoundOn(kill_response, caster);
                        }
                    }
                }
            }
            let self_damage = math.max(damage - (this.GetCasterPlus().GetStrength() * this.GetTalentSpecialValueFor("str_damage_reduction") * 0.01), 0);
            ApplyDamage({
                victim: caster,
                attacker: caster,
                damage: self_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL,
                ability: ability
            });
        }
    }

    // GetManaCost(level: number): number {
    //     return 0;
    // }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerAbility()
export class imba_centaur_return extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_return_aura";
    }
    OnAbilityPhaseStart(): boolean {
        if (this.GetCasterPlus().findBuff<modifier_imba_return_passive>("modifier_imba_return_passive").GetStackCount() == 0) {
            return false;
        }
        return true;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let buff = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_return_bonus_damage", {
                duration: this.GetSpecialValueFor("duration")
            });
            buff.SetStackCount(this.GetCasterPlus().findBuff<modifier_imba_return_passive>("modifier_imba_return_passive").GetStackCount());
            this.GetCasterPlus().findBuff<modifier_imba_return_passive>("modifier_imba_return_passive").SetStackCount(0);
            this.GetCasterPlus().EmitSound("Hero_Centaur.Retaliate.Cast");
        }
    }

    // GetManaCost(level: number): number {
    //     return 0;
    // }

    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this);
    }
}
@registerModifier()
export class modifier_imba_return_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public aura_radius: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.aura_radius = this.ability.GetSpecialValueFor("aura_radius");
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (this.caster == target) {
            return false;
        } else {
            if (this.caster.HasTalent("special_bonus_imba_centaur_6")) {
                return false;
            }
        }
        return true;
    }
    GetAuraRadius(): number {
        return this.aura_radius;
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
        return "modifier_imba_return_passive";
    }
    IsAura(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_return_passive extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer() && this.GetAbilityPlus()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            let attacker = keys.attacker;
            let target = keys.unit;
            let particle_return = "particles/units/heroes/hero_centaur/centaur_return.vpcf";
            let particle_block_msg = "particles/msg_fx/msg_block.vpcf";
            let damage = ability.GetTalentSpecialValueFor("damage");
            let str_pct_as_damage = ability.GetSpecialValueFor("str_pct_as_damage");
            let damage_block = ability.GetSpecialValueFor("damage_block");
            if (!target.IsRealUnit()) {
                return undefined;
            }
            if (parent.PassivesDisabled()) {
                return undefined;
            }
            if (attacker.GetTeamNumber() != parent.GetTeamNumber() && parent == target && !attacker.IsOther() && !attacker.GetUnitName().includes("undying_zombie")) {
                if (!caster.HasTalent("special_bonus_imba_centaur_7")) {
                    if (keys.inflictor) {
                        return;
                    }
                } else {
                    if (keys.inflictor && keys.damage < caster.GetTalentValue("special_bonus_imba_centaur_7")) {
                        return;
                    }
                }
                let particle_return_fx = ResHelper.CreateParticleEx(particle_return, ParticleAttachment_t.PATTACH_ABSORIGIN, parent);
                ParticleManager.SetParticleControlEnt(particle_return_fx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(particle_return_fx, 1, attacker, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", attacker.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(particle_return_fx);
                if (this.GetParentPlus().GetStrength) {
                    damage = damage + (this.GetParentPlus().GetStrength() * this.GetSpecialValueFor("str_pct_as_damage") * 0.01);
                }
                ApplyDamage({
                    victim: attacker,
                    attacker: parent,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION,
                    ability: ability
                });
                if (this.GetParentPlus() == this.GetCasterPlus()) {
                    this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_return_damage_block", {
                        duration: this.GetSpecialValueFor("block_duration")
                    });
                    this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_return_damage_block_buff", {
                        duration: this.GetSpecialValueFor("block_duration"),
                        damage_block: this.GetSpecialValueFor("damage_block")
                    });
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.GetParentPlus() == keys.target && this.GetParentPlus() == this.GetCasterPlus() && this.GetStackCount() < this.GetSpecialValueFor("max_stacks") && !this.GetParentPlus().HasModifier("modifier_imba_return_bonus_damage")) {
            if (keys.attacker.IsRealUnit() || keys.attacker.IsTower()) {
                this.IncrementStackCount();
            }
        }
    }
    IsHidden(): boolean {
        return this.GetStackCount() <= 0 && this.GetParentPlus() == this.GetCasterPlus();
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_return_damage_block extends BaseModifier_Plus {
    public damage_block: number;
    Init(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.damage_block = this.GetSpecialValueFor("damage_block");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK)
    CC_GetModifierPhysical_ConstantBlock(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_return_damage_block_buff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(keys.damage_block);
        if (this.GetParentPlus().HasModifier("modifier_imba_return_damage_block")) {
            this.GetParentPlus().findBuff<modifier_imba_return_damage_block>("modifier_imba_return_damage_block").SetStackCount(this.GetParentPlus().FindModifierByName("modifier_imba_return_damage_block").GetStackCount() + this.GetStackCount());
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_imba_return_damage_block")) {
            this.GetParentPlus().findBuff<modifier_imba_return_damage_block>("modifier_imba_return_damage_block").SetStackCount(this.GetParentPlus().FindModifierByName("modifier_imba_return_damage_block").GetStackCount() - this.GetStackCount());
        }
    }
}
@registerModifier()
export class modifier_imba_return_bonus_damage extends BaseModifier_Plus {
    public bonus_damage: number;
    public attach_attack1: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_centaur/centaur_return_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        if (this.attach_attack1 == null) {
            return this.attach_attack1
        }
    }
    BeCreated(p_0: any,): void {
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
        if (!IsServer()) { return }
        this.attach_attack1 = this.GetParentPlus().ScriptLookupAttachment("attach_attack1")
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.bonus_damage * this.GetStackCount();
    }
}
@registerAbility()
export class imba_centaur_stampede extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let sound_cast = "Hero_Centaur.Stampede.Cast";
            let cast_animation = GameActivity_t.ACT_DOTA_CENTAUR_STAMPEDE;
            let modifier_haste = "modifier_imba_stampede_haste";
            let duration = this.GetSpecialValueFor("duration");
            EmitSoundOn(sound_cast, caster);
            caster.StartGesture(cast_animation);
            let bitch_be_gone = 15;
            if (RollPercentage(bitch_be_gone)) {
                EmitSoundOn("Imba.CentaurMoveBitch", caster);
            }
            let enemyteam = caster.GetTeam() == DOTATeam_t.DOTA_TEAM_GOODGUYS ? DOTATeam_t.DOTA_TEAM_BADGUYS : DOTATeam_t.DOTA_TEAM_GOODGUYS;
            let enemies = caster.GetPlayerRoot().BattleUnitManagerComp().GetAllBattleUnitAliveNpc(enemyteam);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                enemy.TempData().trampled_in_stampede = undefined;
            }
            let allies = caster.GetPlayerRoot().BattleUnitManagerComp().GetAllBattleUnitAliveNpc(caster.GetTeam());
            for (const [_, ally] of GameFunc.iPair(allies)) {
                ally.AddNewModifier(caster, this, modifier_haste, {
                    duration: duration
                });
                if (this.GetCasterPlus().HasScepter()) {
                    ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_centaur_stampede_scepter", {
                        duration: this.GetSpecialValueFor("duration")
                    });
                }
            }
        }
    }
    GetManaCost(level: number): number {
        return 800;
    }

    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this);
    }
}
@registerModifier()
export class modifier_imba_stampede_haste extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_stampede: any;
    public scepter: any;
    public modifier_trample_slow: any;
    public strength_damage: number;
    public stun_duration: number;
    public radius: number;
    public damage_reduction_scepter: number;
    public absolute_move_speed: number;
    public slow_duration: number;
    public tree_destruction_radius: number;
    public nether_ward_damage: number;
    public trample_damage: number;
    public particle_stampede_fx: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_stampede = "particles/units/heroes/hero_centaur/centaur_stampede.vpcf";
        this.scepter = this.caster.HasScepter();
        this.modifier_trample_slow = "modifier_imba_stampede_trample_slow";
        this.strength_damage = this.ability.GetSpecialValueFor("strength_damage");
        this.stun_duration = this.ability.GetSpecialValueFor("stun_duration");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.damage_reduction_scepter = this.ability.GetSpecialValueFor("damage_reduction_scepter");
        this.absolute_move_speed = this.ability.GetSpecialValueFor("absolute_move_speed");
        this.slow_duration = this.ability.GetSpecialValueFor("slow_duration");
        this.tree_destruction_radius = this.ability.GetSpecialValueFor("tree_destruction_radius");
        this.nether_ward_damage = this.ability.GetSpecialValueFor("nether_ward_damage");
        if (IsServer()) {
            if (this.caster.IsRealUnit()) {
                this.trample_damage = this.caster.GetStrength() * (this.strength_damage * 0.01);
            } else {
                this.trample_damage = this.nether_ward_damage;
            }
            this.particle_stampede_fx = ResHelper.CreateParticleEx(this.particle_stampede, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(this.particle_stampede_fx, 0, this.parent.GetAbsOrigin());
            this.AddParticle(this.particle_stampede_fx, false, false, -1, false, false);
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsMagicImmune() && !enemy.TempData().trampled_in_stampede) {
                    enemy.TempData().trampled_in_stampede = true;
                    let damageTable = {
                        victim: enemy,
                        attacker: this.parent,
                        damage: this.trample_damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        ability: this.ability
                    }
                    ApplyDamage(damageTable);
                    enemy.ApplyStunned(this.ability, this.caster, this.stun_duration * (1 - enemy.GetStatusResistance()));
                    enemy.AddNewModifier(this.caster, this.ability, this.modifier_trample_slow, {
                        duration: (this.stun_duration + this.slow_duration) * (1 - enemy.GetStatusResistance())
                    });
                    if (this.caster.HasTalent("special_bonus_imba_centaur_8") && enemy.IsRealUnit()) {
                        let bonus_stampede_duration = this.caster.GetTalentValue("special_bonus_imba_centaur_8");
                        let allies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, 50000, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false);
                        for (const [_, ally] of GameFunc.iPair(allies)) {
                            if (ally.HasModifier("modifier_imba_stampede_haste")) {
                                let modifier_haste_handler = ally.findBuff<modifier_imba_stampede_haste>("modifier_imba_stampede_haste");
                                modifier_haste_handler.SetDuration(modifier_haste_handler.GetRemainingTime() + bonus_stampede_duration, true);
                                if (ally.HasModifier("modifier_imba_centaur_stampede_scepter")) {
                                    ally.findBuff<modifier_imba_centaur_stampede_scepter>("modifier_imba_centaur_stampede_scepter").SetDuration(ally.FindModifierByName("modifier_imba_centaur_stampede_scepter").GetRemainingTime() + bonus_stampede_duration, true);
                                }
                            }
                        }
                    }
                }
            }
            if (this.scepter) {
                GridNav.DestroyTreesAroundPoint(this.parent.GetAbsOrigin(), this.tree_destruction_radius, true);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE_MIN,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE_MIN)
    CC_GetModifierMoveSpeed_AbsoluteMin(): number {
        return this.absolute_move_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_centaur_5");
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_centaur/centaur_stampede_overhead.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_centaur_stampede_scepter extends BaseModifier_Plus {
    public damage_reduction_scepter: number;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.damage_reduction_scepter = this.GetSpecialValueFor("damage_reduction_scepter") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE_MIN,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.damage_reduction_scepter;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
        };
    }
}
@registerModifier()
export class modifier_imba_stampede_trample_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public ms_slow_pct: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_slow_pct * (-1);
    }
}
@registerModifier()
export class modifier_special_bonus_imba_centaur_1 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_centaur_2 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_centaur_3 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_centaur_4 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_centaur_5 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_centaur_6 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_centaur_7 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_centaur_8 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_centaur_9 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
