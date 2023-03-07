
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function IsSpiderling(unit: IBaseNpc_Plus) {
    if (unit.GetUnitName() == "npc_dota_broodmother_spiderking" || unit.GetUnitName() == "npc_dota_broodmother_spiderling") {
        return true;
    } else {
        return false;
    }
}

@registerAbility()
export class imba_broodmother_spawn_spiderlings extends BaseAbility_Plus {
    GetAssociatedPrimaryAbilities(): string {
        return "imba_broodmother_spawn_spiderking";
    }
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let ability_spiderking_name = "imba_broodmother_spawn_spiderking";
        let ability_spiderking = caster.FindAbilityByName(ability_spiderking_name);
        if (ability_spiderking) {
            ability_spiderking.SetLevel(ability.GetLevel());
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_broodmother_spawn_spiderlings_avenger";
    }
    OnSpellStart(): void {
        let info = {
            Source: this.GetCasterPlus(),
            Target: this.GetCursorTarget(),
            Ability: this,
            bDodgeable: true,
            EffectName: "particles/units/heroes/hero_broodmother/broodmother_web_cast.vpcf",
            iMoveSpeed: this.GetSpecialValueFor("projectile_speed")
        }
        ProjectileManager.CreateTrackingProjectile(info);
        this.GetCasterPlus().EmitSound("Hero_Broodmother.SpawnSpiderlingsCast");
    }
    OnProjectileHit(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector): boolean | void {
        if (!hTarget) {
            return undefined;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_spawn = "modifier_imba_broodmother_spawn_spiderlings";
        let buff_duration = ability.GetSpecialValueFor("buff_duration");
        let damage = ability.GetSpecialValueFor("damage");
        hTarget.AddNewModifier(caster, this, modifier_spawn, {
            duration: this.GetSpecialValueFor("buff_duration") * (1 - hTarget.GetStatusResistance())
        });
        ApplyDamage({
            attacker: caster,
            victim: hTarget,
            damage: damage,
            damage_type: this.GetAbilityDamageType(),
            // damage_flags: this.GetAbilityTargetFlags()
        });
        hTarget.EmitSound("Hero_Broodmother.SpawnSpiderlingsImpact");
    }
}
@registerModifier()
export class modifier_imba_broodmother_spawn_spiderlings extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public count: number;
    public spiderling_duration: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.count = this.ability.GetSpecialValueFor("count");
        this.spiderling_duration = this.ability.GetSpecialValueFor("spiderling_duration");
    }
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_broodmother/broodmother_spiderlings_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetAbilityPlus()) {
            return;
        }
        if (!this.parent.IsAlive()) {
            let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_broodmother/broodmother_spiderlings_spawn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.parent);
            ParticleManager.SetParticleControl(pfx, 0, this.parent.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(pfx);
            this.parent.EmitSound("Hero_Broodmother.SpawnSpiderlings");
            for (let i = 0; i < this.count; i++) {
                let spiderling = BaseNpc_Plus.CreateUnitByName("npc_dota_broodmother_spiderling", this.parent.GetAbsOrigin(), this.caster, false);
                spiderling.SetOwner(this.caster);
                spiderling.SetControllableByPlayer(this.caster.GetPlayerOwnerID(), false);
                spiderling.SetUnitOnClearGround();
                spiderling.AddNewModifier(this.caster, this.ability, "modifier_kill", {
                    duration: this.spiderling_duration
                });
                this.parent.EmitSound("Hero_Broodmother.SpawnSpiderlings");
                let ability_level = this.ability.GetLevel();
                for (let i = 0; i < spiderling.GetAbilityCount(); i++) {
                    let ability = spiderling.GetAbilityByIndex(i);
                    if (ability) {
                        ability.SetLevel(ability_level);
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_broodmother_spawn_spiderlings_avenger extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_avenger: any;
    public avenger_radius: number;
    public avenger_duration: number;
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
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
        this.modifier_avenger = "modifier_imba_broodmother_spawn_spiderlings_avenger_buff";
        this.avenger_radius = this.ability.GetSpecialValueFor("avenger_radius");
        this.avenger_duration = this.ability.GetSpecialValueFor("avenger_duration");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_DEATH
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let dead_unit = keys.unit;
        if (IsSpiderling(dead_unit) && keys.attacker != dead_unit && dead_unit.GetOwner() == this.caster) {
            let distance = (dead_unit.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Length2D();
            if (distance <= this.avenger_radius) {
                if (this.caster.HasModifier(this.modifier_avenger)) {
                    let modifier = this.caster.FindModifierByName(this.modifier_avenger);
                    modifier.IncrementStackCount();
                    modifier.ForceRefresh();
                } else {
                    let modifier = this.caster.AddNewModifier(this.caster, this.ability, this.modifier_avenger, {
                        duration: this.avenger_duration
                    });
                    modifier.IncrementStackCount();
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_broodmother_spawn_spiderlings_avenger_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public avenger_damage_pct: number;
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
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
        this.avenger_damage_pct = this.ability.GetSpecialValueFor("avenger_damage_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.avenger_damage_pct * this.GetStackCount();
    }
}
@registerAbility()
export class imba_broodmother_spin_web extends BaseAbility_Plus {
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (IsServer()) {
            if (AoiHelper.IsNearEntity("npc_dota_broodmother_web", location, this.GetSpecialValueFor("radius") * 2, this.GetCasterPlus())) {
                return 25000;
            }
        }
        return super.GetCastRange(location, target);
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetLevel() == 1) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_charges", {});
        } else {
            let charges_modifier = this.GetCasterPlus().findBuff("modifier_generic_charges") as IBaseModifier_Plus;
            if (charges_modifier) {
                charges_modifier.BeRefresh({
                    bonus_charges: this.GetLevelSpecialValueFor("max_charges", 1)
                });
            }
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = ability.GetCursorPosition();
        let modifier_aura_friendly = "modifier_imba_broodmother_spin_web_aura";
        let modifier_aura_enemy = "modifier_imba_broodmother_spin_web_aura_enemy";
        let count = ability.GetSpecialValueFor("count");
        let count_scepter = ability.GetSpecialValueFor("count_scepter");
        let web_count = count;
        if (caster.HasScepter()) {
            web_count = count_scepter;
        }
        let webs = Entities.FindAllByClassname("npc_dota_broodmother_web") as IBaseNpc_Plus[];
        if (GameFunc.GetCount(webs) >= web_count) {
            let table_position = undefined;
            let oldest_web: IBaseNpc_Plus = undefined;
            for (const [k, web] of GameFunc.iPair(webs)) {
                if (table_position == undefined) {
                    table_position = k;
                }
                if (oldest_web == undefined) {
                    oldest_web = web;
                }
                if (web.TempData().spawn_time < oldest_web.TempData().spawn_time) {
                    oldest_web = web;
                    table_position = k;
                }
            }
            if (IsValidEntity(oldest_web) && oldest_web.IsAlive()) {
                oldest_web.ForceKill(false);
            }
        }
        let web = BaseNpc_Plus.CreateUnitByName("npc_dota_broodmother_web", target_point, caster, false);
        web.AddNewModifier(caster, ability, modifier_aura_friendly, {});
        web.AddNewModifier(caster, ability, modifier_aura_enemy, {});
        web.SetOwner(caster);
        web.SetControllableByPlayer(caster.GetPlayerOwnerID(), false);
        web.TempData().spawn_time = math.floor(GameRules.GetDOTATime(false, false));
        for (let i = 0; i < web.GetAbilityCount(); i++) {
            let ability = web.GetAbilityByIndex(i);
            if (ability) {
                ability.SetLevel(1);
            }
        }
        caster.EmitSound("Hero_Broodmother.SpinWebCast");
    }
}
@registerModifier()
export class modifier_imba_broodmother_spin_web_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public radius: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.radius = this.ability.GetSpecialValueFor("radius");
        if (IsServer()) {
            this.GetParentPlus().EmitSound("Hero_Broodmother.WebLoop");
        }
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraDuration(): number {
        return 0.2;
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_broodmother_spin_web";
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
    RemoveOnDeath(): boolean {
        return true;
    }
    GetAuraEntityReject(hTarget: CDOTA_BaseNPC): boolean {
        if (!IsServer()) {
            return;
        }
        if (hTarget == this.GetCasterPlus() || IsSpiderling(hTarget)) {
            return false;
        }
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION,
            2: Enum_MODIFIER_EVENT.ON_DEATH,
            3: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (params.unit == this.GetParentPlus()) {
            this.GetParentPlus().StopSound("Hero_Broodmother.WebLoop");
            GFuncEntity.SafeDestroyUnit(this.GetParentPlus());
        }
    }
}
@registerModifier()
export class modifier_imba_broodmother_spin_web extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public health_regen: any;
    public bonus_movespeed: number;
    public web_menuever_dmg_pct: number;
    public bonus_movespeed_scepter: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.health_regen = this.ability.GetSpecialValueFor("health_regen");
        this.bonus_movespeed = this.ability.GetSpecialValueFor("bonus_movespeed");
        this.web_menuever_dmg_pct = this.ability.GetSpecialValueFor("web_menuever_dmg_pct");
        this.bonus_movespeed_scepter = this.ability.GetSpecialValueFor("bonus_movespeed_scepter");
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.health_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.caster.HasScepter()) {
            return this.bonus_movespeed_scepter;
        }
        return this.bonus_movespeed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        if (IsSpiderling(this.parent)) {
            return this.web_menuever_dmg_pct * (-1);
        }
        return 0;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT)
    CC_GetModifierIgnoreMovespeedLimit(): 0 | 1 {
        if (this.caster.HasScepter()) {
            return 1;
        }
        return 0;
    }
}
@registerModifier()
export class modifier_imba_broodmother_spin_web_aura_enemy extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public radius: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
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
        return "modifier_imba_broodmother_spin_web_enemy";
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
    RemoveOnDeath(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_broodmother_spin_web_enemy extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public web_sense_modifier: any;
    public web_sense_duration: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                return;
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.web_sense_modifier = "modifier_imba_broodmother_spin_web_sense";
        this.web_sense_duration = this.ability.GetSpecialValueFor("web_sense_duration");
        if (IsServer()) {
            if (!this.parent.HasModifier(this.web_sense_modifier)) {
                this.parent.AddNewModifier(this.caster, this.ability, this.web_sense_modifier, {
                    duration: this.web_sense_duration
                });
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.parent.HasModifier(this.web_sense_modifier)) {
                this.parent.RemoveModifierByName(this.web_sense_modifier);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_broodmother_spin_web_sense extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
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
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
}
@registerAbility()
export class imba_broodmother_incapacitating_bite extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_broodmother_incapacitating_bite";
    }
}
@registerModifier()
export class modifier_imba_broodmother_incapacitating_bite extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_bite: any;
    public modifier_web: any;
    public modifier_webbed_up: any;
    public duration: number;
    public web_up_counter_duration: number;
    public web_up_stacks_hero: number;
    public web_up_stacks_spider: number;
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
        this.modifier_bite = "modifier_imba_broodmother_incapacitating_bite_orb";
        this.modifier_web = "modifier_imba_broodmother_spin_web_enemy";
        this.modifier_webbed_up = "modifier_imba_broodmother_incapacitating_bite_webbed_up_counter";
        this.duration = this.ability.GetSpecialValueFor("duration");
        this.web_up_counter_duration = this.ability.GetSpecialValueFor("web_up_counter_duration");
        this.web_up_stacks_hero = this.ability.GetSpecialValueFor("web_up_stacks_hero");
        this.web_up_stacks_spider = this.ability.GetSpecialValueFor("web_up_stacks_spider");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        let target = keys.target;
        let attacker = keys.attacker;
        if (target.IsOther() || target.IsBuilding() || target.GetTeamNumber() == attacker.GetTeamNumber()) {
            return undefined;
        }
        if (this.caster == attacker) {
            target.AddNewModifier(this.caster, this.ability, this.modifier_bite, {
                duration: this.duration * (1 - target.GetStatusResistance())
            });
        }
        if (target.HasModifier(this.modifier_web)) {
            if (attacker == this.caster || (IsSpiderling(attacker) && attacker.GetOwner() == this.caster)) {
                let stacks_increase;
                if (attacker == this.caster) {
                    stacks_increase = this.web_up_stacks_hero;
                } else {
                    stacks_increase = this.web_up_stacks_spider;
                }
                if (!target.HasModifier(this.modifier_webbed_up)) {
                    target.AddNewModifier(this.caster, this.ability, this.modifier_webbed_up, {
                        duration: this.web_up_counter_duration * (1 - target.GetStatusResistance())
                    });
                }
                let modifier = target.FindModifierByName(this.modifier_webbed_up);
                if (modifier) {
                    modifier.SetStackCount(modifier.GetStackCount() + stacks_increase);
                    modifier.ForceRefresh();
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_broodmother_incapacitating_bite_orb extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public bonus_movespeed: number;
    public miss_chance: number;
    public cast_speed_slow_pct: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
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
        this.bonus_movespeed = this.ability.GetSpecialValueFor("bonus_movespeed");
        this.miss_chance = this.ability.GetSpecialValueFor("miss_chance");
        this.cast_speed_slow_pct = this.ability.GetSpecialValueFor("cast_speed_slow_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.bonus_movespeed * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        return this.miss_chance;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE)
    CC_GetModifierPercentageCasttime(p_0: ModifierAbilityEvent,): number {
        return this.cast_speed_slow_pct * (-1);
    }
}
@registerModifier()
export class modifier_imba_broodmother_incapacitating_bite_webbed_up_counter extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_webbed_up_debuff: any;
    public web_up_stacks_threshold: number;
    public web_up_duration: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
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
        this.modifier_webbed_up_debuff = "modifier_imba_broodmother_incapacitating_bite_webbed_up_debuff";
        this.web_up_stacks_threshold = this.ability.GetSpecialValueFor("web_up_stacks_threshold");
        this.web_up_duration = this.ability.GetSpecialValueFor("web_up_duration");
    }
    OnStackCountChanged(p_0: number,): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetStackCount();
        if (stacks >= this.web_up_stacks_threshold) {
            if (!this.parent.HasModifier(this.modifier_webbed_up_debuff)) {
                this.parent.AddNewModifier(this.caster, this.ability, this.modifier_webbed_up_debuff, {
                    duration: this.web_up_duration * (1 - this.parent.GetStatusResistance())
                });
            }
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_broodmother_incapacitating_bite_webbed_up_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public web_up_miss_chance_pct: number;
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
        this.web_up_miss_chance_pct = this.ability.GetSpecialValueFor("web_up_miss_chance_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        return this.web_up_miss_chance_pct;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        };
    }
}
@registerAbility()
export class imba_broodmother_insatiable_hunger extends BaseAbility_Plus {
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_buff = "modifier_imba_broodmother_insatiable_hunger";
        let duration = ability.GetSpecialValueFor("duration");
        caster.AddNewModifier(this.GetCasterPlus(), ability, modifier_buff, {
            duration: duration
        });
        caster.EmitSound("Hero_Broodmother.InsatiableHunger");
    }
}
@registerModifier()
export class modifier_imba_broodmother_insatiable_hunger extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_satistied: any;
    public bonus_damage: number;
    public lifesteal_pct: number;
    public satisfied_duration: number;
    public queen_brood_aura_radius: number;
    public satisfy_trigger_duration_increase: number;
    public pfx: any;
    IsHidden(): boolean {
        return false;
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
        this.modifier_satistied = "modifier_imba_broodmother_insatiable_hunger_satisfied";
        this.bonus_damage = this.ability.GetSpecialValueFor("bonus_damage");
        this.lifesteal_pct = this.ability.GetSpecialValueFor("lifesteal_pct");
        this.satisfied_duration = this.ability.GetSpecialValueFor("satisfied_duration");
        this.queen_brood_aura_radius = this.ability.GetSpecialValueFor("queen_brood_aura_radius");
        this.satisfy_trigger_duration_increase = this.ability.GetSpecialValueFor("satisfy_trigger_duration_increase");
        if (!IsServer()) {
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_broodmother/broodmother_hunger_buff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.pfx, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_thorax", this.GetParentPlus().GetAbsOrigin(), true);
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraDuration(): number {
        return 0.5;
    }
    GetAuraRadius(): number {
        return this.queen_brood_aura_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_broodmother_insatiable_hunger_spider";
    }
    GetAuraEntityReject(hTarget: CDOTA_BaseNPC): boolean {
        if (!IsServer()) {
            return;
        }
        if (IsSpiderling(hTarget)) {
            return false;
        }
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE,
            2: Enum_MODIFIER_EVENT.ON_DEATH
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    GetModifierLifesteal() {
        return this.lifesteal_pct;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().StopSound("Hero_Broodmother.InsatiableHunger");
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let target = keys.unit;
        let attacker = keys.attacker;
        if (attacker == this.caster || (IsSpiderling(attacker) && attacker.GetOwner() == this.caster)) {
            if (target.IsRealUnit() && this.caster.IsAlive()) {
                this.caster.AddNewModifier(this.caster, this.ability, this.modifier_satistied, {
                    duration: this.satisfied_duration
                });
                this.SetDuration(this.GetRemainingTime() + this.satisfy_trigger_duration_increase, true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_broodmother_insatiable_hunger_spider extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public queen_brood_damage_bonus: number;
    public queen_brood_hp_regen: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.queen_brood_damage_bonus = this.ability.GetSpecialValueFor("queen_brood_damage_bonus");
        this.queen_brood_hp_regen = this.ability.GetSpecialValueFor("queen_brood_hp_regen");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        return this.queen_brood_damage_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.queen_brood_hp_regen;
    }
}
@registerModifier()
export class modifier_imba_broodmother_insatiable_hunger_satisfied extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public satisfied_status_resist_pct: number;
    public satisfied_movespeed_pct: number;
    IsHidden(): boolean {
        return false;
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
        this.satisfied_status_resist_pct = this.ability.GetSpecialValueFor("satisfied_status_resist_pct");
        this.satisfied_movespeed_pct = this.ability.GetSpecialValueFor("satisfied_movespeed_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.satisfied_status_resist_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.satisfied_movespeed_pct;
    }
}
@registerAbility()
export class imba_broodmother_spawn_spiderking extends BaseAbility_Plus {
    spiderking_table: IBaseNpc_Plus[];
    GetAssociatedSecondaryAbilities(): string {
        return "imba_broodmother_spawn_spiderlings";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.GetCursorPosition();
        let modifier_hatch = "modifier_imba_broodmother_spawn_spiderking_hatch";
        let cocoon_time = ability.GetSpecialValueFor("cocoon_time");
        let cocoon = BaseNpc_Plus.CreateUnitByName("npc_dota_broodmother_cocoon", target_point, caster, false);
        cocoon.SetOwner(caster);
        cocoon.SetControllableByPlayer(caster.GetPlayerOwnerID(), false);
        cocoon.SetUnitOnClearGround();
        cocoon.AddNewModifier(caster, ability, modifier_hatch, {
            duration: cocoon_time
        });
    }
}
@registerModifier()
export class modifier_imba_broodmother_spawn_spiderking_hatch extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_broodmother_spawn_spiderking;
    public parent: IBaseNpc_Plus;
    public sound: any;
    public max_spiderkings: any;
    IsHidden(): boolean {
        return false;
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
        this.parent = this.GetParentPlus();
        this.sound = "Hero_Broodmother.SpawnSpiderlings";
        this.max_spiderkings = this.ability.GetSpecialValueFor("max_spiderkings");
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.parent.IsAlive()) {
            return undefined;
        }
        EmitSoundOn(this.sound, this.parent);
        this.parent.ForceKill(false);
        let spiderking = BaseNpc_Plus.CreateUnitByName("npc_dota_broodmother_spiderking", this.parent.GetAbsOrigin(), this.caster, false);
        spiderking.SetOwner(this.caster);
        spiderking.SetControllableByPlayer(this.caster.GetPlayerOwnerID(), false);
        spiderking.SetUnitOnClearGround();
        spiderking.TempData().spawn_time = spiderking.GetCreationTime();
        for (let i = 0; i < spiderking.GetAbilityCount(); i++) {
            let ability = spiderking.GetAbilityByIndex(i);
            if (ability) {
                ability.SetLevel(this.ability.GetLevel());
            }
        }
        let oldest_spawn_time = undefined;
        let oldest_spiderking: IBaseNpc_Plus = undefined;
        if (this.ability.spiderking_table && GameFunc.GetCount(this.ability.spiderking_table) >= this.max_spiderkings) {
            for (const spiderking of this.ability.spiderking_table) {
                if (!oldest_spawn_time || !oldest_spiderking) {
                    oldest_spawn_time = spiderking.TempData().spawn_time;
                    oldest_spiderking = spiderking;
                } else {
                    if (spiderking.TempData().spawn_time < oldest_spawn_time) {
                        oldest_spawn_time = spiderking.TempData().spawn_time;
                        oldest_spiderking = spiderking;
                    }
                }
            }
            oldest_spiderking.ForceKill(false);
            let index = this.ability.spiderking_table.indexOf(oldest_spiderking)
            this.ability.spiderking_table.splice(index, 1);
        }
        this.ability.spiderking_table.push(spiderking);
    }
}
@registerAbility()
export class imba_broodmother_poison_sting extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_broodmother_poison_sting";
    }
}
@registerModifier()
export class modifier_imba_broodmother_poison_sting extends BaseModifier_Plus {
    public damage_per_second: number;
    public movement_speed: number;
    public duration_hero: number;
    public duration: number;
    public cleave_starting_width: any;
    public cleave_ending_width: any;
    public cleave_distance: number;
    public cleave_damage: number;
    public scale: any;
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second");
        this.movement_speed = this.GetSpecialValueFor("movement_speed");
        this.duration_hero = this.GetSpecialValueFor("duration_hero");
        this.duration = this.GetSpecialValueFor("duration");
        this.cleave_starting_width = this.GetSpecialValueFor("cleave_starting_width");
        this.cleave_ending_width = this.GetSpecialValueFor("cleave_ending_width");
        this.cleave_distance = this.GetSpecialValueFor("cleave_distance");
        this.cleave_damage = this.GetSpecialValueFor("cleave_damage");
        this.scale = this.GetSpecialValueFor("scale");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().PassivesDisabled() && !keys.target.IsBuilding()) {
            if (keys.target.IsRealUnit()) {
                keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_broodmother_poison_sting_debuff", {
                    duration: this.duration_hero * (1 - keys.target.GetStatusResistance())
                });
            } else {
                keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_broodmother_poison_sting_debuff", {
                    duration: this.duration * (1 - keys.target.GetStatusResistance())
                });
            }
            if (!keys.target.IsOther() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
                DoCleaveAttack(this.GetParentPlus(), keys.target, this.GetAbilityPlus(), (keys.damage * this.cleave_damage * 0.01), this.cleave_starting_width, this.cleave_ending_width, this.cleave_distance, "particles/econ/items/faceless_void/faceless_void_weapon_bfury/faceless_void_weapon_bfury_cleave.vpcf");
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        return this.GetStackCount() * 4;
    }
}
@registerModifier()
export class modifier_imba_broodmother_poison_sting_debuff extends BaseModifier_Plus {
    public damage_per_second: number;
    public movement_speed: number;
    public scale: any;
    public hero_scale: any;
    public spiders: EntityIndex[];
    public damage_type: number;
    IgnoreTenacity() {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second") + this.GetCasterPlus().findBuffStack("modifier_imba_broodmother_poison_sting", this.GetCasterPlus());
        this.movement_speed = this.GetSpecialValueFor("movement_speed") - this.GetCasterPlus().findBuffStack("modifier_imba_broodmother_poison_sting", this.GetCasterPlus());
        this.scale = this.GetSpecialValueFor("scale");
        this.hero_scale = this.GetSpecialValueFor("hero_scale");
        this.spiders = []
        this.spiders.push(this.GetCasterPlus().entindex())
        if (!IsServer()) {
            return;
        }
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.StartIntervalThink(1);
    }
    BeRefresh(p_0: any,): void {
        if (!this.spiders.includes(this.GetCasterPlus().entindex())) {
            this.spiders.push(this.GetCasterPlus().entindex())
        }
        this.damage_per_second = math.max(this.GetSpecialValueFor("damage_per_second") + this.GetCasterPlus().findBuffStack("modifier_imba_broodmother_poison_sting", this.GetCasterPlus()), this.damage_per_second);
        this.movement_speed = math.min(this.GetSpecialValueFor("movement_speed") - this.GetCasterPlus().findBuffStack("modifier_imba_broodmother_poison_sting", this.GetCasterPlus()), this.movement_speed);
    }
    OnIntervalThink(): void {
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.damage_per_second,
            damage_type: this.damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            3: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.damage_per_second;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && (!this.GetParentPlus().IsReincarnating || !this.GetParentPlus().IsReincarnating()) && this.spiders) {
            for (const entindex of (this.spiders)) {
                let npc = EntIndexToHScript(entindex) as IBaseNpc_Plus;
                if (npc && !npc.IsNull() && npc.IsAlive() && npc.HasModifier("modifier_imba_broodmother_poison_sting")) {
                    if ((keys.unit.IsRealUnit() || keys.unit.IsClone())) {
                        npc.findBuff<modifier_imba_broodmother_poison_sting>("modifier_imba_broodmother_poison_sting").SetStackCount(npc.FindModifierByName("modifier_imba_broodmother_poison_sting").GetStackCount() + this.hero_scale);
                    } else {
                        npc.findBuff<modifier_imba_broodmother_poison_sting>("modifier_imba_broodmother_poison_sting").SetStackCount(npc.FindModifierByName("modifier_imba_broodmother_poison_sting").GetStackCount() + this.scale);
                    }
                }
            }
            this.Destroy();
        }
    }
}
@registerAbility()
export class imba_broodmother_spiderling_volatile extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_broodmother_spiderling_volatile";
    }
}
@registerModifier()
export class modifier_imba_broodmother_spiderling_volatile extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_parasite: any;
    public explosion_damage: number;
    public radius: number;
    public duration: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
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
        this.modifier_parasite = "modifier_imba_broodmother_spiderling_volatile_debuff";
        this.explosion_damage = this.ability.GetSpecialValueFor("explosion_damage");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.duration = this.ability.GetSpecialValueFor("duration");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_DEATH
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let dead_unit = keys.unit;
        if (dead_unit == this.caster && keys.attacker != dead_unit) {
            if (this.caster.PassivesDisabled()) {
                return undefined;
            }
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsMagicImmune()) {
                    let damageTable = {
                        victim: enemy,
                        attacker: this.caster,
                        damage: this.explosion_damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        ability: this.ability
                    }
                    ApplyDamage(damageTable);
                    if (!enemy.HasModifier(this.modifier_parasite)) {
                        let modifier = enemy.AddNewModifier(this.caster, this.ability, this.modifier_parasite, {
                            duration: this.duration
                        });
                        if (modifier) {
                            modifier.IncrementStackCount();
                        }
                    } else {
                        let modifier = enemy.FindModifierByName(this.modifier_parasite);
                        if (modifier) {
                            modifier.IncrementStackCount();
                            modifier.ForceRefresh();
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_broodmother_spiderling_volatile_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public owner: any;
    public damage_per_stack: number;
    public slow_per_stack_pct: number;
    public damage_interval: number;
    public damage: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetTexture(): string {
        return "broodmother_spawn_spiderite";
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
        this.owner = this.caster.GetOwner();
        this.damage_per_stack = this.ability.GetSpecialValueFor("damage_per_stack");
        this.slow_per_stack_pct = this.ability.GetSpecialValueFor("slow_per_stack_pct");
        this.damage_interval = this.ability.GetSpecialValueFor("damage_interval");
        this.damage = this.damage_per_stack * this.damage_interval;
        if (IsServer()) {
            this.StartIntervalThink(this.damage_interval);
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let damageTable = {
            victim: this.parent,
            attacker: this.owner,
            damage: this.damage * this.GetStackCount(),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this.ability,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL
        }
        ApplyDamage(damageTable);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow_per_stack_pct * this.GetStackCount() * (-1);
    }
}
@registerAbility()
export class imba_broodmother_spiderking_poison_sting extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_broodmother_spiderking_poison_sting";
    }
}
@registerModifier()
export class modifier_imba_broodmother_spiderking_poison_sting extends BaseModifier_Plus {
    public damage_per_second: number;
    public movement_speed: number;
    public duration_hero: number;
    public duration: number;
    public cleave_starting_width: any;
    public cleave_ending_width: any;
    public cleave_distance: number;
    public cleave_damage: number;
    public scale: any;
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second");
        this.movement_speed = this.GetSpecialValueFor("movement_speed");
        this.duration_hero = this.GetSpecialValueFor("duration_hero");
        this.duration = this.GetSpecialValueFor("duration");
        this.cleave_starting_width = this.GetSpecialValueFor("cleave_starting_width");
        this.cleave_ending_width = this.GetSpecialValueFor("cleave_ending_width");
        this.cleave_distance = this.GetSpecialValueFor("cleave_distance");
        this.cleave_damage = this.GetSpecialValueFor("cleave_damage");
        this.scale = this.GetSpecialValueFor("scale");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().PassivesDisabled() && !keys.target.IsBuilding()) {
            if (keys.target.IsRealUnit()) {
                keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_broodmother_spiderking_poison_sting_debuff", {
                    duration: this.duration_hero * (1 - keys.target.GetStatusResistance())
                });
            } else {
                keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_broodmother_spiderking_poison_sting_debuff", {
                    duration: this.duration * (1 - keys.target.GetStatusResistance())
                });
            }
            if (!keys.target.IsOther() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
                DoCleaveAttack(this.GetParentPlus(), keys.target, this.GetAbilityPlus(), (keys.damage * this.cleave_damage * 0.01), this.cleave_starting_width, this.cleave_ending_width, this.cleave_distance, "particles/econ/items/faceless_void/faceless_void_weapon_bfury/faceless_void_weapon_bfury_cleave.vpcf");
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        return this.GetStackCount() * 4;
    }
}
@registerModifier()
export class modifier_imba_broodmother_spiderking_poison_sting_debuff extends BaseModifier_Plus {
    public damage_per_second: number;
    public movement_speed: number;
    public scale: any;
    public hero_scale: any;
    public spiders: EntityIndex[];
    public damage_type: number;
    IgnoreTenacity() {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second") + this.GetCasterPlus().findBuffStack("modifier_imba_broodmother_spiderking_poison_sting", this.GetCasterPlus());
        this.movement_speed = this.GetSpecialValueFor("movement_speed") - this.GetCasterPlus().findBuffStack("modifier_imba_broodmother_spiderking_poison_sting", this.GetCasterPlus());
        this.scale = this.GetSpecialValueFor("scale");
        this.hero_scale = this.GetSpecialValueFor("hero_scale");
        this.spiders = []
        this.spiders.push(this.GetCasterPlus().entindex());
        if (!IsServer()) {
            return;
        }
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.StartIntervalThink(1);
    }
    BeRefresh(p_0: any,): void {
        if (!this.spiders.includes(this.GetCasterPlus().entindex())) {
            this.spiders.push(this.GetCasterPlus().entindex());

        }
        this.damage_per_second = math.max(this.GetSpecialValueFor("damage_per_second") + this.GetCasterPlus().findBuffStack("modifier_imba_broodmother_spiderking_poison_sting", this.GetCasterPlus()), this.damage_per_second);
        this.movement_speed = math.min(this.GetSpecialValueFor("movement_speed") - this.GetCasterPlus().findBuffStack("modifier_imba_broodmother_spiderking_poison_sting", this.GetCasterPlus()), this.movement_speed);
    }
    OnIntervalThink(): void {
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.damage_per_second,
            damage_type: this.damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            3: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.damage_per_second;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && (!this.GetParentPlus().IsReincarnating || !this.GetParentPlus().IsReincarnating()) && this.spiders) {
            for (const entindex of this.spiders) {
                let npc = EntIndexToHScript(entindex) as IBaseNpc_Plus;
                if (npc && !npc.IsNull() && npc.IsAlive() && npc.HasModifier("modifier_imba_broodmother_spiderking_poison_sting")) {
                    if ((keys.unit.IsRealUnit() || keys.unit.IsClone())) {
                        npc.findBuff<modifier_imba_broodmother_spiderking_poison_sting>("modifier_imba_broodmother_spiderking_poison_sting").SetStackCount(npc.FindModifierByName("modifier_imba_broodmother_spiderking_poison_sting").GetStackCount() + this.hero_scale);
                    } else {
                        npc.findBuff<modifier_imba_broodmother_spiderking_poison_sting>("modifier_imba_broodmother_spiderking_poison_sting").SetStackCount(npc.FindModifierByName("modifier_imba_broodmother_spiderking_poison_sting").GetStackCount() + this.scale);
                    }
                }
            }
            this.Destroy();
        }
    }
}
@registerAbility()
export class imba_broodmother_spiderking_volatile extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_broodmother_spiderking_volatile";
    }
}
@registerModifier()
export class modifier_imba_broodmother_spiderking_volatile extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_parasite: any;
    public explosion_damage: number;
    public radius: number;
    public duration: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
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
        this.modifier_parasite = "modifier_imba_broodmother_spiderking_volatile_debuff";
        this.explosion_damage = this.ability.GetSpecialValueFor("explosion_damage");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.duration = this.ability.GetSpecialValueFor("duration");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_DEATH
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let dead_unit = keys.unit;
        if (dead_unit == this.caster && keys.attacker != dead_unit) {
            if (this.caster.PassivesDisabled()) {
                return undefined;
            }
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsMagicImmune()) {
                    let damageTable = {
                        victim: enemy,
                        attacker: this.caster,
                        damage: this.explosion_damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        ability: this.ability
                    }
                    ApplyDamage(damageTable);
                    if (!enemy.HasModifier(this.modifier_parasite)) {
                        let modifier = enemy.AddNewModifier(this.caster, this.ability, this.modifier_parasite, {
                            duration: this.duration
                        });
                        if (modifier) {
                            modifier.IncrementStackCount();
                        }
                    } else {
                        let modifier = enemy.FindModifierByName(this.modifier_parasite);
                        if (modifier) {
                            modifier.IncrementStackCount();
                            modifier.ForceRefresh();
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_broodmother_spiderking_volatile_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public owner: any;
    public damage_per_stack: number;
    public slow_per_stack_pct: number;
    public damage_interval: number;
    public damage: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetTexture(): string {
        return "broodmother_spawn_spiderite";
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
        this.owner = this.caster.GetOwner();
        this.damage_per_stack = this.ability.GetSpecialValueFor("damage_per_stack");
        this.slow_per_stack_pct = this.ability.GetSpecialValueFor("slow_per_stack_pct");
        this.damage_interval = this.ability.GetSpecialValueFor("damage_interval");
        this.damage = this.damage_per_stack * this.damage_interval;
        if (IsServer()) {
            this.StartIntervalThink(this.damage_interval);
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let damageTable = {
            victim: this.parent,
            attacker: this.owner,
            damage: this.damage * this.GetStackCount(),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this.ability,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL
        }
        ApplyDamage(damageTable);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow_per_stack_pct * this.GetStackCount() * (-1);
    }
}
@registerAbility()
export class imba_broodmother_spiderking_hardened_brood_aura extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_broodmother_spiderking_hardened_brood_aura";
    }
}
@registerModifier()
export class modifier_imba_broodmother_spiderking_hardened_brood_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public radius: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.radius = this.ability.GetSpecialValueFor("radius");
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraDuration(): number {
        return 0.1;
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_broodmother_spiderking_hardened_brood_buff";
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
    IsPurgeException(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    GetAuraEntityReject(hTarget: CDOTA_BaseNPC): boolean {
        if (!IsServer()) {
            return;
        }
        if (hTarget.GetUnitName().includes("broodmother_spiderling")) {
            return false;
        }
        return true;
    }
}
@registerModifier()
export class modifier_imba_broodmother_spiderking_hardened_brood_buff extends BaseModifier_Plus {
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
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH)
    CC_GetMinHealth(): number {
        return 1;
    }
}
