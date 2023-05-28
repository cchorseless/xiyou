
import { GameFunc } from "../../../GameFunc";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 缚灵索
@registerAbility()
export class item_imba_gungir extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        this.AddTimer(FrameTime(), () => {
            for (const [_, modifier] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName("modifier_item_imba_gungir"))) {
                modifier.SetStackCount(_);
            }
        });
        return "modifier_item_imba_gungir";
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
            target.AddNewModifier(caster, ability, "modifier_item_imba_gungir_force_ally", {
                duration: duration
            });
        } else {
            if (target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
            if (caster.IsRangedAttacker()) {
                target.AddNewModifier(caster, ability, "modifier_item_imba_gungir_force_enemy_ranged", {
                    duration: duration
                });
                caster.AddNewModifier(target, ability, "modifier_item_imba_gungir_force_self_ranged", {
                    duration: duration
                });
            } else {
                target.AddNewModifier(caster, ability, "modifier_item_imba_gungir_force_enemy_melee", {
                    duration: duration
                });
                caster.AddNewModifier(target, ability, "modifier_item_imba_gungir_force_self_melee", {
                    duration: duration
                });
            }
            let buff = caster.AddNewModifier(caster, ability, "modifier_item_imba_gungir_attack_speed", {
                duration: ability.GetSpecialValueFor("range_duration")
            }) as modifier_item_imba_gungir_attack_speed;
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
export class modifier_item_imba_gungir extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public parent: IBaseNpc_Plus;
    public bonus_strength: number;
    public bonus_agility: number;
    public bonus_intellect: number;
    public bonus_health_regen: number;
    public bonus_damage: number;
    public bonus_attack_speed_passive: number;
    public base_attack_range: number;
    public base_attack_range_melee: number;
    public bonus_chance: number;
    public bonus_chance_damage: number;
    public bonus_attack_speed: number;
    public pierce_proc: any;
    public pierce_records: number[];
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
        this.ability = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        this.bonus_strength = this.ability.GetSpecialValueFor("bonus_strength");
        this.bonus_agility = this.ability.GetSpecialValueFor("bonus_agility");
        this.bonus_intellect = this.ability.GetSpecialValueFor("bonus_intellect");
        this.bonus_health_regen = this.ability.GetSpecialValueFor("bonus_health_regen");
        this.bonus_damage = this.ability.GetSpecialValueFor("bonus_damage");
        this.bonus_attack_speed_passive = this.ability.GetSpecialValueFor("bonus_attack_speed_passive");
        this.base_attack_range = this.ability.GetSpecialValueFor("base_attack_range");
        this.base_attack_range_melee = this.ability.GetSpecialValueFor("base_attack_range_melee");
        this.bonus_chance = this.ability.GetSpecialValueFor("bonus_chance");
        this.bonus_chance_damage = this.ability.GetSpecialValueFor("bonus_chance_damage");
        this.bonus_attack_speed = this.ability.GetSpecialValueFor("bonus_attack_speed");
        this.pierce_proc = true;
        this.pierce_records = []
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            6: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            7: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            8: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_MAGICAL,
            9: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_strength;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.bonus_agility;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_intellect;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.bonus_health_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed_passive;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (this.GetStackCount() == 1) {
            if (this.parent.IsRangedAttacker()) {
                return this.base_attack_range;
            } else {
                return this.base_attack_range_melee;
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_MAGICAL)
    CC_GetModifierProcAttack_BonusDamage_Magical(keys: ModifierAttackEvent): number {
        if (!IsServer()) {
            return;
        }
        for (const [_, record] of GameFunc.iPair(this.pierce_records)) {
            if (record == keys.record) {
                this.pierce_records.splice(_, 1);
                if (!this.parent.IsIllusion() && this.GetStackCount() == 1 && !keys.target.IsBuilding()) {
                    return this.bonus_chance_damage;
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    CC_OnAttackRecord(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.parent) {
            if (this.pierce_proc) {
                this.pierce_records.push(keys.record);
                this.pierce_proc = false;
            }
            if (GFuncRandom.PRD(this.bonus_chance, this)) {
                this.pierce_proc = true;
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {}
        if (this.pierce_proc) {
            state = {
                [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
            }
        }
        return state;
    }
}
@registerModifier()
export class modifier_item_imba_gungir_force_ally extends BaseModifierMotionHorizontal_Plus {
    public effect: any;
    public pfx: any;
    public angle: any;
    public distance: number;
    public attacked_target: { [k: string]: EntityIndex };
    public god_piercing_radius: number;
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
        return 2;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_legion_commander_duel") || this.GetParentPlus().HasModifier("modifier_imba_enigma_black_hole") || this.GetParentPlus().HasModifier("modifier_imba_faceless_void_chronosphere_handler")) {
            this.Destroy();
            return;
        }
        this.effect = this.GetCasterPlus().TempData().force_staff_effect || "particles/items_fx/force_staff.vpcf";
        this.pfx = ResHelper.CreateParticleEx(this.effect, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
        this.StartIntervalThink(FrameTime());
        this.angle = this.GetParentPlus().GetForwardVector().Normalized();
        this.distance = this.GetItemPlus().GetSpecialValueFor("push_length") / (this.GetDuration() / FrameTime());
        this.attacked_target = {}
        this.god_piercing_radius = this.GetItemPlus().GetSpecialValueFor("god_piercing_radius");
        this.BeginMotionOrDestroy()

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
    CheckSelf() {
        if (!this.CheckMotionControllers()) {
            this.Destroy();
            return;
        }
        let attacker = this.GetParentPlus();
        let enemies = FindUnitsInRadius(attacker.GetTeamNumber(), attacker.GetAbsOrigin(), undefined, this.god_piercing_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!this.attacked_target[enemy.entindex() + ""]) {
                attacker.AttackOnce(enemy, true, true, true, true, true, false, false);
                this.attacked_target[enemy.entindex() + ""] = enemy.entindex();
            }
        }
        ProjectileHelper.ProjectileDodgePlus(this.GetParentPlus());
        return;
    }
    HorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (!IsServer()) {
            return;
        }
        let pos = unit.GetAbsOrigin();
        GridNav.DestroyTreesAroundPoint(pos, 80, false);
        let pos_p = this.angle * this.distance;
        let next_pos = GetGroundPosition(pos + pos_p as Vector, unit);
        unit.SetAbsOrigin(next_pos);
        this.CheckSelf()
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_item_imba_gungir_force_enemy_ranged extends BaseModifierMotionHorizontal_Plus {
    public effect: any;
    public pfx: any;
    public angle: any;
    public distance: number;
    IsDebuff(): boolean {
        return true;
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
        return 2;
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
        this.effect = this.GetCasterPlus().TempData().force_staff_effect || "particles/items_fx/force_staff.vpcf";
        this.pfx = ResHelper.CreateParticleEx(this.effect, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
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

    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (!IsServer()) {
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
export class modifier_item_imba_gungir_force_self_ranged extends BaseModifierMotionHorizontal_Plus {
    public effect: any;
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
    IgnoreTenacity() {
        return true;
    }

    GetPriority() {
        return 2;
    }
    BeCreated(p_0: any,): void {

        if (!IsServer()) {
            return;
        }
        this.BeginMotionOrDestroy()
        this.effect = this.GetCasterPlus().TempData().force_staff_effect || "particles/items_fx/force_staff.vpcf";
        this.pfx = ResHelper.CreateParticleEx(this.effect, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
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

    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (!IsServer()) {
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
export class modifier_item_imba_gungir_force_enemy_melee extends BaseModifierMotionHorizontal_Plus {
    public effect: any;
    public pfx: any;
    public angle: any;
    public distance: number;
    IsDebuff(): boolean {
        return true;
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
        return 2
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {

        if (!IsServer()) {
            return;
        }
        this.BeginMotionOrDestroy()
        this.effect = this.GetCasterPlus().TempData().force_staff_effect || "particles/items_fx/force_staff.vpcf";
        this.pfx = ResHelper.CreateParticleEx(this.effect, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
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

    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (!IsServer()) {
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
export class modifier_item_imba_gungir_force_self_melee extends BaseModifierMotionHorizontal_Plus {
    public effect: any;
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
    IgnoreTenacity() {
        return true;
    }

    GetPriority() {
        return 2;
    }
    BeCreated(p_0: any,): void {

        if (!IsServer()) {
            return;
        }
        this.BeginMotionOrDestroy()
        this.effect = this.GetCasterPlus().TempData().force_staff_effect || "particles/items_fx/force_staff.vpcf";
        this.pfx = ResHelper.CreateParticleEx(this.effect, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
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

    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (!IsServer()) {
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
export class modifier_item_imba_gungir_attack_speed extends BaseModifier_Plus {
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
