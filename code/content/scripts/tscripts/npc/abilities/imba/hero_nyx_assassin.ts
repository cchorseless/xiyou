
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_nyx_assassin_impale extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnUnStolen(): void {
        let caster = this.GetCasterPlus();
        let modifier_aura = "modifier_imba_impale_suffering_aura";
        if (caster.HasModifier(modifier_aura)) {
            caster.RemoveModifierByName(modifier_aura);
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_impale_suffering_aura";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_burrowed = "modifier_nyx_assassin_burrow";
        let base_cast_range = super.GetCastRange(location, target);
        let burrow_length_increase = ability.GetSpecialValueFor("burrow_length_increase");
        if (caster.HasModifier(modifier_burrowed)) {
            return base_cast_range + burrow_length_increase;
        }
        return base_cast_range;
    }
    GetCooldown(level: number): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_burrowed = "modifier_nyx_assassin_burrow";
        let base_cooldown = super.GetCooldown(level);
        let burrow_cd_reduction = ability.GetSpecialValueFor("burrow_cd_reduction");
        if (caster.HasModifier(modifier_burrowed)) {
            return base_cooldown - burrow_cd_reduction;
        } else {
            return base_cooldown;
        }
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.GetCursorPosition();
        let sound_cast = "Hero_NyxAssassin.Impale";
        let particle_projectile = "particles/units/heroes/hero_nyx_assassin/nyx_assassin_impale.vpcf";
        let modifier_burrowed = "modifier_nyx_assassin_burrow";
        let width = ability.GetSpecialValueFor("width");
        let duration = ability.GetSpecialValueFor("duration");
        let length = ability.GetSpecialValueFor("length") + GPropertyCalculate.GetCastRangeBonus(caster);
        let speed = ability.GetSpecialValueFor("speed");
        let burrow_length_increase = ability.GetSpecialValueFor("burrow_length_increase");
        EmitSoundOn(sound_cast, caster);
        if (caster.HasModifier(modifier_burrowed)) {
            length = length + burrow_length_increase;
        }
        let direction = (target_point - caster.GetAbsOrigin() as Vector).Normalized();
        let spikes_projectile = {
            Ability: ability,
            EffectName: particle_projectile,
            vSpawnOrigin: caster.GetAbsOrigin(),
            fDistance: length,
            fStartRadius: width,
            fEndRadius: width,
            Source: caster,
            bHasFrontalCone: false,
            bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            bDeleteOnHit: false,
            vVelocity: direction * speed * Vector(1, 1, 0) as Vector,
            bProvidesVision: false,
            ExtraData: {
                main_spike: true
            }
        }
        ProjectileManager.CreateLinearProjectile(spikes_projectile);
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (!target) {
            return undefined;
        }
        if (target.IsMagicImmune()) {
            return undefined;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_impact = "Hero_NyxAssassin.Impale.Target";
        let sound_land = "Hero_NyxAssassin.Impale.TargetLand";
        let particle_impact = "particles/units/heroes/hero_nyx_assassin/nyx_assassin_impale_hit.vpcf";
        let modifier_stun = "modifier_imba_impale_stun";
        let modifier_suffering = "modifier_imba_impale_suffering";
        let slow_after_stun = false;
        let main_spike = 0;
        let impale_repeater = false;
        let repeat_duration = 0;
        if (IsServer()) {
            main_spike = ExtraData.main_spike;
        }
        if (caster.HasTalent("special_bonus_imba_nyx_assassin_7")) {
            slow_after_stun = true;
        }
        if (caster.HasTalent("special_bonus_imba_nyx_assassin_6")) {
            impale_repeater = true;
            repeat_duration = caster.GetTalentValue("special_bonus_imba_nyx_assassin_6", "repeat_duration");
        }
        let duration = 0;
        let air_time = 0;
        let air_height = 0;
        let damage_repeat_pct = 0;
        let damage = 0;
        if (main_spike == 0) {
            duration = caster.GetTalentValue("special_bonus_imba_nyx_assassin_6", "duration");
            air_time = caster.GetTalentValue("special_bonus_imba_nyx_assassin_6", "air_time");
            air_height = caster.GetTalentValue("special_bonus_imba_nyx_assassin_6", "air_height");
            damage = caster.GetTalentValue("special_bonus_imba_nyx_assassin_6", "damage");
            slow_after_stun = false;
            impale_repeater = false;
        } else {
            duration = ability.GetSpecialValueFor("duration");
            air_time = ability.GetSpecialValueFor("air_time");
            air_height = ability.GetSpecialValueFor("air_height");
            damage_repeat_pct = ability.GetSpecialValueFor("damage_repeat_pct");
            damage = ability.GetSpecialValueFor("damage");
        }
        if (caster.HasTalent("special_bonus_imba_nyx_assassin_13")) {
            damage_repeat_pct = damage_repeat_pct + caster.GetTalentValue("special_bonus_imba_nyx_assassin_13");
        }
        EmitSoundOn(sound_impact, target);
        let particle_impact_fx = ResHelper.CreateParticleEx(particle_impact, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
        ParticleManager.SetParticleControl(particle_impact_fx, 0, target.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_impact_fx);
        target.AddNewModifier(caster, ability, modifier_stun, {
            duration: duration * (1 - target.GetStatusResistance()),
            slow_after_stun: slow_after_stun
        });
        let knockbackProperties = {
            duration: air_time * (1 - target.GetStatusResistance()),
            knockback_duration: air_time * (1 - target.GetStatusResistance()),
            knockback_distance: 0,
            knockback_height: air_height
        }
        target.RemoveModifierByName("modifier_knockback");
        target.AddNewModifier(target, undefined, "modifier_knockback", knockbackProperties);
        this.AddTimer(0.5, () => {
            target.RemoveGesture(GameActivity_t.ACT_DOTA_FLAIL);
        });
        if (impale_repeater && IsServer()) {
            BaseModifier_Plus.CreateBuffThinker(caster, ability, "modifier_imba_impale_talent_thinker", {
                duration: repeat_duration
            }, target.GetAbsOrigin(), caster.GetTeamNumber(), false);
        }
        this.AddTimer(air_time, () => {
            EmitSoundOn(sound_land, target);
            let total_dmg = 0;
            let modifier_suffering_handler = target.FindAllModifiersByName("modifier_imba_impale_suffering_damage_counter");
            let suffering_damage = 0;
            if (main_spike == 1 && modifier_suffering_handler) {
                for (const [_, damage] of GameFunc.iPair(modifier_suffering_handler)) {
                    suffering_damage = suffering_damage + damage.GetStackCount();
                }
                suffering_damage = suffering_damage * damage_repeat_pct * 0.01;
                let damageTable = {
                    victim: target,
                    attacker: caster,
                    damage: suffering_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damgae_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                    ability: ability
                }
                let dmg1 = ApplyDamage(damageTable);
                total_dmg = total_dmg + dmg1;
            }
            let damageTable = {
                victim: target,
                attacker: caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: ability
            }
            let dmg2 = ApplyDamage(damageTable);
            total_dmg = total_dmg + dmg2;
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_DAMAGE, target, total_dmg, undefined);
        });
    }
}
@registerModifier()
export class modifier_imba_impale_suffering_aura extends BaseModifier_Plus {
    GetAuraRadius(): number {
        return 25000;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_imba_impale_suffering";
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_impale_suffering extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public damage_duration: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.damage_duration = this.ability.GetSpecialValueFor("damage_duration");
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let unit = keys.unit;
            let damage = keys.damage;
            if (this.parent == unit && this.parent.IsAlive()) {
                if (damage > 0) {
                    let buff = this.parent.AddNewModifier(this.parent, this.ability, "modifier_imba_impale_suffering_damage_counter", {
                        duration: this.damage_duration
                    });
                    buff.SetStackCount(math.floor(damage + 0.5));
                }
            }
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_impale_suffering_damage_counter extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
}
@registerModifier()
export class modifier_imba_impale_stun extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public slow_after_stun: any;
    public slow_duration: number;
    public slow_modifier: any;
    BeCreated(kv: any): void {
        this.parent = this.GetParentPlus();
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        if (IsServer()) {
            this.slow_after_stun = kv.slow_after_stun;
            if (this.slow_after_stun) {
                this.slow_duration = this.caster.GetTalentValue("special_bonus_imba_nyx_assassin_7", "duration");
                this.slow_modifier = "modifier_imba_impale_talent_slow";
            }
        }
    }
    BeDestroy(): void {
        if (this.slow_after_stun && !this.GetParentPlus().IsMagicImmune()) {
            this.parent.AddNewModifier(this.caster, this.ability, this.slow_modifier, {
                duration: this.slow_duration * (1 - this.parent.GetStatusResistance())
            });
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_impale_talent_slow extends BaseModifier_Plus {
    public max_distance: number;
    public caster: IBaseNpc_Plus;
    public target: IBaseNpc_Plus;
    public slow_per_movedistance: number;
    public movedistance: number;
    public movement_slow_pct: number;
    public distance_moved: number;
    public last_position: any;
    public current_position: any;
    public denominator: any;
    BeCreated(p_0: any,): void {
        this.max_distance = 200;
        this.caster = this.GetCasterPlus();
        this.target = this.GetParentPlus();
        this.slow_per_movedistance = this.caster.GetTalentValue("special_bonus_imba_nyx_assassin_7", "slow_per_movedistance");
        this.movedistance = this.caster.GetTalentValue("special_bonus_imba_nyx_assassin_7", "movedistance");
        this.movement_slow_pct = 0;
        this.distance_moved = 0;
        this.last_position = this.target.GetAbsOrigin();
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_UNIT_MOVED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_UNIT_MOVED)
    CC_OnUnitMoved(p_0: ModifierUnitEvent,): void {
        this.current_position = this.target.GetAbsOrigin();
        this.distance_moved = this.distance_moved + (this.last_position - this.current_position as Vector).Length2D();
        this.last_position = this.current_position;
        if (this.distance_moved >= this.max_distance) {
            this.distance_moved = 0;
        }
        if (this.distance_moved >= this.movedistance) {
            this.denominator = math.floor(this.distance_moved / this.movedistance);
            this.movement_slow_pct = this.movement_slow_pct + this.denominator;
            this.distance_moved = this.distance_moved - this.movedistance * this.denominator;
            this.SetStackCount(this.movement_slow_pct);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return -this.GetStackCount();
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_impale_talent_thinker extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public location: any;
    public parent: IBaseNpc_Plus;
    public sound_cast: any;
    public particle_projectile: any;
    public speed: number;
    public spike_rate: any;
    public spike_chance: number;
    public spike_spawn_min_range: number;
    public spike_spawn_max_range: number;
    public spike_aoe: any;
    BeCreated(kv: any): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.location = this.GetParentPlus().GetAbsOrigin();
        this.parent = this.GetParentPlus();
        this.sound_cast = "Hero_NyxAssassin.Impale";
        this.particle_projectile = "particles/units/heroes/hero_nyx_assassin/nyx_assassin_impale.vpcf";
        this.speed = 2000;
        this.spike_rate = this.caster.GetTalentValue("special_bonus_imba_nyx_assassin_6", "spike_rate");
        this.spike_chance = this.caster.GetTalentValue("special_bonus_imba_nyx_assassin_6", "spike_chance");
        this.spike_spawn_min_range = this.caster.GetTalentValue("special_bonus_imba_nyx_assassin_6", "spike_spawn_min_range");
        this.spike_spawn_max_range = this.caster.GetTalentValue("special_bonus_imba_nyx_assassin_6", "spike_spawn_max_range");
        this.spike_aoe = this.caster.GetTalentValue("special_bonus_imba_nyx_assassin_6", "spike_aoe");
        if (IsServer()) {
            this.StartIntervalThink(this.spike_rate);
        }
    }
    OnIntervalThink(): void {
        if (RollPercentage(this.spike_chance)) {
            let castDistance = RandomInt(this.spike_spawn_min_range, this.spike_spawn_max_range);
            let angle = RandomInt(0, 90);
            let dy = castDistance * math.sin(angle);
            let dx = castDistance * math.cos(angle);
            let quadrant = RandomInt(1, 4);
            let attackPoint;
            if (quadrant == 1) {
                attackPoint = Vector(this.location.x - dx, this.location.y + dy, this.location.z);
            } else if (quadrant == 2) {
                attackPoint = Vector(this.location.x + dx, this.location.y + dy, this.location.z);
            } else if (quadrant == 3) {
                attackPoint = Vector(this.location.x + dx, this.location.y - dy, this.location.z);
            } else {
                attackPoint = Vector(this.location.x - dx, this.location.y - dy, this.location.z);
            }
            let direction = (attackPoint - this.location as Vector).Normalized();
            this.parent.EmitSoundParams(this.sound_cast, 1, 0.01, 0);
            let spikes_projectile = {
                Ability: this.ability,
                EffectName: this.particle_projectile,
                vSpawnOrigin: this.location,
                fDistance: castDistance,
                fStartRadius: this.spike_aoe,
                fEndRadius: this.spike_aoe,
                Source: this.caster,
                bHasFrontalCone: false,
                bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                bDeleteOnHit: false,
                vVelocity: direction * this.speed * Vector(1, 1, 0) as Vector,
                bProvidesVision: false,
                ExtraData: {
                    main_spike: false
                }
            }
            ProjectileManager.CreateLinearProjectile(spikes_projectile);
        }
    }
}
@registerAbility()
export class imba_nyx_assassin_mana_burn extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_burrowed = "modifier_nyx_assassin_burrow";
        let base_cast_range = super.GetCastRange(location, target);
        let burrowed_cast_range_increase = ability.GetSpecialValueFor("burrowed_cast_range_increase");
        if (caster.HasModifier(modifier_burrowed)) {
            return base_cast_range + burrowed_cast_range_increase;
        } else {
            return base_cast_range;
        }
    }
    OnSpellStart(target?: IBaseNpc_Plus): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        target = target || this.GetCursorTarget();
        let sound_cast = "Hero_NyxAssassin.ManaBurn.Target";
        let particle_manaburn = "particles/units/heroes/hero_nyx_assassin/nyx_assassin_mana_burn.vpcf";
        let modifier_parasite = "modifier_imba_mana_burn_parasite";
        let intelligence_mult = ability.GetSpecialValueFor("intelligence_mult");
        let mana_burn_damage_pct = ability.GetSpecialValueFor("mana_burn_damage_pct");
        let parasite_duration = ability.GetSpecialValueFor("parasite_duration");
        if (caster.HasTalent("special_bonus_imba_nyx_assassin_9")) {
            parasite_duration = -1;
        }
        EmitSoundOn(sound_cast, target);
        if (target.GetTeam() != caster.GetTeam()) {
            if (target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
        }
        let particle_manaburn_fx = ResHelper.CreateParticleEx(particle_manaburn, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, target);
        ParticleManager.SetParticleControlEnt(particle_manaburn_fx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(particle_manaburn_fx);
        if (!target.HasModifier(modifier_parasite)) {
            target.AddNewModifier(caster, ability, modifier_parasite, {
                duration: parasite_duration * (1 - target.GetStatusResistance())
            });
        }
        let target_stat = 0;
        if (target.GetIntellect != undefined) {
            target_stat = target.GetIntellect();
            if (caster.HasTalent("special_bonus_imba_nyx_assassin_3")) {
                target_stat = target.GetPrimaryStatValue();
            }
        }
        let manaburn = target_stat * intelligence_mult;
        let actual_mana_burned = 0;
        let target_mana = target.GetMana();
        if (target_mana > manaburn) {
            target.ReduceMana(manaburn);
            actual_mana_burned = manaburn;
        } else {
            target.ReduceMana(target_mana);
            actual_mana_burned = target_mana;
        }
        let damage = actual_mana_burned * mana_burn_damage_pct * 0.01;
        let damageTable = {
            victim: target,
            attacker: caster,
            damage: damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: ability
        }
        ApplyDamage(damageTable);
    }
}
@registerModifier()
export class modifier_imba_mana_burn_parasite extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_flames: any;
    public modifier_charged: any;
    public parasite_mana_leech: any;
    public parasite_charge_threshold_pct: number;
    public explosion_delay: number;
    public leech_interval: number;
    public scarring_burn_pct: number;
    public scarab_retrieve: any;
    public scarab_modifier: any;
    public scarab_duration: number;
    public starting_target_mana: any;
    public charge_threshold: any;
    public last_known_target_mana: any;
    public parasite_charged_mana: any;
    public particle_flames_fx: any;
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_HERO_KILLED,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.particle_flames = "particles/hero/nyx_assassin/mana_burn_parasite_flames.vpcf";
            this.modifier_charged = "modifier_imba_mana_burn_parasite_charged";
            this.parasite_mana_leech = this.ability.GetSpecialValueFor("parasite_mana_leech");
            this.parasite_charge_threshold_pct = this.ability.GetSpecialValueFor("parasite_charge_threshold_pct");
            this.explosion_delay = this.ability.GetSpecialValueFor("explosion_delay");
            this.leech_interval = this.ability.GetSpecialValueFor("leech_interval");
            this.scarring_burn_pct = this.ability.GetSpecialValueFor("scarring_burn_pct");
            this.parasite_mana_leech = this.parasite_mana_leech * this.leech_interval;
            if (this.caster.HasTalent("special_bonus_imba_nyx_assassin_8")) {
                this.scarab_retrieve = true;
                this.scarab_modifier = "modifier_imba_mana_burn_talent_parasite";
                this.scarab_duration = this.caster.GetTalentValue("special_bonus_imba_nyx_assassin_8", "duration");
            }
            this.starting_target_mana = this.parent.GetMana();
            this.charge_threshold = this.starting_target_mana * this.parasite_charge_threshold_pct * 0.01;
            this.last_known_target_mana = this.starting_target_mana;
            this.parasite_charged_mana = 0;
            this.particle_flames_fx = ResHelper.CreateParticleEx(this.particle_flames, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControlEnt(this.particle_flames_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            this.AddParticle(this.particle_flames_fx, false, false, -1, false, false);
            this.leech_interval = this.leech_interval * (1 - this.GetParentPlus().GetStatusResistance());
            this.StartIntervalThink(this.leech_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let target_current_mana = this.parent.GetMana();
            let mana_leeched = 0;
            let mana_lost = 0;
            if (target_current_mana >= this.parasite_mana_leech) {
                this.parent.ReduceMana(this.parasite_mana_leech);
                mana_leeched = this.parasite_mana_leech;
            } else {
                this.parent.ReduceMana(target_current_mana);
                mana_leeched = target_current_mana;
            }
            this.parasite_charged_mana = this.parasite_charged_mana + mana_leeched;
            this.SetStackCount(this.parasite_charged_mana);
            if (this.parasite_charged_mana >= this.charge_threshold) {
                let modifier_charged_handler = this.parent.AddNewModifier(this.caster, this.ability, this.modifier_charged, {
                    duration: this.explosion_delay * (1 - this.parent.GetStatusResistance())
                }) as modifier_imba_mana_burn_parasite_charged;
                if (modifier_charged_handler) {
                    modifier_charged_handler.starting_target_mana = this.starting_target_mana;
                    modifier_charged_handler.parasite_charged_mana = this.parasite_charged_mana;
                }
                this.Destroy();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(keys: ModifierAttackEvent): void {
        if (!this.scarab_retrieve || !IsServer() || keys.target != this.parent) {
            return undefined;
        }
        if (!this.parent.IsRealUnit()) {
            return undefined;
        }
        this.caster.AddNewModifier(this.caster, this.ability, this.scarab_modifier, {
            duration: this.scarab_duration
        });
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let unit = keys.unit;
            let damage = keys.damage;
            if (this.parent == unit && damage > 0) {
                let mana_burned = damage * (this.scarring_burn_pct / 100);
                if (mana_burned > this.parent.GetMana()) {
                    mana_burned = this.parent.GetMana();
                }
                this.parent.ReduceMana(mana_burned);
                this.parasite_charged_mana = this.parasite_charged_mana + mana_burned;
                this.SetStackCount(this.parasite_charged_mana);
            }
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_mana_burn_parasite_charged extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public sound_charge: any;
    public sound_explosion: any;
    public particle_charged: any;
    public particle_explosion: any;
    public parasite_mana_as_damage_pct: number;
    public leech_interval: number;
    public scarab_retrieve: any;
    public scarab_modifier: any;
    public scarab_duration: number;
    public skip_damage: boolean = false;;
    public particle_charged_fx: any;
    public particle_explosion_fx: any;
    starting_target_mana: number;
    parasite_charged_mana: number;
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_HERO_KILLED
        }
        return Object.values(decFuncs);
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.sound_charge = "Imba.Nyx_ManaBurnCharge";
            this.sound_explosion = "Imba.Nyx_ManaBurnExplosion";
            this.particle_charged = "particles/hero/nyx_assassin/mana_burn_parasite_charged.vpcf";
            this.particle_explosion = "particles/hero/nyx_assassin/mana_burn_parasite_explosion.vpcf";
            this.parasite_mana_as_damage_pct = this.ability.GetSpecialValueFor("parasite_mana_as_damage_pct");
            this.leech_interval = this.ability.GetSpecialValueFor("leech_interval");
            if (this.caster.HasTalent("special_bonus_imba_nyx_assassin_8")) {
                this.scarab_retrieve = true;
                this.scarab_modifier = "modifier_imba_mana_burn_talent_parasite";
                this.scarab_duration = this.caster.GetTalentValue("special_bonus_imba_nyx_assassin_8", "duration");
                this.skip_damage = false;
            }
            EmitSoundOn(this.sound_charge, this.parent);
            this.particle_charged_fx = ResHelper.CreateParticleEx(this.particle_charged, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.parent);
            ParticleManager.SetParticleControl(this.particle_charged_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControlEnt(this.particle_charged_fx, 1, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.particle_charged_fx, 2, this.parent.GetAbsOrigin());
            this.AddParticle(this.particle_charged_fx, false, false, -1, false, false);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.skip_damage) {
                return;
            }
            let target_current_mana = this.parent.GetMana();
            EmitSoundOn(this.sound_explosion, this.parent);
            this.particle_explosion_fx = ResHelper.CreateParticleEx(this.particle_explosion, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.parent);
            ParticleManager.SetParticleControlEnt(this.particle_explosion_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.particle_explosion_fx, 1, Vector(1, 0, 0));
            ParticleManager.ReleaseParticleIndex(this.particle_explosion_fx);
            let damage = this.parasite_charged_mana * this.parasite_mana_as_damage_pct * 0.01;
            let damageTable = {
                victim: this.parent,
                attacker: this.caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.ability
            }
            ApplyDamage(damageTable);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(keys: ModifierAttackEvent): void {
        if (!this.scarab_retrieve || !IsServer() || keys.target != this.parent) {
            return undefined;
        }
        if (!this.parent.IsRealUnit()) {
            return undefined;
        }
        this.skip_damage = true;
        this.caster.AddNewModifier(this.caster, this.ability, this.scarab_modifier, {
            duration: this.scarab_duration
        });
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_mana_burn_talent_parasite extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public scarab_particle: any;
    public search_radius: number;
    public search_rate: any;
    public mana_burn_ability: any;
    public particle_flames_fx: any;
    BeCreated(kv: any): void {
        if (!IsServer()) {
            return undefined;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.scarab_particle = "particles/hero/nyx_assassin/mana_burn_parasite_flames_self.vpcf";
        this.search_radius = this.caster.GetTalentValue("special_bonus_imba_nyx_assassin_8", "search_radius");
        this.search_rate = this.caster.GetTalentValue("special_bonus_imba_nyx_assassin_8", "search_rate");
        this.mana_burn_ability = this.caster.findAbliityPlus<imba_nyx_assassin_mana_burn>("imba_nyx_assassin_mana_burn");
        this.particle_flames_fx = ResHelper.CreateParticleEx(this.scarab_particle, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControlEnt(this.particle_flames_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
        this.AddParticle(this.particle_flames_fx, false, false, -1, false, false);
        this.StartIntervalThink(this.search_rate);
    }
    BeDestroy(): void {
        if (this.particle_flames_fx) {
            ParticleManager.DestroyParticle(this.particle_flames_fx, false);
            ParticleManager.ReleaseParticleIndex(this.particle_flames_fx);
        }
    }
    OnIntervalThink(): void {
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
        if (GameFunc.GetCount(enemies) > 0 && this.mana_burn_ability) {
            this.mana_burn_ability.OnSpellStart(enemies[0]);
            this.Destroy();
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_nyx_assassin_spiked_carapace extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let cast_response = {
            "1": "nyx_assassin_nyx_spikedcarapace_03",
            "2": "nyx_assassin_nyx_spikedcarapace_05"
        }
        let sound_cast = "Hero_NyxAssassin.SpikedCarapace";
        let modifier_spikes = "modifier_imba_spiked_carapace";
        let reflect_duration = ability.GetSpecialValueFor("reflect_duration");
        let burrow_stun_range = ability.GetSpecialValueFor("burrow_stun_range");
        if (RollPercentage(25)) {
            EmitSoundOn(GFuncRandom.RandomValue(cast_response), caster);
        }
        EmitSoundOn(sound_cast, caster);
        caster.AddNewModifier(caster, ability, modifier_spikes, {
            duration: reflect_duration
        });
    }
}
@registerModifier()
export class modifier_imba_spiked_carapace extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public vendetta_ability: any;
    public modifier_stun: any;
    public modifier_vendetta: any;
    public modifier_burrowed: any;
    public stun_duration: number;
    public damage_to_vendetta_pct: number;
    public burrowed_stun_range: number;
    public burrowed_vendetta_stacks: number;
    public damage_reflection_pct: number;
    public particle_spikes_fx: any;
    public reflect_all_damage: boolean = false;;
    public enemiesHit: { [k: string]: boolean };
    GetStatusEffectName(): string {
        if (this.GetStackCount() == 1) {
            return "particles/econ/items/nyx_assassin/nyx_ti9_immortal/status_effect_nyx_ti9_carapace.vpcf";
        }
        return "particles/units/heroes/hero_nyx_assassin/status_effect_nyx_assassin_spiked_carapace.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.vendetta_ability = this.caster.findAbliityPlus<imba_nyx_assassin_vendetta>("imba_nyx_assassin_vendetta");
            this.modifier_stun = "modifier_imba_spiked_carapace_stun";
            this.modifier_vendetta = "modifier_imba_vendetta_charge";
            this.modifier_burrowed = "modifier_nyx_assassin_burrow";
            // if (Battlepass && BATTLEPASS_NYX_ASSASSIN && Battlepass.GetRewardUnlocked(this.caster.GetPlayerID()) >= BATTLEPASS_NYX_ASSASSIN["nyx_assassin_immortal"]) {
            this.SetStackCount(1);
            // }
            this.stun_duration = this.ability.GetSpecialValueFor("stun_duration");
            this.damage_to_vendetta_pct = this.ability.GetSpecialValueFor("damage_to_vendetta_pct");
            this.burrowed_stun_range = this.ability.GetSpecialValueFor("burrow_stun_range");
            this.burrowed_vendetta_stacks = this.ability.GetSpecialValueFor("burrowed_vendetta_stacks");
            this.damage_reflection_pct = this.ability.GetSpecialValueFor("damage_reflection_pct");
            this.damage_reflection_pct = this.ability.GetSpecialValueFor("damage_reflection_pct");
            if (this.caster.HasTalent("special_bonus_imba_nyx_assassin_10")) {
                this.damage_reflection_pct = this.damage_reflection_pct + this.caster.GetTalentValue("special_bonus_imba_nyx_assassin_10");
            }
            this.particle_spikes_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_nyx_assassin/nyx_assassin_spiked_carapace.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.caster, this.caster);
            ParticleManager.SetParticleControlEnt(this.particle_spikes_fx, 0, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.caster.GetAbsOrigin(), true);
            this.AddParticle(this.particle_spikes_fx, false, false, -1, false, false);
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_nyx_assassin_4")) {
                this.reflect_all_damage = true;
            } else {
                this.reflect_all_damage = false;
                this.enemiesHit = {}
            }
            if (this.caster.HasModifier(this.modifier_burrowed)) {
                let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.burrowed_stun_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    enemy.AddNewModifier(this.caster, this.ability, this.modifier_stun, {
                        duration: this.stun_duration * (1 - enemy.GetStatusResistance())
                    });
                    if (this.vendetta_ability && this.vendetta_ability.GetLevel() > 0) {
                        if (!this.caster.HasModifier(this.modifier_vendetta)) {
                            this.caster.AddNewModifier(this.caster, this.vendetta_ability, this.modifier_vendetta, {});
                        }
                        if (enemy.IsRealUnit()) {
                            let modifier_vendetta_handler = this.caster.FindModifierByName(this.modifier_vendetta);
                            if (modifier_vendetta_handler) {
                                modifier_vendetta_handler.SetStackCount(modifier_vendetta_handler.GetStackCount() + this.burrowed_vendetta_stacks);
                            }
                        }
                    }
                }
            }
        }
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(keys: ModifierAttackEvent): 0 | 1 {
        if (keys.attacker && keys.damage && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) {
            return 1;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL)
    CC_GetAbsoluteNoDamageMagical(keys: ModifierAttackEvent): 0 | 1 {
        if (keys.attacker && keys.damage && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) {
            return 1;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE)
    CC_GetAbsoluteNoDamagePure(keys: ModifierAttackEvent): 0 | 1 {
        if (keys.attacker && keys.damage && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) {
            if (!keys.attacker.IsBuilding() && keys.attacker.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
                let damage = keys.original_damage * this.damage_reflection_pct * 0.01;
                if (this.vendetta_ability && this.vendetta_ability.GetLevel() > 0) {
                    if (!this.GetCasterPlus().HasModifier(this.modifier_vendetta)) {
                        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.vendetta_ability, this.modifier_vendetta, {});
                    }
                    if (keys.attacker.IsRealUnit()) {
                        let modifier_vendetta_handler = this.GetCasterPlus().FindModifierByName(this.modifier_vendetta);
                        if (modifier_vendetta_handler) {
                            modifier_vendetta_handler.SetStackCount(modifier_vendetta_handler.GetStackCount() + (damage * this.damage_to_vendetta_pct * 0.01));
                        }
                    }
                }
                if (!keys.attacker.IsMagicImmune() && !keys.attacker.IsInvulnerable()) {
                    let skip_damage = false;
                    if (!this.reflect_all_damage && this.enemiesHit[keys.attacker.entindex() + ""]) {
                        skip_damage = true;
                    }
                    if (!skip_damage) {
                        if (this.enemiesHit != undefined) {
                            this.enemiesHit[keys.attacker.entindex() + ""] = true;
                        }
                        ApplyDamage({
                            victim: keys.attacker,
                            attacker: this.GetCasterPlus(),
                            damage: damage,
                            damage_type: keys.damage_type,
                            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION,
                            ability: this.ability
                        });
                    }
                    keys.attacker.AddNewModifier(this.GetCasterPlus(), this.ability, this.modifier_stun, {
                        duration: this.stun_duration * (1 - keys.attacker.GetStatusResistance())
                    });
                }
            }
            return 1;
        }
    }
}
@registerModifier()
export class modifier_imba_spiked_carapace_stun extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public particle_spike_hit_fx: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.parent = this.GetParentPlus();
            EmitSoundOn("Hero_NyxAssassin.SpikedCarapace.Stun", this.parent);
            this.particle_spike_hit_fx = ResHelper.CreateParticleEx(this.GetCasterPlus().TempData().spiked_carapace_debuff_pfx, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(this.particle_spike_hit_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControlEnt(this.particle_spike_hit_fx, 1, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.particle_spike_hit_fx, 2, Vector(1, 0, 0));
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerAbility()
export class imba_nyx_assassin_vendetta extends BaseAbility_Plus {
    IsNetherWardStealable() {
        return false;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        // todo nyx_assassin_unburrow
        let burrow_ability = caster.findAbliityPlus("nyx_assassin_unburrow");
        let cast_response = {
            "1": "nyx_assassin_nyx_vendetta_01",
            "2": "nyx_assassin_nyx_vendetta_02",
            "3": "nyx_assassin_nyx_vendetta_03",
            "4": "nyx_assassin_nyx_vendetta_09"
        }
        let sound_cast = "Hero_NyxAssassin.Vendetta";
        let modifier_vendetta = "modifier_imba_vendetta";
        let modifier_burrowed = "modifier_nyx_assassin_burrow";
        let duration = ability.GetSpecialValueFor("duration");
        EmitSoundOn(GFuncRandom.RandomValue(cast_response), caster);
        EmitSoundOn(sound_cast, caster);
        if (burrow_ability && caster.HasModifier(modifier_burrowed)) {
            burrow_ability.CastAbility();
        }
        caster.AddNewModifier(caster, ability, modifier_vendetta, {
            duration: duration
        });
    }
}
@registerModifier()
export class modifier_imba_vendetta extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public sound_attack: any;
    public particle_vendetta_start: any;
    public particle_vendetta_attack: any;
    public carapace_ability: any;
    public modifier_charge: any;
    public movement_speed_pct: number;
    public bonus_damage: number;
    public break_duration: number;
    public dont_consume_stacks: boolean;
    public apply_mana_burn: any;
    public mana_burn_ability: any;
    public particle_vendetta_start_fx: any;
    public damage_type: number;
    public particle_vendetta_attack_fx: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.sound_attack = "Hero_NyxAssassin.Vendetta.Crit";
        this.particle_vendetta_start = "particles/units/heroes/hero_nyx_assassin/nyx_assassin_vendetta_start.vpcf";
        this.particle_vendetta_attack = "particles/units/heroes/hero_nyx_assassin/nyx_assassin_vendetta.vpcf";
        this.carapace_ability = "imba_nyx_assassin_spiked_carapace";
        this.modifier_charge = "modifier_imba_vendetta_charge";
        if (this.ability && !this.ability.IsNull()) {
            this.movement_speed_pct = this.ability.GetSpecialValueFor("movement_speed_pct");
            this.bonus_damage = this.ability.GetSpecialValueFor("bonus_damage");
            this.break_duration = this.ability.GetSpecialValueFor("break_duration");
        } else {
            this.movement_speed_pct = 0;
            this.bonus_damage = 0;
            this.break_duration = 0;
        }
        if (this.caster.HasTalent("special_bonus_imba_nyx_assassin_1")) {
            this.dont_consume_stacks = true;
        }
        if (this.caster.HasTalent("special_bonus_imba_nyx_assassin_2") && IsServer()) {
            this.apply_mana_burn = true;
            this.mana_burn_ability = this.caster.findAbliityPlus<imba_nyx_assassin_mana_burn>("imba_nyx_assassin_mana_burn");
        }
        if (!IsServer()) {
            return;
        }
        this.particle_vendetta_start_fx = ResHelper.CreateParticleEx(this.particle_vendetta_start, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster);
        ParticleManager.SetParticleControl(this.particle_vendetta_start_fx, 0, this.caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_vendetta_start_fx, 1, this.caster.GetAbsOrigin());
        this.AddParticle(this.particle_vendetta_start_fx, false, false, -1, false, false);
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
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
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state;
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_nyx_assassin_11")) {
            state = {
                [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
                [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
            }
        } else {
            state = {
                [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
            }
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            3: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED,
            4: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        let ability = keys.ability;
        let caster = keys.unit;
        if (caster == this.caster) {
            if (ability.GetAbilityName() == this.carapace_ability) {
                return undefined;
            }
            this.Destroy();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_speed_pct;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (attacker == this.caster) {
                if (!target.IsRealUnit() && !target.IsCreep()) {
                    this.Destroy();
                    return undefined;
                }
                EmitSoundOn(this.sound_attack, this.caster);
                this.particle_vendetta_attack_fx = ResHelper.CreateParticleEx(this.particle_vendetta_attack, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.caster);
                ParticleManager.SetParticleControl(this.particle_vendetta_attack_fx, 0, this.caster.GetAbsOrigin());
                ParticleManager.SetParticleControl(this.particle_vendetta_attack_fx, 1, target.GetAbsOrigin());
                let stacks = 0;
                let modifier_charged_handler;
                if (this.caster.HasModifier(this.modifier_charge)) {
                    modifier_charged_handler = this.caster.FindModifierByName(this.modifier_charge);
                    if (modifier_charged_handler) {
                        stacks = modifier_charged_handler.GetStackCount();
                    }
                }
                let damage = this.bonus_damage + stacks;
                if (this.apply_mana_burn && this.mana_burn_ability) {
                    this.mana_burn_ability.OnSpellStart(target);
                }
                let damageTable = {
                    victim: target,
                    attacker: this.caster,
                    damage: damage,
                    damage_type: this.damage_type,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_CRITICAL, target, damage, undefined);
                if (modifier_charged_handler) {
                    if (!this.dont_consume_stacks || target.IsAlive()) {
                        modifier_charged_handler.Destroy();
                    }
                }
                target.AddNewModifier(this.caster, this.ability, "modifier_imba_vendetta_break", {
                    duration: this.break_duration * (1 - target.GetStatusResistance())
                });
                this.Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_vendetta_charge extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public maximum_vendetta_stacks: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.maximum_vendetta_stacks = this.ability.GetSpecialValueFor("maximum_vendetta_stacks");
            if (this.caster.HasTalent("special_bonus_imba_nyx_assassin_12")) {
                this.maximum_vendetta_stacks = this.maximum_vendetta_stacks + this.caster.GetTalentValue("special_bonus_imba_nyx_assassin_12");
            }
        }
    }
    GetTexture(): string {
        return "nyx_assassin_vendetta";
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
    OnStackCountChanged(p_0: number,): void {
        if (IsServer()) {
            let stacks = this.GetStackCount();
            if (stacks > this.maximum_vendetta_stacks) {
                this.SetStackCount(this.maximum_vendetta_stacks);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_vendetta_break extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
        };
    }
}
@registerModifier()
export class modifier_special_bonus_imba_nyx_assassin_5 extends BaseModifier_Plus {
    public target: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public hp_threshold_pct: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    AllowIllusionDuplicate(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    _CheckHealth(): void {
        if (this.target && this.ability && this.ability.IsCooldownReady() && !this.target.PassivesDisabled() && this.target.IsAlive()) {
            let current_hp = this.target.GetHealth() / this.target.GetMaxHealth();
            if (current_hp <= this.hp_threshold_pct) {
                this.ability.OnSpellStart();
                this.ability.UseResources(false, false, true);
            }
        }
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.target = this.GetParentPlus();
            if (this.target.IsIllusion()) {
                this.Destroy();
            } else {
                this.ability = this.target.findAbliityPlus<imba_nyx_assassin_spiked_carapace>("imba_nyx_assassin_spiked_carapace");
                this.hp_threshold_pct = this.target.GetTalentValue("special_bonus_imba_nyx_assassin_5") / 100;
                this._CheckHealth();
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(kv: ModifierInstanceEvent): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            if (target == kv.unit) {
                this._CheckHealth();
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_nyx_assassin_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nyx_assassin_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nyx_assassin_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nyx_assassin_13 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nyx_assassin_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nyx_assassin_12 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nyx_assassin_11 extends BaseModifier_Plus {
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
