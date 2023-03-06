
import { GameFunc } from "../../../GameFunc";
import { EventHelper } from "../../../helper/EventHelper";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_abyssal_underlord_firestorm extends BaseAbility_Plus {
    public effect_cast: any;
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnAbilityPhaseStart(): boolean {
        let point = this.GetCursorPosition();
        this.PlayEffects(point);
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        this.StopEffects();
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.StopEffects();
        let caster = this.GetCasterPlus();
        let point = this.GetCursorPosition();
        CreateModifierThinker(caster, this, "modifier_imba_abyssal_underlord_firestorm_thinker", {}, point, caster.GetTeamNumber(), false);
    }
    PlayEffects(point: Vector) {
        let particle_cast = "particles/units/heroes/heroes_underlord/underlord_firestorm_pre.vpcf";
        let sound_cast = "Hero_AbyssalUnderlord.Firestorm.Start";
        let radius = this.GetSpecialValueFor("radius");
        this.effect_cast = ParticleManager.CreateParticleForTeam(particle_cast, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus(), this.GetCasterPlus().GetTeamNumber());
        ParticleManager.SetParticleControl(this.effect_cast, 0, point);
        ParticleManager.SetParticleControl(this.effect_cast, 1, Vector(2, 2, 2));
        EmitSoundOnLocationWithCaster(point, sound_cast, this.GetCasterPlus());
    }
    StopEffects() {
        ParticleManager.DestroyParticle(this.effect_cast, true);
        ParticleManager.ReleaseParticleIndex(this.effect_cast);
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_firestorm_thinker extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public radius: number;
    public count: number;
    public interval: number;
    public burn_duration: number;
    public autocast_state: any;
    public wave: any;
    public damageTable: ApplyDamageOptions;
    public delayed: boolean = false;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.ability = this.GetAbilityPlus();
        let damage = this.ability.GetSpecialValueFor("wave_damage");
        let delay = this.ability.GetSpecialValueFor("first_wave_delay");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.count = this.ability.GetSpecialValueFor("wave_count");
        this.interval = this.ability.GetSpecialValueFor("wave_interval");
        this.burn_duration = this.ability.GetSpecialValueFor("burn_duration");
        if (!IsServer()) {
            return;
        }
        this.autocast_state = this.ability.GetAutoCastState();
        this.wave = 0;
        this.damageTable = {
            attacker: this.caster,
            damage: damage,
            damage_type: this.ability.GetAbilityDamageType(),
            ability: this.ability,
            victim: null
        }
        this.StartIntervalThink(delay);
    }
    BeRefresh(kv: any): void {
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        UTIL_Remove(this.GetParentPlus());
    }
    OnIntervalThink(): void {
        if (!this.delayed) {
            this.delayed = true;
            this.StartIntervalThink(this.interval);
            this.OnIntervalThink();
            return;
        }
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            this.damageTable.victim = enemy;
            ApplyDamage(this.damageTable);
            let modifier_name = "modifier_imba_abyssal_underlord_firestorm";
            if (this.autocast_state) {
                modifier_name = "modifier_imba_abyssal_underlord_blizzard";
            }
            let modifier = enemy.AddNewModifier(this.caster, this.ability, modifier_name, {
                duration: this.burn_duration
            });
        }
        this.PlayEffects();
        this.wave = this.wave + 1;
        if (this.wave >= this.count) {
            this.Destroy();
        }
    }
    PlayEffects() {
        let particle_cast = "particles/units/heroes/heroes_underlord/abyssal_underlord_firestorm_wave.vpcf";
        let sound_cast = "Hero_AbyssalUnderlord.Firestorm";
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(effect_cast, 0, this.parent.GetOrigin());
        ParticleManager.SetParticleControl(effect_cast, 4, Vector(this.radius, 0, 0));
        ParticleManager.ReleaseParticleIndex(effect_cast);
        EmitSoundOn(sound_cast, this.parent);
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_firestorm extends BaseModifier_Plus {
    public damage_pct: number;
    public damageTable: ApplyDamageOptions;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(kv: any): void {
        if (!IsServer()) {
            return;
        }
        this.damage_pct = (this.GetSpecialValueFor("burn_damage") + (this.GetSpecialValueFor("burn_damage_stack") * this.GetStackCount())) / 100;
        this.damageTable = {
            damage: 0,
            victim: this.GetParentPlus(),
            attacker: this.GetCasterPlus(),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this.GetAbilityPlus()
        }
        this.StartIntervalThink(this.GetSpecialValueFor("burn_interval"));
    }
    BeRefresh(kv: any): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
        this.damage_pct = (this.GetSpecialValueFor("burn_damage") + (this.GetSpecialValueFor("burn_damage_stack") * this.GetStackCount())) / 100;
    }
    OnStackCountChanged(iStackCount: number): void {
        if (!IsServer()) {
            return;
        }
        this.damage_pct = (this.GetSpecialValueFor("burn_damage") + (this.GetSpecialValueFor("burn_damage_stack") * this.GetStackCount())) / 100;
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
    }
    OnIntervalThink(): void {
        let damage = this.GetParentPlus().GetMaxHealth() * this.damage_pct;
        this.damageTable.damage = damage;
        ApplyDamage(this.damageTable);
    }
    GetEffectName(): string {
        return "particles/units/heroes/heroes_underlord/abyssal_underlord_firestorm_wave_burn.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_blizzard extends BaseModifier_Plus {
    public slow: any;
    public damage_pct: number;
    public damageTable: ApplyDamageOptions;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    BeCreated(kv: any): void {
        this.slow = this.GetSpecialValueFor("blizzard_slow_percentage");
        if (!IsServer()) {
            return;
        }
        this.damage_pct = this.GetSpecialValueFor("burn_damage") / 100;
        this.damageTable = {
            damage: 0,
            victim: this.GetParentPlus(),
            attacker: this.GetCasterPlus(),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this.GetAbilityPlus()
        }
    }
    BeRefresh(kv: any): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
        this.damage_pct = this.GetSpecialValueFor("burn_damage") / 100;
        this.slow = this.GetSpecialValueFor("blizzard_slow_percentage") + (this.GetSpecialValueFor("blizzard_slow_percentage_stack") * this.GetStackCount());
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow * (-1);
    }
    GetEffectName(): string {
        return "particles/econ/courier/courier_wyvern_hatchling/courier_wyvern_hatchling_ice.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class imba_abyssal_underlord_pit_of_malice extends BaseAbility_Plus {
    public point: any;
    public effect_cast: any;
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnAbilityPhaseStart(): boolean {
        this.point = this.GetCursorPosition();
        this.PlayEffects(this.point, true);
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        ParticleManager.DestroyParticle(this.effect_cast, true);
        ParticleManager.ReleaseParticleIndex(this.effect_cast);
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        ParticleManager.ReleaseParticleIndex(this.effect_cast);
        let caster = this.GetCasterPlus();
        let point = this.GetCursorPosition();
        let duration = this.GetSpecialValueFor("pit_duration");
        CreateModifierThinker(caster, this, "modifier_imba_abyssal_underlord_pit_of_malice_thinker", {
            duration: duration
        }, point, caster.GetTeamNumber(), false);
    }
    AddTwistedRealityStack() {
        let stack_modifier = this.GetCasterPlus().findBuff<modifier_imba_abyssal_underlord_pit_of_malice_stack>("modifier_imba_abyssal_underlord_pit_of_malice_stack");
        if (stack_modifier) {
            stack_modifier.IncrementStackCount();
        } else {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_abyssal_underlord_pit_of_malice_stack", {
                duration: this.GetSpecialValueFor("pit_increase_duration")
            }).SetStackCount(1);
        }
        this.PlayEffects(this.point);
    }
    PlayEffects(point: Vector, bPlaySound = false) {
        let particle_cast = "particles/units/heroes/heroes_underlord/underlord_pitofmalice_pre.vpcf";
        let sound_cast = "Hero_AbyssalUnderlord.PitOfMalice.Start";
        let radius = this.GetSpecialValueFor("radius");
        let stack_modifier = this.GetCasterPlus().findBuff<modifier_imba_abyssal_underlord_pit_of_malice_stack>("modifier_imba_abyssal_underlord_pit_of_malice_stack");
        let bonus_radius = this.GetSpecialValueFor("bonus_radius_per_stack");
        if (stack_modifier) {
            radius = radius + (bonus_radius * stack_modifier.GetStackCount());
        }
        this.effect_cast = ParticleManager.CreateParticleForTeam(particle_cast, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus(), this.GetCasterPlus().GetTeamNumber());
        ParticleManager.SetParticleControl(this.effect_cast, 0, point);
        ParticleManager.SetParticleControl(this.effect_cast, 1, Vector(radius, 1, 1));
        if (bPlaySound && bPlaySound == true) {
            EmitSoundOnLocationForAllies(point, sound_cast, this.GetCasterPlus());
        }
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_pit_of_malice_thinker extends BaseModifier_Plus {
    public radius: number;
    public pit_damage: number;
    public duration: number;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public pfx: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.pit_damage = this.GetSpecialValueFor("pit_damage");
        this.duration = this.GetSpecialValueFor("ensnare_duration");
        if (!IsServer()) {
            return;
        }
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.StartIntervalThink(0.033);
        this.OnIntervalThink();
        this.PlayEffects();
    }
    BeRefresh(kv: any): void {
    }
    OnRemoved(): void {
        if (!IsServer()) {
            return;
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        UTIL_Remove(this.GetParentPlus());
    }
    OnIntervalThink(): void {
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let modifier = enemy.FindModifierByNameAndCaster("modifier_imba_abyssal_underlord_pit_of_malice_cooldown", this.GetCasterPlus());
            if (!modifier) {
                enemy.AddNewModifier(this.caster, this.GetAbilityPlus(), "modifier_imba_abyssal_underlord_pit_of_malice", {
                    duration: this.duration
                });
                this.GetAbilityPlus<imba_abyssal_underlord_pit_of_malice>().AddTwistedRealityStack();
                this.PlayEffects();
            }
        }
    }
    IsAura(): boolean {
        return true;
    }
    GetModifierAura(): string {
        return "modifier_imba_abyssal_underlord_pit_of_malice_abyss_souls";
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraDuration(): number {
        return 0.2;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return 0;
    }
    PlayEffects() {
        let particle_cast = "particles/units/heroes/heroes_underlord/underlord_pitofmalice.vpcf";
        let sound_cast = "Hero_AbyssalUnderlord.PitOfMalice";
        let parent = this.GetParentPlus();
        this.radius = this.GetSpecialValueFor("radius");
        let stack_modifier = this.GetCasterPlus().findBuff<modifier_imba_abyssal_underlord_pit_of_malice_stack>("modifier_imba_abyssal_underlord_pit_of_malice_stack");
        let bonus_radius = this.GetSpecialValueFor("bonus_radius_per_stack");
        if (stack_modifier) {
            this.radius = this.radius + (bonus_radius * stack_modifier.GetStackCount());
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
        this.pfx = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        ParticleManager.SetParticleControl(this.pfx, 0, parent.GetOrigin());
        ParticleManager.SetParticleControl(this.pfx, 1, Vector(this.radius, 1, 1));
        ParticleManager.SetParticleControl(this.pfx, 2, Vector(this.GetDuration(), 0, 0));
        EmitSoundOn(sound_cast, parent);
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_pit_of_malice_cooldown extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(kv: any): void {
    }
    BeRefresh(kv: any): void {
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_pit_of_malice_abyss_souls extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage(): number {
        return this.GetSpecialValueFor("hp_regen_amp");
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_pit_of_malice extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    BeCreated(kv: any): void {
        let interval = this.GetSpecialValueFor("pit_interval");
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_abyssal_underlord_pit_of_malice_cooldown", {
            duration: interval
        });
        let hero = this.GetParentPlus().IsRealUnit();
        let sound_cast = "Hero_AbyssalUnderlord.Pit.TargetHero";
        if (!hero) {
            sound_cast = "Hero_AbyssalUnderlord.Pit.Target";
        }
        EmitSoundOn(sound_cast, this.GetParentPlus());
    }
    BeRefresh(kv: any): void {
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false,
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/units/heroes/heroes_underlord/abyssal_underlord_pitofmalice_stun.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_pit_of_malice_stack extends BaseModifier_Plus {
    OnStackCountChanged(iStackCount: number): void {
        this.SetDuration(this.GetSpecialValueFor("pit_increase_duration"), true);
    }
}
@registerAbility()
export class imba_abyssal_underlord_atrophy_aura extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_abyssal_underlord_atrophy_aura";
    }
    OnAbilityPhaseStart(): boolean {
        let mod = this.GetCasterPlus().findBuff<modifier_imba_abyssal_underlord_atrophy_aura>("modifier_imba_abyssal_underlord_atrophy_aura");
        if (mod && mod.GetStackCount() > 0) {
            return true;
        }
        print("CRITICAL ERROR: Missing stack modifier.");
        EventHelper.ErrorMessage("Not enough stacks!", this.GetCasterPlus().GetPlayerID());
        return false;
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_abyssal_underlord_atrophy_aura_active", {
            duration: this.GetSpecialValueFor("active_duration")
        });
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_atrophy_aura_active extends BaseModifier_Plus {
    public attack_count: number;
    public pfx: any;
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            4: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2
        });
    } */
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.attack_count = this.GetSpecialValueFor("active_attack_count");
        this.SetHasCustomTransmitterData(true);
        let mod = this.GetParentPlus().findBuff<modifier_imba_abyssal_underlord_atrophy_aura>("modifier_imba_abyssal_underlord_atrophy_aura");
        if (mod) {
            this.SetStackCount(mod.GetStackCount() * this.GetSpecialValueFor("active_bonus_damage_pct") / 100);
            for (const [k, v] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName("modifier_imba_abyssal_underlord_atrophy_aura_stack"))) {
                v.Destroy();
            }
        } else {
            print("CRITICAL ERROR: Missing stack modifier.");
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/heroes_underlord/abyssal_underlord_atrophy_stack.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.pfx, 1, Vector(0, this.attack_count, 0));
    }
    AddCustomTransmitterData() {
        return {
            attack_count: this.attack_count
        };
    }
    HandleCustomTransmitterData(data: any) {
        this.attack_count = data.attack_count;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetParentPlus()) {
            this.attack_count = this.attack_count - 1;
            if (this.attack_count <= 0) {
                this.Destroy();
                return;
            }
            ParticleManager.SetParticleControl(this.pfx, 1, Vector(0, this.attack_count, 0));
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    CC_OnTooltip2(): number {
        return this.attack_count;
    }
    OnRemoved(): void {
        if (!IsServer()) {
            return;
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_atrophy_aura extends BaseModifier_Plus {
    public radius: number;
    public hero_bonus: number;
    public creep_bonus: number;
    public bonus: number;
    public duration: number;
    public duration_scepter: number;
    public scepter_aura: any;
    IsHidden(): boolean {
        return this.GetStackCount() == 0;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    DestroyOnExpire(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.hero_bonus = this.GetSpecialValueFor("bonus_damage_from_hero");
        this.creep_bonus = this.GetSpecialValueFor("bonus_damage_from_creep");
        this.bonus = this.GetSpecialValueFor("permanent_bonus");
        this.duration = this.GetSpecialValueFor("bonus_damage_duration");
        this.duration_scepter = this.GetSpecialValueFor("bonus_damage_duration_scepter");
        if (!IsServer()) {
            return;
        }
        this.scepter_aura = this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_abyssal_underlord_atrophy_aura_scepter", {});
    }
    BeRefresh(kv: any): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.hero_bonus = this.GetSpecialValueFor("bonus_damage_from_hero");
        this.creep_bonus = this.GetSpecialValueFor("bonus_damage_from_creep");
        this.bonus = this.GetSpecialValueFor("permanent_bonus");
        this.duration = this.GetSpecialValueFor("bonus_damage_duration");
        this.duration_scepter = this.GetSpecialValueFor("bonus_damage_duration_scepter");
        if (!IsServer()) {
            return;
        }
        this.scepter_aura.ForceRefresh();
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_DEATH,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let parent = this.GetParentPlus();
        if (parent.PassivesDisabled()) {
            return;
        }
        if (params.unit.IsIllusion()) {
            return;
        }
        if (!params.unit.FindModifierByNameAndCaster("modifier_imba_abyssal_underlord_atrophy_aura_debuff", parent)) {
            return;
        }
        let hero = params.unit.IsRealUnit();
        let bonus;
        if (hero) {
            bonus = this.hero_bonus;
        } else {
            bonus = this.creep_bonus;
        }
        let duration;
        if (parent.HasScepter()) {
            duration = this.duration_scepter;
        } else {
            duration = this.duration;
        }
        this.SetStackCount(this.GetStackCount() + bonus);
        let modifier = parent.AddNewModifier(parent, this.GetAbilityPlus(), "modifier_imba_abyssal_underlord_atrophy_aura_stack", {
            duration: duration
        }) as modifier_imba_abyssal_underlord_atrophy_aura_stack;
        modifier.parent = this;
        modifier.bonus = bonus;
        this.SetDuration(this.duration, true);
        if (hero) {
            parent.AddNewModifier(parent, this.GetAbilityPlus(), "modifier_imba_abyssal_underlord_atrophy_aura_permanent_stack", {
                bonus: this.bonus
            });
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetStackCount();
    }
    RemoveStack(value: number) {
        this.SetStackCount(this.GetStackCount() - value);
    }
    IsAura(): boolean {
        return (!this.GetCasterPlus().PassivesDisabled());
    }
    GetModifierAura(): string {
        return "modifier_imba_abyssal_underlord_atrophy_aura_debuff";
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraDuration(): number {
        return 0.5;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraEntityReject(hEntity: CDOTA_BaseNPC): boolean {
        if (IsServer()) {
            if (hEntity == this.GetCasterPlus()) {
                return true;
            }
        }
        return false;
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_atrophy_aura_debuff extends BaseModifier_Plus {
    public reduction: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE;
    }
    BeCreated(kv: any): void {
        this.reduction = this.GetSpecialValueFor("damage_reduction_pct");
        if (!IsServer()) {
            return;
        }
    }
    BeRefresh(kv: any): void {
        this.reduction = this.GetSpecialValueFor("damage_reduction_pct");
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(params: ModifierAttackEvent): number {
        return -this.reduction;
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_atrophy_aura_permanent_stack extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(kv.bonus);
    }
    BeRefresh(kv: any): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.GetStackCount() + kv.bonus);
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_atrophy_aura_scepter extends BaseModifier_Plus {
    public radius: number;
    public bonus_pct: number;
    public modifier: any;
    IsHidden(): boolean {
        return this.GetStackCount() == 0;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.bonus_pct = 50;
        if (!IsServer()) {
            return;
        }
        this.modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_abyssal_underlord_atrophy_aura", this.GetCasterPlus());
    }
    BeRefresh(kv: any): void {
        this.OnCreated(kv);
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetParentPlus() == this.GetCasterPlus()) {
            return 0;
        }
        if (IsServer()) {
            let bonus = this.modifier.GetStackCount();
            bonus = math.floor(bonus * this.bonus_pct / 100);
            this.SetStackCount(bonus);
        }
        return this.GetStackCount();
    }
    IsAura(): boolean {
        let caster = this.GetCasterPlus();
        let parent = this.GetParentPlus();
        if (!caster.HasScepter()) {
            return false;
        }
        return this.GetParentPlus() == this.GetCasterPlus();
    }
    GetModifierAura(): string {
        return "modifier_imba_abyssal_underlord_atrophy_aura_scepter";
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraDuration(): number {
        return 0.5;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return 0;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraEntityReject(hEntity: CDOTA_BaseNPC): boolean {
        if (IsServer()) {
        }
        return false;
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_atrophy_aura_stack extends BaseModifier_Plus {
    parent: modifier_imba_abyssal_underlord_atrophy_aura;
    bonus: number;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE + DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
    }
    BeRefresh(kv: any): void {
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.parent.RemoveStack(this.bonus);
    }
}
@registerAbility()
export class imba_abyssal_underlord_dark_rift extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let point = this.GetCursorPosition();
        if (!target) {
            let targets = FindUnitsInRadius(caster.GetTeamNumber(), point, undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_CLOSEST, false);
            if (GameFunc.GetCount(targets) > 0) {
                target = targets[0];
            }
        }
        if (!target) {
            return;
        }
        let duration = this.GetSpecialValueFor("teleport_delay");
        let modifier = target.AddNewModifier(caster, this, "modifier_imba_abyssal_underlord_dark_rift", {
            duration: duration
        });
        let ability = caster.findAbliityPlus<imba_abyssal_underlord_cancel_dark_rift>("imba_abyssal_underlord_cancel_dark_rift");
        if (!ability) {
            ability = caster.AddAbility("imba_abyssal_underlord_cancel_dark_rift") as imba_abyssal_underlord_cancel_dark_rift;
            ability.SetStolen(true);
        }
        ability.SetLevel(1);
        ability.modifier = modifier;
        caster.SwapAbilities(this.GetAbilityName(), ability.GetAbilityName(), false, true);
    }
}
@registerAbility()
export class imba_abyssal_underlord_cancel_dark_rift extends BaseAbility_Plus {
    public modifier: any;
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.modifier.Cancel();
        this.modifier = undefined;
    }
}
@registerModifier()
export class modifier_imba_abyssal_underlord_dark_rift extends BaseModifier_Plus {
    public radius: number;
    public success: any;
    public effect_cast: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(kv: any): void {
        this.radius = this.GetSpecialValueFor("radius");
        if (!IsServer()) {
            return;
        }
        this.success = true;
        this.PlayEffects1();
        this.PlayEffects2();
    }
    BeRefresh(kv: any): void {
    }
    OnRemoved(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.success) {
            return;
        }
        let caster = this.GetCasterPlus();
        this.PlayEffects3();
        let targets = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, 0, false);
        let point = this.GetParentPlus().GetOrigin();
        for (const [_, target] of GameFunc.iPair(targets)) {
            ProjectileHelper.ProjectileDodgePlus(target);
            FindClearSpaceForUnit(target, point, true);
        }
        let ability = this.GetCasterPlus().findAbliityPlus<imba_abyssal_underlord_cancel_dark_rift>("imba_abyssal_underlord_cancel_dark_rift");
        if (!ability) {
            return;
        }
        caster.SwapAbilities(this.GetAbilityPlus().GetAbilityName(), ability.GetAbilityName(), true, false);
    }
    BeDestroy(): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_DEATH
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (params.unit != this.GetCasterPlus() && params.unit != this.GetParentPlus()) {
            return;
        }
        this.Cancel();
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_LOW_ATTACK_PRIORITY]: true
        }
        return state;
    }
    Cancel() {
        this.success = false;
        let ability = this.GetCasterPlus().findAbliityPlus<imba_abyssal_underlord_cancel_dark_rift>("imba_abyssal_underlord_cancel_dark_rift");
        if (!ability) {
            return;
        }
        this.GetCasterPlus().SwapAbilities(this.GetAbilityPlus().GetAbilityName(), ability.GetAbilityName(), true, false);
        this.PlayEffects4();
        this.Destroy();
    }
    PlayEffects1() {
        let particle_cast = "particles/units/heroes/heroes_underlord/abyssal_underlord_darkrift_target.vpcf";
        let sound_cast = "Hero_AbyssalUnderlord.DarkRift.Target";
        let parent = this.GetParentPlus();
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        ParticleManager.SetParticleControlEnt(effect_cast, 6, parent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", Vector(0, 0, 0), true);
        this.AddParticle(effect_cast, false, false, -1, false, false);
        EmitSoundOn(sound_cast, parent);
    }
    PlayEffects2() {
        let particle_cast = "particles/units/heroes/heroes_underlord/abbysal_underlord_darkrift_ambient.vpcf";
        let sound_cast = "Hero_AbyssalUnderlord.DarkRift.Cast";
        let caster = this.GetCasterPlus();
        let parent = this.GetParentPlus();
        this.effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControl(this.effect_cast, 1, Vector(this.radius, 0, 0));
        ParticleManager.SetParticleControlEnt(this.effect_cast, 2, caster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", Vector(0, 0, 0), true);
        this.AddParticle(this.effect_cast, false, false, -1, false, false);
        EmitSoundOn(sound_cast, caster);
    }
    PlayEffects3() {
        let sound_cast1 = "Hero_AbyssalUnderlord.DarkRift.Complete";
        let sound_cast2 = "Hero_AbyssalUnderlord.DarkRift.Aftershock";
        let caster = this.GetCasterPlus();
        let parent = this.GetParentPlus();
        ParticleManager.SetParticleControl(this.effect_cast, 5, caster.GetOrigin());
        EmitSoundOn(sound_cast1, parent);
        EmitSoundOnLocationWithCaster(caster.GetOrigin(), sound_cast2, caster);
    }
    PlayEffects4() {
        let sound_cast1 = "Hero_AbyssalUnderlord.DarkRift.Cast";
        let sound_cast2 = "Hero_AbyssalUnderlord.DarkRift.Target";
        let sound_cancel = "Hero_AbyssalUnderlord.DarkRift.Cancel";
        let caster = this.GetCasterPlus();
        let parent = this.GetParentPlus();
        ParticleManager.DestroyParticle(this.effect_cast, true);
        StopSoundOn(sound_cast1, caster);
        StopSoundOn(sound_cast2, parent);
        EmitSoundOn(sound_cancel, caster);
        EmitSoundOn(sound_cancel, parent);
    }
}
