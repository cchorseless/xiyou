
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_lance_of_longinus extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_lance_of_longinus";
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (this.GetCasterPlus() == target || target.HasModifier("modifier_imba_gyrocopter_homing_missile")) {
            return UnitFilterResult.UF_SUCCESS;
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CUSTOM, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES, this.GetCasterPlus().GetTeamNumber());
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (!target || target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return super.GetCastRange(location, target);
        } else {
            return this.GetSpecialValueFor("cast_range_enemy");
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let ability = this;
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let duration = ability.GetSpecialValueFor("duration");
        if (caster.GetTeamNumber() == target.GetTeamNumber()) {
            EmitSoundOn("DOTA_Item.ForceStaff.Activate", target);
            target.AddNewModifier(caster, ability, "modifier_item_imba_lance_of_longinus_force_ally", {
                duration: duration
            });
        } else {
            if (target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
            if (caster.IsRangedAttacker()) {
                target.AddNewModifier(caster, ability, "modifier_item_imba_lance_of_longinus_force_enemy_ranged", {
                    duration: duration
                });
                caster.AddNewModifier(target, ability, "modifier_item_imba_lance_of_longinus_force_self_ranged", {
                    duration: duration
                });
            } else {
                target.AddNewModifier(caster, ability, "modifier_item_imba_lance_of_longinus_force_enemy_melee", {
                    duration: duration
                });
                caster.AddNewModifier(target, ability, "modifier_item_imba_lance_of_longinus_force_self_melee", {
                    duration: duration
                });
            }
            if (this.GetPurchaseTime() != -1) {
                let god_piercing_modifier = caster.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_lance_of_longinus_god_piercing_ally", {
                    duration: this.GetSpecialValueFor("god_piercing_duration")
                }) as modifier_item_imba_lance_of_longinus_god_piercing_ally;
                if (god_piercing_modifier) {
                    god_piercing_modifier.enemy = target;
                    target.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_lance_of_longinus_god_piercing_enemy", {
                        duration: this.GetSpecialValueFor("god_piercing_duration")
                    });
                    let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_lone_druid/lone_druid_spiritlink_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                    ParticleManager.SetParticleControl(particle, 0, caster.GetAbsOrigin());
                    ParticleManager.SetParticleControl(particle, 1, target.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(particle);
                }
            }
            let buff = caster.AddNewModifier(caster, ability, "modifier_item_imba_lance_of_longinus_attack_speed", {
                duration: ability.GetSpecialValueFor("range_duration")
            }) as modifier_item_imba_lance_of_longinus_attack_speed;
            buff.target = target;
            buff.SetStackCount(ability.GetSpecialValueFor("max_attacks"));
            EmitSoundOn("DOTA_Item.ForceStaff.Activate", target);
            EmitSoundOn("DOTA_Item.ForceStaff.Activate", caster);
            let startAttack = {
                UnitIndex: caster.entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                TargetIndex: target.entindex()
            }
            ExecuteOrderFromTable(startAttack);
        }
    }
}
@registerModifier()
export class modifier_item_imba_lance_of_longinus extends BaseModifier_Plus {
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
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            6: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS,
            7: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_strength");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_agility");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_health_regen");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_health");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_mana");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (this.GetItemPlus() && this.GetItemPlus().GetSecondaryCharges() == 1) {
            if (this.GetParentPlus().IsRangedAttacker()) {
                return this.GetItemPlus().GetSpecialValueFor("base_attack_range");
            } else {
                return this.GetItemPlus().GetSpecialValueFor("base_attack_range_melee");
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_lance_of_longinus_force_ally extends BaseModifierMotionHorizontal_Plus {
    public pfx: any;
    public angle: any;
    public distance: number;
    public attacked_target: any;
    public god_piercing_radius: number;
    public average_attack_damage: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsMotionController() {
        return true;
    }
    GetMotionControllerPriority() {
        return DOTA_MOTION_CONTROLLER_PRIORITY.DOTA_MOTION_CONTROLLER_PRIORITY_MEDIUM;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_legion_commander_duel") || this.GetParentPlus().HasModifier("modifier_imba_enigma_black_hole") || this.GetParentPlus().HasModifier("modifier_imba_faceless_void_chronosphere_handler")) {
            this.Destroy();
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/items_fx/force_staff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
        this.StartIntervalThink(FrameTime());
        this.angle = this.GetParentPlus().GetForwardVector().Normalized();
        this.distance = this.GetItemPlus().GetSpecialValueFor("push_length") / (this.GetDuration() / FrameTime());
        this.attacked_target = {}
        this.god_piercing_radius = this.GetItemPlus().GetSpecialValueFor("god_piercing_radius");
        this.average_attack_damage = this.GetParentPlus().GetAverageTrueAttackDamage(this.GetParentPlus()) * this.GetItemPlus().GetSpecialValueFor("god_piercing_pure_pct") * 0.01;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(this.pfx, false);
        ParticleManager.ReleaseParticleIndex(this.pfx);
        this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_FLAIL);
        ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 128);
    }
    ApplyHorizontalMotionController() {
        if (!this.CheckMotionControllers()) {
            this.Destroy();
            return false;
        }
        let attacker = this.GetParentPlus();
        let enemies = FindUnitsInRadius(attacker.GetTeamNumber(), attacker.GetAbsOrigin(), undefined, this.god_piercing_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!this.attacked_target[enemy.entindex()]) {
                attacker.PerformAttack(enemy, true, true, true, true, true, false, true);
                this.attacked_target[enemy.entindex()] = enemy.entindex();
                if (enemy.IsRealHero()) {
                    let god_piercing_modifier = attacker.AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_lance_of_longinus_god_piercing_ally", {
                        duration: this.GetItemPlus().GetSpecialValueFor("god_piercing_duration")
                    }) as modifier_item_imba_lance_of_longinus_god_piercing_ally;
                    if (god_piercing_modifier) {
                        god_piercing_modifier.enemy = enemy;
                        enemy.AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_lance_of_longinus_god_piercing_enemy", {
                            duration: this.GetItemPlus().GetSpecialValueFor("god_piercing_duration")
                        });
                        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_lone_druid/lone_druid_spiritlink_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                        ParticleManager.SetParticleControl(particle, 0, attacker.GetAbsOrigin());
                        ParticleManager.SetParticleControl(particle, 1, enemy.GetAbsOrigin());
                        ParticleManager.ReleaseParticleIndex(particle);
                    }
                }
            }
        }
        ProjectileManager.ProjectileDodge(this.GetParentPlus());
        return true;
    }
    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_mars_arena_of_blood_leash") && this.GetParentPlus().findBuff("modifier_mars_arena_of_blood_leash").GetAuraOwner() && (this.GetParentPlus().GetAbsOrigin() - this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetAuraOwner().GetAbsOrigin() as Vector).Length2D() >= this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetItemPlus().GetSpecialValueFor("radius") - this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetItemPlus().GetSpecialValueFor("width")) {
            this.Destroy();
            return;
        }
        let pos = unit.GetAbsOrigin();
        GridNav.DestroyTreesAroundPoint(pos, 80, false);
        let pos_p = this.angle * this.distance;
        let next_pos = GetGroundPosition(pos + pos_p as Vector, unit);
        unit.SetAbsOrigin(next_pos);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PURE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PURE)
    CC_GetModifierProcAttack_BonusDamage_Pure(p_0: ModifierAttackEvent,): number {
        return this.average_attack_damage;
    }
}
@registerModifier()
export class modifier_item_imba_lance_of_longinus_force_enemy_ranged extends BaseModifierMotionHorizontal_Plus {
    public pfx: any;
    public angle: any;
    public distance: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsMotionController() {
        return true;
    }
    GetMotionControllerPriority() {
        return DOTA_MOTION_CONTROLLER_PRIORITY.DOTA_MOTION_CONTROLLER_PRIORITY_MEDIUM;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/items_fx/force_staff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
        this.StartIntervalThink(FrameTime());
        this.angle = (this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
        this.distance = this.GetItemPlus().GetSpecialValueFor("enemy_distance_ranged") / (this.GetDuration() / FrameTime());
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(this.pfx, false);
        ParticleManager.ReleaseParticleIndex(this.pfx);
        this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_FLAIL);
        ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 128);
    }
    ApplyHorizontalMotionController() {
        if (!this.CheckMotionControllers()) {
            this.Destroy();
            return false;
        }
        return true;
    }
    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_mars_arena_of_blood_leash") && this.GetParentPlus().findBuff("modifier_mars_arena_of_blood_leash").GetAuraOwner() && (this.GetParentPlus().GetAbsOrigin() - this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetAuraOwner().GetAbsOrigin() as Vector).Length2D() >= this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetItemPlus().GetSpecialValueFor("radius") - this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetItemPlus().GetSpecialValueFor("width")) {
            this.Destroy();
            return;
        }
        let pos = unit.GetAbsOrigin();
        GridNav.DestroyTreesAroundPoint(pos, 80, false);
        let pos_p = this.angle * this.distance;
        let next_pos = GetGroundPosition(pos + pos_p as Vector, unit);
        unit.SetAbsOrigin(next_pos);
    }
}
@registerModifier()
export class modifier_item_imba_lance_of_longinus_force_self_ranged extends BaseModifierMotionHorizontal_Plus {
    public pfx: any;
    public angle: any;
    public distance: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    IsMotionController() {
        return true;
    }
    GetMotionControllerPriority() {
        return DOTA_MOTION_CONTROLLER_PRIORITY.DOTA_MOTION_CONTROLLER_PRIORITY_MEDIUM;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/items_fx/force_staff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
        this.StartIntervalThink(FrameTime());
        this.angle = (this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
        this.distance = this.GetItemPlus().GetSpecialValueFor("enemy_distance_ranged") / (this.GetDuration() / FrameTime());
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(this.pfx, false);
        ParticleManager.ReleaseParticleIndex(this.pfx);
        this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_FLAIL);
        ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 128);
    }
    ApplyHorizontalMotionController(): boolean {
        if (!this.CheckMotionControllers()) {
            this.Destroy();
            return false;
        }
        return true;
    }
    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_mars_arena_of_blood_leash") && this.GetParentPlus().findBuff("modifier_mars_arena_of_blood_leash").GetAuraOwner() && (this.GetParentPlus().GetAbsOrigin() - this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetAuraOwner().GetAbsOrigin() as Vector).Length2D() >= this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetItemPlus().GetSpecialValueFor("radius") - this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetItemPlus().GetSpecialValueFor("width")) {
            this.Destroy();
            return;
        }
        let pos = unit.GetAbsOrigin();
        GridNav.DestroyTreesAroundPoint(pos, 80, false);
        let pos_p = this.angle * this.distance;
        let next_pos = GetGroundPosition(pos + pos_p as Vector, unit);
        unit.SetAbsOrigin(next_pos);
    }
}
@registerModifier()
export class modifier_item_imba_lance_of_longinus_force_enemy_melee extends BaseModifierMotionHorizontal_Plus {
    public pfx: any;
    public angle: any;
    public distance: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsMotionController() {
        return true;
    }
    GetMotionControllerPriority() {
        return DOTA_MOTION_CONTROLLER_PRIORITY.DOTA_MOTION_CONTROLLER_PRIORITY_MEDIUM;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/items_fx/force_staff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
        this.StartIntervalThink(FrameTime());
        this.angle = (this.GetCasterPlus().GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Normalized();
        this.distance = this.GetItemPlus().GetSpecialValueFor("enemy_distance_melee") / (this.GetDuration() / FrameTime());
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(this.pfx, false);
        ParticleManager.ReleaseParticleIndex(this.pfx);
        this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_FLAIL);
        ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 128);
    }
    OnIntervalThink(): void {
        if (!this.CheckMotionControllers()) {
            this.Destroy();
            return;
        }
        this.HorizontalMotion(this.GetParentPlus(), FrameTime());
    }
    HorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_mars_arena_of_blood_leash") && this.GetParentPlus().findBuff("modifier_mars_arena_of_blood_leash").GetAuraOwner() && (this.GetParentPlus().GetAbsOrigin() - this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetAuraOwner().GetAbsOrigin() as Vector).Length2D() >= this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetItemPlus().GetSpecialValueFor("radius") - this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetItemPlus().GetSpecialValueFor("width")) {
            this.Destroy();
            return;
        }
        let pos = unit.GetAbsOrigin();
        GridNav.DestroyTreesAroundPoint(pos, 80, false);
        let pos_p = this.angle * this.distance;
        let next_pos = GetGroundPosition(pos + pos_p as Vector, unit);
        unit.SetAbsOrigin(next_pos);
    }
}
@registerModifier()
export class modifier_item_imba_lance_of_longinus_force_self_melee extends BaseModifierMotionHorizontal_Plus {
    public pfx: any;
    public angle: any;
    public distance: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    IsMotionController() {
        return true;
    }
    GetMotionControllerPriority() {
        return DOTA_MOTION_CONTROLLER_PRIORITY.DOTA_MOTION_CONTROLLER_PRIORITY_MEDIUM;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/items_fx/force_staff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
        this.StartIntervalThink(FrameTime());
        this.angle = (this.GetCasterPlus().GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Normalized();
        this.distance = this.GetItemPlus().GetSpecialValueFor("enemy_distance_melee") / (this.GetDuration() / FrameTime());
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(this.pfx, false);
        ParticleManager.ReleaseParticleIndex(this.pfx);
        this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_FLAIL);
        ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 128);
    }
    ApplyHorizontalMotionController() {
        if (!this.CheckMotionControllers()) {
            this.Destroy();
            return false;;
        }
        return true;;
    }
    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_mars_arena_of_blood_leash") && this.GetParentPlus().findBuff("modifier_mars_arena_of_blood_leash").GetAuraOwner() && (this.GetParentPlus().GetAbsOrigin() - this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetAuraOwner().GetAbsOrigin() as Vector).Length2D() >= this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetItemPlus().GetSpecialValueFor("radius") - this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetItemPlus().GetSpecialValueFor("width")) {
            this.Destroy();
            return;
        }
        let pos = unit.GetAbsOrigin();
        GridNav.DestroyTreesAroundPoint(pos, 80, false);
        let pos_p = this.angle * this.distance;
        let next_pos = GetGroundPosition(pos + pos_p as Vector, unit);
        unit.SetAbsOrigin(next_pos);
    }
}
@registerModifier()
export class modifier_item_imba_lance_of_longinus_attack_speed extends BaseModifier_Plus {
    public as: any;
    public ar: any;
    target: IBaseNpc_Plus;
    IsDebuff(): boolean {
        return false;
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
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        this.as = 0;
        this.ar = 0;
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().GetAttackTarget() == this.target) {
            this.as = this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
            if (this.GetParentPlus().IsRangedAttacker()) {
                this.ar = 999999;
            }
        } else {
            this.as = 0;
            this.ar = 0;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: Enum_MODIFIER_EVENT.ON_ATTACK,
            3: Enum_MODIFIER_EVENT.ON_ORDER,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (!IsServer()) {
            return;
        }
        return this.as;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (!IsServer()) {
            return;
        }
        return this.ar;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.target == this.target && keys.attacker == this.GetParentPlus()) {
            if (this.GetStackCount() > 1) {
                this.DecrementStackCount();
            } else {
                this.Destroy();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.target == this.target && keys.unit == this.GetParentPlus() && keys.order_type == 4) {
            if (this.GetParentPlus().IsRangedAttacker()) {
                this.ar = 999999;
            }
            this.as = this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
        }
    }
}
@registerModifier()
export class modifier_item_imba_lance_of_longinus_god_piercing_ally extends BaseModifier_Plus {
    public total_gained_health: any;
    enemy: IBaseNpc_Plus;
    IsPurgable(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        this.total_gained_health = 0;
        this.StartIntervalThink(1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, this.GetParentPlus(), this.total_gained_health, undefined);
        this.total_gained_health = 0;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_HEAL_RECEIVED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_HEAL_RECEIVED)
    CC_OnHealReceived(keys: ModifierHealEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit == this.enemy && !keys.unit.HasModifier("modifier_item_imba_lance_of_longinus_god_piercing_ally")) {
            this.GetParentPlus().Heal(keys.gain, this.GetItemPlus());
            this.total_gained_health = this.total_gained_health + keys.gain;
        }
    }
}
@registerModifier()
export class modifier_item_imba_lance_of_longinus_god_piercing_enemy extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
}
