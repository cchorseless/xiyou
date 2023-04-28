
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";


function IncreaseStacksColdFront(caster: IBaseNpc_Plus, target: IBaseNpc_Plus, stacks: number) {
    let modifier_passive = "modifier_imba_cold_front_passive";
    let modifier_debuff = "modifier_imba_cold_front_debuff";
    if (!caster || !caster.HasModifier(modifier_passive)) {
        return;
    }
    if (caster.PassivesDisabled()) {
        return;
    }
    let modifier_passive_handler = caster.FindModifierByName(modifier_passive);
    let ability = modifier_passive_handler.GetAbility();
    let duration = ability.GetSpecialValueFor("duration");
    if (!target.HasModifier(modifier_debuff)) {
        target.AddNewModifier(caster, ability, modifier_debuff, {
            duration: duration * (1 - target.GetStatusResistance())
        });
    }
    let modifier_debuff_handler = target.FindModifierByName(modifier_debuff);
    if (modifier_debuff_handler) {
        modifier_debuff_handler.SetStackCount(modifier_debuff_handler.GetStackCount() + stacks);
        modifier_debuff_handler.ForceRefresh();
    }
}
function FrostNova(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, target: IBaseNpc_Plus, cold_front = false) {
    let sound_cast = "Ability.FrostNova";
    let particle_nova = "particles/units/heroes/hero_lich/lich_frost_nova.vpcf";
    let modifier_nova = "modifier_imba_frost_nova_debuff";
    let should_add_cold_front_stacks = true;
    let radius = ability.GetSpecialValueFor("radius");
    let aoe_damage = ability.GetSpecialValueFor("aoe_damage");
    let target_damage = ability.GetSpecialValueFor("target_damage");
    let slow_duration = ability.GetSpecialValueFor("slow_duration");
    let main_cold_front_stacks = ability.GetSpecialValueFor("main_cold_front_stacks");
    let area_cold_front_stacks = ability.GetSpecialValueFor("area_cold_front_stacks");
    if (caster.HasTalent("special_bonus_imba_lich_3")) {
        let damage_current_health = target.GetHealth() * caster.GetTalentValue("special_bonus_imba_lich_3") * 0.01;
        target_damage = target_damage + damage_current_health;
    }
    EmitSoundOn(sound_cast, target);
    if (target.GetTeam() != caster.GetTeam()) {
        if (target.TriggerSpellAbsorb(ability)) {
            return;
        }
    }
    if (cold_front) {
        should_add_cold_front_stacks = false;
    }
    let particle_nova_fx = ResHelper.CreateParticleEx(particle_nova, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
    ParticleManager.SetParticleControl(particle_nova_fx, 0, target.GetAbsOrigin());
    ParticleManager.SetParticleControl(particle_nova_fx, 1, Vector(radius, radius, radius));
    ParticleManager.SetParticleControl(particle_nova_fx, 2, target.GetAbsOrigin());
    ParticleManager.ReleaseParticleIndex(particle_nova_fx);
    let damageTable = {
        victim: target,
        damage: target_damage,
        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
        attacker: caster,
        ability: ability
    }
    ApplyDamage(damageTable);
    if (should_add_cold_front_stacks) {
        IncreaseStacksColdFront(caster, target, main_cold_front_stacks);
    }
    let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
    for (const [_, enemy] of GameFunc.iPair(enemies)) {
        if (!enemy.IsMagicImmune()) {
            let damageTable = {
                victim: enemy,
                damage: aoe_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                attacker: caster,
                ability: ability
            }
            ApplyDamage(damageTable);
            if (should_add_cold_front_stacks) {
                IncreaseStacksColdFront(caster, enemy, area_cold_front_stacks);
            }
            enemy.AddNewModifier(caster, ability, modifier_nova, {
                duration: slow_duration * (1 - enemy.GetStatusResistance())
            });
        }
    }
    if (caster.HasTalent("special_bonus_imba_lich_4") && !cold_front) {
        let caster_loc = caster.GetAbsOrigin();
        let particle_nova_flower = "particles/hero/lich/nova_explosions_main.vpcf";
        let distance_per_nova = caster.GetTalentValue("special_bonus_imba_lich_4", "distance_per_nova");
        let damage_radius = caster.GetTalentValue("special_bonus_imba_lich_4", "damage_radius");
        let nova_damage = caster.GetTalentValue("special_bonus_imba_lich_4", "nova_damage");
        let cold_front_stacks = caster.GetTalentValue("special_bonus_imba_lich_4", "cold_front_stacks");
        let explosion_delay = caster.GetTalentValue("special_bonus_imba_lich_4", "explosion_delay");
        let creation_delay = caster.GetTalentValue("special_bonus_imba_lich_4", "creation_delay");
        let distance = (target.GetAbsOrigin() - caster_loc as Vector).Length2D();
        let direction = (target.GetAbsOrigin() - caster_loc as Vector).Normalized();
        let novas = math.floor(distance / distance_per_nova);
        for (let i = 0; i < novas; i++) {
            ability.AddTimer(creation_delay * i, () => {
                let location = caster_loc + direction * distance_per_nova * i as Vector;
                let particle_nova_flower_fx = ResHelper.CreateParticleEx(particle_nova_flower, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
                ParticleManager.SetParticleControl(particle_nova_flower_fx, 0, location);
                ParticleManager.SetParticleControl(particle_nova_flower_fx, 3, location);
                ability.AddTimer(explosion_delay, () => {
                    EmitSoundOnLocationWithCaster(location, sound_cast, caster);
                    ParticleManager.DestroyParticle(particle_nova_flower_fx, false);
                    let particle_nova_fx = ResHelper.CreateParticleEx(particle_nova, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
                    ParticleManager.SetParticleControl(particle_nova_fx, 0, location);
                    ParticleManager.SetParticleControl(particle_nova_fx, 1, Vector(radius, radius, radius));
                    ParticleManager.SetParticleControl(particle_nova_fx, 2, location);
                    ParticleManager.ReleaseParticleIndex(particle_nova_fx);
                    let enemies = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, damage_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        if (!enemy.IsMagicImmune()) {
                            let damageTable = {
                                victim: enemy,
                                damage: aoe_damage,
                                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                                attacker: caster,
                                ability: ability
                            }
                            ApplyDamage(damageTable);
                            IncreaseStacksColdFront(caster, enemy, cold_front_stacks);
                        }
                    }
                });
            });
        }
    }
    if (caster.HasTalent("special_bonus_imba_lich_11") && !cold_front && ability.GetAutoCastState()) {
        let particle_nova_flower = "particles/hero/lich/nova_explosions_main.vpcf";
        let rings = caster.GetTalentValue("special_bonus_imba_lich_11", "rings");
        let damage_radius = caster.GetTalentValue("special_bonus_imba_lich_11", "damage_radius");
        let novae_per_ring = caster.GetTalentValue("special_bonus_imba_lich_11", "novae_per_ring");
        let ring_distance = caster.GetTalentValue("special_bonus_imba_lich_11", "ring_distance");
        let creation_delay = caster.GetTalentValue("special_bonus_imba_lich_11", "creation_delay");
        let explosion_delay = caster.GetTalentValue("special_bonus_imba_lich_11", "explosion_delay");
        let cold_front_stacks = caster.GetTalentValue("special_bonus_imba_lich_11", "cold_front_stacks");
        let target_loc = target.GetAbsOrigin();
        let deviation = RandomInt(0, 359);
        let angle = 360 / novae_per_ring;
        for (let i = 0; i < rings; i++) {
            for (let j = 1; j <= novae_per_ring; j++) {
                ability.AddTimer(creation_delay * i, () => {
                    let chaos_variable = RandomInt(-15, 15);
                    let location = target_loc + Vector(math.cos(math.rad((angle * j) + deviation + chaos_variable)), math.sin(math.rad((angle * j) + deviation + chaos_variable))) * (i * ring_distance) as Vector;
                    location.z = GetGroundHeight(location, undefined);
                    let particle_nova_flower_fx = ResHelper.CreateParticleEx(particle_nova_flower, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
                    ParticleManager.SetParticleControl(particle_nova_flower_fx, 0, location);
                    ParticleManager.SetParticleControl(particle_nova_flower_fx, 3, location);
                    ability.AddTimer(explosion_delay, () => {
                        if (j == 1) {
                            EmitSoundOnLocationWithCaster(location, sound_cast, caster);
                        }
                        ParticleManager.DestroyParticle(particle_nova_flower_fx, false);
                        let particle_nova_fx = ResHelper.CreateParticleEx(particle_nova, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
                        ParticleManager.SetParticleControl(particle_nova_fx, 0, location);
                        ParticleManager.SetParticleControl(particle_nova_fx, 1, Vector(damage_radius, damage_radius, damage_radius));
                        ParticleManager.SetParticleControl(particle_nova_fx, 2, location);
                        ParticleManager.ReleaseParticleIndex(particle_nova_fx);
                        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                        for (const [_, enemy] of GameFunc.iPair(enemies)) {
                            if (!enemy.IsMagicImmune()) {
                                let damageTable = {
                                    victim: enemy,
                                    damage: aoe_damage,
                                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                                    attacker: caster,
                                    ability: ability
                                }
                                ApplyDamage(damageTable);
                                IncreaseStacksColdFront(caster, enemy, cold_front_stacks);
                            }
                        }
                    });
                });
            }
        }
    }
}
@registerAbility()
export class imba_lich_cold_front extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "lich_cold_front";
    }
    IsInnateAbility() {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_cold_front_passive";
    }
}
@registerModifier()
export class modifier_imba_cold_front_passive extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public stacks_per_attack: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.stacks_per_attack = this.ability.GetSpecialValueFor("stacks_per_attack");
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
            if (attacker.IsIllusion()) {
                return undefined;
            }
            if (target.IsMagicImmune()) {
                return undefined;
            }
            if (target.IsBuilding()) {
                return undefined;
            }
            if (attacker == this.caster && this.caster.GetTeamNumber() != target.GetTeamNumber()) {
                IncreaseStacksColdFront(this.caster, target, this.stacks_per_attack);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_cold_front_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_freeze: any;
    public frost_nova_ability: any;
    public max_stacks: number;
    public ms_slow_pct: number;
    public as_slow: any;
    public freeze_duration: number;
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
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.modifier_freeze = "modifier_imba_cold_front_freeze";
        if (IsServer()) {
            this.frost_nova_ability = this.caster.findAbliityPlus<imba_lich_frost_nova>("imba_lich_frost_nova");
        }
        this.max_stacks = this.ability.GetSpecialValueFor("max_stacks");
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct");
        this.as_slow = this.ability.GetSpecialValueFor("as_slow");
        this.freeze_duration = this.ability.GetSpecialValueFor("freeze_duration");
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
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost_lich.vpcf";
    }
    OnStackCountChanged(p_0: number,): void {
        if (IsServer()) {
            let stacks = this.GetStackCount();
            if (stacks >= this.max_stacks) {
                this.SetStackCount(this.GetStackCount() - this.max_stacks);
                FrostNova(this.caster, this.frost_nova_ability, this.parent, true);
                this.parent.AddNewModifier(this.caster, this.ability, this.modifier_freeze, {
                    duration: this.freeze_duration * (1 - this.parent.GetStatusResistance())
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_cold_front_freeze extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public particle_freeze: any;
    public particle_freeze_fx: any;
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
        let state = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
    BeCreated(p_0: any,): void {
        this.parent = this.GetParentPlus();
        this.particle_freeze = "particles/hero/lich/cold_front_freeze.vpcf";
        this.particle_freeze_fx = ResHelper.CreateParticleEx(this.particle_freeze, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(this.particle_freeze_fx, 0, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_freeze_fx, 15, Vector(105, 230, 255));
        ParticleManager.SetParticleControl(this.particle_freeze_fx, 16, Vector(1, 0, 0));
        this.AddParticle(this.particle_freeze_fx, false, false, -1, false, false);
    }
}
@registerAbility()
export class imba_lich_frost_nova extends BaseAbility_Plus {

    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_lich_11")) {
            return super.GetBehavior();
        } else {
            return tonumber(tostring(super.GetBehavior())) + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
    }
    GetCooldown(level: number): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_lich_11") && this.GetCasterPlus().findBuffStack("modifier_imba_frost_nova_handler", this.GetCasterPlus()) == 1) {
            return super.GetCooldown(level) * this.GetCasterPlus().GetTalentValue("special_bonus_imba_lich_11", "cooldown_mult");
        } else {
            return super.GetCooldown(level);
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_frost_nova_handler";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let cast_response = "lich_lich_ability_chain_1" + math.random(1, 4);
        let kill_response = "lich_lich_ability_nova_0" + math.random(1, 5);
        let cm_kill_response = "lich_lich_ability_nova_06";
        let radius = this.GetSpecialValueFor("radius");
        FrostNova(caster, this, target, false);
        if (RollPercentage(15)) {
            EmitSoundOn(cast_response, caster);
        }
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            this.AddTimer(FrameTime(), () => {
                if (!enemy.IsAlive() && enemy.IsRealUnit()) {
                    if (enemy.GetUnitName().includes("crystal_maiden")) {
                        if (RollPercentage(25)) {
                            EmitSoundOn(cm_kill_response, caster);
                        } else if (RollPercentage(20)) {
                            EmitSoundOn(kill_response, caster);
                        }
                    } else {
                        if (RollPercentage(20)) {
                            EmitSoundOn(kill_response, caster);
                        }
                    }
                }
            });
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_lich_11") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_lich_11")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_lich_11"), "modifier_special_bonus_imba_lich_11", {});
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);;
    }
}
@registerModifier()
export class modifier_imba_frost_nova_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public ms_slow_pct: number;
    public as_slow: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct");
        this.as_slow = this.ability.GetSpecialValueFor("as_slow");
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
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost_lich.vpcf";
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
}
@registerModifier()
export class modifier_imba_frost_nova_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
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
        if (this.GetAbilityPlus().GetAutoCastState()) {
            this.SetStackCount(0);
        } else {
            this.SetStackCount(1);
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_lich_11 extends BaseModifier_Plus {
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
@registerAbility()
export class imba_lich_frost_armor extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "lich_frost_armor";
    }
    // CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
    //     if (IsServer()) {
    //         let caster = this.GetCasterPlus();
    //         if (caster == target) {
    //             return UnitFilterResult.UF_FAIL_CUSTOM;
    //         }
    //         let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
    //         return nResult;
    //     }
    // }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return "dota_hud_error_lich_self_ice_armor";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnUnStolen(): void {
        let modifier_buff = "modifier_imba_frost_armor_buff";
        let caster = this.GetCasterPlus();
        if (caster.HasModifier(modifier_buff)) {
            caster.RemoveModifierByName(modifier_buff);
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_frost_armor_auto_cast";
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_armor = "modifier_imba_frost_armor_buff";
        if (caster.HasModifier(modifier_armor)) {
            caster.RemoveModifierByName(modifier_armor);
            caster.AddNewModifier(caster, ability, modifier_armor, {});
        } else {
            caster.AddNewModifier(caster, ability, modifier_armor, {});
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_lich_5") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_lich_5")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_lich_5", {});
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let cast_response = "lich_lich_ability_armor_0" + math.random(1, 5);
        let sound_cast = "Hero_Lich.FrostArmor";
        let modifier_armor = "modifier_imba_frost_armor_buff";
        let armor_duration = this.GetSpecialValueFor("armor_duration");
        if (RollPercentage(75)) {
            EmitSoundOn(cast_response, caster);
        }
        EmitSoundOn(sound_cast, target);
        target.AddNewModifier(caster, this, modifier_armor, {
            duration: armor_duration
        });
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_friend(this, null, (unit) => {
            return !unit.HasModifier("modifier_imba_frost_armor_buff")
        })
    }
}
@registerModifier()
export class modifier_special_bonus_imba_lich_5 extends BaseModifier_Plus {
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
        if (IsServer()) {
            this.StartIntervalThink(1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let intelligence = this.GetParentPlus().GetIntellect();
            let armor_bonus = math.floor(intelligence * this.GetParentPlus().GetTalentValue("special_bonus_imba_lich_5") * 0.01);
            this.SetStackCount(armor_bonus);
        }
    }
}
@registerModifier()
export class modifier_imba_frost_armor_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_frost_armor: any;
    public modifier_armor_debuff: any;
    public armor_bonus: number;
    public frost_duration: number;
    public freeze_attacks: any;
    public cold_front_stacks: number;
    public particle_frost_armor_fx: any;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_frost_armor = "particles/units/heroes/hero_lich/lich_frost_armor.vpcf";
        this.modifier_armor_debuff = "modifier_imba_frost_armor_debuff";
        this.armor_bonus = this.ability.GetSpecialValueFor("armor_bonus");
        this.frost_duration = this.ability.GetSpecialValueFor("frost_duration");
        this.freeze_attacks = this.ability.GetSpecialValueFor("freeze_attacks");
        this.cold_front_stacks = this.ability.GetSpecialValueFor("cold_front_stacks");
        this.particle_frost_armor_fx = ResHelper.CreateParticleEx(this.particle_frost_armor, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(this.particle_frost_armor_fx, 0, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_frost_armor_fx, 1, Vector(1, 1, 1));
        this.AddParticle(this.particle_frost_armor_fx, false, false, -1, false, false);
        if (IsServer()) {
            if (this.caster.HasTalent("special_bonus_imba_lich_8")) {
                let base_slow = this.caster.GetTalentValue("special_bonus_imba_lich_8", "base_slow");
                this.SetStackCount(base_slow);
                this.StartIntervalThink(0.5);
            }
        }
    }

    OnIntervalThink(): void {
        if (this.GetCasterPlus().IsNull()) {
            this.StartIntervalThink(-1);
            return;
        }
        let enemies = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.caster.GetTalentValue("special_bonus_imba_lich_8", "aura_range"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (enemy.HasModifier("modifier_imba_frost_armor_freezing_point")) {
                let modifier_handler = enemy.findBuff<modifier_imba_frost_armor_freezing_point>("modifier_imba_frost_armor_freezing_point");
                if (modifier_handler) {
                    modifier_handler.SetStackCount(this.GetStackCount());
                }
            }
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        if (this.caster == this.parent) {
            return false;
        }
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        let armor_bonus = this.armor_bonus;
        if (this.caster.HasModifier("modifier_special_bonus_imba_lich_5")) {
            let armor_bonus_talent = this.caster.findBuffStack("modifier_special_bonus_imba_lich_5", this.caster);
            armor_bonus = armor_bonus + armor_bonus_talent;
        }
        return armor_bonus;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        let attacker = keys.attacker;
        let target = keys.target;
        if (target == this.parent && target.GetTeamNumber() != attacker.GetTeamNumber()) {
            if (attacker.IsMagicImmune()) {
                return undefined;
            }
            if (attacker.IsBuilding()) {
                return undefined;
            }
            let modifier_debuff_handler;
            if (!attacker.HasModifier(this.modifier_armor_debuff)) {
                modifier_debuff_handler = attacker.AddNewModifier(this.caster, this.ability, this.modifier_armor_debuff, {
                    duration: this.frost_duration * (1 - attacker.GetStatusResistance())
                });
                if (modifier_debuff_handler) {
                    modifier_debuff_handler.SetStackCount(this.freeze_attacks);
                }
            } else {
                modifier_debuff_handler = attacker.FindModifierByName(this.modifier_armor_debuff);
                modifier_debuff_handler.DecrementStackCount();
                modifier_debuff_handler.ForceRefresh();
            }
            IncreaseStacksColdFront(this.caster, attacker, this.cold_front_stacks);
            if (this.caster.HasTalent("special_bonus_imba_lich_8")) {
                let max_slow = this.caster.GetTalentValue('special_bonus_imba_lich_8', "max_slow");
                let slow_increase_per_hit = this.caster.GetTalentValue("special_bonus_imba_lich_8", "slow_increase_per_hit");
                if (this.GetStackCount() < max_slow) {
                    this.SetStackCount(math.min(this.GetStackCount() + slow_increase_per_hit, max_slow));
                }
            }
        }
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost_armor.vpcf";
    }
    IsAura(): boolean {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_lich_8")) {
            return true;
        }
        return false;
    }
    GetAuraRadius(): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_lich_8", "aura_range");
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
        return "modifier_imba_frost_armor_freezing_point";
    }
}
@registerModifier()
export class modifier_imba_frost_armor_freezing_point extends BaseModifier_Plus {
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
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost.vpcf";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetStackCount() * (-1);
    }
}
@registerModifier()
export class modifier_special_bonus_imba_lich_8 extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (this.GetParentPlus().HasModifier("modifier_imba_frost_armor_buff")) {
                let modifier_handler = this.GetParentPlus().findBuff<modifier_imba_frost_armor_buff>("modifier_imba_frost_armor_buff");
                if (modifier_handler) {
                    modifier_handler.ForceRefresh();
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_frost_armor_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_disarm: any;
    public ms_slow_pct: number;
    public as_slow: any;
    public disarm_duration: number;
    public freeze_attacks: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.modifier_disarm = "modifier_imba_frost_armor_freeze";
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct");
        this.as_slow = this.ability.GetSpecialValueFor("as_slow");
        this.disarm_duration = this.ability.GetSpecialValueFor("disarm_duration");
        this.freeze_attacks = this.ability.GetSpecialValueFor("freeze_attacks");
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
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost.vpcf";
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
    OnStackCountChanged(p_0: number,): void {
        let stacks = this.GetStackCount();
        if (stacks == 0) {
            this.SetStackCount(this.freeze_attacks);
            if (this.parent.GetTeam() != this.caster.GetTeam()) {
                if (this.parent.TriggerSpellAbsorb(this.ability)) {
                    return undefined;
                }
            }
            this.parent.AddNewModifier(this.caster, this.ability, this.modifier_disarm, {
                duration: this.disarm_duration * (1 - this.parent.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_imba_frost_armor_freeze extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_hand_freeze: any;
    public particle_hand_freeze_fx: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_hand_freeze = "particles/hero/lich/lich_ice_armor_freeze.vpcf";
        this.particle_hand_freeze_fx = ResHelper.CreateParticleEx(this.particle_hand_freeze, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControlEnt(this.particle_hand_freeze_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.particle_hand_freeze_fx, 1, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
        this.AddParticle(this.particle_hand_freeze_fx, false, false, -1, false, false);
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
        let state = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_frost_armor_auto_cast extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_frost_armor: any;
    public autocast_radius: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_frost_armor = "modifier_imba_frost_armor_buff";
        this.autocast_radius = this.ability.GetSpecialValueFor("autocast_radius");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK,
            2: Enum_MODIFIER_EVENT.ON_RESPAWN
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_RESPAWN)
    CC_OnRespawn(keys: ModifierUnitEvent): void {
        if (keys.unit == this.caster) {
            this.caster.AddNewModifier(this.caster, this.ability, this.modifier_frost_armor, {});
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        let target = keys.target;
        if (!this.ability.GetAutoCastState()) {
            return undefined;
        }
        if (this.caster.GetTeamNumber() != target.GetTeamNumber()) {
            return undefined;
        }
        if (!target.IsRealUnit() && !target.IsBuilding()) {
            return undefined;
        }
        if (this.caster == target) {
            return undefined;
        }
        if (this.caster.IsChanneling()) {
            return undefined;
        }
        let distance = (this.caster.GetAbsOrigin() - target.GetAbsOrigin() as Vector).Length2D();
        if (distance > this.autocast_radius) {
            return undefined;
        }
        if (target.HasModifier(this.modifier_frost_armor)) {
            return undefined;
        }
        if (!this.ability.IsCooldownReady()) {
            return undefined;
        }
        this.caster.CastAbilityOnTarget(target, this.ability, this.caster.GetPlayerID());
    }
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
@registerAbility()
export class imba_lich_dark_ritual extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "lich_dark_ritual";
    }
    // CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
    //     if (IsServer()) {
    //         if (this.GetCasterPlus() == target && this.GetCasterPlus().HasTalent("special_bonus_imba_lich_2")) {
    //             return UnitFilterResult.UF_SUCCESS;
    //         }
    //         let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
    //         return nResult;
    //     }
    // }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let cast_response = "lich_lich_ability_ritual_";
        let cast_response_nums = {
            "1": "01",
            "2": "02",
            "3": "03",
            "4": "04",
            "5": "05",
            "6": "07",
            "7": "13"
        }
        let sound_cast = "Ability.DarkRitual";
        let particle_sacrifice_allies = "particles/units/heroes/hero_lich/lich_dark_ritual.vpcf";
        let particle_sacrifice_enemy = "particles/hero/lich/lich_dark_ritual_enemy.vpcf";
        let modifier_creeps = "modifier_imba_dark_ritual_creeps";
        let modifier_allied_sacrifice = "modifier_imba_dark_ritual_allied_sacrifice";
        let modifier_enemy_sacrifice = "modifier_imba_dark_ritual_enemy_sacrifice";
        let mana_conversion_pct = ability.GetSpecialValueFor("mana_conversion_pct");
        let xp_bonus_radius = ability.GetSpecialValueFor("xp_bonus_radius");
        let allied_creeps_radius = ability.GetSpecialValueFor("allied_creeps_radius");
        let sacrifice_duration = ability.GetSpecialValueFor("sacrifice_duration");
        if (target.GetTeam() != caster.GetTeam()) {
            if (target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
        }
        if (RollPercentage(75)) {
            let cast_response_number = GFuncRandom.RandomValue(cast_response_nums);
            EmitSoundOn(cast_response + cast_response_number, caster);
        }
        EmitSoundOn(sound_cast, caster);
        let heroes = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, xp_bonus_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        if (target != caster) {
            let creep_xp = target.GetDeathXP();
            let creep_hp = target.GetHealth();
            target.Kill(ability, caster);
            let mana_gained = creep_hp * mana_conversion_pct * 0.01;
            caster.GiveMana(mana_gained);
            let particleName = "particles/msg_fx/msg_xp.vpcf";
            let particle = ResHelper.CreateParticleEx(particleName, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, target);
            let digits = 0;
            if (mana_gained) {
                digits = (mana_gained + "").length;
            }
            ParticleManager.SetParticleControl(particle, 1, Vector(9, mana_gained, 6));
            ParticleManager.SetParticleControl(particle, 2, Vector(1, digits + 1, 0));
            ParticleManager.SetParticleControl(particle, 3, Vector(170, 0, 250));
            let allied_creeps = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, allied_creeps_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_SUMMONED, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, creep] of GameFunc.iPair(allied_creeps)) {
                let modifier_creeps_handler = creep.AddNewModifier(caster, ability, modifier_creeps, {});
                if (modifier_creeps_handler) {
                    modifier_creeps_handler.SetStackCount(creep_hp);
                }
            }
            let xp_per_hero = creep_xp / GameFunc.GetCount(heroes);
            for (const [_, hero] of GameFunc.iPair(heroes)) {
                // hero.AddExperience(xp_per_hero, false, false);
            }
        }
        let ally_creep;
        if (target.GetTeamNumber() == caster.GetTeamNumber()) {
            ally_creep = true;
        } else {
            ally_creep = false;
        }
        for (const [_, hero] of GameFunc.iPair(heroes)) {
            if (ally_creep) {
                hero.AddNewModifier(caster, ability, modifier_allied_sacrifice, {
                    duration: sacrifice_duration
                });
                let particle_sacrifice_allies_fx = ResHelper.CreateParticleEx(particle_sacrifice_allies, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, caster);
                ParticleManager.SetParticleControlEnt(particle_sacrifice_allies_fx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(particle_sacrifice_allies_fx, 1, hero, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hero.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(particle_sacrifice_allies_fx);
            } else {
                hero.AddNewModifier(caster, ability, modifier_enemy_sacrifice, {
                    duration: sacrifice_duration
                });
                let particle_sacrifice_enemy_fx = ResHelper.CreateParticleEx(particle_sacrifice_enemy, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, caster);
                ParticleManager.SetParticleControlEnt(particle_sacrifice_enemy_fx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(particle_sacrifice_enemy_fx, 1, hero, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hero.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(particle_sacrifice_enemy_fx);
            }
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_dark_ritual_creeps extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public creeps_bonus_as: number;
    public creeps_bonus_hp_pct: number;
    public creeps_bonus_dmg_pct: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.creeps_bonus_as = this.ability.GetSpecialValueFor("creeps_bonus_as");
        this.creeps_bonus_hp_pct = this.ability.GetSpecialValueFor("creeps_bonus_hp_pct");
        this.creeps_bonus_dmg_pct = this.ability.GetSpecialValueFor("creeps_bonus_dmg_pct");
        if (IsServer()) {
            // this.AddTimer(2, () => {
            //     let adjusted_hp = this.parent.GetMaxHealth() + this.GetStackCount() * this.creeps_bonus_hp_pct * 0.01;
            //     // this.parent.SetMaxHealth
            //     SetCreatureHealth(this.parent, adjusted_hp, true);
            // });
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
    GetEffectName(): string {
        return "particles/hero/lich/lich_dark_ritual_buff_ally.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.creeps_bonus_as;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetStackCount() * this.creeps_bonus_dmg_pct * 0.01;
    }
}
@registerModifier()
export class modifier_imba_dark_ritual_allied_sacrifice extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public allied_kill_dmg_red_pct: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.allied_kill_dmg_red_pct = this.ability.GetSpecialValueFor("allied_kill_dmg_red_pct");
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
    GetEffectName(): string {
        return "particles/hero/lich/lich_dark_ritual_buff_ally.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.allied_kill_dmg_red_pct * (-1);
    }
}
@registerModifier()
export class modifier_imba_dark_ritual_enemy_sacrifice extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public enemy_kill_bonus_dmg_pct: number;
    public enemy_kill_bonus_spell_amp: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.enemy_kill_bonus_dmg_pct = this.ability.GetSpecialValueFor("enemy_kill_bonus_dmg_pct");
        this.enemy_kill_bonus_spell_amp = this.ability.GetSpecialValueFor("enemy_kill_bonus_spell_amp");
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
    GetEffectName(): string {
        return "particles/hero/lich/lich_dark_ritual_buff_enemy.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.enemy_kill_bonus_dmg_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.enemy_kill_bonus_spell_amp;
    }
}
@registerAbility()
export class imba_lich_chain_frost extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "lich_chain_frost";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_lich_6")) {
                if (target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
                    return UnitFilterResult.UF_SUCCESS;
                }
            }
            let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
            return nResult;
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        if (caster.HasTalent("special_bonus_imba_lich_6") && target.GetTeamNumber() == caster.GetTeamNumber()) {
            let buff_duration = caster.GetTalentValue("special_bonus_imba_lich_6", "buff_duration");
            target.AddNewModifier(caster, ability, "modifier_imba_chain_frost_talent_buff", {
                duration: buff_duration
            });
        } else {
            this.LaunchProjectile(caster, target);
        }
    }
    LaunchProjectile(source: IBaseNpc_Plus, target: IBaseNpc_Plus) {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "Hero_Lich.ChainFrost";
        let particle_projectile = "particles/units/heroes/hero_lich/lich_chain_frost.vpcf";
        let scepter = caster.HasScepter();
        let projectile_base_speed = ability.GetSpecialValueFor("projectile_base_speed");
        let projectile_vision = ability.GetSpecialValueFor("projectile_vision");
        let num_bounces = ability.GetSpecialValueFor("num_bounces");
        EmitSoundOn(sound_cast, caster);
        if (this.GetCasterPlus().GetLevel() >= 25) {
            num_bounces = num_bounces + 99999;
        }
        let chain_frost_projectile = {
            Target: target,
            Source: source,
            Ability: ability,
            EffectName: particle_projectile,
            iMoveSpeed: projectile_base_speed,
            bDodgeable: false,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            bProvidesVision: true,
            iVisionRadius: projectile_vision,
            iVisionTeamNumber: caster.GetTeamNumber(),
            ExtraData: {
                bounces_left: num_bounces,
                current_projectile_speed: projectile_base_speed,
                main_chain_frost: true,
                counter: 0
            }
        }
        ProjectileManager.CreateTrackingProjectile(chain_frost_projectile);
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, extradata: any): boolean | void {
        if (target && !target.IsRealUnit()) { return }
        let caster = this.GetCasterPlus();
        let ability = this;
        let particle_projectile = "particles/units/heroes/hero_lich/lich_chain_frost.vpcf";
        let particle_mini_frost_projectile = "particles/hero/lich/lich_mini_frosts.vpcf";
        let modifier_slow = "modifier_imba_chain_frost_slow";
        let slow_duration = ability.GetSpecialValueFor("slow_duration");
        let bounce_range = ability.GetSpecialValueFor("bounce_range");
        let damage = ability.GetSpecialValueFor("damage");
        let speed_increase_per_bounce = ability.GetSpecialValueFor("speed_increase_per_bounce");
        let projectile_delay = ability.GetSpecialValueFor("projectile_delay");
        let projectile_vision = ability.GetSpecialValueFor("projectile_vision");
        let bonus_projectiles = caster.GetTalentValue("special_bonus_imba_lich_7", "bonus_projectiles");
        let projectiles_damage_pct = caster.GetTalentValue("special_bonus_imba_lich_7", "projectiles_damage_pct");
        let cold_front_stacks = ability.GetSpecialValueFor("cold_front_stacks");
        if (!target) {
            return undefined;
        }
        EmitSoundOn("Hero_Lich.ChainFrostImpact.Hero", target);
        if (caster.HasTalent("special_bonus_imba_lich_1")) {
            projectile_delay = caster.GetTalentValue("special_bonus_imba_lich_1");
        }
        if (extradata.main_chain_frost == 1) {
            this.AddTimer(projectile_delay, () => {
                if (extradata.bounces_left <= 0) {
                    return undefined;
                }
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, bounce_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
                for (let i = GameFunc.GetCount(enemies) - 1; i >= 0; i--) {
                    if (enemies[i] != undefined && (target == enemies[i] || enemies[i].GetUnitName().includes("undying_zombie"))) {
                        enemies.splice(i, 1);
                    }
                }
                if (GameFunc.GetCount(enemies) <= 0) {
                    return undefined;
                }
                let projectile_speed = extradata.current_projectile_speed + speed_increase_per_bounce;
                let bounces_left = extradata.bounces_left - 1;
                let bounce_target = enemies[0];
                let chain_frost_projectile;
                chain_frost_projectile = {
                    Target: bounce_target,
                    Source: target,
                    Ability: ability,
                    EffectName: particle_projectile,
                    iMoveSpeed: projectile_speed,
                    bDodgeable: false,
                    bVisibleToEnemies: true,
                    bReplaceExisting: false,
                    bProvidesVision: true,
                    iVisionRadius: projectile_vision,
                    iVisionTeamNumber: caster.GetTeamNumber(),
                    ExtraData: {
                        bounces_left: bounces_left,
                        current_projectile_speed: projectile_speed,
                        main_chain_frost: true,
                        counter: extradata.counter + 1
                    }
                }
                ProjectileManager.CreateTrackingProjectile(chain_frost_projectile);
                if (caster.HasTalent("special_bonus_imba_lich_7")) {
                    let projectiles_launched = 0;
                    for (let i = 2; i <= GameFunc.GetCount(enemies); i++) {
                        if (projectiles_launched < bonus_projectiles) {
                            chain_frost_projectile = {
                                Target: enemies[i],
                                Source: target,
                                Ability: ability,
                                EffectName: particle_mini_frost_projectile,
                                iMoveSpeed: projectile_speed,
                                bDodgeable: false,
                                bVisibleToEnemies: true,
                                bReplaceExisting: false,
                                bProvidesVision: true,
                                iVisionRadius: projectile_vision,
                                iVisionTeamNumber: caster.GetTeamNumber(),
                                ExtraData: {
                                    main_chain_frost: false,
                                    counter: extradata.counter + 1
                                }
                            }
                            ProjectileManager.CreateTrackingProjectile(chain_frost_projectile);
                            projectiles_launched = projectiles_launched + 1;
                        }
                    }
                }
            });
        } else {
            damage = damage * projectiles_damage_pct * 0.01;
        }
        if (target.GetTeam() != caster.GetTeam()) {
            if (extradata.counter == 0 && target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
        }
        if (target.IsMagicImmune()) {
            return undefined;
        }
        let damageTable = {
            victim: target,
            damage: damage + (this.GetSpecialValueFor("bonus_jump_damage") * extradata.counter),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            attacker: caster,
            ability: ability
        }
        ApplyDamage(damageTable);
        target.AddNewModifier(caster, ability, modifier_slow, {
            duration: slow_duration * (1 - target.GetStatusResistance())
        });
        IncreaseStacksColdFront(caster, target, cold_front_stacks);
    }
    GetManaCost(level: number): number {
        return 800;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_chain_frost_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public ms_slow_pct: number;
    public as_slow: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct");
        this.as_slow = this.ability.GetSpecialValueFor("as_slow");
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
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_slow_pct * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.as_slow * (-1);
    }
}
@registerModifier()
export class modifier_imba_chain_frost_talent_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_lich_chain_frost;
    public parent: IBaseNpc_Plus;
    public particle_orb: any;
    public max_distance: number;
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
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.particle_orb = "particles/hero/lich/lich_frost_ally_spin.vpcf";
            this.max_distance = this.caster.GetTalentValue("special_bonus_imba_lich_6", "max_distance");
            let particle_orb_fx = ResHelper.CreateParticleEx(this.particle_orb, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(particle_orb_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_orb_fx, 2, Vector(1, 0, 0));
            ParticleManager.SetParticleControl(particle_orb_fx, 3, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_orb_fx, 5, Vector(this.parent.GetHullRadius() * 3, 1, 1));
            this.AddParticle(particle_orb_fx, false, false, -1, false, false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        let unit = keys.unit;
        let attacker = keys.attacker;
        if (this.parent == unit) {
            if (!attacker.IsRealUnit()) {
                return undefined;
            }
            let distance = (unit.GetAbsOrigin() - attacker.GetAbsOrigin() as Vector).Length2D();
            if (distance > this.max_distance) {
                return undefined;
            }
            if (unit.GetTeamNumber() == attacker.GetTeamNumber()) {
                return undefined;
            }
            this.ability.LaunchProjectile(this.parent, attacker);
            this.Destroy();
        }
    }
}
@registerAbility()
export class imba_lich_frost_shield extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "lich_frost_shield";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let intellect = this.GetCasterPlus().GetIntellect();
        let armor_bonus = intellect * this.GetSpecialValueFor("int_armor_pct") / 100;
        EmitSoundOn("Hero_Lich.IceAge", this.GetCursorTarget());
        this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_lich_frost_shield", {
            duration: this.GetSpecialValueFor("duration")
        }).SetStackCount(armor_bonus);
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_lich_9") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_lich_9")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_lich_9", {});
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_friend(this, null, (unit) => {
            return !unit.HasModifier("modifier_imba_lich_frost_shield")
        })
    }
}
@registerModifier()
export class modifier_imba_lich_frost_shield extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public damage_reduction: number;
    public slow_duration: number;
    public damage: number;
    public interval: number;
    public radius: number;
    public duration: number;
    public cold_front_stacks: number;
    public hp_regen: any;
    public particle: any;
    public particle2: any;
    Init(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.damage_reduction = this.ability.GetSpecialValueFor("damage_reduction");
        this.slow_duration = this.ability.GetSpecialValueFor("slow_duration");
        this.damage = this.ability.GetSpecialValueFor("damage");
        this.interval = this.ability.GetSpecialValueFor("interval");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.duration = this.ability.GetSpecialValueFor("duration");
        this.cold_front_stacks = this.ability.GetSpecialValueFor("cold_front_stacks");
        if (this.caster.HasTalent("special_bonus_imba_lich_9")) {
            this.hp_regen = this.caster.GetTalentValue("special_bonus_imba_lich_9");
            if (this.parent.IsBuilding()) {
                this.hp_regen = this.hp_regen * (this.caster.GetTalentValue("special_bonus_imba_lich_9", "building_efficiency") / 100);
            }
        }
        if (!IsServer()) {
            return;
        }
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_lich/lich_ice_age.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControlEnt(this.particle, 1, this.parent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, this.parent.GetAbsOrigin(), true);
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.particle2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_lich/lich_frost_armor.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
        this.AddParticle(this.particle2, false, false, -1, false, false);
        if (this.caster.GetUnitName().includes("lich") && RollPercentage(60)) {
            this.caster.EmitSound("lich_lich_ability_armor_0" + math.random(1, 5));
        }
        this.StartIntervalThink(this.interval);
    }

    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_lich/lich_ice_age_dmg.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(particle, 1, this.parent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, this.parent.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(particle, 2, Vector(this.radius, this.radius, this.radius));
        ParticleManager.ReleaseParticleIndex(particle);
        this.parent.EmitSound("Hero_Lich.IceAge.Tick");
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            enemy.EmitSound("Hero_Lich.IceAge.Damage");
            let damageTable = {
                victim: enemy,
                attacker: this.caster,
                damage: this.damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                ability: this.ability
            }
            ApplyDamage(damageTable);
            enemy.AddNewModifier(this.caster, this.ability, "modifier_imba_lich_frost_shield_slow", {
                duration: this.slow_duration * (1 - enemy.GetStatusResistance())
            });
            IncreaseStacksColdFront(this.caster, enemy, this.cold_front_stacks);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingPhysicalDamage_Percentage(keys: ModifierAttackEvent): number {
        return this.damage_reduction * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.hp_regen || 0;
    }
}
@registerModifier()
export class modifier_imba_lich_frost_shield_slow extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public movement_slow: any;
    GetHeroEffectName(): string {
        return "particles/units/heroes/hero_lich/lich_ice_age_debuff.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_lich_ice_age.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.movement_slow = this.ability.GetSpecialValueFor("movement_slow");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_slow * (-1);
    }
}
@registerModifier()
export class modifier_special_bonus_imba_lich_9 extends BaseModifier_Plus {
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
@registerAbility()
export class imba_lich_sinister_gaze extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public target: IBaseNpc_Plus;
    public duration: number;
    public soul_consumption_duration: number;
    public retaliatory_chains_dmg_pct: number;
    public sacrifice_mana_pct: number;
    public sacrifice_health_pct: number;
    public cold_front_stacks: number;
    public end_channel: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_lich_sinister_gaze_handler";
    }
    GetAbilityTextureName(): string {
        return "lich_sinister_gaze";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetBehavior();
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE;
        }
    }
    GetAOERadius(): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("aoe_scepter");
        }
    }
    GetChannelTime(): number {
        return this.GetCasterPlus().findBuffStack("modifier_imba_lich_sinister_gaze_handler", this.GetCasterPlus()) * 0.01;
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (this.GetCasterPlus().GetTeamNumber() == target.GetTeamNumber() && target.IsConsideredHero()) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
        return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, this.GetCasterPlus().GetTeamNumber());
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return "Ability Can't Target Allied Heroes";
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_3;
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.target = this.GetCursorTarget();
        if (!this.caster.HasScepter() && this.target.TriggerSpellAbsorb(this)) {
            this.caster.Interrupt();
            return;
        }
        if (this.caster.GetUnitName().includes("lich") && RollPercentage(40)) {
            this.caster.EmitSound("lich_lich_ability_ritual_0" + math.random(2, 5));
        }
        this.duration = this.GetSpecialValueFor("duration");
        this.soul_consumption_duration = this.GetSpecialValueFor("soul_consumption_duration");
        this.retaliatory_chains_dmg_pct = this.GetSpecialValueFor("retaliatory_chains_dmg_pct");
        this.sacrifice_mana_pct = this.GetSpecialValueFor("sacrifice_mana_pct");
        this.sacrifice_health_pct = this.GetSpecialValueFor("sacrifice_health_pct");
        this.cold_front_stacks = this.GetSpecialValueFor("cold_front_stacks");
        this.caster.EmitSound("Hero_Lich.SinisterGaze.Cast");
        if (!this.GetCasterPlus().HasScepter()) {
            this.target.EmitSound("Hero_Lich.SinisterGaze.Target");
            this.target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_lich_sinister_gaze", {
                duration: this.GetChannelTime()
            });
            this.target.AddNewModifier(this.GetCasterPlus(), undefined, "modifier_truesight", {
                duration: this.GetChannelTime()
            });
            if (this.target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                IncreaseStacksColdFront(this.caster, this.target, this.cold_front_stacks);
            }
        } else {
            let units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("aoe_scepter"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, FindOrder.FIND_CLOSEST, false);
            if (GameFunc.GetCount(units) == 0) {
                this.end_channel = true;
            } else {
                for (const [_, unit] of GameFunc.iPair(units)) {
                    if (unit.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() || (unit.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() && unit.IsCreep() && !unit.IsConsideredHero())) {
                        if (_ == 1) {
                            this.target = unit;
                        }
                        unit.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_lich_sinister_gaze", {
                            duration: this.GetChannelTime()
                        });
                        unit.AddNewModifier(this.GetCasterPlus(), undefined, "modifier_truesight", {
                            duration: this.GetChannelTime()
                        });
                        if (this.target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                            IncreaseStacksColdFront(this.caster, unit, this.cold_front_stacks);
                        }
                    }
                }
            }
        }
    }
    OnChannelThink(p_0: number,): void {
        if (this.end_channel) {
            this.EndChannel(false);
            this.end_channel = undefined;
        }
    }
    OnChannelFinish(bInterrupted: boolean): void {
        if (!IsServer()) {
            return;
        }
        if (!bInterrupted && this.target && this.target.IsCreep() && !this.target.IsRoshan()) {
            let creep_health = this.target.GetHealth();
            let mana_gained = creep_health * (this.sacrifice_mana_pct / 100);
            let health_gained = creep_health * (this.sacrifice_health_pct / 100);
            this.caster.GiveMana(mana_gained);
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MANA_ADD, this.caster, mana_gained, undefined);
            if (this.target.GetTeam() == this.caster.GetTeam()) {
                this.caster.ApplyHeal(health_gained, this);
            }
            this.target.Kill(this, this.caster);
        } else {
            this.AddTimer(FrameTime(), () => {
                if (this.target) {
                    if (!this.target.IsAlive() && !this.target.IsReincarnating() && (this.target.IsRealUnit() || this.target.IsClone())) {
                        let consumption_health = this.target.GetMaxHealth();
                        this.caster.AddNewModifier(this.caster, this, "modifier_imba_lich_sinister_gaze_bonus_health", {
                            duration: this.soul_consumption_duration
                        }).SetStackCount(consumption_health);
                        // this.caster.CalculateStatBonus(true);
                        this.caster.ApplyHeal(consumption_health, this);
                    } else if (!this.caster.IsAlive() && !this.target.IsReincarnating()) {
                        let retaliation_damage = this.caster.GetMaxHealth() * (this.retaliatory_chains_dmg_pct / 100);
                        let damageTable = {
                            victim: this.target,
                            damage: retaliation_damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                            5: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL,
                            attacker: this.caster,
                            ability: this
                        }
                        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.target, retaliation_damage, undefined);
                        ApplyDamage(damageTable);
                    }
                }
            });
        }
        this.AddTimer(FrameTime(), () => {
            if (this.target && !this.target.IsAlive() && (!this.target.IsReincarnating || (this.target.IsReincarnating && !this.target.IsReincarnating()))) {
                let particle_name = "";
                if (this.target.GetTeam() == this.caster.GetTeam()) {
                    particle_name = "particles/units/heroes/hero_lich/lich_dark_ritual.vpcf";
                } else {
                    particle_name = "particles/hero/lich/lich_dark_ritual_enemy.vpcf";
                }
                let particle = ResHelper.CreateParticleEx(particle_name, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.caster);
                ParticleManager.SetParticleControlEnt(particle, 0, this.target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.target.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(particle, 1, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.caster.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(particle);
            }
        });
        this.caster.StopSound("Hero_Lich.SinisterGaze.Cast");
        if (this.target) {
            this.target.StopSound("Hero_Lich.SinisterGaze.Target");
            if (this.target.HasModifier("modifier_imba_lich_sinister_gaze")) {
                this.target.RemoveModifierByName("modifier_imba_lich_sinister_gaze");
            }
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_lich_sinister_gaze_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.ability == this.GetAbilityPlus() && keys.target) {
            if (keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
                if (!keys.target.IsCreep()) {
                    this.SetStackCount(this.GetSpecialValueFor("duration") * (1 - keys.target.GetStatusResistance()) * 100);
                } else {
                    this.SetStackCount(this.GetSpecialValueFor("duration") * (100 - this.GetSpecialValueFor("creep_channel_reduction")) * 0.01 * (1 - keys.target.GetStatusResistance()) * 100);
                }
            } else {
                if (!keys.target.IsCreep()) {
                    this.SetStackCount(this.GetSpecialValueFor("duration") * 100);
                } else {
                    this.SetStackCount(this.GetSpecialValueFor("duration") * (100 - this.GetSpecialValueFor("creep_channel_reduction")));
                }
            }
        } else {
            this.SetStackCount(this.GetSpecialValueFor("duration") * 100);
        }
    }
}
@registerModifier()
export class modifier_imba_lich_sinister_gaze extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public destination: any;
    public distance: number;
    public mana_drain: any;
    public status_resistance: any;
    public duration: number;
    public interval: number;
    public current_mana: any;
    public mana_per_interval: number;
    public particle: any;
    public particle2: any;
    IgnoreTenacity() {
        return true;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_lich_gaze.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.destination = this.ability.GetSpecialValueFor("destination") + this.caster.GetTalentValue("special_bonus_imba_lich_10");
        this.distance = CalcDistanceBetweenEntityOBB(this.GetCasterPlus(), this.GetParentPlus()) * (this.destination / 100);
        this.mana_drain = this.ability.GetSpecialValueFor("mana_drain");
        if (!IsServer()) {
            return;
        }
        this.status_resistance = this.GetParentPlus().GetStatusResistance();
        this.duration = this.GetRemainingTime();
        this.interval = 0.1;
        if (this.parent.GetMana) {
            this.current_mana = this.parent.GetMana();
        } else {
            this.current_mana = 0;
        }
        this.mana_per_interval = (this.current_mana * this.mana_drain * 0.01) / (this.duration / this.interval);
        if (this.caster.GetUnitName().includes("lich")) {
            this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_lich/lich_gaze.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControlEnt(this.particle, 0, this.parent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, this.parent.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.particle, 2, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_portrait", this.caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.particle, 3, this.caster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, this.caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.particle, 10, this.parent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, this.parent.GetAbsOrigin(), true);
            this.AddParticle(this.particle, false, false, -1, false, false);
            this.particle2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_lich/lich_gaze_eyes.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControlEnt(this.particle2, 1, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eye_l", this.caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.particle2, 2, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eye_r", this.caster.GetAbsOrigin(), true);
            this.AddParticle(this.particle2, false, false, -1, false, false);
        }
        this.parent.Interrupt();
        this.parent.MoveToNPC(this.caster);
        this.StartIntervalThink(this.interval);
    }
    OnIntervalThink(): void {
        if (!this.GetCasterPlus() || !this.GetAbilityPlus() || !this.GetAbilityPlus().IsChanneling()) {
            this.Destroy();
        } else {
            if (this.parent.ReduceMana) {
                this.parent.ReduceMana(this.mana_per_interval);
            }
            if (this.caster.GiveMana) {
                this.caster.GiveMana(this.mana_per_interval);
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.parent.Interrupt();
        GridNav.DestroyTreesAroundPoint(this.parent.GetAbsOrigin(), 100, false);
        if (this.ability.IsChanneling() && !this.GetCasterPlus().HasScepter()) {
            this.ability.EndChannel(false);
            this.caster.MoveToPositionAggressive(this.caster.GetAbsOrigin());
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_HEXED]: true,
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_MUTED]: true,
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT)
    CC_GetModifierMoveSpeed_Limit(): number {
        if (!IsServer()) {
            return;
        }
        if (!this.GetCasterPlus().HasScepter()) {
            return this.distance / (this.ability.GetChannelTime() * (1 - math.min(this.status_resistance, 0.9999)));
        } else {
            return this.distance / this.ability.GetChannelTime();
        }
    }
}
@registerModifier()
export class modifier_imba_lich_sinister_gaze_bonus_health extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierExtraHealthBonus(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_lich_10 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lich_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lich_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lich_7 extends BaseModifier_Plus {
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
