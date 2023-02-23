import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_kill } from "../../../modifier/modifier_kill";

/** dota原技能数据 */
export const Data_juggernaut_healing_ward = { "ID": "5029", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT", "AbilitySound": "Hero_Juggernaut.HealingWard.Cast", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "AbilityCastRange": "350", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "60.0 60.0 60.0 60.0", "AbilityDuration": "25.0", "AbilityManaCost": "140", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "healing_ward_heal_amount": "2 3 4 5" }, "02": { "var_type": "FIELD_INTEGER", "healing_ward_aura_radius": "500" }, "03": { "var_type": "FIELD_INTEGER", "healing_ward_movespeed_tooltip": "350" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_juggernaut_healing_ward extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "juggernaut_healing_ward";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_juggernaut_healing_ward = Data_juggernaut_healing_ward;
    Init() {
        this.SetDefaultSpecialValue("bonus_crit_damage", [50, 90, 130, 170, 210, 250]);
        this.SetDefaultSpecialValue("radius", 600);

    }

    hHealingWard: CDOTA_BaseNPC;
    vLastPosition: Vector;


    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let duration = this.GetDuration()

        if (GameFunc.IsValid(this.hHealingWard) && this.hHealingWard.IsAlive()) {
            this.hHealingWard.ForceKill(false)
        }
        this.hHealingWard = BaseNpc_Plus.CreateUnitByName("npc_dota_juggernaut_healing_ward", vPosition, hCaster.GetTeamNumber(), false, hCaster, hCaster)
        modifier_juggernaut_2_aura.apply(this.hHealingWard, hCaster, this, { duration: duration })
        //  记录上一次释放的位置
        this.vLastPosition = vPosition
        hCaster.EmitSound("Hero_Juggernaut.HealingWard.Cast")
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_juggernaut_2"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_juggernaut_2 extends BaseModifier_Plus {
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
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus() as ability2_juggernaut_healing_ward
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

            if (GameFunc.IsValid(ability.hHealingWard) && ability.hHealingWard.IsAlive()) {
                return
            }

            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
            let order = FindOrder.FIND_CLOSEST

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            //  优先释放在上一次释放的位置
            if (ability.vLastPosition != null && caster.IsPositionInRange(ability.vLastPosition, range)) {
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), ability.vLastPosition, radius, null, teamFilter, typeFilter, flagFilter, order)
                //  施法命令
                if (targets.length > 0) {
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        Position: ability.vLastPosition,
                        AbilityIndex: ability.entindex(),
                    })
                }
            } else {
                let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, teamFilter, typeFilter, flagFilter, order)
                //  施法命令
                if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                    ExecuteOrderFromTable({
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        AbilityIndex: ability.entindex(),
                        Position: position,
                    })
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_juggernaut_2_aura extends BaseModifier_Plus {
    radius: number;
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
    IsAura() {
        return true
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }
    GetAuraSearchFlags() {
        return 0
    }
    GetAura() {
        return "modifier_juggernaut_2_crit_buff"
    }
    GetAuraDuration() {
        return 1
    }
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            modifier_kill.apply(this.GetParentPlus(), this.GetParentPlus(), null, { duration: this.GetDuration() })
            this.GetParentPlus().EmitSound("Hero_Juggernaut.HealingWard.Loop")
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_juggernaut/juggernaut_healing_ward.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, 0, -this.radius))
            ParticleManager.SetParticleControlEnt(iParticleID, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "flame_attachment", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.radius = this.GetSpecialValueFor("radius")
    }
    BeDestroy() {

        if (IsServer()) {
            this.GetParentPlus().StopSound("Hero_Juggernaut.HealingWard.Loop")
            EmitSoundOnLocationWithCaster(this.GetParentPlus().GetAbsOrigin(), "Hero_Juggernaut.HealingWard.Stop", this.GetCasterPlus())
            this.GetParentPlus().ForceKill(false)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: IModifierTable) {
        return ResHelper.GetModelReplacement("models/heroes/juggernaut/jugg_healing_ward.vmdl", this.GetCasterPlus())
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_juggernaut_2_crit_buff extends BaseModifier_Plus {
    bonus_crit_damage: number;
    IsHidden() {
        return false
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

        let hCaster = this.GetCasterPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_juggernaut/juggernaut_healing_ward_hero_heal.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            this.AddParticle(iParticleID, false, false, -1, true, false)
        }
    }
    Init(params: IModifierTable) {
        this.bonus_crit_damage = this.GetSpecialValueFor("bonus_crit_damage")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_DAMAGE)
    G_CRITICALSTRIKE_DAMAGE() {
        return this.bonus_crit_damage
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return this.bonus_crit_damage
    }
}
