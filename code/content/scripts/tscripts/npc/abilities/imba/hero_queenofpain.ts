
import { GameFunc } from "../../../GameFunc";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_queenofpain_delightful_torment extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return false;
    }
    IsStealable(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    IsInnateAbility() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "queenofpain_delightful_torment";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_delightful_torment_thinker";
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_queenofpain_4") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_queenofpain_4")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_queenofpain_4"), "modifier_special_bonus_imba_queenofpain_4", {});
        }
    }
}
@registerModifier()
export class modifier_imba_delightful_torment_thinker extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        let parent = this.GetParentPlus();
        if (params.attacker == parent) {
            if (params.unit.IsRealUnit() && !parent.PassivesDisabled()) {
                let cooldown_reduction = this.GetSpecialValueFor("cooldown_reduction");
                for (let i = 0; i <= 15; i++) {
                    let current_ability = parent.GetAbilityByIndex(i);
                    if (current_ability) {
                        let cooldown_remaining = current_ability.GetCooldownTimeRemaining();
                        current_ability.EndCooldown();
                        if (cooldown_remaining > cooldown_reduction) {
                            current_ability.StartCooldown(cooldown_remaining - cooldown_reduction);
                        }
                    }
                }
                if (parent.HasTalent("special_bonus_imba_queenofpain_4")) {
                    parent.AddNewModifier(parent, this.GetAbilityPlus(), "modifier_imba_delightful_torment_as_bonus", {
                        duration: parent.GetTalentValue("special_bonus_imba_queenofpain_4", "duration")
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_delightful_torment_as_bonus extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_queenofpain_4");
    }
}
@registerAbility()
export class imba_queenofpain_shadow_strike extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_queen_of_pain_shadow_strike_aoe")) {
            return super.GetBehavior();
        } else {
            return tonumber(tostring(super.GetBehavior())) + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE;
        }
    }
    GetAOERadius(): number {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_queen_of_pain_shadow_strike_aoe")) {
            return 0;
        } else {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_queen_of_pain_shadow_strike_aoe");
        }
    }
    OnSpellStart(params?: IBaseNpc_Plus): void {
        let caster = this.GetCasterPlus();
        let target;
        if (params) {
            target = params;
        } else {
            target = this.GetCursorTarget();
            caster.EmitSound("Hero_QueenOfPain.ShadowStrike");
            if ((math.random(1, 100) <= 15) && (caster.GetUnitName().includes("queenofpain"))) {
                caster.EmitSound("queenofpain_pain_ability_shadowstrike_0" + math.random(1, 4));
            }
        }
        let damage = this.GetSpecialValueFor("damage");
        let sec_damage_total = this.GetSpecialValueFor("sec_damage_total");
        let damage_interval = this.GetSpecialValueFor("damage_interval");
        let duration = this.GetSpecialValueFor("duration");
        let projectile_speed = this.GetSpecialValueFor("projectile_speed");
        let caster_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_queenofpain/queen_shadow_strike_body.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControl(caster_pfx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(caster_pfx, 1, target.GetAbsOrigin());
        ParticleManager.SetParticleControl(caster_pfx, 3, Vector(projectile_speed, 0, 0));
        ParticleManager.ReleaseParticleIndex(caster_pfx);
        let projectile = {
            Target: target,
            Source: caster,
            Ability: this,
            EffectName: "particles/units/heroes/hero_queenofpain/queen_shadow_strike.vpcf",
            iMoveSpeed: projectile_speed,
            vSourceLoc: caster.GetAbsOrigin(),
            bDrawsOnMinimap: false,
            bDodgeable: true,
            bIsAttack: false,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            flExpireTime: GameRules.GetGameTime() + 20,
            bProvidesVision: false,
            ExtraData: {
                init_damage: damage,
                sec_damage_total: sec_damage_total,
                damage_interval: damage_interval,
                duration: duration,
                bPrimaryTarget: true
            }
        }
        ProjectileManager.CreateTrackingProjectile(projectile);
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_queen_of_pain_shadow_strike_aoe")) {
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), target.GetAbsOrigin(), undefined, this.GetCasterPlus().GetTalentValue("special_bonus_imba_queen_of_pain_shadow_strike_aoe"), this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false))) {
                if (enemy != target) {
                    ProjectileManager.CreateTrackingProjectile({
                        Target: enemy,
                        Source: this.GetCasterPlus(),
                        Ability: this,
                        EffectName: "particles/units/heroes/hero_queenofpain/queen_shadow_strike.vpcf",
                        iMoveSpeed: this.GetSpecialValueFor("projectile_speed"),
                        vSourceLoc: this.GetCasterPlus().GetAbsOrigin(),
                        bDrawsOnMinimap: false,
                        bDodgeable: true,
                        bIsAttack: false,
                        bVisibleToEnemies: true,
                        bReplaceExisting: false,
                        flExpireTime: GameRules.GetGameTime() + 20,
                        bProvidesVision: false,
                        ExtraData: {
                            init_damage: damage,
                            sec_damage_total: sec_damage_total,
                            damage_interval: damage_interval,
                            duration: duration,
                            bPrimaryTarget: false
                        }
                    });
                }
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (IsServer()) {
            if (target && !target.IsMagicImmune()) {
                if ((!ExtraData.bPrimaryTarget || ExtraData.bPrimaryTarget && ExtraData.bPrimaryTarget == 1) && target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
                let caster = this.GetCasterPlus();
                let damage_per_interval = ExtraData.sec_damage_total / (ExtraData.duration / ExtraData.damage_interval);
                ApplyDamage({
                    victim: target,
                    attacker: caster,
                    ability: this,
                    damage: ExtraData.init_damage,
                    damage_type: this.GetAbilityDamageType()
                });
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE, target, ExtraData.init_damage, undefined);
                target.AddNewModifier(caster, this, "modifier_imba_shadow_strike_debuff", {
                    duration: ExtraData.duration,
                    damage_per_interval: damage_per_interval,
                    damage_interval: ExtraData.damage_interval
                });
            }
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_queen_of_pain_shadow_strike_aoe") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_queen_of_pain_shadow_strike_aoe")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_queen_of_pain_shadow_strike_aoe"), "modifier_special_bonus_imba_queen_of_pain_shadow_strike_aoe", {});
        }
    }
}
@registerModifier()
export class modifier_imba_shadow_strike_debuff extends BaseModifier_Plus {
    public slow: any;
    public slow_decrease: any;
    public dagger_pfx: any;
    public damage_interval: number;
    public damage_per_interval: number;
    public counter: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(params: any): void {
        let parent = this.GetParentPlus();
        let ability = this.GetAbilityPlus();
        let slow_decay_pct = ability.GetSpecialValueFor("slow_decay_pct");
        this.slow = ability.GetSpecialValueFor("init_move_slow_pct");
        if (IsServer() && this.GetAbilityPlus()) {
            this.slow = this.slow * (1 - this.GetParentPlus().GetStatusResistance());
            this.slow_decrease = this.slow / this.GetSpecialValueFor("duration");
            this.SetStackCount(this.slow * 100 * (-1));
            if (!this.dagger_pfx) {
                this.dagger_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_queenofpain/queen_shadow_strike_debuff.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus());
                for (const [_, cp] of GameFunc.Pair({
                    1: 0,
                    2: 2,
                    3: 3
                })) {
                    ParticleManager.SetParticleControlEnt(this.dagger_pfx, cp, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
                }
                this.AddParticle(this.dagger_pfx, false, false, 0, true, false);
            }
            this.damage_interval = params.damage_interval / 0.5;
            this.damage_per_interval = params.damage_per_interval;
            this.counter = 0;
            this.StartIntervalThink(0.5);
        }
    }
    BeRefresh(params: any): void {
        this.OnCreated(params);
    }
    OnIntervalThink(): void {
        this.counter = this.counter + 1;
        if ((this.counter % 2) == 0) {
            if (this.slow > this.slow_decrease) {
                this.slow = this.slow - this.slow_decrease;
            } else {
                this.slow = 0;
            }
            this.SetStackCount(this.slow * 100 * (-1));
        }
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            if ((this.counter % this.damage_interval) == 0) {
                ApplyDamage({
                    victim: parent,
                    attacker: this.GetCasterPlus(),
                    ability: ability,
                    damage: this.damage_per_interval,
                    damage_type: ability.GetAbilityDamageType()
                });
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE, parent, this.damage_per_interval, undefined);
                let caster = this.GetCasterPlus();
                if (caster.HasAbility("imba_queenofpain_scream_of_pain") && caster.HasTalent("special_bonus_imba_queenofpain_6") && parent.IsRealUnit()) {
                    let scream = caster.findAbliityPlus<imba_queenofpain_scream_of_pain>("imba_queenofpain_scream_of_pain");
                    scream.OnSpellStart(caster.GetTalentValue("special_bonus_imba_queenofpain_6", "damage_pct"), parent, 1);
                    if (scream.GetLevel() >= 1) {
                    }
                }
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetParentPlus().GetHealthPercent() < 25) {
            return {
                [modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE]: true
            };
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION,
            3: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            if (caster.HasTalent("special_bonus_imba_queenofpain_3") && keys.attacker == caster && keys.unit == parent && caster.GetTeam() != parent.GetTeam() && keys.inflictor != ability) {
                let damage = this.damage_per_interval;
                if (damage > 0) {
                    ApplyDamage({
                        victim: parent,
                        attacker: caster,
                        ability: ability,
                        damage: damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        damage_flags: undefined
                    });
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE, parent, damage, undefined);
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount() * 0.01;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_queenofpain_1")) {
            return 1;
        } else {
            return 0;
        }
    }
}
@registerAbility()
export class imba_queenofpain_blink extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (IsClient()) {
            return this.GetSpecialValueFor("blink_range") + this.GetCasterPlus().GetCastRangeBonus();
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_pos = caster.GetAbsOrigin();
            let target_pos = this.GetCursorPosition();
            let blink_range = this.GetSpecialValueFor("blink_range") + GPropertyCalculate.GetCastRangeBonus(caster);
            let scream_damage_pct = this.GetSpecialValueFor("scream_damage_pct");
            let distance = (target_pos - caster_pos) as Vector;
            if (distance.Length2D() > blink_range) {
                target_pos = caster_pos + (distance.Normalized() * blink_range) as Vector;
            }
            if (caster.HasAbility("imba_queenofpain_scream_of_pain")) {
                let scream = caster.findAbliityPlus<imba_queenofpain_scream_of_pain>("imba_queenofpain_scream_of_pain");
                if (scream.GetLevel() >= 1) {
                    scream.OnSpellStart(scream_damage_pct);
                }
            }
            ProjectileHelper.ProjectileDodgePlus(caster);
            caster.EmitSound("Hero_QueenOfPain.Blink_in");
            let blink_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_queenofpain/queen_blink_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(blink_pfx, 0, caster_pos);
            ParticleManager.SetParticleControl(blink_pfx, 1, target_pos);
            ParticleManager.ReleaseParticleIndex(blink_pfx);
            FindClearSpaceForUnit(caster, target_pos, true);
            caster.EmitSound("Hero_QueenOfPain.Blink_out");
            let blink_end_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_queenofpain/queen_blink_end.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(blink_end_pfx, 0, target_pos);
            ParticleManager.SetParticleControlForward(blink_end_pfx, 0, distance.Normalized());
            ParticleManager.ReleaseParticleIndex(blink_end_pfx);
            caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_END);
            if (caster.HasAbility("imba_queenofpain_scream_of_pain")) {
                let scream = caster.findAbliityPlus<imba_queenofpain_scream_of_pain>("imba_queenofpain_scream_of_pain");
                if (scream.GetLevel() >= 1) {
                    scream.OnSpellStart(scream_damage_pct);
                }
            }
            if (caster.HasTalent("special_bonus_imba_queenofpain_5") && !caster.HasModifier("modifier_imba_queenofpain_blink_decision_time")) {
                this.EndCooldown();
                caster.AddNewModifier(caster, this, "modifier_imba_queenofpain_blink_decision_time", {
                    duration: caster.GetTalentValue("special_bonus_imba_queenofpain_5")
                });
            }
        }
    }
    GetManaCost(level: number): number {
        if (this.GetCasterPlus().HasModifier("modifier_imba_queenofpain_blink_decision_time")) {
            return this.GetSpecialValueFor("mana_cost") * 2;
        } else {
            return super.GetManaCost(level);
        }
    }
}
@registerModifier()
export class modifier_imba_queenofpain_blink_decision_time extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.GetAbilityPlus().IsCooldownReady()) {
                this.GetAbilityPlus().StartCooldown(this.GetAbilityPlus().GetCooldown(this.GetAbilityPlus().GetLevel()) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_queenofpain_5"));
            }
        }
    }
}
@registerAbility()
export class imba_queenofpain_scream_of_pain extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(scream_damage_pct?: number, source_unit?: IBaseNpc_Plus, is_talent?: number  /** , source_unit */  /** , is_talent */): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let scream_source;
            if (source_unit) {
                scream_source = source_unit;
                scream_source.EmitSound("Imba.QueenOfPainSecondaryScreamOfPain");
            } else {
                scream_source = caster;
                scream_source.EmitSound("Hero_QueenOfPain.ScreamOfPain");
            }
            if (!is_talent) {
                is_talent = 0;
            }
            let scream_loc = scream_source.GetAbsOrigin();
            let damage = this.GetSpecialValueFor("damage");
            if (scream_damage_pct) {
                damage = damage * (scream_damage_pct / 100);
            }
            let pain_duration = this.GetSpecialValueFor("pain_duration");
            let projectile_speed = this.GetSpecialValueFor("projectile_speed");
            let radius = this.GetSpecialValueFor("radius");
            let pain_reflect_pct = this.GetSpecialValueFor("pain_reflect_pct");
            let scream_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_queenofpain/queen_scream_of_pain_owner.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, scream_source);
            ParticleManager.SetParticleControl(scream_pfx, 0, scream_loc);
            ParticleManager.ReleaseParticleIndex(scream_pfx);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), scream_loc, undefined, radius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != scream_source) {
                    let projectile = {
                        Target: enemy,
                        Source: scream_source,
                        Ability: this,
                        EffectName: "particles/units/heroes/hero_queenofpain/queen_scream_of_pain.vpcf",
                        iMoveSpeed: projectile_speed,
                        vSourceLoc: scream_loc,
                        bDrawsOnMinimap: false,
                        bDodgeable: true,
                        bIsAttack: false,
                        bVisibleToEnemies: true,
                        bReplaceExisting: false,
                        flExpireTime: GameRules.GetGameTime() + 20,
                        bProvidesVision: false,
                        iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                        ExtraData: {
                            damage: damage,
                            pain_duration: pain_duration,
                            pain_reflect_pct: pain_reflect_pct,
                            is_talent: is_talent
                        }
                    }
                    ProjectileManager.CreateTrackingProjectile(projectile);
                }
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (IsServer()) {
            if (target) {
                let caster = this.GetCasterPlus();
                ApplyDamage({
                    victim: target,
                    attacker: caster,
                    ability: this,
                    damage: ExtraData.damage,
                    damage_type: this.GetAbilityDamageType()
                });
                target.AddNewModifier(caster, this, "modifier_imba_scream_of_pain_reflect", {
                    duration: ExtraData.pain_duration * (1 - target.GetStatusResistance()),
                    pain_reflect_pct: ExtraData.pain_reflect_pct,
                    damage_threshold: ExtraData.damage
                });
                if (target.IsAlive() == false) {
                    if ((math.random(1, 100) <= 15) && (caster.GetUnitName().includes("queenofpain"))) {
                        caster.EmitSound("queenofpain_pain_ability_screamofpain_0" + math.random(1, 4));
                    }
                }
                if (caster.HasTalent("special_bonus_imba_queenofpain_7")) {
                    target.AddNewModifier(caster, this, "modifier_imba_sonic_wave_daze", {
                        stacks: caster.GetTalentValue("special_bonus_imba_queenofpain_7") * (1 - target.GetStatusResistance())
                    });
                }
                if (caster.HasTalent("special_bonus_imba_queenofpain_8") && caster.HasAbility("imba_queenofpain_shadow_strike") && ExtraData.is_talent == 0) {
                    let shadow_strike_ability = caster.findAbliityPlus<imba_queenofpain_shadow_strike>("imba_queenofpain_shadow_strike");
                    if (shadow_strike_ability.GetLevel() > 0) {
                        let init_damage = shadow_strike_ability.GetSpecialValueFor("damage");
                        let duration = shadow_strike_ability.GetSpecialValueFor("duration");
                        let sec_damage_total = shadow_strike_ability.GetSpecialValueFor("sec_damage_total");
                        let damage_interval = shadow_strike_ability.GetSpecialValueFor("damage_interval");
                        let damage_over_time = sec_damage_total / math.floor(duration / damage_interval);
                        ApplyDamage({
                            victim: target,
                            attacker: caster,
                            ability: shadow_strike_ability,
                            damage: init_damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                        });
                        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE, target, init_damage, undefined);
                        target.AddNewModifier(caster, shadow_strike_ability, "modifier_imba_shadow_strike_debuff", {
                            duration: duration,
                            damage_per_interval: damage_over_time,
                            damage_interval: damage_interval
                        });
                    }
                }
                if (this.GetCasterPlus().HasTalent("special_bonus_imba_queen_of_pain_scream_of_pain_fear") && ExtraData.damage == this.GetSpecialValueFor("damage")) {
                    target.AddNewModifier(this.GetCasterPlus(), this, "modifier_queenofpain_scream_of_pain_fear", {
                        duration: this.GetCasterPlus().GetTalentValue("special_bonus_imba_queen_of_pain_scream_of_pain_fear") * (1 - target.GetStatusResistance())
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_scream_of_pain_reflect extends BaseModifier_Plus {
    public damage_threshold: number;
    public pain_reflect_pct: number;
    public damage_counter: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            this.damage_threshold = params.damage_threshold;
            this.pain_reflect_pct = params.pain_reflect_pct;
            this.damage_counter = 0;
        }
    }
    BeRefresh(params: any): void {
        if (IsServer()) {
            this.OnCreated(params);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            if (params.attacker == parent) {
                let damage = params.damage;
                if ((this.damage_counter + damage) > this.damage_threshold) {
                    damage = this.damage_threshold - this.damage_counter;
                    this.Destroy();
                } else {
                    this.damage_counter = this.damage_counter + damage;
                }
                ApplyDamage({
                    victim: parent,
                    attacker: caster,
                    ability: ability,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS
                });
            }
        }
    }
}
@registerAbility()
export class imba_queenofpain_sonic_wave extends BaseAbility_Plus {
    public meme_index: any;
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_sonic_wave";
    }
    OnAbilityPhaseStart(): boolean {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_QueenOfPain.SonicWave.Precast");
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().StopSound("Hero_QueenOfPain.SonicWave.Precast");
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target_loc = this.GetCursorPosition();
            let caster_loc = caster.GetAbsOrigin();
            let damage = this.GetSpecialValueFor("damage");
            let start_radius = this.GetSpecialValueFor("start_radius");
            let end_radius = this.GetSpecialValueFor("end_radius");
            let travel_distance = this.GetSpecialValueFor("travel_distance") + GPropertyCalculate.GetCastRangeBonus(caster);
            let projectile_speed = this.GetSpecialValueFor("projectile_speed");
            let direction;
            if (target_loc == caster_loc) {
                direction = caster.GetForwardVector();
            } else {
                direction = (target_loc - caster_loc as Vector).Normalized();
            }
            travel_distance = travel_distance + GPropertyCalculate.GetCastRangeBonus(caster);
            if (caster.HasScepter()) {
                damage = this.GetSpecialValueFor("damage_scepter");
            }
            if (GameServiceConfig.USE_MEME_SOUNDS && RollPercentage(20)) {
                if (!this.meme_index) {
                    this.meme_index = 1;
                }
                caster.EmitSound("Imba.QueenOfPain.AHHHHH" + this.meme_index);
                if (this.meme_index == 5) {
                    this.meme_index = 1;
                } else {
                    this.meme_index = this.meme_index + 1;
                }
            } else {
                caster.EmitSound("Hero_QueenOfPain.SonicWave");
            }
            let projectiles = 1;
            if (caster.HasTalent("special_bonus_imba_queenofpain_2")) {
                projectiles = caster.GetTalentValue("special_bonus_imba_queenofpain_2");
                damage = damage / projectiles;
            }
            let projectile: CreateLinearProjectileOptions = {
                Ability: this,
                EffectName: "particles/units/heroes/hero_queenofpain/queen_sonic_wave.vpcf",
                vSpawnOrigin: caster_loc,
                fDistance: travel_distance,
                fStartRadius: start_radius,
                fEndRadius: end_radius,
                Source: caster,
                bHasFrontalCone: true,
                // bReplaceExisting: false,
                iUnitTargetTeam: this.GetAbilityTargetTeam(),
                iUnitTargetFlags: this.GetAbilityTargetFlags(),
                iUnitTargetType: this.GetAbilityTargetType(),
                fExpireTime: GameRules.GetGameTime() + 10.0,
                // bDeleteOnHit: true,
                vVelocity: Vector(direction.x, direction.y, 0) * projectile_speed as Vector,
                bProvidesVision: false,
                ExtraData: {
                    damage: damage,
                    x: caster_loc.x,
                    y: caster_loc.y,
                    z: caster_loc.z
                }
            }
            ProjectileManager.CreateLinearProjectile(projectile);
            if (projectiles > 1) {
                projectile.EffectName = "";
                projectiles = projectiles - 1;
                this.AddTimer(0.06, () => {
                    ProjectileManager.CreateLinearProjectile(projectile);
                    projectiles = projectiles - 1;
                    if (projectiles > 0) {
                        return 0.06;
                    }
                });
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (target) {
            ApplyDamage({
                attacker: this.GetCasterPlus(),
                victim: target,
                ability: this,
                damage: ExtraData.damage,
                damage_type: this.GetAbilityDamageType()
            });
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_motion_controller", {
                distance: this.GetSpecialValueFor("knockback_distance"),
                direction_x: location.x - ExtraData.x,
                direction_y: location.y - ExtraData.y,
                direction_z: location.z - ExtraData.z,
                duration: this.GetSpecialValueFor("knockback_duration") * (1 - target.GetStatusResistance()),
                bGroundStop: false,
                bDecelerate: false,
                bInterruptible: false,
                bIgnoreTenacity: false,
                bDestroyTreesAlongPath: true
            });
            if (this.GetCasterPlus().HasScepter()) {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_sonic_wave_daze", {
                    stacks: this.GetSpecialValueFor("orders_scepter")
                });
            }
            if (target.IsAlive() == false) {
                if ((math.random(1, 100) <= 15) && (this.GetCasterPlus().GetUnitName().includes("queenofpain"))) {
                    this.GetCasterPlus().EmitSound("queenofpain_pain_ability_sonicwave_0" + math.random(1, 4));
                }
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_queenofpain_8") && this.GetCasterPlus().HasAbility("imba_queenofpain_shadow_strike")) {
                let shadow_strike_ability = this.GetCasterPlus().findAbliityPlus<imba_queenofpain_shadow_strike>("imba_queenofpain_shadow_strike");
                if (shadow_strike_ability.GetLevel() > 0) {
                    let init_damage = shadow_strike_ability.GetSpecialValueFor("damage");
                    let duration = shadow_strike_ability.GetSpecialValueFor("duration");
                    let sec_damage_total = shadow_strike_ability.GetSpecialValueFor("sec_damage_total");
                    let damage_interval = shadow_strike_ability.GetSpecialValueFor("damage_interval");
                    let damage_over_time = sec_damage_total / math.floor(duration / damage_interval);
                    ApplyDamage({
                        victim: target,
                        attacker: this.GetCasterPlus(),
                        ability: shadow_strike_ability,
                        damage: init_damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                    });
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE, target, init_damage, undefined);
                    target.AddNewModifier(this.GetCasterPlus(), shadow_strike_ability, "modifier_imba_shadow_strike_debuff", {
                        duration: duration,
                        damage_per_interval: damage_over_time,
                        damage_interval: damage_interval
                    });
                }
            }
        }
    }
    GetCooldown(nLevel: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("cooldown_scepter");
        }
        return super.GetCooldown(nLevel);
    }
}
@registerModifier()
export class modifier_imba_sonic_wave extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuns);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            if (params.attacker == parent && params.inflictor) {
                if (params.inflictor == ability) {
                    let lifesteal_amount = ability.GetSpecialValueFor("absorb_pct");
                    let lifesteal_pfx = ResHelper.CreateParticleEx("particles/hero/queenofpain/lifesteal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
                    ParticleManager.SetParticleControl(lifesteal_pfx, 0, params.unit.GetAbsOrigin());
                    ParticleManager.SetParticleControlEnt(lifesteal_pfx, 1, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControl(lifesteal_pfx, 2, params.unit.GetAbsOrigin());
                    ParticleManager.SetParticleControl(lifesteal_pfx, 3, Vector((GFuncVector.CalculateDistance(params.unit, parent) / 100), 0, 0));
                    ParticleManager.ReleaseParticleIndex(lifesteal_pfx);
                    let self_lifesteal_pfx = ResHelper.CreateParticleEx("particles/hero/queenofpain/self_lifesteal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
                    ParticleManager.SetParticleControlEnt(self_lifesteal_pfx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
                    if (params.unit.IsRealUnit()) {
                        parent.ApplyHeal(params.damage * lifesteal_amount * 0.01, ability);
                    } else {
                        parent.ApplyHeal(params.damage * lifesteal_amount * 0.005, ability);
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_sonic_wave_daze extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            this.SetStackCount(params.stacks);
        }
    }
    BeRefresh(params: any): void {
        if (IsServer()) {
            this.OnCreated(params);
        }
    }
    GetEffectName(): string {
        return "particles/hero/queenofpain/sonic_wave_daze.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_queenofpain_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_queenofpain_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_queenofpain_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_queen_of_pain_scream_of_pain_fear extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_queenofpain_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_queen_of_pain_shadow_strike_aoe extends BaseModifier_Plus {
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
