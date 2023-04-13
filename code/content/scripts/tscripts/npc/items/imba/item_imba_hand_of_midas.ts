
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 迈达斯之手
@registerAbility()
export class item_imba_hand_of_midas extends BaseItem_Plus {

    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (target.GetTeamNumber() == caster.GetTeamNumber()) {
                return UnitFilterResult.UF_FAIL_FRIENDLY;
            }
            if (target.IsRealUnit()) {
                return UnitFilterResult.UF_FAIL_HERO;
            }
            if (target.IsOther()) {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            if (target.GetUnitName().includes("necronomicon")) {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            if (target.IsConsideredHero()) {
                return UnitFilterResult.UF_FAIL_CONSIDERED_HERO;
            }
            if (target.IsBuilding()) {
                return UnitFilterResult.UF_FAIL_BUILDING;
            }
            return UnitFilterResult.UF_SUCCESS;
        }
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (target.IsOther()) {
                return "#dota_hud_error_cant_use_on_wards";
            }
            if (target.GetUnitName().includes("necronomicon")) {
                return "#dota_hud_error_cant_use_on_necrobook";
            }
        }
    }
    GetAbilityTextureName(): string {
        let caster = this.GetCasterPlus();
        let caster_name = caster.GetUnitName();
        let animal_heroes: { [k: string]: boolean } = {
            ["brewmaster"]: true,
            ["magnataur"]: true,
            ["lone_druid"]: true,
            ["lone_druid_bear1"]: true,
            ["lone_druid_bear2"]: true,
            ["lone_druid_bear3"]: true,
            ["lone_druid_bear4"]: true,
            ["lone_druid_bear5"]: true,
            ["lone_druid_bear6"]: true,
            ["lone_druid_bear7"]: true,
            ["broodmother"]: true,
            ["lycan"]: true,
            ["ursa"]: true,
            ["malfurion"]: true
        }
        for (let [k, v] of GameFunc.Pair(animal_heroes)) {
            if (caster_name.includes(k)) {
                return "item_paw_of_midas";
            }
        }
        return "imba_hand_of_midas";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let ability = this;
        let sound_cast = "DOTA_Item.Hand_Of_Midas";
        let bonus_gold = ability.GetSpecialValueFor("bonus_gold");
        let xp_multiplier = ability.GetSpecialValueFor("xp_multiplier");
        let passive_gold_bonus = ability.GetSpecialValueFor("passive_gold_bonus");
        let bonus_xp = target.GetDeathXP();
        // let custom_xp_bonus = tonumber(CustomNetTables.GetTableValue("game_options", "exp_multiplier")["1"]);
        // bonus_xp = bonus_xp * xp_multiplier * (custom_xp_bonus / 100);
        // let custom_gold_bonus = tonumber(CustomNetTables.GetTableValue("game_options", "bounty_multiplier")["1"]);
        // bonus_gold = bonus_gold * (custom_gold_bonus / 100);
        bonus_gold = bonus_gold * (100 / 100);
        target.EmitSound(sound_cast);
        SendOverheadEventMessage(PlayerResource.GetPlayer(caster.GetPlayerID()), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, target, bonus_gold, undefined);
        let midas_particle = ResHelper.CreateParticleEx("particles/items2_fx/hand_of_midas.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.SetParticleControlEnt(midas_particle, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), false);
        target.SetDeathXP(0);
        target.SetMinimumGoldBounty(0);
        target.SetMaximumGoldBounty(0);
        target.Kill(ability, caster);
        if (!caster.IsRealUnit()) {
            caster = caster.GetPlayerOwner().GetAssignedHero();
        }
        // caster.AddExperience(bonus_xp, false, false);
        // caster.ModifyGold(bonus_gold, true, 0);
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_hand_of_midas";
    }
}
@registerModifier()
export class modifier_item_imba_hand_of_midas extends BaseModifier_Plus {

    IsPurgable(): boolean {
        return false;
    }

    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        let ability = this.GetItemPlus();
        let bonus_attack_speed;
        if (ability) {
            bonus_attack_speed = ability.GetSpecialValueFor("bonus_attack_speed");
        }
        return bonus_attack_speed;
    }
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
