import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_bloodseeker_blood_bath = { "ID": "5016", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "hero_bloodseeker.bloodRite", "AbilityCastRange": "1500", "AbilityCastPoint": "0.3", "AbilityCooldown": "15 14 13 12", "AbilityManaCost": "90 100 110 120", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "600" }, "02": { "var_type": "FIELD_FLOAT", "silence_duration": "3 4 5 6" }, "03": { "var_type": "FIELD_INTEGER", "damage": "120 160 200 240", "LinkedSpecialBonus": "special_bonus_unique_bloodseeker_2" }, "04": { "var_type": "FIELD_FLOAT", "delay": "2.6" }, "05": { "var_type": "FIELD_FLOAT", "delay_plus_castpoint_tooltip": "2.9" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_bloodseeker_blood_bath extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bloodseeker_blood_bath";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bloodseeker_blood_bath = Data_bloodseeker_blood_bath;
    Init() {
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("land_time", 1.2);
        this.SetDefaultSpecialValue("damage", [1000, 2000, 3000, 4000, 5000, 6000]);
        this.SetDefaultSpecialValue("agi_damage_factor", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("silence_duration", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("bleed_amplify_damage_pct", [10, 20, 30, 40, 50, 60]);
        this.SetDefaultSpecialValue("bleed_amplify_damage_duration", 5);

    }




    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_bloodseeker_custom_1")
    }

    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let radius = this.GetSpecialValueFor("radius")
        let land_time = this.GetSpecialValueFor("land_time")
        let silence_duration = this.GetSpecialValueFor("silence_duration")
        let damage = this.GetSpecialValueFor("damage")
        let bleed_amplify_damage_duration = this.GetSpecialValueFor("bleed_amplify_damage_duration")
        let agi_damage_factor = this.GetSpecialValueFor("agi_damage_factor") + hCaster.GetTalentValue("special_bonus_unique_bloodseeker_custom_3")
        // 音效
        EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("hero_bloodseeker.bloodRite", hCaster), hCaster)
        // 特效
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_bloodseeker/bloodseeker_spell_bloodbath_bubbles.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControl(iParticleID, 0, vPosition)
        ParticleManager.SetParticleControl(iParticleID, 1, Vector(radius, radius, radius))
        this.addTimer(land_time, () => {
            ParticleManager.DestroyParticle(iParticleID, false)
            // 音效
            EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("hero_bloodseeker.bloodRite.silence", hCaster), hCaster)
            let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), vPosition, null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            let fDamage = damage + hCaster.GetAgility() * agi_damage_factor
            for (let hTarget of (tTarget)) {

                if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                    let damage_table =
                    {
                        ability: this,
                        attacker: hCaster,
                        victim: hTarget,
                        damage: fDamage,
                        damage_type: this.GetAbilityDamageType()
                    }
                    // 伤害
                    BattleHelper.GoApplyDamage(damage_table)
                    // 沉默
                    modifier_bloodseeker_2_silence.apply(hTarget, hCaster, this, { duration: silence_duration })
                    // 单位受到的流血伤害提升
                    modifier_bloodseeker_2_bleed_damage_amplify.apply(hTarget, hCaster, this, { duration: bleed_amplify_damage_duration })
                }
            }
        })
    }

    GetIntrinsicModifierName() {
        return "modifier_bloodseeker_2"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bloodseeker_2 extends BaseModifier_Plus {
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
export class modifier_bloodseeker_2_silence extends BaseModifier_Plus {
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
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let iParticleID2 = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_silenced.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID2, false, false, -1, false, true)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bloodseeker_2_bleed_damage_amplify extends BaseModifier_Plus {
    bleed_amplify_damage_pct: number;
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
    Init(params: IModifierTable) {
        this.bleed_amplify_damage_pct = this.GetSpecialValueFor("bleed_amplify_damage_pct")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_BLEED_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingBleedDamagePercentage() {
        return this.bleed_amplify_damage_pct
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.bleed_amplify_damage_pct
    }
}
