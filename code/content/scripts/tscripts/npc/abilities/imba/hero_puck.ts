
import { GameFunc } from "../../../GameFunc";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_puck_illusory_orb extends BaseAbility_Plus {
    public jaunt_ability: any;
    public orbs: EntityIndex[];
    public talent_cast_range_increases: number;
    GetAssociatedSecondaryAbilities(): string {
        return "imba_puck_ethereal_jaunt";
    }
    OnUpgrade(): void {
        let jaunt_ability = this.GetCasterPlus().findAbliityPlus<imba_puck_ethereal_jaunt>("imba_puck_ethereal_jaunt");
        if (jaunt_ability && !this.jaunt_ability) {
            this.jaunt_ability = jaunt_ability;
            if (!jaunt_ability.IsTrained()) {
                this.jaunt_ability.SetLevel(1);
            }
        }
    }
    OnSpellStart(): void {
        let jaunt_ability = this.GetCasterPlus().findAbliityPlus<imba_puck_ethereal_jaunt>("imba_puck_ethereal_jaunt");
        if (jaunt_ability && !this.jaunt_ability) {
            this.jaunt_ability = jaunt_ability;
            if (!jaunt_ability.IsTrained()) {
                this.jaunt_ability.SetLevel(1);
            }
        }
        if (!this.orbs) {
            this.orbs = []
        }
        this.talent_cast_range_increases = 0;
        for (let ability = 0; ability <= 23; ability++) {
            let found_ability = this.GetCasterPlus().GetAbilityByIndex(ability);
            if (found_ability && string.find(found_ability.GetName(), "cast_range") && this.GetCasterPlus().HasTalent(found_ability.GetName())) {
                this.talent_cast_range_increases = this.talent_cast_range_increases + this.GetCasterPlus().GetTalentValue(found_ability.GetName());
            }
        }
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        this.FireOrb(this.GetCasterPlus().GetAbsOrigin() - this.GetCursorPosition() as Vector);
        this.FireOrb(this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector);
        if (this.jaunt_ability) {
            this.jaunt_ability.SetActivated(true);
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_puck_illusory_orb", {
            duration: ((this.GetSpecialValueFor("max_distance") * math.max(this.GetCasterPlus().GetTalentValue("special_bonus_imba_puck_illusory_orb_speed"), 1)) + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus()) + this.talent_cast_range_increases) / (this.GetSpecialValueFor("orb_speed") * math.max(this.GetCasterPlus().GetTalentValue("special_bonus_imba_puck_illusory_orb_speed"), 1))
        });
    }
    OnProjectileThink_ExtraData(location: Vector, data: any): void {
        if (!IsServer()) {
            return;
        }
        if (data.orb_thinker) {
            EntIndexToHScript(data.orb_thinker).SetAbsOrigin(location);
        }
        this.CreateVisibilityNode(location, this.GetSpecialValueFor("orb_vision"), 5);
    }
    FireOrb(position: Vector) {
        let orb_thinker = CreateModifierThinker(this.GetCasterPlus(), this, undefined, {}, this.GetCasterPlus().GetOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
        orb_thinker.EmitSound("Hero_Puck.Illusory_Orb");
        let projectile_info = {
            Source: this.GetCasterPlus(),
            Ability: this,
            vSpawnOrigin: this.GetCasterPlus().GetOrigin(),
            bDeleteOnHit: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            EffectName: "particles/units/heroes/hero_puck/puck_illusory_orb.vpcf",
            fDistance: (this.GetSpecialValueFor("max_distance") * math.max(this.GetCasterPlus().GetTalentValue("special_bonus_imba_puck_illusory_orb_speed"), 1)) + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus()) + this.talent_cast_range_increases,
            fStartRadius: this.GetSpecialValueFor("radius"),
            fEndRadius: this.GetSpecialValueFor("radius"),
            vVelocity: position.Normalized() * this.GetSpecialValueFor("orb_speed") * math.max(this.GetCasterPlus().GetTalentValue("special_bonus_imba_puck_illusory_orb_speed"), 1) as Vector,
            bReplaceExisting: false,
            bProvidesVision: true,
            iVisionRadius: this.GetSpecialValueFor("orb_vision"),
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            ExtraData: {
                orb_thinker: orb_thinker.entindex()
            }
        }
        let projectile = ProjectileManager.CreateLinearProjectile(projectile_info);
        this.orbs.push(orb_thinker.entindex());
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (!IsServer()) {
            return;
        }
        if (target) {
            target.EmitSound("Hero_Puck.IIllusory_Orb_Damage");
            let damageTable = {
                victim: target,
                damage: this.GetAbilityDamage(),
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            }
            ApplyDamage(damageTable);
        } else {
            if (data.orb_thinker) {
                this.orbs.shift();
                EntIndexToHScript(data.orb_thinker).StopSound("Hero_Puck.Illusory_Orb");
                EntIndexToHScript(data.orb_thinker).RemoveSelf();
            }
            if (this.jaunt_ability && GameFunc.GetCount(this.orbs) == 0) {
                this.jaunt_ability.SetActivated(false);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_puck_illusory_orb extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(0);
    }
}
@registerAbility()
export class imba_puck_waning_rift extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetTalentSpecialValueFor("radius");
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        return UnitFilterResult.UF_SUCCESS;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return super.GetBehaviorInt() + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_puck_waning_rift_range");
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_puck_waning_rift_cooldown");
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Puck.Waning_Rift");
        if (this.GetCasterPlus().GetName().includes("puck")) {
            this.GetCasterPlus().EmitSound("puck_puck_ability_rift_0" + RandomInt(1, 3));
        }
        let rift_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_puck/puck_waning_rift.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(rift_particle, 1, Vector(this.GetTalentSpecialValueFor("radius"), 0, 0));
        ParticleManager.ReleaseParticleIndex(rift_particle);
        if (!this.GetCasterPlus().IsRooted()) {
            FindClearSpaceForUnit(this.GetCasterPlus(), this.GetCursorPosition(), true);
        }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetTalentSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let damageTable = {
                victim: enemy,
                damage: this.GetTalentSpecialValueFor("damage"),
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            }
            ApplyDamage(damageTable);
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_puck_waning_rift", {
                duration: this.GetSpecialValueFor("silence_duration") * (1 - enemy.GetStatusResistance())
            });
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_puck_waning_rift_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_puck_waning_rift_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_puck_waning_rift_cooldown"), "modifier_special_bonus_imba_puck_waning_rift_cooldown", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_puck_waning_rift_range") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_puck_waning_rift_range")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_puck_waning_rift_range"), "modifier_special_bonus_imba_puck_waning_rift_range", {});
        }
    }
}
@registerModifier()
export class modifier_imba_puck_waning_rift extends BaseModifier_Plus {
    public glitter_vision_reduction: any;
    GetEffectName(): string {
        if (!this.GetParentPlus().IsCreep()) {
            return "particles/generic_gameplay/generic_silenced.vpcf";
        } else {
            return "particles/generic_gameplay/generic_silenced_lanecreeps.vpcf";
        }
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        this.glitter_vision_reduction = this.GetSpecialValueFor("glitter_vision_reduction");
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.GetSpecialValueFor("trickster_null_instances"));
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE)
    CC_GetBonusVisionPercentage(): number {
        return this.glitter_vision_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierTotalDamageOutgoing_Percentage(keys: ModifierAttackEvent): number {
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() > 0) {
            this.DecrementStackCount();
            return -100;
        }
    }
}
@registerAbility()
export class imba_puck_phase_shift extends BaseAbility_Plus {
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_puck_phase_shift_handler", this.GetCasterPlus()) == 0) {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_NONE, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, this.GetCasterPlus().GetTeamNumber());
        }
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_puck_phase_shift_handler", this.GetCasterPlus()) == 0) {
            return tonumber(tostring(super.GetBehavior())) + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_puck_phase_shift_handler", this.GetCasterPlus()) == 0) {
            return super.GetCastRange(location, target);
        } else {
            return this.GetSpecialValueFor("sinusoid_cast_range") - this.GetCasterPlus().GetCastRangeBonus();
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_puck_phase_shift_handler";
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Puck.Phase_Shift");
        if (this.GetCasterPlus().GetName().includes("puck")) {
            this.GetCasterPlus().EmitSound("puck_puck_ability_phase_0" + RandomInt(1, 7));
        }
        if (this.GetAutoCastState()) {
            if (this.GetCursorPosition() && !this.GetCursorTarget()) {
                FindClearSpaceForUnit(this.GetCasterPlus(), this.GetCursorPosition(), true);
            } else if (this.GetCursorTarget()) {
                if (this.GetCursorTarget() != this.GetCasterPlus()) {
                    this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_puck_phase_shift", {
                        duration: this.GetSpecialValueFor("duration") + FrameTime()
                    });
                }
                this.GetCasterPlus().SetCursorCastTarget(undefined);
                this.GetCasterPlus().SetCursorPosition(this.GetCasterPlus().GetAbsOrigin());
                this.OnSpellStart();
            }
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_puck_phase_shift", {
            duration: this.GetSpecialValueFor("duration") + FrameTime()
        });
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_puck_phase_shift_attacks")) {
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetAbsOrigin(), undefined, this.GetCasterPlus().Script_GetAttackRange() + 200, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false))) {
                if (enemy.GetName() != "npc_dota_unit_undying_zombie") {
                    this.GetCasterPlus().PerformAttack(enemy, true, true, true, false, true, false, false);
                }
            }
        }
    }
    OnChannelFinish(interrupted: boolean): void {
        this.GetCasterPlus().StopSound("Hero_Puck.Phase_Shift");
        let phase_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_puck_phase_shift", this.GetCasterPlus());
        if (phase_modifier) {
            phase_modifier.StartIntervalThink(FrameTime());
        }
    }
}
@registerModifier()
export class modifier_imba_puck_phase_shift extends BaseModifier_Plus {
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_phase_shift.vpcf";
    }
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        ProjectileHelper.ProjectileDodgePlus(this.GetParentPlus());
        let phase_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_puck/puck_phase_shift.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(phase_particle, 0, this.GetParentPlus().GetAbsOrigin());
        this.AddParticle(phase_particle, false, false, -1, false, false);
        this.GetParentPlus().AddNoDraw();
        if (this.GetParentPlus() != this.GetCasterPlus()) {
            this.StartIntervalThink(FrameTime());
        }
    }

    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetAbilityPlus() || !this.GetAbilityPlus().IsChanneling()) {
            this.Destroy();
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveNoDraw();
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        }
        if (this.GetParentPlus() != this.GetCasterPlus()) {
            state[modifierstate.MODIFIER_STATE_STUNNED] = true;
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_puck_phase_shift_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ORDER
        }
        return Object.values(decFuncs);
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
@registerAbility()
export class imba_puck_ethereal_jaunt extends BaseAbility_Plus {
    public orb_ability: any;
    GetAssociatedPrimaryAbilities(): string {
        return "imba_puck_illusory_orb";
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    GetManaCost(level: number): number {
        if (!this.GetCasterPlus().findBuffStack("modifier_imba_puck_illusory_orb", this.GetCasterPlus()) || this.GetCasterPlus().findBuffStack("modifier_imba_puck_illusory_orb", this.GetCasterPlus()) <= 0) {
            return 0;
        } else {
            return this.GetCasterPlus().GetMaxMana() * this.GetSpecialValueFor("eternal_max_mana_pct") * 0.01;
        }
    }
    OnUpgrade(): void {
        this.SetActivated(false);
        let orb_ability = this.GetCasterPlus().FindAbilityByName(this.GetAssociatedPrimaryAbilities());
        if (orb_ability) {
            this.orb_ability = orb_ability;
        }
    }
    OnSpellStart(): void {
        if (this.orb_ability && this.orb_ability.orbs && GameFunc.GetCount(this.orb_ability.orbs) >= 1) {
            this.GetCasterPlus().EmitSound("Hero_Puck.EtherealJaunt");
            let jaunt_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_puck/puck_illusory_orb_blink_out.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
            ParticleManager.ReleaseParticleIndex(jaunt_particle);
            FindClearSpaceForUnit(this.GetCasterPlus(), EntIndexToHScript(this.orb_ability.orbs[GameFunc.GetCount(this.orb_ability.orbs)]).GetAbsOrigin(), true);
            ProjectileHelper.ProjectileDodgePlus(this.GetCasterPlus());
            if (this.GetCasterPlus().GetName().includes("puck") && (!this.GetCasterPlus().findBuffStack("modifier_imba_puck_illusory_orb", this.GetCasterPlus()) || this.GetCasterPlus().findBuffStack("modifier_imba_puck_illusory_orb", this.GetCasterPlus()) <= 0)) {
                this.GetCasterPlus().EmitSound("puck_puck_ability_orb_0" + RandomInt(1, 3));
            }
            if (this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_puck_illusory_orb", this.GetCasterPlus())) {
                this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_puck_illusory_orb", this.GetCasterPlus()).IncrementStackCount();
            }
        }
    }
}
@registerAbility()
export class imba_puck_dream_coil extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("coil_radius");
    }
    OnSpellStart(refreshDuration = 0): void {
        EmitSoundOnLocationWithCaster(this.GetCursorPosition(), "Hero_Puck.Dream_Coil", this.GetCasterPlus());
        if (!refreshDuration) {
            if (this.GetCasterPlus().GetName().includes("puck")) {
                this.GetCasterPlus().EmitSound("puck_puck_ability_dreamcoil_0" + RandomInt(1, 2));
            }
        }
        let target_flag = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
        let latch_duration = this.GetSpecialValueFor("coil_duration");
        if (this.GetCasterPlus().HasScepter()) {
            target_flag = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
            latch_duration = this.GetSpecialValueFor("coil_duration_scepter");
        }
        if (refreshDuration) {
            latch_duration = refreshDuration;
        }
        let coil_thinker = CreateModifierThinker(this.GetCasterPlus(), this, "modifier_imba_puck_dream_coil_thinker", {
            duration: latch_duration
        }, this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), false);
        let target_type = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_puck_dream_coil_targets")) {
            target_type = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
        }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("coil_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, target_type, target_flag, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            ApplyDamage({
                victim: enemy,
                damage: this.GetSpecialValueFor("coil_initial_damage"),
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            });
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_stunned", {
                duration: this.GetSpecialValueFor("stun_duration") * (1 - enemy.GetStatusResistance())
            });
            let coil_modifier = enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_puck_dream_coil", {
                duration: latch_duration,
                coil_thinker: coil_thinker.entindex()
            });
            if (!refreshDuration) {
                coil_modifier.SetDuration(latch_duration * (1 - enemy.GetStatusResistance()), true);
            }
            for (let index = 0; index <= 23; index++) {
                let ability = enemy.GetAbilityByIndex(index);
                if (ability && ability.GetAbilityType() == ABILITY_TYPES.ABILITY_TYPE_ULTIMATE) {
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), ability, "modifier_imba_puck_dream_coil_visionary", {
                        duration: latch_duration
                    });
                }
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (!IsServer()) {
            return;
        }
        if (target) {
            EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), "Hero_Puck.ProjectileImpact", this.GetCasterPlus());
            this.GetCasterPlus().PerformAttack(target, false, true, true, false, false, false, false);
        }
    }
}
@registerModifier()
export class modifier_imba_puck_dream_coil extends BaseModifier_Plus {
    public coil_break_radius: number;
    public coil_stun_duration: number;
    public coil_break_damage: number;
    public coil_break_damage_scepter: number;
    public coil_stun_duration_scepter: number;
    public rapid_fire_interval: number;
    public rapid_fire_max_distance: number;
    public ability_damage_type: number;
    public coil_thinker: any;
    public coil_thinker_location: any;
    public interval: number;
    public counter: number;
    IsPurgable(): boolean {
        return !this.GetCasterPlus().HasScepter();
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        this.coil_break_radius = this.GetSpecialValueFor("coil_break_radius");
        this.coil_stun_duration = this.GetSpecialValueFor("coil_stun_duration");
        this.coil_break_damage = this.GetSpecialValueFor("coil_break_damage");
        this.coil_break_damage_scepter = this.GetSpecialValueFor("coil_break_damage_scepter");
        this.coil_stun_duration_scepter = this.GetSpecialValueFor("coil_stun_duration_scepter");
        this.rapid_fire_interval = this.GetSpecialValueFor("rapid_fire_interval");
        this.rapid_fire_max_distance = this.GetSpecialValueFor("rapid_fire_max_distance");
        if (!IsServer()) {
            return;
        }
        this.ability_damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.coil_thinker = EntIndexToHScript(params.coil_thinker);
        this.coil_thinker_location = this.coil_thinker.GetAbsOrigin();
        let coil_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_puck/puck_dreamcoil_tether.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.coil_thinker, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(coil_particle, 0, this.coil_thinker, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.coil_thinker_location, true);
        ParticleManager.SetParticleControlEnt(coil_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(coil_particle, false, false, -1, false, false);
        this.interval = 0.1;
        this.counter = 0;
        this.StartIntervalThink(this.interval);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.counter = this.counter + this.interval;
        if (this.GetCasterPlus().IsAlive() && this.counter >= this.rapid_fire_interval && this.GetAbilityPlus()) {
            this.counter = 0;
            let direction = (this.GetParentPlus().GetAbsOrigin() - this.coil_thinker_location as Vector).Normalized();
            if ((this.GetCasterPlus().GetAbsOrigin() - this.coil_thinker_location as Vector).Length2D() <= this.rapid_fire_max_distance) {
                EmitSoundOnLocationWithCaster(this.coil_thinker_location, "Hero_Puck.Attack", this.GetCasterPlus());
                let projectile = {
                    Target: this.GetParentPlus(),
                    Source: this.coil_thinker,
                    Ability: this.GetAbilityPlus(),
                    EffectName: this.GetCasterPlus().GetRangedProjectileName() || "particles/units/heroes/hero_puck/puck_base_attack.vpcf",
                    iMoveSpeed: this.GetCasterPlus().GetProjectileSpeed() || 900,
                    bDrawsOnMinimap: false,
                    bDodgeable: true,
                    bIsAttack: true,
                    bVisibleToEnemies: true,
                    bReplaceExisting: false,
                    flExpireTime: GameRules.GetGameTime() + 10.0,
                    bProvidesVision: false
                }
                ProjectileManager.CreateTrackingProjectile(projectile);
            }
        }
        if ((this.GetParentPlus().GetAbsOrigin() - this.coil_thinker_location as Vector).Length2D() >= this.coil_break_radius) {
            this.GetParentPlus().EmitSound("Hero_Puck.Dream_Coil_Snap");
            let stun_duration = this.coil_stun_duration;
            let break_damage = this.coil_break_damage;
            if (this.GetCasterPlus().HasScepter()) {
                stun_duration = this.coil_stun_duration_scepter;
                break_damage = this.coil_break_damage_scepter;
            }
            let damageTable = {
                victim: this.GetParentPlus(),
                damage: break_damage,
                damage_type: this.ability_damage_type,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus()
            }
            ApplyDamage(damageTable);
            if (this.GetAbilityPlus()) {
                this.GetCasterPlus().SetCursorPosition(this.GetParentPlus().GetAbsOrigin());
                this.GetAbilityPlus<imba_puck_dream_coil>().OnSpellStart(this.GetRemainingTime() + (stun_duration * (1 - this.GetParentPlus().GetStatusResistance())));
            }
            let stun_modifier = this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_stunned", {
                duration: stun_duration * (1 - this.GetParentPlus().GetStatusResistance())
            });
            this.Destroy();
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_TETHERED]: true
        };
    }
}
@registerModifier()
export class modifier_imba_puck_dream_coil_thinker extends BaseModifier_Plus {
    public pfx: any;
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_puck/puck_dreamcoil.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined, this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.pfx, 0, this.GetParentPlus().GetAbsOrigin());
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
        this.GetParentPlus().RemoveSelf();
    }
}
@registerModifier()
export class modifier_imba_puck_dream_coil_visionary extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(math.ceil(this.GetAbilityPlus().GetCooldownTimeRemaining()));
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (this.GetAbilityPlus()) {
            this.SetStackCount(math.ceil(this.GetAbilityPlus().GetCooldownTimeRemaining()));
        } else {
            this.StartIntervalThink(-1);
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_puck_phase_shift_attacks extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_puck_illusory_orb_speed extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_puck_dream_coil_targets extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_puck_waning_rift_cooldown extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_puck_waning_rift_range extends BaseModifier_Plus {
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
