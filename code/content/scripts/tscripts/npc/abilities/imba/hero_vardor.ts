
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerModifier()
export class modifier_vardor_yari_unit extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public mind_bleed_modifier: any;
    public mental_ability_name: any;
    public is_charge_yari: any;
    public mind_bleed_stacks: number;
    public radius: number;
    public mental_ability: any;
    public duration: number;
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus() || !this.GetCasterPlus()) {
                this.GetParentPlus().ForceKill(false);
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.mind_bleed_modifier = "modifier_vardor_mental_thrusts_debuff";
        this.mental_ability_name = "vardor_mental_thrusts";
        if (!IsServer()) {
            return;
        }
        this.is_charge_yari = params.is_charge_yari;
        if (this.caster.HasTalent("special_bonus_imba_vardor_ground_yaris_mind_bleed")) {
            this.mind_bleed_stacks = this.caster.GetTalentValue("special_bonus_imba_vardor_ground_yaris_mind_bleed");
            this.radius = this.caster.GetTalentValue("special_bonus_imba_vardor_ground_yaris_mind_bleed", "radius");
            if (this.caster.HasAbility(this.mental_ability_name)) {
                this.mental_ability = this.caster.FindAbilityByName(this.mental_ability_name);
                if (this.mental_ability) {
                    this.duration = this.mental_ability.GetSpecialValueFor("duration");
                    this.StartIntervalThink(this.caster.GetTalentValue("special_bonus_imba_vardor_ground_yaris_mind_bleed", "interval"));
                }
            }
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!enemy.HasModifier(this.mind_bleed_modifier)) {
                enemy.AddNewModifier(this.caster, this.mental_ability, this.mind_bleed_modifier, {
                    duration: this.duration
                });
            }
            let modifier = enemy.FindModifierByName(this.mind_bleed_modifier);
            if (modifier) {
                for (let i = 0; i < this.mind_bleed_stacks; i++) {
                    modifier.IncrementStackCount();
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA)
    CC_GetVisualZDelta(): number {
        return 100;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP_FOR_ENEMIES]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        };
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.is_charge_yari == 0) {
            return;
        }
        let modifier = this.caster.findBuff<modifier_vardor_piercing_shot_charges>("modifier_vardor_piercing_shot_charges");
        if (modifier) {
            modifier.IncrementStackCount();
        }
    }
}
@registerAbility()
export class vardor_piercing_shot extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_vardor_piercing_shot_charges";
    }
    GetCooldown(level: number): number {
        return 0;
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_charges = "modifier_vardor_piercing_shot_charges";
        if (ability.GetLevel() == 1) {
            return;
        }
        let previous_yari_count = ability.GetLevelSpecialValueFor("initial_yari_count", ability.GetLevel() - 2);
        let current_yari_count = ability.GetSpecialValueFor("initial_yari_count");
        if (current_yari_count > previous_yari_count) {
            let new_yaris = current_yari_count - previous_yari_count;
            let modifier = caster.FindModifierByName(modifier_charges);
            if (modifier) {
                modifier.SetStackCount(modifier.GetStackCount() + new_yaris);
            }
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = ability.GetCursorTarget();
        let modifier_charges = "modifier_vardor_piercing_shot_charges";
        if (target) {
            this.PierceTargetUnit(target);
        } else {
            this.PierceTargetLocation(this.GetCursorPosition(), true);
        }
        let modifier = caster.FindModifierByName(modifier_charges);
        if (modifier) {
            modifier.DecrementStackCount();
        }
    }
    PierceTargetUnit(target: IBaseNpc_Plus) {
        let caster = this.GetCasterPlus();
        let ability = this;
        let hit_radius = ability.GetSpecialValueFor("hit_radius");
        let projectile_speed = ability.GetSpecialValueFor("projectile_speed");
        let vision_radius = ability.GetSpecialValueFor("vision_radius");
        let cast_range = this.GetCastRange(caster.GetAbsOrigin(), target) + this.GetCasterPlus().GetCastRangeBonus();
        let direction = (target.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Normalized();
        let particleName = "particles/hero/vardor/vardor_piercing_shot_linear.vpcf";
        let spear_projectile = {
            Ability: ability,
            EffectName: particleName,
            vSpawnOrigin: caster.GetAbsOrigin(),
            fDistance: cast_range,
            fStartRadius: hit_radius,
            fEndRadius: hit_radius,
            Source: caster,
            bHasFrontalCone: false,
            bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            bDeleteOnHit: true,
            vVelocity: direction * projectile_speed * Vector(1, 1, 0) as Vector,
            fExpireTime: GameRules.GetGameTime() + 5,
            bProvidesVision: true,
            iVisionRadius: vision_radius,
            iVisionTeamNumber: caster.GetTeamNumber()
        }
        ProjectileManager.CreateLinearProjectile(spear_projectile);
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_target = "modifier_vardor_piercing_shot_target_debuff";
        let modifier_charges = "modifier_vardor_piercing_shot_charges";
        let direct_damage = ability.GetSpecialValueFor("direct_damage");
        let spear_duration = ability.GetSpecialValueFor("spear_duration");
        if (target) {
            EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), "Hero_EarthSpirit.StoneRemnant.Impact", caster);
            if (!target.HasModifier(modifier_target)) {
                let modifier = target.AddNewModifier(caster, ability, modifier_target, {
                    duration: spear_duration
                });
                if (modifier) {
                    modifier.IncrementStackCount();
                }
            } else {
                let modifier = target.FindModifierByName(modifier_target);
                if (modifier) {
                    modifier.IncrementStackCount();
                    modifier.ForceRefresh();
                }
            }
            let damageTable = {
                victim: target,
                attacker: caster,
                damage: direct_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this
            }
            ApplyDamage(damageTable);
            return true;
        } else {
            location = GetGroundPosition(location, undefined);
            this.PierceTargetLocation(location, true);
            return true;
        }
    }
    PierceTargetLocation(target_point: Vector, is_charge_yari = false) {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_yari_properties = "modifier_vardor_yari_unit";
        let modifier_root_aura = "modifier_vardor_piercing_shot_root_aura";
        let damage_ground = ability.GetSpecialValueFor("damage_ground");
        let radius = ability.GetSpecialValueFor("radius");
        let root_duration = ability.GetSpecialValueFor("root_duration");
        let spawn_delay = ability.GetSpecialValueFor("spawn_delay");
        let spear_duration = ability.GetSpecialValueFor("spear_duration");
        let dummy = caster.CreateSummon("npc_imba_vardor_spear_dummy", target_point, spear_duration, false);
        dummy.AddNewModifier(caster, ability, modifier_yari_properties, {
            is_charge_yari: is_charge_yari
        });
        dummy.SetModelScale(0);
        let particle = ResHelper.CreateParticleEx("particles/hero/vardor/vardor_piercing_shot_ground.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, dummy);
        ParticleManager.SetParticleControl(particle, 0, target_point);
        ParticleManager.SetParticleControl(particle, 2, Vector(radius, 0, 0));
        ParticleManager.SetParticleControl(particle, 3, Vector(spear_duration, 0, 0));
        ParticleManager.ReleaseParticleIndex(particle);
        this.AddTimer(spawn_delay, () => {
            if (IsServer()) {
                EmitSoundOnLocationWithCaster(target_point, "Hero_EarthSpirit.StoneRemnant.Impact", caster);
                dummy.AddNewModifier(caster, ability, modifier_root_aura, {
                    duration: root_duration
                });
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    let damageTable = {
                        victim: enemy,
                        attacker: caster,
                        damage: damage_ground,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        ability: ability
                    }
                    ApplyDamage(damageTable);
                }
            }
        });
    }
}
@registerModifier()
export class modifier_vardor_piercing_shot_charges extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public initial_yari_count: number;
    public yariHolder: IBaseNpc_Plus;
    public yariManager: modifier_vardor_yari_dummy;
    IsHidden(): boolean {
        return false;
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
    IsPurgeException(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.initial_yari_count = this.ability.GetSpecialValueFor("initial_yari_count");
            let yariHolder = BaseNpc_Plus.CreateUnitByName("npc_spearholder_unit", this.caster.GetAbsOrigin(), this.caster, false);
            yariHolder.SetAbsOrigin(this.caster.GetAbsOrigin());
            yariHolder.AddNewModifier(this.caster, this.ability, "modifier_vardor_yari_dummy", {
                EntIndex: this.caster.entindex(),
                Count: this.initial_yari_count
            });
            this.yariHolder = yariHolder;
            this.yariHolder.SetModelScale(0.7);
            this.yariManager = this.yariHolder.findBuff<modifier_vardor_yari_dummy>("modifier_vardor_yari_dummy");
            this.SetStackCount(this.initial_yari_count);
            this.StartIntervalThink(10);
        }
    }
    OnIntervalThink(): void {
        let expected_charges = this.ability.GetSpecialValueFor("initial_yari_count");
        let yaris = 0;
        let units = this.caster.FindChildByName("npc_imba_vardor_spear_dummy");
        for (const [_, unit] of GameFunc.iPair(units)) {
            let modifier = unit.findBuff<modifier_vardor_yari_unit>("modifier_vardor_yari_unit");
            if (modifier.is_charge_yari == 1) {
                yaris = yaris + 1;
            }
        }
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (enemy.HasModifier("modifier_vardor_piercing_shot_target_debuff")) {
                let modifier_debuff = enemy.findBuff<modifier_vardor_piercing_shot_target_debuff>("modifier_vardor_piercing_shot_target_debuff");
                if (modifier_debuff) {
                    yaris = yaris + modifier_debuff.GetStackCount();
                }
            }
        }
        let stacks = this.GetStackCount();
        let found_yaris = yaris + stacks;
        if (found_yaris != expected_charges) {
            this.SetStackCount(expected_charges);
        }
    }
    OnStackCountChanged(previous_stacks: number): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() <= 0) {
            this.ability.SetActivated(false);
        } else if (!this.ability.IsActivated()) {
            this.ability.SetActivated(true);
        }
        let caster = this.GetCasterPlus();
        let casterLoc = caster.GetAbsOrigin();
        if (caster.TempData().weaponParticle) {
            ParticleManager.DestroyParticle(caster.TempData().weaponParticle, true);
            delete caster.TempData().weaponParticle;
        }
        if (this.GetStackCount() == 0) {
            let tempParticle = ResHelper.CreateParticleEx("particles/hero/vardor/vardor_yari_weak.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, caster);
            ParticleManager.SetParticleControlEnt(tempParticle, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon", casterLoc, true);
            ParticleManager.SetParticleControlEnt(tempParticle, 2, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_spear_end", casterLoc, true);
            caster.TempData().weaponParticle = tempParticle;
        } else if (this.GetStackCount() > 0) {
            let ret = 1;
            if (caster.TempData().oppressReturn) {
                if (caster.TempData().oppressReturn == true) {
                    ret = 0;
                }
            }
            if (previous_stacks > 0) {
                ret = 0;
            }
            let tempParticle = ResHelper.CreateParticleEx("particles/hero/vardor/vardor_yari_normal.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, caster);
            ParticleManager.SetParticleControl(tempParticle, 10, Vector(ret, 0, 0));
            ParticleManager.SetParticleControlEnt(tempParticle, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon", casterLoc, true);
            ParticleManager.SetParticleControlEnt(tempParticle, 2, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_spear_end", casterLoc, true);
            caster.TempData().weaponParticle = tempParticle;
        }
        if (this.yariManager) {
            this.yariManager.ChangeCount(this.GetStackCount());
        }
    }
}
@registerModifier()
export class modifier_vardor_yari_dummy extends BaseModifier_Plus {
    public target: IBaseNpc_Plus;
    public particles: ParticleID[];
    public currentCount: any;
    public lastCount: any;
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
        return state;
    }
    BeCreated(event: any): void {
        if (IsServer()) {
            this.target = EntIndexToHScript(event.EntIndex) as IBaseNpc_Plus;
            this.StartIntervalThink(0.05);
            this.particles = []
            this.ChangeCount(event.Count);
            this.currentCount = event.Count;
            if (!this.currentCount) {
                this.currentCount = 0;
            }
            this.lastCount = this.currentCount;
        }
    }
    ChangeCount(newCount: number, reapply = false) {
        let parent = this.GetParentPlus();
        let attachment = this.target.ScriptLookupAttachment("attach_hitloc");
        let targetLoc = this.target.GetAttachmentOrigin(attachment);
        let targetVec = this.target.GetForwardVector();
        parent.SetAbsOrigin(targetLoc);
        parent.SetForwardVector(targetVec);
        let ret = 1;
        if (this.target.TempData().oppressReturn) {
            if (this.target.TempData().oppressReturn == true) {
                ret = 0;
            }
        }
        let startIndex = 2;
        if (!this.currentCount) {
            this.currentCount = 0;
        }
        if (!newCount) {
            newCount = 0;
        }
        if (reapply) {
            for (const particle of (this.particles)) {
                ParticleManager.DestroyParticle(particle, true);
            }
            this.particles = []
        } else {
            if (newCount == this.currentCount) {
                return;
            } else if (newCount > this.currentCount) {
                startIndex = this.currentCount + 1;
                if (startIndex < 2) {
                    this.currentCount = newCount;
                    return;
                }
            } else {
                for (let i = newCount + 1; i <= 10; i++) {
                    if (this.particles[i]) {
                        ParticleManager.DestroyParticle(this.particles[i], true);
                    }
                }
                this.currentCount = newCount;
                return;
            }
        }
        for (let i = startIndex; i <= newCount; i++) {
            let particleIndex = tostring(i - 1);
            let tempParticle = ResHelper.CreateParticleEx("particles/hero/vardor/vardor_yari_belt_smoother.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, parent);
            ParticleManager.SetParticleControl(tempParticle, 10, Vector(ret, 0, 0));
            ParticleManager.SetParticleControlEnt(tempParticle, 6, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "spear_pos_" + particleIndex + "_end", parent.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(tempParticle, 7, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "spear_pos_" + particleIndex, parent.GetAbsOrigin(), true);
            this.particles[i] = tempParticle;
        }
        this.currentCount = newCount;
    }
    Hide(refresh = false) {
        for (const [_, particle] of GameFunc.iPair(this.particles)) {
            ParticleManager.DestroyParticle(particle, true);
        }
        this.particles = []
        this.lastCount = this.currentCount;
        this.currentCount = 0;
        if (refresh) {
            this.EndHide();
        }
    }
    EndHide(stackCount = 0) {
        this.AddTimer(0.05, () => {
            if (!stackCount) {
                stackCount = this.lastCount || this.currentCount;
            }
            this.ChangeCount(stackCount, true);
        });
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.target) {
                let attachment = this.target.ScriptLookupAttachment("attach_hitloc");
                let targetLoc = this.target.GetAttachmentOrigin(attachment);
                let targetVec = this.target.GetForwardVector();
                let oldLoc = this.GetParentPlus().GetAbsOrigin();
                let distance = (oldLoc - targetLoc as Vector).Length2D();
                if (distance > 600) {
                    this.Hide(true);
                }
                this.GetParentPlus().SetAbsOrigin(targetLoc);
                this.GetParentPlus().SetForwardVector(targetVec);
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            for (const [_, particle] of GameFunc.iPair(this.particles)) {
                ParticleManager.DestroyParticle(particle, true);
            }
        }
    }
}
@registerModifier()
export class modifier_vardor_piercing_shot_target_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_mind_bleed: any;
    public think_interval: number;
    public slow_pct: number;
    public mind_bleed_stacks: number;
    public damage_over_time_target: number;
    public damage_per_tick: number;
    public debuffParticle: any;
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
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.modifier_mind_bleed = "modifier_vardor_mental_thrusts_debuff";
        this.think_interval = this.ability.GetSpecialValueFor("think_interval");
        this.slow_pct = this.ability.GetSpecialValueFor("slow_pct");
        this.mind_bleed_stacks = this.ability.GetSpecialValueFor("mind_bleed_stacks");
        this.damage_over_time_target = this.ability.GetSpecialValueFor("damage_over_time_target");
        this.damage_per_tick = this.damage_over_time_target * this.think_interval;
        if (IsServer()) {
            let particleName = "particles/hero/vardor/vardor_piercing_shot_debuff.vpcf";
            if (this.parent.IsRealUnit()) {
                particleName = "particles/hero/vardor/vardor_piercing_shot_debuff_hero.vpcf";
            }
            this.debuffParticle = ResHelper.CreateParticleEx(particleName, ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.parent);
            ParticleManager.SetParticleControlEnt(this.debuffParticle, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.debuffParticle, 2, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.debuffParticle, 3, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            this.StartIntervalThink(this.think_interval);
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetStackCount();
        let damageTable = {
            victim: this.parent,
            attacker: this.caster,
            damage: this.damage_per_tick * stacks,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this.ability
        }
        ApplyDamage(damageTable);
        if (this.caster.HasAbility("vardor_mental_thrusts")) {
            let ability_thrust = this.caster.findAbliityPlus<vardor_mental_thrusts>("vardor_mental_thrusts");
            if (ability_thrust) {
                if (ability_thrust.GetLevel() > 0) {
                    let duration = ability_thrust.GetSpecialValueFor("duration");
                    if (!this.parent.HasModifier(this.modifier_mind_bleed)) {
                        this.parent.AddNewModifier(this.caster, ability_thrust, this.modifier_mind_bleed, {
                            duration: duration
                        });
                    }
                    let modifier = this.parent.FindModifierByName(this.modifier_mind_bleed);
                    if (modifier) {
                        let stacks_to_add = this.mind_bleed_stacks * stacks;
                        for (let i = 0; i < stacks_to_add; i++) {
                            modifier.IncrementStackCount();
                        }
                    }
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow_pct * this.GetStackCount() * (-1);
    }
    BeDestroy(): void {
        if (IsServer()) {
            let stacks = this.GetStackCount();
            if (this.caster.HasModifier("modifier_vardor_piercing_shot_charges")) {
                let modifier = this.caster.findBuff<modifier_vardor_piercing_shot_charges>("modifier_vardor_piercing_shot_charges");
                if (modifier) {
                    modifier.SetStackCount(modifier.GetStackCount() + stacks);
                }
            }
            ParticleManager.DestroyParticle(this.debuffParticle, false);
            ParticleManager.ReleaseParticleIndex(this.debuffParticle);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.damage_per_tick * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    CC_OnTooltip2(): number {
        return this.mind_bleed_stacks * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_vardor_piercing_shot_root_aura extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public radius: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
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
        this.ability = this.GetAbilityPlus();
        this.radius = this.ability.GetSpecialValueFor("radius");
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraDuration(): number {
        return 0.5;
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
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_vardor_piercing_shot_root_debuff";
    }
}
@registerModifier()
export class modifier_vardor_piercing_shot_root_debuff extends BaseModifier_Plus {
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
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        };
    }
    GetEffectName(): string {
        return "particles/hero/vardor/vardor_piercing_shot_root.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class vardor_graceful_jump extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_generic_charges";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("yari_search_radius");
    }
    CastFilterResultLocation(location: Vector): UnitFilterResult {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let cast_range = this.GetCastRange(location, null);
        let yari_search_radius = this.GetSpecialValueFor("yari_search_radius");
        yari_search_radius = yari_search_radius + cast_range;
        let units = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, yari_search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_CLOSEST, false);

        for (const [_, unit] of GameFunc.iPair(units)) {
            if (unit.GetUnitName() == "npc_imba_vardor_spear_dummy") {
                return UnitFilterResult.UF_SUCCESS;
            }
        }
        return UnitFilterResult.UF_FAIL_CUSTOM;
    }
    GetCustomCastErrorLocation(p_0: Vector,): string {
        return "#dota_hud_error_vardor_no_yaris_in_range";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let modifier_ball = "modifier_vardor_graceful_jump";
        let cast_range = this.GetCastRange(this.GetCursorPosition(), target);
        let yari_search_radius = ability.GetSpecialValueFor("yari_search_radius");
        let jump_speed = ability.GetSpecialValueFor("jump_speed");
        if (!target) {
            yari_search_radius = yari_search_radius + cast_range;
            let units = FindUnitsInRadius(caster.GetTeamNumber(), this.GetCursorPosition(), undefined, yari_search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_CLOSEST, false);
            for (const [_, unit] of GameFunc.iPair(units)) {
                if (unit.GetUnitName() == "npc_imba_vardor_spear_dummy") {
                    target = unit;
                    return;
                }
            }
        }
        if (!target) {
            print("NO YARI I TOLD YOU WTF IS WRONG WITH YOU");
            this.EndCooldown();
            this.RefundManaCost();
            if (this.GetCasterPlus().HasModifier("modifier_generic_charges")) {
                for (const [_, mod] of GameFunc.iPair(this.GetCasterPlus().FindAllModifiersByName("modifier_generic_charges"))) {
                    if (mod.GetAbilityPlus().GetAbilityName() == this.GetAbilityName()) {
                        mod.SetStackCount(mod.GetStackCount() + 1);
                        return;
                    }
                }
            }
            GNotificationSystem.ErrorMessage("#dota_hud_error_vardor_no_yaris_in_range", this.GetCasterPlus().GetPlayerID());
            return;
        }
        EmitSoundOnLocationWithCaster(this.GetCursorPosition(), "Hero_SkywrathMage.ConcussiveShot.Cast", caster);
        caster.AddNewModifier(caster, ability, modifier_ball, {});
        let particleName = "particles/hero/vardor/vardor_graceful_jump_projectile.vpcf";
        let projectileTable = {
            Source: caster,
            Target: target,
            Ability: this,
            EffectName: particleName,
            iMoveSpeed: jump_speed,
            vSourceLoc: caster.GetAbsOrigin(),
            bDrawsOnMinimap: false,
            bDodgeable: true,
            bIsAttack: false,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            bProvidesVision: true,
            iVisionRadius: 400,
            iVisionTeamNumber: caster.GetTeamNumber()
        }
        ProjectileManager.CreateTrackingProjectile(projectileTable);
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_ball = "modifier_vardor_graceful_jump";
        let modifier_charges = "modifier_vardor_piercing_shot_charges";
        let modifier_yari_debuff = "modifier_vardor_piercing_shot_target_debuff";
        let modifier_root = "modifier_vardor_graceful_jump_root";
        let damage = ability.GetSpecialValueFor("damage");
        let damage_radius = ability.GetSpecialValueFor("damage_radius");
        if (caster.HasModifier(modifier_ball)) {
            caster.RemoveModifierByName(modifier_ball);
        }
        EmitSoundOnLocationWithCaster(location, "Hero_SkywrathMage.ConcussiveShot.Target", caster);
        let particle = ResHelper.CreateParticleEx("particles/hero/vardor/vardor_graceful_jump_ground.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(particle, 1, location);
        ParticleManager.ReleaseParticleIndex(particle);
        FindClearSpaceForUnit(caster, location, true);
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, damage_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let damageTable = {
                victim: enemy,
                attacker: caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: ability
            }
            ApplyDamage(damageTable);
            if (caster.HasTalent("special_bonus_imba_vardor_graceful_jump_root")) {
                let root_duration = caster.GetTalentValue("special_bonus_imba_vardor_graceful_jump_root");
                if (root_duration != 0) {
                    enemy.AddNewModifier(caster, ability, modifier_root, {
                        duration: root_duration
                    });
                }
            }
        }
        if (!target) {
            return;
        }
        if (target.GetUnitName() == "npc_imba_vardor_spear_dummy") {
            target.ForceKill(false);
            target.RemoveSelf();
        } else {
            if (target.HasModifier(modifier_yari_debuff) && caster.HasModifier(modifier_charges)) {
                let modifier_debuff = target.FindModifierByName(modifier_yari_debuff);
                let modifier_charges_buff = caster.FindModifierByName(modifier_charges);
                if (modifier_debuff && modifier_charges_buff) {
                    if (modifier_debuff.GetStackCount() > 1) {
                        modifier_debuff.DecrementStackCount();
                        modifier_charges_buff.IncrementStackCount();
                    } else {
                        modifier_debuff.Destroy();
                    }
                }
            }
        }
        let yariModifier = caster.FindModifierByName(modifier_charges) as modifier_vardor_piercing_shot_charges;
        if (yariModifier) {
            caster.TempData().oppressReturn = false;
            if (yariModifier.yariManager) {
                yariModifier.yariManager.EndHide(yariModifier.GetStackCount());
            }
        }
    }
}
@registerModifier()
export class modifier_vardor_graceful_jump extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().AddNoDraw();
        let yariModifier = this.GetParentPlus().findBuff<modifier_vardor_piercing_shot_charges>("modifier_vardor_piercing_shot_charges");
        if (yariModifier) {
            this.GetParentPlus().TempData().oppressReturn = true;
            if (yariModifier.yariManager) {
                yariModifier.yariManager.Hide();
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveNoDraw();
    }
}
@registerModifier()
export class modifier_vardor_graceful_jump_root extends BaseModifier_Plus {
    GetTexture(): string {
        return "vardor/vardor_graceful_jump";
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
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        };
    }
    GetEffectName(): string {
        return "particles/piercing_shot_ground_root.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class vardor_mental_thrusts extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_vardor_mental_thrusts";
    }
}
@registerModifier()
export class modifier_vardor_mental_thrusts extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_debuff: any;
    public duration: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
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
        this.modifier_debuff = "modifier_vardor_mental_thrusts_debuff";
        this.duration = this.ability.GetSpecialValueFor("duration");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        let attacker = keys.attacker;
        let target = keys.target;
        if (attacker == this.caster && attacker.GetTeamNumber() != target.GetTeamNumber()) {
            if (attacker.PassivesDisabled()) {
                return;
            }
            if (attacker.IsIllusion()) {
                return;
            }
            if (target.IsBuilding() || target.IsOther()) {
                return;
            }
            if (target.IsMagicImmune()) {
                return;
            }
            if (!target.HasModifier(this.modifier_debuff)) {
                target.AddNewModifier(this.caster, this.ability, this.modifier_debuff, {
                    duration: this.duration
                });
            }
            let modifier = target.FindModifierByName(this.modifier_debuff);
            if (modifier) {
                modifier.IncrementStackCount();
            }
        }
    }
}
@registerModifier()
export class modifier_vardor_mental_thrusts_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public aspd_rdct_stack: number;
    public cast_point_inc_stack: number;
    public main_att_rdct_stack: number;
    public incoming_dmg_inc_stack: number;
    public duration: number;
    public stack_table: number[];
    public debuff_particle: any;

    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    GetTexture(): string {
        return "vardor/vardor_mental_thrusts";
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
        this.aspd_rdct_stack = this.ability.GetSpecialValueFor("aspd_rdct_stack");
        this.cast_point_inc_stack = this.ability.GetSpecialValueFor("cast_point_inc_stack");
        this.main_att_rdct_stack = this.ability.GetSpecialValueFor("main_att_rdct_stack");
        this.incoming_dmg_inc_stack = this.ability.GetSpecialValueFor("incoming_dmg_inc_stack");
        this.duration = this.ability.GetSpecialValueFor("duration");
        if (this.caster.HasTalent("special_bonus_imba_vardor_mental_thrusts_bonus")) {
            let talent_multiplier = this.caster.GetTalentValue("special_bonus_imba_vardor_mental_thrusts_bonus");
            if (talent_multiplier != 0) {
                this.aspd_rdct_stack = this.aspd_rdct_stack * talent_multiplier;
                this.cast_point_inc_stack = this.cast_point_inc_stack * talent_multiplier;
                this.main_att_rdct_stack = this.main_att_rdct_stack * talent_multiplier;
                this.incoming_dmg_inc_stack = this.incoming_dmg_inc_stack * talent_multiplier;
            }
        }
        this.stack_table = []
        if (IsServer()) {
            this.debuff_particle = ResHelper.CreateParticleEx("particles/hero/vardor/vardor_mind_bleed_debuff.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(this.debuff_particle, 0, this.parent.GetAbsOrigin());
            this.AddParticle(this.debuff_particle, false, false, -1, false, true);
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
        if (this.parent.IsRealUnit()) {
            // this.parent.CalculateStatBonus(true);
        }
    }
    OnIntervalThink(): void {
        let repeat_needed = true;
        while (repeat_needed) {
            let item_time = this.stack_table[0];
            if (GameRules.GetGameTime() - item_time >= this.duration) {
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            6: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            7: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.aspd_rdct_stack * this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE)
    CC_GetModifierPercentageCasttime(p_0: ModifierAbilityEvent,): number {
        return this.cast_point_inc_stack * this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (!this.parent.IsRealUnit()) {
            return;
        }
        if (this.parent.GetPrimaryAttribute() == Attributes.DOTA_ATTRIBUTE_STRENGTH) {
            return this.main_att_rdct_stack * this.GetStackCount() * (-1);
        }
        return 0;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (!this.parent.IsRealUnit()) {
            return;
        }
        if (this.parent.GetPrimaryAttribute() == Attributes.DOTA_ATTRIBUTE_AGILITY) {
            return this.main_att_rdct_stack * this.GetStackCount() * (-1);
        }
        return 0;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (!this.parent.IsRealUnit()) {
            return;
        }
        if (this.parent.GetPrimaryAttribute() == Attributes.DOTA_ATTRIBUTE_INTELLECT) {
            return this.main_att_rdct_stack * this.GetStackCount() * (-1);
        }
        return 0;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.incoming_dmg_inc_stack * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.main_att_rdct_stack * this.GetStackCount() * (-1);
    }
}
@registerAbility()
export class vardor_celestial_rain_of_yari extends BaseAbility_Plus {
    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        if (caster.HasScepter()) {
            return this.GetSpecialValueFor("scepter_aoe_radius");
        }
        return this.GetSpecialValueFor("aoe_radius");
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = ability.GetCursorPosition();
        let piercing_shot_ability_name = "vardor_piercing_shot";
        let initial_yari = ability.GetSpecialValueFor("initial_yari");
        let additional_rings = ability.GetSpecialValueFor("additional_rings");
        let additional_yaris_per_ring = ability.GetSpecialValueFor("additional_yaris_per_ring");
        let ring_distance = ability.GetSpecialValueFor("ring_distance");
        let yari_fall_delay = ability.GetSpecialValueFor("yari_fall_delay");
        let scepter_additional_rings = ability.GetSpecialValueFor("scepter_additional_rings");
        if (caster.HasScepter()) {
            additional_rings = scepter_additional_rings;
        }
        let direction = (target_point - caster.GetAbsOrigin() as Vector).Normalized();
        let piercing_shot_ability: vardor_piercing_shot;
        if (caster.HasAbility(piercing_shot_ability_name)) {
            piercing_shot_ability = caster.FindAbilityByName(piercing_shot_ability_name) as vardor_piercing_shot;
            if (!piercing_shot_ability) {
                return;
            }
        } else {
            return;
        }
        piercing_shot_ability.PierceTargetLocation(target_point, false);
        let yari_count = initial_yari;
        let distance_from_center = 0;
        let new_point = target_point;
        let angle;
        let yari_drop_points: Vector[] = []
        for (let i = 0; i < additional_rings; i++) {
            yari_count = yari_count + additional_yaris_per_ring;
            distance_from_center = distance_from_center + ring_distance;
            for (let j = 1; j <= yari_count; j++) {
                angle = QAngle(0, (j - 1) * (360 / yari_count), 0);
                new_point = target_point + distance_from_center * direction as Vector;
                new_point = RotatePosition(target_point, angle, new_point);
                new_point = GetGroundPosition(new_point, undefined);
                yari_drop_points.push(new_point);
            }
        }
        this.AddTimer(yari_fall_delay, () => {
            let point = yari_drop_points.shift();
            piercing_shot_ability.PierceTargetLocation(point, false);
            if (next(yari_drop_points) != undefined) {
                return yari_fall_delay;
            }
            return;
        });
    }
}
@registerModifier()
export class modifier_special_bonus_imba_vardor_bonus_yari extends BaseModifier_Plus {
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
        let caster = this.GetCasterPlus();
        let charges_modifier_name = "modifier_vardor_piercing_shot_charges";
        if (caster.HasModifier(charges_modifier_name)) {
            let modifier = caster.FindModifierByName(charges_modifier_name);
            if (modifier) {
                modifier.IncrementStackCount();
            }
        } else {
            this.StartIntervalThink(5);
        }
    }
    OnIntervalThink(): void {
        let charges_modifier_name = "modifier_vardor_piercing_shot_charges";
        let caster = this.GetCasterPlus();
        if (caster.HasModifier(charges_modifier_name)) {
            let modifier = caster.FindModifierByName(charges_modifier_name);
            if (modifier) {
                modifier.IncrementStackCount();
            }
            this.StartIntervalThink(-1);
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_vardor_ground_yaris_mind_bleed extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_vardor_graceful_jump_root extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_vardor_mental_thrusts_bonus extends BaseModifier_Plus {
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
