
import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_phantom_assassin_blur = { "ID": "5192", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "HasScepterUpgrade": "1", "AbilityCooldown": "60 55 50 45", "AbilityCastRange": "600", "AbilityCastPoint": "0.4", "AbilityManaCost": "50", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_evasion": "15 25 35 45", "LinkedSpecialBonus": "special_bonus_unique_phantom_assassin_3" }, "02": { "var_type": "FIELD_FLOAT", "duration": "25" }, "03": { "var_type": "FIELD_INTEGER", "radius": "600" }, "04": { "var_type": "FIELD_FLOAT", "fade_duration": "0.5" }, "05": { "var_type": "FIELD_INTEGER", "scepter_cooldown": "10", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_phantom_assassin_blur extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phantom_assassin_blur";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phantom_assassin_blur = Data_phantom_assassin_blur;
    Init() {
                this.SetDefaultSpecialValue("blur_count", [15,20,25,30,40]);
        this.SetDefaultSpecialValue("blur_duration", 10);
        this.SetDefaultSpecialValue("cast_point_percent", [50,60,70,80,90]);

        }

    Init_old() {
                this.SetDefaultSpecialValue("blur_count", [15,20,25,30,40]);
        this.SetDefaultSpecialValue("blur_duration", 10);
        this.SetDefaultSpecialValue("cast_point_percent", [50,60,70,80,90]);

        }



    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let blur_duration = this.GetSpecialValueFor("blur_duration")
        let blur_count = this.GetSpecialValueFor("blur_count")
        if (hCaster.HasTalent("special_bonus_unique_phantom_assassin_custom_6")) {
            blur_count = blur_count + hCaster.GetTalentValue("special_bonus_unique_phantom_assassin_custom_6")
        }
         modifier_phantom_assassin_3_blur_attack.apply( hCaster , hCaster, this, { duration: blur_duration, blur_count: blur_count }) 
    }
    GetIntrinsicModifierName() {
        return "modifier_phantom_assassin_3"
    }


}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_phantom_assassin_3 extends BaseModifier_Plus {
    cast_point_percent: number;
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
    Init(params: ModifierTable) {
        this.cast_point_percent = this.GetSpecialValueFor("cast_point_percent")
        if (params.IsOnCreated && IsServer()) {
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
            ExecuteOrderFromTable(
                {
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                }
            )
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.CASTTIME_PERCENTAGE)
    GetPercentageCasttime(params: ModifierTable) {
        return this.cast_point_percent
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_phantom_assassin_3_blur_attack// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_phantom_assassin_3_blur_attack extends BaseModifier_Plus {
    GetTexture() {
        return ResHelper.GetAbilityTextureReplacement("phantom_assassin_blur", this.GetCasterPlus())
    }
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
    Init(params: ModifierTable) {
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            let iStackCount = (params.blur_count || 0)
            this.changeStackCount(iStackCount)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-iStackCount)
            })
        } else {
            if (params.IsOnCreated) {
                let sParticlePath = ResHelper.GetParticleReplacement("particles/units/heroes/hero_phantom_assassin/phantom_assassin_active_blur.vpcf", hParent)
                let iParticleID = ResHelper.CreateParticle({
                    resPath: sParticlePath,
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: hParent
                });

                ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
                this.AddParticle(iParticleID, false, false, -1, false, false)
            }
        }
    }

    OnStackCountChanged(iOldCount: number) {
        if (this.GetStackCount() <= 0) {
            this.Destroy()
        }
    }
}
