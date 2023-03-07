
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_sniper_shrapnel extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "sniper_shrapnel";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_shrapnel_charges";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAOERadius(): number {
        let ability = this;
        let radius = ability.GetSpecialValueFor("radius");
        return radius;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        let caster = this.GetCasterPlus();
        let base_range = super.GetCastRange(location, target);
        if (caster.HasTalent("special_bonus_imba_sniper_1")) {
            base_range = math.max(base_range, base_range * caster.GetTalentValue("special_bonus_imba_sniper_1"));
        } else {
            base_range = math.max(base_range, base_range);
        }
        return base_range;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.GetCursorPosition();
        let cast_response = {
            "1": "sniper_snip_ability_shrapnel_01",
            "2": "sniper_snip_ability_shrapnel_03"
        }
        let group_cast_response = {
            "1": "sniper_snip_ability_shrapnel_02",
            "2": "sniper_snip_ability_shrapnel_04",
            "3": "sniper_snip_ability_shrapnel_06"
        }
        let rare_group_cast_response = "sniper_snip_ability_shrapnel_06";
        let sound_cast = "Hero_Sniper.ShrapnelShoot";
        let sound_shrapnel = "Hero_Sniper.ShrapnelShatter";
        let particle_launch = "particles/units/heroes/hero_sniper/sniper_shrapnel_launch.vpcf";
        let modifier_charge = "modifier_imba_shrapnel_charges";
        let modifier_slow_aura = "modifier_imba_shrapnel_aura";
        let modifier_range = "modifier_imba_shrapnel_attack";
        let delay = ability.GetSpecialValueFor("delay");
        let duration = ability.GetSpecialValueFor("duration");
        let radius = ability.GetSpecialValueFor("radius");
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        if (GameFunc.GetCount(enemies) >= 4) {
            if (RollPercentage(5)) {
                EmitSoundOn(rare_group_cast_response, caster);
            } else if (RollPercentage(75)) {
                EmitSoundOn(GFuncRandom.RandomValue(group_cast_response), caster);
            }
        } else if (RollPercentage(75)) {
            EmitSoundOn(GFuncRandom.RandomValue(cast_response), caster);
        }
        EmitSoundOn(sound_cast, caster);
        EmitSoundOn(sound_shrapnel, caster);
        let distance = (target_point - caster.GetAbsOrigin() as Vector).Length2D();
        let direction = (target_point - caster.GetAbsOrigin() as Vector).Normalized();
        let launch_position = caster.GetAbsOrigin() + direction * (distance / 2) as Vector;
        let particle_launch_fx = ResHelper.CreateParticleEx(particle_launch, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControlEnt(particle_launch_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", caster.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(particle_launch_fx, 1, Vector(launch_position.x, launch_position.y, launch_position.z + 1000));
        ParticleManager.ReleaseParticleIndex(particle_launch_fx);
        if (caster.HasModifier(modifier_charge)) {
            let modifier_charge_handler = caster.FindModifierByName(modifier_charge);
            if (modifier_charge_handler) {
                modifier_charge_handler.DecrementStackCount();
            }
        }
        this.AddTimer(delay, () => {
            BaseModifier_Plus.CreateBuffThinker(caster, ability, modifier_slow_aura, {
                duration: duration
            }, target_point, caster.GetTeamNumber(), false);
            caster.AddNewModifier(caster, ability, modifier_range, {
                duration: duration
            });
            AddFOWViewer(caster.GetTeamNumber(), target_point, radius, duration, false);
        });
    }
}
@registerModifier()
export class modifier_imba_shrapnel_attack extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_slow: any;
    public modifier_attack: any;
    public distance_damage_pct: number;
    public global_fire_distance: number;
    public distance_from_target: number;
    public current_target: any;
    public global_distance: boolean;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.modifier_slow = "modifier_imba_shrapnel_slow";
            this.modifier_attack = "modifier_imba_shrapnel_attack";
            this.distance_damage_pct = this.ability.GetSpecialValueFor("distance_damage_pct");
            this.global_fire_distance = 25000;
            this.OnIntervalThink();
            this.StartIntervalThink(FrameTime());
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
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.caster.IsRealUnit()) {
                let heroes = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, 5000, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, hero] of GameFunc.iPair(heroes)) {
                    if (hero.GetUnitName() == this.caster.GetUnitName() && hero.IsIllusion() && !hero.HasModifier(this.modifier_attack)) {
                        hero.AddNewModifier(this.caster, this.ability, this.modifier_attack, {
                            duration: this.GetRemainingTime()
                        });
                    }
                }
            }
            if (!this.current_target) {
                this.distance_from_target = undefined;
                return undefined;
            }
            if (!this.current_target.HasModifier(this.modifier_slow)) {
                this.current_target = undefined;
                this.global_distance = false;
            }
            if (!this.current_target) {
                return undefined;
            }
            this.distance_from_target = (this.caster.GetAbsOrigin() - this.current_target.GetAbsOrigin() as Vector).Length2D();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let order_type = keys.order_type;
            let target = keys.target as IBaseNpc_Plus;
            let unit = keys.unit;
            if (unit == this.parent) {
                if (target && target.IsRoshan()) {
                    this.current_target = undefined;
                    this.global_distance = false;
                    return undefined;
                }
                if (order_type == dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET && target.HasModifier(this.modifier_slow)) {
                    this.current_target = target;
                    this.global_distance = true;
                } else {
                    this.current_target = undefined;
                    this.global_distance = false;
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (this.global_distance) {
            return this.global_fire_distance;
        }
        return undefined;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        if (IsServer()) {
            if (!this.current_target || !this.distance_from_target) {
                return 0;
            }
            let caster_attack_range = this.caster.Script_GetAttackRange();
            if (caster_attack_range < this.global_fire_distance) {
                return 0;
            }
            if (this.distance_from_target <= (caster_attack_range - this.global_fire_distance)) {
                return 0;
            } else {
                let distance_damage_pct = this.distance_damage_pct;
                if (this.caster.HasTalent("special_bonus_imba_sniper_8")) {
                    return distance_damage_pct;
                } else {
                    return (100 - distance_damage_pct) * (-1);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_shrapnel_charges extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_charge: any;
    public max_charge_count: number;
    public charge_replenish_rate: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.modifier_charge = "modifier_imba_shrapnel_charges";
            this.max_charge_count = this.ability.GetSpecialValueFor("max_charge_count");
            this.charge_replenish_rate = this.ability.GetSpecialValueFor("charge_replenish_rate");
            this.SetStackCount(this.max_charge_count);
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let stacks = this.GetStackCount();
            if (this.caster.HasAbility("special_bonus_imba_sniper_4") && this.caster.findAbliityPlus("special_bonus_imba_sniper_4").GetLevel() == 1) {
                this.max_charge_count = this.ability.GetSpecialValueFor("max_charge_count") * this.caster.GetTalentValue("special_bonus_imba_sniper_4", "max_charge_mult");
            } else {
                this.max_charge_count = this.ability.GetSpecialValueFor("max_charge_count");
            }
            if (stacks > 0) {
                this.ability.SetActivated(true);
            } else {
                this.ability.SetActivated(false);
            }
            if (stacks == this.max_charge_count) {
                return undefined;
            }
            if (this.GetRemainingTime() < 0) {
                let replenish_count = 1;
                if (this.caster.HasAbility("special_bonus_imba_sniper_4") && this.caster.findAbliityPlus("special_bonus_imba_sniper_4").GetLevel() == 1) {
                    replenish_count = this.caster.GetTalentValue("special_bonus_imba_sniper_4", "charges_per_recharge");
                }
                for (let i = 0; i < replenish_count; i++) {
                    this.IncrementStackCount();
                    if (this.GetStackCount() == this.max_charge_count) {
                        return;
                    }
                }
            }
        }
    }
    OnStackCountChanged(old_stack_count: number): void {
        if (IsServer()) {
            let stacks = this.GetStackCount();
            let true_replenish_cooldown = this.ability.GetSpecialValueFor("charge_replenish_rate");
            if (stacks < 1) {
                this.ability.EndCooldown();
                this.ability.StartCooldown(this.GetRemainingTime());
            }
            if (stacks == 1 && !this.ability.IsCooldownReady()) {
                this.ability.EndCooldown();
            }
            let lost_stack;
            if (old_stack_count > stacks) {
                lost_stack = true;
            } else {
                lost_stack = false;
            }
            if (!lost_stack) {
                if (stacks < this.max_charge_count) {
                    this.SetDuration(true_replenish_cooldown, true);
                } else {
                    this.SetDuration(-1, true);
                }
            } else {
                if (old_stack_count == this.max_charge_count) {
                    this.SetDuration(true_replenish_cooldown, true);
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let ability = keys.ability;
            let unit = keys.unit;
            if (unit == this.caster && ability.GetAbilityName() == "item_refresher") {
                this.SetStackCount(this.max_charge_count);
            }
        }
    }
    DestroyOnExpire(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_sniper_4 extends BaseModifier_Plus {
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
export class modifier_imba_shrapnel_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_shrapnel: any;
    public radius: number;
    public particle_shrapnel_fx: any;
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
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_shrapnel = "particles/units/heroes/hero_sniper/sniper_shrapnel.vpcf";
        if (this.caster.HasTalent("special_bonus_imba_sniper_3")) {
            this.particle_shrapnel = "particles/econ/items/sniper/sniper_charlie/sniper_shrapnel_charlie.vpcf";
        }
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.particle_shrapnel_fx = ResHelper.CreateParticleEx(this.particle_shrapnel, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(this.particle_shrapnel_fx, 0, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_shrapnel_fx, 1, Vector(this.radius, this.radius, 0));
        ParticleManager.SetParticleControl(this.particle_shrapnel_fx, 2, this.parent.GetAbsOrigin());
        this.AddParticle(this.particle_shrapnel_fx, false, false, -1, false, false);
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
        return "modifier_imba_shrapnel_slow";
    }
    IsAura(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_shrapnel_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public damage: number;
    public ms_slow_pct: number;
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
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.damage = this.ability.GetSpecialValueFor("damage");
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct");
        if (IsServer()) {
            let damageTable = {
                victim: this.parent,
                attacker: this.caster,
                damage: this.damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.ability
            }
            ApplyDamage(damageTable);
            this.StartIntervalThink(1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let damageTable = {
                victim: this.parent,
                attacker: this.caster,
                damage: this.damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.ability
            }
            ApplyDamage(damageTable);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_slow_pct * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_sniper_3", "armor_reduction") * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_sniper_3", "miss_chance_pct");
    }
}
@registerAbility()
export class imba_sniper_headshot extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_sniper_headshot";
    }
}
@registerModifier()
export class modifier_imba_sniper_headshot extends BaseModifier_Plus {
    public headshot_records: any;
    public perfectshot_records: any;
    take_aim_aimed_assault: any
    IsHidden(): boolean {
        return this.GetStackCount() <= 0;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.headshot_records = {}
        this.perfectshot_records = {}
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY,
            3: Enum_MODIFIER_EVENT.ON_ATTACK,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            5: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME,
            6: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            7: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    CC_OnAttackRecord(keys: ModifierAttackEvent): void {
        if (!this.GetParentPlus().PassivesDisabled() && !this.GetParentPlus().IsIllusion() && keys.target && !keys.target.IsBuilding() && !keys.target.IsOther() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            if (this.GetStackCount() < this.GetSpecialValueFor("perfectshot_attacks") && GFuncRandom.PRD(this.GetSpecialValueFor("proc_chance"), this)) {
                this.headshot_records[keys.record] = true;
            } else if (this.GetStackCount() >= this.GetSpecialValueFor("perfectshot_attacks") - 1) {
                this.headshot_records[keys.record] = true;
                this.perfectshot_records[keys.record] = true;
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    CC_OnAttackRecordDestroy(keys: ModifierAttackEvent): void {
        if (this.headshot_records[keys.record]) {
            this.headshot_records[keys.record] = undefined;
        }
        if (this.perfectshot_records[keys.record]) {
            this.perfectshot_records[keys.record] = undefined;
        }
        if (this.take_aim_aimed_assault && this.take_aim_aimed_assault[keys.record]) {
            this.take_aim_aimed_assault[keys.record] = undefined;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().PassivesDisabled() && keys.target && !keys.target.IsBuilding() && !keys.target.IsOther() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && (!this.take_aim_aimed_assault || this.take_aim_aimed_assault && !this.take_aim_aimed_assault[keys.record])) {
            if (this.GetStackCount() < this.GetSpecialValueFor("perfectshot_attacks") - 1) {
                this.IncrementStackCount();
            } else {
                this.SetStackCount(0);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().IsIllusion() && keys.target && !keys.target.IsBuilding() && !keys.target.IsOther() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && !keys.target.IsMagicImmune()) {
            if (this.headshot_records[keys.record]) {
                if (!GFuncEntity.Custom_IsUnderForcedMovement(keys.target)) {
                    let pos = this.GetParentPlus().GetAbsOrigin();
                    keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_knockback", {
                        center_x: pos.x + 1,
                        center_y: pos.y + 1,
                        center_z: pos.z,
                        duration: this.GetSpecialValueFor("knockback_duration") * (1 - keys.target.GetStatusResistance()),
                        knockback_duration: this.GetSpecialValueFor("knockback_duration") * (1 - keys.target.GetStatusResistance()),
                        knockback_distance: this.GetSpecialValueFor("knockback_distance"),
                        knockback_height: 0,
                        should_stun: 0
                    });
                    keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_headshot_slow", {
                        duration: this.GetSpecialValueFor("headshot_duration") * (1 - keys.target.GetStatusResistance())
                    });
                }
            }
            if (this.perfectshot_records[keys.record]) {
                keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_perfectshot_stun", {
                    duration: this.GetSpecialValueFor("perfectshot_stun_duration") * (1 - keys.target.GetStatusResistance())
                });
            }
            if (this.take_aim_aimed_assault && this.take_aim_aimed_assault[keys.record] && this.GetCasterPlus().HasTalent("special_bonus_imba_sniper_7")) {
                keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_headshot_eyeshot", {
                    duration: this.GetCasterPlus().GetTalentValue("special_bonus_imba_sniper_7", "duration") * (1 - keys.target.GetStatusResistance())
                });
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    CC_GetModifierProjectileName( /** keys */): string {
        if ((this.GetStackCount() == this.GetSpecialValueFor("perfectshot_attacks") - 1 || (this.GetCasterPlus().findBuffStack("modifier_imba_take_aim_range", this.GetCasterPlus()) && this.GetCasterPlus().findBuffStack("modifier_imba_take_aim_range", this.GetCasterPlus()) == 0)) && (this.GetParentPlus().GetAttackTarget() && !this.GetParentPlus().GetAttackTarget().IsBuilding() && !this.GetParentPlus().GetAttackTarget().IsOther() && this.GetParentPlus().GetAttackTarget().GetTeamNumber() != this.GetParentPlus().GetTeamNumber())) {
            return "particles/units/heroes/hero_sniper/sniper_assassinate.vpcf";
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(keys?: any /** keys */): number {
        if (keys.target && !this.GetParentPlus().IsIllusion() && !keys.target.IsBuilding() && !keys.target.IsOther() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && this.headshot_records[keys.record]) {
            return this.GetSpecialValueFor("headshot_damage");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE)
    CC_GetModifierPreAttack_CriticalStrike(keys: ModifierAttackEvent): number {
        if (keys.target && !this.GetParentPlus().IsIllusion() && !keys.target.IsBuilding() && !keys.target.IsOther() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && this.perfectshot_records[keys.record]) {
            return this.GetSpecialValueFor("perfectshot_critical_dmg_pct");
        }
    }
}
@registerModifier()
export class modifier_imba_headshot_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public headshot_ms_slow_pct: number;
    public headshot_as_slow: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.headshot_ms_slow_pct = this.ability.GetSpecialValueFor("headshot_ms_slow_pct");
        this.headshot_as_slow = this.ability.GetSpecialValueFor("headshot_as_slow");
        if (!IsServer()) {
            return;
        }
        let particle_slow_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_sniper/sniper_headshot_slow.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(particle_slow_fx, 0, this.GetParentPlus().GetAbsOrigin());
        this.AddParticle(particle_slow_fx, false, false, -1, false, true);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.headshot_as_slow * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.headshot_ms_slow_pct * (-1);
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
}
@registerModifier()
export class modifier_imba_perfectshot_stun extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public perfectshot_stun_duration: number;
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.perfectshot_stun_duration = this.ability.GetSpecialValueFor("perfectshot_stun_duration");
        if (!IsServer()) {
            return;
        }
        let particle_stun_fx = ResHelper.CreateParticleEx("particles/hero/sniper/perfectshot_stun.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(particle_stun_fx, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_stun_fx, 1, this.GetParentPlus().GetAbsOrigin());
        this.AddParticle(particle_stun_fx, false, false, -1, false, true);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state;
        let time_remaining = this.GetRemainingTime();
        let modifier_duration = this.GetDuration();
        if (this.perfectshot_stun_duration && (modifier_duration - time_remaining) > this.perfectshot_stun_duration) {
            state = undefined;
        } else {
            state = {
                [modifierstate.MODIFIER_STATE_STUNNED]: true
            }
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    IsHidden(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_headshot_eyeshot extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public damage_per_second: number;
    public vision_loss: any;
    public damage_interval: number;
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
        this.damage_per_second = this.caster.GetTalentValue("special_bonus_imba_sniper_7", "damage_per_second");
        this.vision_loss = this.caster.GetTalentValue("special_bonus_imba_sniper_7", "vision_loss");
        this.damage_interval = this.caster.GetTalentValue("special_bonus_imba_sniper_7", "damage_interval");
        if (IsServer()) {
            this.StartIntervalThink(this.damage_interval);
        }
    }
    OnIntervalThink(): void {
        let damage = this.damage_per_second * this.damage_interval;
        let damageTable = {
            victim: this.parent,
            attacker: this.caster,
            damage: damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this.ability
        }
        let actual_damage = ApplyDamage(damageTable);
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_DAMAGE, this.parent, actual_damage, undefined);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        return this.vision_loss * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        return this.vision_loss * (-1);
    }
}
@registerAbility()
export class imba_sniper_take_aim extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "sniper_take_aim";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_take_aim_range";
    }
    IsStealable(): boolean {
        return false;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        let caster = this.GetCasterPlus();
        let range = this.GetSpecialValueFor("passive_bonus_range");
        let aim_bonus_range = this.GetSpecialValueFor("aim_bonus_range");
        let base_range = 550;
        range = range + aim_bonus_range + base_range;
        return range;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        if (this.GetCasterPlus().HasModifier("modifier_imba_take_aim_range")) {
            this.GetCasterPlus().findBuff<modifier_imba_take_aim_range>("modifier_imba_take_aim_range").SetStackCount(0);
        }
        caster.MoveToTargetToAttack(target);
        caster.PerformAttack(target, false, true, false, false, true, false, false);
    }
}
@registerModifier()
export class modifier_imba_take_aim_range extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public forced_aimed_assault: any;
    public passive_bonus_range: number;
    public aim_bonus_range: number;
    public cooldown: number;
    public toggled_on_default: any;
    public headshot_modifier: any;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.forced_aimed_assault = false;
        this.passive_bonus_range = this.ability.GetSpecialValueFor("passive_bonus_range");
        this.aim_bonus_range = this.ability.GetSpecialValueFor("aim_bonus_range");
        this.cooldown = this.ability.GetSpecialValueFor("cooldown");
        if (IsServer()) {
            if (!this.toggled_on_default) {
                this.toggled_on_default = true;
                this.ability.ToggleAutoCast();
            }
            this.StartIntervalThink(0.1);
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

    OnIntervalThink(): void {
        if (IsServer()) {
            this.caster.SetAcquisitionRange(this.caster.Script_GetAttackRange() + 100);
            if (this.ability.IsCooldownReady() && this.ability.GetAutoCastState() && this.caster.IsRealUnit()) {
                this.SetStackCount(0);
            } else {
                this.SetStackCount(1);
            }
            if (!this.headshot_modifier && this.GetParentPlus().HasModifier("modifier_imba_sniper_headshot")) {
                this.headshot_modifier = this.GetParentPlus().findBuff<modifier_imba_sniper_headshot>("modifier_imba_sniper_headshot");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            3: Enum_MODIFIER_EVENT.ON_ATTACK
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    CC_OnAttackRecord(keys: ModifierAttackEvent): void {
        if (!this.GetParentPlus().IsIllusion() && keys.target && !keys.target.IsBuilding() && !keys.target.IsOther() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && this.GetStackCount() == 0 && this.headshot_modifier) {
            this.headshot_modifier.headshot_records[keys.record] = true;
            this.headshot_modifier.perfectshot_records[keys.record] = true;
            if (!this.headshot_modifier.take_aim_aimed_assault) {
                this.headshot_modifier.take_aim_aimed_assault = {}
            }
            this.headshot_modifier.take_aim_aimed_assault[keys.record] = true;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            if (this.caster == attacker) {
                if (this.GetStackCount() == 0 && this.ability.IsCooldownReady()) {
                    this.ability.UseResources(false, false, true);
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        let range = this.passive_bonus_range;
        if (this.caster.PassivesDisabled()) {
            range = 0;
        }
        let aim_bonus_range = this.aim_bonus_range + this.caster.GetTalentValue("special_bonus_imba_sniper_7");
        if (this.GetStackCount() == 0) {
            range = range + aim_bonus_range;
        }
        return range;
    }
}
@registerAbility()
export class imba_sniper_assassinate extends BaseAbility_Plus {
    public bAutoCast: any;
    public timer: ITimerTask;
    public enemy_table: IBaseNpc_Plus[];
    public enemies_hit: string[];
    public enemy_died: any;
    public meme_cooldown: number;
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_sniper_assassinate_handler";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_sniper_6")) {
            return super.GetBehavior();
        } else {
            return tonumber(tostring(super.GetBehavior())) + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
    }
    GetCastPoint(): number {
        let cast_point = super.GetCastPoint();
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_sniper_6") && this.GetCasterPlus().findBuffStack("modifier_imba_sniper_assassinate_handler", this.GetCasterPlus()) == 1) {
            cast_point = cast_point + this.GetCasterPlus().GetTalentValue("special_bonus_imba_sniper_6", "cast_point_increase");
            if (IsServer() == true && this.GetCasterPlus().HasModifier("modifier_imba_wisp_overcharge_721_aura") || this.GetCasterPlus().HasModifier("modifier_imba_wisp_overcharge_721") && this.GetCasterPlus().FindModifierByName) {
                let overcharge_modifier = this.GetCasterPlus().findBuff("modifier_imba_wisp_overcharge_721") || this.GetCasterPlus().FindModifierByName("modifier_imba_wisp_overcharge_721_aura") as any;
                if (overcharge_modifier.bonus_cast_speed) {
                    cast_point = cast_point / ((100 - math.min(overcharge_modifier.bonus_cast_speed, 99.99)) * 0.01);
                }
            }
        }
        if (this.GetCasterPlus().HasScepter()) {
            cast_point = cast_point - this.GetSpecialValueFor("scepter_cast_time");
        }
        return cast_point;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_sniper_headshot";
    }
    OnAbilityPhaseStart(): boolean {
        let caster = this.GetCasterPlus();
        let ability = this;
        let cast_response = {
            "1": "sniper_snip_ability_assass_02",
            "2": "sniper_snip_ability_assass_06",
            "3": "sniper_snip_ability_assass_07",
            "4": "sniper_snip_ability_assass_08"
        }
        let modifier_cross = "modifier_imba_assassinate_cross";
        let sight_duration = ability.GetSpecialValueFor("sight_duration");
        if (this.GetAutoCastState()) {
            sight_duration = sight_duration + this.GetCasterPlus().GetTalentValue("special_bonus_imba_sniper_6", "cast_point_increase");
        }
        if (caster.HasTalent("special_bonus_imba_sniper_6") && this.GetCasterPlus().findBuffStack("modifier_imba_sniper_assassinate_handler", this.GetCasterPlus()) == 1) {
            this.bAutoCast = true;
            let scepter_speed_mult = 1;
            if (caster.HasScepter()) {
                scepter_speed_mult = 0.7;
            }
            caster.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CAST_ABILITY_1, 0.75 * scepter_speed_mult);
            this.timer = GTimerHelper.AddTimer(1.75 * scepter_speed_mult, GHandler.create(this, () => {
                if (caster.GetCurrentActiveAbility() && caster.GetCurrentActiveAbility().GetAbilityName() == "imba_sniper_assassinate") {
                    caster.FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
                    caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4);
                }
            }));
        } else {
            this.bAutoCast = false;
            let playback_rate = 1.15;
            if (caster.HasScepter()) {
                playback_rate = 1.5;
            }
            caster.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CAST_ABILITY_4, playback_rate);
        }
        if (!this.enemy_table) {
            this.enemy_table = []
        }
        let targets = [this.GetCursorTarget()]
        EmitSoundOn(GFuncRandom.RandomValue(cast_response), caster);
        for (const [_, target] of GameFunc.iPair(targets)) {
            target.AddNewModifier(caster, ability, modifier_cross, {
                duration: sight_duration
            });
            this.enemy_table.push(target);
        }
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        let caster = this.GetCasterPlus();
        let modifier_cross = "modifier_imba_assassinate_cross";
        caster.FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
        caster.FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4);
        if (this.timer) {
            this.timer.Clear();
            this.timer = undefined;
        }
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (enemy.HasModifier(modifier_cross)) {
                enemy.RemoveModifierByName(modifier_cross);
            }
        }
        this.enemy_table = undefined;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let projectiles = ability.GetSpecialValueFor("projectiles");
        let targets = [this.GetCursorTarget()]
        this.enemies_hit = [];
        this.enemy_died = false;
        if (caster.HasTalent("special_bonus_imba_sniper_6") && this.bAutoCast) {
            projectiles = caster.GetTalentValue("special_bonus_imba_sniper_6", "total_projectiles");
        }
        let projectiles_fired = 0;
        let bAutoCast = this.bAutoCast;
        this.AddTimer(0, () => {
            projectiles_fired = projectiles_fired + 1;
            this.FireAssassinateProjectile(targets, projectiles_fired, projectiles, bAutoCast);
            if (projectiles_fired < projectiles) {
                return caster.GetTalentValue("special_bonus_imba_sniper_6", "refire_delay");
            }
        });
    }
    FireAssassinateProjectile(targets: IBaseNpc_Plus[], projectile_num: number, total_projectiles: number, bAutoCast = false) {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let particle_projectile = "particles/units/heroes/hero_sniper/sniper_assassinate.vpcf";
            let sound_assassinate = "Ability.Assassinate";
            let sound_assassinate_launch = "Hero_Sniper.AssassinateProjectile";
            EmitSoundOn(sound_assassinate, caster);
            EmitSoundOn(sound_assassinate_launch, caster);
            let travel_speed = this.GetSpecialValueFor("travel_speed");
            for (const [_, target] of GameFunc.iPair(targets)) {
                target.TempData().primary_assassination_target = true;
                let assassinate_projectile;
                assassinate_projectile = {
                    Target: target,
                    Source: caster,
                    Ability: this,
                    EffectName: particle_projectile,
                    iMoveSpeed: travel_speed,
                    bDodgeable: true,
                    bVisibleToEnemies: true,
                    bReplaceExisting: false,
                    bProvidesVision: false,
                    ExtraData: {
                        target_entindex: target.entindex(),
                        projectile_num: projectile_num,
                        total_projectiles: total_projectiles,
                        bAutoCast: bAutoCast
                    }
                }
                ProjectileManager.CreateTrackingProjectile(assassinate_projectile);
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, extradata: any): boolean | void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let almost_kill_responses = {
            "1": "sniper_snip_ability_fail_02",
            "2": "sniper_snip_ability_fail_04",
            "3": "sniper_snip_ability_fail_05",
            "4": "sniper_snip_ability_fail_06",
            "5": "sniper_snip_ability_fail_07",
            "6": "sniper_snip_ability_fail_08"
        }
        let modifier_cross = "modifier_imba_assassinate_cross";
        let modifier_ministun = "modifier_imba_assassinate_ministun";
        let projectile_num = extradata.projectile_num;
        let damage = ability.GetSpecialValueFor("damage");
        let ministun_duration = ability.GetSpecialValueFor("ministun_duration");
        if (projectile_num == extradata.total_projectiles && EntIndexToHScript(extradata.target_entindex)) {
            (EntIndexToHScript(extradata.target_entindex) as IBaseNpc_Plus).RemoveModifierByName(modifier_cross);
        }
        if (!target) {
            return undefined;
        }
        this.AssassinateHit(target, projectile_num);
        this.AddTimer(0.3, () => {
            target.TempData().primary_assassination_target = false;
        });
        this.AddTimer(0.1, () => {
            if (!this.enemy_died) {
                let hp_pct = target.GetHealthPercent();
                if (hp_pct <= 10 && target.IsAlive()) {
                    EmitSoundOn(GFuncRandom.RandomValue(almost_kill_responses), caster);
                }
            }
        });
    }
    AssassinateHit(target: IBaseNpc_Plus, projectile_num: number) {
        let caster = this.GetCasterPlus();
        let kill_responses = {
            "1": "sniper_snip_ability_assass_03",
            "2": "sniper_snip_ability_assass_04",
            "3": "sniper_snip_ability_assass_05",
            "4": "sniper_snip_ability_assass_03",
            "5": "sniper_snip_kill_03",
            "6": "sniper_snip_kill_08",
            "7": "sniper_snip_kill_10",
            "8": "sniper_snip_kill_13",
            "9": "sniper_snip_tf2_01",
            "10": "sniper_snip_tf2_01"
        }
        let particle_sparks = "particles/units/heroes/hero_sniper/sniper_assassinate_impact_sparks.vpcf";
        let particle_light = "particles/units/heroes/hero_sniper/sniper_assassinate_endpoint.vpcf";
        let particle_stun = "particles/hero/sniper/perfectshot_stun.vpcf";
        let modifier_ministun = "modifier_imba_assassinate_ministun";
        let modifier_perfectshot = "modifier_imba_perfectshot_stun";
        let modifier_headshot = "modifier_imba_headshot_slow";
        let head_shot_ability = "imba_sniper_headshot";
        let damage = this.GetSpecialValueFor("damage");
        let ministun_duration = this.GetSpecialValueFor("ministun_duration");
        if (caster.HasScepter()) {
            ministun_duration = this.GetSpecialValueFor("scepter_stun_duration");
        }
        let target_key = target.entindex() + tostring(projectile_num);
        for (const [_, enemy] of GameFunc.iPair(this.enemies_hit)) {
            if (enemy == target_key) {
                return;
            }
        }
        this.enemies_hit.push(target_key);
        if (target.TempData().primary_assassination_target) {
            if (target.GetTeam() != caster.GetTeam()) {
                if (target.TriggerSpellAbsorb(this)) {
                    return;
                }
            }
        } else {
            let particle_sparks_fx = ResHelper.CreateParticleEx(particle_sparks, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
            ParticleManager.SetParticleControlEnt(particle_sparks_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(particle_sparks_fx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(particle_sparks_fx);
            let particle_light_fx = ResHelper.CreateParticleEx(particle_light, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
            ParticleManager.SetParticleControlEnt(particle_light_fx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(particle_light_fx);
        }
        if (!target.IsMagicImmune()) {
            let damageTable = {
                victim: target,
                attacker: caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this
            }
            ApplyDamage(damageTable);
            target.AddNewModifier(caster, this, modifier_ministun, {
                duration: ministun_duration * (1 - target.GetStatusResistance())
            });
            if (target.IsRealUnit() && !target.IsAlive() && RollPercentage(100) && (!this.meme_cooldown || GameRules.GetGameTime() - this.meme_cooldown >= 2.0)) {
                target.EmitSound("Hero_Sniper.Boom_Headshot");
                this.meme_cooldown = GameRules.GetGameTime();
            }
        }
        if (caster.HasTalent("special_bonus_imba_sniper_2")) {
            let push_distance = caster.GetTalentValue("special_bonus_imba_sniper_2");
            let knockbackProperties = {
                center_x: caster.GetAbsOrigin().x,
                center_y: caster.GetAbsOrigin().y,
                center_z: caster.GetAbsOrigin().z,
                duration: 0.2 * (1 - target.GetStatusResistance()),
                knockback_duration: 0.2 * (1 - target.GetStatusResistance()),
                knockback_distance: push_distance,
                knockback_height: 0
            }
            target.RemoveModifierByName("modifier_knockback");
            target.AddNewModifier(target, undefined, "modifier_knockback", knockbackProperties);
        }
        this.AddTimer(FrameTime(), () => {
            if (!target.IsAlive() && !this.enemy_died) {
                this.enemy_died = true;
                if (RollPercentage(50)) {
                    EmitSoundOn(GFuncRandom.RandomValue(kill_responses), caster);
                }
            }
        });
    }
    OnProjectileThink_ExtraData(location: Vector, extradata: any): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let projectile_num = extradata.projectile_num;
        let bullet_radius = ability.GetSpecialValueFor("bullet_radius");
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, bullet_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!enemy.TempData().primary_assassination_target) {
                this.AssassinateHit(enemy, projectile_num);
            }
        }
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("cast_range");
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_sniper_6") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_sniper_6")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_sniper_6"), "modifier_special_bonus_imba_sniper_6", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_sniper_9") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_sniper_9")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_sniper_9"), "modifier_special_bonus_imba_sniper_9", {});
        }
    }
}
@registerModifier()
export class modifier_imba_sniper_assassinate_handler extends BaseModifier_Plus {
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
export class modifier_imba_assassinate_cross extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public particle_cross: any;
    public should_share_vision: any;
    public particle_cross_fx: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.parent = this.GetParentPlus();
            this.particle_cross = "particles/units/heroes/hero_sniper/sniper_crosshair.vpcf";
            if (this.parent.IsNeutralUnitType()) {
                this.should_share_vision = false;
            } else {
                this.should_share_vision = true;
            }
            this.particle_cross_fx = ParticleManager.CreateParticleForTeam(this.particle_cross, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent, this.caster.GetTeamNumber());
            ParticleManager.SetParticleControl(this.particle_cross_fx, 0, this.parent.GetAbsOrigin());
            this.AddParticle(this.particle_cross_fx, false, false, -1, false, true);
        }
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE;
    }
    IgnoreTenacity() {
        return true;
    }
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
        let state = undefined;
        if (this.GetParentPlus().HasModifier("modifier_slark_shadow_dance")) {
            state = {
                [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true
            }
        }
        if (this.should_share_vision) {
            state = {
                [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true,
                [modifierstate.MODIFIER_STATE_INVISIBLE]: false
            }
        }
        return state;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
}
@registerModifier()
export class modifier_imba_assassinate_ministun extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_sniper_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_sniper_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_sniper_6 extends BaseModifier_Plus {
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
        if (this.GetParentPlus().HasAbility("imba_sniper_assassinate")) {
            this.GetParentPlus().findAbliityPlus<imba_sniper_assassinate>("imba_sniper_assassinate").ToggleAutoCast();
            if (this.GetParentPlus().HasModifier("modifier_imba_sniper_assassinate_handler")) {
                this.GetParentPlus().findBuff<modifier_imba_sniper_assassinate_handler>("modifier_imba_sniper_assassinate_handler").SetStackCount(1);
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_sniper_9 extends BaseModifier_Plus {
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
