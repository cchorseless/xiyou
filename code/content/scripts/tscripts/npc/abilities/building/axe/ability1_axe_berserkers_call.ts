import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { ActiveRootAbility } from "../../ActiveRootAbility";
import { ability3_axe_counter_helix } from "./ability3_axe_counter_helix";

@registerAbility()
export class ability1_axe_berserkers_call extends ActiveRootAbility {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "axe_berserkers_call";
    Init() {
        this.SetDefaultSpecialValue("radius", 800);
        this.SetDefaultSpecialValue("root_duration", [1.5, 1.8, 2.1, 2.4, 2.7, 3.0]);
        this.SetDefaultSpecialValue("attack_damage_pct", [80, 85, 90, 95, 100, 110]);
        this.SetDefaultSpecialValue("attack_interval", 0.5);
    }
    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    OnAbilityPhaseStart() {
        this.GetCasterPlus().EmitSound(ResHelper.GetSoundReplacement("Hero_Axe.BerserkersCall.Start", this.GetCasterPlus()))
        return true
    }
    public IsAutoCast: boolean = true;
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_axe_custom_6"
        let radius = this.GetSpecialValueFor("radius")
        let root_duration = this.GetSpecialValueFor("root_duration")
        modifier_axe_1_particle_start.apply(caster, caster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_Axe.Berserkers_Call", caster))
        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST)
        for (let target of (targets)) {
            let hAbility3 = ability3_axe_counter_helix.findIn(caster)
            if (GameFunc.IsValid(hAbility3) && hAbility3.GetLevel() >= 1 && caster.HasTalent("special_bonus_unique_axe_custom_7")) {
                hAbility3._OnSpellStart(target)
            }
            modifier_axe_1_root.apply(target, caster, this, { duration: root_duration * target.GetStatusResistanceFactor(caster) })
        }
        if (caster.HasTalent(sTalentName)) {
            modifier_special_bonus_unique_axe_custom_6.apply(caster, caster, this, { duration: root_duration })
        }
    }

    AutoSpellSelf() {
        let caster = this.GetCasterPlus()
        let range = this.GetSpecialValueFor("radius")
        let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
        let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
        let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
        let order = FindOrder.FIND_CLOSEST
        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
        if (targets[0] != null) {
            ExecuteOrderFromTable({
                UnitIndex: caster.entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                AbilityIndex: this.entindex(),
            })
            return true;
        }
    }

}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_axe_1_root extends BaseModifier_Plus {
    attack_interval: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return true
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }

    Init(params: IModifierTable) {
        this.attack_interval = this.GetSpecialValueFor("attack_interval")
        if (params.IsOnCreated) {
            if (IsServer()) {
                this.StartIntervalThink(this.attack_interval)
            }
        }
    }

    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (GameFunc.IsValid(hCaster) && hCaster.IsAlive()) {
                modifier_axe_1_attack_damage_pct.apply(hCaster, hCaster, hAbility)
                BattleHelper.Attack(hCaster, hParent, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
                modifier_axe_1_attack_damage_pct.remove(hCaster)
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_special_bonus_unique_axe_custom_6 extends BaseModifier_Plus {
    bonus_damage: number;
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

    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_axe_custom_6"
        this.bonus_damage = hCaster.GetTalentValue(sTalentName)
        if (params.IsOnCreated) {
            if (!IsServer()) {
                let iPtclID = ResHelper.CreateParticle({
                    resPath: 'particles/units/heroes/hero_axe/axe_beserkers_call_hero_effect.vpcf',
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                    owner: this.GetParentPlus()
                });

                this.AddParticle(iPtclID, false, false, 100, true, false)
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    GetBaseDamageOutgoing_Percentage(params: IModifierTable) {
        return this.bonus_damage
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_axe_1_attack_damage_pct extends BaseModifier_Plus {
    attack_damage_pct: number;
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
    Init(params: IModifierTable) {
        this.attack_damage_pct = this.GetSpecialValueFor("attack_damage_pct")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: IModifierTable) {
        return this.attack_damage_pct - 100
    }
}

// 特效
@registerModifier()
export class modifier_axe_1_particle_start extends modifier_particle {
    Init(params: IModifierTable) {
        let radius = this.GetSpecialValueFor("radius")
        if (params.IsOnCreated && IsClient()) {
            let caster = this.GetCasterPlus()
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_axe/axe_beserkers_call_owner.vpcf",
                resNpc: caster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: caster
            });
            ParticleManager.SetParticleControlEnt(particleID, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mouth", caster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(particleID, 2, Vector(radius, radius, radius))
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}
