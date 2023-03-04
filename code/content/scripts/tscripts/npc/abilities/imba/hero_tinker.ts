
import { GameFunc } from "../../../GameFunc";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_tinker_rearm extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "tinker_rearm";
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_tinker_technomancy";
    }
    IsStealable(): boolean {
        return true;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_rearm_overdrive";
    }
    GetChannelAnimation(): GameActivity_t {
        return undefined;
    }
    GetChannelTime(): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_tinker_8")) {
            return 0;
        }
        return super.GetChannelTime();
    }
    GetCooldown(nLevel: number): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_tinker_8")) {
            return super.GetChannelTime();
        }
        return 0;
    }
    GetManaCost(p_0: number,): number {
        let extra_cost = (this.GetLevel() - 1) * this.GetSpecialValueFor("rearm_mana_per_lvl");
        return (this.GetSpecialValueFor("base_manacost") + extra_cost - this.GetCasterPlus().GetTalentValue("special_bonus_imba_tinker_1"));
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_TINKER_REARM1;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster.GetName() == "npc_dota_hero_tinker") {
                caster.EmitSound("tinker_tink_ability_rearm_0" + math.random(1, 9));
            }
            if (caster.HasTalent("special_bonus_imba_tinker_8")) {
                caster.AddNewModifier(caster, this, "modifier_imba_rearm_animation", {
                    duration: 0.1
                });
            } else {
                caster.AddNewModifier(caster, this, "modifier_imba_rearm_animation", {
                    duration: this.GetChannelTime()
                });
            }
            if (caster.HasTalent("special_bonus_imba_tinker_8")) {
                this.OnChannelFinish(false);
            }
            if (caster.HasTalent("special_bonus_imba_tinker_6")) {
                caster.AddNewModifier(caster, this, "modifier_imba_rearm_shield", {
                    duration: 3.5
                });
            }
        }
    }
    OnChannelFinish(bInterrupted: boolean): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (!bInterrupted) {
                let forbidden_items = {
                    1: "item_aeon_disk",
                    2: "item_imba_aeon_disk",
                    3: "item_imba_aether_specs",
                    4: "item_imba_arcane_boots",
                    5: "item_imba_black_king_bar",
                    6: "item_imba_bloodstone",
                    7: "item_imba_guardian_greaves",
                    8: "item_imba_hand_of_midas",
                    9: "item_imba_mekansm",
                    10: "item_meteor_hammer",
                    11: "item_imba_necronomicon",
                    12: "item_imba_necronomicon_2",
                    13: "item_imba_necronomicon_3",
                    14: "item_imba_necronomicon_4",
                    15: "item_imba_necronomicon_5",
                    16: "item_imba_pipe",
                    17: "item_refresher",
                    18: "item_refresher_shard",
                    19: "item_imba_skadi",
                    20: "item_imba_sphere",
                    21: "item_imba_plancks_artifact",
                    22: "item_minotaur_horn",
                    23: "item_imba_white_queen_cape",
                    24: "item_imba_black_queen_cape",
                    25: "item_helm_of_the_dominator",
                    26: "item_imba_sange",
                    27: "item_imba_heavens_halberd",
                    28: "item_imba_yasha",
                    29: "item_imba_kaya",
                    30: "item_imba_sange_yasha",
                    31: "item_imba_kaya_and_sange",
                    32: "item_imba_yasha_and_kaya",
                    33: "item_imba_arcane_nexus",
                    34: "item_imba_manta",
                    35: "item_imba_meteor_hammer",
                    36: "item_imba_meteor_hammer_2",
                    37: "item_imba_meteor_hammer_3",
                    38: "item_imba_meteor_hammer_4",
                    39: "item_imba_the_triumvirate_v2",
                    40: "item_tome_of_knowledge"
                }
                for (let i = 0; i <= 8; i += 1) {
                    let current_ability = caster.GetAbilityByIndex(i);
                    if (current_ability) {
                        current_ability.EndCooldown();
                    }
                }
                for (let i = 0; i <= 8; i += 1) {
                    let current_item = caster.GetItemInSlot(i);
                    let should_refresh = true;
                    for (const [_, forbidden_item] of ipairs(forbidden_items)) {
                        if (current_item && (current_item.GetName() == forbidden_item || current_item.GetPurchaser() != caster)) {
                            should_refresh = false;
                        }
                    }
                    if (current_item && should_refresh) {
                        if (current_item.GetName() == "item_imba_rod_of_atos_2") {
                            current_item.SpendCharge();
                        }
                        current_item.EndCooldown();
                    }
                }
                let teleport_scroll = caster.GetItemInSlot(15);
                if (teleport_scroll) {
                    teleport_scroll.EndCooldown();
                }
            }
            caster.FadeGesture(GameActivity_t.ACT_DOTA_TINKER_REARM1);
            caster.FadeGesture(GameActivity_t.ACT_DOTA_TINKER_REARM3);
            caster.RemoveModifierByName("modifier_imba_rearm_animation");
        }
    }
}
@registerModifier()
export class modifier_imba_rearm_animation extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let level = this.GetAbilityPlus().GetLevel();
            caster.EmitSound("Hero_Tinker.Rearm");
            let cast_main_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_tinker/tinker_rearm.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, caster);
            ParticleManager.SetParticleControlEnt(cast_main_pfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(cast_main_pfx, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", caster.GetAbsOrigin(), true);
            let cast_pfx1 = ResHelper.CreateParticleEx("particles/units/heroes/hero_tinker/tinker_rearm_b.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, caster);
            ParticleManager.SetParticleControlEnt(cast_pfx1, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", caster.GetAbsOrigin(), true);
            let cast_pfx2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_tinker/tinker_rearm_b.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, caster);
            ParticleManager.SetParticleControlEnt(cast_pfx2, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack3", caster.GetAbsOrigin(), true);
            let cast_sparkle_pfx1 = ResHelper.CreateParticleEx("particles/units/heroes/hero_tinker/tinker_rearm_c.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, caster);
            ParticleManager.SetParticleControlEnt(cast_sparkle_pfx1, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", caster.GetAbsOrigin(), true);
            let cast_sparkle_pfx2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_tinker/tinker_rearm_c.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, caster);
            ParticleManager.SetParticleControlEnt(cast_sparkle_pfx2, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack3", caster.GetAbsOrigin(), true);
            let animation_reset = 0;
            if (!caster.HasTalent("special_bonus_imba_tinker_8")) {
                if (level == 1 || level == 2) {
                    caster.StartGesture(GameActivity_t.ACT_DOTA_TINKER_REARM1);
                } else if (level == 3 || level == 4) {
                    caster.StartGesture(GameActivity_t.ACT_DOTA_TINKER_REARM2);
                } else if (level == 5) {
                    caster.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_TINKER_REARM3, 0.9);
                } else if (level == 6) {
                    caster.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_TINKER_REARM3, 1.2);
                } else if (level == 7) {
                    caster.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_TINKER_REARM3, 1.9);
                }
            }
            this.AddTimer(FrameTime(), () => {
                if (caster.HasModifier("modifier_imba_rearm_animation") && !caster.HasTalent("special_bonus_imba_tinker_8")) {
                    animation_reset = animation_reset + 1;
                    if ((level == 1 && animation_reset == 60)) {
                        caster.FadeGesture(GameActivity_t.ACT_DOTA_TINKER_REARM1);
                        caster.StartGesture(GameActivity_t.ACT_DOTA_TINKER_REARM3);
                    } else if ((level == 2 && animation_reset == 45)) {
                        caster.FadeGesture(GameActivity_t.ACT_DOTA_TINKER_REARM1);
                        caster.StartGesture(GameActivity_t.ACT_DOTA_TINKER_REARM3);
                    } else if ((level == 3 && animation_reset == 23)) {
                        caster.FadeGesture(GameActivity_t.ACT_DOTA_TINKER_REARM2);
                        caster.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_TINKER_REARM3, 0.9);
                    } else if ((level == 4 && animation_reset == 20)) {
                        caster.FadeGesture(GameActivity_t.ACT_DOTA_TINKER_REARM2);
                        caster.StartGesture(GameActivity_t.ACT_DOTA_TINKER_REARM3);
                    }
                    return FrameTime();
                } else {
                    ParticleManager.DestroyParticle(cast_main_pfx, false);
                    ParticleManager.DestroyParticle(cast_pfx1, false);
                    ParticleManager.DestroyParticle(cast_pfx2, false);
                    ParticleManager.DestroyParticle(cast_sparkle_pfx1, false);
                    ParticleManager.DestroyParticle(cast_sparkle_pfx2, false);
                    ParticleManager.ReleaseParticleIndex(cast_main_pfx);
                    ParticleManager.ReleaseParticleIndex(cast_pfx1);
                    ParticleManager.ReleaseParticleIndex(cast_pfx2);
                    ParticleManager.ReleaseParticleIndex(cast_sparkle_pfx1);
                    ParticleManager.ReleaseParticleIndex(cast_sparkle_pfx2);
                    return undefined;
                }
            });
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_tinker/tinker_rearm.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_rearm_overdrive extends BaseModifier_Plus {
    public aghs_spellpower: any;
    public aghs_interval_pct: number;
    IsHidden(): boolean {
        if (this.GetParentPlus().HasScepter()) {
            return false;
        }
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        let ability = this.GetAbilityPlus();
        this.aghs_spellpower = ability.GetSpecialValueFor("aghs_spellpower");
        this.aghs_interval_pct = ability.GetSpecialValueFor("aghs_interval_pct");
        this.StartIntervalThink(0.2);
    }
    OnIntervalThink(): void {
        let parent = this.GetParentPlus();
        this.IsHidden();
        if (parent.HasScepter()) {
            this.SetStackCount(math.ceil((1 - (parent.GetMana() / parent.GetMaxMana())) * (100 / this.aghs_interval_pct)));
        } else {
            this.SetStackCount(0);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return (this.aghs_spellpower * this.GetStackCount());
    }
}
@registerModifier()
export class modifier_imba_rearm_shield extends BaseModifier_Plus {
    public current_health: any;
    public shield_hp: any;
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/hero/tinker/rearmshield_shield.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            this.current_health = this.GetParentPlus().GetHealth();
            this.shield_hp = caster.GetMaxHealth() * (caster.GetTalentValue("special_bonus_imba_tinker_6") / 100);
            this.StartIntervalThink(FrameTime());
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            this.shield_hp = caster.GetMaxHealth() * (caster.GetTalentValue("special_bonus_imba_tinker_6") / 100);
        }
    }
    OnIntervalThink(): void {
        this.current_health = this.GetParentPlus().GetHealth();
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (parent == params.unit) {
                if (params.damage > 0) {
                    if (params.damage >= this.shield_hp) {
                        this.Destroy();
                        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BLOCK, parent, this.shield_hp, undefined);
                        parent.SetHealth(this.current_health - params.damage + this.shield_hp);
                    } else {
                        this.shield_hp = this.shield_hp - params.damage;
                        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BLOCK, parent, params.damage, undefined);
                        parent.SetHealth(this.current_health);
                    }
                }
            }
        }
    }
}
@registerAbility()
export class imba_tinker_laser extends BaseAbility_Plus {
    public cast_table: IBaseNpc_Plus[];
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let technomancy_ability_name = "imba_tinker_technomancy";
            if (target.TriggerSpellAbsorb(this)) {
                return undefined;
            }
            if (RollPercentage(15) && (caster.GetName() == "npc_dota_hero_tinker")) {
                caster.EmitSound("tinker_tink_ability_laser_0" + math.random(1, 4));
            }
            caster.EmitSound("Hero_Tinker.Laser");
            this.cast_table = []
            let start_pos = caster.GetAbsOrigin();
            let direction = (target.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Normalized();
            this.CreateLaser(start_pos, direction);
        }
    }
    CreateLaser(start_pos: Vector, laser_direction: Vector) {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let travel_speed = this.GetSpecialValueFor("travel_speed");
            let radius = this.GetSpecialValueFor("radius");
            let distance = this.GetCastRange(caster.GetAbsOrigin(), caster) + GPropertyCalculate.GetCastRangeBonus(caster);
            let laser_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_tinker/tinker_laser.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
            let laser_projectile = {
                Ability: this,
                EffectName: "particles/units/heroes/hero_tinker/tinker_laser.vpcf",
                Source: caster,
                vSpawnOrigin: start_pos,
                fDistance: distance,
                fStartRadius: radius,
                fEndRadius: radius,
                bHasFrontalCone: false,
                bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 10.0,
                bDeleteOnHit: false,
                vVelocity: Vector(laser_direction.x, laser_direction.y, 0) * travel_speed as Vector,
                bProvidesVision: false,
                ExtraData: {
                    source_loc_x: start_pos.x,
                    source_loc_y: start_pos.y,
                    source_loc_z: start_pos.z,
                    particle_index: laser_pfx,
                    distance: distance
                }
            }
            ProjectileManager.CreateLinearProjectile(laser_projectile);
        }
    }
    OnProjectileThink_ExtraData(location: Vector, extradata: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let start_pos = Vector(extradata.source_loc_x, extradata.source_loc_y, extradata.source_loc_z);
            let laser_pfx = extradata.particle_index;
            let distance = extradata.distance;
            ParticleManager.SetParticleControl(laser_pfx, 0, start_pos);
            ParticleManager.SetParticleControl(laser_pfx, 1, location);
            ParticleManager.SetParticleControl(laser_pfx, 3, start_pos);
            ParticleManager.SetParticleControl(laser_pfx, 9, start_pos);
            let projectile_distance = (location - start_pos as Vector).Length2D();
            if (projectile_distance > (distance - 50)) {
                ParticleManager.ReleaseParticleIndex(laser_pfx);
            }
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (IsServer()) {
            if (!target) {
                return undefined;
            }
            let caster = this.GetCasterPlus();
            target.EmitSound("Hero_Tinker.LaserImpact");
            let damage = this.GetSpecialValueFor("damage");
            let damage_type = this.GetAbilityDamageType();
            let secondary_reduction = this.GetSpecialValueFor("secondary_reduction");
            let blind_duration = this.GetSpecialValueFor("blind_duration");
            if (this.cast_table.includes(target)) {
                ApplyDamage({
                    attacker: caster,
                    victim: target,
                    ability: this,
                    damage: damage * secondary_reduction * 0.01,
                    damage_type: damage_type
                });
                target.AddNewModifier(caster, this, "modifier_imba_laser_blind", {
                    duration: blind_duration
                });
            } else {
                ApplyDamage({
                    attacker: caster,
                    victim: target,
                    ability: this,
                    damage: damage,
                    damage_type: damage_type
                });
                target.AddNewModifier(caster, this, "modifier_imba_laser_blind", {
                    duration: blind_duration * (1 - target.GetStatusResistance())
                });
                this.cast_table.push(target);
            }
        }
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_tinker_technomancy";
    }
    IsStealable(): boolean {
        return true;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_laser_blind extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        return this.GetSpecialValueFor("miss_chance_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    GetEffectName(): string {
        return "particles/ambient/tower_laser_blind.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerAbility()
export class imba_tinker_heat_seeking_missile extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "tinker_heat_seeking_missile";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let damage = this.GetSpecialValueFor("damage");
            let missile_count = this.GetTalentSpecialValueFor("base_count");
            let vision_radius = this.GetSpecialValueFor("vision_radius");
            let vision_duration = this.GetTalentSpecialValueFor("vision_duration");
            let speed = this.GetSpecialValueFor("speed");
            let range = this.GetCastRange(caster_loc, caster) + GPropertyCalculate.GetCastRangeBonus(caster);
            let mini_damage = this.GetSpecialValueFor("mini_damage");
            let mini_vision_duration = this.GetTalentSpecialValueFor("mini_vision_duration");
            let mini_speed = this.GetSpecialValueFor("mini_speed");
            let mini_missile_count = this.GetSpecialValueFor("mini_missile_count");
            if ((math.random(1, 100) <= 50) && (caster.GetName() == "npc_dota_hero_tinker")) {
                caster.EmitSound("tinker_tink_ability_heatseekingmissile_0" + math.random(1, 4));
            }
            caster.EmitSound("Hero_Tinker.Heat-Seeking_Missile");
            let heroes = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, range, this.GetAbilityTargetTeam(), DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
            let units = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, range, this.GetAbilityTargetTeam(), DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
            if (GameFunc.GetCount(heroes) == 0 && GameFunc.GetCount(units) == 0) {
                let dud_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_tinker/tinker_missile_dud.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                ParticleManager.SetParticleControlEnt(dud_pfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack3", caster_loc, true);
                ParticleManager.ReleaseParticleIndex(dud_pfx);
                caster.EmitSound("Hero_Tinker.Heat-Seeking_Missile_Dud");
                return undefined;
            }
            let hero_missiles = math.min(GameFunc.GetCount(heroes), missile_count);
            for (let i = 1; i <= hero_missiles; i += 1) {
                let hero_projectile = {
                    Target: heroes[i],
                    Source: caster,
                    Ability: this,
                    EffectName: "particles/units/heroes/hero_tinker/tinker_missile.vpcf",
                    bDodgeable: true,
                    bProvidesVision: false,
                    iMoveSpeed: speed,
                    iSourceAttachment: caster.ScriptLookupAttachment("attach_attack3"),
                    ExtraData: {
                        damage: damage,
                        vision_radius: vision_radius,
                        vision_duration: vision_duration,
                        range: range,
                        speed: speed,
                        mini_damage: mini_damage,
                        mini_vision_duration: mini_vision_duration,
                        mini_speed: mini_speed,
                        mini_missile_count: mini_missile_count,
                        cast_origin_x: caster_loc.x,
                        cast_origin_y: caster_loc.y
                    }
                }
                ProjectileManager.CreateTrackingProjectile(hero_projectile);
            }
            missile_count = missile_count - hero_missiles;
            if (GameFunc.GetCount(units) > 0) {
                for (let i = 1; i <= missile_count; i += 1) {
                    let random_projectile = {
                        Target: units[i],
                        Source: caster,
                        Ability: this,
                        EffectName: "particles/units/heroes/hero_tinker/tinker_missile.vpcf",
                        bDodgeable: true,
                        bProvidesVision: false,
                        iMoveSpeed: speed,
                        iSourceAttachment: caster.ScriptLookupAttachment("attach_attack3"),
                        ExtraData: {
                            damage: damage,
                            vision_radius: vision_radius,
                            vision_duration: vision_duration,
                            range: range,
                            speed: speed,
                            mini_damage: mini_damage,
                            mini_vision_duration: mini_vision_duration,
                            mini_speed: mini_speed,
                            mini_missile_count: mini_missile_count,
                            cast_origin_x: caster_loc.x,
                            cast_origin_y: caster_loc.y,
                            is_main_missile: 1
                        }
                    }
                    ProjectileManager.CreateTrackingProjectile(random_projectile);
                }
            }
        }
    }
    OnProjectileThink_ExtraData(location: Vector, ExtraData: any): void {
        let caster = this.GetCasterPlus();
        if (ExtraData.mini_missile_count && ExtraData.mini_missile_count > 0) {
            let distance = (location - Vector(ExtraData.cast_origin_x, ExtraData.cast_origin_y, 0) as Vector).Length2D();
            let interval = math.floor(ExtraData.speed);
            let technomancy;
            if (caster.HasAbility("imba_tinker_technomancy")) {
                technomancy = caster.findAbliityPlus<imba_tinker_technomancy>("imba_tinker_technomancy");
            }
            if (technomancy && technomancy.GetLevel() >= 2) {
                interval = math.floor(interval * (1 - technomancy.GetSpecialValueFor("interval_reduction")));
            }
            if (((math.floor(distance) % interval)) < math.floor(interval * FrameTime()) && (math.floor(distance - interval * FrameTime())) > math.floor(interval * FrameTime())) {
                let heroes = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, ExtraData.range, this.GetAbilityTargetTeam(), DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
                let units = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, ExtraData.range, this.GetAbilityTargetTeam(), DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
                if (GameFunc.GetCount(heroes) == 0 && GameFunc.GetCount(units) == 0) {
                    let dud_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_tinker/tinker_missile_dud.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                    ParticleManager.SetParticleControlEnt(dud_pfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack3", caster.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(dud_pfx);
                    caster.EmitSound("Hero_Tinker.Heat-Seeking_Missile_Dud");
                    return undefined;
                }
                let hero_missiles = math.min(GameFunc.GetCount(heroes), ExtraData.mini_missile_count);
                for (let i = 1; i <= hero_missiles; i += 1) {
                    let hero_projectile = {
                        Target: heroes[i],
                        vSourceLoc: location,
                        Ability: this,
                        EffectName: "particles/units/heroes/hero_tinker/tinker_missile.vpcf",
                        bDodgeable: true,
                        bProvidesVision: false,
                        bReplaceExisting: false,
                        iMoveSpeed: ExtraData.mini_speed,
                        ExtraData: {
                            damage: ExtraData.mini_damage,
                            vision_radius: ExtraData.vision_radius,
                            vision_duration: ExtraData.mini_vision_duration,
                            is_mini_missile: 1
                        }
                    }
                    ProjectileManager.CreateTrackingProjectile(hero_projectile);
                }
                let remaining_missiles = ExtraData.mini_missile_count;
                remaining_missiles = remaining_missiles - hero_missiles;
                if (GameFunc.GetCount(units) > 0) {
                    for (let i = 1; i <= remaining_missiles; i += 1) {
                        let random_projectile = {
                            Target: units[i],
                            vSourceLoc: location,
                            Ability: this,
                            EffectName: "particles/units/heroes/hero_tinker/tinker_missile.vpcf",
                            bDodgeable: true,
                            bProvidesVision: false,
                            bReplaceExisting: false,
                            iMoveSpeed: ExtraData.mini_speed,
                            ExtraData: {
                                damage: ExtraData.mini_damage,
                                vision_radius: ExtraData.vision_radius,
                                vision_duration: ExtraData.mini_vision_duration,
                                is_mini_missile: 1
                            }
                        }
                        ProjectileManager.CreateTrackingProjectile(random_projectile);
                    }
                }
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        let caster = this.GetCasterPlus();
        if (target) {
            let technomancy;
            if (caster.HasAbility("imba_tinker_technomancy")) {
                technomancy = caster.findAbliityPlus<imba_tinker_technomancy>("imba_tinker_technomancy");
            }
            if (technomancy && technomancy.GetLevel() >= 3 && ExtraData.is_mini_missile == 1) {
                let particle_explosion_fx = ResHelper.CreateParticleEx("particles/hero/tinker/tinker_mini_missile_explosive_warhead.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
                ParticleManager.SetParticleControl(particle_explosion_fx, 0, target.GetAbsOrigin());
                ParticleManager.SetParticleControl(particle_explosion_fx, 1, location);
                ParticleManager.SetParticleControl(particle_explosion_fx, 3, target.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle_explosion_fx);
                EmitSoundOn("Hero_Techies.LandMine.Detonate", target);
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, technomancy.GetSpecialValueFor("missile_aoe"), this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of ipairs(enemies)) {
                    let modifier_defence_break = enemy.findBuff<modifier_imba_heat_seeking_missile_break>("modifier_imba_heat_seeking_missile_break");
                    if (modifier_defence_break) {
                        modifier_defence_break.ForceRefresh();
                    } else {
                        modifier_defence_break = enemy.AddNewModifier(caster, this, "modifier_imba_heat_seeking_missile_break", {
                            duration: ExtraData.vision_duration * (1 - enemy.GetStatusResistance())
                        }) as modifier_imba_heat_seeking_missile_break;
                        modifier_defence_break.ForceRefresh();
                    }
                }
            }
            if (technomancy && technomancy.GetLevel() >= 2 && ExtraData.is_main_missile == 1) {
                let particle_explosion_fx = ResHelper.CreateParticleEx("particles/hero/tinker/tinker_missile_explosive_warhead.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
                ParticleManager.SetParticleControl(particle_explosion_fx, 0, caster.GetAbsOrigin());
                ParticleManager.SetParticleControl(particle_explosion_fx, 1, location);
                ParticleManager.SetParticleControl(particle_explosion_fx, 3, caster.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle_explosion_fx);
                EmitSoundOn("Hero_Techies.RemoteMine.Detonate", target);
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, technomancy.GetSpecialValueFor("missile_aoe"), this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of ipairs(enemies)) {
                    let explosion_damage = technomancy.GetSpecialValueFor("explosion_damage");
                    let explosion_damage_main = technomancy.GetSpecialValueFor("explosion_damage_main");
                    let modifier_defence_break = enemy.findBuff<modifier_imba_heat_seeking_missile_break>("modifier_imba_heat_seeking_missile_break");
                    if (modifier_defence_break) {
                        explosion_damage = explosion_damage * (1 + modifier_defence_break.GetStackCount() * technomancy.GetSpecialValueFor("mini_break_extra_dmg") * 0.01);
                        explosion_damage_main = explosion_damage_main * (1 + modifier_defence_break.GetStackCount() * technomancy.GetSpecialValueFor("mini_break_extra_dmg") * 0.01);
                    }
                    if (enemy == target) {
                        ApplyDamage({
                            attacker: caster,
                            victim: enemy,
                            ability: this,
                            damage: explosion_damage_main,
                            damage_type: this.GetAbilityDamageType()
                        });
                    } else {
                        ApplyDamage({
                            attacker: caster,
                            victim: enemy,
                            ability: this,
                            damage: explosion_damage,
                            damage_type: this.GetAbilityDamageType()
                        });
                    }
                }
            }
            let missile_damage = ExtraData.damage;
            let modifier_defence_break = target.findBuff<modifier_imba_heat_seeking_missile_break>("modifier_imba_heat_seeking_missile_break");
            if (modifier_defence_break) {
                missile_damage = missile_damage * (1 + modifier_defence_break.GetStackCount() * technomancy.GetSpecialValueFor("mini_break_extra_dmg") * 0.01);
            }
            ApplyDamage({
                attacker: caster,
                victim: target,
                ability: this,
                damage: missile_damage,
                damage_type: this.GetAbilityDamageType()
            });
            let explosion_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_tinker/tinker_missle_explosion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControlEnt(explosion_pfx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", location, true);
            ParticleManager.ReleaseParticleIndex(explosion_pfx);
            target.EmitSound("Hero_Tinker.Heat-Seeking_Missile.Impact");
        }
        this.CreateVisibilityNode(location, ExtraData.vision_radius, ExtraData.vision_duration);
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_tinker_technomancy";
    }
    IsStealable(): boolean {
        return true;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_heat_seeking_missile_break extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            let ability = this.GetCasterPlus().findAbliityPlus<imba_tinker_heat_seeking_missile>("imba_tinker_heat_seeking_missile");
            if (ability) {
                this.SetDuration(ability.GetSpecialValueFor("mini_vision_duration"), true);
                this.IncrementStackCount();
            }
        }
    }
    GetEffectName(): string {
        return "particles/items2_fx/medallion_of_courage_b.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerAbility()
export class imba_tinker_march_of_the_machines extends BaseAbility_Plus {
    tempdata: { [k: string]: any } = {};
    GetAbilityTextureName(): string {
        return "tinker_march_of_the_machines";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target_loc = this.GetCursorPosition();
            let caster_loc = caster.GetAbsOrigin();
            let direction = (target_loc - caster_loc as Vector).Normalized();
            let ability = this;
            let damage = this.GetSpecialValueFor("damage");
            let collision_radius = this.GetSpecialValueFor("collision_radius");
            let explosion_radius = this.GetSpecialValueFor("explosion_radius");
            let spawn_radius = this.GetSpecialValueFor("spawn_radius");
            let travel_distance = this.GetSpecialValueFor("travel_distance");
            let robots_per_sec = this.GetSpecialValueFor("robots_per_sec");
            let touch_chance_pct = this.GetTalentSpecialValueFor("touch_chance_pct");
            let flame_radius = this.GetSpecialValueFor("flame_radius");
            let flame_duration = this.GetSpecialValueFor("flame_duration");
            let tesla_stun_duration = this.GetSpecialValueFor("tesla_stun_duration");
            let dismantle_duration = this.GetSpecialValueFor("dismantle_duration");
            let railgun_damage = this.GetSpecialValueFor("railgun_damage");
            let railgun_range = this.GetSpecialValueFor("railgun_range");
            let railgun_radius = this.GetSpecialValueFor("railgun_radius");
            let sticky_duration = this.GetSpecialValueFor("sticky_duration");
            let drone_duration = this.GetSpecialValueFor("drone_duration");
            let speed = this.GetSpecialValueFor("speed");
            let spawn_duration = this.GetSpecialValueFor("spawn_duration");
            let spawn_line_direction = GFuncVector.RotateVector2D(direction, 90, true);
            speed = speed * (1 + (caster.GetTalentValue("special_bonus_imba_tinker_3") / 100));
            travel_distance = travel_distance * (1 + (caster.GetTalentValue("special_bonus_imba_tinker_3") / 100));
            let unlock_flame = false;
            let unlock_tesla = false;
            let unlock_dismantle = false;
            let unlock_railgun = false;
            let unlock_sticky = false;
            let unlock_drone = false;
            if (this.GetLevel() >= 1) {
                unlock_flame = true;
            }
            if (this.GetLevel() >= 5) {
                unlock_tesla = true;
            }
            if (this.GetLevel() >= 6) {
                unlock_dismantle = true;
            }
            if (this.GetLevel() >= 7) {
                unlock_railgun = true;
            }
            if (caster.HasAbility("imba_tinker_technomancy")) {
                let technomancy = caster.findAbliityPlus<imba_tinker_technomancy>("imba_tinker_technomancy");
                if (technomancy.GetLevel() >= 3) {
                    unlock_sticky = true;
                }
                if (technomancy.GetLevel() >= 6) {
                    unlock_drone = true;
                }
            }
            if ((math.random(1, 100) <= 80) && (caster.GetName() == "npc_dota_hero_tinker")) {
                let sound_random = math.random(1, 11);
                if (sound_random <= 9) {
                    caster.EmitSound("tinker_tink_ability_marchofthemachines_0" + sound_random);
                } else {
                    caster.EmitSound("tinker_tink_ability_marchofthemachines_" + sound_random);
                }
            }
            caster.EmitSound("Hero_Tinker.March_of_the_Machines.Cast");
            caster.EmitSound("Hero_Tinker.March_of_the_Machines");
            let area_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_tinker/tinker_motm.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
            ParticleManager.SetParticleControlEnt(area_pfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", caster_loc, true);
            ParticleManager.SetParticleControl(area_pfx, 1, caster_loc);
            ParticleManager.SetParticleControlForward(area_pfx, 1, direction);
            ParticleManager.ReleaseParticleIndex(area_pfx);
            for (let i = 0; i <= spawn_duration * robots_per_sec; i += 1) {
                this.AddTimer(i * (1 / robots_per_sec), () => {
                    let position_ran = (math.random() - 0.5) * travel_distance;
                    let projectile: ILineProjectile;
                    let bot_random = math.random(1, 100);
                    if ((bot_random <= touch_chance_pct) && unlock_flame) {
                        let index = "projectile_" + DoUniqueString("projectile");
                        this.tempdata[index] = {}
                        projectile = {
                            EffectName: "particles/hero/tinker/tinker_march_flame.vpcf",
                            vSpawnOrigin: target_loc - (direction * spawn_radius) + (spawn_line_direction * position_ran) as Vector,
                            fDistance: travel_distance,
                            fStartRadius: collision_radius,
                            fEndRadius: collision_radius,
                            Source: caster,
                            fExpireTime: GameRules.GetGameTime() + 10.0,
                            vVelocity: Vector(direction.x, direction.y, 0) * speed as Vector,
                            UnitBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_DESTROY,
                            bMultipleHits: false,
                            bIgnoreSource: true,
                            TreeBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            bCutTrees: false,
                            bTreeFullCollision: false,
                            WallBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            GroundBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            fGroundOffset: 80,
                            nChangeMax: 1,
                            bRecreateOnChange: false,
                            bDestroyImmediate: false,
                            bZCheck: false,
                            bGroundLock: true,
                            bProvidesVision: false,
                            OnThink: GHandler.create(this, (pinfo: GLineProjectile) => {
                                ability.OnProjectileThink_ExtraData(pinfo.GetPosition(), {
                                    index: index,
                                    damage: damage,
                                    explosion_radius: explosion_radius,
                                    flame_radius: flame_radius,
                                    flame_duration: flame_duration
                                });
                            }),
                            UnitTest: GHandler.create(this, (pinfo: GLineProjectile, unit) => {
                                return unit.GetUnitName() != "npc_dummy_unit" && unit.GetTeamNumber() != caster.GetTeamNumber();
                            }),
                            OnUnitHit: GHandler.create(this, (pinfo: GLineProjectile, unit) => {
                                ability.OnProjectileHit_ExtraData(unit, pinfo.GetPosition(), {
                                    index: index,
                                    damage: damage,
                                    explosion_radius: explosion_radius,
                                    flame_radius: flame_radius,
                                    flame_duration: flame_duration
                                });
                            })
                        }
                    } else if (((bot_random <= (2 * touch_chance_pct)) && (bot_random > (touch_chance_pct))) && unlock_tesla) {
                        projectile = {
                            EffectName: "particles/hero/tinker/tinker_march_tesla.vpcf",
                            vSpawnOrigin: target_loc - (direction * spawn_radius) + (spawn_line_direction * position_ran) as Vector,
                            fDistance: travel_distance,
                            fStartRadius: collision_radius,
                            fEndRadius: collision_radius,
                            Source: caster,
                            fExpireTime: GameRules.GetGameTime() + 10.0,
                            vVelocity: Vector(direction.x, direction.y, 0) * speed as Vector,
                            UnitBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_DESTROY,
                            bMultipleHits: false,
                            bIgnoreSource: true,
                            TreeBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            bCutTrees: false,
                            bTreeFullCollision: false,
                            WallBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            GroundBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            fGroundOffset: 80,
                            nChangeMax: 1,
                            bRecreateOnChange: false,
                            bDestroyImmediate: false,
                            bZCheck: false,
                            bGroundLock: true,
                            bProvidesVision: false,
                            OnThink: GHandler.create(this, (pinfo: GLineProjectile) => {
                                ability.OnProjectileThink_ExtraData(pinfo.GetPosition(), {
                                    damage: damage,
                                    explosion_radius: explosion_radius,
                                    tesla_stun_duration: tesla_stun_duration
                                });
                            }),
                            UnitTest: GHandler.create(this, (pinfo: GLineProjectile, unit: IBaseNpc_Plus) => {
                                return unit.GetUnitName() != "npc_dummy_unit" && unit.GetTeamNumber() != caster.GetTeamNumber();
                            }),
                            OnUnitHit: GHandler.create(this, (pinfo: GLineProjectile, unit: IBaseNpc_Plus) => {
                                ability.OnProjectileHit_ExtraData(unit, pinfo.GetPosition(), {
                                    damage: damage,
                                    explosion_radius: explosion_radius,
                                    tesla_stun_duration: tesla_stun_duration
                                });
                            })
                        }
                    } else if (((bot_random <= (3 * touch_chance_pct)) && (bot_random > (2 * touch_chance_pct))) && unlock_drone) {
                        let index = "projectile_" + DoUniqueString("projectile");
                        this.tempdata[index] = {}
                        projectile = {
                            EffectName: "particles/hero/tinker/tinker_march_drone.vpcf",
                            vSpawnOrigin: target_loc - (direction * spawn_radius) + (spawn_line_direction * position_ran) as Vector,
                            fDistance: travel_distance,
                            fStartRadius: collision_radius,
                            fEndRadius: collision_radius,
                            Source: caster,
                            fExpireTime: GameRules.GetGameTime() + 10.0,
                            vVelocity: Vector(direction.x, direction.y, 0) * speed as Vector,
                            UnitBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_DESTROY,
                            bMultipleHits: false,
                            bIgnoreSource: true,
                            TreeBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            bCutTrees: false,
                            bTreeFullCollision: false,
                            WallBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            GroundBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            fGroundOffset: 80,
                            nChangeMax: 1,
                            bRecreateOnChange: false,
                            bDestroyImmediate: false,
                            bZCheck: false,
                            bGroundLock: true,
                            bProvidesVision: false,
                            OnThink: GHandler.create(this, (pinfo: GLineProjectile) => {
                                ability.OnProjectileThink_ExtraData(pinfo.GetPosition(), {
                                    damage: damage,
                                    explosion_radius: explosion_radius,
                                    drone_duration: drone_duration
                                });
                            }),
                            UnitTest: GHandler.create(this, (pinfo: GLineProjectile, unit: IBaseNpc_Plus) => {
                                return unit.GetUnitName() != "npc_dummy_unit" && unit.GetTeamNumber() != caster.GetTeamNumber();
                            }),
                            OnUnitHit: GHandler.create(this, (pinfo: GLineProjectile, unit: IBaseNpc_Plus) => {
                                ability.OnProjectileHit_ExtraData(unit, pinfo.GetPosition(), {
                                    damage: damage,
                                    explosion_radius: explosion_radius,
                                    drone_duration: drone_duration
                                });
                            })
                        }
                    } else if (((bot_random <= (4 * touch_chance_pct)) && (bot_random > (3 * touch_chance_pct))) && unlock_sticky) {
                        projectile = {
                            EffectName: "particles/hero/tinker/tinker_march_sticky.vpcf",
                            vSpawnOrigin: target_loc - (direction * spawn_radius) + (spawn_line_direction * position_ran) as Vector,
                            fDistance: travel_distance,
                            fStartRadius: collision_radius,
                            fEndRadius: collision_radius,
                            Source: caster,
                            fExpireTime: GameRules.GetGameTime() + 10.0,
                            vVelocity: Vector(direction.x, direction.y, 0) * speed as Vector,
                            UnitBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_DESTROY,
                            bMultipleHits: false,
                            bIgnoreSource: true,
                            TreeBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            bCutTrees: false,
                            bTreeFullCollision: false,
                            WallBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            GroundBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            fGroundOffset: 80,
                            nChangeMax: 1,
                            bRecreateOnChange: false,
                            bDestroyImmediate: false,
                            bZCheck: false,
                            bGroundLock: true,
                            bProvidesVision: false,
                            OnThink: GHandler.create(this, (pinfo: GLineProjectile) => {
                                ability.OnProjectileThink_ExtraData(pinfo.GetPosition(), {
                                    damage: damage,
                                    explosion_radius: explosion_radius,
                                    sticky_duration: sticky_duration
                                });
                            }),
                            UnitTest: GHandler.create(this, (pinfo: GLineProjectile, unit: IBaseNpc_Plus) => {
                                return unit.GetUnitName() != "npc_dummy_unit" && unit.GetTeamNumber() != caster.GetTeamNumber();
                            }),
                            OnUnitHit: GHandler.create(this, (pinfo: GLineProjectile, unit: IBaseNpc_Plus) => {
                                ability.OnProjectileHit_ExtraData(unit, pinfo.GetPosition(), {
                                    damage: damage,
                                    explosion_radius: explosion_radius,
                                    sticky_duration: sticky_duration
                                });
                            })
                        }
                    } else if (((bot_random <= (5 * touch_chance_pct)) && (bot_random > (4 * touch_chance_pct))) && unlock_dismantle) {
                        projectile = {
                            EffectName: "particles/hero/tinker/tinker_march_dismantle.vpcf",
                            vSpawnOrigin: target_loc - (direction * spawn_radius) + (spawn_line_direction * position_ran) as Vector,
                            fDistance: travel_distance,
                            fStartRadius: collision_radius,
                            fEndRadius: collision_radius,
                            Source: caster,
                            fExpireTime: GameRules.GetGameTime() + 10.0,
                            vVelocity: Vector(direction.x, direction.y, 0) * speed as Vector,
                            UnitBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_DESTROY,
                            bMultipleHits: false,
                            bIgnoreSource: true,
                            TreeBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            bCutTrees: false,
                            bTreeFullCollision: false,
                            WallBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            GroundBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            fGroundOffset: 80,
                            nChangeMax: 1,
                            bRecreateOnChange: false,
                            bDestroyImmediate: false,
                            bZCheck: false,
                            bGroundLock: true,
                            bProvidesVision: false,
                            OnThink: GHandler.create(this, (pinfo: GLineProjectile) => {
                                ability.OnProjectileThink_ExtraData(pinfo.GetPosition(), {
                                    damage: damage,
                                    explosion_radius: explosion_radius,
                                    dismantle_duration: dismantle_duration
                                });
                            }),
                            UnitTest: GHandler.create(this, (pinfo: GLineProjectile, unit: IBaseNpc_Plus) => {
                                return unit.GetUnitName() != "npc_dummy_unit" && unit.GetTeamNumber() != caster.GetTeamNumber();
                            }),
                            OnUnitHit: GHandler.create(this, (pinfo: GLineProjectile, unit: IBaseNpc_Plus) => {
                                ability.OnProjectileHit_ExtraData(unit, pinfo.GetPosition(), {
                                    damage: damage,
                                    explosion_radius: explosion_radius,
                                    dismantle_duration: dismantle_duration
                                });
                            })
                        }
                    } else if (((bot_random <= (6 * touch_chance_pct)) && (bot_random > (5 * touch_chance_pct))) && unlock_railgun) {
                        let index = "projectile_" + DoUniqueString("projectile");
                        this.tempdata[index] = {}
                        projectile = {
                            EffectName: "particles/hero/tinker/tinker_march_railgun.vpcf",
                            vSpawnOrigin: target_loc - (direction * spawn_radius) + (spawn_line_direction * position_ran) as Vector,
                            fDistance: travel_distance,
                            fStartRadius: collision_radius,
                            fEndRadius: collision_radius,
                            Source: caster,
                            fExpireTime: GameRules.GetGameTime() + 10.0,
                            vVelocity: Vector(direction.x, direction.y, 0) * speed as Vector,
                            UnitBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_DESTROY,
                            bMultipleHits: false,
                            bIgnoreSource: true,
                            TreeBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            bCutTrees: false,
                            bTreeFullCollision: false,
                            WallBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            GroundBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            fGroundOffset: 80,
                            nChangeMax: 1,
                            bRecreateOnChange: false,
                            bDestroyImmediate: false,
                            bZCheck: false,
                            bGroundLock: true,
                            bProvidesVision: false,
                            OnThink: GHandler.create(this, (pinfo: GLineProjectile) => {
                                ability.OnProjectileThink_ExtraData(pinfo.GetPosition(), {
                                    index: index,
                                    damage: damage,
                                    explosion_radius: explosion_radius,
                                    railgun_damage: railgun_damage,
                                    railgun_range: railgun_range,
                                    railgun_radius: railgun_radius,
                                    direction_x: direction.x,
                                    direction_y: direction.y
                                });
                            }),
                            UnitTest: GHandler.create(this, (pinfo: GLineProjectile, unit: IBaseNpc_Plus) => {
                                return unit.GetUnitName() != "npc_dummy_unit" && unit.GetTeamNumber() != caster.GetTeamNumber();
                            }),
                            OnUnitHit: GHandler.create(this, (pinfo: GLineProjectile, unit: IBaseNpc_Plus) => {
                                ability.OnProjectileHit_ExtraData(unit, pinfo.GetPosition(), {
                                    index: index,
                                    damage: damage,
                                    explosion_radius: explosion_radius,
                                    railgun_damage: railgun_damage,
                                    railgun_range: railgun_range,
                                    railgun_radius: railgun_radius,
                                    direction_x: direction.x,
                                    direction_y: direction.y
                                });
                            })
                        }
                    } else {
                        projectile = {
                            EffectName: "particles/units/heroes/hero_tinker/tinker_machine.vpcf",
                            vSpawnOrigin: target_loc - (direction * spawn_radius) + (spawn_line_direction * position_ran) as Vector,
                            fDistance: travel_distance,
                            fStartRadius: collision_radius,
                            fEndRadius: collision_radius,
                            Source: caster,
                            fExpireTime: GameRules.GetGameTime() + 10.0,
                            vVelocity: Vector(direction.x, direction.y, 0) * speed as Vector,
                            UnitBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_DESTROY,
                            bMultipleHits: false,
                            bIgnoreSource: true,
                            TreeBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            bCutTrees: false,
                            bTreeFullCollision: false,
                            WallBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            GroundBehavior: ProjectileHelper.ELineProjectBehavior.PROJECTILES_NOTHING,
                            fGroundOffset: 80,
                            nChangeMax: 1,
                            bRecreateOnChange: false,
                            bDestroyImmediate: false,
                            bZCheck: false,
                            bGroundLock: true,
                            bProvidesVision: false,

                            UnitTest: GHandler.create(this, (pinfo: GLineProjectile, unit: IBaseNpc_Plus) => {
                                return unit.GetUnitName() != "npc_dummy_unit" && unit.GetTeamNumber() != caster.GetTeamNumber();
                            }),
                            OnUnitHit: GHandler.create(this, (pinfo: GLineProjectile, unit: IBaseNpc_Plus) => {
                                ability.OnProjectileHit_ExtraData(unit, pinfo.GetPosition(), {
                                    damage: damage,
                                    explosion_radius: explosion_radius
                                });
                            })
                        }
                    }
                    ProjectileHelper.LineProjectiles.CreateProjectile(projectile);
                });
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        let caster = this.GetCasterPlus();
        if (this.tempdata[ExtraData.index]) {
            this.tempdata[ExtraData.index] = undefined;
        }
        if (target) {
            if (ExtraData.raildamage) {
                if (target) {
                    ApplyDamage({
                        attacker: caster,
                        victim: target,
                        ability: this,
                        damage: ExtraData.raildamage,
                        damage_type: this.GetAbilityDamageType()
                    });
                    return false;
                }
            } else {
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, ExtraData.explosion_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of ipairs(enemies)) {
                    ApplyDamage({
                        attacker: caster,
                        victim: enemy,
                        ability: this,
                        damage: ExtraData.damage,
                        damage_type: this.GetAbilityDamageType()
                    });
                    if (ExtraData.tesla_stun_duration) {
                        enemy.AddNewModifier(caster, this, "modifier_imba_march_tesla_stun", {
                            duration: ExtraData.tesla_stun_duration * (1 - enemy.GetStatusResistance())
                        });
                    }
                    if (ExtraData.sticky_duration) {
                        enemy.AddNewModifier(caster, this, "modifier_imba_march_sticky_root", {
                            duration: ExtraData.sticky_duration * (1 - enemy.GetStatusResistance())
                        });
                    }
                    if (ExtraData.dismantle_duration) {
                        enemy.AddNewModifier(caster, this, "modifier_imba_march_dismantle", {
                            duration: ExtraData.dismantle_duration * (1 - enemy.GetStatusResistance())
                        });
                    }
                    if (ExtraData.drone_duration) {
                        enemy.AddNewModifier(caster, this, "modifier_imba_march_drone", {
                            duration: ExtraData.drone_duration * (1 - enemy.GetStatusResistance())
                        });
                    }
                }
            }
        }
        return true;
    }
    OnProjectileThink_ExtraData(location: Vector, ExtraData: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (ExtraData.flame_duration) {
                this.tempdata[ExtraData.index].counter = this.tempdata[ExtraData.index].counter || 0;
                if (this.tempdata[ExtraData.index].counter == 0) {
                    CreateModifierThinker(caster, this, "modifier_imba_march_flame_aura", {
                        duration: ExtraData.flame_duration,
                        flame_radius: ExtraData.flame_radius
                    }, location, caster.GetTeamNumber(), false);
                }
                this.tempdata[ExtraData.index].counter = this.tempdata[ExtraData.index].counter + 1;
                if (this.tempdata[ExtraData.index].counter > 9) {
                    this.tempdata[ExtraData.index].counter = 0;
                }
            }
            if (ExtraData.railgun_damage) {
                this.tempdata[ExtraData.index].counter = this.tempdata[ExtraData.index].counter || 0;
                if (this.tempdata[ExtraData.index].counter == 0) {
                    let projectile = {
                        Ability: this,
                        EffectName: "particles/units/heroes/hero_zuus/zuus_arc_lightning_head_c.vpcf",
                        vSpawnOrigin: location,
                        fDistance: ExtraData.railgun_range,
                        fStartRadius: ExtraData.railgun_radius,
                        fEndRadius: ExtraData.railgun_radius,
                        Source: caster,
                        bHasFrontalCone: true,
                        bReplaceExisting: false,
                        iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                        iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                        iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                        fExpireTime: GameRules.GetGameTime() + 10.0,
                        bDeleteOnHit: false,
                        vVelocity: Vector(ExtraData.direction_x, ExtraData.direction_y, 0) * 20000 as Vector,
                        bProvidesVision: false,
                        ExtraData: {
                            raildamage: ExtraData.railgun_damage
                        }
                    }
                    ProjectileManager.CreateLinearProjectile(projectile);
                    if (this.tempdata[ExtraData.index].lightningBolt) {
                        ParticleManager.ReleaseParticleIndex(this.tempdata[ExtraData.index].lightningBolt);
                        this.tempdata[ExtraData.index].lightningBolt = undefined;
                    }
                    this.tempdata[ExtraData.index].lightningBolt = ResHelper.CreateParticleEx("particles/units/heroes/hero_zuus/zuus_arc_lightning_.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
                    ParticleManager.SetParticleControl(this.tempdata[ExtraData.index].lightningBolt, 0, GetGroundPosition(location, caster));
                    ParticleManager.SetParticleControl(this.tempdata[ExtraData.index].lightningBolt, 1, GetGroundPosition(location, caster) + (Vector(ExtraData.direction_x, ExtraData.direction_y, 0) * ExtraData.railgun_range) as Vector);
                }
                ParticleManager.SetParticleControl(this.tempdata[ExtraData.index].lightningBolt, 0, GetGroundPosition(location, caster));
                this.tempdata[ExtraData.index].counter = this.tempdata[ExtraData.index].counter + 1;
                if (this.tempdata[ExtraData.index].counter > 29) {
                    this.tempdata[ExtraData.index].counter = 0;
                }
            }
        }
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_tinker_technomancy";
    }
    IsStealable(): boolean {
        return true;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_march_flame_aura extends BaseModifier_Plus {
    public radius: number;
    BeCreated(params: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            this.radius = params.flame_radius;
            let fire_fx = ResHelper.CreateParticleEx("particles/hero/tinker/tinker_march_fire_burn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleAlwaysSimulate(fire_fx);
            ParticleManager.SetParticleControl(fire_fx, 0, parent.GetAbsOrigin());
            this.AddParticle(fire_fx, false, false, -1, false, false);
        }
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
    IsAura(): boolean {
        return true;
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetModifierAura(): string {
        return "modifier_imba_march_flame_damage";
    }
}
@registerModifier()
export class modifier_imba_march_flame_damage extends BaseModifier_Plus {
    public damage_interval: number;
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.damage_interval = 0.5;
            this.StartIntervalThink(this.damage_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let flame_dmg_sec = ability.GetSpecialValueFor("flame_dmg_sec");
            ApplyDamage({
                attacker: this.GetCasterPlus(),
                victim: this.GetParentPlus(),
                ability: ability,
                damage: flame_dmg_sec * this.damage_interval,
                damage_type: ability.GetAbilityDamageType()
            });
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_batrider/batrider_firefly_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_march_tesla_stun extends BaseModifier_Plus {
    IsStunDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_stormspirit/stormspirit_electric_vortex_debuff_end.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let stun_fx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_stunned.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
            this.AddParticle(stun_fx, false, false, -1, false, false);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_march_sticky_root extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/units/heroes/hero_batrider/batrider_stickynapalm_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_march_dismantle extends BaseModifier_Plus {
    public dismantle_dmg_pct: number;
    BeCreated(params: any): void {
        this.dismantle_dmg_pct = this.GetAbilityPlus().GetTalentSpecialValueFor("dismantle_dmg_pct") * (-1);
        this.SetStackCount(1);
    }
    BeRefresh(params: any): void {
        this.dismantle_dmg_pct = this.GetAbilityPlus().GetTalentSpecialValueFor("dismantle_dmg_pct") * (-1);
        this.IncrementStackCount();
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.dismantle_dmg_pct * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_march_drone extends BaseModifier_Plus {
    BeCreated(params: any): void {
        let drone_order_interval = this.GetSpecialValueFor("drone_order_interval");
        this.StartIntervalThink(drone_order_interval);
    }
    IsDebuff(): boolean {
        return true;
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let direction = Vector(math.random(-1000, 1000), math.random(-1000, 1000), 0).Normalized();
            let location = parent.GetAbsOrigin() + (direction * 1000) as Vector;
            parent.Stop();
            parent.MoveToPosition(location);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true
        }
        return state;
    }
}
@registerAbility()
export class imba_tinker_technomancy extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "tinker_tinkermaster";
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        if (caster.HasAbility("imba_tinker_rearm")) {
            let ability = caster.findAbliityPlus<imba_tinker_rearm>("imba_tinker_rearm");
            ability.SetLevel((this.GetLevel() + 1));
        }
    }
    IsNetherWardStealable() {
        return false;
    }
    IsStealable(): boolean {
        return true;
    }
    IsHiddenWhenStolen(): boolean {
        return true;
    }
}
