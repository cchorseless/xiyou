import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_no_health_bar } from "../../../modifier/modifier_no_health_bar";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_ember_spirit_1 } from "./ability1_ember_spirit_searing_chains";
/** dota原技能数据 */
export const Data_ember_spirit_sleight_of_fist = { "ID": "5604", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilityCastRange": "700", "AbilityCastPoint": "0", "FightRecapLevel": "1", "AbilityCooldown": "18 14 10 6", "AbilityManaCost": "50", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "250 350 450 550" }, "02": { "var_type": "FIELD_INTEGER", "bonus_hero_damage": "40 80 120 160", "LinkedSpecialBonus": "special_bonus_unique_ember_spirit_6", "CalculateSpellDamageTooltip": "0" }, "03": { "var_type": "FIELD_FLOAT", "attack_interval": "0.2" }, "04": { "var_type": "FIELD_INTEGER", "creep_damage_penalty": "-40", "CalculateSpellDamageTooltip": "0" }, "05": { "var_type": "FIELD_INTEGER", "AbilityCharges": "", "LinkedSpecialBonus": "special_bonus_unique_ember_spirit_4" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_ember_spirit_sleight_of_fist extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ember_spirit_sleight_of_fist";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ember_spirit_sleight_of_fist = Data_ember_spirit_sleight_of_fist;
    Init() {
        this.SetDefaultSpecialValue("radius", 900);
        this.SetDefaultSpecialValue("bonus_damage", [500, 1100, 1700, 2300, 2600, 3200]);
        this.SetDefaultSpecialValue("attack_interval", 0.075);

    }



    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let position = this.GetCursorPosition()
        let radius = this.GetSpecialValueFor("radius")
        modifier_ember_spirit_2_particle_ember_spirit_sleight_of_fist_cast.applyThinker(position, caster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, caster.GetTeamNumber(), false)
        caster.InterruptMotionControllers(true)
        modifier_ember_spirit_2_buff.apply(caster, caster, this, { target_position: position })
        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_EmberSpirit.SleightOfFist.Cast", caster))
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_ember_spirit_2"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ember_spirit_2 extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let caster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)

            if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        AbilityIndex: ability.entindex(),
                        Position: position
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_2_buff extends BaseModifier_Plus {
    radius: number;
    bonus_damage: number;
    attack_interval: number;
    vStartPosition: Vector;
    targets: IBaseNpc_Plus[];
    particleID: ParticleID;
    isHero: boolean;
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        this.radius = this.GetSpecialValueFor("radius")
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage") + hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_3")
        this.attack_interval = this.GetSpecialValueFor("attack_interval")
        if (IsServer()) {
            let target_position = GameFunc.VectorFunctions.StringToVector(params.target_position)
            let parent = this.GetParentPlus()

            this.vStartPosition = parent.GetAbsOrigin()
            this.targets = AoiHelper.FindEntityInRadius(parent.GetTeamNumber(), target_position, this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, 0)

            if (this.targets.length > 0) {
                this.GetAbilityPlus().SetActivated(false)
                modifier_ember_spirit_2_invulnerability.apply(parent, parent, this.GetAbilityPlus(), null)
                modifier_ember_spirit_2_disarmed.apply(parent, parent, this.GetAbilityPlus(), null)

                this.particleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_ember_spirit/ember_spirit_sleight_of_fist_caster.vpcf",
                    resNpc: parent,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: null
                });

                ParticleManager.SetParticleControl(this.particleID, 0, this.vStartPosition)
                ParticleManager.SetParticleControlEnt(this.particleID, 1, parent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, this.vStartPosition, true)
                ParticleManager.SetParticleControlForward(this.particleID, 1, parent.GetForwardVector())
                this.AddParticle(this.particleID, false, false, -1, false, false)

                for (let target of (this.targets)) {

                    modifier_ember_spirit_2_marker.apply(target, parent, this.GetAbilityPlus(), null)
                }

                this.OnIntervalThink()
                this.StartIntervalThink(this.attack_interval)
            } else {
                this.Destroy()
            }
        }
    }
    OnRefresh(params: IModifierTable) {
        super.OnRefresh(params);
        let hCaster = this.GetCasterPlus()
        this.radius = this.GetSpecialValueFor("radius")
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage") + hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_3")
        this.attack_interval = this.GetSpecialValueFor("attack_interval")
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let parent = this.GetParentPlus()

            modifier_ember_spirit_2_particle_ember_spirit_sleightoffist_trail.applyThinker(this.vStartPosition, parent, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, parent.GetTeamNumber(), false)
            FindClearSpaceForUnit(parent, this.vStartPosition, true)

            this.GetAbilityPlus().SetActivated(true)
            modifier_ember_spirit_2_invulnerability.remove(parent);
            modifier_ember_spirit_2_disarmed.remove(parent);

            for (let i = this.targets.length - 1; i >= 0; i--) {
                let _target = this.targets[i]
                if (GameFunc.IsValid(_target)) {
                    modifier_ember_spirit_2_marker.remove(_target);
                }
                table.remove(this.targets, i)
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let parent = this.GetParentPlus()
            let vCasterPosition = parent.GetAbsOrigin()

            let target

            for (let i = this.targets.length - 1; i >= 0; i--) {
                let _target = this.targets[i]
                table.remove(this.targets, i)
                if (GameFunc.IsValid(_target)) {
                    modifier_ember_spirit_2_marker.remove(_target);
                    if (UnitFilter(_target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, parent.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                        target = _target
                        break
                    }
                }
            }

            if (target == null) {
                this.Destroy()
                return
            }

            let vTargetPosition = target.GetAbsOrigin()
            let vDirection = (vTargetPosition - this.vStartPosition) as Vector
            vDirection.z = 0

            let vPosition = (vTargetPosition - vDirection.Normalized() * 50) as Vector
            parent.SetAbsOrigin(vPosition)
            modifier_ember_spirit_2_particle_ember_spirit_sleightoffist_trail.applyThinker(vPosition, parent, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION },
                parent.GetTeamNumber(), false)

            modifier_ember_spirit_2_particle_ember_spirit_sleightoffist_tgt.apply(target, parent, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

            modifier_ember_spirit_2_disarmed.remove(parent);
            if (!parent.IsDisarmed()) {
                this.isHero = target.IsConsideredHero()
                for (let i = 1; i <= parent.GetTalentValue("special_bonus_unique_ember_spirit_custom_5") - 1; i++) {
                    BattleHelper.Attack(parent, target, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE)
                }
                BattleHelper.Attack(parent, target, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE)
                this.isHero = false
            }
            modifier_ember_spirit_2_disarmed.apply(parent, parent, this.GetAbilityPlus(), null)

            EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_EmberSpirit.SleightOfFist.Damage", parent), parent)

            let modifier = modifier_ember_spirit_1.findIn(parent) as modifier_ember_spirit_1;
            if (modifier) {
                modifier.OnIntervalThink()
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TELEPORTED)
    OnTeleported(params: IModifierTable) {
        if (IsServer() && params.unit == this.GetParentPlus()) {
            this.vStartPosition = params.new_pos
            ParticleManager.SetParticleControl(this.particleID, 0, this.vStartPosition)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        return this.bonus_damage
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_2_invulnerability extends BaseModifier_Plus {
    modifier_no_health_bar: IBaseModifier_Plus;
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.GetParentPlus().AddNoDraw()
            this.modifier_no_health_bar = modifier_no_health_bar.apply(this.GetParentPlus(), this.GetParentPlus(), this.GetAbilityPlus(), null) as IBaseModifier_Plus
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().RemoveNoDraw()

            if (GameFunc.IsValid(this.modifier_no_health_bar)) {
                this.modifier_no_health_bar.Destroy()
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_2_marker extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ember_spirit/ember_spirit_sleight_of_fist_targetted_marker.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_2_disarmed extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_2_particle_ember_spirit_sleight_of_fist_cast extends modifier_particle_thinker {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ember_spirit/ember_spirit_sleight_of_fist_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(particleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(particleID, 1, Vector(radius, radius, radius))
            ParticleManager.SetParticleShouldCheckFoW(particleID, false)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_2_particle_ember_spirit_sleightoffist_trail extends modifier_particle_thinker {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ember_spirit/ember_spirit_sleightoffist_trail.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(particleID, 0, hCaster.GetAbsOrigin())
            ParticleManager.SetParticleControl(particleID, 1, hParent.GetAbsOrigin())
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_2_particle_ember_spirit_sleightoffist_tgt extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ember_spirit/ember_spirit_sleightoffist_tgt.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}
