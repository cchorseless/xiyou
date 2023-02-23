
import { GameFunc } from "../../../../GameFunc";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tinker_march_of_the_machines = { "ID": "5152", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilitySound": "Hero_Tinker.March_of_the_Machines", "AbilityCastRange": "300", "AbilityCastPoint": "0.53 0.53 0.53 0.53", "AbilityCooldown": "35.0 35.0 35.0 35.0", "AbilityDamage": "0", "AbilityManaCost": "130 150 170 190", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "900" }, "02": { "var_type": "FIELD_INTEGER", "collision_radius": "50 50 50 50" }, "03": { "var_type": "FIELD_INTEGER", "splash_radius": "150 150 150 150" }, "04": { "var_type": "FIELD_FLOAT", "duration": "6.0", "LinkedSpecialBonus": "special_bonus_unique_tinker_5" }, "05": { "var_type": "FIELD_INTEGER", "speed": "400 400 400 400" }, "06": { "var_type": "FIELD_INTEGER", "machines_per_sec": "24" }, "07": { "var_type": "FIELD_INTEGER", "distance": "1800" }, "08": { "var_type": "FIELD_INTEGER", "distance_scepter": "1800" }, "09": { "var_type": "FIELD_INTEGER", "damage": "16 24 32 40", "LinkedSpecialBonus": "special_bonus_unique_tinker_2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_tinker_march_of_the_machines extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tinker_march_of_the_machines";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tinker_march_of_the_machines = Data_tinker_march_of_the_machines;
    Init() {
        this.SetDefaultSpecialValue("duration", 4);
        this.SetDefaultSpecialValue("spell_amplify_pct", 40);

    }

    Init_old() {
        this.SetDefaultSpecialValue("cooldown_tooltip", [7, 6, 5, 4, 3]);

    }



    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_tinker_custom_8")
    }

    GetManaCost(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_tinker_custom_5"
        let iManaCost = hCaster.HasTalent("special_bonus_unique_tinker_custom_5") && 0 || super.GetManaCost(iLevel)
        return iManaCost
    }
    Rearm() {
        let hCaster = this.GetCasterPlus()
        for (let i = 0; i <= hCaster.GetAbilityCount() - 1; i++) {
            let hAbility = hCaster.GetAbilityByIndex(i)
            if (hAbility && hAbility != this && hAbility.IsRefreshable()) {
                hAbility.EndCooldown()
                hAbility.RefreshCharges()
            }
        }

        for (let i = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1; i <= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_6; i++) {
            let hItem = hCaster.GetItemInSlot(i)
            if (hItem && hItem.IsRefreshable()) {
                hItem.EndCooldown()
                hItem.RefreshCharges()
            }
        }

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Tinker.Rearm", hCaster))
        // 魔晶
        if (hCaster.HasShard()) {
            let duration = this.GetSpecialValueFor("duration")
            modifier_tinker_3_spell_amplify.apply(hCaster, hCaster, this, { duration: duration })
        }
    }
    OnToggle() {
        if (this.GetToggleState()) {
            this.RefundManaCost()
            this.EndCooldown()
        }
    }
    ProcsMagicStick() {
        return false
    }
    GetIntrinsicModifierName() {
        return "modifier_tinker_3"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_tinker_3 extends BaseModifier_Plus {
    bUsing: any;
    bAnimation: boolean;
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
            this.bAnimation = false
            this.bUsing = false
            this.StartIntervalThink(0)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus() as ability3_tinker_march_of_the_machines
            if (!GameFunc.IsValid(hCaster) && !GameFunc.IsValid(hAbility)) {
                this.Destroy()
                return
            }

            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!this.bUsing) {
                if (hAbility.GetToggleState() && hAbility.IsAbilityReady()) {
                    hAbility.StartCooldown(-1)
                    hAbility.PayManaCost()
                    this.StartIntervalThink(math.max(hAbility.GetCooldownTimeRemaining() - 1.5, 0))
                    this.bUsing = true
                    this.bAnimation = true
                }
            } else {
                if (this.bAnimation) {
                    let iParticleID = ResHelper.CreateParticle({
                        resPath: "particles/units/heroes/hero_tinker/tinker_rearm.vpcf",
                        resNpc: hCaster,
                        iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                        owner: hCaster
                    });

                    ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", hCaster.GetAbsOrigin(), true)
                    ParticleManager.ReleaseParticleIndex(iParticleID)
                    hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Tinker.RearmStart", hCaster))
                    hCaster.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_TINKER_REARM3, 1.5 / hAbility.GetCooldownTimeRemaining())
                    this.StartIntervalThink(hAbility.GetCooldownTimeRemaining())

                    this.bAnimation = false
                    return
                }
                hAbility.Rearm()
                this.bUsing = false
                this.StartIntervalThink(0)
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    CC_GetModifierOutgoingDamagePercentage() {
        return this.GetParentPlus().GetTalentValue("special_bonus_unique_tinker_custom_7")
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_tinker_3_spell_amplify extends BaseModifier_Plus {
    spell_amplify_pct: number;
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
        this.spell_amplify_pct = this.GetSpecialValueFor("spell_amplify_pct")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    G_SPELL_AMPLIFY_BONUS() {
        return this.spell_amplify_pct
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.spell_amplify_pct
    }


}
