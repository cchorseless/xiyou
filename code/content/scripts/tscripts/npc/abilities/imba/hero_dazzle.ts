
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_dazzle_poison_touch extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "dazzle_poison_touch";
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("cast_range");
    }
    GetCooldown(p_0: number,): number {
        return this.GetSpecialValueFor("cooldown");
    }
    OnSpellStart(): void {
        let projectile = {
            Target: this.GetCursorTarget(),
            Source: this.GetCasterPlus(),
            Ability: this,
            EffectName: "particles/units/heroes/hero_dazzle/dazzle_poison_touch.vpcf",
            bDodgable: true,
            bProvidesVision: false,
            iMoveSpeed: this.GetSpecialValueFor("projectile_speed"),
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION
        }
        EmitSoundOn("Hero_Dazzle.Poison_Cast", this.GetCasterPlus());
        ProjectileManager.CreateTrackingProjectile(projectile);
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (target.TriggerSpellAbsorb(this)) {
            return;
        }
        EmitSoundOn("Hero_Dazzle.Poison_Touch", target);
        target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dazzle_poison_touch_setin", {
            duration: this.GetSpecialValueFor("set_in_time") * (1 - target.GetStatusResistance())
        });
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_dazzle_poison_touch_setin extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_dazzle/dazzle_poison_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.StartIntervalThink(1);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (parent.IsAlive() && !parent.IsMagicImmune()) {
                let ability = this.GetAbilityPlus();
                if (ability.GetCaster().HasTalent("special_bonus_imba_dazzle_4")) {
                    let slowMod = parent.AddNewModifier(ability.GetCaster(), ability, "modifier_imba_dazzle_poison_touch_talent_slow", {
                        duration: ability.GetSpecialValueFor("poison_duration") * (1 - parent.GetStatusResistance())
                    });
                    slowMod.SetStackCount(parent.GetMaxHealth());
                }
                let mod = parent.AddNewModifier(ability.GetCaster(), ability, "modifier_imba_dazzle_poison_touch_debuff", {
                    duration: ability.GetSpecialValueFor("poison_duration") * (1 - parent.GetStatusResistance())
                });
                mod.SetStackCount(this.GetStackCount());
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
    }
    return Object.values(funcs);
    } */
    OnIntervalThink(): void {
        if (IsServer()) {
            EmitSoundOn("Hero_Dazzle.Poison_Tick", this.GetParentPlus());
            let remaining = this.GetRemainingTime();
            if (remaining <= 1) {
                let ability = this.GetAbilityPlus();
                this.GetParentPlus().ApplyStunned(ability, ability.GetCaster(), 1 * (1 - this.GetParentPlus().GetStatusResistance()));
                this.StartIntervalThink(-1);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            let victim = keys.target;
            let damage = keys.damage;
            if (victim == parent && damage > 0) {
                let stacks = this.GetStackCount();
                if (stacks) {
                    this.SetStackCount(1 + stacks);
                } else {
                    this.SetStackCount(1);
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let minSlow = ability.GetSpecialValueFor("minimum_slow");
            let maxSlow = ability.GetSpecialValueFor("maximum_slow");
            let duration = this.GetDuration() - 1;
            let elapsed = math.floor(this.GetElapsedTime());
            let totalSlow = (maxSlow - minSlow) / duration * elapsed + minSlow;
            return totalSlow * -1;
        }
    }
}
@registerModifier()
export class modifier_imba_dazzle_poison_touch_debuff extends BaseModifier_Plus {
    public talentPoisonSpreadEnabled: any;
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetTexture(): string {
        return "dazzle_poison_touch";
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_dazzle/dazzle_poison_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
        2: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
    }
    return Object.values(funcs);
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.OnIntervalThink();
            this.StartIntervalThink(1);
        }
        if (this.GetAbilityPlus().GetCaster().HasTalent("special_bonus_imba_dazzle_5")) {
            this.talentPoisonSpreadEnabled = true;
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let stacks = this.GetStackCount();
            let baseDamage = ability.GetSpecialValueFor("poison_base_damage");
            let stackDamage = ability.GetSpecialValueFor("poison_stack_damage");
            let totalDamage = baseDamage;
            totalDamage = baseDamage + stackDamage * stacks;
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE, this.GetParentPlus(), totalDamage, undefined);
            ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: ability.GetCaster(),
                damage: totalDamage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
            });
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        let stacks = this.GetStackCount();
        if (stacks) {
            return this.GetSpecialValueFor("stack_armor_reduction") * stacks * -1;
        }
        return 0;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (this.talentPoisonSpreadEnabled) {
            let ability = keys.ability;
            let parent = this.GetParentPlus();
            let caster = ability.GetCaster();
            let originalAbility = this.GetAbilityPlus();
            let originalCaster = originalAbility.GetCaster();
            if (ability.GetCursorTarget() == parent && caster.GetTeamNumber() == parent.GetTeamNumber() && !caster.findBuff<modifier_imba_dazzle_poison_touch_debuff>("modifier_imba_dazzle_poison_touch_debuff") && keys.ability.GetAbilityName() != "ability_capture") {
                let mod = caster.AddNewModifier(originalAbility.GetCaster(), originalAbility, "modifier_imba_dazzle_poison_touch_debuff", {
                    duration: originalAbility.GetSpecialValueFor("poison_duration") * (1 - caster.GetStatusResistance())
                });
                mod.SetStackCount(this.GetStackCount());
            }
        }
    }
}
@registerModifier()
export class modifier_imba_dazzle_poison_touch_talent_slow extends BaseModifier_Plus {
    public wasDamaged: any;
    public maxHealth: any;
    public caster: IBaseNpc_Plus;
    public maxSlow: any;
    public slowPerDamage: any;
    public HpLossForSlowProc: any;
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
    }
    return Object.values(funcs);
    } */
    BeCreated(p_0: any,): void {
        let ability = this.GetAbilityPlus();
        this.wasDamaged = false;
        this.maxHealth = this.GetStackCount();
        if (IsServer()) {
            this.maxHealth = this.GetParentPlus().GetMaxHealth();
        }
        this.caster = this.GetCasterPlus();
        this.maxSlow = this.caster.GetTalentValue("special_bonus_imba_dazzle_4", "talent_slow_max") * -1;
        this.slowPerDamage = this.caster.GetTalentValue("special_bonus_imba_dazzle_4", "talent_slow_per_damage");
        this.HpLossForSlowProc = this.caster.GetTalentValue("special_bonus_imba_dazzle_4", "talent_damage_for_slow_proc");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        let slow = math.floor((this.GetStackCount() * 100 / this.maxHealth));
        let sub = slow % this.HpLossForSlowProc;
        return math.max((slow - sub) * -1, this.maxSlow);
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        let damage = keys.damage;
        if (keys.unit == this.GetParentPlus() && damage > 0) {
            if (!this.wasDamaged) {
                this.SetStackCount(0);
                this.wasDamaged = true;
            }
            let ceil = math.abs(math.ceil(damage) - damage);
            let floor = math.abs(math.floor(damage) - damage);
            if (ceil < floor) {
                damage = math.ceil(damage);
            } else {
                damage = math.floor(damage);
            }
            this.SetStackCount(this.GetStackCount() + damage);
        }
    }
}
@registerAbility()
export class imba_dazzle_poison_touch_707 extends BaseAbility_Plus {
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (target.TriggerSpellAbsorb(this)) {
            return;
        }
        let enemies = AoiHelper.FindUnitsInBicycleChain(this.GetCasterPlus().GetTeamNumber(), target.GetAbsOrigin(), this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetAbsOrigin() + ((target.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * (this.GetSpecialValueFor("end_distance") + this.GetCasterPlus().GetCastRangeBonus())) as Vector, this.GetSpecialValueFor("start_radius"), this.GetSpecialValueFor("end_radius"), undefined, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST, false);
        this.GetCasterPlus().EmitSound("Hero_Dazzle.Poison_Cast");
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (_ <= this.GetSpecialValueFor("targets")) {
                ProjectileManager.CreateTrackingProjectile({
                    EffectName: "particles/units/heroes/hero_dazzle/dazzle_poison_touch.vpcf",
                    Ability: this,
                    Source: this.GetCasterPlus(),
                    vSourceLoc: this.GetCasterPlus().GetAbsOrigin(),
                    Target: enemy,
                    iMoveSpeed: this.GetSpecialValueFor("projectile_speed"),
                    flExpireTime: undefined,
                    bDodgeable: true,
                    bIsAttack: false,
                    bReplaceExisting: false,
                    iSourceAttachment: undefined,
                    bDrawsOnMinimap: undefined,
                    bVisibleToEnemies: true,
                    bProvidesVision: false,
                    iVisionRadius: undefined,
                    iVisionTeamNumber: undefined,
                    ExtraData: {}
                });
            } else {
                return;
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (target && !target.IsRealUnit()) { return }
        if (target && !target.IsMagicImmune()) {
            target.EmitSound("Hero_Dazzle.Poison_Touch");
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dazzle_poison_touch_707", {
                duration: this.GetSpecialValueFor("duration")
            });
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_dazzle_poison_touch_707 extends BaseModifier_Plus {
    public slow: any;
    public damage: number;
    public poison_stack_damage: number;
    public damage_type: number;
    IgnoreTenacity() {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_dazzle/dazzle_poison_debuff.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_poison_dazzle.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.slow = this.GetAbilityPlus().GetTalentSpecialValueFor("slow");
        this.damage = this.GetAbilityPlus().GetTalentSpecialValueFor("damage");
        this.poison_stack_damage = this.GetSpecialValueFor("poison_stack_damage");
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.SetStackCount((this.slow * (1 - this.GetParentPlus().GetStatusResistance())) * 100);
        this.StartIntervalThink(1);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.slow = this.GetAbilityPlus().GetTalentSpecialValueFor("slow");
        this.damage = math.max(this.damage, this.GetAbilityPlus().GetTalentSpecialValueFor("damage"));
        this.poison_stack_damage = this.GetSpecialValueFor("poison_stack_damage");
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.SetStackCount((this.slow * (1 - this.GetParentPlus().GetStatusResistance())) * 100);
    }
    OnIntervalThink(): void {
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.damage,
            damage_type: this.damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE, this.GetParentPlus(), this.damage, undefined);
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
        2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount() * 0.01;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.target == this.GetParentPlus() && ((keys.attacker as IBaseNpc_Plus).IsRoshan())) {
            this.damage = this.damage + this.poison_stack_damage;
            this.SetDuration(this.GetDuration(), true);
        }
    }
}
@registerAbility()
export class imba_dazzle_shallow_grave extends BaseAbility_Plus {
    GetAOERadius(): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_radius");
        }
        return 0;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("cast_range");
    }
    // GetManaCost(p_0: number,): number {
    //     return this.GetSpecialValueFor("mana_cost");
    // }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_SHALLOW_GRAVE;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let target = this.GetCursorTarget();
            EmitSoundOn("Hero_Dazzle.Shallow_Grave", target);
            if (this.GetCasterPlus().HasScepter()) {
                let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), target.GetAbsOrigin(), undefined, this.GetAOERadius(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, target] of GameFunc.iPair(allies)) {
                    if (target == this.GetCursorTarget()) {
                        target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dazzle_shallow_grave", {
                            duration: this.GetSpecialValueFor("duration")
                        });
                    } else {
                        target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dazzle_shallow_grave", {
                            duration: this.GetSpecialValueFor("duration"),
                            bGravely: false
                        });
                    }
                }
            } else {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dazzle_shallow_grave", {
                    duration: this.GetSpecialValueFor("duration")
                });
            }
        }
    }
    GetIntrinsicModifierName(): string {
        let caster = this.GetCasterPlus();
        if (!caster.HasAbility("imba_pugna_nether_ward_aura") && !caster.IsIllusion()) {
            return "modifier_imba_dazzle_nothl_protection";
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_friend(this, null, (unit) => { return unit.GetHealthLosePect() > 80 });
    }
}
@registerModifier()
export class modifier_imba_dazzle_shallow_grave extends BaseModifier_Plus {
    public shallowDamage: any;
    public shallowDamageInstances: any;
    public shallow_grave_particle: any;
    public gravely: any;
    public targetsHit: EntityIndex[];
    public triggered_meme_count: boolean;
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH,
        2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH)
    CC_GetMinHealth(): number {
        return 1;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            this.shallowDamage = 0;
            this.shallowDamageInstances = 0;
            this.shallow_grave_particle = ResHelper.CreateParticleEx("particles/econ/items/dazzle/dazzle_dark_light_weapon/dazzle_dark_shallow_grave.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            this.gravely = true;
            this.targetsHit = [];
            if (params.bGravely) {
                this.gravely = GToBoolean(params.bGravely);
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            ParticleManager.ClearParticle(this.shallow_grave_particle, true);
            if (parent.IsAlive() && this.shallowDamage > 0 && this.gravely != 0) {
                if (this.shallowDamageInstances > 0) {
                    let ability = this.GetAbilityPlus();
                    let modifier = parent.AddNewModifier(ability.GetCaster(), ability, "modifier_imba_dazzle_post_shallow_grave_buff", {
                        duration: ability.GetSpecialValueFor("post_grave_duration")
                    });
                    modifier.SetStackCount(this.shallowDamageInstances);
                }
                let ability = this.GetAbilityPlus();
                let caster = ability.GetCaster();
                if (caster.HasTalent("special_bonus_imba_dazzle_3")) {
                    this.targetsHit = []
                    this.targetsHit.push(parent.entindex());
                    EmitSoundOn("Hero_Dazzle.Shadow_Wave", this.GetCasterPlus());
                    this.ShadowWave(ability, caster, parent, this.shallowDamage / 2);
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let health = parent.GetHealth();
            let victim = keys.unit;
            let damage = keys.damage;
            if (!this.triggered_meme_count && GameServiceConfig.USE_MEME_SOUNDS) {
                parent.TempData().shallow_grave_meme_table = parent.TempData().shallow_grave_meme_table || [];
                let shallow_grave_meme_table = parent.TempData<number[]>().shallow_grave_meme_table;
                let current_time = GameRules.GetGameTime();
                for (let i = shallow_grave_meme_table.length - 1; i >= 0; i--) {
                    if (current_time - 30 > shallow_grave_meme_table[i]) {
                        shallow_grave_meme_table.splice(i, 1);
                    }
                }
                shallow_grave_meme_table.push(current_time);
                if (shallow_grave_meme_table.length > 3) {
                    parent.TempData().time_of_triggered_rare_shallow_grave_meme = parent.TempData().time_of_triggered_rare_shallow_grave_meme || 0;
                    parent.TempData().time_of_triggered_shallow_grave_meme = parent.TempData().time_of_triggered_shallow_grave_meme || 0;
                    if (!parent.TempData().has_triggered_shallow_grave_meme && current_time - 23 > parent.TempData().time_of_triggered_rare_shallow_grave_meme && current_time - 6 > parent.TempData().time_of_triggered_shallow_grave_meme) {
                        parent.EmitSound("Imba.DazzleShallowGraveIWillSurvive1");
                        parent.TempData().time_of_triggered_shallow_grave_meme = current_time;
                    } else {
                        if (RollPercentage(50) && current_time - 23 > parent.TempData().time_of_triggered_rare_shallow_grave_meme && current_time - 6 > parent.TempData().time_of_triggered_shallow_grave_meme) {
                            parent.EmitSound("Imba.DazzleShallowGraveIWillSurvive2");
                            parent.TempData().time_of_triggered_rare_shallow_grave_meme = current_time;
                        } else if (current_time - 23 > parent.TempData().time_of_triggered_rare_shallow_grave_meme && current_time - 6 > parent.TempData().time_of_triggered_shallow_grave_meme) {
                            parent.EmitSound("Imba.DazzleShallowGraveIWillSurvive1");
                        }
                    }
                    parent.TempData().has_triggered_shallow_grave_meme = true;
                } else {
                    parent.TempData().has_triggered_shallow_grave_meme = false;
                }
                this.triggered_meme_count = true;
            }
            if (parent == victim && math.floor(health) <= 1) {
                this.shallowDamage = this.shallowDamage + damage;
                this.shallowDamageInstances = this.shallowDamageInstances + 1;
            }
        }
    }
    ShadowWave(ability: IBaseAbility_Plus, caster: IBaseNpc_Plus, oldTarget: IBaseNpc_Plus, heal: number) {
        let bounceDistance = ability.GetSpecialValueFor("talent_wave_bounce_distance");
        oldTarget.ApplyHeal(heal, ability);
        let heroTable = FindUnitsInRadius(caster.GetTeamNumber(), oldTarget.GetAbsOrigin(), undefined, bounceDistance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
        let creepTable = FindUnitsInRadius(caster.GetTeamNumber(), oldTarget.GetAbsOrigin(), undefined, bounceDistance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
        let newTarget: IBaseNpc_Plus;
        for (const [_, hero] of GameFunc.iPair(heroTable)) {
            if (hero.GetHealth() < hero.GetMaxHealth() && !this.targetsHit.includes(hero.entindex())) {
                this.targetsHit.push(hero.entindex());
                newTarget = hero;
                break;
            }
        }
        if (!newTarget) {
            for (const [_, hero] of GameFunc.iPair(heroTable)) {
                if (!this.targetsHit.includes(hero.entindex())) {
                    this.targetsHit.push(hero.entindex());
                    newTarget = hero;
                    break;
                }
            }
        }
        if (!newTarget) {
            for (const [_, creep] of GameFunc.iPair(creepTable)) {
                if (creep.GetHealth() < creep.GetMaxHealth() && !this.targetsHit.includes(creep.entindex())) {
                    this.targetsHit.push(creep.entindex());
                    newTarget = creep;
                    break;
                }
            }
        }
        if (!newTarget) {
            for (const [_, creep] of GameFunc.iPair(creepTable)) {
                if (!this.targetsHit.includes(creep.entindex())) {
                    this.targetsHit.push(creep.entindex());
                    newTarget = creep;
                    break;
                }
            }
        }
        if (newTarget) {
            let waveParticle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dazzle/dazzle_shadow_wave.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, oldTarget);
            ParticleManager.SetParticleControlEnt(waveParticle, 0, oldTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", oldTarget.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(waveParticle, 1, newTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", newTarget.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(waveParticle);
            this.ShadowWave(ability, caster, newTarget, heal);
        }
    }
}
@registerModifier()
export class modifier_imba_dazzle_nothl_protection extends BaseModifier_Plus {
    public isActive: any;
    public shallowDamage: any;
    public shallowDamageInstances: any;
    public targetsHit: EntityIndex[];
    public triggered_meme_count: boolean;
    public auraTalentCooldowns: { [k: string]: number };
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    DestroyOnExpire(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        if (this.GetStackCount() < 1) {
            return false;
        }
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH,
        2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
    }
    return Object.values(funcs);
    } */
    GetTexture(): string {
        if (this.GetStackCount() > 0) {
            return "dazzle_shallow_grave_cooldown";
        } else {
            return "dazzle_nothl_protection";
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH)
    CC_GetMinHealth(): number {
        if (IsServer()) {
            if (this.IsNull() || (this.GetParentPlus().PassivesDisabled() && !this.isActive)) {
                return 0;
            } else if (this.GetStackCount() > 0 || this.GetParentPlus().IsIllusion()) {
                return 0;
            } else {
                return 1;
            }
        }
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.isActive = false;
            this.shallowDamage = 0;
            this.shallowDamageInstances = 0;
            this.StartIntervalThink(1);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (this.GetStackCount() < 1) {
                let parent = this.GetParentPlus();
                let health = parent.GetHealth();
                let victim = keys.unit;
                let damage = keys.damage;
                if (parent == victim && math.floor(health) <= 1 && !parent.findBuff<modifier_imba_dazzle_shallow_grave>("modifier_imba_dazzle_shallow_grave")) {
                    if (!this.isActive && !parent.PassivesDisabled()) {
                        let ability = this.GetAbilityPlus();
                        this.shallowDamage = this.shallowDamage + damage;
                        this.shallowDamageInstances = this.shallowDamageInstances + 1;
                        this.isActive = true;
                        let nothl_duration = ability.GetSpecialValueFor("nothl_protection_duration");
                        parent.AddNewModifier(this.GetCasterPlus(), undefined, "modifier_imba_dazzle_nothl_protection_particle", {
                            duration: nothl_duration
                        });
                        this.AddTimer(nothl_duration, () => {
                            if (this.IsNull()) {
                                return;
                            }
                            if (this.GetParentPlus().IsAlive() && this.shallowDamage > 0 && this.GetParentPlus().HasModifier("modifier_imba_dazzle_nothl_protection_particle")) {
                                if (this.shallowDamageInstances > 0) {
                                    let modifier = parent.AddNewModifier(parent, ability, "modifier_imba_dazzle_post_shallow_grave_buff", {
                                        duration: ability.GetSpecialValueFor("post_grave_duration")
                                    });
                                    modifier.SetStackCount(this.shallowDamageInstances);
                                }
                                if (parent.HasTalent("special_bonus_imba_dazzle_3")) {
                                    this.targetsHit = [];
                                    this.targetsHit.push(parent.entindex())
                                    EmitSoundOn("Hero_Dazzle.Shadow_Wave", parent);
                                    this.ShadowWave(ability, parent, parent, this.shallowDamage / 2);
                                }
                            }
                            this.isActive = false;
                            this.shallowDamage = 0;
                            this.shallowDamageInstances = 0;
                            parent.RemoveModifierByName("modifier_imba_dazzle_nothl_protection_particle");
                            let nothl_cooldown = ability.GetSpecialValueFor("nothl_protection_cooldown");
                            this.SetStackCount(math.floor(nothl_cooldown));
                            this.StartIntervalThink(1);
                        });
                    } else if (this.isActive && !parent.PassivesDisabled()) {
                        if (!this.triggered_meme_count && GameServiceConfig.USE_MEME_SOUNDS) {
                            parent.TempData().shallow_grave_meme_table = parent.TempData().shallow_grave_meme_table || [];
                            let shallow_grave_meme_table = parent.TempData<number[]>().shallow_grave_meme_table;
                            let current_time = GameRules.GetGameTime();
                            for (let i = shallow_grave_meme_table.length - 1; i >= 0; i--) {
                                if (current_time - 30 > shallow_grave_meme_table[i]) {
                                    shallow_grave_meme_table.splice(i, 1);

                                }
                            }
                            shallow_grave_meme_table.push(current_time);
                            if (GameFunc.GetCount(shallow_grave_meme_table) > 3) {
                                parent.TempData().time_of_triggered_rare_shallow_grave_meme = parent.TempData().time_of_triggered_rare_shallow_grave_meme || 0;
                                parent.TempData().time_of_triggered_shallow_grave_meme = parent.TempData().time_of_triggered_shallow_grave_meme || 0;
                                if (!parent.TempData().has_triggered_shallow_grave_meme && current_time - 23 > parent.TempData().time_of_triggered_rare_shallow_grave_meme && current_time - 6 > parent.TempData().time_of_triggered_shallow_grave_meme) {
                                    parent.EmitSound("Imba.DazzleShallowGraveIWillSurvive1");
                                    parent.TempData().time_of_triggered_shallow_grave_meme = current_time;
                                } else {
                                    if (RollPercentage(50) && current_time - 23 > parent.TempData().time_of_triggered_rare_shallow_grave_meme && current_time - 6 > parent.TempData().time_of_triggered_shallow_grave_meme) {
                                        parent.EmitSound("Imba.DazzleShallowGraveIWillSurvive2");
                                        parent.TempData().time_of_triggered_rare_shallow_grave_meme = current_time;
                                    } else if (current_time - 23 > parent.TempData().time_of_triggered_rare_shallow_grave_meme && current_time - 6 > parent.TempData().time_of_triggered_shallow_grave_meme) {
                                        parent.EmitSound("Imba.DazzleShallowGraveIWillSurvive1");
                                    }
                                }
                                parent.TempData().has_triggered_shallow_grave_meme = true;
                            } else {
                                parent.TempData().has_triggered_shallow_grave_meme = false;
                            }
                            this.triggered_meme_count = true;
                        }
                        this.shallowDamage = this.shallowDamage + damage;
                        this.shallowDamageInstances = this.shallowDamageInstances + 1;
                    }
                }
            }
        }
    }
    OnIntervalThink(): void {
        let stacks = this.GetStackCount();
        if (stacks > 0) {
            this.SetStackCount(stacks - 1);
        }
        if (this.GetAbilityPlus().GetCaster().HasTalent("special_bonus_imba_dazzle_6")) {
            if (this.auraTalentCooldowns) {
                for (const [id, cd] of GameFunc.Pair(this.auraTalentCooldowns)) {
                    if (cd > 0) {
                        this.auraTalentCooldowns[id] = cd - 1;
                    }
                }
            } else {
                this.auraTalentCooldowns = {}
            }
        }
    }
    // BeRemoved(): void {
    //     if (IsServer() && this.nothl_protection_particle) {
    //         ParticleManager.DestroyParticle(this.nothl_protection_particle, true);
    //     }
    // }
    ShadowWave(ability: IBaseAbility_Plus, caster: IBaseNpc_Plus, oldTarget: IBaseNpc_Plus, heal: number) {
        oldTarget.ApplyHeal(heal, ability);
        let bounceDistance = ability.GetSpecialValueFor("talent_wave_bounce_distance");
        let heroTable = FindUnitsInRadius(caster.GetTeamNumber(), oldTarget.GetAbsOrigin(), undefined, bounceDistance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
        let creepTable = FindUnitsInRadius(caster.GetTeamNumber(), oldTarget.GetAbsOrigin(), undefined, bounceDistance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
        let newTarget: IBaseNpc_Plus;
        for (const [_, hero] of GameFunc.iPair(heroTable)) {
            if (hero.GetHealth() < hero.GetMaxHealth() && !this.targetsHit.includes(hero.entindex())) {
                this.targetsHit.push(hero.entindex())
                newTarget = hero;
                break;
            }
        }
        if (!newTarget) {
            for (const [_, hero] of GameFunc.iPair(heroTable)) {
                if (!this.targetsHit.includes(hero.entindex())) {
                    this.targetsHit.push(hero.entindex())
                    newTarget = hero;
                    break;
                }
            }
        }
        if (!newTarget) {
            for (const [_, creep] of GameFunc.iPair(creepTable)) {
                if (creep.GetHealth() < creep.GetMaxHealth() && !this.targetsHit.includes(creep.entindex())) {
                    this.targetsHit.push(creep.entindex())
                    newTarget = creep;
                    break;
                }
            }
        }
        if (!newTarget) {
            for (const [_, creep] of GameFunc.iPair(creepTable)) {
                if (!this.targetsHit.includes(creep.entindex())) {
                    this.targetsHit.push(creep.entindex())
                    newTarget = creep;
                    break;
                }
            }
        }
        if (newTarget) {
            let waveParticle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dazzle/dazzle_shadow_wave.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, oldTarget);
            ParticleManager.SetParticleControlEnt(waveParticle, 0, oldTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", oldTarget.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(waveParticle, 1, newTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", newTarget.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(waveParticle);
            this.ShadowWave(ability, caster, newTarget, heal);
        }
    }
    IsAura(): boolean {
        return this.GetParentPlus().HasTalent("special_bonus_imba_dazzle_6") != null;
    }
    GetAuraRadius(): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_dazzle_6", "talent_aura_radius");
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_imba_dazzle_nothl_protection_aura_talent";
    }
    GetAuraEntityReject(hero: CDOTA_BaseNPC): boolean {
        if (hero == this.GetParentPlus()) {
            return true;
        }
        let id = hero.GetEntityIndex();
        if (this.auraTalentCooldowns) {
            if (this.auraTalentCooldowns[id]) {
                if (this.auraTalentCooldowns[id] > 0) {
                    return true;
                }
            } else {
                this.auraTalentCooldowns[id] = 0;
            }
        } else {
            this.auraTalentCooldowns = {}
        }
        return false;
    }
    TalentAuraTimeUpdater(id: number | string) {
        this.auraTalentCooldowns[id] = this.GetSpecialValueFor("nothl_protection_cooldown");
        if (this.auraTalentCooldowns[id] == 0) {
            this.auraTalentCooldowns[id] = 30;
        }
    }
}
@registerModifier()
export class modifier_imba_dazzle_nothl_protection_particle extends BaseModifier_Plus {
    public particles: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.particles = ResHelper.CreateParticleEx("particles/hero/dazzle/dazzle_shallow_grave_self.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            ParticleManager.ClearParticle(this.particles, true);
        }
    }
}
@registerModifier()
export class modifier_imba_dazzle_post_shallow_grave_buff extends BaseModifier_Plus {
    public armor: any;
    public resist: any;
    public post_shallow_grave_particle: any;
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values(DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE);
    } */
    GetTexture(): string {
        return "dazzle_shallow_grave";
    }
    GetEffectName(): string {
        return "particles/hero/dazzle/dazzle_post_grave.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        let ability = this.GetAbilityPlus();
        this.armor = ability.GetSpecialValueFor("post_grave_armor_per_hit");
        this.resist = ability.GetSpecialValueFor("post_grave_resist_per_hit");
        if (IsServer()) {
            this.post_shallow_grave_particle = ResHelper.CreateParticleEx("particles/hero/dazzle/dazzle_post_grave.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            ParticleManager.ClearParticle(this.post_shallow_grave_particle, true);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
        2: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
    }
    return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount() * this.resist;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount() * this.armor;
    }
}
@registerModifier()
export class modifier_imba_dazzle_nothl_protection_aura_talent extends BaseModifier_Plus {
    public shallowDamage: any;
    public shallowDamageInstances: any;
    public triggered: any;
    public shallow_wave_damage_pct: number;
    public targetsHit: EntityIndex[];
    public triggered_meme_count: boolean;
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
    let funcs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH,
        2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
    }
    return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH)
    CC_GetMinHealth(): number {
        return 1;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.shallowDamage = 0;
            this.shallowDamageInstances = 0;
            this.triggered = false;
            this.targetsHit = [];

        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (parent.IsAlive() && this.shallowDamage > 0) {
                this.GetAbilityPlus().GetCaster().findBuff<modifier_imba_dazzle_nothl_protection>("modifier_imba_dazzle_nothl_protection").TalentAuraTimeUpdater(parent.GetEntityIndex());
                let ability = this.GetAbilityPlus();
                let caster = ability.GetCaster();
                if (this.shallowDamageInstances > 0) {
                    let modifier = parent.AddNewModifier(ability.GetCaster(), ability, "modifier_imba_dazzle_post_shallow_grave_buff", {
                        duration: ability.GetSpecialValueFor("post_grave_duration")
                    });
                    modifier.SetStackCount(this.shallowDamageInstances);
                }
                if (caster.HasTalent("special_bonus_imba_dazzle_3")) {
                    this.shallow_wave_damage_pct = caster.GetTalentValue("special_bonus_imba_dazzle_3", "shallow_wave_damage_pct");
                    this.targetsHit.push(parent.entindex());
                    EmitSoundOn("Hero_Dazzle.Shadow_Wave", this.GetCasterPlus());
                    this.ShadowWave(ability, caster, parent, this.shallowDamage / this.shallow_wave_damage_pct);
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let health = parent.GetHealth();
            let victim = keys.unit;
            let damage = keys.damage;
            if (parent == victim && math.floor(health) <= 1) {
                this.shallowDamage = this.shallowDamage + damage;
                this.shallowDamageInstances = this.shallowDamageInstances + 1;
                if (!this.triggered_meme_count && GameServiceConfig.USE_MEME_SOUNDS) {
                    parent.TempData().shallow_grave_meme_table = parent.TempData().shallow_grave_meme_table || {}
                    let shallow_grave_meme_table = parent.TempData<number[]>().shallow_grave_meme_table;
                    let current_time = GameRules.GetGameTime();
                    for (let i = GameFunc.GetCount(shallow_grave_meme_table) - 1; i >= 0; i--) {
                        if (current_time - 30 > shallow_grave_meme_table[i]) {
                            shallow_grave_meme_table.splice(i, 1);

                        }
                    }
                    shallow_grave_meme_table.push(current_time);
                    if (GameFunc.GetCount(shallow_grave_meme_table) > 3) {
                        parent.TempData().time_of_triggered_rare_shallow_grave_meme = parent.TempData().time_of_triggered_rare_shallow_grave_meme || 0;
                        parent.TempData().time_of_triggered_shallow_grave_meme = parent.TempData().time_of_triggered_shallow_grave_meme || 0;
                        if (!parent.TempData().has_triggered_shallow_grave_meme && current_time - 23 > parent.TempData().time_of_triggered_rare_shallow_grave_meme && current_time - 6 > parent.TempData().time_of_triggered_shallow_grave_meme) {
                            parent.EmitSound("Imba.DazzleShallowGraveIWillSurvive1");
                            parent.TempData().time_of_triggered_shallow_grave_meme = current_time;
                        } else {
                            if (RollPercentage(50) && current_time - 23 > parent.TempData().time_of_triggered_rare_shallow_grave_meme && current_time - 6 > parent.TempData().time_of_triggered_shallow_grave_meme) {
                                parent.EmitSound("Imba.DazzleShallowGraveIWillSurvive2");
                                parent.TempData().time_of_triggered_rare_shallow_grave_meme = current_time;
                            } else if (current_time - 23 > parent.TempData().time_of_triggered_rare_shallow_grave_meme && current_time - 6 > parent.TempData().time_of_triggered_shallow_grave_meme) {
                                parent.EmitSound("Imba.DazzleShallowGraveIWillSurvive1");
                            }
                        }
                        parent.TempData().has_triggered_shallow_grave_meme = true;
                    } else {
                        parent.TempData().has_triggered_shallow_grave_meme = false;
                    }
                    this.triggered_meme_count = true;
                }
                if (!this.triggered) {
                    this.triggered = true;
                    let particle = ResHelper.CreateParticleEx("particles/hero/dazzle/dazzle_shallow_grave_talent.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
                    this.AddTimer(this.GetCasterPlus().GetTalentValue("special_bonus_imba_dazzle_6", "talent_aura_nothl_duration"), () => {
                        if (!this.IsNull()) {
                            ParticleManager.ClearParticle(particle, false);
                            this.Destroy();
                        }
                    });
                }
            }
        }
    }
    ShadowWave(ability: IBaseAbility_Plus, caster: IBaseNpc_Plus, oldTarget: IBaseNpc_Plus, heal: number) {
        let bounceDistance = caster.GetTalentValue("special_bonus_imba_dazzle_3", "talent_wave_bounce_distance");
        oldTarget.ApplyHeal(heal, ability);
        let heroTable = FindUnitsInRadius(caster.GetTeamNumber(), oldTarget.GetAbsOrigin(), undefined, bounceDistance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
        let creepTable = FindUnitsInRadius(caster.GetTeamNumber(), oldTarget.GetAbsOrigin(), undefined, bounceDistance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
        let newTarget: IBaseNpc_Plus;
        for (const [_, hero] of GameFunc.iPair(heroTable)) {
            if (hero.GetHealth() < hero.GetMaxHealth() && !this.targetsHit.includes(hero.entindex())) {
                this.targetsHit.push(hero.entindex());
                newTarget = hero;
                break
            }
        }
        if (!newTarget) {
            for (const [_, hero] of GameFunc.iPair(heroTable)) {
                if (!this.targetsHit.includes(hero.entindex())) {
                    this.targetsHit.push(hero.entindex());
                    newTarget = hero;
                    break;
                }
            }
        }
        if (!newTarget) {
            for (const [_, creep] of GameFunc.iPair(creepTable)) {
                if (creep.GetHealth() < creep.GetMaxHealth() && !this.targetsHit.includes(creep.entindex())) {
                    this.targetsHit.push(creep.entindex());
                    newTarget = creep;
                    break;
                }
            }
        }
        if (!newTarget) {
            for (const [_, creep] of GameFunc.iPair(creepTable)) {
                if (!this.targetsHit.includes(creep.entindex())) {
                    this.targetsHit.push(creep.entindex());
                    newTarget = creep;
                    break;
                }
            }
        }
        if (newTarget) {
            let waveParticle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dazzle/dazzle_shadow_wave.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, oldTarget);
            ParticleManager.SetParticleControlEnt(waveParticle, 0, oldTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", oldTarget.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(waveParticle, 1, newTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", newTarget.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(waveParticle);
            this.ShadowWave(ability, caster, newTarget, heal);
        }
    }
}
@registerAbility()
export class imba_dazzle_shadow_wave extends BaseAbility_Plus {
    public talentWaveDelayed: { [k: string]: any };
    public targetsHit: EntityIndex[];
    GetAbilityTextureName(): string {
        return "dazzle_shadow_wave";
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("cast_range");
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let target = this.GetCursorTarget();
            let caster = this.GetCasterPlus();
            let isAlly = false;
            if (target.GetTeamNumber() == caster.GetTeamNumber()) {
                isAlly = true;
            }
            if (caster.HasTalent("special_bonus_imba_dazzle_1")) {
                if (!this.talentWaveDelayed) {
                    this.talentWaveDelayed = {}
                    for (let i = 0; i < caster.GetTalentValue("special_bonus_imba_dazzle_1", "talent_delayed_wave_max_waves"); i++) {
                        this.talentWaveDelayed[i] = "empty";
                    }
                }
                let oldest = -1;
                for (const [loc, dat] of GameFunc.Pair(this.talentWaveDelayed)) {
                    if (dat == "empty") {
                        oldest = GToNumber(loc);
                        return;
                    }
                }
                if (oldest == -1) {
                    oldest = 1;
                    for (const [loc, dat] of GameFunc.Pair(this.talentWaveDelayed)) {
                        if (dat.timeCreated <= this.talentWaveDelayed[oldest].timeCreated) {
                            oldest = GToNumber(loc);
                        }
                    }
                }
                if (this.talentWaveDelayed && this.talentWaveDelayed[oldest] && this.talentWaveDelayed[oldest].handler && !this.talentWaveDelayed[oldest].handler.IsNull()) {
                    this.talentWaveDelayed[oldest].handler.DestroyCustom();
                    let units = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_CLOSEST, false);
                    for (const [_, unit] of GameFunc.iPair(units)) {
                        let cooldownMods = unit.FindAllModifiersByName("modifier_imba_dazzle_shadow_wave_delayed_bounce_cooldown");
                        for (const [_, mod] of GameFunc.iPair(cooldownMods)) {
                            if (mod.GetStackCount() == oldest) {
                                mod.Destroy();
                            }
                        }
                    }
                }
                this.WaveHit(target, isAlly);
                if (target != caster) {
                    this.WaveHit(caster, true);
                }
                let mod = target.AddNewModifier(caster, this, "modifier_imba_dazzle_shadow_wave_delayed_bounce", {
                    duration: caster.GetTalentValue("special_bonus_imba_dazzle_1", "talent_delayed_wave_delay")
                });
                mod.SetStackCount(oldest);
                this.talentWaveDelayed[oldest] = {
                    timeCreated: GameRules.GetGameTime(),
                    poisonTouched: undefined,
                    isAlly: isAlly,
                    handler: mod
                }
                EmitSoundOn("Hero_Dazzle.Shadow_Wave", this.GetCasterPlus());
                let waveParticle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dazzle/dazzle_shadow_wave.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
                ParticleManager.SetParticleControlEnt(waveParticle, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(waveParticle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(waveParticle);
            } else {
                this.targetsHit = []
                this.targetsHit.push(caster.entindex());
                this.WaveHit(caster, true);
                this.WaveBounce(target, isAlly);
                if (target != caster) {
                    this.targetsHit.push(target.entindex());
                }
                EmitSoundOn("Hero_Dazzle.Shadow_Wave", this.GetCasterPlus());
                let waveParticle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dazzle/dazzle_shadow_wave.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
                ParticleManager.SetParticleControlEnt(waveParticle, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(waveParticle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(waveParticle);
            }
        }
    }
    WaveBounce(target: IBaseNpc_Plus, isAlly: boolean, poisonTouched: number = 0) {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let bounceDistance = this.GetSpecialValueFor("bounce_distance");
            let newTarget: IBaseNpc_Plus;
            let targetTeam = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
            if (isAlly) {
                targetTeam = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
            } else {
                let poisonMods = target.FindAllModifiersByName("modifier_imba_dazzle_poison_touch_debuff");
                if (poisonMods && poisonMods[0]) {
                    for (const [_, modifier] of GameFunc.iPair(poisonMods)) {
                        let stacks = modifier.GetStackCount();
                        if (!poisonTouched || poisonTouched < stacks) {
                            poisonTouched = stacks;
                        }
                    }
                }
            }
            let heroTable = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, bounceDistance, targetTeam, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
            let creepTable = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, bounceDistance, targetTeam, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
            for (const [_, hero] of GameFunc.iPair(heroTable)) {
                if (hero.GetHealth() < hero.GetMaxHealth() && !this.targetsHit.includes(hero.entindex())) {
                    this.targetsHit.push(hero.entindex());
                    newTarget = hero;
                    return;
                }
            }
            if (!newTarget) {
                for (const [_, hero] of GameFunc.iPair(heroTable)) {
                    if (!this.targetsHit.includes(hero.entindex())) {
                        this.targetsHit.push(hero.entindex());
                        newTarget = hero;
                        return;
                    }
                }
            }
            if (!newTarget) {
                for (const [_, creep] of GameFunc.iPair(creepTable)) {
                    if (creep.GetHealth() < creep.GetMaxHealth() && !this.targetsHit.includes(creep.entindex())) {
                        this.targetsHit.push(creep.entindex());
                        newTarget = creep;
                        return;
                    }
                }
            }
            if (!newTarget) {
                for (const [_, creep] of GameFunc.iPair(creepTable)) {
                    if (!this.targetsHit.includes(creep.entindex())) {
                        this.targetsHit.push(creep.entindex());
                        newTarget = creep;
                        return;
                    }
                }
            }
            if (newTarget) {
                let waveParticle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dazzle/dazzle_shadow_wave.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, target);
                ParticleManager.SetParticleControlEnt(waveParticle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(waveParticle, 1, newTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", newTarget.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(waveParticle);
                this.WaveBounce(newTarget, isAlly, poisonTouched);
                this.WaveHit(newTarget, isAlly, poisonTouched);
            }
        }
    }
    WaveHit(unit: IBaseNpc_Plus, isAlly: boolean, poisonTouched: number = 0) {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let damage = this.GetSpecialValueFor("damage");
            let damageRadius = this.GetSpecialValueFor("damage_radius");
            let totalHeal = damage;
            let targetTeam = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
            if (isAlly) {
                unit.ApplyHeal(totalHeal, this);
                if (caster.HasTalent("special_bonus_imba_dazzle_8")) {
                    unit.Purge(false, true, false, false, false);
                }
                targetTeam = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
            } else {
                ApplyDamage({
                    victim: unit,
                    attacker: caster,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                });
                let poisonTouchAbility = caster.findAbliityPlus<imba_dazzle_poison_touch>("imba_dazzle_poison_touch");
                let oldMod = unit.findBuff<modifier_imba_dazzle_poison_touch_debuff>("modifier_imba_dazzle_poison_touch_debuff");
                if (poisonTouched && poisonTouchAbility) {
                    if (!oldMod || oldMod.GetStackCount() < poisonTouched) {
                        let modifier = unit.AddNewModifier(caster, poisonTouchAbility, "modifier_imba_dazzle_poison_touch_debuff", {
                            duration: poisonTouchAbility.GetSpecialValueFor("poison_duration") * (1 - unit.GetStatusResistance())
                        });
                        EmitSoundOn("Hero_Dazzle.Poison_Tick", unit);
                        modifier.SetStackCount(poisonTouched);
                    }
                }
            }
            if (caster.HasTalent("special_bonus_imba_dazzle_2")) {
                targetTeam = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH;
            }
            let aoeTargets = FindUnitsInRadius(caster.GetTeamNumber(), unit.GetAbsOrigin(), undefined, damageRadius, targetTeam, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
            for (const [_, target] of GameFunc.iPair(aoeTargets)) {
                if (target != unit) {
                    let damage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dazzle/dazzle_shadow_wave_impact_damage.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
                    ParticleManager.SetParticleControlEnt(damage_particle, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(damage_particle);
                    if (target.GetTeamNumber() != caster.GetTeamNumber()) {
                        ApplyDamage({
                            victim: target,
                            attacker: caster,
                            damage: damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                        });
                    } else {
                        target.ApplyHeal(totalHeal, this);
                    }
                }
            }
        }
    }
    GetDelayedWaveData(location: number) {
        return this.talentWaveDelayed[location];
    }
    SetDelayedWaveData(location: number, data: any) {
        this.talentWaveDelayed[location] = data;
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_friend(this, null, (unit) => { return unit.GetHealthLosePect() > 10 });
    }
}
@registerModifier()
export class modifier_imba_dazzle_shadow_wave_delayed_bounce extends BaseModifier_Plus {
    public data: any;
    public destroyNoJump: any;
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus<imba_dazzle_shadow_wave>();
            let caster = ability.GetCaster();
            let cooldownMod = parent.AddNewModifier(caster, ability, "modifier_imba_dazzle_shadow_wave_delayed_bounce_cooldown", {
                duration: caster.GetTalentValue("special_bonus_imba_dazzle_1", "talent_delayed_wave_rehit_cd") + caster.GetTalentValue("special_bonus_imba_dazzle_1", "talent_delayed_wave_delay")
            });
            this.AddTimer(0.01, () => {
                if (!(this.IsNull() || ability.IsNull())) {
                    this.data = ability.GetDelayedWaveData(this.GetStackCount());
                    cooldownMod.SetStackCount(this.GetStackCount());
                }
            });
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (!this.destroyNoJump) {
                let ability = this.GetAbilityPlus<imba_dazzle_shadow_wave>();
                let caster = ability.GetCaster();
                let parent = this.GetParentPlus();
                let bounceDistance = ability.GetSpecialValueFor("bounce_distance");
                let newTarget: IBaseNpc_Plus;
                let targetTeam = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
                if (this.data.isAlly) {
                    targetTeam = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
                } else {
                    let poisonMods = parent.FindAllModifiersByName("modifier_imba_dazzle_poison_touch_debuff");
                    if (poisonMods && poisonMods[0]) {
                        for (const [_, modifier] of GameFunc.iPair(poisonMods)) {
                            let stacks = modifier.GetStackCount();
                            if (!this.data.poisonTouched || this.data.poisonTouched < stacks) {
                                this.data.poisonTouched = stacks;
                            }
                        }
                    }
                }
                let heroTable = FindUnitsInRadius(caster.GetTeamNumber(), parent.GetAbsOrigin(), undefined, bounceDistance, targetTeam, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
                let creepTable = FindUnitsInRadius(caster.GetTeamNumber(), parent.GetAbsOrigin(), undefined, bounceDistance, targetTeam, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
                let stacks = this.GetStackCount();
                for (const [_, hero] of GameFunc.iPair(heroTable)) {
                    if (hero != parent && hero.GetHealth() < hero.GetMaxHealth()) {
                        let cooldownMods = hero.FindAllModifiersByName("modifier_imba_dazzle_shadow_wave_delayed_bounce_cooldown");
                        let hasCD = false;
                        for (const [_, mod] of GameFunc.iPair(cooldownMods)) {
                            if (mod.GetStackCount() == stacks) {
                                hasCD = true;
                                return;
                            }
                        }
                        if (!hasCD) {
                            newTarget = hero;
                            return;
                        }
                    }
                }
                if (!newTarget) {
                    for (const [_, hero] of GameFunc.iPair(heroTable)) {
                        if (hero != parent) {
                            let cooldownMods = hero.FindAllModifiersByName("modifier_imba_dazzle_shadow_wave_delayed_bounce_cooldown");
                            let hasCD = false;
                            for (const [_, mod] of GameFunc.iPair(cooldownMods)) {
                                if (mod.GetStackCount() == stacks) {
                                    hasCD = true;
                                    return;
                                }
                            }
                            if (!hasCD) {
                                newTarget = hero;
                                return;
                            }
                        }
                    }
                }
                if (!newTarget) {
                    for (const [_, creep] of GameFunc.iPair(creepTable)) {
                        if (creep != parent && creep.GetHealth() < creep.GetMaxHealth()) {
                            let cooldownMods = creep.FindAllModifiersByName("modifier_imba_dazzle_shadow_wave_delayed_bounce_cooldown");
                            let hasCD = false;
                            for (const [_, mod] of GameFunc.iPair(cooldownMods)) {
                                if (mod.GetStackCount() == stacks) {
                                    hasCD = true;
                                    return;
                                }
                            }
                            if (!hasCD) {
                                newTarget = creep;
                                return;
                            }
                        }
                    }
                }
                if (!newTarget) {
                    for (const [_, creep] of GameFunc.iPair(creepTable)) {
                        if (creep != parent) {
                            let cooldownMods = creep.FindAllModifiersByName("modifier_imba_dazzle_shadow_wave_delayed_bounce_cooldown");
                            let hasCD = false;
                            for (const [_, mod] of GameFunc.iPair(cooldownMods)) {
                                if (mod.GetStackCount() == stacks) {
                                    hasCD = true;
                                    return;
                                }
                            }
                            if (!hasCD) {
                                newTarget = creep;
                                return;
                            }
                        }
                    }
                }
                if (newTarget) {
                    let mod = newTarget.AddNewModifier(caster, ability, "modifier_imba_dazzle_shadow_wave_delayed_bounce", {
                        duration: caster.GetTalentValue("special_bonus_imba_dazzle_1", "talent_delayed_wave_delay")
                    });
                    mod.SetStackCount(this.GetStackCount());
                    this.data.handler = mod;
                    ability.SetDelayedWaveData(this.GetStackCount(), this.data);
                    let waveParticle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dazzle/dazzle_shadow_wave.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, parent);
                    ParticleManager.SetParticleControlEnt(waveParticle, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(waveParticle, 1, newTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", newTarget.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(waveParticle);
                    EmitSoundOn("Hero_Dazzle.Shadow_Wave", parent);
                    ability.WaveHit(newTarget, this.data.isAlly, this.data.poisonTouched);
                }
            }
        }
    }
    DestroyCustom() {
        this.destroyNoJump = true;
        this.Destroy();
    }
}
@registerModifier()
export class modifier_imba_dazzle_shadow_wave_delayed_bounce_cooldown extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
}
@registerAbility()
export class imba_dazzle_bad_juju extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_dazzle_bad_juju";
    }
}
@registerModifier()
export class modifier_imba_dazzle_bad_juju extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST,
        2: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        return this.GetSpecialValueFor("cooldown_reduction");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(params: ModifierAbilityEvent): void {
        if (IsServer()) {
            let ability = params.ability;
            let unit = params.unit;
            if (unit == this.GetCasterPlus() && !ability.IsItem() && params.ability.GetAbilityName() != "ability_capture" && params.ability.GetCooldown(params.ability.GetLevel()) > 0) {
                let behavior = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
                if (this.GetCasterPlus().HasTalent("special_bonus_imba_dazzle_7")) {
                    behavior = behavior + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING;
                }
                let units = FindUnitsInRadius(unit.GetTeamNumber(), unit.GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, behavior, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, unit] of GameFunc.iPair(units)) {
                    let modifier_name = "modifier_imba_dazzle_bad_juju_buff";
                    let duration = this.GetSpecialValueFor("duration");
                    if (unit.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
                        modifier_name = "modifier_imba_dazzle_bad_juju_debuff";
                        duration = this.GetSpecialValueFor("duration") * (1 - unit.GetStatusResistance());
                    }
                    if (unit.HasModifier(modifier_name)) {
                        let modifier = unit.FindModifierByName(modifier_name);
                        modifier.SetStackCount(modifier.GetStackCount() + 1);
                        modifier.SetDuration(duration, true);
                    } else {
                        unit.AddNewModifier(unit, this.GetAbilityPlus(), modifier_name, {
                            duration: duration
                        }).SetStackCount(1);
                    }
                }
                if (this.GetCasterPlus().HasScepter()) {
                    let enemies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("scepter_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
                    let target_number = 0;
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        this.GetParentPlus().PerformAttack(enemy, false, true, true, false, true, false, false);
                        target_number = target_number + 1;
                        if (target_number >= this.GetSpecialValueFor("scepter_count")) {
                            return;
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_dazzle_bad_juju_buff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_dazzle/dazzle_armor_friend_shield.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        let armor_reduction = this.GetSpecialValueFor("armor_reduction");
        return armor_reduction * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_dazzle_bad_juju_debuff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_dazzle/dazzle_armor_enemy.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        let armor_reduction = this.GetSpecialValueFor("armor_reduction");
        return armor_reduction * this.GetStackCount() * (-1);
    }
}
@registerModifier()
export class modifier_special_bonus_imba_dazzle_poison_touch_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_dazzle_poison_touch_slow extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_dazzle_1 extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    RemoveOnDeath() {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_dazzle_2 extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    RemoveOnDeath() {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_dazzle_3 extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    RemoveOnDeath() {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_dazzle_4 extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    RemoveOnDeath() {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_dazzle_5 extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    RemoveOnDeath() {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_dazzle_6 extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    RemoveOnDeath() {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_dazzle_7 extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    RemoveOnDeath() {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_dazzle_8 extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    RemoveOnDeath() {
        return false;
    }
}
