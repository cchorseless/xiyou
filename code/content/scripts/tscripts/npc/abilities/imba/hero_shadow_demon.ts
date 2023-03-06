
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_shadow_demon_disruption extends BaseAbility_Plus {
    GetCooldown(level: number): number {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_shadow_demon_disruption_charges")) {
            return super.GetCooldown(level);
        } else {
            return 0;
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = ability.GetCursorTarget();
        let responses_enemy = {
            "1": "shadow_demon_shadow_demon_ability_disruption_01",
            "2": "shadow_demon_shadow_demon_ability_disruption_02",
            "3": "shadow_demon_shadow_demon_ability_disruption_03",
            "4": "shadow_demon_shadow_demon_ability_disruption_04",
            "5": "shadow_demon_shadow_demon_ability_disruption_20"
        }
        let responses_friendly = {
            "1": "shadow_demon_shadow_demon_ability_disruption_09",
            "2": "shadow_demon_shadow_demon_ability_disruption_10",
            "3": "shadow_demon_shadow_demon_ability_disruption_11",
            "4": "shadow_demon_shadow_demon_ability_disruption_12"
        }
        let responses_self = {
            "1": "shadow_demon_shadow_demon_ability_disruption_15",
            "2": "shadow_demon_shadow_demon_ability_disruption_16",
            "3": "shadow_demon_shadow_demon_ability_disruption_17",
            "4": "shadow_demon_shadow_demon_ability_disruption_18",
            "5": "shadow_demon_shadow_demon_ability_disruption_19"
        }
        let cast_sound = "Hero_ShadowDemon.Disruption.Cast";
        let modifier_disruption = "modifier_imba_disruption_hidden";
        if (target.GetTeam() != this.GetCasterPlus().GetTeam()) {
            if (target.TriggerSpellAbsorb(this)) {
                return undefined;
            }
        }
        let disruption_duration = ability.GetSpecialValueFor("disruption_duration");
        EmitSoundOn(cast_sound, caster);
        if (target.GetTeamNumber() != caster.GetTeamNumber()) {
            EmitSoundOn(GFuncRandom.RandomValue(responses_enemy), caster);
        } else if (target == caster) {
            EmitSoundOn(GFuncRandom.RandomValue(responses_self), caster);
        } else {
            EmitSoundOn(GFuncRandom.RandomValue(responses_friendly), caster);
        }
        target.AddNewModifier(caster, ability, modifier_disruption, {
            duration: disruption_duration
        });
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_shadow_demon_disruption_charges") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_shadow_demon_disruption_charges")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_shadow_demon_disruption_charges"), "modifier_special_bonus_imba_shadow_demon_disruption_charges", {});
        }
    }
}
@registerModifier()
export class modifier_imba_disruption_hidden extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public responses_enemy_end: any;
    public responses_friendly_end: any;
    public disruption_sound: any;
    public disruption_end_sound: any;
    public particle_disruption: any;
    public particle_disrupted: any;
    public modifier_illusion_soul: any;
    public modifier_shadow_poison: any;
    public modifier_disrupted: any;
    public illusion_count: number;
    public illusion_duration: number;
    public illusion_outgoing_damage: number;
    public illusion_incoming_damage: number;
    public disrupted_reality_damage_per_stack: number;
    public disrupted_reality_interval: number;
    public disrupted_reality_duration: number;
    public current_health: any;
    public modifier_shadow_poison_handle: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return false;
        }
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.responses_enemy_end = {
            "1": "shadow_demon_shadow_demon_ability_disruption_05",
            "2": "shadow_demon_shadow_demon_ability_disruption_06",
            "3": "shadow_demon_shadow_demon_ability_disruption_07",
            "4": "shadow_demon_shadow_demon_ability_disruption_08"
        }
        this.responses_friendly_end = {
            "1": "shadow_demon_shadow_demon_ability_disruption_13",
            "2": "shadow_demon_shadow_demon_ability_disruption_14"
        }
        this.disruption_sound = "Hero_ShadowDemon.Disruption";
        this.disruption_end_sound = "Hero_ShadowDemon.Disruption.End";
        this.particle_disruption = "particles/units/heroes/hero_shadow_demon/shadow_demon_disruption.vpcf";
        this.particle_disrupted = "particles/units/heroes/hero_shadow_demon/shadow_demon_shadow_poison_impact.vpcf";
        this.modifier_illusion_soul = "modifier_imba_disruption_soul_illusion";
        this.modifier_shadow_poison = "modifier_shadow_poison_debuff";
        this.modifier_disrupted = "modifier_imba_disruption_disrupted_reality_debuff";
        this.illusion_count = this.ability.GetSpecialValueFor("illusion_count");
        this.illusion_duration = this.ability.GetSpecialValueFor("illusion_duration");
        this.illusion_outgoing_damage = this.ability.GetSpecialValueFor("illusion_outgoing_damage");
        this.illusion_incoming_damage = this.ability.GetSpecialValueFor("illusion_incoming_damage");
        this.disrupted_reality_damage_per_stack = this.ability.GetSpecialValueFor("disrupted_reality_damage_per_stack");
        this.disrupted_reality_interval = this.ability.GetSpecialValueFor("disrupted_reality_interval");
        this.disrupted_reality_duration = this.ability.GetSpecialValueFor("disrupted_reality_duration");
        EmitSoundOn(this.disruption_sound, this.parent);
        if (IsServer()) {
            this.parent.AddNoDraw();
            let particle_disruption_fx = ResHelper.CreateParticleEx(this.particle_disruption, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
            ParticleManager.SetParticleControl(particle_disruption_fx, 0, this.parent.GetAbsOrigin() + Vector(0, 0, 100) as Vector);
            ParticleManager.SetParticleControl(particle_disruption_fx, 4, Vector(0, 0, 0));
            this.AddParticle(particle_disruption_fx, false, false, -1, false, false);
            this.current_health = this.parent.GetHealth();
            this.StartIntervalThink(this.disrupted_reality_interval);
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let stacks = undefined;
        if (this.parent.HasModifier(this.modifier_shadow_poison)) {
            this.modifier_shadow_poison_handle = this.parent.FindModifierByName(this.modifier_shadow_poison);
            if (this.modifier_shadow_poison_handle) {
                stacks = this.modifier_shadow_poison_handle.GetStackCount();
            }
        }
        if (!stacks) {
            return;
        }
        let damage = this.disrupted_reality_damage_per_stack * this.disrupted_reality_interval * stacks;
        let damageTable = {
            victim: this.parent,
            attacker: this.caster,
            damage: damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_BYPASSES_INVULNERABILITY,
            ability: this.ability
        }
        ApplyDamage(damageTable);
        let particle_disrupted_fx = ResHelper.CreateParticleEx(this.particle_disrupted, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(particle_disrupted_fx, 0, this.parent.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_disrupted_fx);
    }
    BeDestroy(): void {
        StopSoundOn(this.disruption_sound, this.parent);
        EmitSoundOn(this.disruption_end_sound, this.parent);
        if (IsServer()) {
            if (!this.parent.IsAlive()) {
                return;
            }
            this.parent.RemoveNoDraw();
            let illusions = this.caster.CreateIllusion(this.parent, {
                outgoing_damage: this.illusion_outgoing_damage,
                incoming_damage: this.illusion_incoming_damage,
                bounty_base: this.GetCasterPlus().GetIllusionBounty(),
                duration: this.illusion_duration
            }, this.illusion_count);
            for (const [_, illusion] of GameFunc.iPair(illusions)) {
                illusion.SetHealth(this.current_health);
                illusion.AddNewModifier(this.caster, this.ability, this.modifier_illusion_soul, {
                    soul_target: this.parent.entindex()
                });
            }
            let stacks;
            if (this.parent.HasModifier(this.modifier_shadow_poison)) {
                let modifier_shadow_poison_handle = this.parent.FindModifierByName(this.modifier_shadow_poison);
                if (modifier_shadow_poison_handle) {
                    stacks = modifier_shadow_poison_handle.GetStackCount();
                    let disrupt_modifier = this.parent.AddNewModifier(this.caster, this.ability, this.modifier_disrupted, {
                        duration: this.disrupted_reality_duration * (1 - this.parent.GetStatusResistance())
                    });
                    if (disrupt_modifier) {
                        disrupt_modifier.SetStackCount(stacks);
                    }
                }
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_disruption_soul_illusion extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public soul_illusion_curr_hp_damage: number;
    public soul_illusion_curr_hp_target_damage: number;
    public target: IBaseNpc_Plus;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.soul_illusion_curr_hp_damage = this.ability.GetSpecialValueFor("soul_illusion_curr_hp_damage");
        this.soul_illusion_curr_hp_target_damage = this.ability.GetSpecialValueFor("soul_illusion_curr_hp_target_damage");
        if (!IsServer()) {
            return;
        }
        if (params.soul_target) {
            this.target = EntIndexToHScript(params.soul_target) as IBaseNpc_Plus;
            if (!this.target || !IsValidEntity(this.target)) {
                this.target = undefined;
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PURE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PURE)
    CC_GetModifierProcAttack_BonusDamage_Pure(keys: ModifierAttackEvent): number {
        if (!IsServer()) {
            return;
        }
        let target = keys.target;
        let attacker = keys.attacker;
        if (this.parent == attacker) {
            let bonus_damage;
            if (this.target && this.target.IsAlive()) {
                if (this.target == target) {
                    bonus_damage = this.target.GetHealth() * this.soul_illusion_curr_hp_target_damage * 0.01;
                } else {
                    bonus_damage = this.target.GetHealth() * this.soul_illusion_curr_hp_damage * 0.01;
                }
            } else {
                bonus_damage = 0;
            }
            return bonus_damage;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.target.GetHealth() * this.soul_illusion_curr_hp_damage * 0.01;
    }
}
@registerModifier()
export class modifier_imba_disruption_disrupted_reality_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public disrupted_reality_ms_slow_stack: number;
    public disrupted_reality_as_slow_stack: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.disrupted_reality_ms_slow_stack = this.ability.GetSpecialValueFor("disrupted_reality_ms_slow_stack");
        this.disrupted_reality_as_slow_stack = this.ability.GetSpecialValueFor("disrupted_reality_as_slow_stack");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            4: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.disrupted_reality_ms_slow_stack * this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.disrupted_reality_as_slow_stack * this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.disrupted_reality_ms_slow_stack * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    CC_OnTooltip2(): number {
        return this.disrupted_reality_as_slow_stack * this.GetStackCount();
    }
}
@registerAbility()
export class imba_shadow_demon_soul_catcher extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_shadow_demon_soul_catcher_cd");
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.GetCursorPosition();
        let responses_catch = {
            "1": "shadow_demon_shadow_demon_ability_soul_catcher_01",
            "2": "shadow_demon_shadow_demon_ability_soul_catcher_02",
            "3": "shadow_demon_shadow_demon_ability_soul_catcher_03",
            "4": "shadow_demon_shadow_demon_ability_soul_catcher_08"
        }
        let responses_miss = {
            "1": "shadow_demon_shadow_demon_ability_soul_catcher_04",
            "2": "shadow_demon_shadow_demon_ability_soul_catcher_05",
            "3": "shadow_demon_shadow_demon_ability_soul_catcher_06",
            "4": "shadow_demon_shadow_demon_ability_soul_catcher_07"
        }
        let cast_sound = "Hero_ShadowDemon.Soul_Catcher.Cast";
        let hit_sound = "Hero_ShadowDemon.Soul_Catcher";
        let modifier_debuff = "modifier_imba_soul_catcher_debuff";
        let modifier_buff = "modifier_imba_soul_catcher_buff";
        let particle_ground = "particles/units/heroes/hero_shadow_demon/shadow_demon_soul_catcher_v2_projected_ground.vpcf";
        let particle_hit = "particles/units/heroes/hero_shadow_demon/shadow_demon_soul_catcher.vpcf";
        let particle_hit_ally = "particles/hero/shadow_demon/shadow_demon_soul_catcher_cast_ally.vpcf";
        let modifier_demonic_purge = "modifier_imba_demonic_purge_debuff";
        let health_lost = ability.GetSpecialValueFor("health_lost");
        let radius = ability.GetSpecialValueFor("radius");
        let duration = ability.GetSpecialValueFor("duration");
        EmitSoundOn(cast_sound, caster);
        let particle_ground_fx = ResHelper.CreateParticleEx(particle_ground, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(particle_ground_fx, 0, target_point);
        ParticleManager.SetParticleControl(particle_ground_fx, 1, target_point);
        ParticleManager.SetParticleControl(particle_ground_fx, 2, target_point);
        ParticleManager.SetParticleControl(particle_ground_fx, 3, Vector(radius, 0, 0));
        this.AddTimer(0.1, () => {
            ParticleManager.DestroyParticle(particle_ground_fx, false);
            ParticleManager.ReleaseParticleIndex(particle_ground_fx);
        });
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        let total_health_stolen = 0;
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let valid_enemy = true;
            if (enemy.IsInvulnerable() && !enemy.HasModifier("modifier_imba_disruption_hidden")) {
                valid_enemy = false;
            }
            if (!enemy.IsAlive()) {
                valid_enemy = false;
            }
            if (enemy.IsMagicImmune() && !enemy.HasModifier(modifier_demonic_purge)) {
                valid_enemy = false;
            }
            if (valid_enemy) {
                EmitSoundOn(hit_sound, enemy);
                let particle_hit_fx = ResHelper.CreateParticleEx(particle_hit, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
                ParticleManager.SetParticleControl(particle_hit_fx, 1, enemy.GetAbsOrigin());
                ParticleManager.SetParticleControl(particle_hit_fx, 2, enemy.GetAbsOrigin());
                ParticleManager.SetParticleControl(particle_hit_fx, 3, Vector(1, 0, 0));
                ParticleManager.SetParticleControl(particle_hit_fx, 4, enemy.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle_hit_fx);
                let health_steal = enemy.GetHealth() * health_lost * 0.01;
                total_health_stolen = total_health_stolen + health_steal;
                let damageTable = {
                    victim: enemy,
                    attacker: caster,
                    damage: health_steal,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_BYPASSES_INVULNERABILITY,
                    ability: ability
                }
                ApplyDamage(damageTable);
                enemy.AddNewModifier(enemy, ability, modifier_debuff, {
                    duration: duration * (1 - enemy.GetStatusResistance()),
                    health_stolen: health_steal
                });
            }
        }
        if (RollPercentage(75)) {
            if (GameFunc.GetCount(enemies) > 0) {
                EmitSoundOn(GFuncRandom.RandomValue(responses_catch), caster);
            } else {
                EmitSoundOn(GFuncRandom.RandomValue(responses_miss), caster);
            }
        }
        if (GameFunc.GetCount(enemies) <= 0) {
            return;
        }
        let allies = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
        if (GameFunc.GetCount(allies) <= 0) {
            return;
        }
        let allied_heal = total_health_stolen / GameFunc.GetCount(allies);
        for (const [_, ally] of GameFunc.iPair(allies)) {
            let valid_ally = true;
            if (ally.IsInvulnerable() && !ally.HasModifier("modifier_imba_disruption_hidden")) {
                valid_ally = false;
            }
            if (valid_ally) {
                let particle_hit_ally_fx = ResHelper.CreateParticleEx(particle_hit_ally, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ally);
                ParticleManager.SetParticleControl(particle_hit_ally_fx, 1, ally.GetAbsOrigin());
                ParticleManager.SetParticleControl(particle_hit_ally_fx, 2, ally.GetAbsOrigin());
                ParticleManager.SetParticleControl(particle_hit_ally_fx, 3, Vector(1, 0, 0));
                ParticleManager.SetParticleControl(particle_hit_ally_fx, 4, ally.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle_hit_ally_fx);
                ally.AddNewModifier(caster, ability, modifier_buff, {
                    duration: duration,
                    allied_heal: allied_heal
                });
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_shadow_demon_soul_catcher_cd") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_shadow_demon_soul_catcher_cd")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_shadow_demon_soul_catcher_cd"), "modifier_special_bonus_imba_shadow_demon_soul_catcher_cd", {});
        }
    }
}
@registerModifier()
export class modifier_imba_soul_catcher_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_buff: any;
    public health_returned_pct: number;
    public particle_buff_fx: any;
    public allied_heal: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_buff = "particles/hero/shadow_demon/shadow_demon_soul_catcher_ally.vpcf";
        this.health_returned_pct = this.ability.GetSpecialValueFor("health_returned_pct");
        if (!IsServer()) {
            return;
        }
        this.particle_buff_fx = ResHelper.CreateParticleEx(this.particle_buff, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(this.particle_buff_fx, 0, this.parent.GetAbsOrigin());
        this.AddParticle(this.particle_buff_fx, false, false, -1, false, false);
        this.allied_heal = params.allied_heal;
        if (!this.allied_heal) {
            return;
        }
        this.AddTimer(FrameTime(), () => {
            this.parent.Heal(this.allied_heal, this.GetAbilityPlus());
        });
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS)
    CC_GetModifierExtraHealthBonus(): number {
        if (this.allied_heal) {
            return this.allied_heal;
        }
        return 0;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let health_lost = this.allied_heal * this.health_returned_pct * 0.01;
        if (this.parent.GetMaxHealth() - this.parent.GetHealth() <= health_lost) {
            return;
        }
        let damageTable = {
            victim: this.parent,
            attacker: this.parent,
            damage: health_lost,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL,
            ability: this.ability
        }
        ApplyDamage(damageTable);
    }
}
@registerModifier()
export class modifier_imba_soul_catcher_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_debuff: any;
    public modifier_demonic_purge: any;
    public shadow_poison_ability: any;
    public health_returned_pct: number;
    public unleashed_projectile_count: number;
    public particle_debuff_fx: any;
    public health_stolen: any;
    public soul_taken: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        if (this.parent.HasModifier(this.modifier_demonic_purge)) {
            return false;
        }
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetAbilityPlus().GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_debuff = "particles/units/heroes/hero_shadow_demon/shadow_demon_soul_catcher_debuff.vpcf";
        this.modifier_demonic_purge = "modifier_imba_demonic_purge_debuff";
        this.shadow_poison_ability = "imba_shadow_demon_shadow_poison";
        this.health_returned_pct = this.ability.GetSpecialValueFor("health_returned_pct");
        this.unleashed_projectile_count = this.ability.GetSpecialValueFor("unleashed_projectile_count");
        if (!IsServer()) {
            return;
        }
        this.particle_debuff_fx = ResHelper.CreateParticleEx(this.particle_debuff, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(this.particle_debuff_fx, 0, this.parent.GetAbsOrigin());
        this.AddParticle(this.particle_debuff_fx, false, false, -1, false, false);
        this.health_stolen = params.health_stolen;
        this.soul_taken = false;
        if (this.parent.HasModifier("modifier_imba_disruption_hidden")) {
            this.soul_taken = true;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_DEATH,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let unit = keys.unit;
        if (unit == this.parent && this.parent.IsRealUnit()) {
            if (this.caster.HasAbility(this.shadow_poison_ability)) {
                let shadow_poison_ability_handle = this.caster.FindAbilityByName(this.shadow_poison_ability) as imba_shadow_demon_shadow_poison;
                if (shadow_poison_ability_handle && shadow_poison_ability_handle.GetLevel() >= 1) {
                    let origin_point = this.parent.GetAbsOrigin();
                    let direction = this.parent.GetForwardVector();
                    let rotation_per_projectile = 360 / this.unleashed_projectile_count;
                    let new_direction: Vector;
                    for (let i = 0; i < this.unleashed_projectile_count; i++) {
                        let angle = QAngle(0, (i - 1) * (rotation_per_projectile), 0);
                        new_direction = RotatePosition(origin_point, angle, direction);
                        shadow_poison_ability_handle.FireShadowPoisonProjectile(origin_point, new_direction, true);
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.health_stolen;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.health_stolen) {
            return;
        }
        if (!this.soul_taken) {
            let health_restore = this.health_stolen * this.health_returned_pct * 0.01;
            this.parent.Heal(health_restore, this.GetAbilityPlus());
        }
    }
}
@registerAbility()
export class imba_shadow_demon_shadow_poison extends BaseAbility_Plus {
    public shadow_poison_projectileID: { [K: string]: any };
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_shadow_demon_shadow_poison_cd");
    }
    OnUpgrade(): void {
        if (this.GetLevel() == 1 && this.GetCasterPlus().HasAbility("imba_shadow_demon_shadow_poison_release")) {
            let poison_ability = this.GetCasterPlus().findAbliityPlus<imba_shadow_demon_shadow_poison_release>("imba_shadow_demon_shadow_poison_release");
            if (poison_ability) {
                poison_ability.SetLevel(1);
            }
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = ability.GetCursorPosition();
        let cast_sound = "Hero_ShadowDemon.ShadowPoison.Cast";
        EmitSoundOn(cast_sound, caster);
        ability.FireShadowPoisonProjectile(caster.GetAbsOrigin(), target_point, false);
    }
    FireShadowPoisonProjectile(origin_point: Vector, target_point: Vector, grudges: boolean = false) {
        let caster = this.GetCasterPlus();
        let ability = this;
        let projectile_sound = "Hero_ShadowDemon.ShadowPoison";
        let particle_poison = "particles/units/heroes/hero_shadow_demon/shadow_demon_shadow_poison_projectile.vpcf";
        let radius = ability.GetSpecialValueFor("radius");
        let speed = ability.GetSpecialValueFor("speed");
        EmitSoundOnLocationWithCaster(origin_point, projectile_sound, caster);
        let direction = (target_point - origin_point as Vector).Normalized();
        let shadow_projectile = {
            Ability: ability,
            EffectName: particle_poison,
            vSpawnOrigin: origin_point,
            fDistance: ability.GetCastRange(target_point, undefined),
            fStartRadius: radius,
            fEndRadius: radius,
            Source: caster,
            bHasFrontalCone: false,
            bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,
            bDeleteOnHit: false,
            vVelocity: direction * speed * Vector(1, 1, 0) as Vector,
            fExpireTime: GameRules.GetGameTime() + 10.0,
            bProvidesVision: true,
            iVisionRadius: radius,
            iVisionTeamNumber: caster.GetTeamNumber()
        }
        let projectileID = ProjectileManager.CreateLinearProjectile(shadow_projectile);
        if (!this.shadow_poison_projectileID) {
            this.shadow_poison_projectileID = {}
        }
        this.shadow_poison_projectileID[projectileID + ""] = {
            targets: 0,
            isGrudge: grudges
        }
    }
    OnProjectileHitHandle(target: IBaseNpc_Plus, location: Vector, projectileID: ProjectileID) {
        if (!target) {
            delete this.shadow_poison_projectileID[projectileID + ""];
            return;
        }
        if (target.IsInvulnerable() && !target.HasModifier("modifier_imba_disruption_hidden")) {
            return;
        }
        if (target.IsMagicImmune() && !target.HasModifier("modifier_imba_demonic_purge_debuff")) {
            return;
        }
        if (target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() && !target.HasModifier("modifier_imba_disruption_soul_illusion")) {
            return;
        }
        if (this.shadow_poison_projectileID[projectileID + ""]) {
            this.shadow_poison_projectileID[projectileID + ""].targets = this.shadow_poison_projectileID[projectileID + ""].targets + 1;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let particle_impact = "particles/units/heroes/hero_shadow_demon/shadow_demon_shadow_poison_impact.vpcf";
        let hit_sound = "Hero_ShadowDemon.ShadowPoison.Impact";
        let soul_catcher_ability = "imba_shadow_demon_soul_catcher";
        let modifier_shadow_poison = "modifier_shadow_poison_debuff";
        let modifier_elated_buff = "modifier_imba_demonic_purge_elated_demon_buff";
        let hit_damage = ability.GetSpecialValueFor("hit_damage") * (1 + (caster.GetTalentValue("special_bonus_imba_shadow_demon_shadow_poison_damage") * 0.01));
        let stack_duration = ability.GetSpecialValueFor("stack_duration");
        if (this.shadow_poison_projectileID[projectileID].isGrudge && caster.HasAbility(soul_catcher_ability)) {
            let soul_catcher_ability_handle = caster.FindAbilityByName(soul_catcher_ability);
            if (soul_catcher_ability_handle && soul_catcher_ability_handle.GetLevel() >= 1) {
                let unleashed_hit_damage = soul_catcher_ability_handle.GetSpecialValueFor("unleashed_hit_damage");
                if (unleashed_hit_damage > 0) {
                    target.Purge(true, false, false, false, false);
                    let damageTable = {
                        victim: target,
                        attacker: caster,
                        damage: unleashed_hit_damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        ability: ability
                    }
                    ApplyDamage(damageTable);
                }
            }
        }
        EmitSoundOn(hit_sound, target);
        let particle_impact_fx = ResHelper.CreateParticleEx(particle_impact, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.SetParticleControl(particle_impact_fx, 0, target.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_impact_fx);
        if (!target.HasModifier(modifier_shadow_poison)) {
            target.AddNewModifier(target, ability, modifier_shadow_poison, {
                duration: stack_duration * (1 - target.GetStatusResistance())
            });
        }
        let additional_stacks = 0;
        if (caster.HasModifier(modifier_elated_buff) && this.shadow_poison_projectileID[projectileID].targets == 1) {
            let modifier_elated_buff_handle = caster.FindModifierByName(modifier_elated_buff);
            if (modifier_elated_buff_handle) {
                additional_stacks = modifier_elated_buff_handle.GetStackCount();
            }
        }
        let total_stacks = 1 + additional_stacks;
        let modifier_shadow_poison_handle = target.FindModifierByName(modifier_shadow_poison);
        if (modifier_shadow_poison_handle) {
            for (let i = 0; i < total_stacks; i++) {
                modifier_shadow_poison_handle.IncrementStackCount();
                modifier_shadow_poison_handle.ForceRefresh();
            }
        }
        let damageTable = {
            victim: target,
            attacker: caster,
            damage: hit_damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: ability
        }
        ApplyDamage(damageTable);
    }

    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_shadow_demon_shadow_poison_cd") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_shadow_demon_shadow_poison_cd")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_shadow_demon_shadow_poison_cd"), "modifier_special_bonus_imba_shadow_demon_shadow_poison_cd", {});
        }
    }
}
@registerModifier()
export class modifier_shadow_poison_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public impact_sound: any;
    public particle_ui: any;
    public particle_4stacks: string;
    public particle_kill: any;
    public particle_illusion_blast: any;
    public kill_responses: any;
    public modifier_demonic_purge: any;
    public stack_damage: number;
    public max_multiply_stacks: number;
    public efficient_multiplier: any;
    public linked_pain_dmg_spread_pct: number;
    public linked_pain_radius: number;
    public efficient_upwards_limit: any;
    public particle_ui_fx: any;
    public particle_4stacks_fx: ParticleID;
    public particle_kill_fx: any;
    highest_stack: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        if (this.parent.HasModifier(this.modifier_demonic_purge)) {
            return false;
        }
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetAbilityPlus().GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.impact_sound = "Hero_ShadowDemon.ShadowPoison.Impact";
        this.particle_ui = "particles/units/heroes/hero_shadow_demon/shadow_demon_shadow_poison_stackui.vpcf";
        this.particle_4stacks = "particles/units/heroes/hero_shadow_demon/shadow_demon_shadow_poison_4stack.vpcf";
        this.particle_kill = "particles/units/heroes/hero_shadow_demon/shadow_demon_shadow_poison_kill.vpcf";
        this.particle_illusion_blast = "particles/hero/shadow_demon/shadow_demon_shadow_poison_soul_illusion_blast.vpcf";
        this.kill_responses = {
            "1": "shadow_demon_shadow_demon_ability_shadow_poison_05",
            "2": "shadow_demon_shadow_demon_ability_shadow_poison_06",
            "3": "shadow_demon_shadow_demon_ability_shadow_poison_08",
            "4": "shadow_demon_shadow_demon_ability_shadow_poison_09",
            "5": "shadow_demon_shadow_demon_ability_shadow_poison_10"
        }
        this.modifier_demonic_purge = "modifier_imba_demonic_purge_debuff";
        this.stack_damage = this.ability.GetSpecialValueFor("stack_damage") * (1 + (this.caster.GetTalentValue("special_bonus_imba_shadow_demon_shadow_poison_damage") * 0.01));
        this.max_multiply_stacks = this.ability.GetSpecialValueFor("max_multiply_stacks");
        this.efficient_multiplier = this.ability.GetSpecialValueFor("efficient_multiplier");
        this.linked_pain_dmg_spread_pct = this.ability.GetSpecialValueFor("linked_pain_dmg_spread_pct");
        this.linked_pain_radius = this.ability.GetSpecialValueFor("linked_pain_radius");
        this.efficient_upwards_limit = this.ability.GetSpecialValueFor("efficient_upwards_limit");
        this.particle_ui_fx = ResHelper.CreateParticleEx(this.particle_ui, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(this.particle_ui_fx, 0, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_ui_fx, 1, Vector(0, 1, 0));
        this.AddParticle(this.particle_ui_fx, true, false, -1, false, true);
    }
    OnStackCountChanged(p_0: number,): void {
        let stacks = this.GetStackCount();
        let first_digit = stacks % 10;
        let second_digit = 0;
        if (stacks >= 10) {
            second_digit = 1;
        }
        if (stacks > 19) {
            first_digit = 9;
        }
        ParticleManager.SetParticleControl(this.particle_ui_fx, 1, Vector(second_digit, first_digit, 0));
        if (stacks >= 4 && !this.particle_4stacks_fx) {
            this.particle_4stacks_fx = ResHelper.CreateParticleEx(this.particle_4stacks, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(this.particle_4stacks_fx, 0, this.parent.GetAbsOrigin());
            this.AddParticle(this.particle_4stacks_fx, true, false, -1, false, false);
        }
    }
    CalculateShadowPoisonDamage() {
        let stacks = this.GetStackCount();
        let multiplier = 2;
        if (this.highest_stack) {
            if (stacks < (this.highest_stack - this.efficient_upwards_limit)) {
                stacks = stacks + this.efficient_upwards_limit;
            } else {
                stacks = this.highest_stack;
            }
        }
        if (stacks <= this.max_multiply_stacks) {
            multiplier = multiplier ^ (stacks - 1);
        } else {
            multiplier = (multiplier ^ (this.max_multiply_stacks - 1)) * this.efficient_multiplier ^ (stacks - this.max_multiply_stacks);
        }
        let damage = this.stack_damage * multiplier;
        return damage;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.CalculateShadowPoisonDamage();
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.particle_kill_fx = ResHelper.CreateParticleEx(this.particle_kill, ParticleAttachment_t.PATTACH_ABSORIGIN, this.parent);
        ParticleManager.SetParticleControlEnt(this.particle_kill_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.particle_kill_fx, 2, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.particle_kill_fx, 3, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", Vector(1, 0, 0), true);
        ParticleManager.ReleaseParticleIndex(this.particle_kill_fx);
        if (!this.parent.IsIllusion() && this.parent.IsAlive()) {
            EmitSoundOn(this.impact_sound, this.caster);
            let damage = this.CalculateShadowPoisonDamage();
            let damageTable = {
                victim: this.parent,
                attacker: this.caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.ability
            }
            ApplyDamage(damageTable);
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.parent, damage, undefined);
            if (!this.parent.IsAlive()) {
                if (RollPercentage(20)) {
                    EmitSoundOn(GFuncRandom.RandomValue(this.kill_responses), this.caster);
                }
            }
        } else if (this.parent.HasModifier("modifier_imba_disruption_soul_illusion")) {
            EmitSoundOn(this.impact_sound, this.caster);
            let linked_target;
            let soul_illusion_handle = this.parent.findBuff<modifier_imba_disruption_soul_illusion>("modifier_imba_disruption_soul_illusion");
            if (soul_illusion_handle && soul_illusion_handle.target) {
                linked_target = soul_illusion_handle.target;
            }
            let particle_illusion_blast_fx = ResHelper.CreateParticleEx(this.particle_illusion_blast, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
            ParticleManager.SetParticleControl(particle_illusion_blast_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_illusion_blast_fx);
            let damage = this.CalculateShadowPoisonDamage();
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.linked_pain_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
            let enemy_killed = false;
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let valid_enemy = true;
                if (!enemy.IsAlive() || enemy.IsMagicImmune()) {
                    valid_enemy = false;
                }
                if (enemy.IsCourier()) {
                    valid_enemy = false;
                }
                if (enemy.IsInvulnerable() && !enemy.HasModifier("modifier_imba_disruption_hidden")) {
                    valid_enemy = false;
                }
                if (valid_enemy) {
                    let actual_damage = damage;
                    if (enemy != linked_target) {
                        actual_damage = damage * this.linked_pain_dmg_spread_pct * 0.01;
                    }
                    let damageTable = {
                        victim: enemy,
                        attacker: this.parent,
                        damage: actual_damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        ability: this.ability
                    }
                    ApplyDamage(damageTable);
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, enemy, damage, undefined);
                    if (!enemy.IsAlive()) {
                        enemy_killed = true;
                    }
                }
            }
            if (enemy_killed) {
                if (!this.parent.IsAlive()) {
                    if (RollPercentage(20)) {
                        EmitSoundOn(GFuncRandom.RandomValue(this.kill_responses), this.caster);
                    }
                }
            }
        }
    }
}
@registerAbility()
export class imba_shadow_demon_shadow_poison_release extends BaseAbility_Plus {
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "Hero_ShadowDemon.ShadowPoison.Release";
        let ability_shadow_poison = "imba_shadow_demon_shadow_poison";
        let modifier_poison = "modifier_shadow_poison_debuff";
        EmitSoundOn(sound_cast, caster);
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        let debuffed_enemies: IBaseNpc_Plus[] = []
        let highest_stack = 0;
        let modifier_poison_handle;
        let stacks;
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (enemy.HasModifier(modifier_poison)) {
                modifier_poison_handle = enemy.FindModifierByName(modifier_poison);
                if (modifier_poison_handle) {
                    debuffed_enemies.push(enemy);
                    stacks = modifier_poison_handle.GetStackCount();
                    if (stacks > highest_stack) {
                        highest_stack = stacks;
                    }
                }
            }
        }
        for (const [_, enemy] of GameFunc.iPair(debuffed_enemies)) {
            modifier_poison_handle = enemy.FindModifierByName(modifier_poison) as modifier_shadow_poison_debuff;
            if (modifier_poison_handle) {
                modifier_poison_handle.highest_stack = highest_stack;
                modifier_poison_handle.Destroy();
            }
        }
        let illusions = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, illusion] of GameFunc.iPair(illusions)) {
            if (illusion.IsIllusion() && illusion.HasModifier("modifier_imba_disruption_soul_illusion") && illusion.HasModifier(modifier_poison)) {
                let modifier_poison_handle = illusion.FindModifierByName(modifier_poison);
                if (modifier_poison_handle) {
                    modifier_poison_handle.Destroy();
                }
            }
        }
    }
}
@registerAbility()
export class imba_shadow_demon_demonic_purge extends BaseAbility_Plus {
    RequiresScepterForCharges() {
        return true;
    }
    GetCooldown(level: number): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCooldown(level);
        } else {
            return 0;
        }
    }
    OnInventoryContentsChanged( /** keys */): void {
        if (this.GetCasterPlus().HasScepter()) {
            if (!this.GetCasterPlus().HasModifier("modifier_generic_charges")) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_charges", {});
            } else {
                let modifiers = this.GetCasterPlus().FindAllModifiersByName("modifier_generic_charges");
                let found_modifier = false;
                for (const [_, modifier] of GameFunc.iPair(modifiers)) {
                    if (modifier.GetAbilityPlus() && modifier.GetAbilityPlus() == this) {
                        found_modifier = true;
                        return;
                    }
                }
                if (!found_modifier) {
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_charges", {});
                }
            }
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = ability.GetCursorTarget();
        let cast_sound = "Hero_ShadowDemon.DemonicPurge.Cast";
        let cast_responses = {
            "1": "shadow_demon_shadow_demon_ability_demonic_purge_01",
            "2": "shadow_demon_shadow_demon_ability_demonic_purge_02",
            "3": "shadow_demon_shadow_demon_ability_demonic_purge_03",
            "4": "shadow_demon_shadow_demon_ability_demonic_purge_04",
            "5": "shadow_demon_shadow_demon_ability_demonic_purge_05",
            "6": "shadow_demon_shadow_demon_ability_demonic_purge_06",
            "7": "shadow_demon_shadow_demon_ability_demonic_purge_07",
            "8": "shadow_demon_shadow_demon_ability_demonic_purge_08",
            "9": "shadow_demon_shadow_demon_ability_demonic_purge_09"
        }
        let particle_cast = "particles/units/heroes/hero_shadow_demon/shadow_demon_demonic_purge_cast.vpcf";
        let modifier_debuff = "modifier_imba_demonic_purge_debuff";
        let modifier_elated_buff = "modifier_imba_demonic_purge_elated_demon_buff";
        if (target.GetTeam() != this.GetCasterPlus().GetTeam()) {
            if (target.TriggerSpellAbsorb(this)) {
                return undefined;
            }
        }
        let purge_duration = ability.GetSpecialValueFor("purge_duration");
        let elated_demon_duration = ability.GetSpecialValueFor("elated_demon_duration");
        EmitSoundOn(cast_sound, caster);
        if (RollPercentage(75)) {
            EmitSoundOn(GFuncRandom.RandomValue(cast_responses), caster);
        }
        let particle_cast_fx = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
        ParticleManager.SetParticleControl(particle_cast_fx, 0, target.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_cast_fx);
        target.Purge(true, false, false, false, false);
        target.AddNewModifier(caster, ability, modifier_debuff, {
            duration: purge_duration * (1 - target.GetStatusResistance())
        });
        if (!caster.HasModifier(modifier_elated_buff)) {
            caster.AddNewModifier(caster, ability, modifier_elated_buff, {
                duration: elated_demon_duration
            });
        }
        let modifier_elated_buff_handle = caster.FindModifierByName(modifier_elated_buff);
        if (modifier_elated_buff_handle) {
            modifier_elated_buff_handle.IncrementStackCount();
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_shadow_demon_demonic_purge_damage") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_shadow_demon_demonic_purge_damage")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_shadow_demon_demonic_purge_damage"), "modifier_special_bonus_imba_shadow_demon_demonic_purge_damage", {});
        }
    }
}
@registerModifier()
export class modifier_imba_demonic_purge_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public impact_sound: any;
    public damage_sound: string;
    public particle_modifier: any;
    public particle_break: any;
    public modifier_slow_freeze: any;
    public modifier_poison: any;
    public modifier_soul_catcher: any;
    public purge_damage: number;
    public max_slow: any;
    public min_slow: any;
    public painful_slow_reset_duration: number;
    public purge_interval: number;
    public particle_modifier_fx: any;
    public particle_break_fx: any;
    public needs_slow_recalculate: any;
    public slow_diminish_rate: any;
    public slow: any;
    public rate_tick: any;
    public modifier_shadow_poison_handle: any;
    public modifier_soul_catcher_handle: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.impact_sound = "Hero_ShadowDemon.DemonicPurge.Impact";
        this.damage_sound = "Hero_ShadowDemon.DemonicPurge.Damage";
        this.particle_modifier = "particles/hero/shadow_demon/shadow_demon_demonic_purge.vpcf";
        this.particle_break = "particles/generic_gameplay/generic_break.vpcf";
        this.modifier_slow_freeze = "modifier_imba_demonic_purge_slow_freeze";
        this.modifier_poison = "modifier_shadow_poison_debuff";
        this.modifier_soul_catcher = "modifier_imba_soul_catcher_debuff";
        this.purge_damage = this.ability.GetSpecialValueFor("purge_damage") + this.caster.GetTalentValue("special_bonus_imba_shadow_demon_demonic_purge_damage");
        this.max_slow = this.ability.GetSpecialValueFor("max_slow");
        this.min_slow = this.ability.GetSpecialValueFor("min_slow");
        this.painful_slow_reset_duration = this.ability.GetSpecialValueFor("painful_slow_reset_duration");
        this.purge_interval = this.ability.GetSpecialValueFor("purge_interval");
        EmitSoundOn(this.impact_sound, this.parent);
        let direction = (this.parent.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Normalized();
        this.particle_modifier_fx = ResHelper.CreateParticleEx(this.particle_modifier, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(this.particle_modifier_fx, 0, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_modifier_fx, 1, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_modifier_fx, 3, direction);
        ParticleManager.SetParticleControl(this.particle_modifier_fx, 4, this.parent.GetAbsOrigin());
        this.AddParticle(this.particle_modifier_fx, false, false, -1, false, false);
        if (this.caster.HasScepter()) {
            this.particle_break_fx = ResHelper.CreateParticleEx(this.particle_break, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(this.particle_break_fx, 0, this.parent.GetAbsOrigin());
            this.AddParticle(this.particle_break_fx, false, false, -1, false, true);
        }
        this.CalculateSlowDiminishRate();
        this.needs_slow_recalculate = false;
        this.StartIntervalThink(this.purge_interval);
    }
    CalculateSlowDiminishRate() {
        this.slow_diminish_rate = (this.max_slow - this.min_slow) / this.GetRemainingTime();
        this.slow = this.max_slow;
        this.rate_tick = true;
    }
    OnIntervalThink(): void {
        if (this.parent.HasModifier(this.modifier_slow_freeze)) {
            this.rate_tick = false;
            this.slow = this.max_slow;
            this.needs_slow_recalculate = true;
        } else if (this.needs_slow_recalculate) {
            this.needs_slow_recalculate = false;
            this.CalculateSlowDiminishRate();
        }
        if (this.rate_tick) {
            this.slow = this.slow - this.slow_diminish_rate * this.purge_interval;
        }
        if (IsServer()) {
            this.parent.Purge(true, false, false, false, false);
            if (!this.modifier_shadow_poison_handle) {
                if (this.parent.HasModifier(this.modifier_poison)) {
                    this.modifier_shadow_poison_handle = this.parent.FindModifierByName(this.modifier_poison);
                }
            }
            if (this.modifier_shadow_poison_handle && this.modifier_shadow_poison_handle.GetRemainingTime() > 0) {
                this.modifier_shadow_poison_handle.SetDuration(this.modifier_shadow_poison_handle.GetDuration() + this.purge_interval, true);
            }
            if (!this.modifier_soul_catcher_handle) {
                if (this.parent.HasModifier(this.modifier_soul_catcher)) {
                    this.modifier_soul_catcher_handle = this.parent.FindModifierByName(this.modifier_soul_catcher);
                }
            }
            if (this.modifier_soul_catcher_handle && this.modifier_soul_catcher_handle.GetRemainingTime() > 0) {
                this.modifier_soul_catcher_handle.SetDuration(this.modifier_soul_catcher_handle.GetDuration() + this.purge_interval, true);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow * (-1);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.caster.HasScepter()) {
            return {
                [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
            };
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let damageTable = {
            victim: this.parent,
            attacker: this.caster,
            damage: this.purge_damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            ability: this.ability
        }
        if (this.parent.IsInvulnerable() && this.parent.HasModifier("modifier_imba_disruption_hidden")) {
            damageTable.damage_flags = DOTADamageFlag_t.DOTA_DAMAGE_FLAG_BYPASSES_INVULNERABILITY;
        }
        ApplyDamage(damageTable);
    }
}
@registerModifier()
export class modifier_imba_demonic_purge_slow_freeze extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_demonic_purge_elated_demon_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public elated_demon_duration: number;
    public stack_table: number[];
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.elated_demon_duration = this.ability.GetSpecialValueFor("elated_demon_duration");
        this.stack_table = []
        if (IsServer()) {
            this.StartIntervalThink(1);
        }
    }
    OnStackCountChanged(prev_stacks: number): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetStackCount();
        if (stacks > prev_stacks) {
            this.stack_table.push(GameRules.GetGameTime());
            this.ForceRefresh();
        }
    }
    OnIntervalThink(): void {
        let repeat_needed = true;
        while (repeat_needed) {
            let item_time = this.stack_table[0];
            if (GameRules.GetGameTime() - item_time >= this.elated_demon_duration) {
                if (this.GetStackCount() == 1) {
                    this.Destroy();
                    return;
                } else {
                    this.stack_table.shift();
                    this.DecrementStackCount();
                }
            } else {
                repeat_needed = false;
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_shadow_demon_shadow_poison_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_shadow_demon_shadow_poison_cd extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_shadow_demon_soul_catcher_cd extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_shadow_demon_demonic_purge_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_shadow_demon_disruption_charges extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        let disruption_ability_handle = this.GetCasterPlus().findAbliityPlus<imba_shadow_demon_disruption>("imba_shadow_demon_disruption");
        if (!this.GetCasterPlus().HasModifier("modifier_generic_charges") && this.GetCasterPlus().HasAbility("imba_shadow_demon_disruption")) {
            if (disruption_ability_handle) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), disruption_ability_handle, "modifier_generic_charges", {});
            }
        } else {
            let modifier_charge_handler = this.GetCasterPlus().findBuff("modifier_generic_charges");
            if (modifier_charge_handler && disruption_ability_handle && modifier_charge_handler.GetAbilityPlus() && modifier_charge_handler.GetAbilityPlus() != disruption_ability_handle) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), disruption_ability_handle, "modifier_generic_charges", {});
            }
        }
    }
}
