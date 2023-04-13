
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { EventHelper } from "../../../helper/EventHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_medusa_split_shot extends BaseAbility_Plus {
    public toggle_state: any;
    CastFilterResult(): UnitFilterResult {
        if (!IsServer()) {
            return;
        }
        if (GameFunc.GetCount(this.GetCasterPlus().FindAllModifiersByName("modifier_imba_medusa_enchanted_aim")) >= this.GetSpecialValueFor("enchanted_aim_stack_limit")) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        } else {
            return UnitFilterResult.UF_SUCCESS;
        }
    }
    GetCustomCastError(): string {
        if (!IsServer()) {
            return;
        }
        return "#dota_hud_error_medusa_enchanted_aim_limit";
    }
    OnAbilityPhaseStart(): boolean {
        if (GameFunc.GetCount(this.GetCasterPlus().FindAllModifiersByName("modifier_imba_medusa_enchanted_aim")) >= this.GetSpecialValueFor("enchanted_aim_stack_limit")) {
            EventHelper.ErrorMessage("Cannot exceed " + this.GetSpecialValueFor("enchanted_aim_stack_limit") + " stacks of Enchanted Aim.", this.GetCasterPlus().GetPlayerID(),);
            return false;
        } else {
            return true;
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_medusa_split_shot", this.GetCasterPlus()) == 0) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
    }
    // GetManaCost(level: number): number {
    //     if (this.GetCasterPlus().findBuffStack("modifier_imba_medusa_split_shot", this.GetCasterPlus()) == 0) {
    //         return 0;
    //     } else {
    //         return this.GetCasterPlus().GetMaxMana() * this.GetSpecialValueFor("enchanted_aim_mana_loss_pct") * 0.01;
    //     }
    // }
    ResetToggleOnRespawn(): boolean {
        return false;
    }
    OnOwnerSpawned(): void {
        if (this.toggle_state) {
            this.ToggleAbility();
        }
    }
    OnOwnerDied(): void {
        this.toggle_state = this.GetToggleState();
    }
    OnUpgrade(): void {
        if (this.GetCasterPlus().IsIllusion() && this.GetCasterPlus().GetPlayerOwner() && this.GetCasterPlus() && this.GetCasterPlus().IsRealUnit() && this.GetCasterPlus().FindAbilityByName(this.GetAbilityName()) && this.GetCasterPlus().FindAbilityByName(this.GetAbilityName()).GetToggleState() && !this.GetToggleState()) {
            this.ToggleAbility();
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_medusa_split_shot";
    }
    OnToggle(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetToggleState()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_medusa_serpent_shot", {});
        } else {
            this.GetCasterPlus().RemoveModifierByNameAndCaster("modifier_imba_medusa_serpent_shot", this.GetCasterPlus());
        }
    }
    OnSpellStart(): void {
        if (this.GetAutoCastState()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_medusa_enchanted_aim", {
                duration: this.GetSpecialValueFor("enchanted_aim_duration")
            });
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        if (!this.GetToggleState()) {
            this.ToggleAbility();
        }
        return false
    }
}
@registerModifier()
export class modifier_imba_medusa_split_shot extends BaseModifier_Plus {
    public split_shot_target: any;
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK,
            2: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            4: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetParentPlus() && keys.target && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && !keys.no_attack_cooldown && !this.GetParentPlus().PassivesDisabled() && this.GetAbilityPlus().IsTrained()) {
            let enemies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetParentPlus().Script_GetAttackRange() + this.GetSpecialValueFor("split_shot_bonus_range"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_ANY_ORDER, false);
            let target_number = 0;
            let apply_modifiers = this.GetParentPlus().HasTalent("special_bonus_imba_medusa_split_shot_modifiers") != null;
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != keys.target) {
                    this.split_shot_target = true;
                    this.GetParentPlus().PerformAttack(enemy, false, apply_modifiers, true, true, true, false, false);
                    this.split_shot_target = false;
                    target_number = target_number + 1;
                    if (target_number >= this.GetAbilityPlus().GetTalentSpecialValueFor("arrow_count")) {
                        return;
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        if (!IsServer()) {
            return;
        }
        if (this.split_shot_target) {
            return this.GetSpecialValueFor("damage_modifier");
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "split_shot";
    }
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
export class modifier_imba_medusa_serpent_shot extends BaseModifier_Plus {
    public damage_modifier: number;
    public serpent_shot_damage_pct: number;
    public serpent_shot_mana_burn_pct: number;
    public records: any;
    public attack: any;
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.damage_modifier = this.GetSpecialValueFor("damage_modifier");
        this.serpent_shot_damage_pct = this.GetSpecialValueFor("serpent_shot_damage_pct");
        this.serpent_shot_mana_burn_pct = this.GetSpecialValueFor("serpent_shot_mana_burn_pct");
        this.records = {}
        if (!IsServer()) {
            return;
        }
        this.attack = this.GetParentPlus().GetAverageTrueAttackDamage(this.GetParentPlus()) * this.serpent_shot_damage_pct * 0.01;
        this.SetStackCount(this.attack);
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(0);
        this.attack = this.GetParentPlus().GetAverageTrueAttackDamage(this.GetParentPlus()) * this.serpent_shot_damage_pct * 0.01;
        this.SetStackCount(this.attack);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_MAGICAL,
            6: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE,
            7: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    CC_OnAttackRecord(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetParentPlus()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
                return;
            }
            this.records[keys.record] = true;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    CC_OnAttackRecordDestroy(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            this.records[keys.record] = undefined;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    CC_GetModifierProjectileName( /** keys */): string {
        return "particles/units/heroes/hero_medusa/medusa_serpent_shot_particle.vpcf";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS)
    CC_GetModifierPreAttack_BonusDamage( /** keys */): number {
        // if ((!keys.target || (keys.target && !keys.target.IsBuilding() && !keys.target.IsOther()))) {
        return (this.GetStackCount() / (this.serpent_shot_damage_pct * 0.01)) * (100 - this.serpent_shot_damage_pct) * 0.01 * (-1);
        // }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_MAGICAL)
    CC_GetModifierProcAttack_BonusDamage_Magical(keys: ModifierAttackEvent): number {
        if (!IsServer() || keys.target.IsBuilding() || keys.target.IsOther() || keys.target.IsMagicImmune()) {
            return;
        }
        if (this.records[keys.record]) {
            return this.GetStackCount();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(keys: ModifierAttackEvent): number {
        if (keys.attacker == this.GetParentPlus() && this.GetStackCount() > 0 && (!keys.target || (keys.target && !keys.target.IsBuilding() && !keys.target.IsOther()))) {
            return -100;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.attacker == this.GetParentPlus() && keys.damage_category == 1 && keys.damage_type == 1 && !keys.unit.IsBuilding() && !keys.unit.IsOther() && !keys.unit.IsMagicImmune() && this.records[keys.record]) {
            let damage_dealt = keys.damage;
            if (keys.original_damage <= 0) {
                let damageTable = {
                    victim: keys.unit,
                    damage: this.GetStackCount() * (100 + this.damage_modifier) * 0.01,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetParentPlus(),
                    ability: this.GetAbilityPlus()
                }
                damage_dealt = ApplyDamage(damageTable);
            }
            keys.unit.ReduceMana(damage_dealt * this.serpent_shot_mana_burn_pct * 0.01);
            let rpath = "particles/econ/items/antimage/antimage_weapon_basher_ti5/am_manaburn_basher_ti_5.vpcf";
            // "particles/item/diffusal/diffusal_manaburn_3.vpcf"
            let manaburn_particle = ResHelper.CreateParticleEx(rpath, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.unit);
            ParticleManager.ReleaseParticleIndex(manaburn_particle);
        }
    }
}
@registerModifier()
export class modifier_imba_medusa_enchanted_aim extends BaseModifier_Plus {
    public attack_range: number;
    public incoming_damage: number;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        this.attack_range = this.GetSpecialValueFor("enchanted_aim_bonus_attack_range");
        this.incoming_damage = this.GetSpecialValueFor("enchanted_aim_bonus_incoming_damage");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        return this.attack_range;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.incoming_damage;
    }
}
@registerAbility()
export class imba_medusa_mystic_snake extends BaseAbility_Plus {
    GetCooldown(level: number): number {
        if (this.GetCasterPlus().GetLevel() >= 20) {
            return this.GetSpecialValueFor("innate_cooldown");
        } else {
            return super.GetCooldown(level);
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_Medusa.MysticSnake.Cast");
        if (this.GetCasterPlus().GetUnitName().includes("medusa") && RollPercentage(75)) {
            let random_response = RandomInt(1, 6);
            if (random_response >= 2) {
                random_response = random_response + 1;
            }
            this.GetCasterPlus().EmitSound("medusa_medus_mysticsnake_0" + random_response);
        }
        let particle_cast = ResHelper.CreateParticleEx("particles/units/heroes/hero_medusa/medusa_mystic_snake_cast.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(particle_cast, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(particle_cast);
        let particle_snake = ResHelper.CreateParticleEx("particles/units/heroes/hero_medusa/medusa_mystic_snake_projectile.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(particle_snake, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(particle_snake, 1, this.GetCursorTarget().GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_snake, 2, Vector(this.GetSpecialValueFor("initial_speed"), 0, 0));
        let targets = this.GetCursorTarget().GetEntityIndex();
        let snake = {
            Target: this.GetCursorTarget(),
            Source: this.GetCasterPlus(),
            Ability: this,
            iMoveSpeed: this.GetSpecialValueFor("initial_speed"),
            bDrawsOnMinimap: false,
            bDodgeable: false,
            bIsAttack: false,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            flExpireTime: GameRules.GetGameTime() + 10,
            bProvidesVision: true,
            iVisionRadius: 100,
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            ExtraData: {
                bounces: 0,
                mana_stolen: 0,
                damage: this.GetSpecialValueFor("snake_damage"),
                particle_snake: particle_snake,
                speed: this.GetSpecialValueFor("initial_speed")
            }
        }
        ProjectileManager.CreateTrackingProjectile(snake);
    }
    OnProjectileHit_ExtraData(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector, ExtraData: any): boolean | void {
        if (!IsServer() || !hTarget) {
            return;
        }
        if (hTarget && !hTarget.IsRealUnit()) { return }
        if (hTarget == this.GetCasterPlus()) {
            if (this.GetCasterPlus().GiveMana) {
                this.GetCasterPlus().GiveMana(ExtraData.mana_stolen);
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MANA_ADD, this.GetCasterPlus(), ExtraData.mana_stolen, undefined);
            }
            this.GetCasterPlus().EmitSound("Hero_Medusa.MysticSnake.Return");
            let return_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_medusa/medusa_mystic_snake_impact_return.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.SetParticleControlEnt(return_particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(return_particle, 3, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(return_particle);
            ParticleManager.DestroyParticle(ExtraData.particle_snake, false);
            ParticleManager.ReleaseParticleIndex(ExtraData.particle_snake);
            return;
        }
        if (hTarget.IsAlive() && !hTarget.IsInvulnerable() && !hTarget.IsOutOfGame()) {
            if (!hTarget.TriggerSpellAbsorb(this)) {
                hTarget.EmitSound("Hero_Medusa.MysticSnake.Target");
                if (hTarget.GetMana() && hTarget.GetMaxMana() && !hTarget.IsIllusion()) {
                    let target_mana = hTarget.GetMana();
                    let mana_to_steal = hTarget.GetMaxMana() * (this.GetTalentSpecialValueFor("snake_mana_steal") + (this.GetSpecialValueFor("mana_thief_steal") * ExtraData.bounces)) * 0.01;
                    hTarget.ReduceMana(mana_to_steal);
                    if (target_mana < mana_to_steal) {
                        ExtraData.mana_stolen = ExtraData.mana_stolen + math.max(target_mana, 0);
                    } else {
                        ExtraData.mana_stolen = ExtraData.mana_stolen + math.max(mana_to_steal, 0);
                    }
                }
                let damageTable = {
                    victim: hTarget,
                    damage: ExtraData.damage,
                    damage_type: this.GetAbilityDamageType(),
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this
                }
                if (hTarget.HasModifier("modifier_imba_medusa_stone_gaze_stone")) {
                    damageTable.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
                }
                ApplyDamage(damageTable);
                if (this.GetCasterPlus().HasScepter()) {
                    let stone_gaze_ability = this.GetCasterPlus().findAbliityPlus<imba_medusa_stone_gaze>("imba_medusa_stone_gaze");
                    if (stone_gaze_ability && stone_gaze_ability.IsTrained()) {
                        hTarget.AddNewModifier(this.GetCasterPlus(), stone_gaze_ability, "modifier_imba_medusa_stone_gaze_stone", {
                            duration: this.GetSpecialValueFor("stone_form_scepter_base") + this.GetSpecialValueFor("stone_form_scepter_increment") * ExtraData.bounces,
                            bonus_physical_damage: stone_gaze_ability.GetSpecialValueFor("bonus_physical_damage")
                        });
                    }
                }
                hTarget.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_medusa_mystic_snake_slow", {
                    duration: this.GetSpecialValueFor("slow_duration") * (1 - hTarget.GetStatusResistance())
                });
                let tracker_modifier = hTarget.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_medusa_mystic_snake_tracker", {
                    duration: this.GetSpecialValueFor("myotoxin_duration")
                }) as modifier_imba_medusa_mystic_snake_tracker;
                if (tracker_modifier) {
                    tracker_modifier.particle_snake = ExtraData.particle_snake;
                }
                ExtraData.bounces = ExtraData.bounces + 1;
            } else {
                this.ReturnCB(hTarget, vLocation, ExtraData);
            }
        }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), vLocation, undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false);
        if (ExtraData.bounces >= this.GetSpecialValueFor("snake_jumps") || GameFunc.GetCount(enemies) <= 1) {
            this.ReturnCB(hTarget, vLocation, ExtraData);
        } else {
            let found_target = false;
            for (const enemy of (enemies)) {
                if (enemy != hTarget) {
                    let tracker_modifiers = enemy.FindAllModifiersByName("modifier_imba_medusa_mystic_snake_tracker");
                    let proceed = true;
                    for (const modifier of (tracker_modifiers as modifier_imba_medusa_mystic_snake_tracker[])) {
                        if (modifier.particle_snake == ExtraData.particle_snake) {
                            proceed = false;
                        }
                    }
                    if (proceed) {
                        found_target = true;
                        let snake = {
                            Target: enemy,
                            Source: hTarget,
                            Ability: this,
                            iMoveSpeed: ExtraData.speed + this.GetSpecialValueFor("quick_snake_speed"),
                            bDrawsOnMinimap: false,
                            bDodgeable: false,
                            bIsAttack: false,
                            bVisibleToEnemies: true,
                            bReplaceExisting: false,
                            flExpireTime: GameRules.GetGameTime() + 10,
                            bProvidesVision: true,
                            iVisionRadius: 100,
                            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
                            ExtraData: {
                                bounces: ExtraData.bounces,
                                mana_stolen: ExtraData.mana_stolen,
                                damage: ExtraData.damage + this.GetSpecialValueFor("snake_damage") * this.GetSpecialValueFor("snake_scale") * 0.01,
                                particle_snake: ExtraData.particle_snake,
                                speed: ExtraData.speed + this.GetSpecialValueFor("quick_snake_speed")
                            }
                        }
                        ProjectileManager.CreateTrackingProjectile(snake);
                        ParticleManager.SetParticleControl(ExtraData.particle_snake, 1, enemy.GetAbsOrigin());
                        ParticleManager.SetParticleControl(ExtraData.particle_snake, 2, Vector(ExtraData.speed + this.GetSpecialValueFor("quick_snake_speed"), 0, 0));
                        return;
                    }
                }
            }
            if (!found_target) {
                this.ReturnCB(hTarget, vLocation, ExtraData);
            }
        }
    }
    ReturnCB(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(ExtraData.particle_snake, false);
        ParticleManager.ReleaseParticleIndex(ExtraData.particle_snake);
        let particle_snake = ResHelper.CreateParticleEx("particles/units/heroes/hero_medusa/medusa_mystic_snake_projectile_return.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(particle_snake, 0, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(particle_snake, 1, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_snake, 2, Vector(this.GetSpecialValueFor("return_speed"), 0, 0));
        let snake = {
            Target: this.GetCasterPlus(),
            Source: hTarget,
            Ability: this,
            iMoveSpeed: this.GetSpecialValueFor("return_speed"),
            bDrawsOnMinimap: false,
            bDodgeable: false,
            bIsAttack: false,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            flExpireTime: GameRules.GetGameTime() + 10,
            bProvidesVision: true,
            iVisionRadius: 100,
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            ExtraData: {
                bounces: ExtraData.bounces,
                mana_stolen: ExtraData.mana_stolen,
                damage: ExtraData.damage,
                particle_snake: particle_snake
            }
        }
        ProjectileManager.CreateTrackingProjectile(snake);
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {

        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_medusa_mystic_snake_slow extends BaseModifier_Plus {
    public movement_slow: any;
    public turn_slow: any;
    BeCreated(p_0: any,): void {
        this.movement_slow = this.GetSpecialValueFor("movement_slow") * (-1);
        this.turn_slow = this.GetSpecialValueFor("turn_slow") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return this.turn_slow;
    }
}
@registerModifier()
export class modifier_imba_medusa_mystic_snake_tracker extends BaseModifier_Plus {
    public myotoxin_stack_deal: number;
    public myotoxin_stack_take: number;
    public myotoxin_duration_inc: number;
    public myotoxin_base_aspd: any;
    public myotoxin_stack_aspd: number;
    public myotoxin_base_cast: any;
    public myotoxin_stack_cast: number;
    public myotoxin_max_stacks: number;
    particle_snake: number;
    IgnoreTenacity() {
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
    BeCreated(p_0: any,): void {
        this.myotoxin_stack_deal = this.GetSpecialValueFor("myotoxin_stack_deal");
        this.myotoxin_stack_take = this.GetSpecialValueFor("myotoxin_stack_take");
        this.myotoxin_duration_inc = this.GetSpecialValueFor("myotoxin_duration_inc");
        this.myotoxin_base_aspd = this.GetSpecialValueFor("myotoxin_base_aspd");
        this.myotoxin_stack_aspd = this.GetSpecialValueFor("myotoxin_stack_aspd");
        this.myotoxin_base_cast = this.GetSpecialValueFor("myotoxin_base_cast");
        this.myotoxin_stack_cast = this.GetSpecialValueFor("myotoxin_stack_cast");
        this.myotoxin_max_stacks = this.GetSpecialValueFor("myotoxin_max_stacks");
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(0);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.damage > 0 && this.GetStackCount() < this.myotoxin_max_stacks) {
            if (keys.attacker == this.GetParentPlus()) {
                this.SetStackCount(math.min(this.GetStackCount() + this.myotoxin_stack_deal, this.myotoxin_max_stacks));
                this.SetDuration(this.GetRemainingTime() + this.myotoxin_duration_inc, true);
            } else if (keys.unit == this.GetParentPlus()) {
                this.SetStackCount(math.min(this.GetStackCount() + this.myotoxin_stack_take, this.myotoxin_max_stacks));
                this.SetDuration(this.GetRemainingTime() + this.myotoxin_duration_inc, true);
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.myotoxin_base_aspd + this.GetStackCount() * this.myotoxin_stack_aspd;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE)
    CC_GetModifierPercentageCasttime(p_0: ModifierAbilityEvent,): number {
        return this.myotoxin_base_cast + this.GetStackCount() * this.myotoxin_stack_cast;
    }
}
@registerAbility()
export class imba_medusa_mana_shield extends BaseAbility_Plus {
    public toggle_state: any;
    public responses: { [K: string]: any };
    GetIntrinsicModifierName(): string {
        return "modifier_imba_medusa_mana_shield_meditate";
    }
    ProcsMagicStick(): boolean {
        return false;
    }

    OnOwnerDied(): void {
        this.toggle_state = this.GetToggleState();
    }
    OnToggle(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetToggleState()) {
            this.GetCasterPlus().EmitSound("Hero_Medusa.ManaShield.On");
            if (this.GetCasterPlus().GetUnitName().includes("medusa") && RollPercentage(20)) {
                if (!this.responses) {
                    this.responses = {
                        ["medusa_medus_manashield_02"]: 0,
                        ["medusa_medus_manashield_03"]: 0,
                        ["medusa_medus_manashield_04"]: 0,
                        ["medusa_medus_manashield_06"]: 0
                    }
                }
                for (const [response, timer] of GameFunc.Pair(this.responses)) {
                    if (GameRules.GetDOTATime(true, true) - timer >= 20) {
                        this.GetCasterPlus().EmitSound(response);
                        this.responses[response] = GameRules.GetDOTATime(true, true);
                        return;
                    }
                }
            }
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_medusa_mana_shield", {});
        } else {
            this.GetCasterPlus().EmitSound("Hero_Medusa.ManaShield.Off");
            this.GetCasterPlus().RemoveModifierByNameAndCaster("modifier_imba_medusa_mana_shield", this.GetCasterPlus());
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_medusa_bonus_mana") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_medusa_bonus_mana")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_medusa_bonus_mana"), "modifier_special_bonus_imba_medusa_bonus_mana", {});
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        if (!this.GetToggleState()) {
            this.ToggleAbility();
        }
        return false
    }
}
@registerModifier()
export class modifier_imba_medusa_mana_shield_meditate extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
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
        if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().HasModifier("modifier_imba_medusa_mana_shield") && !keys.attacker.PassivesDisabled() && !keys.target.IsOther() && !keys.target.IsBuilding() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && this.GetAbilityPlus().IsTrained() && !this.GetParentPlus().PassivesDisabled()) {
            let meditate_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_medusa/meditate.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.ReleaseParticleIndex(meditate_particle);
            if (!keys.attacker.IsIllusion()) {
                let enchanted_aim_modifiers = GameFunc.GetCount(this.GetParentPlus().FindAllModifiersByName("modifier_imba_medusa_enchanted_aim"));
                let efficacy_reduction = (100 - (this.GetSpecialValueFor("meditate_enchanted_reduction") * enchanted_aim_modifiers)) * 0.01;
                this.GetParentPlus().GiveMana(keys.damage * this.GetSpecialValueFor("meditate_mana_acquire_pct") * 0.01 * efficacy_reduction);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_medusa_mana_shield extends BaseModifier_Plus {
    public damage_per_mana: number;
    public absorption_tooltip: any;
    public mana_raw: any;
    public mana_pct: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_medusa/medusa_mana_shield.vpcf";
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.damage_per_mana = this.GetSpecialValueFor("damage_per_mana");
        this.absorption_tooltip = this.GetSpecialValueFor("absorption_tooltip");
        if (!IsServer()) {
            return;
        }
        this.mana_raw = this.GetParentPlus().GetMana();
        this.mana_pct = this.GetParentPlus().GetManaPercent();
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(keys: ModifierAttackEvent): number {
        if (!IsServer()) {
            return;
        }
        if (!(keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL && this.GetParentPlus().IsMagicImmune()) && this.GetParentPlus().GetMana) {
            let mana_to_block = keys.original_damage * this.absorption_tooltip * 0.01 / this.damage_per_mana;
            if (mana_to_block >= this.GetParentPlus().GetMana()) {
                this.GetParentPlus().EmitSound("Hero_Medusa.ManaShield.Proc");
                let shield_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_medusa/medusa_mana_shield_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                ParticleManager.ReleaseParticleIndex(shield_particle);
            }
            let mana_before = this.GetParentPlus().GetMana();
            this.GetParentPlus().ReduceMana(mana_to_block);
            let mana_after = this.GetParentPlus().GetMana();
            return math.min(this.absorption_tooltip, this.absorption_tooltip * this.GetParentPlus().GetMana() / math.max(mana_to_block, 1)) * (-1);
        }
    }
}
@registerAbility()
export class imba_medusa_stone_gaze extends BaseAbility_Plus {
    GetAssociatedPrimaryAbilities(): string {
        return "imba_medusa_mystic_snake";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_medusa_stone_gaze_red_eyes";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_Medusa.StoneGaze.Cast");
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_medusa_stone_gaze", {
            duration: this.GetTalentSpecialValueFor("duration")
        });
    }
    GetManaCost(level: number): number {
        return 100;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this)
    }
}
@registerModifier()
export class modifier_imba_medusa_stone_gaze extends BaseModifier_Plus {
    public radius: number;
    public stone_duration: number;
    public face_duration: number;
    public vision_cone: any;
    public bonus_physical_damage: number;
    public speed_boost: number;
    public stiff_joints_duration: number;
    public tick_interval: number;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.stone_duration = this.GetAbilityPlus().GetTalentSpecialValueFor("stone_duration");
        this.face_duration = this.GetSpecialValueFor("face_duration");
        this.vision_cone = this.GetSpecialValueFor("vision_cone");
        this.bonus_physical_damage = this.GetSpecialValueFor("bonus_physical_damage");
        this.speed_boost = this.GetSpecialValueFor("speed_boost");
        this.stiff_joints_duration = this.GetSpecialValueFor("stiff_joints_duration");
        this.tick_interval = 0.1;
        if (!IsServer()) {
            return;
        }
        let gaze_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_medusa/medusa_stone_gaze_active.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(gaze_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_head", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(gaze_particle, false, false, -1, false, false);
        this.StartIntervalThink(this.tick_interval);
    }
    OnIntervalThink(): void {
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (math.abs(AngleDiff(VectorToAngles(enemy.GetForwardVector()).y, VectorToAngles(this.GetParentPlus().GetAbsOrigin() - enemy.GetAbsOrigin() as Vector).y)) <= this.vision_cone * 1000 && enemy.GetTeamNumber() != DOTATeam_t.DOTA_TEAM_NEUTRALS) {
                let facing_modifier = enemy.FindModifierByNameAndCaster("modifier_imba_medusa_stone_gaze_facing", this.GetParentPlus());
                let stone_modifier = enemy.FindModifierByNameAndCaster("modifier_imba_medusa_stone_gaze_stone", this.GetParentPlus());
                if (!facing_modifier && !stone_modifier) {
                    enemy.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_medusa_stone_gaze_facing", {
                        duration: this.GetRemainingTime(),
                        radius: this.radius,
                        stone_duration: this.stone_duration,
                        face_duration: this.face_duration,
                        bonus_physical_damage: this.bonus_physical_damage,
                        tick_interval: this.tick_interval,
                        stiff_joints_duration: this.stiff_joints_duration
                    });
                }
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Medusa.StoneGaze.Cast");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.speed_boost;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_MEDUSA_STONE_GAZE;
    }
}
@registerModifier()
export class modifier_imba_medusa_stone_gaze_facing extends BaseModifier_Plus {
    public counter: number;
    public slow: any;
    public vision_cone: any;
    public radius: number;
    public stone_duration: number;
    public face_duration: number;
    public bonus_physical_damage: number;
    public stiff_joints_duration: number;
    public tick_interval: number;
    public play_sound: any;
    public particle: any;
    IgnoreTenacity() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        this.counter = 0;
        if (this.GetAbilityPlus()) {
            this.slow = this.GetSpecialValueFor("slow");
            this.vision_cone = this.GetSpecialValueFor("vision_cone");
        } else {
            this.slow = 35;
            this.vision_cone = 0.08715;
        }
        if (!IsServer()) {
            return;
        }
        this.radius = params.radius;
        this.stone_duration = params.stone_duration;
        this.face_duration = params.face_duration;
        this.bonus_physical_damage = params.bonus_physical_damage;
        this.stiff_joints_duration = params.stiff_joints_duration;
        this.tick_interval = params.tick_interval;
        this.play_sound = true;
        this.SetStackCount(this.slow);
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_medusa/medusa_stone_gaze_facing.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.StartIntervalThink(this.tick_interval);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (math.abs(AngleDiff(VectorToAngles(this.GetParentPlus().GetForwardVector()).y, VectorToAngles(this.GetCasterPlus().GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).y)) <= this.vision_cone * 1000 && (this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() <= this.radius && this.GetCasterPlus().IsAlive()) {
            if (this.play_sound && this.GetParentPlus().IsRealUnit()) {
                this.GetParentPlus().EmitSound("Hero_Medusa.StoneGaze.Target");
                this.play_sound = false;
            }
            this.SetStackCount(this.slow);
            ParticleManager.SetParticleControlEnt(this.particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
            this.counter = this.counter + this.tick_interval;
            if (this.counter >= this.face_duration) {
                if (this.GetParentPlus().IsRealUnit()) {
                    this.GetParentPlus().EmitSound("Hero_Medusa.StoneGaze.Stun");
                }
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_medusa_stone_gaze_stone", {
                    duration: this.stone_duration * (1 - this.GetParentPlus().GetStatusResistance()),
                    bonus_physical_damage: this.bonus_physical_damage
                });
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_medusa_stone_gaze_stiff_joints", {
                    duration: this.stiff_joints_duration * (1 - this.GetParentPlus().GetStatusResistance()),
                    bonus_physical_damage: this.bonus_physical_damage
                });
                this.StartIntervalThink(-1);
                this.Destroy();
            }
        } else {
            if (!this.play_sound) {
                this.play_sound = true;
            }
            this.SetStackCount(0);
            ParticleManager.SetParticleControlEnt(this.particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
            if (!this.GetCasterPlus().IsAlive()) {
                this.StartIntervalThink(-1);
                this.Destroy();
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
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
export class modifier_imba_medusa_stone_gaze_stone extends BaseModifier_Plus {
    public bonus_physical_damage: number;
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_medusa/medusa_stone_gaze_debuff_stoned.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_medusa_stone_gaze.vpcf";
    }
    BeCreated(params: any): void {
        if (this.GetAbilityPlus()) {
            this.bonus_physical_damage = this.GetSpecialValueFor("bonus_physical_damage");
        } else {
            this.Destroy();
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_FROZEN]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE_KILLCREDIT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingPhysicalDamage_Percentage(keys: ModifierAttackEvent): number {
        return this.bonus_physical_damage;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE_KILLCREDIT)
    CC_OnTakeDamageKillCredit(keys: ModifierAttackEvent): void {
        if (keys.target == this.GetParentPlus() && this.GetParentPlus().GetHealth() <= keys.damage) {
            if (keys.attacker == this.GetParentPlus()) {
                this.GetCasterPlus().TrueKilled(this.GetParentPlus(), this.GetAbilityPlus());
            } else {
                this.GetParentPlus().TrueKilled(keys.attacker, this.GetAbilityPlus());
            }
        }
    }
}
@registerModifier()
export class modifier_imba_medusa_stone_gaze_red_eyes extends BaseModifier_Plus {
    public red_eyes_vision_cone: any;
    public red_eyes_radius: number;
    public red_eyes_duration: number;
    public tick_interval: number;
    IsHidden(): boolean {
        return true;
    }
    Init(p_0: any,): void {
        this.red_eyes_vision_cone = this.GetSpecialValueFor("red_eyes_vision_cone");
        this.red_eyes_radius = this.GetSpecialValueFor("red_eyes_radius");
        this.red_eyes_duration = this.GetSpecialValueFor("red_eyes_duration");
        this.tick_interval = 0.1;
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(this.tick_interval);
    }

    OnIntervalThink(): void {
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.red_eyes_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let facing_modifier = enemy.FindModifierByNameAndCaster("modifier_imba_medusa_stone_gaze_red_eyes_facing", this.GetParentPlus());
            let stone_modifier = enemy.FindModifierByNameAndCaster("modifier_imba_medusa_stone_gaze_stone", this.GetParentPlus());
            if (math.abs(AngleDiff(VectorToAngles(enemy.GetForwardVector()).y, VectorToAngles(this.GetParentPlus().GetAbsOrigin() - enemy.GetAbsOrigin() as Vector).y)) <= this.red_eyes_vision_cone * 1000 && math.abs(AngleDiff(VectorToAngles(this.GetParentPlus().GetForwardVector()).y, VectorToAngles(enemy.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).y)) <= this.red_eyes_vision_cone * 1000 && enemy.GetTeamNumber() != DOTATeam_t.DOTA_TEAM_NEUTRALS && !this.GetParentPlus().PassivesDisabled() && !this.GetParentPlus().IsIllusion() && this.GetParentPlus().IsAlive()) {
                if (!facing_modifier && !stone_modifier) {
                    enemy.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_medusa_stone_gaze_red_eyes_facing", {
                        duration: this.red_eyes_duration
                    });
                }
            } else if (facing_modifier) {
                facing_modifier.Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_medusa_stone_gaze_red_eyes_facing extends BaseModifier_Plus {
    public bonus_physical_damage: number;
    public red_eyes_max_slow: any;
    public red_eyes_stone_duration: number;
    public particle: any;
    IgnoreTenacity() {
        return true;
    }
    BeCreated(params: any): void {
        this.bonus_physical_damage = this.GetSpecialValueFor("bonus_physical_damage");
        this.red_eyes_max_slow = this.GetSpecialValueFor("red_eyes_max_slow");
        this.red_eyes_stone_duration = this.GetSpecialValueFor("red_eyes_stone_duration");
        if (!IsServer()) {
            return;
        }
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_medusa/medusa_stone_gaze_facing.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        this.AddParticle(this.particle, false, false, -1, false, false);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetRemainingTime() <= 0) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_medusa_stone_gaze_stone", {
                duration: this.red_eyes_stone_duration * (1 - this.GetParentPlus().GetStatusResistance()),
                bonus_physical_damage: this.bonus_physical_damage
            });
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return ((1 - this.GetRemainingTime() / this.GetDuration()) * this.red_eyes_max_slow) * (-1);
    }
}
@registerModifier()
export class modifier_imba_medusa_stone_gaze_stiff_joints extends BaseModifier_Plus {
    public stiff_joints_movespeed: number;
    public stiff_joints_turnspeed: number;
    public stiff_joints_orders: any;
    public bonus_physical_damage: number;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.stiff_joints_movespeed = this.GetSpecialValueFor("stiff_joints_movespeed");
        this.stiff_joints_turnspeed = this.GetSpecialValueFor("stiff_joints_turnspeed");
        this.stiff_joints_orders = this.GetSpecialValueFor("stiff_joints_orders");
        if (!IsServer()) {
            return;
        }
        this.bonus_physical_damage = params.bonus_physical_damage;
        this.SetStackCount(this.stiff_joints_orders);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE,
            4: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingPhysicalDamage_Percentage(keys: ModifierAttackEvent): number {
        if (!IsServer()) {
            return;
        }
        if (!this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_medusa_stone_gaze_stone", this.GetCasterPlus())) {
            return this.bonus_physical_damage;
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.stiff_joints_movespeed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return this.stiff_joints_turnspeed;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.GetParentPlus()) {
            this.DecrementStackCount();
            if (this.GetStackCount() <= 0) {
                this.Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_mystic_snake_mana_steal extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_medusa_extra_split_shot_targets extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_medusa_stone_gaze_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_medusa_split_shot_modifiers extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_medusa_bonus_mana extends BaseModifier_Plus {
    public bonus_mana: number;
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
        this.bonus_mana = this.GetParentPlus().GetTalentValue("special_bonus_imba_medusa_bonus_mana");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        return this.bonus_mana;
    }
}
