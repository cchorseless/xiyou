
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_undying_decay = { "ID": "5442", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_Undying.Decay.Cast", "FightRecapLevel": "1", "HasShardUpgrade": "1", "HasScepterUpgrade": "1", "AbilityCastAnimation": "ACT_DOTA_UNDYING_DECAY", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastRange": "650", "AbilityCastPoint": "0.45 0.45 0.45 0.45", "AbilityCooldown": "10.0 8.0 6.0 4.0", "AbilityDuration": "21.0 24.0 27.0 30.0", "AbilityManaCost": "85 90 95 100", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "decay_damage": "20 50 80 110" }, "02": { "var_type": "FIELD_INTEGER", "str_steal": "4" }, "03": { "var_type": "FIELD_FLOAT", "decay_duration": "45", "LinkedSpecialBonus": "special_bonus_unique_undying_4" }, "04": { "var_type": "FIELD_INTEGER", "radius": "325" }, "05": { "var_type": "FIELD_INTEGER", "str_scale_up": "2" }, "06": { "var_type": "FIELD_INTEGER", "str_steal_scepter": "10", "RequiresScepter": "1" } } };

@registerAbility()
export class ability1_undying_decay extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "undying_decay";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_undying_decay = Data_undying_decay;
    Init() {
        this.SetDefaultSpecialValue("steal_health_limit", [200, 400, 600, 900, 1200, 1500]);
        this.SetDefaultSpecialValue("health_chuange_str_pct", 2);
        this.SetDefaultSpecialValue("decay_duration", 45);
        this.SetDefaultSpecialValue("radius", 325);
        this.SetDefaultSpecialValue("str_scale_up", 0.5);
        this.SetDefaultSpecialValue("health_steal_limit_scepter", 3000);
        this.SetDefaultSpecialValue("str_factor", [6, 6.5, 7, 7.5, 8, 9]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("decay_damage", [30, 40, 50, 60, 70, 80]);
        this.SetDefaultSpecialValue("str_steal", 4);
        this.SetDefaultSpecialValue("decay_duration", 20);
        this.SetDefaultSpecialValue("radius", 325);
        this.SetDefaultSpecialValue("str_scale_up", 0.5);
        this.SetDefaultSpecialValue("str_steal_scepter", 10);
        this.SetDefaultSpecialValue("health_loss", 72);
        this.SetDefaultSpecialValue("health_loss_scepter", 180);

    }


    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_undying_custom_4")
    }
    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus() as BaseNpc_Hero_Plus
        let vPoint = this.GetCursorPosition()
        let radius = this.GetSpecialValueFor("radius")
        let steal_health_limit = this.GetSpecialValueFor("steal_health_limit")
        let health_steal_limit_scepter = this.GetSpecialValueFor("health_steal_limit_scepter")
        let health_chuange_str_pct = this.GetSpecialValueFor("health_chuange_str_pct")
        let decay_duration = this.GetSpecialValueFor("decay_duration") + hCaster.GetTalentValue("special_bonus_unique_undying_custom_6")
        let str_factor = this.GetSpecialValueFor("str_factor")
        if (hCaster.HasScepter()) {
            steal_health_limit = steal_health_limit + health_steal_limit_scepter
        }
        let tEnemies = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPoint, radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER)

        for (let hEnemy of (tEnemies)) {
            // 偷取生命值上限
            let fStealHealth = math.min(hEnemy.GetHealth(), steal_health_limit)
            modifier_undying_1_health_debuff.apply(hEnemy, hCaster, this, { duration: decay_duration, fStealHealth: fStealHealth })
            let str_steal = fStealHealth * health_chuange_str_pct * 0.01
            modifier_undying_1_hero.apply(hCaster, hCaster, this, { duration: decay_duration, str_steal: str_steal })
            let iParticle = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_undying/undying_decay_strength_xfer.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
                owner: hEnemy
            });

            ParticleManager.SetParticleControlEnt(iParticle, 0, hEnemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hEnemy.GetAbsOrigin(), false)
            ParticleManager.SetParticleControlEnt(iParticle, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), false)
            ParticleManager.ReleaseParticleIndex(iParticle)
        }
        // 力量伤害
        let fDamage = hCaster.GetStrength() * str_factor
        for (let hTarget of (tEnemies)) {
            let damage_table =
            {
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
        let iParticle = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_undying/undying_decay.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControl(iParticle, 0, vPoint)
        ParticleManager.SetParticleControl(iParticle, 1, Vector(radius, radius, radius))
        ParticleManager.SetParticleControl(iParticle, 2, hCaster.GetAbsOrigin())
        ParticleManager.ReleaseParticleIndex(iParticle)
        let sSoundCast = "Hero_Undying.Decay.Cast"
        EmitSoundOnLocationWithCaster(vPoint, sSoundCast, hCaster)
    }

    GetIntrinsicModifierName() {
        return "modifier_undying_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_undying_1 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let caster = ability.GetCasterPlus()
            if (!GameFunc.IsValid(caster)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

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

            let position = AoiHelper.GetAOEMostTargetsPosition(
                caster.GetAbsOrigin(),
                range,
                caster.GetTeamNumber(),
                radius,
                null,
                ability.GetAbilityTargetTeam(),
                ability.GetAbilityTargetType(),
                ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                FindOrder.FIND_CLOSEST)
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
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_undying_1_hero extends BaseModifier_Plus {
    str_scale_up: number;
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
    GetEffectName() {
        return "particles/units/heroes/hero_undying/undying_decay_strength_buff.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    Init(params: IModifierTable) {
        this.str_scale_up = this.GetSpecialValueFor("str_scale_up")
        if (IsServer()) {
            let str_steal = params.str_steal || 0
            this.changeStackCount(str_steal)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-str_steal)
            })
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    GetModelScale() {
        return math.min(this.str_scale_up * this.GetStackCount(), 50)
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return this.GetStackCount()
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_undying_1_health_debuff extends BaseModifier_Plus {
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let fStealHealth = params.fStealHealth || 0
            let hParent = this.GetParentPlus()
            this.changeStackCount(fStealHealth)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-fStealHealth)
            })
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return this.GetStackCount()
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS)
    G_HP_BONUS() {
        return this.GetStackCount()
    }

}
