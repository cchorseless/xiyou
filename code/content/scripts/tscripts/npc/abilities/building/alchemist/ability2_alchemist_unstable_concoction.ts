import { GameFunc } from "../../../../GameFunc";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_alchemist_unstable_concoction = {
    ID: "5366",
    AbilityBehavior: "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE",
    AbilityUnitDamageType: "DAMAGE_TYPE_PHYSICAL",
    SpellImmunityType: "SPELL_IMMUNITY_ENEMIES_NO",
    SpellDispellableType: "SPELL_DISPELLABLE_YES_STRONG",
    FightRecapLevel: "1",
    AbilitySound: "Hero_Alchemist.UnstableConcoction.Fuse",
    AbilityCastRange: "775",
    AbilityCastPoint: "0.0",
    AbilityCooldown: "16",
    AbilityManaCost: "90 100 110 120",
    AbilitySpecial: {
        "01": { var_type: "FIELD_FLOAT", brew_time: "5.0" },
        "02": { var_type: "FIELD_FLOAT", brew_explosion: "5.5" },
        "03": { var_type: "FIELD_FLOAT", min_stun: "0.25" },
        "04": { var_type: "FIELD_FLOAT", max_stun: "1.75 2.5 3.25 4.0" },
        "05": { var_type: "FIELD_INTEGER", min_damage: "0" },
        "06": { var_type: "FIELD_INTEGER", max_damage: "150 220 290 360", LinkedSpecialBonus: "special_bonus_unique_alchemist_2" },
        "07": { var_type: "FIELD_INTEGER", radius: "250" },
    },
    AbilityCastAnimation: "ACT_DOTA_CAST_ABILITY_2",
};

@registerAbility()
export class ability2_alchemist_unstable_concoction extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "alchemist_unstable_concoction";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_alchemist_unstable_concoction = Data_alchemist_unstable_concoction;


    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius");
    }
    GetCooldown(iLevel: number) {
        return this.GetSpecialValueFor("cd");
    }
    GetManaCost(iLevel: number) {
        return this.GetSpecialValueFor("mana_cost");
    }
    GetBehavior() {
        // if (AbilityUpgrades.HasAbilityMechanicsUpgrade(this.GetCasterPlus(), this.GetAbilityName(), "active")) {
        //     return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE;
        // }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE;
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let iPlayerID = hCaster.GetPlayerOwnerID();
        let hPlayer = hCaster.GetPlayerOwner();
        let radius = this.GetSpecialValueFor("radius");
        let percent = this.GetSpecialValueFor("percent") / 100;

        let tTargets = FindUnitsInRadius(
            hCaster.GetTeamNumber(),
            hCaster.GetAbsOrigin(),
            null,
            radius,
            this.GetAbilityTargetTeam(),
            this.GetAbilityTargetType(),
            this.GetAbilityTargetFlags(),
            FindOrder.FIND_ANY_ORDER,
            false
        );
        // for (let hUnit of tTargets) {
        //     let iGold = (hUnit.__kill_gold || 0) * percent;
        //     if (iGold > 0 && !Rounds.IsEndlessRound()) {
        //         PlayerData.ModifyGold(iPlayerID, iGold, true);
        //         SendOverheadEventMessage(hPlayer, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, hUnit, iGold, null);
        //     }
        //     hCaster.Attack(hUnit, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK);
        // }
    }
    GetIntrinsicModifierName() {
        return "modifier_alchemist_2";
    }
    OnUpgrade() {
        if (this.GetLevel() == 1) {
            this.ToggleAutoCast();
        }
    }
}

@registerModifier()
export class modifier_alchemist_2 extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    public damage_pct: number;
    public duration: number;
    public death_radius: number;
    Init(params: ModifierTable) {
        this.damage_pct = this.GetSpecialValueFor("damage_pct");
        this.duration = this.GetSpecialValueFor("duration");
        this.OnAbilityUpgradesUpdated();
    }

    // @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_UPGRADES_UPDATED)
    OnAbilityUpgradesUpdated() {
        this.death_radius = this.GetSpecialValueFor("death_radius");
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierTable) {
        let hAbility = this.GetAbilityPlus();
        let hParent = this.GetParentPlus();
        let hTarget = params.target;
        if (!GameFunc.IsValid(hAbility) || hParent.PassivesDisabled() || !GameFunc.IsValid(hTarget) || hTarget.GetClassname() == "dota_item_drop") {
            return;
        }

        // let fDamage = this.GetSpecialValueFor("damage") * (1 + (hParent.GetStackCount("modifier_alchemist_2_buff", hParent) * this.damage_pct) / 100);
        // BattleHelper.GoApplyDamage({
        //     ability: hAbility,
        //     attacker: this.GetCasterPlus(),
        //     victim: hTarget,
        //     damage: fDamage,
        //     damage_type: hAbility.GetAbilityDamageType(),
        // });
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    OnDeath(params: ModifierTable) {
        let hAttacker = params.attacker;
        let hKilled = params.unit;
        let hParent = this.GetParentPlus();
        let hAbility = this.GetAbilityPlus();

        if (!GameFunc.IsValid(hAbility)) {
            return;
        }

        if (GameFunc.IsValid(hAttacker) && hAttacker.GetTeamNumber() != hKilled.GetTeamNumber()) {
            let hSource = hAttacker.GetSource();
            if (hSource == hParent || (this.death_radius > 0 && CalcDistanceBetweenEntityOBB(hKilled, hParent) <= this.death_radius)) {
                hParent.AddNewModifier(hParent, hAbility, "modifier_alchemist_2_buff", { duration: this.duration });
            }
        }
    }
}

@registerModifier()
export class modifier_alchemist_2_buff extends BaseModifier_Plus {
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
    public bonus_gold_stacking: number;
    public max_count: number;
    Init(params: ModifierTable) {
        this.bonus_gold_stacking = this.GetSpecialValueFor("bonus_gold_stacking");
        this.max_count = this.GetSpecialValueFor("max_count");
        if (IsServer()) {
            this.GiveGold();
        }
    }

    GiveGold() {
        let hParent = this.GetParentPlus();
        let iPlayerID = hParent.GetPlayerOwnerID();
        let iNewCount = math.min(this.max_count, this.GetStackCount() + 1);
        this.SetStackCount(iNewCount);
        // if (Rounds.IsEndlessRound()) {
        //     return;
        // }
        // let iGold = this.bonus_gold_stacking * iNewCount;
        // PlayerData.ModifyGold(iPlayerID, iGold, true);
        // SendOverheadEventMessage(hParent.GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, hParent, iGold, null);
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    OnTooltip() {
        return this.bonus_gold_stacking * this.GetStackCount();
    }
}
