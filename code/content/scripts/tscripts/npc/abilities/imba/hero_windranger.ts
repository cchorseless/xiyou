import { GameFunc } from "../../../GameFunc";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

@registerAbility()
export class imba_windranger_shackleshot extends BaseAbility_Plus {
    public responses: { [k: string]: string };

    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_windranger_shackle_shot_cooldown");
    }

    OnUpgrade(): void {
        if (this.GetLevel() == 1) {
            this.ToggleAutoCast();
        }
    }

    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        this.GetCasterPlus().EmitSound("Hero_Windrunner.ShackleshotCast");
        if (target.GetUnitName() == "") {
            let temp_thinker = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, undefined, {
                duration: 0.1
            }, target.GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
            ProjectileManager.CreateTrackingProjectile({
                Target: temp_thinker,
                Source: this.GetCasterPlus(),
                Ability: this,
                EffectName: "particles/units/heroes/hero_windrunner/windrunner_shackleshot.vpcf",
                iMoveSpeed: this.GetSpecialValueFor("arrow_speed"),
                bDodgeable: true,
                ExtraData: {
                    location_x: this.GetCasterPlus().GetAbsOrigin().x,
                    location_y: this.GetCasterPlus().GetAbsOrigin().y,
                    location_z: this.GetCasterPlus().GetAbsOrigin().z
                }
            });
        } else {
            ProjectileManager.CreateTrackingProjectile({
                Target: target,
                Source: this.GetCasterPlus(),
                Ability: this,
                EffectName: "particles/units/heroes/hero_windrunner/windrunner_shackleshot.vpcf",
                iMoveSpeed: this.GetSpecialValueFor("arrow_speed"),
                bDodgeable: true,
                ExtraData: {
                    location_x: this.GetCasterPlus().GetAbsOrigin().x,
                    location_y: this.GetCasterPlus().GetAbsOrigin().y,
                    location_z: this.GetCasterPlus().GetAbsOrigin().z
                }
            });
        }
    }

    SearchForShackleTarget(target: IBaseNpc_Plus, target_angle: number, ignore_list: IBaseNpc_Plus[], target_count: number) {
        let shackleTarget: IBaseNpc_Plus = undefined;
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), target.GetAbsOrigin(), undefined, this.GetSpecialValueFor("shackle_distance"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_FARTHEST, false);
        for (const enemy of (enemies)) {
            if (enemy != target && !ignore_list.includes(enemy) && math.abs(AngleDiff(target_angle, VectorToAngles(enemy.GetAbsOrigin() - target.GetAbsOrigin() as Vector).y)) <= this.GetSpecialValueFor("shackle_angle")) {
                shackleTarget = enemy;
                target.EmitSound("Hero_Windrunner.ShackleshotBind");
                enemy.EmitSound("Hero_Windrunner.ShackleshotBind");
                let shackleshot_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_windrunner/windrunner_shackleshot_pair.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, target, this.GetCasterPlus());
                ParticleManager.SetParticleControlEnt(shackleshot_particle, 1, enemy, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.SetParticleControl(shackleshot_particle, 2, Vector(this.GetTalentSpecialValueFor("stun_duration"), 0, 0));
                if (target.AddNewModifier) {
                    let target_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_windranger_shackle_shot", {
                        duration: this.GetTalentSpecialValueFor("stun_duration") * (1 - target.GetStatusResistance())
                    });
                    if (target_modifier) {
                        target_modifier.AddParticle(shackleshot_particle, false, false, -1, false, false);
                    }
                }
                if (enemy.AddNewModifier) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_windranger_shackle_shot", {
                        duration: this.GetTalentSpecialValueFor("stun_duration") * (1 - enemy.GetStatusResistance())
                    });
                }
                return;
            }
        }
        if (!shackleTarget && target.GetUnitName() != "npc_dota_thinker") {
            let trees = GridNav.GetAllTreesAroundPoint(target.GetAbsOrigin(), this.GetSpecialValueFor("shackle_distance"), false);
            for (const [_, tree] of GameFunc.iPair(trees)) {
                if (!ignore_list.includes(tree as any) && math.abs(AngleDiff(target_angle, VectorToAngles(tree.GetAbsOrigin() - target.GetAbsOrigin() as Vector).y)) <= this.GetSpecialValueFor("shackle_angle")) {
                    shackleTarget = tree as any;
                    if (target.AddNewModifier) {
                        let shackleshot_tree_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_windrunner/windrunner_shackleshot_pair.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, target, this.GetCasterPlus());
                        ParticleManager.SetParticleControl(shackleshot_tree_particle, 1, tree.GetAbsOrigin());
                        ParticleManager.SetParticleControl(shackleshot_tree_particle, 2, Vector(this.GetTalentSpecialValueFor("stun_duration"), 0, 0));
                        let target_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_windranger_shackle_shot", {
                            duration: this.GetTalentSpecialValueFor("stun_duration") * (1 - target.GetStatusResistance())
                        });
                        if (target_modifier) {
                            target_modifier.AddParticle(shackleshot_tree_particle, false, false, -1, false, false);
                        }
                    }
                    return;
                }
            }
        }
        if (!shackleTarget) {
            let shackleshot_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_windrunner/windrunner_shackleshot_single.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, target, this.GetCasterPlus());
            ParticleManager.ReleaseParticleIndex(shackleshot_particle);
        }
        return shackleTarget;
    }

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (!ExtraData.bSplinterSister || ExtraData.bSplinterSister != 1) {
            if (!target || (target.IsMagicImmune && target.IsMagicImmune()) || (target.TriggerSpellAbsorb && target.TriggerSpellAbsorb(this))) {
                return;
            }
            let shackled_targets: IBaseNpc_Plus[] = []
            target.EmitSound("Hero_Windrunner.ShackleshotStun");
            let next_target = target;
            for (let targets = 0; targets < this.GetSpecialValueFor("shackle_count"); targets++) {
                if (next_target) {
                    next_target = this.SearchForShackleTarget(next_target, VectorToAngles(next_target.GetAbsOrigin() - Vector(ExtraData.location_x, ExtraData.location_y, ExtraData.location_z) as Vector).y, shackled_targets, targets);
                    if (next_target) {
                        shackled_targets.push(next_target);
                        if (targets == 0 && this.GetCasterPlus().GetUnitName().includes("windrunner") && RollPercentage(35)) {
                            if (!this.responses) {
                                this.responses = {
                                    "1": "windrunner_wind_ability_shackleshot_05",
                                    "2": "windrunner_wind_ability_shackleshot_06",
                                    "3": "windrunner_wind_ability_shackleshot_07"
                                }
                            }
                            this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses));
                        }
                    } else if (targets == 0) {
                        let stun_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_stunned", {
                            duration: this.GetSpecialValueFor("fail_stun_duration") * (1 - target.GetStatusResistance())
                        });
                        if (stun_modifier) {
                            let shackleshot_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_windrunner/windrunner_shackleshot_single.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, target, this.GetCasterPlus());
                            ParticleManager.SetParticleControlForward(shackleshot_particle, 2, Vector(ExtraData.location_x, ExtraData.location_y, ExtraData.location_z as Vector).Normalized());
                            stun_modifier.AddParticle(shackleshot_particle, false, false, -1, false, false);
                        }
                    }
                } else {
                    return;
                }
            }
        } else if (target) {
            EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), "Hero_Windrunner.ProjectileImpact", this.GetCasterPlus());
            this.GetCasterPlus().PerformAttack(target, true, true, true, true, false, false, false);
        }
    }

    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_windranger_shackle_shot_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_windranger_shackle_shot_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_windranger_shackle_shot_cooldown"), "modifier_special_bonus_imba_windranger_shackle_shot_cooldown", {});
        }
    }
}

@registerModifier()
export class modifier_imba_windranger_shackle_shot extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetCasterPlus() && keys.target == this.GetParentPlus() && !keys.no_attack_cooldown && this.GetAbilityPlus() && this.GetAbilityPlus().GetAutoCastState()) {
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetCasterPlus().Script_GetAttackRange(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_ANY_ORDER, false))) {
                if (enemy != this.GetParentPlus() && enemy.FindModifierByNameAndCaster("modifier_imba_windranger_shackle_shot", this.GetCasterPlus()) && this.GetAbilityPlus()) {
                    EmitSoundOnLocationWithCaster(this.GetParentPlus().GetAbsOrigin(), "Hero_Windrunner.Attack", this.GetCasterPlus());
                    ProjectileManager.CreateTrackingProjectile({
                        Target: enemy,
                        Source: this.GetParentPlus(),
                        Ability: this.GetAbilityPlus(),
                        EffectName: this.GetCasterPlus().GetRangedProjectileName() || "particles/units/heroes/hero_windrunner/windrunner_base_attack.vpcf",
                        iMoveSpeed: this.GetCasterPlus().GetProjectileSpeed() || 1250,
                        bDrawsOnMinimap: false,
                        bDodgeable: true,
                        bIsAttack: true,
                        bVisibleToEnemies: true,
                        bReplaceExisting: false,
                        flExpireTime: GameRules.GetGameTime() + 10.0,
                        bProvidesVision: false,
                        ExtraData: {
                            bSplinterSister: true
                        }
                    });
                }
            }
        }
    }
}

@registerAbility()
export class imba_windranger_powershot extends BaseAbility_Plus {
    public powershot_modifier: any;

    GetIntrinsicModifierName(): string {
        return "modifier_imba_windranger_powershot";
    }

    OnSpellStart(): void {
        EmitSoundOnLocationForAllies(this.GetCasterPlus().GetAbsOrigin(), "Ability.PowershotPull", this.GetCasterPlus());
        if (!this.powershot_modifier || this.powershot_modifier.IsNull()) {
            this.powershot_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_windranger_powershot", this.GetCasterPlus());
        }
        if (this.GetCasterPlus().HasAbility("imba_windranger_advancement")) {
            this.GetCasterPlus().findAbliityPlus<imba_windranger_advancement>("imba_windranger_advancement").SetLevel(1);
        }
        if (this.GetCasterPlus().HasAbility("imba_windranger_focusfire_vanilla_enhancer")) {
            this.GetCasterPlus().findAbliityPlus<imba_windranger_focusfire_vanilla_enhancer>("imba_windranger_focusfire_vanilla_enhancer").SetLevel(1);
        }
    }

    OnChannelThink(flInterval: number): void {
        this.powershot_modifier.SetStackCount(math.min((GameRules.GetGameTime() - this.GetChannelStartTime()) * 100, 100));
    }

    OnChannelFinish(bInterrupted: boolean): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        if (this.powershot_modifier) {
            this.powershot_modifier.SetStackCount(0);
        }
        if (bInterrupted || !this.GetAutoCastState()) {
            let channel_pct = (GameRules.GetGameTime() - this.GetChannelStartTime()) / this.GetChannelTime();
            if (channel_pct < this.GetSpecialValueFor("scattershot_min") * 0.01 || channel_pct > this.GetSpecialValueFor("scattershot_max") * 0.01) {
                this.FirePowershot(channel_pct);
            } else {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_windranger_powershot_scattershot", {
                    duration: this.GetSpecialValueFor("scattershot_interval") * (this.GetSpecialValueFor("scattershot_shots") - 1),
                    channel_pct: channel_pct,
                    cursor_pos_x: this.GetCursorPosition().x,
                    cursor_pos_y: this.GetCursorPosition().y,
                    cursor_pos_z: this.GetCursorPosition().z
                });
            }
        } else {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_windranger_powershot_overstretch", {});
        }
    }

    FirePowershot(channel_pct: number, overstretch_bonus = 0) {
        let powershot_dummy = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, undefined, {}, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
        powershot_dummy.EmitSound("Ability.Powershot");
        powershot_dummy.TempData().units_hit = 0;
        let powershot_particle = "particles/units/heroes/hero_windrunner/windrunner_spell_powershot.vpcf";
        if (channel_pct >= this.GetSpecialValueFor("godshot_min") * 0.01 && channel_pct <= this.GetSpecialValueFor("godshot_max") * 0.01) {
            powershot_particle = "particles/units/heroes/hero_windrunner/windrunner_spell_powershot_godshot.vpcf";
            powershot_dummy.EmitSound("Hero_Windranger.Powershot_Godshot");
        }
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2);
        if (!overstretch_bonus) {
            overstretch_bonus = 0;
        }
        ProjectileManager.CreateLinearProjectile({
            Source: this.GetCasterPlus(),
            Ability: this,
            vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            EffectName: powershot_particle,
            fDistance: this.GetSpecialValueFor("arrow_range") + overstretch_bonus + this.GetCasterPlus().GetCastRangeBonus(),
            fStartRadius: this.GetSpecialValueFor("arrow_width"),
            fEndRadius: this.GetSpecialValueFor("arrow_width"),
            vVelocity: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * this.GetSpecialValueFor("arrow_speed") * Vector(1, 1, 0) as Vector,
            bProvidesVision: true,
            iVisionRadius: this.GetSpecialValueFor("vision_radius"),
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            ExtraData: {
                dummy_index: powershot_dummy.entindex(),
                channel_pct: channel_pct * 100
            }
        });
    }

    OnProjectileThink_ExtraData(location: Vector, data: any): void {
        if (data.dummy_index) {
            EntIndexToHScript(data.dummy_index).SetAbsOrigin(location);
        }
        GridNav.DestroyTreesAroundPoint(location, 75, true);
    }

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        let unit = EntIndexToHScript(data.dummy_index) as IBaseNpc_Plus;;
        if (target && data.dummy_index && unit && !unit.IsNull() && unit.TempData().units_hit) {
            EmitSoundOnLocationWithCaster(location, "Hero_Windrunner.PowershotDamage", this.GetCasterPlus());
            let damage = this.GetTalentSpecialValueFor("powershot_damage") * data.channel_pct * 0.01 * ((100 - this.GetSpecialValueFor("damage_reduction")) * 0.01) ^ unit.TempData().units_hit;
            let damage_type = this.GetAbilityDamageType();
            if (data.channel_pct >= this.GetSpecialValueFor("godshot_min") && data.channel_pct <= this.GetSpecialValueFor("godshot_max")) {
                damage = this.GetTalentSpecialValueFor("powershot_damage") * this.GetSpecialValueFor("godshot_damage_pct") * 0.01;
                damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_stunned", {
                    duration: this.GetSpecialValueFor("godshot_stun_duration") * (1 - target.GetStatusResistance())
                });
            } else if (data.channel_pct >= this.GetSpecialValueFor("scattershot_min") && data.channel_pct <= this.GetSpecialValueFor("scattershot_max")) {
                damage = this.GetTalentSpecialValueFor("powershot_damage") * this.GetSpecialValueFor("scattershot_damage_pct") * 0.01 * ((100 - this.GetSpecialValueFor("damage_reduction")) * 0.01) ^ unit.TempData().units_hit;
            }
            ApplyDamage({
                victim: target,
                damage: damage,
                damage_type: damage_type,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            });
            unit.TempData().units_hit = unit.TempData().units_hit + 1;
        } else if (data.dummy_index) {
            EntIndexToHScript(data.dummy_index).StopSound("Ability.Powershot");
            EntIndexToHScript(data.dummy_index).RemoveSelf();
        }
    }
}

@registerModifier()
export class modifier_imba_windranger_powershot extends BaseModifier_Plus {
    IsHidden(): boolean {
        return this.GetStackCount() <= 0;
    }
}

@registerModifier()
export class modifier_imba_windranger_powershot_scattershot extends BaseModifier_Plus {
    public channel_pct: number;
    public cursor_pos: any;
    public scattershot_interval: number;
    public scattershot_deviation: any;

    IsPurgable(): boolean {
        return false;
    }

    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.channel_pct = params.channel_pct;
        this.cursor_pos = Vector(params.cursor_pos_x, params.cursor_pos_y, params.cursor_pos_z);
        this.scattershot_interval = this.GetSpecialValueFor("scattershot_interval");
        this.scattershot_deviation = this.GetSpecialValueFor("scattershot_deviation");
        this.OnIntervalThink();
        this.StartIntervalThink(this.scattershot_interval);
    }

    OnIntervalThink(): void {
        if (this.GetAbilityPlus()) {
            this.GetParentPlus().SetCursorPosition(RotatePosition(this.GetParentPlus().GetAbsOrigin(), QAngle(0, RandomInt(-this.scattershot_deviation, this.scattershot_deviation), 0), this.cursor_pos));
            this.GetAbilityPlus<imba_windranger_powershot>().FirePowershot(this.channel_pct);
        }
    }
}

@registerModifier()
export class modifier_imba_windranger_powershot_overstretch extends BaseModifier_Plus {
    public overstretch_bonus_range_per_second: number;
    public destroy_orders: any;

    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.overstretch_bonus_range_per_second = this.GetSpecialValueFor("overstretch_bonus_range_per_second");
        } else {
            this.overstretch_bonus_range_per_second = 0;
        }
        if (!IsServer()) {
            return;
        }
        this.destroy_orders = {
            [dotaunitorder_t.DOTA_UNIT_ORDER_STOP]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CONTINUE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE]: true
        }
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2);
        this.StartIntervalThink(1);
    }

    OnIntervalThink(): void {
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2);
        this.IncrementStackCount();
    }

    BeDestroy(): void {
        if (!IsServer() || !this.GetAbilityPlus()) {
            return;
        }
        this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2);
        this.GetParentPlus().SetCursorPosition(this.GetParentPlus().GetAbsOrigin() + this.GetParentPlus().GetForwardVector() as Vector);
        this.GetAbilityPlus<imba_windranger_powershot>().FirePowershot(1, this.GetStackCount() * this.overstretch_bonus_range_per_second);
    }

    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        };
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (keys.unit == this.GetParentPlus() && this.destroy_orders[keys.order_type]) {
            this.Destroy();
        }
    }
}

@registerAbility()
export class imba_windranger_windrun extends BaseAbility_Plus {
    public responses: { [k: string]: string };

    GetCooldown(level: number): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCooldown(level);
        } else {
            return 0;
        }
    }

    OnInventoryContentsChanged(): void {
        if (this.GetCasterPlus().HasScepter()) {
            if (this.GetCasterPlus().HasModifier("modifier_generic_charges")) {
                let has_rightful_modifier = false;
                for (const [_, mod] of GameFunc.iPair(this.GetCasterPlus().FindAllModifiersByName("modifier_generic_charges"))) {
                    if (mod.GetAbilityPlus().GetAbilityName() == this.GetAbilityName()) {
                        has_rightful_modifier = true;
                        return;
                    }
                }
                if (has_rightful_modifier == false) {
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_charges", {});
                }
            } else {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_charges", {});
            }
        }
    }

    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Ability.Windrun");
        if (this.GetCasterPlus().GetUnitName().includes("windrunner") && RollPercentage(75)) {
            if (!this.responses) {
                this.responses = {
                    "1": "windrunner_wind_spawn_04",
                    "2": "windrunner_wind_move_08",
                    "3": "windrunner_wind_move_10"
                }
            }
            this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses));
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_windranger_windrun", {
            duration: this.GetSpecialValueFor("duration")
        });
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_windranger_windrun_invisibility")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_windranger_windrun_invis", {
                duration: this.GetSpecialValueFor("duration")
            });
        }
    }
}

@registerModifier()
export class modifier_imba_windranger_windrun_handler extends BaseModifier_Plus {
}

@registerModifier()
export class modifier_imba_windranger_windrun extends BaseModifier_Plus {
    public movespeed_bonus_pct: number;
    public evasion_pct_tooltip: number;
    public scepter_bonus_movement: number;
    public radius: number;
    public gale_enchantment_radius: number;
    public gale_enchantment_duration: number;

    GetEffectName(): string {
        return "particles/units/heroes/hero_windrunner/windrunner_windrun.vpcf";
    }

    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.movespeed_bonus_pct = this.GetSpecialValueFor("movespeed_bonus_pct");
            this.evasion_pct_tooltip = this.GetSpecialValueFor("evasion_pct_tooltip");
            this.scepter_bonus_movement = this.GetSpecialValueFor("scepter_bonus_movement");
            this.radius = this.GetSpecialValueFor("radius");
            this.gale_enchantment_radius = this.GetSpecialValueFor("gale_enchantment_radius");
            this.gale_enchantment_duration = this.GetSpecialValueFor("gale_enchantment_duration");
        } else {
            this.movespeed_bonus_pct = 0;
            this.evasion_pct_tooltip = 0;
            this.scepter_bonus_movement = 0;
            this.radius = 0;
            this.gale_enchantment_radius = 0;
            this.gale_enchantment_duration = 0;
        }
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(0.1);
    }

    OnIntervalThink(): void {
        for (const [_, ally] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.gale_enchantment_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            if (this.GetCasterPlus() == this.GetParentPlus() && ally != this.GetCasterPlus()) {
                ally.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_windranger_windrun", {
                    duration: this.gale_enchantment_duration
                });
            }
        }
    }

    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().StopSound("Ability.Windrun");
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetCasterPlus()) {
            if (!this.GetCasterPlus().HasScepter()) {
                return this.movespeed_bonus_pct;
            } else {
                return this.movespeed_bonus_pct + this.scepter_bonus_movement;
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        return this.evasion_pct_tooltip;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT)
    CC_GetModifierIgnoreMovespeedLimit(): 0 | 1 {
        if (this.GetCasterPlus() && this.GetCasterPlus().HasScepter()) {
            return 1;
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "windrun";
    }

    IsAura(): boolean {
        return true;
    }

    GetModifierAura(): string {
        return "modifier_imba_windranger_windrun_slow";
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

    IsAuraActiveOnDeath(): boolean {
        return false;
    }

    GetAuraDuration(): number {
        return 2.5;
    }
}

@registerModifier()
export class modifier_imba_windranger_windrun_slow extends BaseModifier_Plus {
    public enemy_movespeed_bonus_pct: number;

    GetEffectName(): string {
        return "particles/units/heroes/hero_windrunner/windrunner_windrun_slow.vpcf";
    }

    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.enemy_movespeed_bonus_pct = this.GetSpecialValueFor("enemy_movespeed_bonus_pct");
        } else {
            this.enemy_movespeed_bonus_pct = 0;
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.enemy_movespeed_bonus_pct;
    }
}

@registerModifier()
export class modifier_imba_windranger_windrun_invis extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true
        };
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL,
            2: Enum_MODIFIER_EVENT.ON_ATTACK,
            3: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !keys.no_attack_cooldown) {
            this.Destroy();
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus() && keys.ability != this.GetAbilityPlus() && keys.ability.GetAbilityName() != "imba_windranger_advancement") {
            this.Destroy();
        }
    }
}

@registerAbility()
export class imba_windranger_advancement extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }

    OnSpellStart(): void {
        ProjectileHelper.ProjectileDodgePlus(this.GetCasterPlus());
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_motion_controller", {
            distance: this.GetSpecialValueFor("advancement_distance"),
            direction_x: this.GetCasterPlus().GetForwardVector().x,
            direction_y: this.GetCasterPlus().GetForwardVector().y,
            direction_z: this.GetCasterPlus().GetForwardVector().z,
            duration: this.GetSpecialValueFor("advancement_duration"),
            height: this.GetSpecialValueFor("advancement_height"),
            bGroundStop: true,
            bDecelerate: false,
            bInterruptible: false,
            bIgnoreTenacity: true
        });
    }
}

@registerModifier()
export class modifier_imba_windranger_advancement extends BaseModifier_Plus {
}

@registerAbility()
export class imba_windranger_focusfire_vanilla_enhancer extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }

    GetIntrinsicModifierName(): string {
        return "modifier_imba_windranger_focusfire_vanilla_enhancer";
    }
}

@registerModifier()
export class modifier_imba_windranger_focusfire_vanilla_enhancer extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public target: IBaseNpc_Plus;

    IsHidden(): boolean {
        return true;
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus() && keys.ability.GetAbilityName() == "windrunner_focusfire") {
            this.ability = keys.ability as IBaseAbility_Plus;
            this.target = keys.ability.GetCursorTarget();
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && this.GetParentPlus().HasModifier("modifier_windrunner_focusfire") && this.target && !this.target.IsNull() && this.target.IsAlive() && this.target == keys.target && GFuncRandom.PRD(this.ability.GetSpecialValueFor("ministun_chance"), this)) {
            keys.target.EmitSound("DOTA_Item.MKB.Minibash");
            keys.target.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_stunned", {
                duration: 0.1 * (1 - keys.target.GetStatusResistance())
            });
        }
    }
}

@registerAbility()
export class imba_windranger_focusfire extends BaseAbility_Plus {
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Ability.Focusfire");
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_windranger_focusfire", {
            duration: this.GetDuration()
        });
    }

    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_windranger_focusfire_damage_reduction") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_windranger_focusfire_damage_reduction")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_windranger_focusfire_damage_reduction"), "modifier_special_bonus_imba_windranger_focusfire_damage_reduction", {});
        }
    }
}

@registerModifier()
export class modifier_imba_windranger_focusfire extends BaseModifier_Plus {
    public bonus_attack_speed: number;
    public focusfire_damage_reduction: number;
    public focusfire_fire_on_the_move: any;
    public bFocusing: any;
    public target: IBaseNpc_Plus;

    IsPurgable(): boolean {
        return false;
    }

    BeCreated(params: any): void {
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed");
        this.focusfire_damage_reduction = this.GetSpecialValueFor("focusfire_damage_reduction");
        this.focusfire_fire_on_the_move = this.GetSpecialValueFor("focusfire_fire_on_the_move");
        if (!IsServer()) {
            return;
        }
        this.bFocusing = true;
        this.target = this.GetAbilityPlus().GetCursorTarget();
        this.StartIntervalThink(FrameTime());
    }

    OnIntervalThink(): void {
        if (this.GetParentPlus().AttackReady() && this.target && !this.target.IsNull() && this.target.IsAlive() && (this.target.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() <= this.GetParentPlus().Script_GetAttackRange() && this.bFocusing) {
            this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_ATTACK);
            this.GetParentPlus().PerformAttack(this.target, true, true, false, true, true, false, false);
        }
    }

    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {};
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            4: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (IsClient() || this.GetParentPlus().GetAttackTarget() == this.target) {
            return this.bonus_attack_speed;
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (IsClient() || this.GetParentPlus().GetAttackTarget() == this.target) {
            return this.focusfire_damage_reduction;
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "focusfire";
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (keys.unit == this.GetParentPlus()) {
            if (keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_STOP || keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CONTINUE || !this.GetParentPlus().AttackReady()) {
                this.bFocusing = false;
            } else {
                this.bFocusing = true;
            }
        }
    }
}

@registerModifier()
export class modifier_special_bonus_imba_windranger_powershot_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_windranger_shackle_shot_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_windranger_windrun_invisibility extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_windranger_shackle_shot_cooldown extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_windranger_focusfire_damage_reduction extends BaseModifier_Plus {
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
