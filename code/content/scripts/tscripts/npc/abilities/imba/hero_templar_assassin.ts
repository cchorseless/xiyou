
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { EventHelper } from "../../../helper/EventHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_templar_assassin_refraction extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_templar_assassin_refraction_handler";
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_templar_assassin_refraction_handler", this.GetCasterPlus()) <= 0) {
            return "templar_assassin_refraction";
        } else if (this.GetCasterPlus().findBuffStack("modifier_imba_templar_assassin_refraction_handler", this.GetCasterPlus()) == 1) {
            return "templar_assassin_refraction_damage";
        } else if (this.GetCasterPlus().findBuffStack("modifier_imba_templar_assassin_refraction_handler", this.GetCasterPlus()) == 2) {
            return "templar_assassin/refraction_defense";
        } else {
            return "templar_assassin_refraction";
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("disperse_radius") - this.GetCasterPlus().GetCastRangeBonus();
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_TemplarAssassin.Refraction");
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_templar_assassin_refraction_damage", {
            duration: this.GetSpecialValueFor("duration")
        });
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_templar_assassin_refraction_absorb", {
            duration: this.GetSpecialValueFor("duration")
        });
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_templar_assassin_refraction_reality", {
            duration: this.GetSpecialValueFor("reality_duration")
        });
        for (const [_, ally] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("disperse_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            if (ally != this.GetCasterPlus()) {
                ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_templar_assassin_refraction_absorb", {
                    duration: this.GetSpecialValueFor("disperse_duration")
                });
            }
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_refraction_handler extends BaseModifier_Plus {
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
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus() || keys.order_type != dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO || keys.ability != this.GetAbilityPlus()) {
            return;
        }
        if (!this.GetAbilityPlus().GetAutoCastState()) {
            if (this.GetStackCount() >= 2) {
                this.SetStackCount(0);
            } else {
                this.IncrementStackCount();
            }
            this.GetAbilityPlus().ToggleAutoCast();
        }
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_refraction_damage extends BaseModifier_Plus {
    public bonus_damage: number;
    public damage_particle: ParticleID;
    public instances: any;
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "templar_assassin_refraction_damage";
    }
    Init(p_0: any,): void {
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
        if (!IsServer()) {
            return;
        }
        if (this.damage_particle) {
            ParticleManager.DestroyParticle(this.damage_particle, false);
            ParticleManager.ReleaseParticleIndex(this.damage_particle);
        }
        this.damage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_templar_assassin/templar_assassin_refraction_dmg.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.damage_particle, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.damage_particle, 3, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(this.damage_particle, false, false, -1, true, false);
        this.instances = this.GetAbilityPlus().GetTalentSpecialValueFor("instances");
        if (this.GetCasterPlus().findBuffStack("modifier_imba_templar_assassin_refraction_handler", this.GetCasterPlus()) <= 0) {
            this.SetStackCount(math.max(this.instances, this.GetStackCount()));
        } else if (this.GetCasterPlus().findBuffStack("modifier_imba_templar_assassin_refraction_handler", this.GetCasterPlus()) == 1) {
            this.SetStackCount(math.max(this.instances + math.ceil(this.instances / 2), this.GetStackCount()));
        } else {
            this.SetStackCount(math.max(this.instances - math.ceil(this.instances / 2), this.GetStackCount()));
        }
    }

    OnStackCountChanged(iStackCount: number): void {
        if (this.GetStackCount() <= 0) {
            this.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            keys.target.EmitSound("Hero_TemplarAssassin.Refraction.Damage");
            this.DecrementStackCount();
        }
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_refraction_absorb extends BaseModifier_Plus {
    public refraction_particle: any;
    public instances: any;
    public damage_threshold: number;
    public disperse_instances: any;
    IsPurgable(): boolean {
        return false;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    GetTexture(): string {
        return "templar_assassin_refraction";
    }
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.refraction_particle) {
            ParticleManager.DestroyParticle(this.refraction_particle, false);
            ParticleManager.ReleaseParticleIndex(this.refraction_particle);
        }
        this.refraction_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_templar_assassin/templar_assassin_refraction.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.refraction_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(this.refraction_particle, false, false, -1, true, false);
        this.instances = this.GetAbilityPlus().GetTalentSpecialValueFor("instances");
        this.damage_threshold = this.GetSpecialValueFor("damage_threshold");
        this.disperse_instances = this.GetSpecialValueFor("disperse_instances");
        if (this.GetParentPlus() != this.GetCasterPlus()) {
            this.SetStackCount(this.disperse_instances);
        } else if (this.GetCasterPlus().findBuffStack("modifier_imba_templar_assassin_refraction_handler", this.GetCasterPlus()) <= 0) {
            this.SetStackCount(math.max(this.instances, this.GetStackCount()));
        } else if (this.GetCasterPlus().findBuffStack("modifier_imba_templar_assassin_refraction_handler", this.GetCasterPlus()) == 1) {
            this.SetStackCount(math.max(this.instances - math.ceil(this.instances / 2), this.GetStackCount()));
        } else {
            this.SetStackCount(math.max(this.instances + math.ceil(this.instances / 2), this.GetStackCount()));
        }
    }

    OnStackCountChanged(iStackCount: number): void {
        if (this.GetStackCount() <= 0) {
            this.Destroy();
        }
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
        if (keys.attacker && ((keys.damage && keys.damage >= this.damage_threshold) || keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL || keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_PURE) && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) {
            return 1;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL)
    CC_GetAbsoluteNoDamageMagical(keys: ModifierAttackEvent): 0 | 1 {
        if (keys.attacker && ((keys.damage && keys.damage >= this.damage_threshold) || keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL || keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_PURE) && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) {
            return 1;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE)
    CC_GetAbsoluteNoDamagePure(keys: ModifierAttackEvent): 0 | 1 {
        if (keys.attacker && ((keys.damage && keys.damage >= this.damage_threshold) || keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL || keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_PURE) && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) {
            this.GetParentPlus().EmitSound("Hero_TemplarAssassin.Refraction.Absorb");
            let warp_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_templar_assassin/templar_assassin_refract_plasma_contact_warp.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.ReleaseParticleIndex(warp_particle);
            let hit_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_templar_assassin/templar_assassin_refract_hit.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(hit_particle, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(hit_particle);
            this.DecrementStackCount();
            return 1;
        }
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_refraction_reality extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().AddNoDraw();
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveNoDraw();
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        };
    }
}
@registerAbility()
export class imba_templar_assassin_meld extends BaseAbility_Plus {
    meld_record: number;
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_TemplarAssassin.Meld");
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_templar_assassin_meld", {});
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_templar_assassin_meld_dispels")) {
            this.GetCasterPlus().Purge(false, true, false, false, false);
        }
    }
    ApplyMeld(target: IBaseNpc_Plus, attacker: IBaseNpc_Plus) {
        target.AddNewModifier(attacker, this, "modifier_imba_templar_assassin_meld_armor", {
            duration: this.GetDuration() * (1 - target.GetStatusResistance())
        });
        ApplyDamage({
            victim: target,
            damage: this.GetSpecialValueFor("bonus_damage"),
            damage_type: this.GetAbilityDamageType(),
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: attacker,
            ability: this
        });
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_CRITICAL, target, this.GetSpecialValueFor("bonus_damage"), undefined);
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_templar_assassin_meld_bash")) {
            target.AddNewModifier(attacker, this, "modifier_generic_stunned", {
                duration: this.GetCasterPlus().GetTalentValue("special_bonus_imba_templar_assassin_meld_bash") * (1 - target.GetStatusResistance())
            });
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_templar_assassin_meld_armor_reduction") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_templar_assassin_meld_armor_reduction")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_templar_assassin_meld_armor_reduction"), "modifier_special_bonus_imba_templar_assassin_meld_armor_reduction", {});
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_meld extends BaseModifier_Plus {
    public armor_reduction_duration: number;
    public bonus_damage: number;
    public damage_type: number;
    public inner_eye_seconds_to_flying_sight: any;
    public inner_eye_seconds_to_expand: any;
    public inner_eye_vision_bonus: number;
    public inner_eye_after_duration: number;
    public cast_position: any;
    public bDisableAuto: any;
    public flying_vision_time: number;
    public bInnerEye: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_templar_assassin/templar_assassin_meld.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.armor_reduction_duration = this.GetAbilityPlus().GetDuration();
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.inner_eye_seconds_to_flying_sight = this.GetSpecialValueFor("inner_eye_seconds_to_flying_sight");
        this.inner_eye_seconds_to_expand = this.GetSpecialValueFor("inner_eye_seconds_to_expand");
        this.inner_eye_vision_bonus = this.GetSpecialValueFor("inner_eye_vision_bonus");
        this.inner_eye_after_duration = this.GetSpecialValueFor("inner_eye_after_duration");
        if (!IsServer()) {
            return;
        }
        this.cast_position = this.GetParentPlus().GetAbsOrigin();
        this.bDisableAuto = 1;
        this.flying_vision_time = math.max(this.inner_eye_seconds_to_flying_sight, FrameTime());
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (this.GetParentPlus().GetAbsOrigin().x != this.cast_position.x || this.GetParentPlus().GetAbsOrigin().y != this.cast_position.y) {
            this.StartIntervalThink(-1);
            this.Destroy();
        }
        if (!this.bInnerEye && this.GetElapsedTime() >= this.flying_vision_time) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_templar_assassin_meld_linger", {
                inner_eye_seconds_to_flying_sight: this.inner_eye_seconds_to_flying_sight,
                inner_eye_seconds_to_expand: this.inner_eye_seconds_to_expand,
                inner_eye_vision_bonus: this.inner_eye_vision_bonus,
                inner_eye_after_duration: this.inner_eye_after_duration
            });
            this.bInnerEye = true;
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        for (const [_, modifier] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName("modifier_imba_templar_assassin_meld_linger"))) {
            if (modifier.GetDuration() == -1) {
                modifier.SetDuration(this.inner_eye_after_duration, true);
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_AUTOATTACK,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL,
            3: Enum_MODIFIER_EVENT.ON_ORDER,
            4: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST,
            5: Enum_MODIFIER_EVENT.ON_ATTACK,
            6: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            7: Enum_MODIFIER_EVENT.ON_ATTACK_FAIL,
            8: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME,
            9: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_AUTOATTACK)
    CC_GetDisableAutoAttack(): 0 | 1 {
        return this.bDisableAuto;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (keys.unit == this.GetParentPlus() && keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE) {
            this.bDisableAuto = 0;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus() && keys.ability != this.GetAbilityPlus() && keys.ability.GetAbilityName() != "imba_templar_assassin_trap_teleport") {
            this.Destroy();
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            this.GetAbilityPlus<imba_templar_assassin_meld>().meld_record = keys.record;
            this.SetStackCount(-1);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            if (!keys.target.IsBuilding() && this.GetAbilityPlus() && this.GetAbilityPlus<imba_templar_assassin_meld>().meld_record) {
                keys.target.EmitSound("Hero_TemplarAssassin.Meld.Attack");
                this.GetAbilityPlus<imba_templar_assassin_meld>().ApplyMeld(keys.target, this.GetParentPlus());
                this.Destroy();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FAIL)
    CC_OnAttackFail(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            this.Destroy();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    CC_GetModifierProjectileName(): string {
        if (this.GetStackCount() != -1 && (this.GetParentPlus().GetAttackTarget() && !this.GetParentPlus().GetAttackTarget().IsBuilding())) {
            return "particles/units/heroes/hero_templar_assassin/templar_assassin_meld_attack.vpcf";
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "meld";
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_meld_animation extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_IDLE;
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_meld_armor extends BaseModifier_Plus {
    public bonus_armor: number;
    public overhead_particle: any;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_templar_assassin/templar_assassin_meld_armor.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.bonus_armor = this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_armor");
        } else {
            this.bonus_armor = 0;
        }
        if (!IsServer()) {
            return;
        }
        this.overhead_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_templar_assassin/templar_meld_overhead.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        this.AddParticle(this.overhead_particle, false, false, -1, false, true);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_armor;
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_meld_linger extends BaseModifier_Plus {
    public inner_eye_seconds_to_flying_sight: any;
    public inner_eye_seconds_to_expand: any;
    public inner_eye_vision_bonus: number;
    public inner_eye_after_duration: number;
    public expansion_time: number;
    public interval: number;
    public bonus_vision: number;
    public bExpanded: any;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            this.inner_eye_seconds_to_flying_sight = this.GetSpecialValueFor("inner_eye_seconds_to_flying_sight");
            this.inner_eye_seconds_to_expand = this.GetSpecialValueFor("inner_eye_seconds_to_expand");
            this.inner_eye_vision_bonus = this.GetSpecialValueFor("inner_eye_vision_bonus");
            this.inner_eye_after_duration = this.GetSpecialValueFor("inner_eye_after_duration");
        } else if (params) {
            this.inner_eye_seconds_to_flying_sight = params.inner_eye_seconds_to_flying_sight;
            this.inner_eye_seconds_to_expand = params.inner_eye_seconds_to_expand;
            this.inner_eye_vision_bonus = params.inner_eye_vision_bonus;
            this.inner_eye_after_duration = params.inner_eye_after_duration;
        } else {
            this.inner_eye_seconds_to_flying_sight = 5;
            this.inner_eye_seconds_to_expand = 10;
            this.inner_eye_vision_bonus = 1000;
            this.inner_eye_after_duration = 5;
        }
        this.expansion_time = math.max(this.inner_eye_seconds_to_expand - this.inner_eye_seconds_to_flying_sight, FrameTime());
        this.interval = 0.1;
        this.bonus_vision = 0;
        this.StartIntervalThink(this.interval);
    }
    OnIntervalThink(): void {
        if (!this.bExpanded && this.GetElapsedTime() >= this.expansion_time) {
            this.bonus_vision = this.inner_eye_vision_bonus;
            this.bExpanded = true;
        }
        AddFOWViewer(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus().GetCurrentVisionRange() + this.bonus_vision, this.interval, false);
    }
}
@registerAbility()
export class imba_templar_assassin_psi_blades extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_templar_assassin_psi_blades";
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_psi_blades extends BaseModifier_Plus {
    public meld_ability: any;
    public meld_extension: any;
    public accelerate_record: any;
    public psi_particle: any;
    IsHidden(): boolean {
        return this.GetStackCount() <= 0;
    }
    BeCreated(p_0: any,): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            3: Enum_MODIFIER_EVENT.ON_ATTACK,
            4: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        return this.GetSpecialValueFor("bonus_attack_range");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.attacker == this.GetParentPlus() && this.GetAbilityPlus().IsTrained() && !this.GetParentPlus().PassivesDisabled() && keys.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK && !keys.unit.IsBuilding() && (!keys.unit.IsOther() || (keys.unit.IsOther() && keys.damage > 0))) {
            if (!this.meld_ability || this.meld_ability.IsNull()) {
                this.meld_ability = this.GetCasterPlus().findAbliityPlus<imba_templar_assassin_meld>("imba_templar_assassin_meld");
            }
            if (this.meld_ability && this.meld_ability.meld_record && this.meld_ability.meld_record == keys.record) {
                this.meld_extension = true;
                this.meld_ability.meld_record = undefined;
            }
            let damage_to_use = keys.damage;
            if (this.accelerate_record == keys.record) {
                if (!keys.unit.IsIllusion()) {
                    damage_to_use = math.max(keys.original_damage, keys.damage);
                } else {
                    damage_to_use = keys.original_damage;
                }
                this.accelerate_record = undefined;
            } else if (keys.unit.IsIllusion()  /**&& keys.unit.GetPhysicalArmorValue && GetReductionFromArmor*/) {
                damage_to_use = keys.original_damage * (1 - GPropertyCalculate.GetPhysicalReductionPect(keys.unit, keys as any));
            }
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInLine(this.GetCasterPlus().GetTeamNumber(), keys.unit.GetAbsOrigin(), keys.unit.GetAbsOrigin() + ((keys.unit.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Normalized() * this.GetSpecialValueFor("attack_spill_range")) as Vector, undefined, this.GetSpecialValueFor("attack_spill_width"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES))) {
                if (enemy != keys.unit) {
                    enemy.EmitSound("Hero_TemplarAssassin.PsiBlade");
                    this.psi_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_templar_assassin/templar_assassin_psi_blade.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.unit, this.GetParentPlus());
                    ParticleManager.SetParticleControlEnt(this.psi_particle, 0, keys.unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", keys.unit.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(this.psi_particle, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(this.psi_particle);
                    ApplyDamage({
                        victim: enemy,
                        damage: damage_to_use * this.GetSpecialValueFor("attack_spill_pct") * 0.01,
                        damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                        attacker: this.GetParentPlus(),
                        ability: this.GetAbilityPlus()
                    });
                    if (this.meld_extension) {
                        this.meld_ability.ApplyMeld(enemy, this.GetParentPlus());
                    }
                }
            }
            this.meld_extension = false;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && this.GetAbilityPlus().IsTrained() && !this.GetParentPlus().PassivesDisabled() && !keys.no_attack_cooldown) {
            if (this.GetStackCount() < this.GetSpecialValueFor("attacks_to_accelerate")) {
                this.IncrementStackCount();
            } else {
                this.accelerate_record = keys.record;
                this.SetStackCount(0);
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS)
    CC_GetModifierProjectileSpeedBonus(): number {
        if (this.GetStackCount() == this.GetSpecialValueFor("attacks_to_accelerate")) {
            return this.GetSpecialValueFor("accelerant_speed_bonus");
        }
    }
}
@registerAbility()
export class imba_templar_assassin_trap extends BaseAbility_Plus {
    public trap_ability: any;
    public counter_modifier: modifier_imba_templar_assassin_psionic_trap_counter;
    GetAssociatedSecondaryAbilities(): string {
        return "imba_templar_assassin_psionic_trap";
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (!this.trap_ability) {
            this.trap_ability = this.GetCasterPlus().findAbliityPlus<imba_templar_assassin_psionic_trap>("imba_templar_assassin_psionic_trap");
        }
        if (!this.counter_modifier || this.counter_modifier.IsNull()) {
            this.counter_modifier = this.GetCasterPlus().findBuff<modifier_imba_templar_assassin_psionic_trap_counter>("modifier_imba_templar_assassin_psionic_trap_counter");
        }
        if (this.trap_ability && this.counter_modifier && this.counter_modifier.trap_table && GameFunc.GetCount(this.counter_modifier.trap_table) > 0) {
            let distance = undefined;
            let index = undefined;
            for (let trap_number = 0; trap_number < GameFunc.GetCount(this.counter_modifier.trap_table); trap_number++) {
                if (this.counter_modifier.trap_table[trap_number] && !this.counter_modifier.trap_table[trap_number].IsNull()) {
                    if (!distance) {
                        index = trap_number;
                        distance = (this.GetCasterPlus().GetAbsOrigin() - this.counter_modifier.trap_table[trap_number].GetParentPlus().GetAbsOrigin() as Vector).Length2D();
                    } else if (((this.GetCasterPlus().GetAbsOrigin() - this.counter_modifier.trap_table[trap_number].GetParentPlus().GetAbsOrigin() as Vector).Length2D() < distance)) {
                        index = trap_number;
                        distance = (this.GetCasterPlus().GetAbsOrigin() - this.counter_modifier.trap_table[trap_number].GetParentPlus().GetAbsOrigin() as Vector).Length2D();
                    }
                }
            }
            if (index) {
                this.GetCasterPlus().EmitSound("Hero_TemplarAssassin.Trap.Trigger");
                if (this.GetCasterPlus().GetUnitName().includes("templar_assassin") && RollPercentage(50)) {
                    if (RollPercentage(50)) {
                        this.GetCasterPlus().EmitSound("templar_assassin_temp_psionictrap_05");
                    } else {
                        this.GetCasterPlus().EmitSound("templar_assassin_temp_psionictrap_10");
                    }
                }
                this.counter_modifier.trap_table[index].Explode(this.trap_ability, this.GetSpecialValueFor("trap_radius"), this.GetSpecialValueFor("trap_duration"));
            }
        } else {
            EventHelper.ErrorMessage("No traps", this.GetCasterPlus().GetPlayerID());
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_trap_slow extends BaseModifier_Plus {
    public movement_speed_max: number;
    public slow: any;
    public elapsedTime: any;
    public trap_duration_tooltip: number;
    public trap_bonus_damage: number;
    public trap_max_charge_duration: number;
    public interval: number;
    public damage_per_tick: number;
    IgnoreTenacity() {
        return true;
    }
    GetTexture(): string {
        return "templar_assassin_psionic_trap";
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_templar_assassin/templar_assassin_trap_slow.vpcf";
    }
    BeCreated(params: any): void {
        this.movement_speed_max = this.GetSpecialValueFor("movement_speed_max");
        if (!IsServer()) {
            return;
        }
        this.slow = params.slow * (-1);
        this.elapsedTime = params.elapsedTime;
        this.trap_duration_tooltip = math.max(this.GetSpecialValueFor("trap_duration_tooltip"), this.GetSpecialValueFor("trap_duration"));
        this.trap_bonus_damage = this.GetSpecialValueFor("trap_bonus_damage") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_templar_assassin_psionic_trap_damage");
        this.trap_max_charge_duration = this.GetSpecialValueFor("trap_max_charge_duration");
        this.interval = 1;
        if (params.bSelfTrigger) {
            this.interval = this.interval * (1 - this.GetParentPlus().GetStatusResistance());
        }
        this.damage_per_tick = this.trap_bonus_damage / (this.trap_duration_tooltip / this.interval);
        if (this.elapsedTime >= this.trap_max_charge_duration) {
            this.StartIntervalThink(this.interval);
        }
    }
    OnIntervalThink(): void {
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.damage_per_tick,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount() * 0.01;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.movement_speed_max;
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_trap_limbs extends BaseModifier_Plus {
    public inhibit_limbs_attack_slow: any;
    public inhibit_limbs_attack_slow_pct: number;
    public inhibit_limbs_turn_rate_slow: any;
    public attack_speed_slow: number;
    public interval: number;
    GetTexture(): string {
        return "templar_assassin_psionic_trap";
    }
    BeCreated(params: any): void {
        if (this.GetAbilityPlus()) {
            this.inhibit_limbs_attack_slow = this.GetSpecialValueFor("inhibit_limbs_attack_slow");
            this.inhibit_limbs_attack_slow_pct = this.GetSpecialValueFor("inhibit_limbs_attack_slow_pct");
            this.inhibit_limbs_turn_rate_slow = this.GetSpecialValueFor("inhibit_limbs_turn_rate_slow");
        } else if (params) {
            this.inhibit_limbs_attack_slow = params.inhibit_limbs_attack_slow;
            this.inhibit_limbs_attack_slow_pct = params.inhibit_limbs_attack_slow_pct;
            this.inhibit_limbs_turn_rate_slow = params.inhibit_limbs_turn_rate_slow;
        } else {
            this.inhibit_limbs_attack_slow = 50;
            this.inhibit_limbs_attack_slow_pct = 10;
            this.inhibit_limbs_turn_rate_slow = -50;
        }
        this.attack_speed_slow = math.max(this.GetParentPlus().GetAttackSpeed() * this.inhibit_limbs_attack_slow_pct, this.inhibit_limbs_attack_slow) * (-1);
        this.interval = 0.1;
        this.StartIntervalThink(this.interval);
    }
    OnIntervalThink(): void {
        this.attack_speed_slow = 0;
        this.attack_speed_slow = math.max(this.GetParentPlus().GetAttackSpeed() * this.inhibit_limbs_attack_slow_pct, this.inhibit_limbs_attack_slow) * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed_slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return this.inhibit_limbs_turn_rate_slow;
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_trap_eyes extends BaseModifier_Plus {
    public inhibit_eyes_vision_reduction: any;
    GetTexture(): string {
        return "templar_assassin/psionic_trap_eyes";
    }
    BeCreated(params: any): void {
        if (this.GetAbilityPlus()) {
            this.inhibit_eyes_vision_reduction = this.GetSpecialValueFor("inhibit_eyes_vision_reduction");
        } else if (params) {
            this.inhibit_eyes_vision_reduction = params.inhibit_eyes_vision_reduction;
        } else {
            this.inhibit_eyes_vision_reduction = -75;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.DONT_GIVE_VISION_OF_ATTACKER
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE)
    CC_GetBonusVisionPercentage(): number {
        return this.inhibit_eyes_vision_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DONT_GIVE_VISION_OF_ATTACKER)
    CC_GetModifierNoVisionOfAttacker(): number {
        return 1;
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_trap_nerves extends BaseModifier_Plus {
    public inhibit_nerves_ministun_duration: number;
    public stun_orders: any;
    GetTexture(): string {
        return "templar_assassin/psionic_trap_nerves";
    }
    BeCreated(params: any): void {
        if (this.GetAbilityPlus()) {
            this.inhibit_nerves_ministun_duration = this.GetSpecialValueFor("inhibit_nerves_ministun_duration");
        } else if (params) {
            this.inhibit_nerves_ministun_duration = params.inhibit_nerves_ministun_duration;
        } else {
            this.inhibit_nerves_ministun_duration = 0.05;
        }
        if (!IsServer()) {
            return;
        }
        this.stun_orders = {
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM]: true
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (keys.unit == this.GetParentPlus() && this.stun_orders[keys.order_type]) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                duration: this.inhibit_nerves_ministun_duration * (1 - this.GetParentPlus().GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_trap_springboard extends BaseModifier_Plus {
    public trap_radius: number;
    public springboard_min_height: any;
    public springboard_max_height: any;
    public springboard_duration: number;
    public springboard_vector_amp: any;
    public springboard_movement_slow_pct: number;
    public initial_height: any;
    public visual_z_delta: any;
    public interval: number;
    public trap_pos: any;
    public launch_vector: any;
    public height: any;
    public duration: number;
    public vertical_velocity: any;
    public vertical_acceleration: any;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        this.trap_radius = this.GetSpecialValueFor("trap_radius");
        this.springboard_min_height = this.GetSpecialValueFor("springboard_min_height");
        this.springboard_max_height = this.GetSpecialValueFor("springboard_max_height");
        this.springboard_duration = this.GetSpecialValueFor("springboard_duration");
        this.springboard_vector_amp = this.GetSpecialValueFor("springboard_vector_amp");
        this.springboard_movement_slow_pct = this.GetSpecialValueFor("springboard_movement_slow_pct") * (-1);
        if (!IsServer()) {
            return;
        }
        this.initial_height = this.GetParentPlus().GetAbsOrigin().z;
        this.visual_z_delta = 0;
        this.interval = FrameTime();
        this.trap_pos = Vector(params.trap_pos_x, params.trap_pos_y, params.trap_pos_z);
        this.launch_vector = (this.GetParentPlus().GetAbsOrigin() - this.trap_pos) * Vector(1, 1, 0) * this.springboard_vector_amp;
        this.height = this.springboard_min_height + ((this.springboard_max_height - this.springboard_min_height) * (1 - (this.launch_vector.Length2D() / this.trap_radius)));
        this.duration = this.springboard_duration;
        this.vertical_velocity = 4 * this.height / this.duration;
        this.vertical_acceleration = -(8 * this.height) / (this.duration * this.duration);
        this.StartIntervalThink(this.interval);
    }
    BeRefresh(params: any): void {
        if (!IsServer()) {
            return;
        }
        if (this.initial_height) {
            this.initial_height = this.initial_height + this.visual_z_delta;
        }
        this.trap_pos = Vector(params.trap_pos_x, params.trap_pos_y, params.trap_pos_z);
        this.launch_vector = (this.GetParentPlus().GetAbsOrigin() - this.trap_pos) * Vector(1, 1, 0) * this.springboard_vector_amp;
        this.vertical_velocity = 4 * this.height / this.duration;
        this.vertical_acceleration = -(8 * this.height) / (this.duration * this.duration);
    }
    OnIntervalThink(): void {
        this.visual_z_delta = this.visual_z_delta + (this.vertical_velocity * this.interval);
        this.vertical_velocity = this.vertical_velocity + (this.vertical_acceleration * this.interval);
        if ((this.initial_height + this.visual_z_delta) < GetGroundHeight(this.GetParentPlus().GetAbsOrigin(), undefined) || this.visual_z_delta < 0) {
            this.Destroy();
        } else {
            this.SetStackCount(this.visual_z_delta);
            this.GetParentPlus().SetAbsOrigin(this.GetParentPlus().GetAbsOrigin() + (this.launch_vector * this.interval) as Vector);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA)
    CC_GetVisualZDelta(): number {
        return math.max(this.GetStackCount(), 0);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.springboard_movement_slow_pct;
    }
}
@registerAbility()
export class imba_templar_assassin_trap_teleport extends BaseAbility_Plus {
    public trap_ability: any;
    public counter_modifier: modifier_imba_templar_assassin_psionic_trap_counter;
    GetAssociatedSecondaryAbilities(): string {
        return "imba_templar_assassin_psionic_trap";
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    OnInventoryContentsChanged(): void {
        if (this.GetCasterPlus().HasScepter()) {
            this.SetHidden(false);
        } else {
            this.SetHidden(true);
        }
    }
    OnHeroCalculateStatBonus(): void {
        this.OnInventoryContentsChanged();
    }
    OnChannelFinish(bInterrupted: boolean): void {
        if (!bInterrupted) {
            if (!this.trap_ability) {
                this.trap_ability = this.GetCasterPlus().findAbliityPlus<imba_templar_assassin_psionic_trap>("imba_templar_assassin_psionic_trap");
            }
            if (!this.counter_modifier || this.counter_modifier.IsNull()) {
                this.counter_modifier = this.GetCasterPlus().findBuff<modifier_imba_templar_assassin_psionic_trap_counter>("modifier_imba_templar_assassin_psionic_trap_counter");
            }
            if (this.trap_ability && this.counter_modifier && this.counter_modifier.trap_table && GameFunc.GetCount(this.counter_modifier.trap_table) > 0) {
                let distance = undefined;
                let index = undefined;
                for (let trap_number = 1; trap_number <= GameFunc.GetCount(this.counter_modifier.trap_table); trap_number++) {
                    if (this.counter_modifier.trap_table[trap_number] && !this.counter_modifier.trap_table[trap_number].IsNull()) {
                        if (!distance) {
                            index = trap_number;
                            distance = (this.GetCursorPosition() - this.counter_modifier.trap_table[trap_number].GetParentPlus().GetAbsOrigin() as Vector).Length2D();
                        } else if (((this.GetCursorPosition() - this.counter_modifier.trap_table[trap_number].GetParentPlus().GetAbsOrigin() as Vector).Length2D() < distance)) {
                            index = trap_number;
                            distance = (this.GetCursorPosition() - this.counter_modifier.trap_table[trap_number].GetParentPlus().GetAbsOrigin() as Vector).Length2D();
                        }
                    }
                }
                if (index) {
                    FindClearSpaceForUnit(this.GetCasterPlus(), this.counter_modifier.trap_table[index].GetParentPlus().GetAbsOrigin(), false);
                    this.counter_modifier.trap_table[index].Explode(this.trap_ability, this.GetSpecialValueFor("trap_radius"), this.GetSpecialValueFor("trap_duration"));
                    if (this.GetCasterPlus().HasModifier("modifier_imba_templar_assassin_meld")) {
                        this.GetCasterPlus().findBuff<modifier_imba_templar_assassin_meld>("modifier_imba_templar_assassin_meld").cast_position = this.GetCasterPlus().GetAbsOrigin();
                    }
                }
            }
        }
    }
}
@registerAbility()
export class imba_templar_assassin_psionic_trap extends BaseAbility_Plus {
    public counter_modifier: modifier_imba_templar_assassin_psionic_trap_counter;
    GetAssociatedPrimaryAbilities(): string {
        return "imba_templar_assassin_trap";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_templar_assassin_psionic_trap_counter";
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_templar_assassin_psionic_trap_handler", this.GetCasterPlus()) <= 0) {
            return "templar_assassin_psionic_trap";
        } else if (this.GetCasterPlus().findBuffStack("modifier_imba_templar_assassin_psionic_trap_handler", this.GetCasterPlus()) == 1) {
            return "templar_assassin/psionic_trap_eyes";
        } else if (this.GetCasterPlus().findBuffStack("modifier_imba_templar_assassin_psionic_trap_handler", this.GetCasterPlus()) == 2) {
            return "templar_assassin/psionic_trap_nerves";
        } else {
            return "templar_assassin_psionic_trap";
        }
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("trap_radius");
    }
    OnUpgrade(): void {
        if (this.GetCasterPlus().HasAbility("imba_templar_assassin_trap")) {
            this.GetCasterPlus().findAbliityPlus<imba_templar_assassin_trap>("imba_templar_assassin_trap").SetLevel(this.GetLevel());
        }
        if (this.GetCasterPlus().HasAbility("imba_templar_assassin_trap_teleport")) {
            this.GetCasterPlus().findAbliityPlus<imba_templar_assassin_trap_teleport>("imba_templar_assassin_trap_teleport").SetLevel(this.GetLevel());
        }
    }
    OnSpellStart(): void {
        if (!this.counter_modifier || this.counter_modifier.IsNull()) {
            this.counter_modifier = this.GetCasterPlus().findBuff<modifier_imba_templar_assassin_psionic_trap_counter>("modifier_imba_templar_assassin_psionic_trap_counter");
        }
        if (this.counter_modifier && this.counter_modifier.trap_table) {
            this.GetCasterPlus().EmitSound("Hero_TemplarAssassin.Trap.Cast");
            EmitSoundOnLocationWithCaster(this.GetCursorPosition(), "Hero_TemplarAssassin.Trap", this.GetCasterPlus());
            if (this.GetCasterPlus().GetUnitName().includes("templar_assassin")) {
                if (RollPercentage(1)) {
                    this.GetCasterPlus().EmitSound("templar_assassin_temp_psionictrap_04");
                } else if (RollPercentage(50)) {
                    this.GetCasterPlus().EmitSound("templar_assassin_temp_psionictrap_0" + RandomInt(1, 3));
                }
            }
            let trap = BaseNpc_Plus.CreateUnitByName("npc_dota_templar_assassin_psionic_trap", this.GetCursorPosition(), this.GetCasterPlus(), false);
            FindClearSpaceForUnit(trap, trap.GetAbsOrigin(), false);
            let trap_modifier = trap.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_templar_assassin_psionic_trap", {});
            // trap.SetControllableByPlayer(this.GetCasterPlus().GetPlayerID(), true);
            if (trap.HasAbility("imba_templar_assassin_self_trap")) {
                trap.findAbliityPlus<imba_templar_assassin_self_trap>("imba_templar_assassin_self_trap").SetHidden(false);
                trap.findAbliityPlus<imba_templar_assassin_self_trap>("imba_templar_assassin_self_trap").SetLevel(this.GetLevel());
            }
            this.counter_modifier.trap_table.push(trap_modifier as any);
            if (GameFunc.GetCount(this.counter_modifier.trap_table) > this.GetTalentSpecialValueFor("max_traps")) {
                if (this.counter_modifier.trap_table[0].GetParentPlus()) {
                    this.counter_modifier.trap_table[0].GetParentPlus().ForceKill(false);
                }
            }
            this.counter_modifier.SetStackCount(GameFunc.GetCount(this.counter_modifier.trap_table));
            if (this.GetCasterPlus().HasAbility("imba_templar_assassin_trap") && this.GetCasterPlus().findAbliityPlus<imba_templar_assassin_trap>("imba_templar_assassin_trap").GetLevel() != this.GetLevel()) {
                this.GetCasterPlus().findAbliityPlus<imba_templar_assassin_trap>("imba_templar_assassin_trap").SetLevel(this.GetLevel());
            }
            if (this.GetCasterPlus().HasAbility("imba_templar_assassin_trap_teleport") && this.GetCasterPlus().findAbliityPlus<imba_templar_assassin_trap_teleport>("imba_templar_assassin_trap_teleport").GetLevel() != this.GetLevel()) {
                this.GetCasterPlus().findAbliityPlus<imba_templar_assassin_trap_teleport>("imba_templar_assassin_trap_teleport").SetLevel(this.GetLevel());
            }
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_templar_assassin_psionic_trap_damage") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_templar_assassin_psionic_trap_damage")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_templar_assassin_psionic_trap_damage"), "modifier_special_bonus_imba_templar_assassin_psionic_trap_damage", {});
        }
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_psionic_trap_handler extends BaseModifier_Plus {
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
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus() || keys.order_type != dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO || keys.ability != this.GetAbilityPlus()) {
            return;
        }
        if (!this.GetAbilityPlus().GetAutoCastState()) {
            if (this.GetStackCount() >= 2) {
                this.SetStackCount(0);
            } else {
                this.IncrementStackCount();
            }
            this.GetAbilityPlus().ToggleAutoCast();
        }
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_psionic_trap extends BaseModifier_Plus {
    public trap_fade_time: number;
    public movement_speed_min: number;
    public movement_speed_max: number;
    public trap_duration_tooltip: number;
    public trap_bonus_damage: number;
    public trap_max_charge_duration: number;
    public inhibit_limbs_attack_slow: any;
    public inhibit_limbs_attack_slow_pct: number;
    public inhibit_limbs_turn_rate_slow: any;
    public inhibit_eyes_vision_reduction: any;
    public inhibit_nerves_ministun_duration: number;
    public color: any;
    public bColor: any;
    public inhibitor: any;
    public self_particle: any;
    public trap_counter_modifier: modifier_imba_templar_assassin_psionic_trap_counter;
    public explode_particle: any;
    IsHidden(): boolean {
        return this.GetElapsedTime() < this.trap_max_charge_duration;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "templar_assassin_psionic_trap";
    }
    BeCreated(p_0: any,): void {
        this.trap_fade_time = this.GetSpecialValueFor("trap_fade_time");
        this.movement_speed_min = this.GetSpecialValueFor("movement_speed_min");
        this.movement_speed_max = this.GetSpecialValueFor("movement_speed_max");
        this.trap_duration_tooltip = this.GetSpecialValueFor("trap_duration_tooltip");
        this.trap_bonus_damage = this.GetSpecialValueFor("trap_bonus_damage") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_templar_assassin_psionic_trap_damage");
        this.trap_max_charge_duration = this.GetSpecialValueFor("trap_max_charge_duration");
        this.inhibit_limbs_attack_slow = this.GetSpecialValueFor("inhibit_limbs_attack_slow");
        this.inhibit_limbs_attack_slow_pct = this.GetSpecialValueFor("inhibit_limbs_attack_slow_pct");
        this.inhibit_limbs_turn_rate_slow = this.GetSpecialValueFor("inhibit_limbs_turn_rate_slow");
        this.inhibit_eyes_vision_reduction = this.GetSpecialValueFor("inhibit_eyes_vision_reduction");
        this.inhibit_nerves_ministun_duration = this.GetSpecialValueFor("inhibit_nerves_ministun_duration");
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().findBuffStack("modifier_imba_templar_assassin_psionic_trap_handler", this.GetCasterPlus()) <= 0) {
            this.color = Vector(0, 0, 0);
            this.bColor = 0;
            this.inhibitor = "modifier_imba_templar_assassin_trap_limbs";
        } else if (this.GetCasterPlus().findBuffStack("modifier_imba_templar_assassin_psionic_trap_handler", this.GetCasterPlus()) == 1) {
            this.color = Vector(94, 94, 94);
            this.bColor = 1;
            this.inhibitor = "modifier_imba_templar_assassin_trap_eyes";
        } else if (this.GetCasterPlus().findBuffStack("modifier_imba_templar_assassin_psionic_trap_handler", this.GetCasterPlus()) == 2) {
            this.color = Vector(141, 0, 0);
            this.bColor = 1;
            this.inhibitor = "modifier_imba_templar_assassin_trap_nerves";
        } else {
            this.color = Vector(0, 0, 0);
            this.bColor = 0;
            this.inhibitor = "modifier_imba_templar_assassin_trap_limbs";
        }
        this.self_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_templar_assassin/templar_assassin_trap.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.self_particle, 60, this.color);
        ParticleManager.SetParticleControl(this.self_particle, 61, Vector(this.bColor, 0, 0));
        this.AddParticle(this.self_particle, false, false, -1, false, false);
        this.trap_counter_modifier = this.GetCasterPlus().findBuff<modifier_imba_templar_assassin_psionic_trap_counter>("modifier_imba_templar_assassin_psionic_trap_counter");
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.trap_counter_modifier && this.trap_counter_modifier.trap_table) {
            for (let trap_modifier = 0; trap_modifier < GameFunc.GetCount(this.trap_counter_modifier.trap_table); trap_modifier++) {
                if (this.trap_counter_modifier.trap_table[trap_modifier] == this) {
                    this.trap_counter_modifier.trap_table.splice(trap_modifier, 1);
                    if (this.GetCasterPlus().HasModifier("modifier_imba_templar_assassin_psionic_trap_counter")) {
                        this.GetCasterPlus().findBuff<modifier_imba_templar_assassin_psionic_trap_counter>("modifier_imba_templar_assassin_psionic_trap_counter").DecrementStackCount();
                    }
                    return;
                }
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetElapsedTime() >= this.trap_fade_time) {
            return {
                [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
            };
        } else {
            return {
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
            };
        }
    }
    Explode(ability: IBaseAbility_Plus, radius: number, trap_duration: number, bSelfTrigger = false) {
        this.GetParentPlus().EmitSound("Hero_TemplarAssassin.Trap.Explode");
        this.explode_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_templar_assassin/templar_assassin_trap_explode.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.explode_particle, 60, this.color);
        ParticleManager.SetParticleControl(this.explode_particle, 61, Vector(this.bColor, 0, 0));
        ParticleManager.ReleaseParticleIndex(this.explode_particle);
        if (this.GetParentPlus().GetOwnerPlus()) {
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                let slow_modifier = enemy.AddNewModifier(this.GetParentPlus().GetOwnerPlus(), ability, "modifier_imba_templar_assassin_trap_slow", {
                    duration: trap_duration,
                    slow: math.min(this.movement_speed_min + (((this.movement_speed_max - this.movement_speed_min) / this.trap_max_charge_duration) * math.floor(this.GetElapsedTime() * 10) / 10), this.movement_speed_max),
                    elapsedTime: this.GetElapsedTime(),
                    bSelfTrigger: bSelfTrigger
                });
                if (slow_modifier) {
                    slow_modifier.SetStackCount(math.min(this.movement_speed_min + (((this.movement_speed_max - this.movement_speed_min) / this.trap_max_charge_duration) * math.floor(this.GetElapsedTime() * 10) / 10), this.movement_speed_max) * 100 * (1 - enemy.GetStatusResistance()) * (-1));
                    if (bSelfTrigger) {
                        slow_modifier.SetDuration(trap_duration * (1 - enemy.GetStatusResistance()), true);
                    }
                }
                if (this.GetElapsedTime() >= this.trap_max_charge_duration && this.inhibitor) {
                    let inhibitor_modifier = enemy.AddNewModifier(this.GetParentPlus().GetOwnerPlus(), ability, this.inhibitor, {
                        duration: trap_duration,
                        inhibit_limbs_attack_slow: this.inhibit_limbs_attack_slow,
                        inhibit_limbs_attack_slow_pct: this.inhibit_limbs_attack_slow_pct,
                        inhibit_limbs_turn_rate_slow: this.inhibit_limbs_turn_rate_slow,
                        inhibit_eyes_vision_reduction: this.inhibit_eyes_vision_reduction,
                        inhibit_nerves_ministun_duration: this.inhibit_nerves_ministun_duration
                    });
                    if (inhibitor_modifier) {
                        inhibitor_modifier.SetDuration(trap_duration * (1 - enemy.GetStatusResistance()), true);
                    }
                }
            }
            if (this.GetParentPlus().GetOwnerPlus().HasAbility("imba_templar_assassin_trap") && this.GetParentPlus().GetOwnerPlus().findAbliityPlus<imba_templar_assassin_trap>("imba_templar_assassin_trap").GetAutoCastState() && (this.GetParentPlus().GetOwnerPlus().GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() <= radius && !this.GetParentPlus().GetOwnerPlus().IsRooted()) {
                let springboard_ability = this.GetParentPlus().GetOwnerPlus().findAbliityPlus<imba_templar_assassin_trap>("imba_templar_assassin_trap");
                this.GetParentPlus().GetOwnerPlus().AddNewModifier(this.GetParentPlus().GetOwnerPlus(), springboard_ability, "modifier_imba_templar_assassin_trap_springboard", {
                    trap_pos_x: this.GetParentPlus().GetAbsOrigin().x,
                    trap_pos_y: this.GetParentPlus().GetAbsOrigin().y,
                    trap_pos_z: this.GetParentPlus().GetAbsOrigin().z
                });
            }
        }
        this.GetParentPlus().ForceKill(false);
        this.Destroy();
    }
}
@registerModifier()
export class modifier_imba_templar_assassin_psionic_trap_counter extends BaseModifier_Plus {
    public trap_table: modifier_imba_templar_assassin_psionic_trap[];
    GetTexture(): string {
        return "templar_assassin_psionic_trap";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.trap_table = []
        this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_templar_assassin_psionic_trap_handler", {});
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveModifierByName("modifier_imba_templar_assassin_psionic_trap_handler");
    }
}
@registerAbility()
export class imba_templar_assassin_self_trap extends BaseAbility_Plus {
    public trap_counter_modifier: modifier_imba_templar_assassin_psionic_trap_counter;
    IsStealable(): boolean {
        return false;
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (this.GetCasterPlus().GetOwnerPlus()) {
            this.trap_counter_modifier = this.GetCasterPlus().GetOwnerPlus().findBuff<modifier_imba_templar_assassin_psionic_trap_counter>("modifier_imba_templar_assassin_psionic_trap_counter");
            if (this.GetCasterPlus().HasModifier("modifier_imba_templar_assassin_psionic_trap")) {
                this.GetCasterPlus().findBuff<modifier_imba_templar_assassin_psionic_trap>("modifier_imba_templar_assassin_psionic_trap").Explode(this, this.GetSpecialValueFor("trap_radius"), this.GetSpecialValueFor("trap_duration"), true);
                // PlayerResource.NewSelection(this.GetCasterPlus().GetOwnerPlus().GetPlayerID(), this.GetCasterPlus().GetOwnerPlus());
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_templar_assassin_meld_dispels extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_templar_assassin_meld_bash extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_templar_assassin_refraction_instances extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_templar_assassin_meld_armor_reduction extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_templar_assassin_psionic_trap_damage extends BaseModifier_Plus {
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
