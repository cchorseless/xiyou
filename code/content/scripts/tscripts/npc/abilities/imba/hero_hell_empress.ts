
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_empress_eleven_curses extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("effect_radius");
    }
    OnSpellStart(curse_target: Vector = null, curse_stacks = 0): void {
        let caster = this.GetCasterPlus();
        let target_point = this.GetCursorPosition();
        let stacks_to_add = this.GetSpecialValueFor("curse_stacks");
        if (curse_target) {
            target_point = curse_target;
        }
        if (curse_stacks) {
            stacks_to_add = curse_stacks;
        }
        let stack_duration = this.GetSpecialValueFor("stack_duration");
        let max_stacks = this.GetSpecialValueFor("max_stacks");
        let effect_radius = this.GetSpecialValueFor("effect_radius");
        EmitSoundOnLocationWithCaster(target_point, "Imba.HellEmpressCurseHit", caster);
        let ground_pfx = ResHelper.CreateParticleEx("particles/hero/hell_empress/hellion_curse_area.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(ground_pfx, 0, target_point + Vector(0, 0, 50) as Vector);
        ParticleManager.SetParticleControl(ground_pfx, 1, Vector(effect_radius, 0, 0));
        ParticleManager.ReleaseParticleIndex(ground_pfx);
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, effect_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of ipairs(enemies)) {
            let hit_pfx = ResHelper.CreateParticleEx("particles/hero/hell_empress/empress_curse_hit.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, enemy);
            ParticleManager.SetParticleControl(hit_pfx, 4, enemy.GetAbsOrigin() + Vector(0, 0, 100) as Vector);
            ParticleManager.ReleaseParticleIndex(hit_pfx);
            let modifier_curse_instance = enemy.AddNewModifier(caster, this, "modifier_imba_eleven_curses", {
                duration: stack_duration * (1 - enemy.GetStatusResistance())
            });
            if (modifier_curse_instance) {
                modifier_curse_instance.SetStackCount(math.min(max_stacks, modifier_curse_instance.GetStackCount() + stacks_to_add));
            }
        }
    }
}
@registerModifier()
export class modifier_imba_eleven_curses extends BaseModifier_Plus {
    public amp_per_stack: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.amp_per_stack = this.GetSpecialValueFor("damage_amp");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.amp_per_stack * this.GetStackCount();
    }
}
@registerAbility()
export class imba_empress_hellbolt extends BaseAbility_Plus {
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target_radius = this.GetSpecialValueFor("target_radius") + GPropertyCalculate.GetCastRangeBonus(caster);
        let bolt_speed = this.GetSpecialValueFor("bolt_speed");
        caster.EmitSound("Hero_SkywrathMage.ConcussiveShot.Cast");
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, target_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of ipairs(enemies)) {
            let projectile = {
                Target: enemy,
                Source: caster,
                Ability: this,
                EffectName: "particles/hero/hell_empress/empress_hellbolt.vpcf",
                bDodgable: true,
                bProvidesVision: false,
                iMoveSpeed: bolt_speed,
                iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION
            }
            ProjectileManager.CreateTrackingProjectile(projectile);
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, target_loc: Vector): boolean | void {
        let caster = this.GetCasterPlus();
        let base_damage = this.GetSpecialValueFor("base_damage");
        let bonus_damage = this.GetSpecialValueFor("bonus_damage");
        if (!target.IsMagicImmune()) {
            target.EmitSound("Hero_SkywrathMage.ConcussiveShot.Target");
            let curse_modifier = target.findBuff<modifier_imba_eleven_curses>("modifier_imba_eleven_curses");
            if (curse_modifier) {
                bonus_damage = curse_modifier.GetStackCount() * bonus_damage * 0.01;
            } else {
                bonus_damage = 0;
            }
            let damage = base_damage * (1 + bonus_damage);
            let actual_damage = ApplyDamage({
                victim: target,
                attacker: caster,
                ability: this,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, target, actual_damage, undefined);
            if (curse_modifier) {
                curse_modifier.SetStackCount(math.floor(curse_modifier.GetStackCount() * (100 - this.GetSpecialValueFor("curse_stack_reduction_pct")) * 0.01));
                if (curse_modifier.GetStackCount() < 1) {
                    curse_modifier.Destroy();
                }
            }
        }
    }
}
@registerAbility()
export class imba_empress_royal_wrath extends BaseAbility_Plus {
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_empress_royal_wrath_cooldown");
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_royal_wrath";
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_empress_royal_wrath_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_empress_royal_wrath_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_empress_royal_wrath_cooldown"), "modifier_special_bonus_imba_empress_royal_wrath_cooldown", {});
        }
    }
}
@registerModifier()
export class modifier_imba_royal_wrath extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (keys.unit == this.GetParentPlus()) {
                let parent = this.GetParentPlus();
                let attacker = keys.attacker;
                let ability = this.GetAbilityPlus();
                let ability_curse = parent.findAbliityPlus<imba_empress_eleven_curses>("imba_empress_eleven_curses");
                if (attacker.IsRealHero() && attacker.IsAlive() && ability.IsCooldownReady() && attacker.GetTeam() != parent.GetTeam() && ability_curse && ability_curse.GetLevel() > 0 && !parent.PassivesDisabled() && !attacker.IsMagicImmune()) {
                    ability_curse.OnSpellStart(attacker.GetAbsOrigin(), 1);
                    let ability_hellbolt = parent.findAbliityPlus<imba_empress_hellbolt>("imba_empress_hellbolt");
                    if (ability_hellbolt && ability_hellbolt.GetLevel() > 0) {
                        let hellbolt_cd_remaining = ability_hellbolt.GetCooldownTimeRemaining();
                        let hellbolt_cdr = ability.GetSpecialValueFor("hellbolt_cdr");
                        ability_hellbolt.EndCooldown();
                        if (hellbolt_cd_remaining > hellbolt_cdr) {
                            ability_hellbolt.StartCooldown(hellbolt_cd_remaining - hellbolt_cdr);
                        }
                    }
                    ability.StartCooldown(ability.GetCooldown(ability.GetLevel()));
                }
            }
        }
    }
}
@registerAbility()
export class imba_empress_hurl_through_hell extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("hurl_radius");
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target_loc = this.GetCursorPosition();
        let hurl_radius = this.GetSpecialValueFor("hurl_radius");
        let hurl_duration = this.GetSpecialValueFor("hurl_duration");
        caster.EmitSound("Imba.HellEmpressHurlCast");
        EmitSoundOnLocationWithCaster(target_loc, "Imba.HellEmpressHurlHit", caster);
        let cast_pfx = ResHelper.CreateParticleEx("particles/hero/hell_empress/empress_hurl.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
        ParticleManager.SetParticleControl(cast_pfx, 0, target_loc);
        ParticleManager.SetParticleControl(cast_pfx, 1, Vector(hurl_radius, 1, 1));
        ParticleManager.SetParticleControl(cast_pfx, 2, Vector(hurl_radius, 1, 1));
        ParticleManager.SetParticleControl(cast_pfx, 3, target_loc);
        ParticleManager.ReleaseParticleIndex(cast_pfx);
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_loc, undefined, hurl_radius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of ipairs(enemies)) {
            enemy.AddNewModifier(caster, this, "modifier_imba_hurl_through_hell", {
                duration: hurl_duration
            });
        }
    }
}
@registerModifier()
export class modifier_imba_hurl_through_hell extends BaseModifier_Plus {
    public hurl_damage: number;
    public debuff_amount: number;
    public debuff_duration: number;
    public hurl_pfx: any;
    IgnoreTenacity() {
        return true;
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
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let parent_loc = parent.GetAbsOrigin();
            let ability = this.GetAbilityPlus();
            this.hurl_damage = ability.GetSpecialValueFor("hurl_damage");
            this.debuff_amount = ability.GetSpecialValueFor("debuff_amount");
            this.debuff_duration = ability.GetSpecialValueFor("debuff_duration");
            if (this.GetCasterPlus().HasScepter()) {
                this.debuff_amount = ability.GetSpecialValueFor("debuff_amount_scepter");
            }
            EmitSoundOn("Imba.HellEmpressHurlLoop", parent);
            parent.AddNoDraw();
            this.hurl_pfx = ResHelper.CreateParticleEx("particles/hero/hell_empress/empress_hurl_prison.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, parent);
            ParticleManager.SetParticleControl(this.hurl_pfx, 0, parent_loc);
            ParticleManager.SetParticleControl(this.hurl_pfx, 2, parent_loc);
            ParticleManager.SetParticleControl(this.hurl_pfx, 3, parent_loc);
            this.AddParticle(this.hurl_pfx, false, false, -1, false, false);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let parent_loc = parent.GetAbsOrigin();
            let ability = this.GetAbilityPlus();
            parent.StopSound("Imba.HellEmpressHurlLoop");
            EmitSoundOn("Imba.HellEmpressHurlEnd", parent);
            parent.RemoveNoDraw();
            ParticleManager.DestroyParticle(this.hurl_pfx, false);
            ParticleManager.ReleaseParticleIndex(this.hurl_pfx);
            let ability_curse = caster.findAbliityPlus<imba_empress_eleven_curses>("imba_empress_eleven_curses");
            if (ability_curse && ability_curse.GetLevel() > 0) {
                ability_curse.OnSpellStart(parent.GetAbsOrigin());
            }
            ApplyDamage({
                victim: parent,
                attacker: caster,
                ability: ability,
                damage: this.hurl_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            let debuff_table = [
                "modifier_imba_hurl_through_hell_slow",
                "modifier_imba_hurl_through_hell_root",
                "modifier_imba_hurl_through_hell_disarm",
                "modifier_imba_hurl_through_hell_silence",
                "modifier_imba_hurl_through_hell_mute",
                "modifier_imba_hurl_through_hell_break"
            ]

            for (let i = 0; i < this.debuff_amount; i += 1) {
                parent.AddNewModifier(caster, ability, table.remove(debuff_table, RandomInt(0, GameFunc.GetCount(debuff_table))),
                    {
                        duration: this.debuff_duration
                    });
            }
            ResolveNPCPositions(parent_loc, 128);
        }
    }
}
@registerModifier()
export class modifier_imba_hurl_through_hell_slow extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetSpecialValueFor("slow_pct");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetSpecialValueFor("slow_pct");
    }
}
@registerModifier()
export class modifier_imba_hurl_through_hell_root extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_hurl_through_hell_disarm extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_hurl_through_hell_silence extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_hurl_through_hell_mute extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_MUTED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_hurl_through_hell_break extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
        }
        return state;
    }
}
@registerAbility()
export class imba_empress_ambient_effects extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_hell_empress_ambient_effects";
    }
    IsInnateAbility() {
        return true;
    }
}
@registerModifier()
export class modifier_hell_empress_ambient_effects extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/econ/items/shadow_fiend/sf_fire_arcana/sf_fire_arcana_ambient.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus().IsStolen()) {
                this.GetParentPlus().SetRenderColor(200, 55, 55);
            }
        }
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    IsHidden(): boolean {
        return true;
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_empress_royal_wrath_cooldown extends BaseModifier_Plus {
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
