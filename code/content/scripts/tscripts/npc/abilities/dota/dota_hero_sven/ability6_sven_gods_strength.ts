
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_sven_gods_strength = { "ID": "5097", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Sven.GodsStrength", "AbilityCastAnimation": "ACT_DOTA_OVERRIDE_ABILITY_4", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0.3 0.3 0.3", "AbilityCooldown": "110", "AbilityDuration": "40.0", "AbilityManaCost": "100 150 200", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "gods_strength_damage": "120 160 200", "LinkedSpecialBonus": "special_bonus_unique_sven_2" } } };

@registerAbility()
export class ability6_sven_gods_strength extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "sven_gods_strength";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_sven_gods_strength = Data_sven_gods_strength;
    Init() {
        this.SetDefaultSpecialValue("gods_strength_damage", [200, 400, 600, 700, 800, 1000]);
        this.SetDefaultSpecialValue("gods_strength_bonus_str", [30, 45, 60, 75, 90, 105]);
        this.SetDefaultSpecialValue("attenuation_interval", 1);
        this.SetDefaultSpecialValue("attenuation_percent", 10);
        this.SetDefaultSpecialValue("duration", 10);
        this.SetDefaultSpecialValue("str_percent", 20);

    }

    Init_old() {
        this.SetDefaultSpecialValue("gods_strength_damage", [200, 400, 600, 700, 800, 1000]);
        this.SetDefaultSpecialValue("gods_strength_bonus_str", [30, 45, 60, 75, 90, 105]);
        this.SetDefaultSpecialValue("attenuation_interval", 1);
        this.SetDefaultSpecialValue("attenuation_percent", 10);
        this.SetDefaultSpecialValue("duration", 10);

    }


    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue('special_bonus_unique_sven_custom_5')
    }

    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")

        modifier_sven_6_buff.apply(caster, caster, this, { duration: duration })

        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_Sven.GodsStrength", caster))
    }

    GetIntrinsicModifierName() {
        return "modifier_sven_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_sven_6 extends BaseModifier_Plus {
    bonus_attack_range: number;
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
        super.OnCreated(params)
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    Init(params: IModifierTable) {
        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range")
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
            let range = caster.Script_GetAttackRange() + this.bonus_attack_range
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_sven_6_buff extends BaseModifier_Plus {
    gods_strength_damage: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    gods_strength_bonus_str: number;
    attenuation_interval: number;
    attenuation_percent: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_PERCENTAGE)
    str_percent: number;
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params)
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()

        if (!hCaster.HasTalent("special_bonus_unique_sven_custom_8")) {
            this.StartIntervalThink(this.attenuation_interval)
        }
        if (IsClient()) {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_sven/sven_spell_gods_strength.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.ReleaseParticleIndex(iPtclID)
            iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_sven/sven_spell_gods_strength_ambient.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iPtclID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iPtclID, 2, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_head", hParent.GetAbsOrigin(), true)
            this.AddParticle(iPtclID, false, false, -1, false, false)
            iPtclID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_gods_strength.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: hParent
            });

            this.AddParticle(iPtclID, false, true, 1000, false, false)
            iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_sven/sven_gods_strength_hero_effect.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: hParent
            });

            this.AddParticle(iPtclID, false, false, 100, true, false)
        }
    }
    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        this.gods_strength_damage = this.GetSpecialValueFor("gods_strength_damage")
        this.gods_strength_bonus_str = this.GetSpecialValueFor("gods_strength_bonus_str")
        this.attenuation_interval = this.GetSpecialValueFor("attenuation_interval")
        this.attenuation_percent = this.GetSpecialValueFor("attenuation_percent")
        this.str_percent = hParent.HasScepter() && this.GetSpecialValueFor("str_percent") || 0
    }
    OnIntervalThink() {
        let hParent = this.GetParentPlus()
        this.gods_strength_damage = this.gods_strength_damage - this.GetSpecialValueFor("gods_strength_damage") * this.attenuation_percent * 0.01
        this.gods_strength_bonus_str = this.gods_strength_bonus_str - this.GetSpecialValueFor("gods_strength_bonus_str") * this.attenuation_percent * 0.01
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    GetBaseDamageOutgoing_Percentage(params: any) {
        return this.gods_strength_damage
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    Get_AttackSound() {
        return ResHelper.GetSoundReplacement("Hero_Sven.GodsStrength.Attack", this.GetParentPlus())
    }

}
