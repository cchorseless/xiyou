import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
/** dota原技能数据 */
export const Data_brewmaster_primal_split = { "ID": "5403", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "2", "AbilitySound": "Hero_Brewmaster.PrimalSplit.Spawn", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "HasShardUpgrade": "1", "HasScepterUpgrade": "1", "AbilityCooldown": "140 130 120", "AbilityCastPoint": "0.55", "AbilityManaCost": "125 150 175", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "16 18 20" }, "02": { "var_type": "FIELD_FLOAT", "split_duration": "0.6" }, "03": { "var_type": "FIELD_FLOAT", "scepter_bonus_duration": "20", "RequiresScepter": "1" }, "04": { "var_type": "FIELD_INTEGER", "max_charges": "2", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_brewmaster_primal_split extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "brewmaster_primal_split";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_brewmaster_primal_split = Data_brewmaster_primal_split;
    Init() {
        this.SetDefaultSpecialValue("bonus_attack_speed", [80, 100, 120, 140, 160, 200]);
        this.SetDefaultSpecialValue("crit_chance", 60);
        this.SetDefaultSpecialValue("crit_multiplier", [200, 260, 320, 380, 440, 500]);
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("bonus_crit_mutipier", 180);

    }



    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration") + hCaster.GetTalentValue("special_bonus_unique_brewmaster_custom_3")
        // 音效
        EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Brewmaster.Brawler.Cast", hCaster), hCaster)
        modifier_brewmaster_6_buff.apply(hCaster, hCaster, this, { duration: duration })
    }

    GetIntrinsicModifierName() {
        return "modifier_brewmaster_6"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_brewmaster_6 extends BaseModifier_Plus {
    bonus_crit_mutipier: number;
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
    Init(params: IModifierTable) {
        this.bonus_crit_mutipier = this.GetSpecialValueFor("bonus_crit_mutipier")
    }
    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (ability == null || ability.IsNull()) {
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

            let range = caster.Script_GetAttackRange()

            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets.length > 0) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE_DAMAGE)
    CC_CRITICALSTRIKE_DAMAGE() {
        // 侍从技为风元素，
        let hCaster = this.GetCasterPlus()
        // let hAbility_t27  = qualification_build_t27.findIn(  hCaster )
        // if (IsValid(hAbility_t27) && hAbility_t27.GetLevel() >= 1) {
        //     return this.bonus_crit_mutipier
        // }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_brewmaster_6_buff extends BaseModifier_Plus {
    bonus_attack_speed: number;
    crit_multiplier: number;
    bonus_crit_mutipier: number;
    crit_chance: number;
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

        if (IsClient()) {
            let iParticle = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_drunken_brawler.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticle, false, true, 10, false, false)
            iParticle = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_brewmaster/brewmaster_drunkenbrawler_crit.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticle, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed")
        this.crit_chance = this.GetSpecialValueFor("crit_chance")
        this.crit_multiplier = this.GetSpecialValueFor("crit_multiplier")
        this.bonus_crit_mutipier = this.GetSpecialValueFor("bonus_crit_mutipier")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    G_MAX_ATTACKSPEED_BONUS() {
        return this.GetParentPlus().HasTalent("special_bonus_unique_brewmaster_custom_5") && this.bonus_attack_speed || 0
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        return this.bonus_attack_speed
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE)
    CC_GetModifierCriticalStrike(params: IModifierTable) {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            if (UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                if (GFuncMath.PRD(this.crit_chance, hCaster, "brewmaster_3")) {
                    // 音效
                    EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Brewmaster.Brawler.Crit", hCaster), hCaster)
                    return this.crit_multiplier
                }
            }
            return 0
        }
    }
}
