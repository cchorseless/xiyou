
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_necrolyte_sadist extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "necrolyte_sadist";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_sadist";
    }
    IsInnateAbility() {
        return true;
    }
}
@registerModifier()
export class modifier_imba_sadist extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_sadist: any;
    public regen_duration: number;
    public hero_multiplier: any;
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_sadist = "modifier_imba_sadist_stack";
        this.regen_duration = this.ability.GetSpecialValueFor("regen_duration");
        this.hero_multiplier = this.ability.GetSpecialValueFor("hero_multiplier");
    }
    IsHidden(): boolean {
        return true;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            if (!params.attacker.IsRealUnit()) {
                return undefined;
            }
            if (params.attacker.PassivesDisabled()) {
                return undefined;
            }
            if (this.caster.HasTalent("special_bonus_imba_necrolyte_2")) {
                if (params.attacker == this.caster && params.target.IsRealUnit()) {
                    if (!this.caster.HasModifier(this.modifier_sadist)) {
                        this.caster.AddNewModifier(this.caster, this.ability, "modifier_imba_sadist_stack", {
                            duration: this.regen_duration
                        });
                    }
                    let modifier_sadist_handler = this.caster.FindModifierByName(this.modifier_sadist);
                    if (modifier_sadist_handler) {
                        modifier_sadist_handler.IncrementStackCount();
                        modifier_sadist_handler.ForceRefresh();
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            let unit = params.unit;
            if (params.attacker == this.GetParentPlus()) {
                if (!params.attacker.IsRealUnit()) {
                    return undefined;
                }
                if (params.attacker.PassivesDisabled()) {
                    return undefined;
                }
                let stacks = 1;
                if (unit.IsRealUnit()) {
                    stacks = this.hero_multiplier;
                }
                if (!this.caster.HasModifier(this.modifier_sadist)) {
                    this.caster.AddNewModifier(this.caster, this.ability, "modifier_imba_sadist_stack", {
                        duration: this.regen_duration
                    });
                }
                let modifier_sadist_handler = this.caster.FindModifierByName(this.modifier_sadist);
                if (modifier_sadist_handler) {
                    for (let i = 0; i < stacks; i++) {
                        modifier_sadist_handler.IncrementStackCount();
                        modifier_sadist_handler.ForceRefresh();
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_sadist_stack extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public regen_duration: number;
    public mana_regen: any;
    public health_regen: any;
    public regen_minimum: any;
    public stacks_table: number[];
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.regen_duration = this.ability.GetSpecialValueFor("regen_duration");
            this.mana_regen = this.ability.GetSpecialValueFor("mana_regen");
            this.health_regen = this.ability.GetSpecialValueFor("health_regen");
            this.regen_minimum = this.ability.GetSpecialValueFor("regen_minimum");
            this.stacks_table = []
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameFunc.GetCount(this.stacks_table) > 0) {
                for (let i = this.stacks_table.length - 1; i >= 0; i--) {
                    if (this.stacks_table[i] + this.regen_duration < GameRules.GetGameTime()) {
                        this.stacks_table.splice(i, 1);
                    }
                }
                if (GameFunc.GetCount(this.stacks_table) == 0) {
                    this.GetParentPlus().RemoveModifierByName("modifier_imba_sadist_stack");
                } else {
                    this.SetStackCount(GameFunc.GetCount(this.stacks_table));
                }
            } else {
                this.GetParentPlus().RemoveModifierByName("modifier_imba_sadist_stack");
            }
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            this.stacks_table.push(GameRules.GetGameTime());
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
        let decFunc = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT
        }
        return Object.values(decFunc);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        if (!IsServer()) {
            return;
        }
        if (this.caster && this.mana_regen && this.regen_minimum) {
            let mana_regen = this.mana_regen + this.caster.GetTalentValue("special_bonus_imba_necrolyte_6");
            mana_regen = mana_regen * this.GetStackCount() * this.GetParentPlus().GetMaxMana() * 0.01;
            let regen_minimum = this.regen_minimum * this.GetStackCount();
            return math.max(mana_regen, regen_minimum);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (!IsServer()) {
            return;
        }
        if (this.caster && this.health_regen && this.regen_minimum) {
            let health_regen = this.health_regen + this.caster.GetTalentValue("special_bonus_imba_necrolyte_6");
            health_regen = health_regen * this.GetStackCount() * this.GetParentPlus().GetMaxHealth() * 0.01;
            let regen_minimum = this.regen_minimum * this.GetStackCount();
            return math.max(health_regen, regen_minimum);
        }
    }
}
@registerAbility()
export class imba_necrolyte_death_pulse extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "necrolyte_death_pulse";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetTalentSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let radius = this.GetTalentSpecialValueFor("radius");
            let damage = this.GetSpecialValueFor("damage");
            let base_heal = this.GetSpecialValueFor("base_heal");
            let sec_heal_pct = this.GetSpecialValueFor("sec_heal_pct");
            let enemy_speed = this.GetSpecialValueFor("enemy_speed");
            let ally_speed = this.GetSpecialValueFor("ally_speed");
            caster.EmitSound("Hero_Necrolyte.DeathPulse");
            if ((math.random(1, 100) <= 50) && (caster.GetUnitName().includes("necrolyte"))) {
                caster.EmitSound("necrolyte_necr_ability_tox_0" + math.random(1, 3));
            }
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster_loc, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                ApplyDamage({
                    attacker: caster,
                    victim: enemy,
                    ability: this,
                    damage: damage,
                    damage_type: this.GetAbilityDamageType()
                });
                let enemy_projectile = {
                    Target: caster,
                    Source: enemy,
                    Ability: this,
                    EffectName: "particles/units/heroes/hero_necrolyte/necrolyte_pulse_enemy.vpcf",
                    bDodgeable: false,
                    bProvidesVision: false,
                    iMoveSpeed: enemy_speed,
                    flExpireTime: GameRules.GetGameTime() + 60,
                    iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                    ExtraData: {
                        sec_heal_pct: sec_heal_pct,
                        radius: radius,
                        ally_speed: ally_speed
                    }
                }
                ProjectileManager.CreateTrackingProjectile(enemy_projectile);
            }
            let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster_loc, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, ally] of GameFunc.iPair(allies)) {
                let ally_projectile = {
                    Target: ally,
                    Source: caster,
                    Ability: this,
                    EffectName: "particles/units/heroes/hero_necrolyte/necrolyte_pulse_friend.vpcf",
                    bDodgeable: false,
                    bProvidesVision: false,
                    iMoveSpeed: ally_speed,
                    flExpireTime: GameRules.GetGameTime() + 60,
                    iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                    ExtraData: {
                        base_heal: base_heal
                    }
                }
                ProjectileManager.CreateTrackingProjectile(ally_projectile);
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, vLocation: Vector, extraData: any): boolean | void {
        if (IsServer()) {
            if (target && !target.IsRealUnit()) { return }
            let caster = this.GetCasterPlus();
            if (extraData.base_heal) {
                target.ApplyHeal(extraData.base_heal, this);
                return;
            }
            let caster_loc = caster.GetAbsOrigin();
            if (!extraData.radius) {
                let heal = target.GetMaxHealth() * (extraData.sec_heal_pct / 100);
                target.ApplyHeal(heal, this);
            }
            if (extraData.radius) {
                let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster_loc, undefined, extraData.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, ally] of GameFunc.iPair(allies)) {
                    let ally_projectile = {
                        Target: ally,
                        Source: caster,
                        Ability: this,
                        EffectName: "particles/units/heroes/hero_necrolyte/necrolyte_pulse_friend.vpcf",
                        bDodgeable: false,
                        bProvidesVision: false,
                        iMoveSpeed: extraData.ally_speed,
                        flExpireTime: GameRules.GetGameTime() + 60,
                        iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                        ExtraData: {
                            sec_heal_pct: extraData.sec_heal_pct,
                            ally_speed: extraData.ally_speed
                        }
                    }
                    ProjectileManager.CreateTrackingProjectile(ally_projectile);
                }
                return undefined;
            }
        }
    }
    GetCooldown(nLevel: number): number {
        return super.GetCooldown(nLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_necrolyte_3");
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_necrolyte_1") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_necrolyte_1")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_necrolyte_1"), "modifier_special_bonus_imba_necrolyte_1", {});
        }
    }

    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this)
    }
}
@registerAbility()
export class imba_necrolyte_ghost_shroud extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "necrolyte_sadist";
    }
    GetCooldown(level: number): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCooldown(level);
        } else {
            return this.GetSpecialValueFor("cooldown_scepter");
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let duration = this.GetSpecialValueFor("duration");
            let radius = this.GetTalentSpecialValueFor("radius");
            let healing_amp_pct = this.GetSpecialValueFor("healing_amp_pct");
            let slow_pct = this.GetSpecialValueFor("slow_pct");
            caster.EmitSound("Hero_Necrolyte.SpiritForm.Cast");
            caster.StartGesture(GameActivity_t.ACT_DOTA_NECRO_GHOST_SHROUD);
            caster.AddNewModifier(caster, this, "modifier_imba_ghost_shroud_active", {
                duration: duration
            });
            caster.AddNewModifier(caster, this, "modifier_imba_ghost_shroud_aura", {
                duration: duration,
                radius: radius,
                healing_amp_pct: healing_amp_pct,
                slow_pct: slow_pct
            });
            caster.AddNewModifier(caster, this, "modifier_imba_ghost_shroud_aura_debuff", {
                duration: duration,
                radius: radius,
                healing_amp_pct: healing_amp_pct,
                slow_pct: slow_pct
            });
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetTalentSpecialValueFor("radius") - this.GetCasterPlus().GetCastRangeBonus();
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_necrolyte_5") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_necrolyte_5")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_necrolyte_5"), "modifier_special_bonus_imba_necrolyte_5", {});
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_ghost_shroud_active extends BaseModifier_Plus {
    public healing_amp_pct: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_pugna/pugna_decrepify.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_DECREPIFY_UNIQUE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MP_REGEN_AMPLIFY_PERCENTAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MP_RESTORE_AMPLIFY_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceDecrepifyUnique(params: ModifierAttackEvent): number {
        return this.GetSpecialValueFor("magic_amp_pct") * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        if (this.GetCasterPlus() == this.GetParentPlus()) {
            return 1;
        } else {
            return undefined;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierMPRegenAmplify_Percentage(): number {
        return this.healing_amp_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MP_RESTORE_AMPLIFY_PERCENTAGE)
    CC_GetModifierMPRestoreAmplify_Percentage(): number {
        return this.healing_amp_pct;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true
        };
    }
    BeCreated(p_0: any,): void {
        this.healing_amp_pct = this.GetSpecialValueFor("healing_amp_pct");
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().IsMagicImmune()) {
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_ghost_shroud_aura extends BaseModifier_Plus {
    public radius: number;
    public healing_amp_pct: number;
    public slow_pct: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            this.radius = params.radius;
            this.healing_amp_pct = params.healing_amp_pct;
            this.slow_pct = params.slow_pct;
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_necrolyte/necrolyte_spirit.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (IsServer()) {
            return false;
        }
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
        return this.GetAbilityPlus().GetAbilityTargetType();
    }
    GetModifierAura(): string {
        return "modifier_imba_ghost_shroud_buff";
    }
}
@registerModifier()
export class modifier_imba_ghost_shroud_buff extends BaseModifier_Plus {
    public healing_amp_pct: number;
    IsHidden(): boolean {
        if (this.GetParentPlus() == this.GetCasterPlus()) {
            return true;
        }
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.healing_amp_pct = this.GetSpecialValueFor("healing_amp_pct");
        if (this.GetCasterPlus() != this.GetParentPlus()) {
            this.healing_amp_pct = this.healing_amp_pct * 0.5;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEAL_AMPLIFY_PERCENTAGE_TARGET,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEAL_AMPLIFY_PERCENTAGE_TARGET)
    CC_GetModifierHealAmplify_PercentageTarget() {
        return this.healing_amp_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage(): number {
        return this.healing_amp_pct;
    }
}
@registerModifier()
export class modifier_imba_ghost_shroud_aura_debuff extends BaseModifier_Plus {
    public radius: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            this.radius = params.radius;
        }
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return this.GetAbilityPlus().GetAbilityTargetType();
    }
    GetModifierAura(): string {
        return "modifier_imba_ghost_shroud_debuff";
    }
}
@registerModifier()
export class modifier_imba_ghost_shroud_debuff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_necrolyte/necrolyte_spirit_debuff.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetAbilityPlus()) {
            return this.GetSpecialValueFor("slow_pct") * (-1);
        }
    }
}
@registerAbility()
export class imba_necrolyte_heartstopper_aura extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_heartstopper_aura";
    }
    GetAbilityTextureName(): string {
        return "necrolyte_heartstopper_aura";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("radius");
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_necrolyte_4") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_necrolyte_4")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_necrolyte_4"), "modifier_special_bonus_imba_necrolyte_4", {});
        }
    }
}
@registerModifier()
export class modifier_imba_heartstopper_aura extends BaseModifier_Plus {
    public radius: number;
    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
    }

    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_heartstopper_aura_damage";
    }
    IsAura(): boolean {
        if (this.GetCasterPlus().PassivesDisabled()) {
            return false;
        }
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    IsHidden(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/generic/auras/aura_heartstopper.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_heartstopper_aura_damage extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public radius: number;
    public damage_pct: number;
    public tick_rate: any;
    public scepter_multiplier: any;
    public timer: boolean;
    IsHidden(): boolean {
        if (this.GetStackCount() == 0) {
            return true;
        }
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.parent = this.GetParentPlus();
            this.radius = this.GetSpecialValueFor("radius");
            this.damage_pct = this.GetAbilityPlus().GetTalentSpecialValueFor("damage_pct");
            this.tick_rate = this.GetAbilityPlus().GetTalentSpecialValueFor("tick_rate");
            this.scepter_multiplier = this.GetSpecialValueFor("scepter_multiplier");
            if (this.GetParentPlus().CanEntityBeSeenByMyTeam(this.GetCasterPlus())) {
                this.SetStackCount(this.GetAbilityPlus().GetTalentSpecialValueFor("heal_reduce_pct"));
            }
            if (!this.timer) {
                this.StartIntervalThink(this.tick_rate);
                this.timer = true;
            }
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (!IsValid(caster)) {
                this.Destroy();
                return
            }
            if (this.GetParentPlus().CanEntityBeSeenByMyTeam(caster)) {
                this.SetStackCount(this.GetAbilityPlus().GetTalentSpecialValueFor("heal_reduce_pct"));
            } else {
                this.SetStackCount(0);
            }
            if (!caster.PassivesDisabled()) {
                let damage = this.parent.GetMaxHealth() * (this.damage_pct * this.tick_rate) / 100;
                if (caster.HasModifier("modifier_imba_ghost_shroud_active")) {
                    damage = damage * this.scepter_multiplier;
                }
                ApplyDamage({
                    attacker: caster,
                    victim: this.parent,
                    ability: this.GetAbilityPlus(),
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION
                });
                if ((math.random(1, 1000) <= 1) && (caster.GetUnitName().includes("necrolyte"))) {
                    caster.EmitSound("necrolyte_necr_ability_aura_0" + math.random(1, 3));
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage(): number {
        if (this.GetAbilityPlus() != undefined) {
            return (this.GetAbilityPlus().GetTalentSpecialValueFor("heal_reduce_pct") * (-1));
        }
    }
}
@registerAbility()
export class imba_necrolyte_reapers_scythe extends BaseAbility_Plus {
    ghost_death: boolean = false;
    GetAbilityTextureName(): string {
        return "necrolyte_reapers_scythe";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            if (target.TriggerSpellAbsorb(this)) {
                return undefined;
            }
            caster.EmitSound("Hero_Necrolyte.ReapersScythe.Cast");
            target.EmitSound("Hero_Necrolyte.ReapersScythe.Target");
            if ((math.random(1, 100) <= 30) && (caster.GetUnitName().includes("necrolyte"))) {
                caster.EmitSound("necrolyte_necr_ability_reap_0" + math.random(1, 3));
            }
            let damage = this.GetSpecialValueFor("damage");
            let stun_duration = this.GetSpecialValueFor("stun_duration");
            target.AddNewModifier(caster, this, "modifier_imba_reapers_scythe", {
                duration: stun_duration
            });
        }
    }
    GetCooldown(nLevel: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_cooldown");
        }
        return super.GetCooldown(nLevel);
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_necrolyte_7") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_necrolyte_7")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_necrolyte_7"), "modifier_special_bonus_imba_necrolyte_7", {});
        }
    }
    GetManaCost(level: number): number {
        return 800;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this, null, (u) => {
            return u.GetHealthLosePect() > 50;
        })
    }
}
@registerModifier()
export class modifier_imba_reapers_scythe extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public damage: number;
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetParentPlus();
            this.ability = this.GetAbilityPlus();
            this.damage = this.ability.GetSpecialValueFor("damage");
            let stun_fx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_stunned.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, target);
            this.AddParticle(stun_fx, false, false, -1, false, false);
            let orig_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_necrolyte/necrolyte_scythe_orig.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
            this.AddParticle(orig_fx, false, false, -1, false, false);
            let scythe_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_necrolyte/necrolyte_scythe_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            ParticleManager.SetParticleControlEnt(scythe_fx, 0, caster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(scythe_fx, 1, target, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(scythe_fx);
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetParentPlus();
            this.ability = this.GetAbilityPlus();
            this.damage = this.ability.GetSpecialValueFor("damage");
            let stun_fx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_stunned.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, target);
            this.AddParticle(stun_fx, false, false, -1, false, false);
            let orig_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_necrolyte/necrolyte_scythe_orig.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
            this.AddParticle(orig_fx, false, false, -1, false, false);
            let scythe_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_necrolyte/necrolyte_scythe_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            ParticleManager.SetParticleControlEnt(scythe_fx, 0, caster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(scythe_fx, 1, target, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(scythe_fx);
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_necrolyte/necrolyte_scythe.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
    BeRemoved(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetParentPlus();
            target.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_generic_stunned", {
                duration: FrameTime()
            });
            if (target.IsAlive() && this.ability) {
                this.damage = this.damage * (target.GetMaxHealth() - target.GetHealth());
                if ((this.damage * (1 + (caster.GetSpellAmplification(false) * 0.01)) * (1 - target.GetMagicalArmorValue())) >= target.GetHealth()) {
                    this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.ability, "modifier_imba_reapers_scythe_respawn", {});
                }
                let actually_dmg = ApplyDamage({
                    attacker: caster,
                    victim: target,
                    ability: this.ability,
                    damage: this.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                });
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_DAMAGE, target, actually_dmg, undefined);
                if (target.IsAlive() && target.HasModifier("modifier_imba_reapers_scythe_respawn")) {
                    this.GetParentPlus().RemoveModifierByName("modifier_imba_reapers_scythe_respawn");
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_reapers_scythe_respawn extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public respawn_increase: any;
    public reincarnate_respawn: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.ability = this.GetAbilityPlus();
            if (this.ability) {
                this.respawn_increase = this.ability.GetSpecialValueFor("respawn_increase");
                if (this.GetParentPlus().WillReincarnatePlus()) {
                    this.reincarnate_respawn = true;
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
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_RESPAWN
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_RESPAWN)
    CC_OnRespawn(params: ModifierUnitEvent): void {
        if (IsServer()) {
            if (this.GetParentPlus() == params.unit) {
                if (this.ability && !this.reincarnate_respawn) {
                    let debuff_duration = this.ability.GetSpecialValueFor("debuff_duration");
                    params.unit.AddNewModifier(params.unit, this.ability, "modifier_imba_reapers_scythe_debuff", {
                        duration: debuff_duration * (1 - params.unit.GetStatusResistance())
                    });
                }
                this.GetParentPlus().RemoveModifierByName("modifier_imba_reapers_scythe_respawn");
            }
        }
    }
}
@registerModifier()
export class modifier_imba_reapers_scythe_debuff extends BaseModifier_Plus {
    public damage_reduction_pct: number;
    public spellpower_reduction: any;
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetStatusEffectName(): string {
        return "particles/hero/necrophos/status_effect_reaper_scythe_sickness.vpcf";
    }
    BeCreated(params: any): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.damage_reduction_pct = this.GetAbilityPlus().GetTalentSpecialValueFor("damage_reduction_pct") * (-1);
        this.spellpower_reduction = this.GetAbilityPlus().GetTalentSpecialValueFor("spellpower_reduction") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.spellpower_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.damage_reduction_pct;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_necrolyte_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_necrolyte_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_necrolyte_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_necrolyte_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_necrolyte_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_necrolyte_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_necrolyte_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_necrolyte_7 extends BaseModifier_Plus {
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
