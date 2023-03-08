
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_force_staff extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_force_staff";
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
            return this.GetSpecialValueFor("enemy_cast_range");
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let ability = this;
        let target = this.GetCursorTarget();
        if (target.TriggerSpellAbsorb(ability)) {
            return undefined;
        }
        EmitSoundOn("DOTA_Item.ForceStaff.Activate", target);
        target.AddNewModifier(this.GetCasterPlus(), ability, "modifier_item_imba_force_staff_active", {
            duration: ability.GetSpecialValueFor("duration")
        });
    }
}
@registerModifier()
export class modifier_item_imba_force_staff extends BaseModifier_Plus {
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
        this.OnIntervalThink();
        this.StartIntervalThink(1.0);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_health_regen");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
    }
}
@registerModifier()
export class modifier_item_imba_force_staff_active extends BaseModifierMotionHorizontal_Plus {
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

    GetPriority() {
        return 2;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {

        if (!IsServer()) {
            return;
        }
        this.BeginMotionOrDestroy();
        if (this.GetParentPlus().HasModifier("modifier_legion_commander_duel") || this.GetParentPlus().HasModifier("modifier_imba_enigma_black_hole") || this.GetParentPlus().HasModifier("modifier_imba_faceless_void_chronosphere_handler")) {
            this.Destroy();
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/items_fx/force_staff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
        this.StartIntervalThink(FrameTime());
        this.angle = this.GetParentPlus().GetForwardVector().Normalized();
        this.distance = this.GetItemPlus().GetSpecialValueFor("push_length") / (this.GetDuration() / FrameTime());
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
@registerAbility()
export class item_imba_hurricane_pike extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_hurricane_pike";
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
        let target = this.GetCursorTarget();
        let duration = 0.4;
        if (this.GetCasterPlus().GetTeamNumber() == target.GetTeamNumber()) {
            EmitSoundOn("DOTA_Item.ForceStaff.Activate", target);
            target.AddNewModifier(this.GetCasterPlus(), ability, "modifier_item_imba_hurricane_pike_force_ally", {
                duration: duration
            });
        } else {
            if (target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
            target.AddNewModifier(this.GetCasterPlus(), ability, "modifier_item_imba_hurricane_pike_force_enemy", {
                duration: duration
            }) as modifier_item_imba_hurricane_pike_force_enemy;
            this.GetCasterPlus().AddNewModifier(target, ability, "modifier_item_imba_hurricane_pike_force_self", {
                duration: duration
            });
            let buff = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), ability, "modifier_item_imba_hurricane_pike_attack_speed", {
                duration: ability.GetSpecialValueFor("range_duration")
            }) as modifier_item_imba_hurricane_pike_attack_speed;
            buff.target = target;
            buff.SetStackCount(ability.GetSpecialValueFor("max_attacks"));
            EmitSoundOn("DOTA_Item.ForceStaff.Activate", target);
            EmitSoundOn("DOTA_Item.ForceStaff.Activate", this.GetCasterPlus());
            if (this.GetCasterPlus().IsRangedAttacker()) {
                let startAttack = {
                    UnitIndex: this.GetCasterPlus().entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                    TargetIndex: target.entindex()
                }
                ExecuteOrderFromTable(startAttack);
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_hurricane_pike extends BaseModifier_Plus {
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
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (!parent.HasModifier("modifier_item_imba_hurricane_pike_unique")) {
                parent.AddNewModifier(parent, this.GetItemPlus(), "modifier_item_imba_hurricane_pike_unique", {});
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (!parent.HasModifier("modifier_item_imba_hurricane_pike")) {
                parent.RemoveModifierByName("modifier_item_imba_hurricane_pike_unique");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_health_regen");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_strength");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_agility");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
    }
}
@registerModifier()
export class modifier_item_imba_hurricane_pike_unique extends BaseModifier_Plus {
    public bonus_attack_range: number;
    IsHidden(): boolean {
        return true;
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
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS
        });
    } */
    BeCreated(p_0: any,): void {
        this.bonus_attack_range = this.GetItemPlus().GetSpecialValueFor("base_attack_range");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (this.GetParentPlus().IsRangedAttacker()) {
            return this.bonus_attack_range;
        }
    }
}
@registerModifier()
export class modifier_item_imba_hurricane_pike_force_ally extends BaseModifierMotionHorizontal_Plus {
    public pfx: any;
    public angle: any;
    public distance: number;
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

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.BeginMotionOrDestroy()
        if (this.GetParentPlus().HasModifier("modifier_legion_commander_duel") || this.GetParentPlus().HasModifier("modifier_imba_enigma_black_hole") || this.GetParentPlus().HasModifier("modifier_imba_faceless_void_chronosphere_handler")) {
            this.Destroy();
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/items_fx/force_staff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
        this.StartIntervalThink(FrameTime());
        this.angle = this.GetParentPlus().GetForwardVector().Normalized();
        this.distance = this.GetItemPlus().GetSpecialValueFor("push_length") / (this.GetDuration() / FrameTime());
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
export class modifier_item_imba_hurricane_pike_force_enemy extends BaseModifierMotionHorizontal_Plus {
    public pfx: any;
    public angle: any;
    public distance: number;
    target: IBaseNpc_Plus;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
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
        this.BeginMotionOrDestroy()
        this.pfx = ResHelper.CreateParticleEx("particles/items_fx/force_staff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
        this.StartIntervalThink(FrameTime());
        this.angle = (this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
        this.distance = this.GetItemPlus().GetSpecialValueFor("enemy_length") / (this.GetDuration() / FrameTime());
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
export class modifier_item_imba_hurricane_pike_force_self extends BaseModifierMotionHorizontal_Plus {
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

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
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
        this.distance = this.GetItemPlus().GetSpecialValueFor("enemy_length") / (this.GetDuration() / FrameTime());
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
export class modifier_item_imba_hurricane_pike_attack_speed extends BaseModifier_Plus {
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
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: Enum_MODIFIER_EVENT.ON_ATTACK,
            3: Enum_MODIFIER_EVENT.ON_ORDER,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS
        });
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
