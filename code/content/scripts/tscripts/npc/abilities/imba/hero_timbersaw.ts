
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_timbersaw_whirling_death extends BaseAbility_Plus {
    public responses: any;
    public dendrophobia_modifier: any;
    OnSpellStart(): void {
        if (this.GetCasterPlus().GetUnitName().includes("shredder") && RollPercentage(15)) {
            if (!this.responses) {
                this.responses = {
                    "1": "shredder_timb_whirlingdeath_03",
                    "2": "shredder_timb_whirlingdeath_04",
                    "3": "shredder_timb_whirlingdeath_06"
                }
            }
            this.GetCasterPlus().EmitSound(this.responses[RandomInt(1, GameFunc.GetCount(this.responses))]);
        }
        if (!this.GetAutoCastState()) {
            this.WhirlingDeath();
        } else {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_timbersaw_whirling_death_thinker", {
                duration: (this.GetSpecialValueFor("revving_down_instances") - 1) * this.GetSpecialValueFor("revving_down_interval")
            });
        }
    }
    WhirlingDeath(revving_down_efficacy = 0) {
        let efficacy = 1;
        if (revving_down_efficacy) {
            efficacy = revving_down_efficacy * 0.01;
        }
        this.GetCasterPlus().EmitSound("Hero_Shredder.WhirlingDeath.Cast");
        let whirling_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_shredder/shredder_whirling_death.vpcf", ParticleAttachment_t.PATTACH_CENTER_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(whirling_particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_CENTER_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(whirling_particle);
        let trees = GridNav.GetAllTreesAroundPoint(this.GetCasterPlus().GetAbsOrigin(), this.GetSpecialValueFor("whirling_radius"), false);
        if (!this.dendrophobia_modifier || this.dendrophobia_modifier.IsNull()) {
            this.dendrophobia_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_timbersaw_chakram_3", this.GetCasterPlus());
        }
        if (this.dendrophobia_modifier) {
            this.dendrophobia_modifier.SetStackCount(this.dendrophobia_modifier.GetStackCount() + GameFunc.GetCount(trees));
        }
        GridNav.DestroyTreesAroundPoint(this.GetCasterPlus().GetAbsOrigin(), this.GetSpecialValueFor("whirling_radius"), false);
        let hero_check = false;
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("whirling_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            if (enemy.IsRealUnit() && enemy.GetPrimaryStatValue) {
                enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_timbersaw_whirling_death_debuff", {
                    duration: this.GetSpecialValueFor("duration") * (1 - enemy.GetStatusResistance()),
                    blood_oil_convert_pct: this.GetSpecialValueFor("blood_oil_convert_pct"),
                    blood_oil_duration: this.GetSpecialValueFor("blood_oil_duration"),
                    efficacy: efficacy
                });
                if (!hero_check) {
                    hero_check = true;
                }
            }
            ApplyDamage({
                victim: enemy,
                damage: (this.GetSpecialValueFor("whirling_damage") + GameFunc.GetCount(trees) * this.GetSpecialValueFor("tree_damage_scale")) * efficacy,
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            });
        }
        if (hero_check) {
            this.GetCasterPlus().EmitSound("Hero_Shredder.WhirlingDeath.Damage");
        }
    }
}
@registerModifier()
export class modifier_imba_timbersaw_whirling_death_thinker extends BaseModifier_Plus {
    public revving_down_efficacy: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        this.revving_down_efficacy = this.GetSpecialValueFor("revving_down_efficacy");
        if (!IsServer()) {
            return;
        }
        this.OnIntervalThink();
        this.StartIntervalThink(this.GetSpecialValueFor("revving_down_interval"));
    }
    OnIntervalThink(): void {
        this.GetAbilityPlus<imba_timbersaw_whirling_death>().WhirlingDeath(this.revving_down_efficacy);
    }
}
@registerModifier()
export class modifier_imba_timbersaw_whirling_death_debuff extends BaseModifier_Plus {
    public efficacy: any;
    public primary_stat_loss: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_shredder/shredder_whirling_death_debuff.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_shredder_whirl.vpcf";
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        if (!IsServer() || !this.GetParentPlus().GetPrimaryStatValue) {
            return;
        }
        this.efficacy = params.efficacy;
        if (!params.stat_loss_pct) {
            this.primary_stat_loss = this.GetParentPlus().GetPrimaryStatValue() * this.GetAbilityPlus().GetTalentSpecialValueFor("stat_loss_pct") * 0.01 * (-1) * this.efficacy;
        } else {
            this.primary_stat_loss = this.GetParentPlus().GetPrimaryStatValue() * params.stat_loss_pct * 0.01 * (-1);
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_timbersaw_whirling_death_oil", {
            duration: params.blood_oil_duration,
            attribute: this.GetParentPlus().GetPrimaryAttribute(),
            stat_gain: this.primary_stat_loss * params.blood_oil_convert_pct * 0.01 * (-1)
        });
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        // if (this.GetParentPlus().CalculateStatBonus) {
        // this.GetParentPlus().CalculateStatBonus(true);
        // }
        this.StartIntervalThink(-1);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        // if (this.GetParentPlus().CalculateStatBonus) {
        // this.GetParentPlus().CalculateStatBonus(true);
        // }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.GetParentPlus().GetPrimaryAttribute() == Attributes.DOTA_ATTRIBUTE_STRENGTH) {
            return this.primary_stat_loss;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility() {
        if (this.GetParentPlus().GetPrimaryAttribute() == Attributes.DOTA_ATTRIBUTE_AGILITY) {
            return this.primary_stat_loss;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect() {
        if (this.GetParentPlus().GetPrimaryAttribute() == Attributes.DOTA_ATTRIBUTE_INTELLECT) {
            return this.primary_stat_loss;
        }
    }
}
@registerModifier()
export class modifier_imba_timbersaw_whirling_death_oil extends BaseModifier_Plus {
    public attribute: any;
    public stat_gain: any;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.attribute = params.attribute;
        this.stat_gain = params.stat_gain;
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        // this.GetParentPlus().CalculateStatBonus(true);
        this.StartIntervalThink(-1);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        // this.GetParentPlus().CalculateStatBonus(true);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.attribute == Attributes.DOTA_ATTRIBUTE_STRENGTH) {
            return this.stat_gain;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility() {
        if (this.attribute == Attributes.DOTA_ATTRIBUTE_AGILITY) {
            return this.stat_gain;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect() {
        if (this.attribute == Attributes.DOTA_ATTRIBUTE_INTELLECT) {
            return this.stat_gain;
        }
    }
}
@registerAbility()
export class imba_timbersaw_timber_chain extends BaseAbility_Plus {
    public projectiles: { [k: string]: any };
    public responses: any;
    public response_keys: string[];
    public random_selection: any;
    whirling_ability: imba_timbersaw_whirling_death;
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_timbersaw_timber_chain_range");
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        this.GetCasterPlus().EmitSound("Hero_Shredder.TimberChain.Cast");
        let timber_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_shredder/shredder_timberchain.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(timber_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(timber_particle, 1, this.GetCasterPlus().GetAbsOrigin() + ((this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * (this.GetTalentSpecialValueFor("range") + this.GetCasterPlus().GetCastRangeBonus())) as Vector);
        ParticleManager.SetParticleControl(timber_particle, 2, Vector(this.GetSpecialValueFor("speed"), 0, 0));
        ParticleManager.SetParticleControl(timber_particle, 3, Vector(((this.GetTalentSpecialValueFor("range") + this.GetCasterPlus().GetCastRangeBonus()) / this.GetSpecialValueFor("speed")) * 2, 0, 0));
        if (!this.projectiles) {
            this.projectiles = {}
        }
        let ExtraData = {
            timber_particle: timber_particle,
            cast_pos_x: this.GetCasterPlus().GetAbsOrigin().x,
            cast_pos_y: this.GetCasterPlus().GetAbsOrigin().y,
            cast_pos_z: this.GetCasterPlus().GetAbsOrigin().z
        }
        let timber_projectile = ProjectileManager.CreateLinearProjectile({
            Source: this.GetCasterPlus(),
            Ability: this,
            vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
            // bDeleteOnHit: false,
            fDistance: this.GetTalentSpecialValueFor("range") + this.GetCasterPlus().GetCastRangeBonus(),
            vVelocity: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * this.GetSpecialValueFor("speed") * Vector(1, 1, 0) as Vector,
            fStartRadius: this.GetSpecialValueFor("chain_radius"),
            fEndRadius: this.GetSpecialValueFor("chain_radius"),
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_TREE,
            bHasFrontalCone: true,
            // bReplaceExisting: false,
            fExpireTime: GameRules.GetGameTime() + 10.0,
            bProvidesVision: true,
            iVisionRadius: 100,
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            ExtraData: ExtraData
        });
        this.projectiles[timber_projectile] = ExtraData;
        if (this.GetCasterPlus().GetUnitName().includes("shredder")) {
            if (this.GetCasterPlus().GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_WEAPON)) {
                this.GetCasterPlus().GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_WEAPON).AddEffects(EntityEffects.EF_NODRAW);
            }
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_timbersaw_timber_chain_claw", {
                duration: ((this.GetSpecialValueFor("range") + this.GetCasterPlus().GetCastRangeBonus()) / this.GetSpecialValueFor("speed")) * 2
            });
        }
    }
    OnProjectileThinkHandle(projectileHandle: ProjectileID): void {
        if (GameFunc.GetCount(GridNav.GetAllTreesAroundPoint(ProjectileManager.GetLinearProjectileLocation(projectileHandle), this.GetSpecialValueFor("chain_radius"), false)) >= 1 && this.projectiles && this.projectiles[projectileHandle] && this.projectiles[projectileHandle].cast_pos_x) {
            let valid_trees = GridNav.GetAllTreesAroundPoint(ProjectileManager.GetLinearProjectileLocation(projectileHandle), this.GetSpecialValueFor("radius"), false);
            let tree = undefined;
            let original_caster_location = Vector(this.projectiles[projectileHandle].cast_pos_x, this.projectiles[projectileHandle].cast_pos_y, this.projectiles[projectileHandle].cast_pos_z);
            for (const [_, other_tree] of GameFunc.iPair(valid_trees)) {
                if ((tree == undefined || (other_tree != tree && (other_tree.GetAbsOrigin() - ProjectileManager.GetLinearProjectileLocation(projectileHandle) as Vector).Length2D() < (tree.GetAbsOrigin() - ProjectileManager.GetLinearProjectileLocation(projectileHandle) as Vector).Length2D())) && math.abs(AngleDiff(VectorToAngles(other_tree.GetAbsOrigin() - original_caster_location as Vector).y, VectorToAngles(ProjectileManager.GetLinearProjectileLocation(projectileHandle) - original_caster_location as Vector).y)) <= 90) {
                    tree = other_tree;
                }
            }
            if (tree) {
                EmitSoundOnLocationWithCaster(tree.GetAbsOrigin(), "Hero_Shredder.TimberChain.Impact", this.GetCasterPlus());
                this.GetCasterPlus().EmitSound("Hero_Shredder.TimberChain.Retract");
                ParticleManager.SetParticleControl(this.projectiles[projectileHandle].timber_particle, 1, tree.GetAbsOrigin());
                let direction = (tree.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_timbersaw_timber_chain", {
                    duration: math.max(((tree.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() - (this.GetCasterPlus().GetHullRadius() * 8)), 0) / this.GetSpecialValueFor("speed"),
                    autocast_state: this.GetAutoCastState(),
                    direction_x: direction.x,
                    direction_y: direction.y,
                    direction_z: direction.z,
                    tree_entindex: tree.entindex(),
                    damage_type: this.GetAbilityDamageType(),
                    radius: this.GetSpecialValueFor("radius"),
                    speed: this.GetSpecialValueFor("speed"),
                    damage: this.GetSpecialValueFor("damage"),
                    whirling_chain_stat_loss_pct: this.GetSpecialValueFor("whirling_chain_stat_loss_pct"),
                    side_hooks_damage_reduction: this.GetSpecialValueFor("side_hooks_damage_reduction"),
                    side_hooks_drag_pct: this.GetSpecialValueFor("side_hooks_drag_pct"),
                    timber_particle: this.projectiles[projectileHandle].timber_particle
                });
                this.projectiles[projectileHandle] = undefined;
                ProjectileManager.DestroyLinearProjectile(projectileHandle);
                if (this.GetCasterPlus().HasModifier("modifier_imba_timbersaw_timber_chain_claw")) {
                    this.GetCasterPlus().findBuff<modifier_imba_timbersaw_timber_chain_claw>("modifier_imba_timbersaw_timber_chain_claw").Destroy();
                }
            }
        } else {
            for (const ent of (Entities.FindAllByClassname("npc_dota_thinker") as IBaseNpc_Plus[])) {
                if (ent.TempData().bTimberChainTarget && (ProjectileManager.GetLinearProjectileLocation(projectileHandle) - ent.GetAbsOrigin() as Vector).Length2D() <= this.GetSpecialValueFor("chain_radius")) {
                    EmitSoundOnLocationWithCaster(ent.GetAbsOrigin(), "Hero_Shredder.TimberChain.Impact", this.GetCasterPlus());
                    this.GetCasterPlus().EmitSound("Hero_Shredder.TimberChain.Retract");
                    ParticleManager.SetParticleControl(this.projectiles[projectileHandle].timber_particle, 1, ent.GetAbsOrigin());
                    let direction = (ent.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_timbersaw_timber_chain", {
                        duration: (ent.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() / this.GetSpecialValueFor("speed"),
                        autocast_state: this.GetAutoCastState(),
                        direction_x: direction.x,
                        direction_y: direction.y,
                        direction_z: direction.z,
                        tree_entindex: ent.entindex(),
                        damage_type: this.GetAbilityDamageType(),
                        radius: this.GetSpecialValueFor("radius"),
                        speed: this.GetSpecialValueFor("speed"),
                        damage: this.GetSpecialValueFor("damage"),
                        whirling_chain_stat_loss_pct: this.GetSpecialValueFor("whirling_chain_stat_loss_pct"),
                        side_hooks_damage_reduction: this.GetSpecialValueFor("side_hooks_damage_reduction"),
                        side_hooks_drag_pct: this.GetSpecialValueFor("side_hooks_drag_pct"),
                        timber_particle: this.projectiles[projectileHandle].timber_particle
                    });
                    this.projectiles[projectileHandle] = undefined;
                    ProjectileManager.DestroyLinearProjectile(projectileHandle);
                    if (this.GetCasterPlus().HasModifier("modifier_imba_timbersaw_timber_chain_claw")) {
                        this.GetCasterPlus().findBuff<modifier_imba_timbersaw_timber_chain_claw>("modifier_imba_timbersaw_timber_chain_claw").Destroy();
                    }
                }
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (!target) {
            this.CreateVisibilityNode(location, 400, 0.1);
            this.GetCasterPlus().EmitSound("Hero_Shredder.TimberChain.Retract");
            if (this.GetCasterPlus().GetUnitName().includes("shredder")) {
                if (!this.responses) {
                    this.responses = {
                        ["shredder_timb_failure_01"]: 0,
                        ["shredder_timb_failure_02"]: 0,
                        ["shredder_timb_failure_03"]: 0
                    }
                    this.response_keys = Object.keys(this.responses);
                }
                this.random_selection = RandomInt(1, GameFunc.GetCount(this.response_keys));
                if (GameRules.GetDOTATime(true, true) - this.responses[this.response_keys[this.random_selection]] >= 5) {
                    this.GetCasterPlus().EmitSound(this.response_keys[this.random_selection]);
                    this.responses[this.response_keys[this.random_selection]] = GameRules.GetDOTATime(true, true);
                }
            }
            if (data.timber_particle && !this.GetCasterPlus().HasModifier("modifier_imba_timbersaw_timber_chain")) {
                ParticleManager.SetParticleControlEnt(data.timber_particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
            }
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_timbersaw_timber_chain_range") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_timbersaw_timber_chain_range")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_timbersaw_timber_chain_range"), "modifier_special_bonus_imba_timbersaw_timber_chain_range", {});
        }
    }
}
@registerModifier()
export class modifier_imba_timbersaw_timber_chain extends BaseModifierMotionHorizontal_Plus {
    public autocast_state: any;
    public damage_type: number;
    public tree: any;
    public radius: number;
    public speed: number;
    public damage: number;
    public whirling_chain_stat_loss_pct: number;
    public side_hooks_damage_reduction: number;
    public side_hooks_drag_pct: number;
    public timber_particle: any;
    public distance: number;
    public direction: any;
    public velocity: any;
    public damaged_targets: IBaseNpc_Plus[];
    public tree_particle: any;
    public dendrophobia_modifier: any;
    public damage_particle: ParticleID;
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_shredder/shredder_timber_chain_trail.vpcf";
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.autocast_state = params.autocast_state;
        this.damage_type = params.damage_type;
        this.tree = EntIndexToHScript(params.tree_entindex);
        this.radius = params.radius;
        this.speed = params.speed;
        this.damage = params.damage;
        this.whirling_chain_stat_loss_pct = params.whirling_chain_stat_loss_pct;
        this.side_hooks_damage_reduction = params.side_hooks_damage_reduction;
        this.side_hooks_drag_pct = params.side_hooks_drag_pct;
        this.timber_particle = params.timber_particle;
        if (this.autocast_state == 1) {
            this.damage = this.damage * this.side_hooks_damage_reduction * 0.01;
        }
        this.distance = (Vector(params.direction_x, params.direction_y, params.direction_z) - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D();
        this.direction = Vector(params.direction_x, params.direction_y, params.direction_z).Normalized();
        this.velocity = this.direction * params.speed;
        this.damaged_targets = []
        if (this.BeginMotionOrDestroy() == false) {
            return;
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().InterruptMotionControllers(true);
        if (this.tree && !this.tree.IsNull()) {
            EmitSoundOnLocationWithCaster(this.tree.GetAbsOrigin(), "Hero_Shredder.TimberChain.Impact", this.GetCasterPlus());
            this.tree_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_shredder/shredder_timber_chain_tree.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
            ParticleManager.SetParticleControl(this.tree_particle, 0, this.tree.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(this.tree_particle);
            if (!this.dendrophobia_modifier || this.dendrophobia_modifier.IsNull()) {
                this.dendrophobia_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_timbersaw_chakram_3", this.GetCasterPlus());
            }
            if (this.tree.CutDown || (this.tree.Kill && !this.tree.HasModifier)) {
                if (RollPercentage(50)) {
                    let tree_responses = {
                        "1": "shredder_timb_timberchain_02",
                        "2": "shredder_timb_timberchain_04",
                        "3": "shredder_timb_timberchain_05",
                        "4": "shredder_timb_timberchain_07",
                        "5": "shredder_timb_timberchain_08",
                        "6": "shredder_timb_timberchain_09"
                    }
                    this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(tree_responses));
                }
                if (this.tree.CutDown) {
                    this.tree.CutDown(this.GetParentPlus().GetTeamNumber());
                } else if (this.tree.Kill && !this.tree.HasModifier) {
                    this.tree.Kill();
                }
                if (this.dendrophobia_modifier) {
                    this.dendrophobia_modifier.IncrementStackCount();
                }
            }
        }
        ParticleManager.DestroyParticle(this.timber_particle, true);
        ParticleManager.ReleaseParticleIndex(this.timber_particle);
        if (this.GetCasterPlus().GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_WEAPON)) {
            this.GetCasterPlus().GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_WEAPON).RemoveEffects(EntityEffects.EF_NODRAW);
        }
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        me.SetOrigin(me.GetOrigin() + this.velocity * dt as Vector);
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            if (!this.damaged_targets.includes(enemy)) {
                enemy.EmitSound("Hero_Shredder.TimberChain.Damage");
                this.damage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_shredder/shredder_timber_dmg.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
                ParticleManager.ReleaseParticleIndex(this.damage_particle);
                ApplyDamage({
                    victim: enemy,
                    damage: this.damage,
                    damage_type: this.damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetParentPlus(),
                    ability: this.GetAbilityPlus()
                });
                this.damaged_targets.push(enemy);
                let ability = this.GetAbilityPlus<imba_timbersaw_timber_chain>();
                if (ability && this.GetCasterPlus().HasAbility("imba_timbersaw_whirling_death")) {
                    if (!ability.whirling_ability || ability.whirling_ability.IsNull()) {
                        ability.whirling_ability = this.GetCasterPlus().findAbliityPlus<imba_timbersaw_whirling_death>("imba_timbersaw_whirling_death");
                    }
                    if (ability.whirling_ability) {
                        enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_timbersaw_whirling_death_debuff", {
                            duration: ability.whirling_ability.GetSpecialValueFor("duration") * (1 - enemy.GetStatusResistance()),
                            blood_oil_convert_pct: ability.whirling_ability.GetSpecialValueFor("blood_oil_convert_pct"),
                            blood_oil_duration: ability.whirling_ability.GetSpecialValueFor("blood_oil_duration"),
                            stat_loss_pct: this.whirling_chain_stat_loss_pct
                        });
                    }
                }
                if (this.autocast_state && this.autocast_state == 1) {
                    let direction = (this.tree.GetAbsOrigin() - enemy.GetAbsOrigin() as Vector).Normalized();
                    enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_timbersaw_timber_chain_side_hooks", {
                        duration: ((this.tree.GetAbsOrigin() - enemy.GetAbsOrigin() as Vector).Length2D() / this.speed) * this.side_hooks_drag_pct * 0.01 * (1 - enemy.GetStatusResistance()),
                        direction_x: direction.x,
                        direction_y: direction.y,
                        direction_z: direction.z,
                        tree_entindex: this.tree.entindex(),
                        speed: this.speed
                    });
                }
            }
        }
        if (this.GetParentPlus().IsStunned() || (this.tree.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() <= this.GetParentPlus().GetHullRadius()) {
            this.Destroy();
        }
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        };
    }
}
@registerModifier()
export class modifier_imba_timbersaw_timber_chain_side_hooks extends BaseModifierMotionHorizontal_Plus {
    public tree: any;
    public speed: number;
    public distance: number;
    public direction: any;
    public velocity: any;
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.tree = EntIndexToHScript(params.tree_entindex);
        this.speed = params.speed;
        this.distance = (Vector(params.direction_x, params.direction_y, params.direction_z) - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D();
        this.direction = Vector(params.direction_x, params.direction_y, params.direction_z).Normalized();
        this.velocity = this.direction * this.speed;
        if (this.BeginMotionOrDestroy() == false) {
            return;
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().InterruptMotionControllers(true);
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        me.SetOrigin(me.GetOrigin() + this.velocity * dt as Vector);
        if ((this.tree.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() <= this.GetParentPlus().GetHullRadius()) {
            this.Destroy();
        }
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation( /** params */): GameActivity_t {
        if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            return GameActivity_t.ACT_DOTA_FLAIL;
        }
    }
}
@registerModifier()
export class modifier_imba_timbersaw_timber_chain_claw extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeDestroy(): void {
        if (!IsServer() || this.GetRemainingTime() > 0) {
            return;
        }
        if (this.GetCasterPlus().GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_WEAPON)) {
            this.GetCasterPlus().GetTogglableWearablePlus(DOTASlotType_t.DOTA_LOADOUT_TYPE_WEAPON).RemoveEffects(EntityEffects.EF_NODRAW);
        }
    }
}
@registerAbility()
export class imba_timbersaw_reactive_armor extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_timbersaw_reactive_armor";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    OnAbilityPhaseStart(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_timbersaw_reactive_armor extends BaseModifier_Plus {
    public reactive_particle_1: any;
    public reactive_particle_2: any;
    public reactive_particle_3: any;
    public reactive_particle_4: any;
    public reactive_hit_particle: any;
    DestroyOnExpire(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return this.GetStackCount() == 0;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().GetUnitName().includes("shredder")) {
            this.reactive_particle_1 = ResHelper.CreateParticleEx("particles/units/heroes/hero_shredder/shredder_armor_lyr1.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(this.reactive_particle_1, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_armor", this.GetParentPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.reactive_particle_1, 2, Vector(0, 0, 0));
            ParticleManager.SetParticleControlEnt(this.reactive_particle_1, 4, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_chimmney", this.GetParentPlus().GetAbsOrigin(), true);
            this.AddParticle(this.reactive_particle_1, false, false, -1, false, false);
            this.reactive_particle_2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_shredder/shredder_armor_lyr2.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(this.reactive_particle_2, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_armor", this.GetParentPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.reactive_particle_2, 2, Vector(0, 0, 0));
            ParticleManager.SetParticleControlEnt(this.reactive_particle_2, 4, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_chimmney", this.GetParentPlus().GetAbsOrigin(), true);
            this.AddParticle(this.reactive_particle_2, false, false, -1, false, false);
            this.reactive_particle_3 = ResHelper.CreateParticleEx("particles/units/heroes/hero_shredder/shredder_armor_lyr3.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(this.reactive_particle_3, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_armor", this.GetParentPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.reactive_particle_3, 2, Vector(0, 0, 0));
            ParticleManager.SetParticleControlEnt(this.reactive_particle_3, 4, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_chimmney", this.GetParentPlus().GetAbsOrigin(), true);
            this.AddParticle(this.reactive_particle_3, false, false, -1, false, false);
            this.reactive_particle_4 = ResHelper.CreateParticleEx("particles/units/heroes/hero_shredder/shredder_armor_lyr4.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(this.reactive_particle_4, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_armor", this.GetParentPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.reactive_particle_4, 2, Vector(0, 0, 0));
            ParticleManager.SetParticleControlEnt(this.reactive_particle_4, 4, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_chimmney", this.GetParentPlus().GetAbsOrigin(), true);
            this.AddParticle(this.reactive_particle_4, false, false, -1, false, false);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetAbilityPlus().GetAutoCastState && this.GetAbilityPlus().GetAutoCastState()) {
            return {
                [modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE]: true
            };
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            4: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetSpecialValueFor("bonus_armor") * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.GetSpecialValueFor("bonus_hp_regen") * this.GetStackCount();
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.target == this.GetParentPlus() && !this.GetParentPlus().PassivesDisabled() && !this.GetParentPlus().HasModifier("modifier_imba_timbersaw_reactive_armor_debuff") && this.GetAbilityPlus() && this.GetAbilityPlus().IsTrained()) {
            this.reactive_hit_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_shredder/shredder_reactive_hit.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(this.reactive_hit_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_chimmney", this.GetParentPlus().GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(this.reactive_hit_particle);
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_timbersaw_reactive_armor_stack", {
                duration: this.GetSpecialValueFor("stack_duration")
            });
            this.SetDuration(this.GetSpecialValueFor("stack_duration"), true);
            if (keys.attacker.GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
                for (let additional_stacks = 0; additional_stacks < this.GetSpecialValueFor("ally_hit_additional_stacks"); additional_stacks++) {
                    this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_timbersaw_reactive_armor_stack", {
                        duration: this.GetSpecialValueFor("stack_duration")
                    });
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingPhysicalDamage_Percentage(keys: ModifierAttackEvent): number {
        if (this.GetAbilityPlus().GetAutoCastState && this.GetAbilityPlus().GetAutoCastState() && keys.attacker.GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
            return this.GetSpecialValueFor("ally_damage_reduction") * (-1);
        }
    }
}
@registerModifier()
export class modifier_imba_timbersaw_reactive_armor_stack extends BaseModifier_Plus {
    public stack_limit: number;
    public min_stacks_particle_1: number;
    public min_stacks_particle_2: number;
    public min_stacks_particle_3: number;
    public min_stacks_particle_4: number;
    public reactive_armor_modifier: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.stack_limit = this.GetAbilityPlus().GetTalentSpecialValueFor("stack_limit");
        this.min_stacks_particle_1 = 1;
        this.min_stacks_particle_2 = 5;
        this.min_stacks_particle_3 = 9;
        this.min_stacks_particle_4 = 13;
        this.reactive_armor_modifier = this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_timbersaw_reactive_armor", this.GetCasterPlus());
        if (this.reactive_armor_modifier && !this.reactive_armor_modifier.IsNull()) {
            if (!this.GetCasterPlus().HasModifier("modifier_imba_timbersaw_reactive_armor_debuff")) {
                this.reactive_armor_modifier.SetStackCount(math.min(GameFunc.GetCount(this.GetParentPlus().FindAllModifiersByName(this.GetName())), this.stack_limit));
            } else {
                this.reactive_armor_modifier.SetStackCount(GameFunc.GetCount(this.GetParentPlus().FindAllModifiersByName(this.GetName())));
            }
            if (this.reactive_armor_modifier.reactive_particle_1) {
                ParticleManager.SetParticleControl(this.reactive_armor_modifier.reactive_particle_1, 2, Vector(this.reactive_armor_modifier.GetStackCount() - this.min_stacks_particle_1, 0, 0));
            }
            if (this.reactive_armor_modifier.reactive_particle_2) {
                ParticleManager.SetParticleControl(this.reactive_armor_modifier.reactive_particle_2, 2, Vector(this.reactive_armor_modifier.GetStackCount() - this.min_stacks_particle_2, 0, 0));
            }
            if (this.reactive_armor_modifier.reactive_particle_3) {
                ParticleManager.SetParticleControl(this.reactive_armor_modifier.reactive_particle_3, 2, Vector(this.reactive_armor_modifier.GetStackCount() - this.min_stacks_particle_3, 0, 0));
            }
            if (this.reactive_armor_modifier.reactive_particle_4) {
                ParticleManager.SetParticleControl(this.reactive_armor_modifier.reactive_particle_4, 2, Vector(this.reactive_armor_modifier.GetStackCount() - this.min_stacks_particle_4, 0, 0));
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.reactive_armor_modifier && !this.reactive_armor_modifier.IsNull()) {
            if (!this.GetCasterPlus().HasModifier("modifier_imba_timbersaw_reactive_armor_debuff")) {
                this.reactive_armor_modifier.SetStackCount(math.min(GameFunc.GetCount(this.GetParentPlus().FindAllModifiersByName(this.GetName())), this.stack_limit));
            } else {
                this.reactive_armor_modifier.SetStackCount(GameFunc.GetCount(this.GetParentPlus().FindAllModifiersByName(this.GetName())));
            }
            if (this.reactive_armor_modifier.reactive_particle_1) {
                ParticleManager.SetParticleControl(this.reactive_armor_modifier.reactive_particle_1, 2, Vector(this.reactive_armor_modifier.GetStackCount() - this.min_stacks_particle_1, 0, 0));
            }
            if (this.reactive_armor_modifier.reactive_particle_2) {
                ParticleManager.SetParticleControl(this.reactive_armor_modifier.reactive_particle_2, 2, Vector(this.reactive_armor_modifier.GetStackCount() - this.min_stacks_particle_2, 0, 0));
            }
            if (this.reactive_armor_modifier.reactive_particle_3) {
                ParticleManager.SetParticleControl(this.reactive_armor_modifier.reactive_particle_3, 2, Vector(this.reactive_armor_modifier.GetStackCount() - this.min_stacks_particle_3, 0, 0));
            }
            if (this.reactive_armor_modifier.reactive_particle_4) {
                ParticleManager.SetParticleControl(this.reactive_armor_modifier.reactive_particle_4, 2, Vector(this.reactive_armor_modifier.GetStackCount() - this.min_stacks_particle_4, 0, 0));
            }
        }
        if (this.reactive_armor_modifier.GetStackCount() == 0) {
            this.reactive_armor_modifier.SetDuration(-1, true);
        }
    }
}
@registerModifier()
export class modifier_imba_timbersaw_reactive_armor_debuff extends BaseModifier_Plus {
    IsDebuff(): boolean {
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
export class imba_timbersaw_chakram extends BaseAbility_Plus {
    public projectiles: { [k: string]: any };
    public responses: any;
    public response_keys: string[];
    public random_selection: any;
    public effect_name: any;
    public dendrophobia_modifier: any;
    OnStolen(self: CDOTABaseAbility): void {
        if (!this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram")) {
            this.GetCasterPlus().AddAbility("imba_timbersaw_return_chakram").SetHidden(true);
        }
    }
    OnUnStolen(): void {
        if (this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram")) {
            if (!this.GetCasterPlus().findAbliityPlus<imba_timbersaw_return_chakram>("imba_timbersaw_return_chakram").IsHidden()) {
                this.GetCasterPlus().SwapAbilities(this.GetAbilityName(), "imba_timbersaw_return_chakram", true, false);
            }
            this.GetCasterPlus().RemoveAbility("imba_timbersaw_return_chakram");
            if (this.GetCaster && this.GetCasterPlus() && this.GetCasterPlus().RemoveModifierByName) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_timbersaw_chakram_disarm");
            }
        }
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnUpgrade(): void {
        if (this.GetCasterPlus().HasAbility("imba_timbersaw_chakram_2") && this.GetCasterPlus().findAbliityPlus<imba_timbersaw_chakram_2>("imba_timbersaw_chakram_2").GetLevel() != this.GetLevel()) {
            this.GetCasterPlus().findAbliityPlus<imba_timbersaw_chakram_2>("imba_timbersaw_chakram_2").SetLevel(this.GetLevel());
        }
        if (this.GetCasterPlus().HasAbility("imba_timbersaw_chakram_3") && this.GetCasterPlus().findAbliityPlus<imba_timbersaw_chakram_3>("imba_timbersaw_chakram_3").GetLevel() != this.GetLevel()) {
            this.GetCasterPlus().findAbliityPlus<imba_timbersaw_chakram_3>("imba_timbersaw_chakram_3").SetLevel(this.GetLevel());
        }
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        if (!this.projectiles) {
            this.projectiles = {}
        }
        this.GetCasterPlus().EmitSound("Hero_Shredder.Chakram.Cast");
        if (this.GetCasterPlus().GetUnitName().includes("shredder")) {
            if (!this.responses) {
                this.responses = {
                    ["shredder_timb_chakram_02"]: 0,
                    ["shredder_timb_chakram_03"]: 0,
                    ["shredder_timb_chakram_06"]: 0,
                    ["shredder_timb_chakram_07"]: 0,
                    ["shredder_timb_chakram_08"]: 0
                }
                this.response_keys = Object.keys(this.responses);
            }
            this.random_selection = RandomInt(1, GameFunc.GetCount(this.response_keys));
            if (GameRules.GetDOTATime(true, true) - this.responses[this.response_keys[this.random_selection]] >= 5) {
                this.GetCasterPlus().EmitSound(this.response_keys[this.random_selection]);
                this.responses[this.response_keys[this.random_selection]] = GameRules.GetDOTATime(true, true);
            }
        }
        let ExtraData = {
            cast_pos_x: this.GetCasterPlus().GetAbsOrigin().x,
            cast_pos_y: this.GetCasterPlus().GetAbsOrigin().y,
            cast_pos_z: this.GetCasterPlus().GetAbsOrigin().z,
            bAutoCastState: this.GetAutoCastState()
        }
        if (!this.effect_name) {
            this.effect_name = "particles/units/heroes/hero_shredder/shredder_chakram.vpcf";
            // if (Wearables.GetWearable(this.GetCasterPlus(), "models/items/shredder/timbersaw_ti9_immortal_offhand/timbersaw_ti9_immortal_offhand")) {
            //     this.effect_name = "particles/econ/items/timbersaw/timbersaw_ti9_gold/timbersaw_ti9_chakram_gold.vpcf";
            // }
        }
        let chakram_projectile = ProjectileManager.CreateLinearProjectile({
            Source: this.GetCasterPlus(),
            Ability: this,
            vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
            // bDeleteOnHit: false,
            EffectName: this.effect_name,
            fDistance: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D(),
            vVelocity: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * this.GetSpecialValueFor("speed") * Vector(1, 1, 0) as Vector,
            fStartRadius: this.GetSpecialValueFor("radius"),
            fEndRadius: this.GetSpecialValueFor("radius"),
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            bHasFrontalCone: false,
            // bReplaceExisting: false,
            fExpireTime: GameRules.GetGameTime() + 10.0,
            bProvidesVision: false,
            ExtraData: ExtraData
        });
        this.projectiles[chakram_projectile + ""] = ExtraData;
        if (!this.IsHidden() && this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram") && this.GetCasterPlus().findAbliityPlus<imba_timbersaw_return_chakram>("imba_timbersaw_return_chakram").IsHidden()) {
            if (this.GetCasterPlus().findAbliityPlus<imba_timbersaw_return_chakram>("imba_timbersaw_return_chakram").GetLevel() != this.GetLevel()) {
                this.GetCasterPlus().findAbliityPlus<imba_timbersaw_return_chakram>("imba_timbersaw_return_chakram").SetLevel(this.GetLevel());
            }
            this.GetCasterPlus().SwapAbilities(this.GetAbilityName(), "imba_timbersaw_return_chakram", false, true);
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_timbersaw_chakram_disarm", {});
    }
    OnProjectileThinkHandle(projectileHandle: ProjectileID): void {
        if (GameFunc.GetCount(GridNav.GetAllTreesAroundPoint(ProjectileManager.GetLinearProjectileLocation(projectileHandle), this.GetSpecialValueFor("radius"), true)) >= 1) {
            for (const [_, tree] of GameFunc.iPair(GridNav.GetAllTreesAroundPoint(ProjectileManager.GetLinearProjectileLocation(projectileHandle), this.GetSpecialValueFor("radius"), false))) {
                EmitSoundOnLocationWithCaster(tree.GetAbsOrigin(), "Hero_Shredder.Chakram.Tree", this.GetCasterPlus());
            }
            if (!this.dendrophobia_modifier || this.dendrophobia_modifier.IsNull()) {
                this.dendrophobia_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_timbersaw_chakram_3", this.GetCasterPlus());
            }
            if (this.dendrophobia_modifier) {
                this.dendrophobia_modifier.SetStackCount(this.dendrophobia_modifier.GetStackCount() + GameFunc.GetCount(GridNav.GetAllTreesAroundPoint(ProjectileManager.GetLinearProjectileLocation(projectileHandle), this.GetSpecialValueFor("radius"), false)));
            }
            GridNav.DestroyTreesAroundPoint(ProjectileManager.GetLinearProjectileLocation(projectileHandle), this.GetSpecialValueFor("radius"), false);
        }
    }
    OnProjectileThink_ExtraData(location: Vector, data: any): void {
        if (data.bReturning) {
            if (GameFunc.GetCount(GridNav.GetAllTreesAroundPoint(location, this.GetSpecialValueFor("radius"), true)) >= 1) {
                for (const [_, tree] of GameFunc.iPair(GridNav.GetAllTreesAroundPoint(location, this.GetSpecialValueFor("radius"), false))) {
                    EmitSoundOnLocationWithCaster(tree.GetAbsOrigin(), "Hero_Shredder.Chakram.Tree", this.GetCasterPlus());
                }
                if (!this.dendrophobia_modifier || this.dendrophobia_modifier.IsNull()) {
                    this.dendrophobia_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_timbersaw_chakram_3", this.GetCasterPlus());
                }
                if (this.dendrophobia_modifier) {
                    this.dendrophobia_modifier.SetStackCount(this.dendrophobia_modifier.GetStackCount() + GameFunc.GetCount(GridNav.GetAllTreesAroundPoint(location, this.GetSpecialValueFor("radius"), false)));
                }
                GridNav.DestroyTreesAroundPoint(location, this.GetSpecialValueFor("radius"), false);
            }
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), location, undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                if (this.projectiles[data.id + ""] && !this.projectiles[data.id].returning_enemies) {
                    this.projectiles[data.id + ""].returning_enemies = []
                }
                let returning_enemies: IBaseNpc_Plus[] = this.projectiles[data.id + ""].returning_enemies;
                if (!returning_enemies.includes(enemy)) {
                    enemy.EmitSound("Hero_Shredder.Chakram.Target");
                    ApplyDamage({
                        victim: enemy,
                        damage: this.GetSpecialValueFor("pass_damage"),
                        damage_type: this.GetAbilityDamageType(),
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this
                    });
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_timbersaw_chakram_debuff", {
                        duration: this.GetSpecialValueFor("pass_slow_duration") * (1 - enemy.GetStatusResistance())
                    });
                    returning_enemies.push(enemy);
                }
            }
        }
    }
    OnProjectileHitHandle(target: IBaseNpc_Plus, location: Vector, _projectileHandle: ProjectileID) {
        let projectileHandle = "" + _projectileHandle;
        if (target && target != this.GetCasterPlus()) {
            if (!this.projectiles[projectileHandle].launching_enemies) {
                this.projectiles[projectileHandle].launching_enemies = []
            }
            let launching_enemies: IBaseNpc_Plus[] = this.projectiles[projectileHandle].launching_enemies;
            if (!launching_enemies.includes(target)) {
                target.EmitSound("Hero_Shredder.Chakram.Target");
                ApplyDamage({
                    victim: target,
                    damage: this.GetSpecialValueFor("pass_damage"),
                    damage_type: this.GetAbilityDamageType(),
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this
                });
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_timbersaw_chakram_debuff", {
                    duration: this.GetSpecialValueFor("pass_slow_duration") * (1 - target.GetStatusResistance())
                });
                launching_enemies.push(target);
            }
        }
        else if (!target && this.projectiles && this.projectiles[projectileHandle]) {
            let auto_cast_flag = 0;
            if (this.projectiles[projectileHandle].bAutoCastState) {
                auto_cast_flag = 1;
            }
            BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_timbersaw_chakram_thinker", {
                bAutoCastState: auto_cast_flag,
                cast_pos_x: this.projectiles[projectileHandle].cast_pos_x,
                cast_pos_y: this.projectiles[projectileHandle].cast_pos_y,
                cast_pos_z: this.projectiles[projectileHandle].cast_pos_z,
                speed: this.GetSpecialValueFor("speed"),
                radius: this.GetSpecialValueFor("radius"),
                damage_per_second: this.GetSpecialValueFor("damage_per_second"),
                pass_damage: this.GetSpecialValueFor("pass_damage"),
                damage_interval: this.GetSpecialValueFor("damage_interval"),
                break_distance: this.GetSpecialValueFor("break_distance"),
                mana_per_second: this.GetSpecialValueFor("mana_per_second"),
                observe_tick_scale: this.GetSpecialValueFor("observe_tick_scale"),
                observe_max_scale: this.GetSpecialValueFor("observe_max_scale")
            }, GetGroundPosition(location, undefined), this.GetCasterPlus().GetTeamNumber(), false);
            this.projectiles[projectileHandle] = undefined;
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (target && target == this.GetCasterPlus() && data.bReturning) {
            if (this.projectiles && this.projectiles[data.id + ""]) {
                this.projectiles[data.id + ""] = undefined;
            }
            if (this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram") && !this.GetCasterPlus().findAbliityPlus<imba_timbersaw_return_chakram>("imba_timbersaw_return_chakram").IsHidden() && this.IsHidden()) {
                this.GetCasterPlus().SwapAbilities(this.GetAbilityName(), "imba_timbersaw_return_chakram", true, false);
            }
            if ((!this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram") || (this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram") && this.GetCasterPlus().findAbliityPlus<imba_timbersaw_return_chakram>("imba_timbersaw_return_chakram").IsHidden())) && (!this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram_2") || (this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram_2") && this.GetCasterPlus().FindAbilityByName("imba_timbersaw_return_chakram_2").IsHidden())) && this.GetCasterPlus().HasModifier("modifier_imba_timbersaw_chakram_disarm")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_timbersaw_chakram_disarm");
            }
        }
    }
}
@registerAbility()
export class imba_timbersaw_chakram_2 extends BaseAbility_Plus {
    public projectiles: any;
    public responses: any;
    public response_keys: string[];
    public random_selection: any;
    public effect_name: any;
    public dendrophobia_modifier: any;
    IsInnateAbility() {
        return true;
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnInventoryContentsChanged(): void {
        if (this.GetCasterPlus().HasScepter() || this.IsStolen()) {
            if (!this.IsTrained()) {
                this.SetLevel(1);
            }
            if (!this.GetCasterPlus().findAbliityPlus<imba_timbersaw_return_chakram_2>("imba_timbersaw_return_chakram_2") || (this.GetCasterPlus().FindAbilityByName("imba_timbersaw_return_chakram_2") && this.GetCasterPlus().FindAbilityByName("imba_timbersaw_return_chakram_2").IsHidden())) {
                this.SetHidden(false);
            }
        } else {
            if (!this.GetCasterPlus().findAbliityPlus<imba_timbersaw_return_chakram_2>("imba_timbersaw_return_chakram_2") || (this.GetCasterPlus().FindAbilityByName("imba_timbersaw_return_chakram_2") && this.GetCasterPlus().FindAbilityByName("imba_timbersaw_return_chakram_2").IsHidden())) {
                this.SetHidden(true);
            }
        }
    }
    OnHeroCalculateStatBonus(): void {
        this.OnInventoryContentsChanged();
    }
    OnStolen(self: CDOTABaseAbility): void {
        if (!this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram_2")) {
            this.GetCasterPlus().AddAbility("imba_timbersaw_return_chakram_2").SetHidden(true);
        }
    }
    OnUnStolen(): void {
        if (this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram_2")) {
            if (!this.GetCasterPlus().findAbliityPlus<imba_timbersaw_return_chakram_2>("imba_timbersaw_return_chakram_2").IsHidden()) {
                this.GetCasterPlus().SwapAbilities(this.GetAbilityName(), "imba_timbersaw_return_chakram_2", true, false);
            }
            this.GetCasterPlus().RemoveAbility("imba_timbersaw_return_chakram_2");
            if (this.GetCaster && this.GetCasterPlus() && this.GetCasterPlus().RemoveModifierByName) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_timbersaw_chakram_disarm");
            }
        }
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        if (!this.projectiles) {
            this.projectiles = {}
        }
        this.GetCasterPlus().EmitSound("Hero_Shredder.Chakram.Cast");
        if (this.GetCasterPlus().GetUnitName().includes("shredder")) {
            if (!this.responses) {
                this.responses = {
                    ["shredder_timb_chakram_02"]: 0,
                    ["shredder_timb_chakram_03"]: 0,
                    ["shredder_timb_chakram_06"]: 0,
                    ["shredder_timb_chakram_07"]: 0,
                    ["shredder_timb_chakram_08"]: 0
                }
                this.response_keys = Object.keys(this.responses)
            }
            this.random_selection = RandomInt(1, GameFunc.GetCount(this.response_keys));
            if (GameRules.GetDOTATime(true, true) - this.responses[this.response_keys[this.random_selection]] >= 5) {
                this.GetCasterPlus().EmitSound(this.response_keys[this.random_selection]);
                this.responses[this.response_keys[this.random_selection]] = GameRules.GetDOTATime(true, true);
            }
        }
        let ExtraData = {
            cast_pos_x: this.GetCasterPlus().GetAbsOrigin().x,
            cast_pos_y: this.GetCasterPlus().GetAbsOrigin().y,
            cast_pos_z: this.GetCasterPlus().GetAbsOrigin().z,
            bAutoCastState: this.GetAutoCastState()
        }
        if (!this.effect_name) {
            this.effect_name = "particles/units/heroes/hero_shredder/shredder_chakram_aghs.vpcf";
            // if (Wearables.GetWearable(this.GetCasterPlus(), "models/items/shredder/timbersaw_ti9_immortal_offhand/timbersaw_ti9_immortal_offhand")) {
            //     this.effect_name = "particles/econ/items/timbersaw/timbersaw_ti9_gold/timbersaw_ti9_chakram_gold_aghs.vpcf";
            // }
        }
        let chakram_projectile = ProjectileManager.CreateLinearProjectile({
            Source: this.GetCasterPlus(),
            Ability: this,
            vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
            // bDeleteOnHit: false,
            EffectName: this.effect_name,
            fDistance: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D(),
            vVelocity: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * this.GetSpecialValueFor("speed") * Vector(1, 1, 0) as Vector,
            fStartRadius: this.GetSpecialValueFor("radius"),
            fEndRadius: this.GetSpecialValueFor("radius"),
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            bHasFrontalCone: false,
            // bReplaceExisting: false,
            fExpireTime: GameRules.GetGameTime() + 10.0,
            bProvidesVision: false,
            ExtraData: ExtraData
        });
        this.projectiles[chakram_projectile + ""] = ExtraData;
        if (!this.IsHidden() && this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram_2") && this.GetCasterPlus().findAbliityPlus<imba_timbersaw_return_chakram_2>("imba_timbersaw_return_chakram_2").IsHidden()) {
            if (this.GetCasterPlus().findAbliityPlus<imba_timbersaw_return_chakram_2>("imba_timbersaw_return_chakram_2").GetLevel() != this.GetLevel()) {
                this.GetCasterPlus().findAbliityPlus<imba_timbersaw_return_chakram_2>("imba_timbersaw_return_chakram_2").SetLevel(this.GetLevel());
            }
            this.GetCasterPlus().SwapAbilities(this.GetAbilityName(), "imba_timbersaw_return_chakram_2", false, true);
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_timbersaw_chakram_disarm", {});
    }
    OnProjectileThinkHandle(projectileHandle: ProjectileID): void {
        if (GameFunc.GetCount(GridNav.GetAllTreesAroundPoint(ProjectileManager.GetLinearProjectileLocation(projectileHandle), this.GetSpecialValueFor("radius"), true)) >= 1) {
            for (const [_, tree] of GameFunc.iPair(GridNav.GetAllTreesAroundPoint(ProjectileManager.GetLinearProjectileLocation(projectileHandle), this.GetSpecialValueFor("radius"), false))) {
                EmitSoundOnLocationWithCaster(tree.GetAbsOrigin(), "Hero_Shredder.Chakram.Tree", this.GetCasterPlus());
            }
            if (!this.dendrophobia_modifier || this.dendrophobia_modifier.IsNull()) {
                this.dendrophobia_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_timbersaw_chakram_3", this.GetCasterPlus());
            }
            if (this.dendrophobia_modifier) {
                this.dendrophobia_modifier.SetStackCount(this.dendrophobia_modifier.GetStackCount() + GameFunc.GetCount(GridNav.GetAllTreesAroundPoint(ProjectileManager.GetLinearProjectileLocation(projectileHandle), this.GetSpecialValueFor("radius"), false)));
            }
            GridNav.DestroyTreesAroundPoint(ProjectileManager.GetLinearProjectileLocation(projectileHandle), this.GetSpecialValueFor("radius"), false);
        }
    }
    OnProjectileThink_ExtraData(location: Vector, data: any): void {
        if (data.bReturning) {
            if (GameFunc.GetCount(GridNav.GetAllTreesAroundPoint(location, this.GetSpecialValueFor("radius"), true)) >= 1) {
                for (const [_, tree] of GameFunc.iPair(GridNav.GetAllTreesAroundPoint(location, this.GetSpecialValueFor("radius"), false))) {
                    EmitSoundOnLocationWithCaster(tree.GetAbsOrigin(), "Hero_Shredder.Chakram.Tree", this.GetCasterPlus());
                }
                if (!this.dendrophobia_modifier || this.dendrophobia_modifier.IsNull()) {
                    this.dendrophobia_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_timbersaw_chakram_3", this.GetCasterPlus());
                }
                if (this.dendrophobia_modifier) {
                    this.dendrophobia_modifier.SetStackCount(this.dendrophobia_modifier.GetStackCount() + GameFunc.GetCount(GridNav.GetAllTreesAroundPoint(location, this.GetSpecialValueFor("radius"), false)));
                }
                GridNav.DestroyTreesAroundPoint(location, this.GetSpecialValueFor("radius"), false);
            }
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), location, undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                if (this.projectiles[data.id + ""] && !this.projectiles[data.id].returning_enemies) {
                    this.projectiles[data.id + ""].returning_enemies = []
                }
                let returning_enemies = this.projectiles[data.id + ""].returning_enemies as IBaseNpc_Plus[];
                if (returning_enemies && !returning_enemies.includes(enemy)) {
                    enemy.EmitSound("Hero_Shredder.Chakram.Target");
                    ApplyDamage({
                        victim: enemy,
                        damage: this.GetSpecialValueFor("pass_damage"),
                        damage_type: this.GetAbilityDamageType(),
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this
                    });
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_timbersaw_chakram_debuff", {
                        duration: this.GetSpecialValueFor("pass_slow_duration") * (1 - enemy.GetStatusResistance())
                    });
                    returning_enemies.push(enemy);
                }
            }
        }
    }
    OnProjectileHitHandle(target: IBaseNpc_Plus, location: Vector, _projectileHandle: ProjectileID) {
        let projectileHandle = _projectileHandle + "";
        if (target && target != this.GetCasterPlus()) {
            if (!this.projectiles[projectileHandle].launching_enemies) {
                this.projectiles[projectileHandle].launching_enemies = []
            }
            let launching_enemies = this.projectiles[projectileHandle].launching_enemies as IBaseNpc_Plus[];
            if (launching_enemies && !launching_enemies.includes(target)) {
                target.EmitSound("Hero_Shredder.Chakram.Target");
                ApplyDamage({
                    victim: target,
                    damage: this.GetSpecialValueFor("pass_damage"),
                    damage_type: this.GetAbilityDamageType(),
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this
                });
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_timbersaw_chakram_debuff", {
                    duration: this.GetSpecialValueFor("pass_slow_duration") * (1 - target.GetStatusResistance())
                });
                launching_enemies.push(target);
            }
        } else if (!target && this.projectiles && this.projectiles[projectileHandle]) {
            let auto_cast_flag = 0;
            if (this.projectiles[projectileHandle].bAutoCastState) {
                auto_cast_flag = 1;
            }
            BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_timbersaw_chakram_thinker", {
                bAutoCastState: auto_cast_flag,
                cast_pos_x: this.projectiles[projectileHandle].cast_pos_x,
                cast_pos_y: this.projectiles[projectileHandle].cast_pos_y,
                cast_pos_z: this.projectiles[projectileHandle].cast_pos_z,
                speed: this.GetSpecialValueFor("speed"),
                radius: this.GetSpecialValueFor("radius"),
                damage_per_second: this.GetSpecialValueFor("damage_per_second"),
                pass_damage: this.GetSpecialValueFor("pass_damage"),
                damage_interval: this.GetSpecialValueFor("damage_interval"),
                break_distance: this.GetSpecialValueFor("break_distance"),
                mana_per_second: this.GetSpecialValueFor("mana_per_second"),
                observe_tick_scale: this.GetSpecialValueFor("observe_tick_scale"),
                observe_max_scale: this.GetSpecialValueFor("observe_max_scale")
            }, GetGroundPosition(location, undefined), this.GetCasterPlus().GetTeamNumber(), false);
            delete this.projectiles[projectileHandle];
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (target && target == this.GetCasterPlus() && data.bReturning) {
            if (this.projectiles && this.projectiles[data.id + ""]) {
                delete this.projectiles[data.id + ""];
            }
            if (this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram_2") && !this.GetCasterPlus().findAbliityPlus<imba_timbersaw_return_chakram_2>("imba_timbersaw_return_chakram_2").IsHidden() && this.IsHidden()) {
                this.GetCasterPlus().SwapAbilities(this.GetAbilityName(), "imba_timbersaw_return_chakram_2", true, false);
            }
            if ((!this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram") || (this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram") && this.GetCasterPlus().findAbliityPlus<imba_timbersaw_return_chakram>("imba_timbersaw_return_chakram").IsHidden())) && (!this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram_2") || (this.GetCasterPlus().HasAbility("imba_timbersaw_return_chakram_2") && this.GetCasterPlus().FindAbilityByName("imba_timbersaw_return_chakram_2").IsHidden())) && this.GetCasterPlus().HasModifier("modifier_imba_timbersaw_chakram_disarm")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_timbersaw_chakram_disarm");
            }
        }
    }
}
@registerModifier()
export class modifier_imba_timbersaw_chakram_thinker extends BaseModifierMotionHorizontal_Plus {
    public speed: number;
    public radius: number;
    public damage_per_second: number;
    public pass_damage: number;
    public damage_interval: number;
    public break_distance: number;
    public mana_per_second: any;
    public observe_tick_scale: any;
    public observe_max_scale: any;
    public damage_type: number;
    public effect_name: any;
    public interval: number;
    public stay_effect: any;
    public chakram_particle: any;
    public dendrophobia_modifier: any;
    public counter: number;
    cast_pos: Vector;
    angle: number
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (this.GetAbilityPlus()) {
            this.speed = this.GetSpecialValueFor("speed");
            this.radius = this.GetSpecialValueFor("radius");
            this.damage_per_second = this.GetSpecialValueFor("damage_per_second");
            this.pass_damage = this.GetSpecialValueFor("pass_damage");
            this.damage_interval = this.GetSpecialValueFor("damage_interval");
            this.break_distance = this.GetSpecialValueFor("break_distance");
            this.mana_per_second = this.GetSpecialValueFor("mana_per_second");
            this.observe_tick_scale = this.GetSpecialValueFor("observe_tick_scale");
            this.observe_max_scale = this.GetSpecialValueFor("observe_max_scale");
        } else if (!this.GetAbilityPlus() && IsServer()) {
            this.speed = params.speed;
            this.radius = params.radius;
            this.damage_per_second = params.damage_per_second;
            this.pass_damage = params.pass_damage;
            this.damage_interval = params.damage_interval;
            this.break_distance = params.break_distance;
            this.mana_per_second = params.mana_per_second;
            this.observe_tick_scale = params.observe_tick_scale;
            this.observe_max_scale = params.observe_max_scale;
        }
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
            this.effect_name = "particles/units/heroes/hero_shredder/shredder_chakram_return.vpcf";
            /**   if (Wearables.GetWearable(this.GetCasterPlus(), "models/items/shredder/timbersaw_ti9_immortal_offhand/timbersaw_ti9_immortal_offhand")) {
                  this.effect_name = "particles/econ/items/timbersaw/timbersaw_ti9/timbersaw_ti9_chakram_return.vpcf";
              } else */
            if (this.GetAbilityPlus().GetAbilityName() == "imba_timbersaw_chakram_2") {
                this.effect_name = "particles/econ/items/shredder/hero_shredder_icefx/shredder_chakram_return_ice.vpcf";
            }
        } else {
            this.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
        }
        this.GetParentPlus().EmitSound("Hero_Shredder.Chakram");
        if (params.bAutoCastState && params.bAutoCastState == 1) {
        } else {
        }
        this.interval = this.damage_interval;
        this.stay_effect = "particles/units/heroes/hero_shredder/shredder_chakram_stay.vpcf";
        // if (Wearables.GetWearable(this.GetCasterPlus(), "models/items/shredder/timbersaw_ti9_immortal_offhand/timbersaw_ti9_immortal_offhand")) {
        //     this.stay_effect = "particles/econ/items/timbersaw/timbersaw_ti9_gold/timbersaw_ti9_chakram_gold_stay.vpcf";
        // }
        this.chakram_particle = ResHelper.CreateParticleEx(this.stay_effect, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        if (this.GetAbilityPlus()) {
            if (this.GetAbilityPlus().GetAbilityName() == "imba_timbersaw_chakram") {
                if (this.GetAbilityPlus().GetAutoCastState()) {
                    this.GetParentPlus().TempData().bTimberChainTarget = true;
                    ParticleManager.SetParticleControl(this.chakram_particle, 15, Vector(255, 255, 255));
                    ParticleManager.SetParticleControl(this.chakram_particle, 16, Vector(1, 0, 0));
                } else {
                    ParticleManager.SetParticleControl(this.chakram_particle, 16, Vector(0, 0, 0));
                }
            } else if (this.GetAbilityPlus().GetAbilityName() == "imba_timbersaw_chakram_2") {
                if (this.GetAbilityPlus().GetAutoCastState()) {
                    this.GetParentPlus().TempData().bTimberChainTarget = true;
                    ParticleManager.SetParticleControl(this.chakram_particle, 15, Vector(128, 128, 255));
                    ParticleManager.SetParticleControl(this.chakram_particle, 60, Vector(255, 255, 255));
                    ParticleManager.SetParticleControl(this.chakram_particle, 61, Vector(1, 0, 0));
                } else {
                    ParticleManager.SetParticleControl(this.chakram_particle, 15, Vector(0, 0, 255));
                }
                ParticleManager.SetParticleControl(this.chakram_particle, 16, Vector(1, 0, 0));
            }
        }
        this.AddParticle(this.chakram_particle, false, false, -1, false, false);
        this.StartIntervalThink(this.interval);
    }
    OnIntervalThink(): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        if (!this.dendrophobia_modifier || this.dendrophobia_modifier.IsNull()) {
            this.dendrophobia_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_timbersaw_chakram_3", this.GetCasterPlus());
        }
        if (this.dendrophobia_modifier) {
            this.dendrophobia_modifier.SetStackCount(this.dendrophobia_modifier.GetStackCount() + GameFunc.GetCount(GridNav.GetAllTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus().GetHullRadius(), false)));
        }
        GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus().GetHullRadius(), true);
        if (this.interval == this.damage_interval || (this.interval != this.damage_interval && this.counter >= this.damage_interval)) {
            if (this.GetCasterPlus().GetMana() >= this.mana_per_second && (this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() <= this.break_distance) {
                this.GetCasterPlus().ReduceMana(this.mana_per_second);
                for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                    ApplyDamage({
                        victim: enemy,
                        damage: this.damage_per_second * (1 + math.min(this.observe_tick_scale * (this.GetElapsedTime() / this.damage_interval) * 0.01, this.observe_max_scale * 0.01)),
                        damage_type: this.damage_type,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus()
                    });
                }
            } else {
                this.Destroy();
            }
            if (this.counter) {
                this.counter = 0;
            }
        } else if (this.counter) {
            this.counter = this.counter + this.interval;
        }
        if (this.counter != undefined) {
            this.GetParentPlus().SetOrigin(RotatePosition(this.cast_pos, QAngle(0, this.angle * this.interval, 0), this.GetParentPlus().GetOrigin()));
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Shredder.Chakram");
        EmitSoundOnLocationWithCaster(this.GetParentPlus().GetAbsOrigin(), "Hero_Shredder.Chakram.Return", this.GetCasterPlus());
        this.GetParentPlus().InterruptMotionControllers(true);
        if (this.GetAbilityPlus()) {
            let ExtraData = {
                bReturning: true,
                id: GameRules.GetGameTime()
            }
            let chakram_projectile = ProjectileManager.CreateTrackingProjectile({
                Target: this.GetCasterPlus(),
                Source: this.GetParentPlus(),
                Ability: this.GetAbilityPlus(),
                EffectName: this.effect_name || "particles/units/heroes/hero_shredder/shredder_chakram_return.vpcf",
                iMoveSpeed: this.speed,
                vSourceLoc: this.GetParentPlus().GetAbsOrigin(),
                bDrawsOnMinimap: false,
                bDodgeable: false,
                bIsAttack: false,
                bVisibleToEnemies: true,
                bReplaceExisting: false,
                bProvidesVision: false,
                ExtraData: ExtraData
            });
            this.GetAbilityPlus<imba_timbersaw_chakram_2>().projectiles[GameRules.GetGameTime() + ""] = ExtraData;
        }
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION,
            3: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        return 300;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        return 300;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetCasterPlus() && this.GetAbilityPlus() && keys.ability.GetAssociatedPrimaryAbilities() == this.GetAbilityPlus().GetAbilityName()) {
            this.Destroy();
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return true;
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
        return "modifier_imba_timbersaw_chakram_debuff";
    }
}
@registerModifier()
export class modifier_imba_timbersaw_chakram_thinker_aura extends BaseModifier_Plus {
}
@registerModifier()
export class modifier_imba_timbersaw_chakram_debuff extends BaseModifier_Plus {
    public slow: any;
    public slow_health_percentage: any;
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.slow = this.GetSpecialValueFor("slow");
            this.slow_health_percentage = this.GetSpecialValueFor("slow_health_percentage");
        } else {
            this.slow = 0;
            this.slow_health_percentage = 0;
        }
        if (!IsServer()) {
            return;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return math.ceil((this.GetParentPlus().GetHealthPercent() - 100) / this.slow_health_percentage) * this.slow;
    }
}
@registerModifier()
export class modifier_imba_timbersaw_chakram_disarm extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (!IsServer()) {
            return;
        }
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        };
    }
}
@registerAbility()
export class imba_timbersaw_return_chakram extends BaseAbility_Plus {
    public responses: any;
    public response_keys: string[];
    public random_selection: any;
    public chakram_ability: imba_timbersaw_chakram;
    public effect_name: any;
    GetAssociatedPrimaryAbilities(): string {
        return "imba_timbersaw_chakram";
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    IsStealable(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (this.GetCasterPlus().GetUnitName().includes("shredder")) {
            if (!this.responses) {
                this.responses = {
                    ["shredder_timb_chakramreturn_03"]: 0,
                    ["shredder_timb_chakramreturn_04"]: 0,
                    ["shredder_timb_chakramreturn_05"]: 0
                }
                this.response_keys = Object.keys(this.responses);

            }
            this.random_selection = RandomInt(1, GameFunc.GetCount(this.response_keys));
            if (GameRules.GetDOTATime(true, true) - this.responses[this.response_keys[this.random_selection]] >= 5) {
                this.GetCasterPlus().EmitSound(this.response_keys[this.random_selection]);
                this.responses[this.response_keys[this.random_selection]] = GameRules.GetDOTATime(true, true);
            }
        }
        if (!this.chakram_ability) {
            this.chakram_ability = this.GetCasterPlus().findAbliityPlus<imba_timbersaw_chakram>("imba_timbersaw_chakram");
        }
        if (this.chakram_ability && this.chakram_ability.projectiles) {
            for (const [_, data] of GameFunc.Pair(this.chakram_ability.projectiles)) {
                let pid = GToNumber(_) as ProjectileID;
                if (ProjectileManager.GetLinearProjectileLocation(pid) && ProjectileManager.GetLinearProjectileRadius(pid) == this.chakram_ability.GetSpecialValueFor("radius")) {
                    let ExtraData = {
                        bReturning: true,
                        id: GameRules.GetGameTime()
                    }
                    if (!this.effect_name) {
                        this.effect_name = "particles/units/heroes/hero_shredder/shredder_chakram_return.vpcf";
                        // if (Wearables.GetWearable(this.GetCasterPlus(), "models/items/shredder/timbersaw_ti9_immortal_offhand/timbersaw_ti9_immortal_offhand")) {
                        //     this.effect_name = "particles/econ/items/timbersaw/timbersaw_ti9/timbersaw_ti9_chakram_return.vpcf";
                        // }
                    }
                    let chakram_projectile = ProjectileManager.CreateTrackingProjectile({
                        Target: this.GetCasterPlus(),
                        Source: undefined,
                        Ability: this.chakram_ability,
                        EffectName: this.effect_name,
                        iMoveSpeed: this.chakram_ability.GetSpecialValueFor("speed"),
                        vSourceLoc: ProjectileManager.GetLinearProjectileLocation(pid),
                        bDrawsOnMinimap: false,
                        bDodgeable: false,
                        bIsAttack: false,
                        bVisibleToEnemies: true,
                        bReplaceExisting: false,
                        bProvidesVision: false,
                        ExtraData: ExtraData
                    });
                    this.chakram_ability.projectiles[GameRules.GetGameTime()] = ExtraData;
                    ProjectileManager.DestroyLinearProjectile(pid);
                    delete this.chakram_ability.projectiles[_];
                }
            }
        }
    }
}
@registerAbility()
export class imba_timbersaw_return_chakram_2 extends BaseAbility_Plus {
    public responses: any;
    public response_keys: string[];
    public random_selection: any;
    public chakram_ability: any;
    public effect_name: any;
    GetAssociatedPrimaryAbilities(): string {
        return "imba_timbersaw_chakram_2";
    }
    IsStealable(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (this.GetCasterPlus().GetUnitName().includes("shredder")) {
            if (!this.responses) {
                this.responses = {
                    ["shredder_timb_chakramreturn_03"]: 0,
                    ["shredder_timb_chakramreturn_04"]: 0,
                    ["shredder_timb_chakramreturn_05"]: 0
                }
                this.response_keys = Object.keys(this.responses);
            }
            this.random_selection = RandomInt(1, GameFunc.GetCount(this.response_keys));
            if (GameRules.GetDOTATime(true, true) - this.responses[this.response_keys[this.random_selection]] >= 5) {
                this.GetCasterPlus().EmitSound(this.response_keys[this.random_selection]);
                this.responses[this.response_keys[this.random_selection]] = GameRules.GetDOTATime(true, true);
            }
        }
        if (!this.chakram_ability) {
            this.chakram_ability = this.GetCasterPlus().findAbliityPlus<imba_timbersaw_chakram_2>("imba_timbersaw_chakram_2");
        }
        if (this.chakram_ability) {
            for (const [_, data] of GameFunc.iPair(this.chakram_ability.projectiles)) {
                const pid = GToNumber(_) as ProjectileID;
                if (ProjectileManager.GetLinearProjectileLocation(pid) && ProjectileManager.GetLinearProjectileRadius(pid) == this.chakram_ability.GetSpecialValueFor("radius")) {
                    let ExtraData = {
                        bReturning: true,
                        id: GameRules.GetGameTime()
                    }
                    if (!this.effect_name) {
                        this.effect_name = "particles/econ/items/shredder/hero_shredder_icefx/shredder_chakram_return_ice.vpcf";
                        // if (Wearables.GetWearable(this.GetCasterPlus(), "models/items/shredder/timbersaw_ti9_immortal_offhand/timbersaw_ti9_immortal_offhand")) {
                        //     this.effect_name = "particles/econ/items/timbersaw/timbersaw_ti9/timbersaw_ti9_chakram_return.vpcf";
                        // }
                    }
                    let chakram_projectile = ProjectileManager.CreateTrackingProjectile({
                        Target: this.GetCasterPlus(),
                        Source: undefined,
                        Ability: this.chakram_ability,
                        EffectName: this.effect_name,
                        iMoveSpeed: this.chakram_ability.GetSpecialValueFor("speed"),
                        vSourceLoc: ProjectileManager.GetLinearProjectileLocation(pid),
                        bDrawsOnMinimap: false,
                        bDodgeable: false,
                        bIsAttack: false,
                        bVisibleToEnemies: true,
                        bReplaceExisting: false,
                        bProvidesVision: false,
                        ExtraData: ExtraData
                    });
                    this.chakram_ability.projectiles[GameRules.GetGameTime()] = ExtraData;
                    ProjectileManager.DestroyLinearProjectile(pid);
                    delete this.chakram_ability.projectiles[_];
                }
            }
        }
    }
}
@registerAbility()
export class imba_timbersaw_chakram_3 extends BaseAbility_Plus {
    public projectiles: { [k: string]: any };
    public dendrophobia_modifier: any;
    IsInnateAbility() {
        return true;
    }
    IsStealable(): boolean {
        return false;
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target) + math.max(this.GetCasterPlus().findBuffStack("modifier_imba_timbersaw_chakram_3", this.GetCasterPlus()) - this.GetSpecialValueFor("trees_to_activate"), 0);
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_timbersaw_chakram_3";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector)
        }
        if (!this.projectiles) {
            this.projectiles = {}
        }
        this.GetCasterPlus().EmitSound("Hero_Shredder.Chakram.Cast");
        let ExtraData = {
            cast_pos_x: this.GetCasterPlus().GetAbsOrigin().x,
            cast_pos_y: this.GetCasterPlus().GetAbsOrigin().y,
            cast_pos_z: this.GetCasterPlus().GetAbsOrigin().z,
            bAutoCastState: this.GetAutoCastState()
        }
        let chakram_projectile = ProjectileManager.CreateLinearProjectile({
            Source: this.GetCasterPlus(),
            Ability: this,
            vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
            // bDeleteOnHit: false,
            EffectName: "particles/econ/items/timbersaw/timbersaw_ti9_gold/timbersaw_ti9_chakram_gold.vpcf",
            fDistance: this.GetCastRange(this.GetCursorPosition(), this.GetCasterPlus()) + this.GetCasterPlus().GetCastRangeBonus(),
            vVelocity: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * this.GetSpecialValueFor("speed") * Vector(1, 1, 0) as Vector,
            fStartRadius: this.GetSpecialValueFor("radius"),
            fEndRadius: this.GetSpecialValueFor("radius"),
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            bHasFrontalCone: false,
            // bReplaceExisting: false,
            fExpireTime: GameRules.GetGameTime() + 10.0,
            bProvidesVision: false,
            ExtraData: ExtraData
        });
        this.projectiles[chakram_projectile + ""] = ExtraData;
    }
    OnProjectileThinkHandle(projectileHandle: ProjectileID): void {
        if (GameFunc.GetCount(GridNav.GetAllTreesAroundPoint(ProjectileManager.GetLinearProjectileLocation(projectileHandle), this.GetSpecialValueFor("radius"), true)) >= 1) {
            for (const [_, tree] of GameFunc.iPair(GridNav.GetAllTreesAroundPoint(ProjectileManager.GetLinearProjectileLocation(projectileHandle), this.GetSpecialValueFor("radius"), false))) {
                EmitSoundOnLocationWithCaster(tree.GetAbsOrigin(), "Hero_Shredder.Chakram.Tree", this.GetCasterPlus());
            }
            if (!this.dendrophobia_modifier || this.dendrophobia_modifier.IsNull()) {
                this.dendrophobia_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_timbersaw_chakram_3", this.GetCasterPlus());
            }
            if (this.dendrophobia_modifier) {
                this.dendrophobia_modifier.SetStackCount(this.dendrophobia_modifier.GetStackCount() + GameFunc.GetCount(GridNav.GetAllTreesAroundPoint(ProjectileManager.GetLinearProjectileLocation(projectileHandle), this.GetSpecialValueFor("radius"), false)));
            }
            GridNav.DestroyTreesAroundPoint(ProjectileManager.GetLinearProjectileLocation(projectileHandle), this.GetSpecialValueFor("radius"), false);
        }
    }
    OnProjectileHitHandle(target: IBaseNpc_Plus, location: Vector, projectileHandle: ProjectileID) {
        if (target && target != this.GetCasterPlus()) {
            target.EmitSound("Hero_Shredder.Chakram.Target");
            ApplyDamage({
                victim: target,
                damage: this.GetSpecialValueFor("pass_damage"),
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            });
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_timbersaw_chakram_debuff", {
                duration: this.GetSpecialValueFor("pass_slow_duration") * (1 - target.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_imba_timbersaw_chakram_3 extends BaseModifier_Plus {
    OnStackCountChanged(stackCount: number): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus() && this.GetAbilityPlus().IsTrained() && this.GetStackCount() >= this.GetSpecialValueFor("trees_to_activate") && this.GetAbilityPlus().IsHidden()) {
            this.GetAbilityPlus().SetHidden(false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetSpecialValueFor("trees_to_activate");
    }
}
@registerModifier()
export class modifier_special_bonus_imba_timbersaw_reactive_armor_max_stacks extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_timbersaw_whirling_death_stat_loss_pct extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_timbersaw_timber_chain_range extends BaseModifier_Plus {
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
