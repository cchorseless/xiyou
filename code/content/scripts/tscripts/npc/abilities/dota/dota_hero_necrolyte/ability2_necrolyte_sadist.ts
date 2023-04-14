import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
/** dota原技能数据 */
export const Data_necrolyte_sadist = { "ID": "5160", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilitySound": "Hero_Necrolyte.SpiritForm.Cast", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "HasScepterUpgrade": "1", "AbilityCastPoint": "0", "AbilityCooldown": "28 24 20 16", "AbilityManaCost": "50", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "3 3.5 4 4.5" }, "02": { "var_type": "FIELD_INTEGER", "heal_bonus": "75" }, "03": { "var_type": "FIELD_INTEGER", "movement_speed": "12 16 20 24", "LinkedSpecialBonus": "special_bonus_unique_necrophos_3" }, "04": { "var_type": "FIELD_INTEGER", "slow_aoe": "750" }, "05": { "var_type": "FIELD_INTEGER", "bonus_damage": "-40" }, "06": { "var_type": "FIELD_INTEGER", "cooldown_scepter": "10", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_necrolyte_sadist extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "necrolyte_sadist";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_necrolyte_sadist = Data_necrolyte_sadist;
    Init() {
        this.SetDefaultSpecialValue("radius", 1000);
        this.SetDefaultSpecialValue("duration", [3, 3.5, 4, 4.5, 5, 5.5]);
        this.SetDefaultSpecialValue("bonus_health_mana", [2, 4, 6, 8, 10, 12]);
        this.SetDefaultSpecialValue("movement_speed", [30, 36, 42, 48, 54, 60]);
        this.SetDefaultSpecialValue("bonus_magical_damage", [20, 22, 24, 26, 28, 30]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("radius", 1000);
        this.SetDefaultSpecialValue("duration", [3, 3.5, 4, 4.5, 5, 5.5]);
        this.SetDefaultSpecialValue("bonus_health_mana", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("movement_speed", [30, 36, 42, 48, 54, 60]);
        this.SetDefaultSpecialValue("bonus_magical_damage", [20, 22, 24, 26, 28, 30]);

    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        modifier_necrolyte_2_slow_aura.apply(hCaster, hCaster, this, { duration: duration })
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Necrolyte.SpiritForm.Cast", hCaster))
    }

    GetIntrinsicModifierName() {
        return "modifier_necrolyte_2"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_necrolyte_2 extends BaseModifier_Plus {
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
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()

            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!hAbility.GetAutoCastState()) {
                return
            }

            if (!hAbility.IsAbilityReady()) {
                return
            }

            let range = this.GetAbilityPlus().GetCastRange(hCaster.GetAbsOrigin(), hCaster)
            let teamFilter = hAbility.GetAbilityTargetTeam()
            let typeFilter = hAbility.GetAbilityTargetType()
            let flagFilter = hAbility.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: hAbility.entindex()
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_necrolyte_2_slow_aura extends BaseModifier_Plus {
    bonus_magical_damage: any;
    radius: any;
    bonus_health_mana: number;
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
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    IsAura() {
        return true
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAura() {
        return "modifier_necrolyte_2_slow_debuff"
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        this.radius = this.GetSpecialValueFor("radius")
        this.bonus_health_mana = this.GetSpecialValueFor("bonus_health_mana")
        this.bonus_magical_damage = this.GetSpecialValueFor("bonus_magical_damage") + hCaster.GetTalentValue("special_bonus_unique_necrolyte_custom_8")

        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_necrolyte_spirit.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_necrolyte/necrolyte_spirit.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_MAGICAL_DAMAGE_PERCENTAGE)
    G_OUTGOING_MAGICAL_DAMAGE_PERCENTAGE() {
        return this.bonus_magical_damage
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    ON_DEATH(params: ModifierInstanceEvent) {
        let hAttacker = params.attacker as IBaseNpc_Plus
        if (IsValid(hAttacker) && hAttacker.GetUnitLabel() != "builder") {
            if (hAttacker.GetTeamNumber() == params.unit.GetTeamNumber()) {
                return
            }
            hAttacker = hAttacker.GetSource()
            // if (IsValid(hAttacker) && hAttacker == this.GetParentPlus() && !hAttacker.IsIllusion() && !Spawner.IsEndless()) {
            // let factor = params.unit.IsConsideredHero() && 5 || 1
            //  modifier_bonus_health.apply( hAttacker , hAttacker, hAttacker.GetDummyAbility(), { bonus_health=this.bonus_health_mana * factor })
            //  modifier_bonus_mana.apply( hAttacker , hAttacker, hAttacker.GetDummyAbility(), { bonus_mana=this.bonus_health_mana * factor })
            // }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.bonus_magical_damage
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_necrolyte_2_slow_debuff extends BaseModifier_Plus {
    movement_speed: number;
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
        this.movement_speed = this.GetSpecialValueFor("movement_speed")
        if (IsClient() && params.IsOnCreated) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_necrolyte/necrolyte_spirit_debuff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.movement_speed
    }
}
