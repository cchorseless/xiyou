
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";


function UpgradeBeastsSummons(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus) {
    let hawk_ability = "imba_beastmaster_summon_hawk";
    let boar_ability = "imba_beastmaster_summon_boar";
    let hawk_ability_handler;
    let boar_ability_handler;
    let raze_far_handler;
    if (caster.HasAbility(hawk_ability)) {
        hawk_ability_handler = caster.FindAbilityByName(hawk_ability);
    }
    if (caster.HasAbility(boar_ability)) {
        boar_ability_handler = caster.FindAbilityByName(boar_ability);
    }
    let leveled_ability_level = ability.GetLevel();
    if (hawk_ability_handler && hawk_ability_handler.GetLevel() < leveled_ability_level) {
        hawk_ability_handler.SetLevel(leveled_ability_level);
    }
    if (boar_ability_handler && boar_ability_handler.GetLevel() < leveled_ability_level) {
        boar_ability_handler.SetLevel(leveled_ability_level);
    }
}
@registerAbility()
export class imba_beastmaster_wild_axes extends BaseAbility_Plus {
    hitUnits: EntityIndex[];
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorPosition();
        let distance = GFuncVector.CalculateDistance(caster, target);
        let direction = GFuncVector.CalculateDirection(target, caster);
        let amp = this.GetTalentSpecialValueFor("duration");
        let radius = this.GetTalentSpecialValueFor("radius");
        let damage = this.GetTalentSpecialValueFor("axe_damage");
        let speed = math.max(1200, distance);
        this.hitUnits = [];
        caster.EmitSound("Hero_Beastmaster.Wild_Axes");
        // let ProjectileHit = GHandler.create(this, (pj: ISimpleLineProjectile, enemy: IBaseNpc_Plus) => {
        //     if (!enemy) {
        //         return;
        //     }
        //     if ((!enemy.IsMagicImmune()) &&
        //         (!enemy.IsInvulnerable()) && enemy.GetTeam() != this.GetCasterPlus().GetTeam()) {
        //         if (!this.hitUnits.includes(enemy.entindex())) {
        //             if (!enemy.TriggerSpellAbsorb(this)) {
        //                 if (this.GetCasterPlus().HasScepter()) {
        //                     this.GetCasterPlus().PerformAbilityAttack(enemy, true, this, damage, undefined, true);
        //                 } else {
        //                     this.DealDamage(this.GetCasterPlus(), enemy, damage);
        //                 }
        //                 enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_beastmaster_wild_axes", {
        //                     duration: amp
        //                 });
        //                 EmitSoundOn("Hero_Beastmaster.Wild_Axes_Damage", enemy);
        //             }
        //             this.hitUnits.push(enemy.entindex());
        //         }
        //     }
        // });
        // let length = distance;

        // let ProjectileThink = GHandler.create(this, (pj: ISimpleLineProjectile) => {
        //     let velocity = pj.GetVelocity();
        //     let offset = 150 * (length / 656) * math.sin(2 * math.pi * pj.extraData.lifetime * (656 / length));
        //     pj.distanceTraveled = pj.distanceTraveled + speed * FrameTime();
        //     let position;
        //     let nextPos;
        //     if (pj.distanceTraveled > length) {
        //         position = pj.extraData.end_position + GFuncVector.CalculateDirection(this.GetCasterPlus().GetAbsOrigin(), pj.extraData.end_position) * (pj.distanceTraveled - length);
        //         pj.extraData.lifetime = pj.extraData.lifetime - FrameTime();
        //         nextPos = pj.extraData.end_position + GFuncVector.CalculateDirection(this.GetCasterPlus().GetAbsOrigin(), pj.extraData.end_position) * ((pj.distanceTraveled + pj.GetSpeed() * FrameTime()) - length);
        //     } else {
        //         position = pj.extraData.original_position + pj.extraData.direction * pj.distanceTraveled;
        //         pj.extraData.lifetime = pj.extraData.lifetime + FrameTime();
        //         nextPos = pj.extraData.original_position + pj.extraData.direction * (pj.distanceTraveled + pj.GetSpeed() * FrameTime());
        //     }
        //     let offset2 = 150 * (length / 656) * math.sin(2 * math.pi * pj.extraData.lifetime * (656 / length));
        //     let offsetVect = pj.extraData.state * GetPerpendicularVector(pj.extraData.direction) * offset;
        //     let offsetVect2 = pj.extraData.state * GetPerpendicularVector(pj.extraData.direction) * offset;
        //     let calcPos = position + offsetVect;
        //     let calcNexPos = nextPos + offsetVect2;
        //     pj.SetVelocity(GFuncVector.CalculateDirection(calcNexPos, calcPos) * pj.GetSpeed() as Vector);
        //     GridNav.DestroyTreesAroundPoint(calcPos, 175, true);
        //     pj.SetPosition(calcPos);
        // })
        // let position = caster.GetAbsOrigin();

        // let pinfo = {
        //     FX: "particles/units/heroes/hero_beastmaster/beastmaster_wildaxe.vpcf",
        //     position: position,
        //     caster: this.GetCasterPlus(),
        //     ability: this,
        //     original_position: position,
        //     speed: speed,
        //     radius: radius,
        //     direction: direction,
        //     velocity: -direction * speed as Vector,
        //     distance: distance * 2,
        //     range: radius,
        //     damage: damage,
        //     distanceTraveled: 0,
        //     lifetime: 0,
        //     state: -1,
        //     end_position: target
        // }
        // ProjectileHelper.LineProjectiles.SimpleLineProjectile.CreateOne(pinfo);
        // ProjectileHandler.CreateProjectile(ProjectileThink, ProjectileHit, {
        //     FX: "particles/units/heroes/hero_beastmaster/beastmaster_wildaxe.vpcf",
        //     position: position,
        //     caster: this.GetCasterPlus(),
        //     original_position: position,
        //     end_position: target,
        //     ability: this,
        //     speed: speed,
        //     radius: radius,
        //     direction: direction,
        //     velocity: -direction * speed,
        //     length: distance,
        //     distance: distance * 2,
        //     hitUnits: {},
        //     range: radius,
        //     damage: damage,
        //     lifetime: 0,
        //     distanceTraveled: 0,
        //     state: 1,
        //     amp: amp
        // });
    }
}
@registerModifier()
export class modifier_imba_beastmaster_wild_axes extends BaseModifier_Plus {
    public amp: any;
    public talent: any;
    public talent_ally: any;
    BeCreated(p_0: any,): void {
        this.amp = this.GetTalentSpecialValueFor("damage_amp");
        this.talent = this.GetCasterPlus().HasTalent("special_bonus_unique_imba_beastmaster_wild_axes_2");
        this.talent_ally = this.GetCasterPlus().GetTalentValue("special_bonus_unique_imba_beastmaster_wild_axes_2");
        this.SetStackCount(1);
    }
    BeRefresh(p_0: any,): void {
        this.amp = this.GetTalentSpecialValueFor("damage_amp");
        this.talent = this.GetCasterPlus().HasTalent("special_bonus_unique_imba_beastmaster_wild_axes_2");
        this.talent_ally = this.GetCasterPlus().GetTalentValue("special_bonus_unique_imba_beastmaster_wild_axes_2") / 100;
        this.IncrementStackCount();
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            3: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(params: ModifierAttackEvent): number {
        if (params.attacker == this.GetCasterPlus()) {
            return this.amp * this.GetStackCount();
        } else if (this.talent && params.attacker.GetTeam() == (this.GetCasterPlus().GetTeam())) {
            return this.amp * this.GetStackCount() * this.talent_ally;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(params: ModifierAttackEvent): void {
        if (this.GetCasterPlus().HasModifier("modifier_cotw_hawk_spirit") && params.attacker.GetTeam() == (this.GetCasterPlus().GetTeam()) && params.target == this.GetParentPlus()) {
            params.attacker.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_beastmaster_wild_axes_hawk", {
                duration: params.attacker.GetSecondsPerAttack() + 0.1
            }).SetStackCount(this.amp * this.GetStackCount());
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (this.GetCasterPlus().HasModifier("modifier_cotw_boar_spirit") &&
            params.attacker.GetTeam() == this.GetCasterPlus().GetTeam() &&
            params.unit == this.GetParentPlus() &&
            ((params.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK && !params.inflictor) ||
                GameFunc.HasBit(params.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_PROPERTY_FIRE)) &&
            params.attacker.GetHealth() > 0 && !params.attacker.IsIllusion()) {
            let flHeal = params.damage * (this.amp * this.GetStackCount() / 100);
            (params.attacker as IBaseNpc_Plus).ApplyHeal(flHeal, this.GetAbilityPlus());
            let lifesteal = ResHelper.CreateParticleEx("particles/units/heroes/hero_skeletonking/wraith_king_vampiric_aura_lifesteal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, params.attacker);
            ParticleManager.SetParticleControlEnt(lifesteal, 0, params.attacker, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", params.attacker.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(lifesteal, 1, params.attacker, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", params.attacker.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(lifesteal);
        }
    }
}
@registerModifier()
export class modifier_imba_beastmaster_wild_axes_hawk extends BaseModifier_Plus {
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
@registerAbility()
export class imba_beastmaster_call_of_the_wild extends BaseAbility_Plus { }

@registerAbility()
export class imba_beastmaster_hawk_dive extends BaseAbility_Plus { }

@registerAbility()
export class imba_beastmaster_inner_beast extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_beastmaster_inner_beast";
    }
}
@registerModifier()
export class modifier_imba_beastmaster_inner_beast extends BaseModifier_Plus {
    GetAuraDuration(): number {
        return 1.0;
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL;
    }
    GetModifierAura(): string {
        return "modifier_imba_beastmaster_inner_beast_allies";
    }
    IsAura(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_beastmaster_inner_beast_allies extends BaseModifier_Plus {
    public cdr: any;
    public amp: any;
    public as: any;
    public hp: any;
    public hpr: any;
    public ms: any;
    public vis: any;
    Init(p_0: any,): void {
        this.cdr = this.GetTalentSpecialValueFor("bonus_cdr");
        if (this.GetCasterPlus().HasTalent("special_bonus_unique_imba_beastmaster_inner_beast_1")) {
            this.amp = this.GetTalentSpecialValueFor("bonus_cdr");
        }
        this.as = this.GetTalentSpecialValueFor("bonus_attackspeed");
        this.hp = this.GetTalentSpecialValueFor("boar_bonus_health");
        this.hpr = this.GetTalentSpecialValueFor("boar_bonus_regen");
        this.ms = this.GetTalentSpecialValueFor("hawk_bonus_ms");
        this.vis = this.GetTalentSpecialValueFor("hawk_bonus_vision");
    }


    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,
            6: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
            7: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        return this.cdr;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.as;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS_PERCENTAGE)
    CC_GetModifierExtraHealthBonusPercentage() {
        if (this.GetCasterPlus().HasModifier("modifier_cotw_boar_spirit")) {
            return this.hp;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.GetCasterPlus().HasModifier("modifier_cotw_boar_spirit")) {
            return this.hpr;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetCasterPlus().HasModifier("modifier_cotw_hawk_spirit")) {
            return this.ms;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        if (this.GetCasterPlus().HasModifier("modifier_cotw_hawk_spirit")) {
            return this.vis;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        if (this.GetCasterPlus().HasModifier("modifier_cotw_hawk_spirit")) {
            return this.vis;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.amp;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_beastmaster_primal_roar extends BaseAbility_Plus {
    IsStealable(): boolean {
        return true;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let point = this.GetCursorPosition();
        let nfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_beastmaster/beastmaster_primal_roar.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
        ParticleManager.SetParticleControlEnt(nfx, 0, caster, ParticleAttachment_t.PATTACH_POINT, "attach_hitloc", caster.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(nfx, 1, point);
        ParticleManager.ReleaseParticleIndex(nfx);
        EmitSoundOn("Hero_Beastmaster.Primal_Roar", caster);
        let damage = this.GetTalentSpecialValueFor("damage");
        let pushDur = this.GetTalentSpecialValueFor("push_duration");
        let pushDist = this.GetTalentSpecialValueFor("push_distance");
        let stunDur = this.GetTalentSpecialValueFor("stun_duration");
        let totDur = stunDur + this.GetTalentSpecialValueFor("slow_duration");
        let units = AoiHelper.FindAllUnitsInLine(caster.GetTeam(), caster.GetAbsOrigin(), point, this.GetTalentSpecialValueFor("width"));
        for (const [_, unit] of GameFunc.iPair(units)) {
            if (unit.GetTeam() != (caster.GetTeam())) {
                if (unit.TriggerSpellAbsorb(this)) {
                    this.DealDamage(caster, unit, damage, {}, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE);
                    unit.ApplyKnockBack(this, caster, {
                        direction_x: caster.GetAbsOrigin().x - unit.GetAbsOrigin().x,
                        direction_y: caster.GetAbsOrigin().y - unit.GetAbsOrigin().y,
                        duration: pushDur,
                        IsStun: true,
                        distance: pushDist,
                    });
                    this.AddTimer(pushDur, () => {
                        unit.ApplyStunned(this, caster, stunDur)
                    });
                    unit.AddNewModifier(caster, this, "modifier_imba_beastmaster_primal_roar_slow", {
                        Duration: totDur
                    });
                    if (caster.HasTalent("special_bonus_unique_imba_beastmaster_primal_roar_2")) {
                        unit.ApplyDaze(this, caster, totDur);
                    }
                }
            }
            else if (this.GetCasterPlus().HasModifier("modifier_cotw_hawk_spirit")) {
                unit.ApplyHeal(damage, this);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_beastmaster_primal_roar_slow extends BaseModifier_Plus {
    public slow: number;
    public mr: number;
    public armor: number;
    Init(p_0: any,): void {
        this.slow = this.GetTalentSpecialValueFor("slow");
        this.mr = undefined;
        this.armor = undefined;
        if (this.GetCasterPlus().HasModifier("modifier_cotw_hawk_spirit")) {
            this.mr = this.GetTalentSpecialValueFor("hawk_mr");
            this.armor = this.GetTalentSpecialValueFor("hawk_armor");
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.mr;
    }
}






@registerAbility()
export class imba_beastmaster_summon_hawk extends BaseAbility_Plus {
    public hawk: any;
    OnUpgrade(): void {
        UpgradeBeastsSummons(this.GetCasterPlus(), this);
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let hawk_name = "npc_imba_dota_beastmaster_hawk_";
            let hawk_level = this.GetLevel();
            let spawn_point = caster.GetAbsOrigin();
            let spawn_particle = "particles/units/heroes/hero_beastmaster/beastmaster_call_bird.vpcf";
            let response = "beastmaster_beas_ability_summonsbird_0";
            let hawk_duration = this.GetSpecialValueFor("hawk_duration");
            caster.EmitSound(response + RandomInt(1, 5));
            caster.EmitSound("Hero_Beastmaster.Call.Hawk");
            let spawn_particle_fx = ResHelper.CreateParticleEx(spawn_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(spawn_particle_fx, 0, spawn_point);
            this.hawk = BaseNpc_Plus.CreateUnitByName(hawk_name + hawk_level, spawn_point, caster, false);
            this.hawk.AddNewModifier(caster, this, "modifier_imba_beastmaster_hawk", {});
            this.hawk.AddNewModifier(caster, this, "modifier_kill", {
                duration: hawk_duration
            });
            this.hawk.SetControllableByPlayer(caster.GetPlayerID(), true);
        }
        let hawk_speed = this.GetSpecialValueFor("hawk_speed_tooltip");
        this.hawk.SetBaseMoveSpeed(hawk_speed);
    }
}
@registerModifier()
export class modifier_imba_beastmaster_hawk extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            let invis_ability = parent.findAbliityPlus<imba_beastmaster_hawk_invis>("imba_beastmaster_hawk_invis");
            invis_ability.SetLevel(ability.GetLevel());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: MODIFIER_PROPERTY_MOVESPEED_MAX
        }
        return Object.values(decFuncs);
    } */
    GetModifierMoveSpeed_Max() {
        return 1200;
    }
}
@registerAbility()
export class imba_beastmaster_hawk_invis extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_hawk_invis_handler";
    }
}
@registerModifier()
export class modifier_imba_hawk_invis_handler extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            ability.StartCooldown(ability.GetSpecialValueFor("fade_time"));
            this.StartIntervalThink(0.2);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            let fade_time = ability.GetSpecialValueFor("fade_time");
            if (ability.IsCooldownReady()) {
                if (!parent.HasModifier("modifier_imba_hawk_invis")) {
                    parent.AddNewModifier(parent, ability, "modifier_imba_hawk_invis", {});
                }
            } else if (parent.HasModifier("modifier_imba_hawk_invis")) {
                parent.RemoveModifierByName("modifier_imba_hawk_invis");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_UNIT_MOVED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_UNIT_MOVED)
    CC_OnUnitMoved(keys: ModifierUnitEvent): void {
        if (IsServer()) {
            if (keys.unit == this.GetParentPlus()) {
                let ability = this.GetAbilityPlus();
                let fade_time = ability.GetSpecialValueFor("fade_time");
                if (ability.GetCooldownTimeRemaining() < fade_time * 0.9) {
                    ability.StartCooldown(fade_time);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_hawk_invis extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        let particle = ResHelper.CreateParticleEx("particles/generic_hero_status/status_invisibility_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(particle);
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        if (IsClient()) {
            return 1;
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            let state = {
                [modifierstate.MODIFIER_STATE_INVISIBLE]: true
            }
            return state;
        }
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
}
@registerAbility()
export class imba_beastmaster_summon_boar extends BaseAbility_Plus {
    OnUpgrade(): void {
        UpgradeBeastsSummons(this.GetCasterPlus(), this);
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let boar_name = "npc_imba_dota_beastmaster_boar_";
            let boar_level = this.GetLevel();
            let spawn_point = caster.GetAbsOrigin();
            let spawn_particle = "particles/units/heroes/hero_beastmaster/beastmaster_call_boar.vpcf";
            let response = "beastmaster_beas_ability_summonsboar_0";
            let boar_duration = this.GetSpecialValueFor("boar_duration");
            caster.EmitSound(response + RandomInt(1, 5));
            caster.EmitSound("Hero_Beastmaster.Call.Boar");
            let spawn_particle_fx = ResHelper.CreateParticleEx(spawn_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(spawn_particle_fx, 0, spawn_point);
            let boar_count = 1;
            if (caster.HasAbility("special_bonus_imba_unique_beastmaster_2")) {
                let talent_handler = caster.findAbliityPlus("special_bonus_imba_unique_beastmaster_2");
                if (talent_handler && talent_handler.GetLevel() > 0) {
                    let additional_boars = talent_handler.GetSpecialValueFor("value");
                    if (additional_boars) {
                        boar_count = boar_count + additional_boars;
                    }
                }
            }
            for (let i = 0; i < boar_count; i++) {
                let boar = BaseNpc_Plus.CreateUnitByName(boar_name + boar_level, spawn_point, caster, true);
                boar.AddNewModifier(caster, this, "modifier_imba_beastmaster_boar", {});
                boar.AddNewModifier(caster, this, "modifier_kill", {
                    duration: boar_duration
                });
                boar.SetControllableByPlayer(caster.GetPlayerID(), true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_beastmaster_boar extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            let poison_ability = parent.findAbliityPlus<imba_beastmaster_boar_poison>("imba_beastmaster_boar_poison");
            poison_ability.SetLevel(ability.GetLevel());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: MODIFIER_PROPERTY_MOVESPEED_MAX
        }
        return Object.values(decFuncs);
    } */
    BeDestroy(): void {
        if (IsServer()) {
            this.GetParentPlus().EmitSound("Hero_Beastmaster_Boar.Death");
            this.GetParentPlus().ForceKill(false);
        }
    }
}
@registerAbility()
export class imba_beastmaster_boar_poison extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_boar_poison";
    }
}
@registerModifier()
export class modifier_imba_boar_poison extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = params.target;
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            let duration = ability.GetSpecialValueFor("duration");
            if ((parent == params.attacker)) {
                if ((target.IsCreep() || target.IsRealUnit()) && !target.IsBuilding()) {
                    target.AddNewModifier(parent, ability, "modifier_imba_boar_poison_debuff", {
                        duration: duration * (1 - target.GetStatusResistance())
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_boar_poison_debuff extends BaseModifier_Plus {
    public movespeed_slow: number;
    public attackspeed_slow: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        let ability = this.GetAbilityPlus();
        this.movespeed_slow = ability.GetSpecialValueFor("movespeed_slow");
        this.attackspeed_slow = ability.GetSpecialValueFor("attackspeed_slow");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movespeed_slow * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attackspeed_slow * (-1);
    }
}
