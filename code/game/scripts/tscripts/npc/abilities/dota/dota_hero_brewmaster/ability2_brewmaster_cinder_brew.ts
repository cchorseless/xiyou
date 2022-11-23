import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
/** dota原技能数据 */
export const Data_brewmaster_cinder_brew = { "ID": "7310", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "FightRecapLevel": "1", "AbilitySound": "Hero_Brewmaster.DrunkenHaze.Cast", "AbilityCastPoint": "0.2", "AbilityCastRange": "850 850 850 850", "AbilityCooldown": "20 17 14 11", "AbilityManaCost": "50 60 70 80", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "5", "LinkedSpecialBonus": "special_bonus_unique_brewmaster_5", "LinkedSpecialBonusOperation": "SPECIAL_BONUS_MULTIPLY" }, "02": { "var_type": "FIELD_INTEGER", "total_damage": "75 150 225 300", "LinkedSpecialBonus": "special_bonus_unique_brewmaster_5", "LinkedSpecialBonusOperation": "SPECIAL_BONUS_MULTIPLY" }, "03": { "var_type": "FIELD_INTEGER", "movement_slow": "24 28 32 36" }, "04": { "var_type": "FIELD_INTEGER", "radius": "400" }, "05": { "var_type": "FIELD_FLOAT", "extra_duration": "3" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_brewmaster_cinder_brew extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "brewmaster_cinder_brew";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_brewmaster_cinder_brew = Data_brewmaster_cinder_brew;
    Init() {
        this.SetDefaultSpecialValue("radius", 500);
        this.SetDefaultSpecialValue("damage", [700, 900, 1100, 1300, 1500, 1700]);
        this.SetDefaultSpecialValue("duration", 4);
        this.SetDefaultSpecialValue("attack_bonus_damage", [2.0, 2.5, 3.0, 3.5, 4.0, 5.0]);
        this.SetDefaultSpecialValue("magic_armor", 18);

    }



    GetAOERadius() {
        let hCaster = this.GetCasterPlus()
        return this.GetSpecialValueFor("radius") + hCaster.GetTalentValue("special_bonus_unique_brewmaster_custom_4")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let radius = this.GetSpecialValueFor("radius") + hCaster.GetTalentValue("special_bonus_unique_brewmaster_custom_4")
        let duration = this.GetSpecialValueFor("duration")
        // 特效
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_brewmaster/brewmaster_cinder_brew_cast.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT, "attach_mouth", hCaster.GetAbsOrigin(), true)
        ParticleManager.SetParticleControl(iParticleID, 1, vPosition)
        ParticleManager.SetParticleControl(iParticleID, 4, Vector(radius, radius, radius))
        ParticleManager.ReleaseParticleIndex(iParticleID)
        // 音效
        EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Brewmaster.CinderBrew.Cast", hCaster), hCaster)
        EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_Brewmaster.CinderBrew", hCaster), hCaster)
        //  效果
        let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), vPosition, null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
        for (let hTarget of (tTarget)) {

            if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                modifier_brewmaster_2_debuff.apply(hTarget, hCaster, this, { duration: duration })
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_brewmaster_2"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_brewmaster_2 extends BaseModifier_Plus {
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

            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)

            //  施法命令
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
// Modifiers
@registerModifier()
export class modifier_brewmaster_2_debuff extends BaseModifier_Plus {
    attack_bonus_damage: number;
    damage: number;
    magic_armor: number;
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
            this.StartIntervalThink(1)
        } else {
            let iParticle = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_brewmaster_cinder_brew.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticle, false, true, 10, false, false)
        }
    }
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.damage = this.GetSpecialValueFor("damage")
        this.attack_bonus_damage = this.GetSpecialValueFor("attack_bonus_damage") + hCaster.GetTalentValue("special_bonus_unique_brewmaster_custom_1")
        this.magic_armor = this.GetSpecialValueFor("magic_armor")
        if (IsServer()) {
            // let hAbility_t29 = qualification_build_t29.findIn(hCaster)
            // if (GameFunc.IsValid(hAbility_t29) && hAbility_t29.GetLevel() >= 1) {
            //     this.SetStackCount(1)
            // }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
                return
            }
            let fDamage = this.damage + hCaster.GetAverageTrueAttackDamage(null) * this.attack_bonus_damage
            let damage_table =
            {
                ability: hAbility,
                attacker: hCaster,
                victim: hParent,
                damage: fDamage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)

    On_Tooltip() {
        if (this.GetStackCount() == 1) {
            return this.magic_armor
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    G_MAGICAL_ARMOR_BONUS() {
        return (this.GetStackCount() == 1) && -this.magic_armor || 0
    }
}
