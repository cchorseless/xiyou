import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_alchemist_unstable_concoction_throw = {
    ID: "5367",
    AbilityBehavior: "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_HIDDEN",
    AbilityUnitTargetTeam: "DOTA_UNIT_TARGET_TEAM_ENEMY",
    AbilityUnitTargetType: "DOTA_UNIT_TARGET_HERO",
    AbilityUnitTargetFlags: "DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO",
    SpellImmunityType: "SPELL_IMMUNITY_ENEMIES_NO",
    AbilityCastRange: "775",
    AbilityCastPoint: "0.2",
    AbilityCastAnimation: "ACT_INVALID",
    AbilityModifierSupportBonus: "120",
    AbilitySpecial: {
        "01": { var_type: "FIELD_FLOAT", brew_time: "5.0" },
        "02": { var_type: "FIELD_FLOAT", min_stun: "0.25" },
        "03": { var_type: "FIELD_FLOAT", max_stun: "1.75 2.5 3.25 4.0" },
        "04": { var_type: "FIELD_INTEGER", min_damage: "0" },
        "05": { var_type: "FIELD_INTEGER", max_damage: "150 220 290 360" },
        "06": { var_type: "FIELD_INTEGER", movement_speed: "900" },
        "07": { var_type: "FIELD_INTEGER", vision_range: "300" },
        "08": { var_type: "FIELD_INTEGER", midair_explosion_radius: "250" },
        "09": { var_type: "FIELD_FLOAT", brew_explosion: "7.0" },
    },
};

@registerAbility()
export class ability7_alchemist_unstable_concoction_throw extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "alchemist_unstable_concoction_throw";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_alchemist_unstable_concoction_throw = Data_alchemist_unstable_concoction_throw;


    CastFilterResultTarget(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerOwnerID();
        let gold_cost = this.GetSpecialValueFor("gold_cost");
        let iPlayerGold = 0;
        if (IsServer()) {
            if (!hTarget.IsBuilding()) {
                this.errorStr = "dota_hud_error_only_can_cast_on_building";
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            // iPlayerGold = PlayerData.GetGold(iPlayerID)
        } else {
            // iPlayerGold = PlayerDataClient.GetGold(iPlayerID)
        }
        if (iPlayerGold < gold_cost) {
            this.errorStr = "DOTA_Hud_NeedMoreGold";
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
        return super.CastFilterResultTarget(hTarget);
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let hTarget = this.GetCursorTarget();
        let iPlayerID = hCaster.GetPlayerOwnerID();
        let gold_cost = this.GetSpecialValueFor("gold_cost");
        let cd = this.GetSpecialValueFor("cd");

        // if ( PlayerData.GetGold(iPlayerID) >= gold_cost ) {
        //     hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Alchemist.UnstableConcoction.Throw", hCaster))

        //     ProjectileManager.CreateTrackingProjectile({
        //         Ability : this,
        //         vSourceLoc : hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_attack3")),
        //         iMoveSpeed : 900,
        //         EffectName : "particles/units/heroes/hero_alchemist/alchemist_berserk_potion_projectile.vpcf",
        //         Target : hTarget,
        //     })
        //     PlayerData.ModifyGold(iPlayerID, -gold_cost)
        //     this.StartCooldown(cd)
        // }
    }
    OnProjectileHit(hTarget: IBaseNpc_Plus, vLocation: Vector) {
        let hCaster = this.GetCasterPlus();

        EmitSoundOn(ResHelper.GetSoundReplacement("Hero_Alchemist.UnstableConcoction.Stun", hCaster), hTarget);
        hTarget.AddNewModifier(hCaster, this, "modifier_alchemist_4_buff_target", null);
        hCaster.AddNewModifier(hCaster, this, "modifier_alchemist_4_buff_caster", null);
    }
}

@registerModifier()
export class modifier_alchemist_4_buff_target extends BaseModifier_Plus {
    IsHidden() {
        return false;
    }
    IsDebuff() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    public bonus_all: number;
    Init(params: IModifierTable) {
        this.bonus_all = this.GetSpecialValueFor("bonus_all");
        if (IsServer()) {
            // this.ModifyStackCount(this.bonus_all);
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BONUS)
    CC_GetModifierBonusStats_All() {
        return this.GetStackCount();
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    OnTooltip() {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_alchemist_4_buff_caster extends BaseModifier_Plus {
    IsHidden() {
        return false;
    }
    IsDebuff() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    public spell_amp_stack: number;
    Init(params: IModifierTable) {
        this.spell_amp_stack = this.GetSpecialValueFor("spell_amp_stack");
        if (IsServer()) {
            // this.ModifyStackCount(this.spell_amp_stack);
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    CC_GetModifierSpellAmplifyBonus() {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    OnTooltip() {
        return this.GetStackCount();
    }
}
