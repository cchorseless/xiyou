import { GameFunc } from "../../../../GameFunc";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";


@registerAbility()
export class t14_greed extends BaseAbility_Plus {

    GetIntrinsicModifierName() {
        return "modifier_t14_greed"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t14_greed extends BaseModifier_Plus {
    trigger_chance: number;
    duration: number;
    IsHidden() {
        return (this.GetStackCount() == 0)
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
        this.trigger_chance = this.GetSpecialValueFor("trigger_chance")
        this.duration = this.GetSpecialValueFor("duration")
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (IsServer()) {
            if (params.attacker != this.GetCasterPlus()) {
                return
            }
            let hAbility = this.GetAbilityPlus()
            let hCaster = this.GetCasterPlus()
            if (hCaster.IsIllusion()) {
                return
            }
            if (hAbility.IsCooldownReady()) {
                if (GameFunc.mathUtil.PRD(this.trigger_chance, hCaster, "t14_greed")) {
                    hAbility.UseResources(true, true, true)
                    // let combination_t14_cooperate  = combination_t14_cooperate.findIn(  hCaster )
                    // let has_combination_t14_cooperate = GameFunc.IsValid(combination_t14_cooperate) && combination_t14_cooperate.IsActivated()
                    // if (has_combination_t14_cooperate && GameFunc.mathUtil.PRD(combination_t14_cooperate, combination_t14_cooperate.GetSpecialValueFor("chance"), "cooperate_chance")) {
                    //     let index_target = combination_t14_cooperate.GetCooperateTargetIndex()
                    //     if (index_target) {
                    //         let target = EntIndexToHScript(index_target)
                    //         if (GameFunc.IsValid(target)) {
                    //              modifier_t14_greed_buff.apply( target , hCaster, hAbility, { duration = this.duration })
                    //         }
                    //     }
                    // }
                    hCaster.EmitSound("coins_wager.x1")
                    modifier_t14_greed_buff.apply(hCaster, hCaster, hAbility, { duration: this.duration })
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t14_greed_buff extends BaseModifier_Plus {
    attackspeed_bonus: number;
    max_gold_bonus: number;
    min_gold_bonus: number;
    gold_chance: number;
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
        super.OnCreated(params);
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/t14_greed_buff.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.GetParentPlus().GetModelRadius(), 1, 1))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.attackspeed_bonus = this.GetSpecialValueFor("attackspeed_bonus")
        this.max_gold_bonus = this.GetSpecialValueFor("max_gold_bonus")
        this.min_gold_bonus = this.GetSpecialValueFor("min_gold_bonus")
        this.gold_chance = this.GetSpecialValueFor("gold_chance")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: IModifierTable) {
        return this.attackspeed_bonus
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus()) {
            if (!GameFunc.IsValid(this.GetCasterPlus())) {
                return
            }
            if (UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                let hAbility = this.GetAbilityPlus()
                let hCaster = params.attacker
                let hTarget = params.target
                // if (Spawner.IsEndless()) {
                //     return
                // }
                if (GameFunc.mathUtil.PRD(this.gold_chance, hCaster, "gold_chance")) {
                    let gold_bonus = RandomInt(this.min_gold_bonus, this.max_gold_bonus)

                    let _modifier_t14_greed = modifier_t14_greed.findIn(this.GetCasterPlus()) as modifier_t14_greed;
                    if (GameFunc.IsValid(_modifier_t14_greed)) {
                        _modifier_t14_greed.SetStackCount(_modifier_t14_greed.GetStackCount() + gold_bonus)
                    }
                    // PlayerData.ModifyGold(hCaster.GetPlayerOwnerID(), gold_bonus, true)
                    SendOverheadEventMessage(hCaster.GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, hTarget, gold_bonus, null)
                }
            }
        }
    }
}