
    import { AI_ability } from "../../../ai/AI_ability";
    import { GameFunc } from "../../../GameFunc";
    import { ResHelper } from "../../../helper/ResHelper";
    import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
    import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
    import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
    import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
    @registerAbility()
export class imba_weaver_the_swarm extends BaseAbility_Plus {
OnSpellStart():void {
    if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
        this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector());
    }
    this.GetCasterPlus().EmitSound("Hero_Weaver.Swarm.Cast");
    if (this.GetCasterPlus().GetName() == "npc_dota_hero_weaver" && RollPercentage(75)) {
        this.GetCasterPlus().EmitSound("weaver_weav_ability_swarm_0" + RandomInt(1, 6));
    }
    let start_pos = undefined;
    let beetle_dummy = undefined;
    let projectile_table = undefined;
    let projectileID = undefined;
    for (let beetles = 1; beetles <= this.GetSpecialValueFor("count"); beetles += 1) {
        start_pos = this.GetCasterPlus().GetAbsOrigin() + RandomVector(RandomInt(0, this.GetSpecialValueFor("spawn_radius")));
        beetle_dummy = CreateModifierThinker(this.GetCasterPlus(),this, undefined, {}, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
        if (beetles == 1) {
            beetle_dummy.EmitSound("Hero_Weaver.Swarm.Projectile");
        }
        projectile_table = {
            Ability: this,
            EffectName: "particles/units/heroes/hero_weaver/weaver_swarm_projectile.vpcf",
            vSpawnOrigin: start_pos,
            fDistance: (this.GetSpecialValueFor("speed") * this.GetSpecialValueFor("travel_time")) + this.GetCasterPlus().GetCastRangeBonus(),
            fStartRadius: this.GetSpecialValueFor("radius"),
            fEndRadius: this.GetSpecialValueFor("radius"),
            Source: this.GetCasterPlus(),
            bHasFrontalCone: false,
            bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            fExpireTime: GameRules.GetGameTime() + 10.0,
            bDeleteOnHit: false,
            vVelocity: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin()).Normalized() * this.GetSpecialValueFor("speed") * Vector(1, 1, 0),
            bProvidesVision: true,
            iVisionRadius: 321,
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            ExtraData: {
                beetle_entindex: beetle_dummy.entindex()
            }
        }
        projectileID = ProjectileManager.CreateLinearProjectile(projectile_table);
        beetle_dummy.projectileID = projectileID;
    }
}
OnProjectileThink_ExtraData(location:Vector, data:any):void {
    if (data.beetle_entindex && EntIndexToHScript(data.beetle_entindex) && !EntIndexToHScript(data.beetle_entindex).IsNull()) {
        EntIndexToHScript(data.beetle_entindex).SetAbsOrigin(location);
    }
}
OnProjectileHit_ExtraData(target:CDOTA_BaseNPC|undefined, location:Vector, data:any):boolean|void {
    if (target && !target.HasModifier("modifier_imba_weaver_the_swarm_debuff") && data.beetle_entindex && EntIndexToHScript(data.beetle_entindex) && !EntIndexToHScript(data.beetle_entindex).IsNull()) {
        target.EmitSound("Hero_Weaver.SwarmAttach");
        let beetle = BaseNpc_Plus.CreateUnitByName("npc_dota_weaver_swarm", this.GetCasterPlus().GetAbsOrigin() + this.GetCasterPlus().GetForwardVector() * 64, false, this.GetCasterPlus(), this.GetCasterPlus(), this.GetCasterPlus().GetTeamNumber());
        beetle.AddNewModifier(this.GetCasterPlus(),this, "modifier_imba_weaver_the_swarm_unit", {
            destroy_attacks: this.GetTalentSpecialValueFor("destroy_attacks"),
            target_entindex: target.entindex()
        });
        beetle.SetForwardVector((target.GetAbsOrigin() - beetle.GetAbsOrigin()).Normalized());
        target.AddNewModifier(this.GetCasterPlus(),this, "modifier_imba_weaver_the_swarm_debuff", {
            duration: this.GetSpecialValueFor("duration"),
            damage: this.GetSpecialValueFor("damage"),
            attack_rate: this.GetSpecialValueFor("attack_rate"),
            armor_reduction: this.GetTalentSpecialValueFor("armor_reduction"),
            damage_type: this.GetAbilityDamageType(),
            beetle_entindex: beetle.entindex()
        });
        if (data.beetle_entindex && EntIndexToHScript(data.beetle_entindex) && EntIndexToHScript(data.beetle_entindex).projectileID) {
            ProjectileManager.DestroyLinearProjectile(EntIndexToHScript(data.beetle_entindex).projectileID);
            EntIndexToHScript(data.beetle_entindex).StopSound("Hero_Weaver.Swarm.Projectile");
            EntIndexToHScript(data.beetle_entindex).RemoveSelf();
        }
    } else if (!target && data.beetle_entindex && EntIndexToHScript(data.beetle_entindex) && !EntIndexToHScript(data.beetle_entindex).IsNull()) {
        EntIndexToHScript(data.beetle_entindex).StopSound("Hero_Weaver.Swarm.Projectile");
        EntIndexToHScript(data.beetle_entindex).RemoveSelf();
    }
}
OnOwnerSpawned():void {
    if (this.GetCasterPlus().HasTalent("special_bonus_imba_weaver_the_swarm_armor_reduction") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_weaver_the_swarm_armor_reduction")) {
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_weaver_the_swarm_armor_reduction"), "modifier_special_bonus_imba_weaver_the_swarm_armor_reduction", {});
    }
}
}
@registerModifier()
export class modifier_imba_weaver_the_swarm_unit extends BaseModifier_Plus {
public destroy_attacks : any; 
public target : IBaseNpc_Plus; 
public hero_attack_multiplier : any; 
public health_increments : any; 
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
GetEffectName():string {
    return "particles/units/heroes/hero_weaver/weaver_swarm_debuff.vpcf";
}
BeCreated(params:any):void {
    if (!IsServer()) {
        return;
    }
    this.destroy_attacks = params.destroy_attacks;
    this.target = EntIndexToHScript(params.target_entindex);
    this.hero_attack_multiplier = 2;
    this.health_increments = this.GetParentPlus().GetMaxHealth() / this.destroy_attacks;
    this.StartIntervalThink(FrameTime());
}
OnIntervalThink():void {
    if (this.target && !this.target.IsNull()) {
        if ((this.target.IsInvisible() && !this.GetParentPlus().CanEntityBeSeenByMyTeam(this.target)) || this.GetParentPlus().HasModifier("modifier_imba_faceless_void_chronosphere_handler")) {
            this.GetParentPlus().ForceKill(false);
            this.Destroy();
        } else if (this.target.IsAlive()) {
            this.GetParentPlus().SetAbsOrigin(this.target.GetAbsOrigin() + this.target.GetForwardVector() * 64);
            this.GetParentPlus().SetForwardVector((this.target.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin()).Normalized());
        }
    }
}
BeDestroy():void {
    if (!IsServer()) {
        return;
    }
    if (this.target && !this.target.IsNull() && this.target.HasModifier("modifier_imba_weaver_the_swarm_debuff")) {
        this.target.RemoveModifierByName("modifier_imba_weaver_the_swarm_debuff");
    }
}
CheckState():Partial<Record<modifierstate,boolean>> {
    return {
        [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
        [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
    };
}
/** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
        2: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
        3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
        4: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE,
        5: Enum_MODIFIER_EVENT.ON_ATTACKED
    }
    return Object.values(decFuncs);
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
CC_GetOverrideAnimation():GameActivity_t {
    return GameActivity_t.ACT_DOTA_IDLE;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL)
CC_GetAbsoluteNoDamageMagical(p_0:ModifierAttackEvent,):0|1 {
    return 1;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
CC_GetAbsoluteNoDamagePhysical(p_0:ModifierAttackEvent,):0|1 {
    return 1;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE)
CC_GetAbsoluteNoDamagePure(p_0:ModifierAttackEvent,):0|1 {
    return 1;
}
@registerEvent(Enum_MODIFIER_EVENT.ON_ATTACKED)
CC_OnAttacked(keys:ModifierAttackEvent):void {
    if (!IsServer()) {
        return;
    }
    if (keys.target == this.GetParentPlus()) {
        if (keys.attacker.IsHero()) {
            this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - (this.health_increments * this.hero_attack_multiplier));
        } else {
            this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - this.health_increments);
        }
        if (this.GetParentPlus().GetHealth() <= 0) {
            this.GetParentPlus().EmitSound("Hero_Grimstroke.InkCreature.Death");
            this.GetParentPlus().Kill(undefined, keys.attacker);
            this.Destroy();
        }
    }
}
}
@registerModifier()
export class modifier_imba_weaver_the_swarm_debuff extends BaseModifier_Plus {
public armor_reduction : any; 
public mana_burn_pct : number; 
public damage : number; 
public attack_rate : any; 
public damage_type : number; 
public beetle : any; 
public damage_table : ApplyDamageOptions; 
IgnoreTenacity() {
    return false;
}
IsPurgable():boolean {
    return false;
}
GetEffectName():string {
    return "particles/units/heroes/hero_weaver/weaver_swarm_infected_debuff.vpcf";
}
BeCreated(params:any):void {
    if (this.GetAbilityPlus()) {
        this.armor_reduction = this.GetAbilityPlus().GetTalentSpecialValueFor("armor_reduction");
        this.mana_burn_pct = this.GetAbilityPlus().GetTalentSpecialValueFor("mana_burn_pct");
    } else {
        this.armor_reduction = 1;
        this.mana_burn_pct = 50;
    }
    if (!IsServer()) {
        return;
    }
    this.damage = params.damage;
    this.attack_rate = params.attack_rate;
    this.damage_type = params.damage_type;
    this.beetle = EntIndexToHScript(params.beetle_entindex);
    this.damage_table = {
        victim: this.GetParentPlus(),
        damage: this.damage,
        damage_type: this.damage_type,
        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
        attacker: this.GetCasterPlus(),
        ability: this.GetAbilityPlus()
    }
    this.OnIntervalThink();
    this.StartIntervalThink(this.attack_rate);
}
OnIntervalThink():void {
    this.IncrementStackCount();
    ApplyDamage(this.damage_table);
    this.GetParentPlus().ReduceMana(this.damage * this.mana_burn_pct * 0.01);
}
BeDestroy():void {
    if (!IsServer()) {
        return;
    }
    if (this.beetle && !this.beetle.IsNull() && this.beetle.IsAlive()) {
        this.beetle.ForceKill(false);
    }
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
        2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
CC_GetModifierPhysicalArmorBonus(p_0:ModifierAttackEvent,):number {
    return this.armor_reduction * this.GetStackCount() * (-1);
}
@registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
CC_OnAttackLanded(keys:ModifierAttackEvent):void {
    if (keys.attacker == this.GetCasterPlus() && keys.target == this.GetParentPlus()) {
        this.IncrementStackCount();
    }
}
}
@registerAbility()
export class imba_weaver_shukuchi extends BaseAbility_Plus {
public glitch_point_particle : any; 
public glitch_point_position : any; 
GetIntrinsicModifierName():string {
    return "modifier_imba_weaver_shukuchi_handler";
}
GetCooldown(level:number):number {
    if (!this.glitch_point_position) {
        return super.GetCooldown(level);
    } else {
        return 0;
    }
}
OnSpellStart():void {
    this.GetCasterPlus().EmitSound("Hero_Weaver.Shukuchi");
    if (this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_weaver_shukuchi", this.GetCasterPlus())) {
        this.GetCasterPlus().RemoveModifierByName("modifier_imba_weaver_shukuchi");
    }
    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(),this, "modifier_imba_weaver_shukuchi", {
        duration: this.GetSpecialValueFor("duration")
    });
    if (this.GetAutoCastState() && this.glitch_point_position) {
        let warp_particle = ResHelper.CreateParticleEx("particles/items2_fx/teleport_end_streak.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(warp_particle, 0, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(warp_particle);
        FindClearSpaceForUnit(this.GetCasterPlus(), this.glitch_point_position, false);
    }
}
OnOwnerDied():void {
    if (this.glitch_point_particle) {
        ParticleManager.DestroyParticle(this.glitch_point_particle, true);
        ParticleManager.ReleaseParticleIndex(this.glitch_point_particle);
        this.glitch_point_particle = undefined;
    }
    if (this.glitch_point_position) {
        this.glitch_point_position = undefined;
    }
}
OnUnStolen():void {
    this.OnOwnerDied();
}
OnOwnerSpawned():void {
    if (this.GetCasterPlus().HasTalent("special_bonus_imba_weaver_shukuchi_hasted_speed") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_weaver_shukuchi_hasted_speed")) {
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_weaver_shukuchi_hasted_speed"), "modifier_special_bonus_imba_weaver_shukuchi_hasted_speed", {});
    }
}
}
@registerModifier()
export class modifier_imba_weaver_shukuchi_handler extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
/** DeclareFunctions():modifierfunction[] {
    let decFuncs = {
        1: Enum_MODIFIER_EVENT.ON_ORDER
    }
    return Object.values(decFuncs);
} */
@registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
CC_OnOrder(keys:ModifierUnitEvent):void {
    if (!IsServer() || keys.unit != this.GetParentPlus() || keys.order_type != dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO || keys.ability != this.GetAbilityPlus()) {
        return;
    }
    if (this.GetAbilityPlus().glitch_point_particle && this.GetAbilityPlus().glitch_point_position) {
        ParticleManager.DestroyParticle(this.GetAbilityPlus().glitch_point_particle, true);
        ParticleManager.ReleaseParticleIndex(this.GetAbilityPlus().glitch_point_particle);
        this.GetAbilityPlus().glitch_point_position = undefined;
    }
    if (this.GetAbilityPlus().GetAutoCastState()) {
        this.SetStackCount(0);
    } else {
        this.SetStackCount(1);
        this.GetAbilityPlus().glitch_point_particle = ResHelper.CreateParticleEx("particles/ambient/wormhole_circle_rings.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(this.GetAbilityPlus().glitch_point_particle, 0, GetGroundPosition(this.GetParentPlus().GetAbsOrigin(), undefined));
        this.GetAbilityPlus().glitch_point_position = this.GetParentPlus().GetAbsOrigin();
    }
}
}
@registerModifier()
export class modifier_imba_weaver_shukuchi extends BaseModifier_Plus {
public fade_time : number; 
public speed : number; 
public damage_type : number; 
public damage : number; 
public radius : number; 
public hit_targets : any; 
public shukuchi_particle : any; 
public damage_table : ApplyDamageOptions; 
public enemies : IBaseNpc_Plus[]; 
GetEffectName():string {
    return "particles/units/heroes/hero_weaver/weaver_shukuchi.vpcf";
}
BeCreated(p_0:any,):void {
    this.fade_time = this.GetSpecialValueFor("fade_time");
    this.speed = this.GetAbilityPlus().GetTalentSpecialValueFor("speed");
    if (!IsServer()) {
        return;
    }
    this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
    this.damage = this.GetAbilityPlus().GetTalentSpecialValueFor("damage");
    this.radius = this.GetSpecialValueFor("radius");
    this.hit_targets = {}
    this.shukuchi_particle = undefined;
    this.damage_table = {
        victim: undefined,
        damage: this.damage,
        damage_type: this.damage_type,
        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
        attacker: this.GetParentPlus(),
        ability: this.GetAbilityPlus()
    }
    this.StartIntervalThink(FrameTime());
}
OnIntervalThink():void {
    this.enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
    for (const [_, enemy] of ipairs(this.enemies)) {
        if (!this.hit_targets[enemy]) {
            this.shukuchi_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_weaver/weaver_shukuchi_damage_arc.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, enemy);
            ParticleManager.SetParticleControl(this.shukuchi_particle, 1, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(this.shukuchi_particle);
            this.shukuchi_particle = undefined;
            this.damage_table.victim = enemy;
            ApplyDamage(this.damage_table);
            this.hit_targets[enemy] = true;
        }
    }
}
CheckState():Partial<Record<modifierstate,boolean>> {
    if (this.GetElapsedTime() >= this.fade_time) {
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_UNSLOWABLE]: true
        };
    } else {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_UNSLOWABLE]: true
        };
    }
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT,
        2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
        3: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL,
        4: Enum_MODIFIER_EVENT.ON_ATTACK,
        5: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT)
CC_GetModifierIgnoreMovespeedLimit():0|1 {
    return 1;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
CC_GetModifierMoveSpeedBonus_Constant():number {
    return this.speed;
}
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
CC_GetModifierInvisibilityLevel():number {
    return math.min(this.GetElapsedTime() / this.fade_time, 1);
}
@registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
CC_OnAttack(keys:ModifierAttackEvent):void {
    if (keys.attacker == this.GetParentPlus() && !keys.no_attack_cooldown && this.GetElapsedTime() >= this.fade_time) {
        this.Destroy();
    }
}
@registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
CC_OnAbilityFullyCast(keys:ModifierAbilityEvent):void {
    if (keys.unit == this.GetParentPlus() && keys.ability != this.GetAbilityPlus() && this.GetElapsedTime() >= this.fade_time) {
        this.Destroy();
    }
}
}
@registerAbility()
export class imba_weaver_geminate_attack extends BaseAbility_Plus {
GetBehavior():DOTA_ABILITY_BEHAVIOR|Uint64 {
    return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
}
GetIntrinsicModifierName():string {
    return "modifier_imba_weaver_geminate_attack";
}
OnAbilityPhaseStart():boolean {
    return false;
}
}
@registerModifier()
export class modifier_imba_weaver_geminate_attack extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: Enum_MODIFIER_EVENT.ON_ATTACK
    });
} */
@registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
CC_OnAttack(keys:ModifierAttackEvent):void {
    if (keys.attacker == this.GetParentPlus() && this.GetAbilityPlus().IsFullyCastable() && !this.GetParentPlus().IsIllusion() && !this.GetParentPlus().PassivesDisabled() && !keys.no_attack_cooldown && keys.target.GetUnitName() != "npc_dota_observer_wards" && keys.target.GetUnitName() != "npc_dota_sentry_wards") {
        for (let geminate_attacks = 1; geminate_attacks <= this.GetAbilityPlus().GetTalentSpecialValueFor("tooltip_attack"); geminate_attacks += 1) {
            this.GetParentPlus().AddNewModifier(keys.target, this.GetAbilityPlus(), "modifier_imba_weaver_geminate_attack_delay", {
                delay: this.GetSpecialValueFor("delay") * geminate_attacks
            });
        }
        this.GetAbilityPlus().UseResources(true, true, true);
    }
}
}
@registerModifier()
export class modifier_imba_weaver_geminate_attack_delay extends BaseModifier_Plus {
public bonus_damage : number; 
public attack_bonus : number; 
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
GetAttributes():DOTAModifierAttribute_t {
    return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
}
BeCreated(params:any):void {
    if (!IsServer()) {
        return;
    }
    this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
    if (this.GetAbilityPlus().GetAutoCastState() && !this.GetParentPlus().IsRooted()) {
        let new_position = this.GetCasterPlus().GetAbsOrigin() + RandomVector((this.GetCasterPlus().GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin()).Length2D());
        let geminate_lapse_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_weaver/weaver_timelapse.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(geminate_lapse_particle, 0, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(geminate_lapse_particle, 2, new_position);
        ParticleManager.SetParticleControl(geminate_lapse_particle, 61, Vector(1, 0, 0));
        ParticleManager.ReleaseParticleIndex(geminate_lapse_particle);
        FindClearSpaceForUnit(this.GetParentPlus(), new_position, false);
        this.GetParentPlus().SetForwardVector((this.GetCasterPlus().GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin()).Normalized());
        GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus().GetHullRadius(), true);
        ProjectileManager.ProjectileDodge(this.GetParentPlus());
    }
    if (params && params.delay) {
        this.StartIntervalThink(params.delay);
    }
}
OnIntervalThink():void {
    if (this.GetParentPlus().IsAlive()) {
        this.attack_bonus = true;
        this.GetParentPlus().PerformAttack(this.GetCasterPlus(), true, true, true, false, true, false, false);
        this.attack_bonus = false;
        this.StartIntervalThink(-1);
        this.Destroy();
    }
}
/** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
    });
} */
@registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
CC_GetModifierPreAttack_BonusDamage():number {
    if (!IsServer() || !this.attack_bonus) {
        return;
    }
    return this.bonus_damage;
}
}
@registerAbility()
export class imba_weaver_time_lapse extends BaseAbility_Plus {
public intrinsic_modifier : any; 
public abilities_to_refresh : any; 
GetIntrinsicModifierName():string {
    return "modifier_imba_weaver_time_lapse_aura";
}
GetBehavior():DOTA_ABILITY_BEHAVIOR|Uint64 {
    if (!this.GetCasterPlus().HasScepter()) {
        return super.GetBehavior();
    } else {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
    }
}
GetCooldown(level:number):number {
    if (!this.GetCasterPlus().HasScepter()) {
        return super.GetCooldown(level);
    } else {
        return this.GetSpecialValueFor("cooldown_scepter");
    }
}
OnSpellStart():void {
    if (!this.GetCursorTarget() || this.GetCursorTarget() == this.GetCasterPlus()) {
        if (!this.intrinsic_modifier) {
            this.intrinsic_modifier = this.GetCasterPlus().FindModifierByName(this.GetIntrinsicModifierName());
        }
        if (this.intrinsic_modifier && this.intrinsic_modifier.instances_health && this.intrinsic_modifier.instances_health[1] && this.intrinsic_modifier.instances_mana && this.intrinsic_modifier.instances_mana[1] && this.intrinsic_modifier.instances_position && this.intrinsic_modifier.instances_position[1]) {
            this.GetCasterPlus().EmitSound("Hero_Weaver.TimeLapse");
            let time_lapse_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_weaver/weaver_timelapse.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(time_lapse_particle, 0, this.GetCasterPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(time_lapse_particle, 2, this.intrinsic_modifier.instances_position[1]);
            ParticleManager.ReleaseParticleIndex(time_lapse_particle);
            ProjectileManager.ProjectileDodge(this.GetCasterPlus());
            this.GetCasterPlus().Purge(false, true, false, true, true);
            this.GetCasterPlus().Stop();
            CreateIllusions(this.GetCasterPlus(), this.GetCasterPlus(), {
                outgoing_damage: 0,
                incoming_damage: 0,
                bounty_base: this.GetCasterPlus().GetIllusionBounty(),
                bounty_growth: undefined,
                outgoing_damage_structure: undefined,
                outgoing_damage_roshan: undefined,
                duration: 5
            }, 1, this.GetCasterPlus().GetHullRadius(), true, true);
            this.GetCasterPlus().SetHealth(math.max(this.intrinsic_modifier.instances_health[1], 1));
            this.GetCasterPlus().SetMana(this.intrinsic_modifier.instances_mana[1]);
            FindClearSpaceForUnit(this.GetCasterPlus(), this.intrinsic_modifier.instances_position[1], false);
        }
    } else {
        let target_modifier = this.GetCursorTarget().findBuff<modifier_imba_weaver_time_lapse>("modifier_imba_weaver_time_lapse");
        if (target_modifier && target_modifier.instances_health && target_modifier.instances_health[1] && target_modifier.instances_mana && target_modifier.instances_mana[1] && target_modifier.instances_position && target_modifier.instances_position[1]) {
            this.GetCursorTarget().EmitSound("Hero_Weaver.TimeLapse");
            let time_lapse_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_weaver/weaver_timelapse.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCursorTarget());
            ParticleManager.SetParticleControl(time_lapse_particle, 0, this.GetCursorTarget().GetAbsOrigin());
            ParticleManager.SetParticleControl(time_lapse_particle, 2, target_modifier.instances_position[1]);
            ParticleManager.ReleaseParticleIndex(time_lapse_particle);
            ProjectileManager.ProjectileDodge(this.GetCursorTarget());
            this.GetCursorTarget().Purge(false, true, false, true, true);
            CreateIllusions(this.GetCasterPlus(), this.GetCursorTarget(), {
                outgoing_damage: 0,
                incoming_damage: 0,
                bounty_base: this.GetCursorTarget().GetIllusionBounty(),
                bounty_growth: undefined,
                outgoing_damage_structure: undefined,
                outgoing_damage_roshan: undefined,
                duration: 5
            }, 1, this.GetCasterPlus().GetHullRadius(), true, true);
            this.GetCursorTarget().SetHealth(math.max(target_modifier.instances_health[1], 1));
            this.GetCursorTarget().SetMana(target_modifier.instances_mana[1]);
            FindClearSpaceForUnit(this.GetCursorTarget(), target_modifier.instances_position[1], false);
        }
    }
    if (!this.abilities_to_refresh) {
        this.abilities_to_refresh = {
            1: "imba_weaver_the_swarm",
            2: "imba_weaver_shukuchi",
            3: "imba_weaver_geminate_attack"
        }
    }
    for (const [_, ability] of ipairs(this.abilities_to_refresh)) {
        if (this.GetCasterPlus().FindAbilityByName(ability)) {
            this.GetCasterPlus().FindAbilityByName(ability).EndCooldown();
        }
    }
}
}
@registerModifier()
export class modifier_imba_weaver_time_lapse_aura extends BaseModifier_Plus {
public lapsed_time : number; 
public instances_health : any; 
public instances_mana : any; 
public instances_position : any; 
public interval : number; 
public total_saved_points : any; 
IsHidden():boolean {
    return true;
}
BeCreated(p_0:any,):void {
    if (!IsServer()) {
        return;
    }
    this.lapsed_time = 5;
    this.instances_health = {}
    this.instances_mana = {}
    this.instances_position = {}
    this.interval = 0.1;
    this.total_saved_points = this.lapsed_time / this.interval;
    this.OnIntervalThink();
    this.StartIntervalThink(this.interval);
}
OnIntervalThink():void {
    if (this.GetParentPlus().IsAlive()) {
        table.insert(this.instances_health, this.GetParentPlus().GetHealth());
        table.insert(this.instances_mana, this.GetParentPlus().GetMana());
        table.insert(this.instances_position, this.GetParentPlus().GetAbsOrigin());
        if (GameFunc.GetCount(this.instances_health) >= this.total_saved_points) {
            table.remove(this.instances_health, 1);
            table.remove(this.instances_mana, 1);
            table.remove(this.instances_position, 1);
        }
    }
}
IsAura():boolean {
    return true;
}
IsAuraActiveOnDeath():boolean {
    return true;
}
GetAuraRadius():number {
    return FIND_UNITS_EVERYWHERE;
}
GetAuraSearchFlags():DOTA_UNIT_TARGET_FLAGS {
    return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
}
GetAuraSearchTeam():DOTA_UNIT_TARGET_TEAM {
    return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH;
}
GetAuraSearchType():DOTA_UNIT_TARGET_TYPE {
    return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
}
GetModifierAura():string {
    return "modifier_imba_weaver_time_lapse";
}
GetAuraEntityReject(target:CDOTA_BaseNPC):boolean {
    return target == this.GetCasterPlus();
}
}
@registerModifier()
export class modifier_imba_weaver_time_lapse extends BaseModifier_Plus {
public lapsed_time : number; 
public instances_health : any; 
public instances_mana : any; 
public instances_position : any; 
public interval : number; 
public total_saved_points : any; 
IsHidden():boolean {
    return true;
}
BeCreated(p_0:any,):void {
    if (!IsServer()) {
        return;
    }
    this.lapsed_time = 5;
    this.instances_health = {}
    this.instances_mana = {}
    this.instances_position = {}
    this.interval = 0.1;
    this.total_saved_points = this.lapsed_time / this.interval;
    this.OnIntervalThink();
    this.StartIntervalThink(this.interval);
}
OnIntervalThink():void {
    table.insert(this.instances_health, this.GetParentPlus().GetHealth());
    table.insert(this.instances_mana, this.GetParentPlus().GetMana());
    table.insert(this.instances_position, this.GetParentPlus().GetAbsOrigin());
    if (GameFunc.GetCount(this.instances_health) >= this.total_saved_points) {
        table.remove(this.instances_health, 1);
        table.remove(this.instances_mana, 1);
        table.remove(this.instances_position, 1);
    }
}
}
@registerModifier()
export class modifier_special_bonus_imba_weaver_shukuchi_damage extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
}
@registerModifier()
export class modifier_special_bonus_imba_weaver_the_swarm_destroy_attacks extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
}
@registerModifier()
export class modifier_special_bonus_imba_weaver_geminate_attack_tooltip_attack extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
}
@registerModifier()
export class modifier_special_bonus_imba_weaver_the_swarm_armor_reduction extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
}
@registerModifier()
export class modifier_special_bonus_imba_weaver_shukuchi_hasted_speed extends BaseModifier_Plus {
IsHidden():boolean {
    return true;
}
IsPurgable():boolean {
    return false;
}
RemoveOnDeath():boolean {
    return false;
}
}
