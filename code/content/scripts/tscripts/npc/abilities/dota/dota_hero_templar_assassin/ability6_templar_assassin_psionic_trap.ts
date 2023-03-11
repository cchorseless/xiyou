import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_templar_assassin_psionic_trap = { "ID": "5197", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_TemplarAssassin.Trap", "HasShardUpgrade": "1", "AbilityDraftPreAbility": "templar_assassin_trap", "AbilityDraftUltScepterAbility": "templar_assassin_trap_teleport", "AbilityCastRange": "1800", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_5", "AbilityCooldown": "11.0 8.0 5.0", "AbilityManaCost": "15 15 15", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "max_traps": "5 8 11", "LinkedSpecialBonus": "special_bonus_unique_templar_assassin_6" }, "02": { "var_type": "FIELD_FLOAT", "trap_fade_time": "2.0 2.0 2.0" }, "03": { "var_type": "FIELD_INTEGER", "movement_speed_min": "30" }, "04": { "var_type": "FIELD_INTEGER", "movement_speed_max": "60" }, "05": { "var_type": "FIELD_INTEGER", "trap_duration_tooltip": "5" }, "06": { "var_type": "FIELD_INTEGER", "trap_bonus_damage": "250 300 350", "LinkedSpecialBonus": "special_bonus_unique_templar_assassin_3" }, "07": { "var_type": "FIELD_FLOAT", "trap_max_charge_duration": "4" } } };

@registerAbility()
export class ability6_templar_assassin_psionic_trap extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "templar_assassin_psionic_trap";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_templar_assassin_psionic_trap = Data_templar_assassin_psionic_trap;
    Init() {
        this.SetDefaultSpecialValue("trap_delay", 0.5);
        this.SetDefaultSpecialValue("trap_radius", 400);
        this.SetDefaultSpecialValue("trap_damage", [400, 700, 900, 1200, 1500, 1800]);
        this.SetDefaultSpecialValue("move_speed_reduce", [25, 30, 35, 40, 45, 50]);
        this.SetDefaultSpecialValue("move_speed_reduce_time", [3, 3.5, 4, 4.5, 5, 5.5]);
        this.SetDefaultSpecialValue("attack_interval", 0.5);

    }

    Init_old() {
        this.SetDefaultSpecialValue("trap_delay", 0.5);
        this.SetDefaultSpecialValue("trap_radius", 400);
        this.SetDefaultSpecialValue("trap_damage", [400, 700, 900, 1200, 1500,]);
        this.SetDefaultSpecialValue("move_speed_reduce", [25, 30, 35, 40, 45, 50]);
        this.SetDefaultSpecialValue("move_speed_reduce_time", [3, 3.5, 4, 4.5, 5, 5.5]);

    }


    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel)
    }

    GetAOERadius() {
        return this.GetSpecialValueFor("trap_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let trap_delay = this.GetSpecialValueFor("trap_delay")

        modifier_templar_assassin_6_thinker.applyThinker(vPosition, hCaster, this, { duration: trap_delay }, hCaster.GetTeamNumber(), false)
    }
    GetIntrinsicModifierName() {
        return "modifier_templar_assassin_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // Modifiers
@registerModifier()
export class modifier_templar_assassin_6 extends BaseModifier_Plus {
    records: any[];
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.records = []
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GFuncEntity.IsValid(ability)) {
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

            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)

            //  施法命令
            if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // 减速
@registerModifier()
export class modifier_templar_assassin_6_movespeed extends BaseModifier_Plus {
    move_speed_reduce: number;
    attack_interval: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
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
    GetTexture() {
        return "templar_assassin_psionic_trap"
    }
    BeCreated() {
        if (IsServer()) {
            this.StartIntervalThink(this.attack_interval)
        }
    }
    Init_old() {
        this.move_speed_reduce = this.GetSpecialValueFor("move_speed_reduce")
        this.attack_interval = this.GetSpecialValueFor("attack_interval")
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (GFuncEntity.IsValid(hCaster) && hCaster.HasShard()) {
                BattleHelper.Attack(hCaster, hParent, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        if (GFuncEntity.IsValid(hCaster)) {
            return -(this.move_speed_reduce + this.GetCasterPlus().GetTalentValue("special_bonus_unique_templar_assassin_custom"))
        }
        return 0
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_templar_assassin_6_mark// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_templar_assassin_6_mark extends BaseModifier_Plus {
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
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_templar_assassin_6_thinker extends modifier_particle_thinker {
    trap_radius: number;
    trap_damage: number;
    move_speed_reduce_time: number;
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let vPosition = hParent.GetAbsOrigin()
        this.trap_radius = this.GetSpecialValueFor("trap_radius")
        this.trap_damage = this.GetSpecialValueFor("trap_damage")
        this.move_speed_reduce_time = this.GetSpecialValueFor("move_speed_reduce_time")
        if (IsServer()) {
            hParent.SetAbsOrigin((GetGroundPosition(vPosition, hCaster) + Vector(0, 0, 16)) as Vector)
            EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_TemplarAssassin.Trap", hCaster), hCaster)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_templar_assassin/templar_assassin_trap_portrait.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, vPosition)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeRemoved(): void {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let vPosition = hParent.GetAbsOrigin()
        if (IsServer()) {
            if (!GFuncEntity.IsValid(hAbility) || !GFuncEntity.IsValid(hCaster)) {
                return
            }
            EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_TemplarAssassin.Trap.Explode", hCaster), hCaster)
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, this.trap_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {
                // 魔晶无视状态抗性
                if (hCaster.HasShard()) {
                    modifier_templar_assassin_6_movespeed.apply(hTarget, hCaster, hAbility, { duration: this.move_speed_reduce_time })
                } else {
                    modifier_templar_assassin_6_movespeed.apply(hTarget, hCaster, hAbility, { duration: this.move_speed_reduce_time * hTarget.GetStatusResistanceFactor(hCaster) })
                }
                //  标记不吃状态抗性
                modifier_templar_assassin_6_mark.apply(hTarget, hCaster, hAbility, { duration: this.move_speed_reduce_time })
                let tDamageTable = {
                    ability: hAbility,
                    victim: hTarget,
                    attacker: hCaster,
                    damage: this.trap_damage,
                    damage_type: hAbility.GetAbilityDamageType()
                }
                BattleHelper.GoApplyDamage(tDamageTable)
                if (hCaster.HasScepter()) {
                    BattleHelper.Attack(hCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
                }
            }
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_templar_assassin/templar_assassin_trap_explode.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, vPosition)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
