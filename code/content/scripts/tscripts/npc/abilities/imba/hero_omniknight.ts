
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function Purification(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, target: IBaseNpc_Plus) {
    let particle_cast = "particles/units/heroes/hero_omniknight/omniknight_purification_cast.vpcf";
    let particle_aoe = "particles/units/heroes/hero_omniknight/omniknight_purification.vpcf";
    let particle_hit = "particles/units/heroes/hero_omniknight/omniknight_purification_hit.vpcf";
    let modifier_purifiception = "modifier_imba_purification_buff";
    let heal_amount = ability.GetSpecialValueFor("heal_amount");
    let radius = ability.GetTalentSpecialValueFor("radius");
    let purifiception_duration = ability.GetSpecialValueFor("purifiception_duration");
    heal_amount = heal_amount + caster.GetTalentValue("special_bonus_imba_omniknight_8");
    let particle_cast_fx = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
    ParticleManager.SetParticleControlEnt(particle_cast_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
    ParticleManager.SetParticleControl(particle_cast_fx, 1, target.GetAbsOrigin());
    ParticleManager.ReleaseParticleIndex(particle_cast_fx);
    let particle_aoe_fx = ResHelper.CreateParticleEx(particle_aoe, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
    ParticleManager.SetParticleControl(particle_aoe_fx, 0, target.GetAbsOrigin());
    ParticleManager.SetParticleControl(particle_aoe_fx, 1, Vector(radius, 1, 1));
    ParticleManager.ReleaseParticleIndex(particle_aoe_fx);
    let spell_power = caster.GetSpellAmplification(false);
    let heal = heal_amount;
    let damage = heal;
    target.ApplyHeal(heal, ability);
    let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
    for (const [_, enemy] of GameFunc.iPair(enemies)) {
        if (!enemy.IsMagicImmune()) {
            let damageTable = {
                victim: enemy,
                attacker: caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                ability: ability
            }
            ApplyDamage(damageTable);
            let particle_hit_fx = ResHelper.CreateParticleEx(particle_hit, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
            ParticleManager.SetParticleControlEnt(particle_hit_fx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(particle_hit_fx, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(particle_hit_fx, 3, Vector(radius, 0, 0));
            ParticleManager.ReleaseParticleIndex(particle_hit_fx);
        }
    }
    if (!target.HasModifier(modifier_purifiception)) {
        target.AddNewModifier(caster, ability, modifier_purifiception, {
            duration: purifiception_duration
        });
    }
    let modifier_purifiception_handler = target.FindModifierByName(modifier_purifiception);
    if (modifier_purifiception_handler) {
        modifier_purifiception_handler.ForceRefresh();
    }
}
@registerAbility()
export class imba_omniknight_purification extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "omniknight_purification";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_purification_omniguard_ready";
    }
    GetAOERadius(): number {
        let ability = this;
        let radius = ability.GetSpecialValueFor("radius");
        return radius;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let rare_cast_response = "omniknight_omni_ability_purif_03";
        let target_cast_response = {
            "1": "omniknight_omni_ability_purif_01",
            "2": "omniknight_omni_ability_purif_02",
            "3": "omniknight_omni_ability_purif_04",
            "4": "omniknight_omni_ability_purif_05",
            "5": "omniknight_omni_ability_purif_06",
            "6": "omniknight_omni_ability_purif_07",
            "7": "omniknight_omni_ability_purif_08"
        }
        let self_cast_response = {
            "1": "omniknight_omni_ability_purif_01",
            "2": "omniknight_omni_ability_purif_05",
            "3": "omniknight_omni_ability_purif_06",
            "4": "omniknight_omni_ability_purif_07",
            "5": "omniknight_omni_ability_purif_08"
        }
        let sound_cast = "Hero_Omniknight.Purification";
        if (caster == target) {
            if (RollPercentage(50)) {
                EmitSoundOn(GFuncRandom.RandomValue(self_cast_response), caster);
            }
        } else {
            if (RollPercentage(5)) {
                EmitSoundOn(rare_cast_response, caster);
            } else if (RollPercentage(50)) {
                EmitSoundOn(GFuncRandom.RandomValue(target_cast_response), caster);
            }
        }
        EmitSoundOn(sound_cast, caster);
        Purification(caster, ability, target);
        if (caster.HasTalent("special_bonus_imba_omniknight_4")) {
            let bounce_radius = caster.GetTalentValue("special_bonus_imba_omniknight_4");
            let allies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, bounce_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, ally] of GameFunc.iPair(allies)) {
                if (ally != target) {
                    Purification(caster, ability, ally);
                    return;
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_purification_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public purifiception_heal_amp_pct: number;
    public purifiception_max_stacks: number;
    public purifiception_stack_threshold: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.purifiception_heal_amp_pct = this.ability.GetSpecialValueFor("purifiception_heal_amp_pct");
        this.purifiception_max_stacks = this.ability.GetSpecialValueFor("purifiception_max_stacks");
        this.purifiception_stack_threshold = this.ability.GetSpecialValueFor("purifiception_stack_threshold");
        this.SetStackCount(1);
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
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_HEALTH_GAINED
        }
        return Object.values(decFuncs);
    } */
    GetEffectName(): string {
        return "particles/hero/omniknight/purification_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage( /** keys */): number {
        let stacks = this.GetStackCount();
        return this.purifiception_heal_amp_pct * stacks;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_HEALTH_GAINED)
    CC_OnHealthGained(keys: ModifierHealEvent): void {
        if (IsServer()) {
            if (keys.unit == this.parent) {
                if (keys.gain && keys.gain >= this.purifiception_stack_threshold) {
                    this.IncrementStackCount();
                }
            }
        }
    }
    OnStackCountChanged(p_0: number,): void {
        if (IsServer()) {
            let stacks = this.GetStackCount();
            if (stacks > this.purifiception_max_stacks) {
                this.SetStackCount(this.purifiception_max_stacks);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_purification_omniguard_ready extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_recharge: any;
    public cooldown: number;
    public trigger_hp_pct: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_recharge = "modifier_imba_purification_omniguard_recharging";
        if (this.caster.HasModifier(this.modifier_recharge)) {
            this.Destroy();
        }
    }
    IsHidden(): boolean {
        if (this.caster.HasTalent("special_bonus_imba_omniknight_2")) {
            return false;
        }
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
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
            if (this.caster == unit) {
                if (!this.caster.HasTalent("special_bonus_imba_omniknight_2")) {
                    return undefined;
                }
                if (this.caster.PassivesDisabled() || this.caster.IsIllusion()) {
                    return undefined;
                }
                this.cooldown = this.caster.GetTalentValue("special_bonus_imba_omniknight_2", "cooldown");
                this.trigger_hp_pct = this.caster.GetTalentValue("special_bonus_imba_omniknight_2", "trigger_hp_pct");
                let current_health_pct = this.caster.GetHealthPercent();
                if (current_health_pct <= this.trigger_hp_pct && !this.caster.HasModifier(this.modifier_recharge)) {
                    this.caster.AddNewModifier(this.caster, this.ability, this.modifier_recharge, {
                        duration: this.cooldown
                    });
                    Purification(this.caster, this.ability, this.caster);
                    this.Destroy();
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_purification_omniguard_recharging extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_omniguard: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_omniguard = "modifier_imba_purification_omniguard_ready";
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
    GetTexture(): string {
        return "omnikinight_purification_cooldown";
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.caster.AddNewModifier(this.caster, this.ability, this.modifier_omniguard, {});
        }
    }
}
@registerAbility()
export class imba_omniknight_repel extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "omniknight_repel";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_degen_aura";
    }
    OnUnStolen(): void {
        let caster = this.GetCasterPlus();
        let modifier_degen = "modifier_imba_degen_aura";
        if (caster.HasModifier(modifier_degen)) {
            caster.RemoveModifierByName(modifier_degen);
        }
    }
    GetAOERadius(): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_omniknight_6")) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_omniknight_6", "radius");
        } else {
            return 0;
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let target_cast_response = "omniknight_omni_ability_repel_0" + math.random(1, 6);
        let self_cast_response = {
            "1": "omniknight_omni_ability_repel_01",
            "2": "omniknight_omni_ability_repel_05",
            "3": "omniknight_omni_ability_repel_06"
        }
        let sound_cast = "Hero_Omniknight.Repel";
        let duration = ability.GetSpecialValueFor("duration");
        if (target != caster) {
            EmitSoundOn(target_cast_response, caster);
        } else {
            EmitSoundOn(GFuncRandom.RandomValue(self_cast_response), caster);
        }
        EmitSoundOn(sound_cast, caster);
        this.Repel(caster, ability, target, duration);
        if (caster.HasTalent("special_bonus_imba_omniknight_6")) {
            let radius = caster.GetTalentValue("special_bonus_imba_omniknight_6", "radius");
            let talent_duration = caster.GetTalentValue("special_bonus_imba_omniknight_6", "duration");
            let allies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, ally] of GameFunc.iPair(allies)) {
                if (ally != target) {
                    this.Repel(caster, ability, ally, duration);
                }
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_omniknight_6") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_omniknight_6")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_omniknight_6"), "modifier_special_bonus_imba_omniknight_6", {});
        }
    }
    Repel(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, target: IBaseNpc_Plus, duration: number) {
        let particle_cast = "particles/units/heroes/hero_omniknight/omniknight_repel_cast.vpcf";
        let modifier_repel = "modifier_imba_repel";
        let modifier_degen_aura = "modifier_imba_degen_aura";
        let particle_cast_fx = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControl(particle_cast_fx, 0, target.GetAbsOrigin());
        target.Purge(false, true, false, true, true);
        target.AddNewModifier(caster, ability, modifier_repel, {
            duration: duration
        });
        if (target != caster) {
            target.AddNewModifier(caster, ability, modifier_degen_aura, {
                duration: duration
            });
        }
    }
}
@registerModifier()
export class modifier_imba_repel extends BaseModifier_Plus {
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
        let state = {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return 100;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_omniknight/omniknight_repel_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_degen_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public aura_radius: number;
    public linger_duration: number;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.aura_radius = this.ability.GetSpecialValueFor("aura_radius");
        this.linger_duration = this.ability.GetSpecialValueFor("linger_duration");
    }
    GetEffectName(): string {
        return "particles/auras/aura_degen.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetAuraDuration(): number {
        return this.linger_duration;
    }
    GetAuraRadius(): number {
        return this.aura_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_degen_debuff";
    }
    IsAura(): boolean {
        if (this.caster.PassivesDisabled()) {
            return false;
        }
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }

}
@registerModifier()
export class modifier_imba_degen_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public ms_slow_pct: number;
    public as_slow: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct");
        this.as_slow = this.ability.GetSpecialValueFor("as_slow");
        this.ms_slow_pct = this.ms_slow_pct + this.caster.GetTalentValue("special_bonus_imba_omniknight_3");
        this.as_slow = this.as_slow + this.caster.GetTalentValue("special_bonus_imba_omniknight_3");
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_omniknight/omniknight_degen_aura_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_slow_pct * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.as_slow * (-1);
    }
    GetTexture(): string {
        return "omniknight_degen_aura";
    }
}
@registerAbility()
export class imba_omniknight_heavenly_grace extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_degen_aura";
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_omniknight_10");
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Omniknight.Repel");
        if (this.GetCasterPlus().GetUnitName().includes("omniknight")) {
            if (this.GetCursorTarget() != this.GetCasterPlus()) {
                this.GetCasterPlus().EmitSound("omniknight_omni_ability_repel_0" + math.random(1, 6));
            } else {
                let responses = {
                    "1": "omniknight_omni_ability_repel_01",
                    "2": "omniknight_omni_ability_repel_05",
                    "3": "omniknight_omni_ability_repel_06"
                }
                this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(responses));
            }
        }
        this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_omniknight_heavenly_grace", {
            duration: this.GetSpecialValueFor("duration")
        });
        this.GetCursorTarget().Purge(false, true, false, true, true);
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_omniknight_10") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_omniknight_10")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_omniknight_10"), "modifier_special_bonus_imba_omniknight_10", {});
        }
    }
}
@registerModifier()
export class modifier_imba_omniknight_heavenly_grace extends BaseModifier_Plus {
    public status_resistance: any;
    public bonus_str: number;
    public hp_regen: any;
    public holy_veil_magic_resistance: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_omniknight/omniknight_heavenly_grace_buff.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.status_resistance = this.GetSpecialValueFor("status_resistance");
        this.bonus_str = this.GetSpecialValueFor("bonus_str");
        this.hp_regen = this.GetSpecialValueFor("hp_regen");
        this.holy_veil_magic_resistance = this.GetSpecialValueFor("holy_veil_magic_resistance");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.status_resistance;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_str;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.hp_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.holy_veil_magic_resistance;
    }
}
@registerAbility()
export class imba_omniknight_hammer_of_virtue extends BaseAbility_Plus {
    public _isAutoAttack: boolean = false;;
    OnToggle(): void {
        return;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            caster.MoveToTargetToAttack(this.GetCursorTarget());
            this.EndCooldown();
            this._isAutoAttack = false;
        }
    }
    IsAutoAttack() {
        if (this._isAutoAttack != undefined) {
            let original_value = this._isAutoAttack;
            this._isAutoAttack = true;
            return original_value;
        }
        return true;
    }
    IsStealable(): boolean {
        return false;
    }
    GetAbilityTextureName(): string {
        return "omniknight_hammer_of_virtue";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_hammer_of_virtue";
    }
}
@registerModifier()
export class modifier_imba_hammer_of_virtue extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_omniknight_hammer_of_virtue;
    public particle_heal: any;
    public particle_hit: any;
    public modifier_nodmg: any;
    public IsAutoAttack: any;
    public toggled_on_default: any;
    public radius: number;
    public damage_as_heal_pct: number;
    public talent_1_leveled: any;
    public particle_hit_fx: any;
    public particle_heal_fx: any;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        if (IsServer()) {
            this.particle_heal = "particles/hero/omniknight/hammer_of_virtue_heal.vpcf";
            this.particle_hit = "particles/units/heroes/hero_omniknight/omniknight_purification_hit.vpcf";
            this.modifier_nodmg = "modifier_imba_hammer_of_virtue_nodamage";
            this.IsAutoAttack = this.ability.IsAutoAttack();
            if (!this.toggled_on_default) {
                this.toggled_on_default = true;
                this.ability.ToggleAutoCast();
            }
            this.radius = this.ability.GetSpecialValueFor("radius");
            this.damage_as_heal_pct = this.ability.GetSpecialValueFor("damage_as_heal_pct");
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            let damage = keys.original_damage;
            if (this.caster.HasTalent("special_bonus_imba_omniknight_1") && !this.talent_1_leveled) {
                this.damage_as_heal_pct = this.damage_as_heal_pct + this.caster.GetTalentValue("special_bonus_imba_omniknight_1");
                this.talent_1_leveled = true;
            }
            if (this.caster == attacker) {
                if (!this.ability.IsCooldownReady()) {
                    return undefined;
                }
                if (this.ability.IsAutoAttack() && !this.ability.GetAutoCastState()) {
                    return undefined;
                }
                if (this.caster.GetTeamNumber() == target.GetTeamNumber()) {
                    return undefined;
                }
                if (this.caster.PassivesDisabled()) {
                    return undefined;
                }
                if (!target.IsRealUnit() && !target.IsCreep()) {
                    return undefined;
                }
                this.particle_hit_fx = ResHelper.CreateParticleEx(this.particle_hit, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                ParticleManager.SetParticleControlEnt(this.particle_hit_fx, 0, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.caster.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(this.particle_hit_fx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(this.particle_hit_fx);
                this.caster.AddNewModifier(this.caster, this.ability, this.modifier_nodmg, {
                    duration: 0.1
                });
                target.AddNewModifier(this.caster, this.ability, this.modifier_nodmg, {
                    duration: 0.1
                });
                let damageTable = {
                    victim: target,
                    attacker: this.caster,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                let allies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
                let heal = damage * this.damage_as_heal_pct * 0.01;
                for (const [_, ally] of GameFunc.iPair(allies)) {
                    ally.ApplyHeal(heal, this.ability);
                    this.particle_heal_fx = ResHelper.CreateParticleEx(this.particle_heal, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ally);
                    ParticleManager.SetParticleControl(this.particle_heal_fx, 0, ally.GetAbsOrigin());
                }
                this.ability.UseResources(false, false, true);
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
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }

}
@registerModifier()
export class modifier_imba_hammer_of_virtue_nodamage extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
}
@registerAbility()
export class imba_omniknight_guardian_angel extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "omniknight_guardian_angel";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetCooldown(level: number): number {
        let caster = this.GetCasterPlus();
        let cooldown = super.GetCooldown(level);
        cooldown = cooldown - caster.GetTalentValue("special_bonus_imba_omniknight_7");
        return cooldown;
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_4;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let cast_response = {
            "1": "omniknight_omni_ability_guard_04",
            "2": "omniknight_omni_ability_guard_05",
            "3": "omniknight_omni_ability_guard_06",
            "4": "omniknight_omni_ability_guard_10"
        }
        let sound_cast = "Hero_Omniknight.GuardianAngel.Cast";
        let modifier_angel = "modifier_imba_guardian_angel";
        let scepter = caster.HasScepter();
        let duration = ability.GetSpecialValueFor("duration");
        let scepter_duration = ability.GetSpecialValueFor("scepter_duration");
        let radius = ability.GetSpecialValueFor("radius");
        EmitSoundOn(GFuncRandom.RandomValue(cast_response), caster);
        EmitSoundOn(sound_cast, caster);
        if (scepter) {
            duration = scepter_duration;
            radius = 25000;
        }
        let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, ally] of GameFunc.iPair(allies)) {
            ally.AddNewModifier(caster, ability, modifier_angel, {
                duration: duration
            });
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_omniknight_7") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_omniknight_7")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_omniknight_7"), "modifier_special_bonus_imba_omniknight_7", {});
        }
    }
}
@registerModifier()
export class modifier_imba_guardian_angel extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_wings: any;
    public particle_ally: any;
    public particle_halo: any;
    public modifier_shield: any;
    public shield_duration: number;
    public scepter_regen: any;
    public particle_wings_fx: any;
    public particle_halo_fx: any;
    public particle_ally_fx: any;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_wings = "particles/units/heroes/hero_omniknight/omniknight_guardian_angel_omni.vpcf";
        this.particle_ally = "particles/units/heroes/hero_omniknight/omniknight_guardian_angel_ally.vpcf";
        this.particle_halo = "particles/units/heroes/hero_omniknight/omniknight_guardian_angel_halo_buff.vpcf";
        this.modifier_shield = "modifier_imba_guardian_angel_shield";
        this.shield_duration = this.ability.GetSpecialValueFor("shield_duration");
        this.scepter_regen = this.ability.GetSpecialValueFor("scepter_regen");
        if (this.parent == this.caster) {
            this.particle_wings_fx = ResHelper.CreateParticleEx(this.particle_wings, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(this.particle_wings_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControlEnt(this.particle_wings_fx, 5, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            this.AddParticle(this.particle_wings_fx, false, false, -1, false, false);
            this.particle_halo_fx = ResHelper.CreateParticleEx(this.particle_halo, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
            ParticleManager.SetParticleControlEnt(this.particle_halo_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            this.AddParticle(this.particle_halo_fx, false, false, -1, false, false);
        } else {
            this.particle_ally_fx = ResHelper.CreateParticleEx(this.particle_ally, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(this.particle_ally_fx, 0, this.parent.GetAbsOrigin());
            this.AddParticle(this.particle_ally_fx, false, false, -1, false, false);
        }
    }

    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_guardian_angel.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.scepter_regen;
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
    BeDestroy(): void {
        if (IsServer() && (this.GetElapsedTime() >= this.shield_duration)) {
            this.parent.AddNewModifier(this.caster, this.ability, this.modifier_shield, {
                duration: this.shield_duration
            });
        }
    }
}
@registerModifier()
export class modifier_imba_guardian_angel_shield extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public max_hp_shield_health_pct: number;
    public shield_health: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.max_hp_shield_health_pct = this.ability.GetSpecialValueFor("max_hp_shield_health_pct");
            this.max_hp_shield_health_pct = this.max_hp_shield_health_pct + this.caster.GetTalentValue("special_bonus_imba_omniknight_5");
            this.shield_health = this.parent.GetMaxHealth() * this.max_hp_shield_health_pct * 0.01;
        }
    }
    GetEffectName(): string {
        return "particles/hero/omniknight/guardian_angel_shield.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.AVOID_DAMAGE,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.AVOID_DAMAGE)
    CC_GetModifierAvoidDamage(p_0: ModifierAttackEvent,): number {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let original_damage = keys.original_damage;
            let damage_type = keys.damage_type;
            let unit = keys.unit;
            let attacker = keys.attacker;
            let damage;
            if (this.parent == unit) {
                if (damage_type == DAMAGE_TYPES.DAMAGE_TYPE_PURE) {
                    damage = original_damage;
                } else if (damage_type == DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) {
                    let magic_res = this.parent.GetMagicalArmorValue();
                    damage = original_damage * (1 - magic_res);
                } else {
                    let armornpc = this.parent.GetPhysicalArmorValue(false);
                    let physical_reduction = 1 - (0.06 * armornpc) / (1 + (0.06 * math.abs(armornpc)));
                    physical_reduction = 100 - (physical_reduction * 100);
                    damage = original_damage * (1 - physical_reduction * 0.01);
                }
                if (this.shield_health <= damage) {
                    this.Destroy();
                    let excess_damage = damage - this.shield_health;
                    let damageTable = {
                        victim: this.parent,
                        attacker: attacker,
                        damage: damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                        ability: this.ability
                    }
                    ApplyDamage(damageTable);
                } else {
                    this.shield_health = this.shield_health - damage;
                }
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
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_omniknight_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_omniknight_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_omniknight_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_omniknight_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_omniknight_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_omniknight_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_omniknight_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_omniknight_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_omniknight_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_omniknight_10 extends BaseModifier_Plus {
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
