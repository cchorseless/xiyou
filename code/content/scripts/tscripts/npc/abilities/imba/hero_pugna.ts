
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_pugna_nether_blast extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "pugna_nether_blast";
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("cast_range");
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("main_blast_radius");
    }
    IsNetherWardStealable() {
        return true;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.GetCursorPosition();
        let sound_precast = "Hero_Pugna.NetherBlastPreCast";
        let sound_cast = "Hero_Pugna.NetherBlast";
        let particle_pre_blast = "particles/units/heroes/hero_pugna/pugna_netherblast_pre.vpcf";
        let particle_blast = "particles/units/heroes/hero_pugna/pugna_netherblast.vpcf";
        let modifier_magic_res = "modifier_imba_nether_blast_magic_res";
        let mini_blast_count = ability.GetSpecialValueFor("mini_blast_count");
        let magic_res_duration = ability.GetSpecialValueFor("magic_res_duration");
        let blast_delay = ability.GetSpecialValueFor("blast_delay");
        let damage = ability.GetSpecialValueFor("damage");
        let damage_buildings_pct = ability.GetSpecialValueFor("damage_buildings_pct");
        let mini_blast_distance = ability.GetSpecialValueFor("mini_blast_distance");
        let mini_blast_radius = ability.GetSpecialValueFor("mini_blast_radius");
        let main_blast_radius = ability.GetSpecialValueFor("main_blast_radius");
        EmitSoundOn(sound_cast, caster);
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, mini_blast_distance + mini_blast_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (enemy.HasModifier(modifier_magic_res)) {
                let modifier_magic_res_handler = enemy.FindModifierByName(modifier_magic_res);
                if (modifier_magic_res_handler) {
                    modifier_magic_res_handler.SetStackCount(0);
                    modifier_magic_res_handler.ForceRefresh();
                }
            }
        }
        for (let i = 0; i < mini_blast_count; i++) {
            let angle_gaps = 360 / mini_blast_count;
            let qangle = QAngle(0, (i - 1) * angle_gaps, 0);
            let direction = (target_point - caster.GetAbsOrigin() as Vector).Normalized();
            let spawn_point = target_point + direction * mini_blast_distance as Vector;
            let mini_blast_center = RotatePosition(target_point, qangle, spawn_point);
            let particle_blast_fx = ResHelper.CreateParticleEx(particle_blast, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(particle_blast_fx, 0, mini_blast_center);
            ParticleManager.SetParticleControl(particle_blast_fx, 1, Vector(mini_blast_radius, 0, 0));
            ParticleManager.ReleaseParticleIndex(particle_blast_fx);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), mini_blast_center, undefined, mini_blast_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (caster.HasTalent("special_bonus_imba_pugna_5")) {
                    let damageTable = {
                        victim: enemy,
                        damage: damage * caster.GetTalentValue("special_bonus_imba_pugna_5") * 0.01,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        attacker: caster,
                        ability: ability
                    }
                    ApplyDamage(damageTable);
                }
                if (!enemy.HasModifier(modifier_magic_res)) {
                    enemy.AddNewModifier(caster, ability, modifier_magic_res, {
                        duration: magic_res_duration * (1 - enemy.GetStatusResistance())
                    });
                }
                let modifier_magic_res_handler = enemy.FindModifierByName(modifier_magic_res);
                if (modifier_magic_res_handler) {
                    modifier_magic_res_handler.IncrementStackCount();
                }
            }
        }
        let particle_pre_blast_fx = ResHelper.CreateParticleEx(particle_pre_blast, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(particle_pre_blast_fx, 0, target_point);
        ParticleManager.SetParticleControl(particle_pre_blast_fx, 1, Vector(main_blast_radius, blast_delay, 1));
        ParticleManager.ReleaseParticleIndex(particle_pre_blast_fx);
        EmitSoundOnLocationForAllies(caster.GetAbsOrigin(), sound_precast, caster);
        this.AddTimer(blast_delay, () => {
            let particle_blast_fx = ResHelper.CreateParticleEx(particle_blast, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(particle_blast_fx, 0, target_point);
            ParticleManager.SetParticleControl(particle_blast_fx, 1, Vector(main_blast_radius, 0, 0));
            ParticleManager.ReleaseParticleIndex(particle_blast_fx);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, main_blast_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let blast_damage = damage;
                if (enemy.IsBuilding()) {
                    blast_damage = blast_damage * damage_buildings_pct * 0.01;
                }
                let damageTable = {
                    victim: enemy,
                    damage: blast_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    attacker: caster,
                    ability: ability
                }
                ApplyDamage(damageTable);
            }
        });
    }

    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this)
    }

}
@registerModifier()
export class modifier_imba_nether_blast_magic_res extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public magic_res_reduction_pct: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.magic_res_reduction_pct = this.ability.GetSpecialValueFor("magic_res_reduction_pct");
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
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        let stacks = this.GetStackCount();
        if (this.GetParentPlus().IsBuilding()) {
            return this.magic_res_reduction_pct * stacks * (-1) * this.GetSpecialValueFor("magic_res_building_pct") * 0.01;
        } else {
            return this.magic_res_reduction_pct * stacks * (-1);
        }
    }
}
@registerAbility()
export class imba_pugna_decrepify extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "pugna_decrepify";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            if (target.GetUnitName().includes("npc_imba_unit_tombstone") || target.GetUnitName().includes("npc_imba_pugna_nether_ward")) {
                return UnitFilterResult.UF_SUCCESS;
            }
            let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
            return nResult;
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let sound_cast = "Hero_Pugna.Decrepify";
        let modifier_decrep = "modifier_imba_decrepify";
        let duration = ability.GetSpecialValueFor("duration") + caster.GetTalentValue("special_bonus_imba_pugna_3");
        EmitSoundOn(sound_cast, caster);
        if (caster.GetTeamNumber() != target.GetTeamNumber()) {
            if (target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
            duration = duration * (1 - target.GetStatusResistance());
        }
        target.AddNewModifier(caster, ability, modifier_decrep, {
            duration: duration
        });
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_decrepify extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public sound_precast: any;
    public sound_cast: any;
    public particle_pre_blast: any;
    public particle_blast: any;
    public ally_res_reduction_pct: number;
    public enemy_res_reduction_pct: number;
    public enemy_slow_pct: number;
    public blast_delay: number;
    public base_radius: number;
    public total_dmg_conversion_pct: number;
    public max_radius: number;
    public is_ally: any;
    public damage_stored: number;
    public particle_pre_blast_fx: any;
    public particle_blast_fx: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_pugna/pugna_decrepify.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.sound_precast = "Hero_Pugna.NetherBlastPreCast";
        this.sound_cast = "Hero_Pugna.NetherBlast";
        this.particle_pre_blast = "particles/units/heroes/hero_pugna/pugna_netherblast_pre.vpcf";
        this.particle_blast = "particles/units/heroes/hero_pugna/pugna_netherblast.vpcf";
        this.ally_res_reduction_pct = this.ability.GetSpecialValueFor("ally_res_reduction_pct");
        this.enemy_res_reduction_pct = this.ability.GetSpecialValueFor("enemy_res_reduction_pct");
        this.enemy_slow_pct = this.ability.GetSpecialValueFor("enemy_slow_pct");
        this.blast_delay = this.ability.GetSpecialValueFor("blast_delay");
        this.base_radius = this.ability.GetSpecialValueFor("base_radius");
        this.total_dmg_conversion_pct = this.ability.GetSpecialValueFor("total_dmg_conversion_pct");
        this.max_radius = this.ability.GetSpecialValueFor("max_radius");
        if (this.parent.GetTeamNumber() == this.caster.GetTeamNumber()) {
            this.is_ally = true;
        } else {
            this.is_ally = false;
        }
        if (IsServer()) {
            this.damage_stored = 0;
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            this.BeDestroy();
            this.damage_stored = 0;
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        if (this.is_ally) {
            return false;
        } else {
            return true;
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            4: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (this.is_ally) {
            return this.ally_res_reduction_pct * (-1);
        } else {
            return this.enemy_res_reduction_pct * (-1);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.is_ally) {
            return undefined;
        } else {
            return this.enemy_slow_pct * (-1);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus()) {
            this.damage_stored = this.damage_stored + keys.damage;
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.damage_stored == 0) {
                return undefined;
            }
            let total_radius = math.min(this.base_radius + this.damage_stored, this.max_radius);
            let damage = this.damage_stored * this.total_dmg_conversion_pct * 0.01;
            let heal = damage;
            EmitSoundOn(this.sound_precast, this.parent);
            this.particle_pre_blast_fx = ResHelper.CreateParticleEx(this.particle_pre_blast, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
            ParticleManager.SetParticleControl(this.particle_pre_blast_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_pre_blast_fx, 1, Vector(total_radius, this.blast_delay, 1));
            ParticleManager.ReleaseParticleIndex(this.particle_pre_blast_fx);
            this.AddTimer(this.blast_delay, () => {
                EmitSoundOn(this.sound_cast, this.parent);
                this.particle_blast_fx = ResHelper.CreateParticleEx(this.particle_blast, ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster);
                ParticleManager.SetParticleControl(this.particle_blast_fx, 0, this.parent.GetAbsOrigin());
                ParticleManager.SetParticleControl(this.particle_blast_fx, 1, Vector(total_radius, 0, 0));
                ParticleManager.ReleaseParticleIndex(this.particle_blast_fx);
                let units = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, total_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, unit] of GameFunc.iPair(units)) {
                    if (unit.GetTeamNumber() == this.caster.GetTeamNumber()) {
                        unit.ApplyHeal(heal, this.ability);
                    } else {
                        ApplyDamage({
                            victim: unit,
                            damage: damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                            attacker: this.caster,
                            ability: this.ability
                        });
                    }
                }
            });
        }
    }
}
@registerAbility()
export class imba_pugna_nether_ward extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAbilityTextureName(): string {
        return "pugna_nether_ward";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (IsServer()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET;
        }
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (target != undefined && target == this.GetCasterPlus()) {
            return UnitFilterResult.UF_SUCCESS;
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target_point = this.GetCursorPosition();
        let ability = this;
        let ability_level = ability.GetLevel();
        let sound_cast = "Hero_Pugna.NetherWard";
        let ability_ward = "imba_pugna_nether_ward_aura";
        let player_id = caster.GetPlayerID();
        let duration = ability.GetSpecialValueFor("duration");
        let point: Vector[] = [
            target_point,
            RotatePosition(target_point, QAngle(0, 90, 0), target_point + (target_point - caster.GetAbsOrigin() as Vector).Normalized() * 64 as Vector),
            RotatePosition(target_point, QAngle(0, -90, 0), target_point + (target_point - caster.GetAbsOrigin() as Vector).Normalized() * 64 as Vector),
        ]
        EmitSoundOn(sound_cast, caster);
        for (let i = 0; i < 1 + caster.GetTalentValue("special_bonus_imba_pugna_8"); i++) {
            let nether_ward = undefined;
            let time = duration - duration * caster.GetTalentValue("special_bonus_imba_pugna_8", "duration_reduce_pct") * 0.01;
            if (i != 0 || !this.GetCursorTarget() || this.GetCursorTarget() != this.GetCasterPlus()) {
                nether_ward = caster.CreateSummon("npc_imba_pugna_nether_ward_" + (ability_level), point[i], time, true);
            } else {
                nether_ward = caster.CreateSummon("npc_imba_pugna_nether_ward_" + (ability_level), this.GetCasterPlus().GetAbsOrigin() + (this.GetCasterPlus().GetForwardVector() * 150) as Vector, time, true);
            }
            // nether_ward.SetControllableByPlayer(player_id, true);

            nether_ward.AddNewModifier(caster, ability, "modifier_rooted", {});
            let aura_ability = nether_ward.FindAbilityByName(ability_ward);
            aura_ability.SetLevel(ability_level);
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_friend(this)
    }
}
@registerAbility()
export class imba_pugna_nether_ward_aura extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "pugna_nether_ward";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_nether_ward_aura";
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("radius");
    }
}
@registerModifier()
export class modifier_imba_nether_ward_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public radius: number;
    public hero_damage: number;
    public creep_damage: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.hero_damage = this.ability.GetSpecialValueFor("hero_damage");
        this.creep_damage = this.ability.GetSpecialValueFor("creep_damage");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            4: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST,
            5: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    CC_GetModifierIgnoreCastAngle(): 0 | 1 {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit != this.GetParentPlus()) {
            return;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return -100;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING)
    CC_GetDisableHealing(): 0 | 1 {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        let target = keys.target;
        let attacker = keys.attacker as IBaseNpc_Plus;
        if (target == this.caster) {
            let damage;
            if (attacker.IsRealUnit() || attacker.IsTower() || attacker.IsRoshan()) {
                damage = this.hero_damage;
            } else {
                damage = this.creep_damage;
            }
            if (this.caster.GetHealth() <= damage) {
                this.caster.Kill(this.ability, attacker);
            } else {
                this.caster.SetHealth(this.caster.GetHealth() - damage);
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        };
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
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_nether_ward_degen";
    }
    IsAura(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_nether_ward_degen extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public sound_zap: any;
    public sound_target: any;
    public particle_heavy: any;
    public particle_medium: any;
    public particle_light: any;
    public mana_regen_reduction: any;
    public hero_damage: number;
    public creep_damage: number;
    public spell_damage: number;
    public mana_multiplier: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.sound_zap = "Hero_Pugna.NetherWard.Attack";
        this.sound_target = "Hero_Pugna.NetherWard.Target";
        this.particle_heavy = "particles/econ/items/pugna/pugna_ward_ti5/pugna_ward_attack_heavy_ti_5.vpcf";
        this.particle_medium = "particles/econ/items/pugna/pugna_ward_ti5/pugna_ward_attack_medium_ti_5.vpcf";
        this.particle_light = "particles/econ/items/pugna/pugna_ward_ti5/pugna_ward_attack_light_ti_5.vpcf";
        if (!this.ability) {
            this.Destroy();
            return undefined;
        }
        this.mana_regen_reduction = this.ability.GetSpecialValueFor("mana_regen_reduction") * (-1);
        this.hero_damage = this.ability.GetSpecialValueFor("hero_damage");
        this.creep_damage = this.ability.GetSpecialValueFor("creep_damage");
        this.spell_damage = this.ability.GetSpecialValueFor("spell_damage");
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus() && this.GetCasterPlus().GetOwnerPlus() && this.GetCasterPlus().GetOwnerPlus().HasAbility("imba_pugna_nether_ward")) {
            this.mana_multiplier = this.GetCasterPlus().GetOwnerPlus().findAbliityPlus<imba_pugna_nether_ward>("imba_pugna_nether_ward").GetSpecialValueFor("mana_multiplier");
        } else {
            this.mana_multiplier = this.ability.GetSpecialValueFor("mana_multiplier");
        }
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
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_SPENT_MANA
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE)
    CC_GetModifierTotalPercentageManaRegen(): number {
        return this.mana_regen_reduction;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_SPENT_MANA)
    CC_OnSpentMana(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let target = keys.unit;
            let cast_ability = keys.ability as imba_pugna_life_drain_end;
            let ability_cost = (keys as any).cost;
            if (!target || !cast_ability || !ability_cost || ability_cost == 0) {
                return;
            }
            if (target != this.parent) {
                return;
            }
            if (target.GetUnitName().includes("npc_imba_pugna_nether_ward")) {
                return;
            }
            if (cast_ability.IsNetherWardStealable) {
                if (!cast_ability.IsNetherWardStealable()) {
                    return;
                }
            }
            let ward = this.caster;
            let caster = ward.GetOwnerEntity() as IBaseNpc_Plus;
            let ability_zap = this.ability;
            if (caster.HasTalent("special_bonus_imba_pugna_6")) {
                ward.AddNewModifier(ward, undefined, "modifier_pugna_decrepify", {
                    duration: caster.GetTalentValue("special_bonus_imba_pugna_6")
                });
            }
            ApplyDamage({
                attacker: ward,
                victim: target,
                ability: ability_zap,
                damage: ability_cost * this.mana_multiplier,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            ward.EmitSound(this.sound_zap);
            target.EmitSound(this.sound_target);
            if (ability_cost < 200) {
                let zap_pfx = ResHelper.CreateParticleEx(this.particle_light, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
                ParticleManager.SetParticleControlEnt(zap_pfx, 0, ward, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", ward.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(zap_pfx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(zap_pfx);
            } else if (ability_cost < 400) {
                let zap_pfx = ResHelper.CreateParticleEx(this.particle_medium, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
                ParticleManager.SetParticleControlEnt(zap_pfx, 0, ward, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", ward.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(zap_pfx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(zap_pfx);
            } else {
                let zap_pfx = ResHelper.CreateParticleEx(this.particle_heavy, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
                ParticleManager.SetParticleControlEnt(zap_pfx, 0, ward, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", ward.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(zap_pfx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(zap_pfx);
            }
            if (ward.GetHealth() <= this.spell_damage) {
                return undefined;
            }
            let cast_ability_name = cast_ability.GetAbilityName();
            let forbidden_abilities = {
                "1": "ancient_apparition_ice_blast",
                "2": "furion_teleportation",
                "3": "furion_wrath_of_nature",
                "4": "life_stealer_infest",
                "5": "life_stealer_assimilate",
                "6": "life_stealer_assimilate_eject",
                "7": "storm_spirit_static_remnant",
                "8": "storm_spirit_ball_lightning",
                "9": "invoker_ghost_walk",
                "10": "shadow_demon_shadow_poison",
                "11": "shadow_demon_demonic_purge",
                "12": "phantom_lancer_doppelwalk",
                "13": "chaos_knight_phantasm",
                "14": "wisp_relocate",
                "15": "templar_assassin_refraction",
                "16": "templar_assassin_meld",
                "17": "naga_siren_mirror_image",
                "18": "imba_ember_spirit_activate_fire_remnant",
                "19": "legion_commander_duel",
                "20": "phoenix_fire_spirits",
                "21": "terrorblade_conjure_image",
                "22": "winter_wyvern_arctic_burn",
                "23": "beastmaster_call_of_the_wild",
                "24": "beastmaster_call_of_the_wild_boar",
                "25": "dark_seer_ion_shell",
                "26": "dark_seer_wall_of_replica",
                "27": "morphling_waveform",
                "28": "morphling_adaptive_strike",
                "29": "morphling_replicate",
                "30": "morphling_morph_replicate",
                "31": "morphling_hybrid",
                "32": "leshrac_pulse_nova",
                "33": "rattletrap_power_cogs",
                "34": "rattletrap_rocket_flare",
                "35": "rattletrap_hookshot",
                "36": "spirit_breaker_charge_of_darkness",
                "37": "shredder_timber_chain",
                "38": "shredder_chakram",
                "39": "shredder_chakram_2",
                "40": "spectre_haunt",
                "41": "windrunner_focusfire",
                "42": "viper_poison_attack",
                "43": "arc_warden_tempest_double",
                "44": "broodmother_insatiable_hunger",
                "45": "weaver_time_lapse",
                "46": "death_prophet_exorcism",
                "47": "treant_eyes_in_the_forest",
                "48": "treant_living_armor",
                "49": "imba_enchantress_impetus",
                "50": "chen_holy_persuasion",
                "51": "batrider_firefly",
                "52": "undying_decay",
                "53": "undying_tombstone",
                "54": "tusk_walrus_kick",
                "55": "tusk_walrus_punch",
                "56": "tusk_frozen_sigil",
                "57": "gyrocopter_flak_cannon",
                "58": "elder_titan_echo_stomp_spirit",
                "59": "imba_elder_titan_ancestral_spirit",
                "60": "visage_soul_assumption",
                "61": "visage_summon_familiars",
                "62": "earth_spirit_geomagnetic_grip",
                "63": "keeper_of_the_light_recall",
                "64": "monkey_king_boundless_strike",
                "65": "monkey_king_mischief",
                "66": "monkey_king_tree_dance",
                "67": "monkey_king_primal_spring",
                "68": "monkey_king_wukongs_command",
                "69": "doom_doom",
                "70": "zuus_cloud",
                "71": "void_spirit_aether_remnant",
                "72": "imba_rubick_spellsteal",
                "73": "rubick_spell_steal",
                "74": "imba_bristleback_bristleback",
                "75": "lone_druid_spirit_bear",
                "76": "imba_lone_druid_spirit_bear",
                "77": "lone_druid_true_form",
                "78": "imba_lone_druid_true_form",
                "79": "terrorblade_metamorphosis",
                "80": "imba_terrorblade_metamorphosis",
                "81": "undying_flesh_golem",
                "82": "imba_undying_flesh_golem",
                "83": "dragon_knight_elder_dragon_form",
                "84": "imba_dragon_knight_elder_dragon_form",
                "85": "imba_alchemist_unstable_concoction",
                "86": "imba_alchemist_chemical_rage"
            }
            if (cast_ability_name.includes("item_")) {
                return;
            }
            if (target.IsMagicImmune()) {
                return;
            }
            for (const [_, forbidden_ability] of GameFunc.Pair(forbidden_abilities)) {
                if (cast_ability_name == forbidden_ability) {
                    return;
                }
            }
            let ability = ward.FindAbilityByName(cast_ability_name);
            if (!ability) {
                ward.AddAbility(cast_ability_name);
                ability = ward.FindAbilityByName(cast_ability_name);
            } else {
                ability.SetActivated(true);
            }
            ability.SetLevel(cast_ability.GetLevel());
            ability.EndCooldown();
            if (cast_ability.GetAutoCastState && cast_ability.GetAutoCastState() && ability.GetAutoCastState && !ability.GetAutoCastState()) {
                ability.ToggleAutoCast();
            }
            let ability_range = ability.GetCastRange(ward.GetAbsOrigin(), target);
            let target_point = target.GetAbsOrigin();
            let ward_position = ward.GetAbsOrigin();
            if (cast_ability_name == "imba_lich_dark_ritual") {
                let creeps = FindUnitsInRadius(caster.GetTeamNumber(), ward.GetAbsOrigin(), undefined, ability_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_SUMMONED, FindOrder.FIND_CLOSEST, false);
                if (GameFunc.GetCount(creeps) == 1) {
                    return undefined;
                }
                target = creeps[1];
                target_point = target.GetAbsOrigin();
                ability_range = ability.GetCastRange(ward.GetAbsOrigin(), target);
            }
            if (cast_ability_name == "spirit_breaker_nether_strike") {
                ward.AddAbility("spirit_breaker_greater_bash");
                let ability_bash = ward.findAbliityPlus("spirit_breaker_greater_bash");
                ability_bash.SetLevel(4);
            }
            if (cast_ability_name == "imba_omniknight_repel") {
                let allies = FindUnitsInRadius(caster.GetTeamNumber(), ward.GetAbsOrigin(), undefined, ability_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_CLOSEST, false);
                if (GameFunc.GetCount(allies) == 1) {
                    target = allies[0];
                    target_point = target.GetAbsOrigin();
                    ability_range = ability.GetCastRange(ward.GetAbsOrigin(), target);
                } else {
                    target = allies[1];
                    target_point = target.GetAbsOrigin();
                    ability_range = ability.GetCastRange(ward.GetAbsOrigin(), target);
                }
            }
            if (cast_ability_name == "imba_pudge_meat_hook") {
                ability_range = ability.GetLevelSpecialValueFor("base_range", ability.GetLevel() - 1);
            }
            if (cast_ability_name == "elder_titan_earth_splitter") {
                ability_range = 25000;
            }
            if (cast_ability_name == "imba_nevermore_shadowraze_close" || cast_ability_name == "imba_nevermore_shadowraze_medium" || cast_ability_name == "imba_nevermore_shadowraze_far") {
                ward.SetForwardVector((target_point - ward_position as Vector).Normalized());
            }
            if (cast_ability_name == "imba_nevermore_requiem" && !ward.HasModifier("modifier_imba_necromastery_souls") && target.HasAbility("imba_nevermore_necromastery")) {
                let ability_handle = ward.AddAbility("imba_nevermore_necromastery");
                ability_handle.SetLevel(7);
                if (target.HasModifier("modifier_imba_necromastery_souls")) {
                    let stacks = target.findBuffStack("modifier_imba_necromastery_souls", target);
                    if (ward.HasModifier("modifier_imba_necromastery_souls")) {
                        let modifier_souls_handler = ward.findBuff("modifier_imba_necromastery_souls");
                        if (modifier_souls_handler) {
                            modifier_souls_handler.SetStackCount(stacks);
                        }
                    }
                }
            }
            if (cast_ability_name == "imba_sven_storm_bolt") {
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), ward_position, undefined, ability_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                if (GameFunc.GetCount(enemies) > 0) {
                    if (enemies[0].findAbliityPlus("imba_sven_storm_bolt")) {
                        if (GameFunc.GetCount(enemies) > 1) {
                            target = enemies[1];
                        } else {
                            return;
                        }
                    } else {
                        target = enemies[0];
                    }
                } else {
                    return;
                }
            }
            if (cast_ability_name == "invoker_sun_strike") {
                ability_range = 25000;
            }
            // TODO luna_lucent_beam
            if (cast_ability_name == "luna_eclipse") {
                if (!ward.findAbliityPlus("luna_lucent_beam")) {
                    ward.AddAbility("luna_lucent_beam");
                }
                let ability_lucent = ward.findAbliityPlus("luna_lucent_beam");
                ability_lucent.SetLevel(4);
            }
            let ability_behavior = ability.GetBehaviorInt();
            let ability_target_team = ability.GetAbilityTargetTeam();
            if (ability.IsHidden()) {
                ability.SetHidden(false);
                ability_behavior = ability_behavior - 1;
            }
            let ability_was_used = false;
            // todo queue??
            let queue = true;
            if (ability_behavior == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NONE) {
            } else if (ability_behavior % DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE == 0) {
                ability.ToggleAbility();
                ability_was_used = true;
            } else if (ability_behavior % DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT == 0) {
                if (ability_target_team == DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY) {
                    ExecuteOrderFromTable({
                        UnitIndex: ward.GetEntityIndex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        Position: ward.GetAbsOrigin(),
                        AbilityIndex: ability.GetEntityIndex(),
                        Queue: queue
                    });
                    ability_was_used = true;
                } else {
                    if (ability_range > 0 && (target_point - ward_position as Vector).Length2D() > ability_range) {
                        target_point = ward_position + (target_point - ward_position as Vector).Normalized() * (ability_range - 50) as Vector;
                    }
                    ExecuteOrderFromTable({
                        UnitIndex: ward.GetEntityIndex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        Position: target_point,
                        AbilityIndex: ability.GetEntityIndex(),
                        Queue: queue
                    });
                    ability_was_used = true;
                }
            } else if (ability_behavior % DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET == 0) {
                if (ability_target_team == DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY) {
                    let allies = FindUnitsInRadius(caster.GetTeamNumber(), ward_position, undefined, ability_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                    if (GameFunc.GetCount(allies) > 0) {
                        ExecuteOrderFromTable({
                            UnitIndex: ward.GetEntityIndex(),
                            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                            TargetIndex: allies[0].GetEntityIndex(),
                            AbilityIndex: ability.GetEntityIndex(),
                            Queue: queue
                        });
                        ability_was_used = true;
                    }
                } else if ((target_point - ward_position as Vector).Length2D() <= ability_range) {
                    ExecuteOrderFromTable({
                        UnitIndex: ward.GetEntityIndex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                        TargetIndex: target.GetEntityIndex(),
                        AbilityIndex: ability.GetEntityIndex(),
                        Queue: queue
                    });
                    ability_was_used = true;
                } else {
                    let enemies = FindUnitsInRadius(caster.GetTeamNumber(), ward_position, undefined, ability_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                    if (GameFunc.GetCount(enemies) > 0) {
                        ExecuteOrderFromTable({
                            UnitIndex: ward.GetEntityIndex(),
                            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                            TargetIndex: enemies[0].GetEntityIndex(),
                            AbilityIndex: ability.GetEntityIndex(),
                            Queue: queue
                        });
                        ability_was_used = true;
                    }
                }
            } else if (ability_behavior % DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET == 0) {
                ability.CastAbility();
                ability_was_used = true;
            }
            if (ward.IsSilenced()) {
                ability_was_used = false;
            }
            if (ability_was_used) {
                ward.SetHealth(ward.GetHealth() - this.spell_damage);
            }
            let cast_point = ability.GetCastPoint();
            this.AddTimer(cast_point + 0.5, () => {
                ability.SetActivated(false);
            });
        }
    }
}
@registerAbility()
export class imba_pugna_life_drain extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "pugna_life_drain";
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("cast_range");
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_pugna_life_drain_end";
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        let ability_cancel = "imba_pugna_life_drain_end";
        let ability_cancel_handler = caster.FindAbilityByName(ability_cancel);
        if (ability_cancel_handler) {
            if (ability_cancel_handler.GetLevel() == 0) {
                ability_cancel_handler.SetLevel(1);
            }
        }
    }
    GetCooldown(level: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return 0;
        } else {
            return super.GetCooldown(level);
        }
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (target == this.GetCasterPlus()) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
        if (target.HasModifier("modifier_imba_life_drain")) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
        return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, this.GetCasterPlus().GetTeamNumber());
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (target == this.GetCasterPlus()) {
            return "dota_hud_error_life_drain_self";
        }
        if (target.HasModifier("modifier_imba_life_drain")) {
            return "dota_hud_error_life_drain_target";
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let sound_cast = "Hero_Pugna.LifeDrain.Cast";
        let modifier_lifedrain = "modifier_imba_life_drain";
        EmitSoundOn(sound_cast, caster);
        if (caster.GetTeamNumber() != target.GetTeamNumber()) {
            if (target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
        }
        target.AddNewModifier(caster, ability, modifier_lifedrain, {});
    }
    GetManaCost(level: number): number {
        return 800;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_life_drain extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public sound_target: any;
    public sound_loop: any;
    public particle_drain: any;
    public particle_give: any;
    public scepter: any;
    public nether_ward: any;
    public health_drain: any;
    public scepter_health_drain: any;
    public base_slow_pct: number;
    public slow_per_second: any;
    public tick_rate: any;
    public break_distance_extend: number;
    public is_ally: any;
    public drain_amount: number;
    public particle_drain_fx: any;
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.sound_target = "Hero_Pugna.LifeDrain.Target";
        this.sound_loop = "Hero_Pugna.LifeDrain.Loop";
        this.particle_drain = "particles/units/heroes/hero_pugna/pugna_life_drain.vpcf";
        this.particle_give = "particles/units/heroes/hero_pugna/pugna_life_give.vpcf";
        this.scepter = this.caster.HasScepter();
        this.nether_ward = "npc_imba_pugna_nether_ward";
        this.health_drain = this.ability.GetSpecialValueFor("health_drain");
        this.scepter_health_drain = this.ability.GetSpecialValueFor("scepter_health_drain");
        this.base_slow_pct = this.ability.GetSpecialValueFor("base_slow_pct");
        this.slow_per_second = this.ability.GetSpecialValueFor("slow_per_second");
        this.tick_rate = this.ability.GetSpecialValueFor("tick_rate");
        this.break_distance_extend = this.ability.GetSpecialValueFor("break_distance_extend");
        if (this.parent.GetTeamNumber() == this.caster.GetTeamNumber()) {
            this.is_ally = true;
        } else {
            this.is_ally = false;
        }
        this.drain_amount = this.health_drain;
        if (IsServer()) {
            EmitSoundOn(this.sound_target, this.parent);
            StopSoundOn(this.sound_loop, this.parent);
            EmitSoundOn(this.sound_loop, this.parent);
            if (this.is_ally) {
                this.particle_drain_fx = ResHelper.CreateParticleEx(this.particle_give, ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster);
                ParticleManager.SetParticleControlEnt(this.particle_drain_fx, 0, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.caster.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(this.particle_drain_fx, 1, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            } else {
                this.particle_drain_fx = ResHelper.CreateParticleEx(this.particle_drain, ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster);
                ParticleManager.SetParticleControlEnt(this.particle_drain_fx, 0, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.caster.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(this.particle_drain_fx, 1, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            }
            this.break_distance_extend = this.break_distance_extend + this.GetCasterPlus().GetCastRangeBonus();
            this.AddTimer(this.tick_rate, () => {
                this.StartIntervalThink(this.tick_rate);
            });
        } else {
            this.StartIntervalThink(this.tick_rate);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!IsValid(this.caster)) {
                this.Destroy();
                return;
            }
            if (this.parent.IsIllusion() && this.parent.GetTeamNumber() != this.caster.GetTeamNumber() && !GFuncEntity.Custom_bIsStrongIllusion(this.parent)) {
                this.parent.Kill(this.ability, this.caster);
                return;
            }
            if (this.caster.IsStunned() || this.caster.IsSilenced()) {
                this.Destroy();
            }
            if (this.parent.GetTeamNumber() != this.caster.GetTeamNumber() && this.parent.IsInvisible()) {
                this.Destroy();
            }
            if (!this.caster.CanEntityBeSeenByMyTeam(this.parent) || this.parent.IsInvulnerable() || this.parent.IsMagicImmune()) {
                this.Destroy();
            }
            let cast_range = this.ability.GetCastRange(this.caster.GetAbsOrigin(), this.parent);
            let distance = (this.parent.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Length2D();
            if (!this.caster.HasTalent("special_bonus_imba_pugna_4")) {
                if (distance > (cast_range + this.break_distance_extend)) {
                    this.Destroy();
                }
            } else {
                if (this.GetElapsedTime() > this.caster.GetTalentValue("special_bonus_imba_pugna_4")) {
                    if (distance > (cast_range + this.break_distance_extend)) {
                        this.Destroy();
                    }
                }
            }
            if (!this.caster.IsAlive()) {
                this.Destroy();
            }
            let damage = (this.drain_amount + this.caster.GetTalentValue("special_bonus_imba_pugna_7") * 0.01 * this.parent.GetHealth()) * this.tick_rate;
            if (this.is_ally) {
                let damageTable = {
                    victim: this.caster,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    attacker: this.caster,
                    ability: this.ability
                }
                let actual_damage = ApplyDamage(damageTable);
                let missing_health = this.parent.GetMaxHealth() - this.parent.GetHealth();
                this.parent.ApplyHeal(actual_damage, this.ability);
                if (missing_health < actual_damage) {
                    let recover_mana = actual_damage - missing_health;
                    this.parent.GiveMana(recover_mana);
                }
                if (this.parent.GetUnitName().includes(this.nether_ward)) {
                    this.parent.SetHealth(this.parent.GetHealth() + 1);
                }
            } else {
                let damageTable = {
                    victim: this.parent,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    attacker: this.caster,
                    ability: this.ability
                }
                let actual_damage = ApplyDamage(damageTable);
                let missing_health = this.caster.GetMaxHealth() - this.caster.GetHealth();
                this.caster.ApplyHeal(actual_damage, this.ability);
                if (missing_health < actual_damage) {
                    let recover_mana = actual_damage - missing_health;
                    this.caster.GiveMana(recover_mana);
                }
                if (this.caster.GetUnitName().includes(this.nether_ward)) {
                    this.caster.SetHealth(this.caster.GetHealth() + 1);
                }
            }
        }
        if (!this.is_ally) {
            this.base_slow_pct = this.base_slow_pct + (this.slow_per_second * this.tick_rate);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetCasterPlus().GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            return {
                [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true,
                [modifierstate.MODIFIER_STATE_INVISIBLE]: false
            };
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.is_ally) {
            return undefined;
        }
        return this.base_slow_pct * (-1);
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        if (this.is_ally) {
            return false;
        } else {
            return true;
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        print(this.particle_drain_fx);
        ParticleManager.DestroyParticle(this.particle_drain_fx, false);
        ParticleManager.ReleaseParticleIndex(this.particle_drain_fx);
        StopSoundOn(this.sound_target, this.parent);
        StopSoundOn(this.sound_loop, this.parent);
    }
}
@registerAbility()
export class imba_pugna_life_drain_end extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "pugna_life_drain_end";
    }
    IsNetherWardStealable() {
        return false;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_pugna_life_drain";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_lifedrain = "modifier_imba_life_drain";
        let search_range = ability.GetSpecialValueFor("search_range");
        let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, search_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (ally.HasModifier(modifier_lifedrain)) {
                let modifier_lifedrain_handler = ally.FindModifierByName(modifier_lifedrain);
                if (modifier_lifedrain_handler) {
                    let modifier_caster = modifier_lifedrain_handler.GetCasterPlus();
                    if (caster == modifier_caster) {
                        ally.RemoveModifierByName(modifier_lifedrain);
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_pugna_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pugna_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pugna_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pugna_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pugna_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pugna_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pugna_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pugna_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_pugna_nether_ward_damage extends BaseModifier_Plus {
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
