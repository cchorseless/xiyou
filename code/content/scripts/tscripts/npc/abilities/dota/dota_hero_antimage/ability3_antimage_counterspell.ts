
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_antimage_counterspell = { "ID": "7314", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilityCastRange": "0", "AbilityCastPoint": "0 0 0 0", "AbilityCooldown": "15 11 7 3", "AbilityManaCost": "45 50 55 60", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "magic_resistance": "15 25 35 45", "LinkedSpecialBonus": "special_bonus_unique_antimage_4" }, "02": { "var_type": "FIELD_FLOAT", "duration": "1.2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3", "AbilityCastGestureSlot": "DEFAULT" };

@registerAbility()
export class ability3_antimage_counterspell extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "antimage_counterspell";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_antimage_counterspell = Data_antimage_counterspell;
    Init() {
        this.SetDefaultSpecialValue("radius", 500);
        this.SetDefaultSpecialValue("mana_percent", [20, 40, 60, 80, 100]);
        this.SetDefaultSpecialValue("duration", 5);

    }






}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_antimage_3_buff extends BaseModifier_Plus {
    IsHidden() {
        return this.GetStackCount() == 0 || this.GetCasterPlus() == this.GetParentPlus()
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
    GetTexture() {
        return "antimage_counterspell"
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        if (!IsValid(hCaster)) {
            return
        }
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            let fMana = (params.total_burn_mana || 0)
            this.changeStackCount(fMana)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-fMana)
            })
        }
        else if (params.IsOnCreated) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_antimage/antimage_counter.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), false)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(100, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(params: IModifierTable) {
        if (this.GetCasterPlus() == this.GetParentPlus()) {
            return 0
        }
        return this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        if (this.GetCasterPlus() == this.GetParentPlus()) {
            return 0
        }
        return this.GetStackCount()
    }
}
