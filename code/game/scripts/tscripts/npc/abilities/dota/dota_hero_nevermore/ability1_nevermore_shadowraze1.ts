import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_nevermore_shadowraze1 = { "ID": "5059", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Nevermore.Shadowraze", "LinkedAbility": "nevermore_shadowraze2", "AbilityCastAnimation": "ACT_DOTA_RAZE_1", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0.55", "AbilityCooldown": "10", "AbilityManaCost": "75 80 85 90", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "shadowraze_damage": "90 160 230 300", "LinkedSpecialBonus": "special_bonus_unique_nevermore_2" }, "02": { "var_type": "FIELD_INTEGER", "shadowraze_radius": "250" }, "03": { "var_type": "FIELD_INTEGER", "shadowraze_range": "200" }, "04": { "var_type": "FIELD_INTEGER", "shadowraze_cooldown": "3" }, "05": { "var_type": "FIELD_INTEGER", "stack_bonus_damage": "50 60 70 80", "CalculateSpellDamageTooltip": "0" }, "06": { "var_type": "FIELD_FLOAT", "duration": "8" } } };

@registerAbility()
export class ability1_nevermore_shadowraze1 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "nevermore_shadowraze1";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_nevermore_shadowraze1 = Data_nevermore_shadowraze1;
    Init() {
                this.SetDefaultSpecialValue("chance_scepter", 17);
        this.SetDefaultSpecialValue("shadowraze_range1_damage_factor", 2);
        this.SetDefaultSpecialValue("shadowraze_range2_damage_factor", 1);
        this.SetDefaultSpecialValue("shadowraze_range3_damage_factor", 0.5);
        this.SetDefaultSpecialValue("shadowraze_damage", [200,400,600,800,1600,2400]);
        this.SetDefaultSpecialValue("shadowraze_radius", 250);
        this.SetDefaultSpecialValue("shadowraze_interval", 0.25);
        this.SetDefaultSpecialValue("shadowraze_range1", 200);
        this.SetDefaultSpecialValue("shadowraze_range2", 450);
        this.SetDefaultSpecialValue("shadowraze_range3", 700);
        this.SetDefaultSpecialValue("stack_bonus_damage", [50,100,200,400,800,1600]);
        this.SetDefaultSpecialValue("stack_bonus_damage_per_agi", [1.0,1.2,1.4,1.6,1.8,2.0]);
        this.SetDefaultSpecialValue("duration", 11);

        }

    Init_old() {
                this.SetDefaultSpecialValue("shadowraze_range3", 700);
        this.SetDefaultSpecialValue("stack_bonus_damage", [50,100,200,400,800,1600]);
        this.SetDefaultSpecialValue("stack_bonus_damage_per_agi", [1.0,1.2,1.4,1.6,1.8,2.0]);
        this.SetDefaultSpecialValue("duration", 11);
        this.SetDefaultSpecialValue("chance_scepter", 15);
        this.SetDefaultSpecialValue("shadowraze_range1_damage_factor", 2);
        this.SetDefaultSpecialValue("shadowraze_range2_damage_factor", 1);
        this.SetDefaultSpecialValue("shadowraze_range3_damage_factor", 0.5);
        this.SetDefaultSpecialValue("shadowraze_damage", [200,400,600,800,1600,2400]);
        this.SetDefaultSpecialValue("shadowraze_radius", 250);
        this.SetDefaultSpecialValue("shadowraze_interval", 0.25);
        this.SetDefaultSpecialValue("shadowraze_range1", 200);
        this.SetDefaultSpecialValue("shadowraze_range2", 450);

        }



    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_nevermore_custom_5")
    }
    ShadowRaze(vPosition: Vector, damage_factor: number) {
        let hCaster = this.GetCasterPlus()
        let shadowraze_damage = this.GetSpecialValueFor("shadowraze_damage")
        let shadowraze_radius = this.GetSpecialValueFor("shadowraze_radius") + hCaster.GetTalentValue("special_bonus_unique_nevermore_custom_6")
        let stack_bonus_damage_per_agi = this.GetSpecialValueFor("stack_bonus_damage_per_agi") + hCaster.GetTalentValue("special_bonus_unique_nevermore_custom_2")
        let stack_bonus_damage = this.GetSpecialValueFor("stack_bonus_damage") + stack_bonus_damage_per_agi * hCaster.GetAgility()
        let duration = this.GetSpecialValueFor("duration")
        modifier_nevermore_1_particle_nevermore_shadowraze.applyThinker(vPosition, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)
        EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_Nevermore.Shadowraze", hCaster), hCaster)

        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, shadowraze_radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
        for (let hTarget of (tTargets)) {

            let iStackCount = modifier_nevermore_1_debuff.GetStackIn(hTarget, hCaster)
            let fDamage = (shadowraze_damage + stack_bonus_damage * iStackCount) * damage_factor
            let tDamageTable = {
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(tDamageTable)
            // 短距离毁灭阴影在添加一次标记
            if (damage_factor == this.GetSpecialValueFor("shadowraze_range1_damage_factor")) {
                modifier_nevermore_1_debuff.apply(hTarget, hCaster, this, { duration: duration })
            }
            modifier_nevermore_1_debuff.apply(hTarget, hCaster, this, { duration: duration })
        }
    }
    OnSpellStart(hTarget?: BaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        if (this.GetCursorTarget() != null) {
            vPosition = this.GetCursorTarget().GetAbsOrigin()
        } else if (GameFunc.IsValid(hTarget)) {
            vPosition = hTarget.GetAbsOrigin()
        }
        let vStartPosition = hCaster.GetAbsOrigin()
        let shadowraze_interval = this.GetSpecialValueFor("shadowraze_interval")
        let shadowraze_range1 = this.GetSpecialValueFor("shadowraze_range1")
        let shadowraze_range2 = this.GetSpecialValueFor("shadowraze_range2")
        let shadowraze_range3 = this.GetSpecialValueFor("shadowraze_range3")
        let shadowraze_range1_damage_factor = this.GetSpecialValueFor("shadowraze_range1_damage_factor")
        let shadowraze_range2_damage_factor = this.GetSpecialValueFor("shadowraze_range2_damage_factor")
        let shadowraze_range3_damage_factor = this.GetSpecialValueFor("shadowraze_range3_damage_factor")

        let vDirection = (vPosition - vStartPosition) as Vector
        vDirection.z = 0
        let vTargetPosition = GetGroundPosition((vStartPosition + vDirection.Normalized() * shadowraze_range1) as Vector, hCaster)
        this.ShadowRaze(vTargetPosition, shadowraze_range1_damage_factor)
        this.addTimer(shadowraze_interval, () => {
            let vTargetPosition = GetGroundPosition((vStartPosition + vDirection.Normalized() * shadowraze_range2) as Vector, hCaster)
            this.ShadowRaze(vTargetPosition, shadowraze_range2_damage_factor)
        })
        this.addTimer(shadowraze_interval * 2, () => {
            let vTargetPosition = GetGroundPosition((vStartPosition + vDirection.Normalized() * shadowraze_range3) as Vector, hCaster)
            this.ShadowRaze(vTargetPosition, shadowraze_range3_damage_factor)
        })
    }

    GetIntrinsicModifierName() {
        return "modifier_nevermore_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_nevermore_1 extends BaseModifier_Plus {
    chance_scepter: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    Init(params: ModifierTable) {
        this.chance_scepter = this.GetSpecialValueFor("chance_scepter")
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

            let range = ability.GetSpecialValueFor("shadowraze_range3")
            let extra_shadowraze_radius = caster.HasTalent("special_bonus_unique_nevermore_custom_6") && caster.GetTalentValue("special_bonus_unique_nevermore_custom_6") || 0
            let shadowraze_radius = ability.GetSpecialValueFor("shadowraze_radius") + extra_shadowraze_radius
            let start_width = shadowraze_radius
            let end_width = shadowraze_radius
            let position = AoiHelper.GetLinearMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), start_width, end_width, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)
            if (position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                })
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && params.attacker.HasScepter() && !params.attacker.PassivesDisabled() && !params.attacker.IsIllusion() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            if (GameFunc.mathUtil.PRD(this.chance_scepter, params.attacker, "nevermore_1")) {
                (this.GetAbilityPlus() as ability1_nevermore_shadowraze1).OnSpellStart(params.target)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_nevermore_1_debuff extends BaseModifier_Plus {
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
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (!IsServer()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_nevermore/nevermore_shadowraze_debuff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: this.GetEffectAttachType(),
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        if (IsServer()) {
            this.IncrementStackCount()
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_nevermore_1_particle_nevermore_shadowraze extends modifier_particle_thinker {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_nevermore/nevermore_shadowraze.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
