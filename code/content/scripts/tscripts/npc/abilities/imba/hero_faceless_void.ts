
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseModifierMotion, registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerModifier()
export class modifier_imba_faceless_void_chronocharges extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetTexture(): string {
        return "faceless_void_time_lock";
    }
}
@registerAbility()
export class imba_faceless_void_timelord extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "faceless_void_timelord";
    }
    IsInnateAbility() {
        return true;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_faceless_void_timelord";
    }
}
@registerModifier()
export class modifier_imba_faceless_void_timelord extends BaseModifier_Plus {
    public bonusAS: number;
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    BeCreated(p_0: any,): void {
        this.StartIntervalThink(0.2);
        this.bonusAS = 0;
        let parent = this.GetParentPlus();
        if (!parent.HasModifier("modifier_imba_faceless_void_timelord")) {
            parent.AddNewModifier(parent, this.GetAbilityPlus(), "modifier_imba_faceless_void_timelord", {});
        }
    }
    OnIntervalThink(): void {
        let parent = this.GetParentPlus();
        let currentAS = parent.GetAttackSpeed() - this.bonusAS;
        let talent_multiplication = 1;
        if (parent.HasTalent("special_bonus_imba_faceless_void_6")) {
            let chrono_stacks = parent.findBuffStack("modifier_imba_faceless_void_chronosphere_handler", parent);
            if (chrono_stacks == 1 || chrono_stacks == 3) {
                talent_multiplication = parent.GetTalentValue("special_bonus_imba_faceless_void_6");
            }
        }
        let increase = this.GetSpecialValueFor("as_pcnt_increase") * 0.01 * talent_multiplication;
        this.bonusAS = currentAS * increase;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetParentPlus().PassivesDisabled()) {
            return 0;
        }
        return this.bonusAS * 100;
    }
}
@registerAbility()
export class imba_faceless_void_time_walk extends BaseAbility_Plus {
    public old_position: any;
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetCooldown(level: number): number {
        return this.GetSpecialValueFor("AbilityCooldown", level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_faceless_void_11");
    }
    GetIntrinsicModifierName(): string {
        if (!this.GetCasterPlus().IsIllusion()) {
            return "modifier_imba_faceless_void_time_walk_damage_counter";
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetBehavior();
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE;
        }
    }
    GetAOERadius(): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("radius_scepter");
        }
    }
    OnUpgrade(): void {
        if (IsServer()) {
            if (!this.IsStolen()) {
                let caster = this.GetCasterPlus();
                if (!caster.HasModifier("modifier_imba_faceless_void_chronocharges")) {
                    caster.AddNewModifier(caster, this, "modifier_imba_faceless_void_chronocharges", {});
                }
            }
            let reverse = this.GetCasterPlus().findAbliityPlus<imba_faceless_void_time_walk_reverse>("imba_faceless_void_time_walk_reverse");
            if (reverse && reverse.GetLevel() == 0) {
                reverse.SetLevel(1);
            }
        }
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLINCH;
    }
    OnAbilityPhaseStart(): boolean {
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
        return true;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (IsClient()) {
            let cast_range = this.GetSpecialValueFor("range") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_faceless_void_9") + this.GetCasterPlus().GetCastRangeBonus();
            if (this.GetCasterPlus().HasShard()) {
                cast_range = cast_range + 200;
            }
            return cast_range;
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let slow_radius = this.GetSpecialValueFor("slow_radius");
        let position = this.GetCursorPosition();
        this.old_position = this.GetCasterPlus().GetAbsOrigin();
        caster.EmitSound("Hero_FacelessVoid.TimeWalk");
        let max_cast_range = this.GetSpecialValueFor("range") + caster.GetTalentValue("special_bonus_imba_faceless_void_9") + this.GetCasterPlus().GetCastRangeBonus();
        if (this.GetCasterPlus().HasShard()) {
            max_cast_range = max_cast_range + 200;
        }
        caster.AddNewModifier(caster, this, "modifier_imba_faceless_void_time_walk_cast", {
            duration: math.min((position - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D(), max_cast_range) / this.GetSpecialValueFor("speed") + 0.5,
            x: position.x,
            y: position.y,
            z: position.z
        });
        if (caster.HasShard()) {
            caster.SwapAbilities(this.GetAbilityName(), "imba_faceless_void_time_walk_reverse", false, true);
            caster.SetContextThink(DoUniqueString("time_walk_reverse"), () => {
                caster.SwapAbilities(this.GetAbilityName(), "imba_faceless_void_time_walk_reverse", true, false);
                return undefined;
            }, this.GetSpecialValueFor("time_walk_reverse_timer"));
        }
        if (caster.TempData().time_walk_damage_taken) {
            caster.Heal(caster.TempData().time_walk_damage_taken, this);
        }
        let aoe_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_faceless_void/faceless_void_time_walk_slow.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(aoe_pfx, 1, Vector(slow_radius, 0, 0));
        ParticleManager.ReleaseParticleIndex(aoe_pfx);
        ProjectileManager.ProjectileDodge(caster);
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_faceless_void_9") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_faceless_void_9")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_faceless_void_9"), "modifier_special_bonus_imba_faceless_void_9", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_faceless_void_11") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_faceless_void_11")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_faceless_void_11"), "modifier_special_bonus_imba_faceless_void_11", {});
        }
    }
}
@registerModifier()
export class modifier_imba_faceless_void_time_walk_damage_counter extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public damage_time: number;
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.damage_time = this.ability.GetSpecialValueFor("backtrack_duration");
        if (IsServer()) {
            if (!this.caster.TempData().time_walk_damage_taken) {
                this.caster.TempData().time_walk_damage_taken = 0;
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let unit = keys.unit;
            let damage_taken = keys.damage;
            if (unit == this.caster) {
                this.caster.TempData().time_walk_damage_taken = this.caster.TempData().time_walk_damage_taken + damage_taken;
                this.AddTimer(this.damage_time, () => {
                    if (this.caster.TempData().time_walk_damage_taken) {
                        this.caster.TempData().time_walk_damage_taken = this.caster.TempData().time_walk_damage_taken - damage_taken;
                    }
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_faceless_void_time_walk_buff_as extends BaseModifier_Plus {
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_faceless_void_time_walk_buff_ms extends BaseModifier_Plus {
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_faceless_void_time_walk_cast extends BaseModifierMotionHorizontal_Plus {
    public radius_scepter: number;
    public velocity: any;
    public direction: any;
    public distance_traveled: number;
    public distance: number;
    public as_stolen: any;
    public ms_stolen: any;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
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
    GetEffectName(): string {
        return "particles/units/heroes/hero_faceless_void/faceless_void_time_walk.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
    BeCreated(params: any): void {
        this.radius_scepter = this.GetSpecialValueFor("radius_scepter");
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let position = GetGroundPosition(Vector(params.x, params.y, params.z), undefined);
            let max_distance = ability.GetSpecialValueFor("range") + caster.GetTalentValue("special_bonus_imba_faceless_void_9") + this.GetCasterPlus().GetCastRangeBonus();
            if (caster.HasShard()) {
                max_distance = max_distance + 200;
            }
            let distance = math.min((caster.GetAbsOrigin() - position as Vector).Length2D(), max_distance);
            if (ability.GetAbilityName() == "imba_faceless_void_time_walk_reverse") {
                distance = (caster.GetAbsOrigin() - position as Vector).Length2D();
            }
            this.velocity = ability.GetSpecialValueFor("speed");
            this.direction = (position - this.GetParentPlus().GetAbsOrigin() as Vector).Normalized();
            this.distance_traveled = 0;
            this.distance = distance;
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_faceless_void/faceless_void_time_walk_preimage.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
            ParticleManager.SetParticleControl(particle, 0, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(particle, 1, this.GetParentPlus().GetAbsOrigin() + this.direction * distance as Vector);
            ParticleManager.SetParticleControlEnt(particle, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetParentPlus().GetForwardVector(), true);
            ParticleManager.ReleaseParticleIndex(particle);
            this.as_stolen = 0;
            this.ms_stolen = 0;
        }
    }
    ApplyHorizontalMotionController(): boolean {
        if (!this.CheckMotionControllers()) {
            this.Destroy();
            return false;
        }
        let ability = this.GetAbilityPlus();
        if (ability.GetAbilityName() == "imba_faceless_void_time_walk") {
            let caster = this.GetParentPlus();
            let aoe = this.GetSpecialValueFor("slow_radius");
            let duration = this.GetSpecialValueFor("duration");
            let as_steal = this.GetSpecialValueFor("as_steal");
            let ms_steal = this.GetSpecialValueFor("ms_steal_pcnt");
            let chronocharges = 0;
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.HasModifier("modifier_imba_faceless_void_time_walk_slow")) {
                    if (enemy.IsRealUnit()) {
                        this.as_stolen = this.as_stolen + enemy.GetAttackSpeed() * as_steal;
                        this.ms_stolen = this.ms_stolen + enemy.GetMoveSpeedModifier(enemy.GetBaseMoveSpeed(), false) * ms_steal;
                        chronocharges = chronocharges + 1;
                    }
                    if (enemy.IsRealUnit()) {
                        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_faceless_void/faceless_void_backtrack02.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, enemy);
                        ParticleManager.SetParticleControl(particle, 0, enemy.GetAbsOrigin());
                        ParticleManager.ReleaseParticleIndex(particle);
                    }
                    enemy.AddNewModifier(caster, ability, "modifier_imba_faceless_void_time_walk_slow", {
                        duration: duration * (1 - enemy.GetStatusResistance())
                    });
                }
            }
            if (!ability.IsStolen() && this.GetParentPlus().findBuff<modifier_imba_faceless_void_chronocharges>("modifier_imba_faceless_void_chronocharges")) {
                this.GetParentPlus().findBuff<modifier_imba_faceless_void_chronocharges>("modifier_imba_faceless_void_chronocharges").SetStackCount(this.GetParentPlus().FindModifierByName("modifier_imba_faceless_void_chronocharges").GetStackCount() + chronocharges);
            }
        }
        return true;
    }
    OnRemoved(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let duration = ability.GetSpecialValueFor("duration");
            let aoe = this.GetSpecialValueFor("slow_radius");
            let asBuff = caster.AddNewModifier(caster, ability, "modifier_imba_faceless_void_time_walk_buff_as", {
                duration: duration
            });
            let msBuff = caster.AddNewModifier(caster, ability, "modifier_imba_faceless_void_time_walk_buff_ms", {
                duration: duration
            });
            asBuff.SetStackCount(this.as_stolen);
            msBuff.SetStackCount(this.ms_stolen);
            if (this.GetCasterPlus().HasScepter() && this.GetCasterPlus().HasModifier("modifier_imba_faceless_void_time_lock_720")) {
                for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.radius_scepter, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                    this.GetCasterPlus().findBuff<modifier_imba_faceless_void_time_lock_720>("modifier_imba_faceless_void_time_lock_720").ApplyTimeLock(enemy);
                }
            }
            this.AddTimer(0.1, () => {
                let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_faceless_void/faceless_void_time_walk_slow.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                ParticleManager.SetParticleControl(particle, 1, Vector(aoe, aoe, aoe));
                ParticleManager.ReleaseParticleIndex(particle);
                caster.FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
            });
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
        }
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (this.distance_traveled < this.distance) {
            this.GetCasterPlus().SetAbsOrigin(this.GetCasterPlus().GetAbsOrigin() + (this.direction * math.min(this.velocity * dt, this.distance - this.distance_traveled)) as Vector);
            this.distance_traveled = this.distance_traveled + math.min(this.velocity * dt, this.distance - this.distance_traveled);
        } else {
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_faceless_void_time_walk_slow extends BaseModifier_Plus {
    public ms_steal_pcnt: any;
    public as_steal: any;
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_faceless_void/faceless_void_time_walk_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        this.ms_steal_pcnt = this.GetSpecialValueFor("ms_steal_pcnt") * (-1);
        this.as_steal = this.GetSpecialValueFor("as_steal") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_steal_pcnt;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.as_steal;
    }
}
@registerAbility()
export class imba_faceless_void_time_dilation extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        if (IsClient()) {
            return this.GetSpecialValueFor("area_of_effect");
        }
    }
    OnUpgrade(): void {
        if (IsServer()) {
            if (this.IsStolen()) {
                if (this.GetLevel() == 1) {
                    let caster = this.GetCasterPlus();
                    let originalCaster = caster.TempData().spellStealTarget as IBaseNpc_Plus;
                    if (originalCaster) {
                        let chronochargeModifier = originalCaster.findBuff<modifier_imba_faceless_void_chronocharges>("modifier_imba_faceless_void_chronocharges");
                        if (chronochargeModifier) {
                            caster.findBuff<modifier_imba_faceless_void_chronocharges>("modifier_imba_faceless_void_chronocharges").SetStackCount(caster.FindModifierByName("modifier_imba_faceless_void_chronocharges").GetStackCount());
                        }
                    }
                }
            } else {
                let caster = this.GetCasterPlus();
                if (!caster.HasModifier("modifier_imba_faceless_void_chronocharges")) {
                    caster.AddNewModifier(caster, this, "modifier_imba_faceless_void_chronocharges", {});
                }
            }
        }
    }
    OnUnStolen(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster.HasModifier("modifier_imba_faceless_void_chronocharges")) {
                caster.RemoveModifierByName("modifier_imba_faceless_void_chronocharges");
            }
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let aoe = this.GetSpecialValueFor("area_of_effect");
        let duration = this.GetSpecialValueFor("duration");
        let cd_increase = this.GetSpecialValueFor("cd_increase");
        let cd_decrease = this.GetSpecialValueFor("cd_decrease");
        let charge_gain = this.GetSpecialValueFor("charge_gain");
        let chronocharges = 0;
        let chronocharges_modifier = caster.findBuff<modifier_imba_faceless_void_chronocharges>("modifier_imba_faceless_void_chronocharges");
        if (chronocharges_modifier) {
            chronocharges = chronocharges_modifier.GetStackCount();
        } else {
            caster.AddNewModifier(caster, this, "modifier_imba_faceless_void_chronocharges", {});
        }
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_CLOSEST, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (enemy.IsRealUnit()) {
                enemy.EmitSound("Hero_FacelessVoid.TimeDilation.Target");
                let hit_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_faceless_void/faceless_void_backtrack.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, enemy);
                ParticleManager.SetParticleControl(hit_pfx, 0, enemy.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(hit_pfx);
                let hit_pfx_2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_faceless_void/faceless_void_dialatedebuf_d.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, enemy);
                ParticleManager.ReleaseParticleIndex(hit_pfx_2);
                let abilities_on_cooldown = 0;
                for (let i = 0; i <= 23; i++) {
                    let current_ability = enemy.GetAbilityByIndex(i);
                    if (current_ability && !current_ability.IsPassive() && !current_ability.IsAttributeBonus() && !current_ability.IsCooldownReady()) {
                        current_ability.StartCooldown(current_ability.GetCooldownTimeRemaining() + cd_increase);
                        abilities_on_cooldown = abilities_on_cooldown + 1;
                        chronocharges = chronocharges + charge_gain;
                        if (caster.HasTalent("special_bonus_imba_faceless_void_1")) {
                            caster.AddNewModifier(caster, this, "modifier_imba_time_dilation_talent", {
                                duration: caster.GetTalentValue("special_bonus_imba_faceless_void_1", "duration")
                            });
                        }
                    }
                }
                if (abilities_on_cooldown > 0) {
                    let debuff = enemy.AddNewModifier(caster, this, "modifier_imba_faceless_void_time_dilation_slow", {
                        duration: cd_increase * (1 - enemy.GetStatusResistance())
                    });
                    if (debuff) {
                        debuff.SetStackCount(abilities_on_cooldown);
                    }
                }
            }
        }
        let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_CLOSEST, false);
        let charges_spent = 0;
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (!caster.HasTalent("special_bonus_imba_faceless_void_7")) {
                if (chronocharges <= 0) {
                    return;
                }
            }
            let abilities_on_cooldown = 0;
            for (let i = 0; i <= 23; i++) {
                if (chronocharges > 0 || caster.HasTalent("special_bonus_imba_faceless_void_7")) {
                    let current_ability = ally.GetAbilityByIndex(i);
                    if (current_ability && current_ability != this && current_ability.GetLevel() > 0 && !current_ability.IsPassive() && !current_ability.IsAttributeBonus() && !current_ability.IsCooldownReady() && current_ability.GetAbilityType() != ABILITY_TYPES.ABILITY_TYPE_ULTIMATE) {
                        let newCooldown = current_ability.GetCooldownTimeRemaining() - cd_decrease;
                        current_ability.EndCooldown();
                        current_ability.StartCooldown(newCooldown);
                        abilities_on_cooldown = abilities_on_cooldown + 1;
                        if (!caster.HasTalent("special_bonus_imba_faceless_void_7")) {
                            chronocharges = chronocharges - 1;
                        }
                    }
                } else {
                    return;
                }
            }
            if (abilities_on_cooldown > 0) {
                let buff = ally.AddNewModifier(caster, this, "modifier_imba_faceless_void_time_dilation_buff", {
                    duration: cd_increase
                });
                buff.SetStackCount(abilities_on_cooldown);
                ally.EmitSound("Hero_FacelessVoid.TimeDilation.Target");
                let hit_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_faceless_void/faceless_void_backtrack.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, ally);
                ParticleManager.SetParticleControl(hit_pfx, 0, ally.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(hit_pfx);
                charges_spent = charges_spent + abilities_on_cooldown;
            }
        }
        if (!this.IsStolen()) {
            chronocharges_modifier = caster.findBuff<modifier_imba_faceless_void_chronocharges>("modifier_imba_faceless_void_chronocharges");
            chronocharges_modifier.SetStackCount(chronocharges);
        }
        caster.EmitSound("Hero_FacelessVoid.TimeDilation.Cast");
        let cast_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_faceless_void/faceless_void_timedialate.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(cast_pfx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(cast_pfx, 1, Vector(aoe * 2, 0, 0));
        ParticleManager.ReleaseParticleIndex(cast_pfx);
        let cast_pfx_2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_faceless_void/faceless_void_backtrack.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(cast_pfx_2, 0, caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(cast_pfx_2);
    }
}
@registerModifier()
export class modifier_imba_faceless_void_time_dilation_buff extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_faceless_void/faceless_void_dialatedebuf.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetSpecialValueFor("ms_buff") * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetSpecialValueFor("as_buff") * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.GetAbilityPlus().GetCaster().GetTalentValue("special_bonus_imba_faceless_void_2", "hp_regen") * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.GetAbilityPlus().GetCaster().GetTalentValue("special_bonus_imba_faceless_void_2", "mp_regen") * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_faceless_void_time_dilation_slow extends BaseModifier_Plus {
    public ms_debuff: any;
    public as_debuff: any;
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_faceless_void/faceless_void_dialatedebuf.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    Init(p_0: any,): void {
        this.ms_debuff = this.GetSpecialValueFor("ms_debuff");
        this.as_debuff = this.GetSpecialValueFor("as_debuff");
    }

    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_debuff * this.GetStackCount() * -1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.as_debuff * this.GetStackCount() * -1;
    }
}
@registerModifier()
export class modifier_imba_time_dilation_talent extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public caster: IBaseNpc_Plus;
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.parent = this.GetParentPlus();
            this.caster = this.GetCasterPlus();
            this.IncrementStackCount();
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            this.IncrementStackCount();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        let caster = this.GetCasterPlus();
        let chance = this.caster.GetTalentValue("special_bonus_imba_faceless_void_1", "backtrack_pct_per_enemy") * this.GetStackCount();
        let max_chance = this.caster.GetTalentValue("special_bonus_imba_faceless_void_1", "max_pct");
        if (chance < max_chance) {
            if (RollPercentage(chance)) {
                let backtrack_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_faceless_void/faceless_void_backtrack.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                ParticleManager.SetParticleControl(backtrack_fx, 0, caster.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(backtrack_fx);
                return -100;
            }
        } else {
            if (RollPercentage(max_chance)) {
                let backtrack_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_faceless_void/faceless_void_backtrack.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                ParticleManager.SetParticleControl(backtrack_fx, 0, caster.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(backtrack_fx);
                return -100;
            }
        }
    }
}
@registerAbility()
export class imba_faceless_void_time_lock extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        if (!this.GetCasterPlus().IsIllusion()) {
            return "modifier_imba_faceless_void_time_lock";
        }
    }
}
@registerModifier()
export class modifier_imba_faceless_void_time_lock extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_MAGICAL
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_MAGICAL)
    CC_GetModifierProcAttack_BonusDamage_Magical(keys: ModifierAttackEvent): number {
        if (IsServer()) {
            let target = keys.target;
            let attacker = keys.attacker;
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            let bonus_damage_to_main_target = 0;
            if (parent == attacker && !target.IsOther() && !target.IsBuilding() && !parent.PassivesDisabled() && parent.GetTeamNumber() != target.GetTeamNumber()) {
                let bashChance = ability.GetSpecialValueFor("bash_chance");
                let bashDamage = ability.GetSpecialValueFor("bash_damage");
                let bashDuration = ability.GetSpecialValueFor("bash_duration");
                let creep_bash_duration = ability.GetSpecialValueFor("creep_bash_duration");
                let cdIncrease = ability.GetSpecialValueFor("cd_increase");
                let talent_cd_increase = 0;
                if (GFuncRandom.PRD(bashChance, this)) {
                    bonus_damage_to_main_target = bonus_damage_to_main_target + bashDamage;
                    if (!target.findBuff<modifier_imba_faceless_void_chronosphere_handler>("modifier_imba_faceless_void_chronosphere_handler")) {
                        if (target.findBuff<modifier_imba_faceless_void_time_dilation_slow>("modifier_imba_faceless_void_time_dilation_slow")) {
                            talent_cd_increase = attacker.GetTalentValue("special_bonus_imba_faceless_void_4", "target_increase");
                            let caster_cd_decrease = attacker.GetTalentValue("special_bonus_imba_faceless_void_4", "self_reduction");
                            for (let i = 0; i <= 23; i++) {
                                let casterAbility = attacker.GetAbilityByIndex(i);
                                if (casterAbility && casterAbility.GetLevel() > 0 && !casterAbility.IsPassive() && !casterAbility.IsAttributeBonus() && !casterAbility.IsCooldownReady()) {
                                    let newCooldown = casterAbility.GetCooldownTimeRemaining() - caster_cd_decrease;
                                    casterAbility.EndCooldown();
                                    casterAbility.StartCooldown(newCooldown);
                                }
                            }
                        }
                        if (attacker.HasTalent("special_bonus_imba_faceless_void_5")) {
                            attacker.findAbliityPlus<imba_faceless_void_chronosphere>("imba_faceless_void_chronosphere").OnSpellStart(true, target.GetAbsOrigin());
                        }
                        if (target.IsRealUnit()) {
                            target.AddNewModifier(parent, ability, "modifier_imba_faceless_void_time_lock_stun", {
                                duration: bashDuration * (1 - target.GetStatusResistance())
                            });
                        } else {
                            target.AddNewModifier(parent, ability, "modifier_imba_faceless_void_time_lock_stun", {
                                duration: creep_bash_duration * (1 - target.GetStatusResistance())
                            });
                        }
                        EmitSoundOn("Hero_FacelessVoid.TimeLockImpact", target);
                        if (target.IsRealUnit()) {
                            this.GetParentPlus().findBuff<modifier_imba_faceless_void_chronocharges>("modifier_imba_faceless_void_chronocharges").SetStackCount(this.GetParentPlus().FindModifierByName("modifier_imba_faceless_void_chronocharges").GetStackCount() + 1);
                        }
                        for (let i = 0; i <= 23; i++) {
                            let targetAbility = target.GetAbilityByIndex(i);
                            if (targetAbility && targetAbility.GetLevel() > 0 && !targetAbility.IsPassive() && !targetAbility.IsAttributeBonus() && !targetAbility.IsCooldownReady()) {
                                let newCooldown = targetAbility.GetCooldownTimeRemaining() + cdIncrease + talent_cd_increase;
                                targetAbility.EndCooldown();
                                targetAbility.StartCooldown(newCooldown);
                            }
                        }
                    } else {
                        let enemies = FindUnitsInRadius(attacker.GetTeamNumber(), target.GetAbsOrigin(), undefined, 5000, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
                        for (const [_, enemy] of GameFunc.iPair(enemies)) {
                            if (enemy.findBuff<modifier_imba_faceless_void_chronosphere_handler>("modifier_imba_faceless_void_chronosphere_handler")) {
                                if (enemy.findBuff<modifier_imba_faceless_void_time_dilation_slow>("modifier_imba_faceless_void_time_dilation_slow")) {
                                    talent_cd_increase = attacker.GetTalentValue("special_bonus_imba_faceless_void_4", "target_increase");
                                    let caster_cd_decrease = attacker.GetTalentValue("special_bonus_imba_faceless_void_4", "self_reduction");
                                    for (let i = 0; i <= 23; i++) {
                                        let casterAbility = attacker.GetAbilityByIndex(i);
                                        if (casterAbility && casterAbility.GetLevel() > 0 && !casterAbility.IsPassive() && !casterAbility.IsAttributeBonus() && !casterAbility.IsCooldownReady()) {
                                            let newCooldown = casterAbility.GetCooldownTimeRemaining() - caster_cd_decrease;
                                            casterAbility.EndCooldown();
                                            casterAbility.StartCooldown(newCooldown);
                                        }
                                    }
                                }
                                if (attacker.HasTalent("special_bonus_imba_faceless_void_5")) {
                                    attacker.findAbliityPlus<imba_faceless_void_chronosphere>("imba_faceless_void_chronosphere").OnSpellStart(true, enemy.GetAbsOrigin());
                                }
                                if (target.IsRealUnit()) {
                                    target.AddNewModifier(parent, ability, "modifier_imba_faceless_void_time_lock_stun", {
                                        duration: bashDuration * (1 - target.GetStatusResistance())
                                    });
                                } else {
                                    target.AddNewModifier(parent, ability, "modifier_imba_faceless_void_time_lock_stun", {
                                        duration: creep_bash_duration * (1 - target.GetStatusResistance())
                                    });
                                }
                                if (target != enemy) {
                                    ApplyDamage({
                                        attacker: parent,
                                        victim: enemy,
                                        ability: ability,
                                        damage: bashDamage,
                                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                                    });
                                }
                                EmitSoundOn("Hero_FacelessVoid.TimeLockImpact", enemy);
                                if (enemy.IsRealUnit()) {
                                    modifier_imba_faceless_void_chronocharges.findIn(parent).IncrementStackCount(1);
                                    // AddStacksLua(ability, parent, parent, "modifier_imba_faceless_void_chronocharges", 1, false);
                                }
                                for (let i = 0; i <= 23; i++) {
                                    let enemyAbility = enemy.GetAbilityByIndex(i);
                                    if (enemyAbility && enemyAbility.GetLevel() > 0 && !enemyAbility.IsPassive() && !enemyAbility.IsAttributeBonus() && !enemyAbility.IsCooldownReady()) {
                                        let newCooldown = enemyAbility.GetCooldownTimeRemaining() + cdIncrease + talent_cd_increase;
                                        enemyAbility.EndCooldown();
                                        enemyAbility.StartCooldown(newCooldown);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return bonus_damage_to_main_target;
        }
    }
}
@registerModifier()
export class modifier_imba_faceless_void_time_lock_stun extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    IsPurgeException(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.GetParentPlus().SetRenderColor(128, 128, 255);
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_faceless_void/faceless_void_backtrack02.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
            ParticleManager.ReleaseParticleIndex(particle);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.GetParentPlus().SetRenderColor(255, 255, 255);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true
        };
    }
}
@registerAbility()
export class imba_faceless_void_chronosphere extends BaseAbility_Plus {
    public mini_chrono: any;
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        let chronocharge_radius = this.GetSpecialValueFor("chronocharge_radius");
        let aoe = this.GetSpecialValueFor("base_radius") + caster.GetTalentValue("special_bonus_imba_faceless_void_10");
        if (caster.HasModifier("modifier_imba_faceless_void_chronocharges")) {
            aoe = aoe + chronocharge_radius * caster.findBuffStack("modifier_imba_faceless_void_chronocharges", caster);
        }
        return aoe;
    }
    OnSpellStart(mini_chrono = false, target_location: Vector = null): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let chrono_center = this.GetCursorPosition();
        if (target_location) {
            chrono_center = target_location;
        }
        let sound_cast = "Hero_FacelessVoid.Chronosphere";
        let base_radius = this.GetSpecialValueFor("base_radius") + caster.GetTalentValue("special_bonus_imba_faceless_void_10");
        let chronocharge_radius = this.GetSpecialValueFor("chronocharge_radius");
        let duration = this.GetSpecialValueFor("duration");
        let total_radius;
        if (!mini_chrono) {
            let chronocharges = 0;
            let chronochargeModifier = caster.findBuff<modifier_imba_faceless_void_chronocharges>("modifier_imba_faceless_void_chronocharges");
            if (chronochargeModifier) {
                chronocharges = chronochargeModifier.GetStackCount();
            }
            total_radius = base_radius + chronocharge_radius * chronocharges;
        } else {
            total_radius = caster.GetTalentValue("special_bonus_imba_faceless_void_5", "aoe");
            duration = caster.GetTalentValue("special_bonus_imba_faceless_void_5", "duration");
        }
        AddFOWViewer(caster.GetTeamNumber(), chrono_center, total_radius, duration, false);
        let enemies_count = 0;
        if (!mini_chrono) {
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), chrono_center, undefined, total_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
            enemies_count = GameFunc.GetCount(enemies);
            let enemy_team = DOTATeam_t.DOTA_TEAM_BADGUYS;
            if (caster.GetTeam() == DOTATeam_t.DOTA_TEAM_BADGUYS) {
                enemy_team = DOTATeam_t.DOTA_TEAM_GOODGUYS;
            }
            if (enemies_count >= math.max(PlayerResource.GetPlayerCountForTeam(enemy_team) * 0.5, 1)) {
                if (this.IsStolen()) {
                    caster.EmitSound("Imba.StolenZaWarudo");
                } else {
                    caster.EmitSound("Imba.FacelessZaWarudo");
                }
            } else {
                caster.EmitSound(sound_cast);
            }
        }
        this.mini_chrono = mini_chrono;
        let mod = CreateModifierThinker(caster, ability, "modifier_imba_faceless_void_chronosphere_aura", {
            duration: duration
        }, chrono_center, caster.GetTeamNumber(), false);
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_faceless_void_3") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_faceless_void_3")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_faceless_void_3"), "modifier_special_bonus_imba_faceless_void_3", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_faceless_void_10") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_faceless_void_10")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_faceless_void_10"), "modifier_special_bonus_imba_faceless_void_10", {});
        }
    }
}
@registerModifier()
export class modifier_imba_faceless_void_chronosphere_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_faceless_void_chronosphere;
    public parent: IBaseNpc_Plus;
    public mini_chrono: any;
    public base_radius: number;
    public bonus_radius: number;
    public total_radius: number;
    public modifiers: { [k: string]: IBaseModifier_Plus };
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAuraDuration(): number {
        return 0.1;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER;
    }
    GetModifierAura(): string {
        return "modifier_imba_faceless_void_chronosphere_handler";
    }
    GetAuraRadius(): number {
        return this.total_radius;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (target != this.GetCasterPlus() && target.GetName().includes("faceless_void")) {
            return true;
        }
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus<imba_faceless_void_chronosphere>();
            this.parent = this.GetParentPlus();
            this.mini_chrono = this.ability.mini_chrono;
            if (!this.mini_chrono) {
                let chronocharges = 0;
                let chronochargeModifier = this.caster.findBuff<modifier_imba_faceless_void_chronocharges>("modifier_imba_faceless_void_chronocharges");
                if (chronochargeModifier) {
                    chronocharges = chronochargeModifier.GetStackCount();
                    chronochargeModifier.SetStackCount(0);
                }
                this.SetStackCount(chronocharges);
            }
            this.base_radius = this.ability.GetSpecialValueFor("base_radius") + this.caster.GetTalentValue("special_bonus_imba_faceless_void_10");
            this.bonus_radius = this.ability.GetSpecialValueFor("chronocharge_radius");
            this.total_radius = this.base_radius + this.bonus_radius * this.GetStackCount();
            if (this.mini_chrono) {
                this.total_radius = this.caster.GetTalentValue("special_bonus_imba_faceless_void_5", "aoe");
            }
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_faceless_void/faceless_void_chronosphere.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.parent, this.caster);
            ParticleManager.SetParticleControl(particle, 0, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle, 1, Vector(this.total_radius, this.total_radius, this.total_radius));
            this.AddParticle(particle, false, false, -1, false, false);
            this.AddTimer(FrameTime(), () => {
                if (this.GetStackCount() > 0) {
                    this.StartIntervalThink(0.1);
                    this.modifiers = {}
                }
            });
        }
    }
    OnRemoved(): void {
        if (IsServer()) {
            if (this.modifiers) {
                for (const [_, mod] of GameFunc.Pair(this.modifiers)) {
                    if (!mod.IsNull()) {
                        mod.Destroy();
                    }
                }
            }
        }
    }
    OnIntervalThink(): void {
        let radius = this.GetAuraRadius();
        let caster = this.GetCasterPlus();
        let units = FindUnitsInRadius(caster.GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, unit] of GameFunc.iPair(units)) {
            if (unit == caster || unit.GetPlayerOwner() == caster.GetPlayerOwner()) {
                if (!this.modifiers[unit.GetEntityIndex()]) {
                    let mod = unit.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_faceless_void_chronosphere_caster_buff", {});
                    mod.SetStackCount(this.GetStackCount());
                    this.modifiers[unit.GetEntityIndex()] = mod as IBaseModifier_Plus;
                }
            }
        }
        let parent = this.GetParentPlus();
        for (const id in (this.modifiers)) {
            let unit = EntIndexToHScript(GToNumber(id) as EntityIndex);
            const mod = this.modifiers[id];
            if (CalcDistanceBetweenEntityOBB(parent, unit) > this.GetAuraRadius()) {
                if (!mod.IsNull()) {
                    mod.Destroy();
                }
                this.modifiers[id] = undefined;
            }
        }
    }
}
@registerModifier()
export class modifier_imba_faceless_void_chronosphere_handler extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public caster: IBaseNpc_Plus;
    public mini_chrono: any;
    public projectile_speed: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IsDebuff(): boolean {
        if (this.GetStackCount() == 1 || this.GetStackCount() == 4) {
            return false;
        }
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.parent = this.GetParentPlus();
            this.caster = this.GetCasterPlus();
            this.mini_chrono = this.GetAbilityPlus<imba_faceless_void_chronosphere>().mini_chrono;
            this.projectile_speed = this.GetParentPlus().GetProjectileSpeed();
            if (this.parent == this.caster || this.parent.GetPlayerOwner() == this.caster.GetPlayerOwner()) {
                if (!this.mini_chrono) {
                    this.SetStackCount(1);
                } else {
                    this.SetStackCount(4);
                }
            } else if (this.parent.HasAbility("imba_faceless_void_timelord")) {
                this.SetStackCount(3);
            } else if (this.caster.HasScepter() && this.caster.GetTeamNumber() == this.parent.GetTeamNumber()) {
                this.SetStackCount(2);
            }
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.projectile_speed = 0;
            this.projectile_speed = this.GetParentPlus().GetProjectileSpeed();
            if (this.GetStackCount() == 0) {
                this.parent.AddNewModifier(this.caster, this.GetAbilityPlus(), "modifier_stunned", {
                    duration: FrameTime()
                });
                this.parent.InterruptMotionControllers(true);
                let modifiers = BaseModifierMotion.FindAllMotionBuff(this.parent);
                for (const [_, modifier] of GameFunc.iPair(modifiers)) {
                    if (modifier.CheckMotionControllers()) {
                        modifier.Destroy();
                    }
                }
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let stacks = this.GetStackCount();
        let state = {}
        if (stacks == 0) {
            if (this.GetParentPlus().HasModifier("modifier_slark_shadow_dance")) {
                state = {
                    [modifierstate.MODIFIER_STATE_STUNNED]: true,
                    [modifierstate.MODIFIER_STATE_FROZEN]: true
                }
            }
            state = {
                [modifierstate.MODIFIER_STATE_FROZEN]: true,
                [modifierstate.MODIFIER_STATE_ROOTED]: true,
                [modifierstate.MODIFIER_STATE_STUNNED]: true,
                [modifierstate.MODIFIER_STATE_SILENCED]: true,
                [modifierstate.MODIFIER_STATE_INVISIBLE]: false
            }
        } else if (stacks == 1 || stacks == 4) {
            state = {
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
            }
        }
        return state;
    }
    GetPriority(): modifierpriority {
        if (this.GetStackCount() == 0) {
            return modifierpriority.MODIFIER_PRIORITY_HIGH;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: MODIFIER_PROPERTY_MOVESPEED_MAX,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            6: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            7: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    GetModifierMoveSpeed_Max() {
        if (this.GetStackCount() == 1 || this.GetStackCount() == 4) {
            return this.GetSpecialValueFor("movement_speed");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE)
    CC_GetModifierMoveSpeed_Absolute(): number {
        if (this.GetStackCount() == 1 || this.GetStackCount() == 4) {
            if (this.GetStackCount() != 4) {
                if (this.GetCasterPlus().HasTalent("special_bonus_imba_faceless_void_3")) {
                    return this.GetCasterPlus().GetTalentValue("special_bonus_imba_faceless_void_3", "move_speed");
                }
            }
            return this.GetSpecialValueFor("movement_speed");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetStackCount() == 2) {
            return this.GetSpecialValueFor("scepter_ally_as_slow") * -1;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetStackCount() == 2) {
            return this.GetSpecialValueFor("scepter_ally_ms_slow_pcnt") * -1;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS)
    CC_GetModifierProjectileSpeedBonus(): number {
        if (this.GetStackCount() == 2 && this.projectile_speed) {
            return this.projectile_speed * this.GetSpecialValueFor("scepter_ally_projectile_slow") * 0.01 * (-1);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE)
    CC_GetModifierPercentageCasttime(p_0: ModifierAbilityEvent,): number {
        if (this.GetStackCount() == 2) {
            return this.GetSpecialValueFor("scepter_ally_casttime_pcnt_debuff") * (-1);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        let caster = this.GetCasterPlus();
        if (caster.HasTalent("special_bonus_imba_faceless_void_8")) {
            let ability = this.GetAbilityPlus();
            if ((params.attacker == caster) && caster.IsRealUnit() && (params.target.GetTeamNumber() != caster.GetTeamNumber()) && this.GetStackCount() == 1) {
                let cleave_particle = "particles/econ/items/faceless_void/faceless_void_weapon_bfury/faceless_void_weapon_bfury_cleave.vpcf";
                let cleave_damage_pct = caster.GetTalentValue("special_bonus_imba_faceless_void_8", "cleave_damage_pct") / 100;
                let cleave_radius_start = caster.GetTalentValue("special_bonus_imba_faceless_void_8", "cleave_starting_width");
                let cleave_radius_end = caster.GetTalentValue("special_bonus_imba_faceless_void_8", "cleave_ending_width");
                let cleave_distance = caster.GetTalentValue("special_bonus_imba_faceless_void_8", "cleave_distance");
                DoCleaveAttack(params.attacker, params.target, ability, (params.damage * cleave_damage_pct), cleave_radius_start, cleave_radius_end, cleave_distance, cleave_particle);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_faceless_void_chronosphere_caster_buff extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_faceless_void/faceless_void_chrono_speed.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetSpecialValueFor("chronocharge_attackspeed") * this.GetStackCount();
    }
}
@registerAbility()
export class imba_faceless_void_time_lock_720 extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        if (!this.GetCasterPlus().IsIllusion()) {
            return "modifier_imba_faceless_void_time_lock_720";
        }
    }
}
@registerModifier()
export class modifier_imba_faceless_void_time_lock_720 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
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
        if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().PassivesDisabled() && !keys.target.IsOther() && !keys.target.IsBuilding()) {
            let ability = this.GetAbilityPlus();
            let chance_pct = ability.GetSpecialValueFor("chance_pct");
            if (GFuncRandom.PRD(chance_pct, this)) {
                this.ApplyTimeLock(keys.target);
            }
        }
    }
    ApplyTimeLock(target: IBaseNpc_Plus) {
        if (!IsServer() || !this.GetAbilityPlus()) {
            return;
        }
        let ability = this.GetAbilityPlus();
        let duration = ability.GetSpecialValueFor("duration");
        let duration_creep = ability.GetSpecialValueFor("duration_creep");
        let bonus_damage = ability.GetTalentSpecialValueFor("bonus_damage");
        let moment_cd_increase = ability.GetSpecialValueFor("moment_cd_increase");
        target.EmitSound("Hero_FacelessVoid.TimeLockImpact");
        if (target.IsConsideredHero() || target.IsRoshan()) {
            target.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_faceless_void_time_lock_720_freeze", {
                duration: duration * (1 - target.GetStatusResistance())
            });
        } else {
            target.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_faceless_void_time_lock_720_freeze", {
                duration: duration_creep * (1 - target.GetStatusResistance())
            });
        }
        if (target.IsRealUnit() && this.GetParentPlus().findBuff<modifier_imba_faceless_void_chronocharges>("modifier_imba_faceless_void_chronocharges")) {
            this.GetParentPlus().findBuff<modifier_imba_faceless_void_chronocharges>("modifier_imba_faceless_void_chronocharges").SetStackCount(this.GetParentPlus().FindModifierByName("modifier_imba_faceless_void_chronocharges").GetStackCount() + 1);
        }
        for (let i = 0; i <= 23; i++) {
            let targetAbility = target.GetAbilityByIndex(i);
            if (targetAbility && targetAbility.GetLevel() > 0 && !targetAbility.IsAttributeBonus() && !targetAbility.IsCooldownReady()) {
                let newCooldown = targetAbility.GetCooldownTimeRemaining() + moment_cd_increase;
                targetAbility.EndCooldown();
                targetAbility.StartCooldown(newCooldown);
            }
        }
        if (this.GetParentPlus().HasTalent("special_bonus_imba_faceless_void_5") && this.GetParentPlus().findAbliityPlus<imba_faceless_void_chronosphere>("imba_faceless_void_chronosphere") && this.GetParentPlus().FindAbilityByName("imba_faceless_void_chronosphere").IsTrained()) {
            this.GetParentPlus().findAbliityPlus<imba_faceless_void_chronosphere>("imba_faceless_void_chronosphere").OnSpellStart(true, target.GetAbsOrigin());
        }
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_faceless_void/faceless_void_time_lock_bash.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(particle, 0, target.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle, 1, target.GetAbsOrigin());
        ParticleManager.SetParticleControlEnt(particle, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_CUSTOMORIGIN, "attach_hitloc", target.GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(particle);
        this.AddTimer(0.33, () => {
            if (!ability.IsNull() && target.IsAlive()) {
                this.GetParentPlus().PerformAttack(target, false, true, true, false, false, false, false);
                let damageTable = {
                    victim: target,
                    damage: bonus_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetParentPlus(),
                    ability: ability
                }
                ApplyDamage(damageTable);
            }
        });
    }
}
@registerModifier()
export class modifier_imba_faceless_void_time_lock_720_freeze extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().SetRenderColor(128, 128, 255);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().SetRenderColor(255, 255, 255);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true
        };
    }
}
@registerModifier()
export class modifier_special_bonus_imba_faceless_void_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_faceless_void_12 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_faceless_void_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_faceless_void_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_faceless_void_10 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_faceless_void_11 extends BaseModifier_Plus {
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
export class imba_faceless_void_time_walk_reverse extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let position = this.GetCasterPlus().findAbliityPlus<imba_faceless_void_time_walk>("imba_faceless_void_time_walk").old_position;
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_faceless_void_time_walk_cast", {
            duration: (position - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() / this.GetSpecialValueFor("speed"),
            x: position.x,
            y: position.y,
            z: position.z
        });
    }
}
